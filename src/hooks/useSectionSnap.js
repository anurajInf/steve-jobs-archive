import { useEffect, useRef, useState, useCallback } from 'react';
import springPhysicsService, { SPRING_PRESETS } from '../services/springPhysicsService';

/**
 * useSectionSnap Hook
 * 
 * Implements intelligent section-based scrolling with spring physics:
 * 1. Sections that fit in viewport → snap immediately
 * 2. Sections taller than viewport → scroll normally within section
 * 3. After reaching section end → spring transition to next section
 * 
 * Features:
 * - Spring-loaded transitions between sections
 * - Normal scrolling within tall sections
 * - Automatic section detection
 * - Configurable spring physics
 */
const useSectionSnap = ({
  containerRef,
  sectionSelector = '[data-section]',
  springConfig = SPRING_PRESETS.SMOOTH,
  snapThreshold = 0.3, // 30% of section height triggers snap
  enabled = true,
} = {}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const [sections, setSections] = useState([]);
  
  const scrollStateRef = useRef({
    lastScrollY: 0,
    scrollDirection: 'down',
    isUserScrolling: false,
    userScrollTimeout: null,
    currentSection: null,
    sectionProgress: 0,
  });

  // Detect and measure all sections
  const measureSections = useCallback(() => {
    if (!containerRef?.current) return [];
    
    const sectionElements = containerRef.current.querySelectorAll(sectionSelector);
    const viewportHeight = window.innerHeight;
    
    const measured = Array.from(sectionElements).map((el, index) => {
      const rect = el.getBoundingClientRect();
      const offsetTop = el.offsetTop;
      const height = el.offsetHeight;
      
      return {
        index,
        element: el,
        offsetTop,
        height,
        isTall: height > viewportHeight, // Taller than viewport
        snapStart: offsetTop,
        snapEnd: offsetTop + height,
      };
    });
    
    setSections(measured);
    return measured;
  }, [containerRef, sectionSelector]);

  // Initialize sections
  useEffect(() => {
    if (!enabled) return;
    
    measureSections();
    
    // Remeasure on resize
    const handleResize = () => {
      measureSections();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enabled, measureSections]);

  // Get current section based on scroll position
  const getCurrentSection = useCallback((scrollY) => {
    const viewportHeight = window.innerHeight;
    const viewportCenter = scrollY + viewportHeight / 2;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      if (viewportCenter >= section.snapStart && viewportCenter < section.snapEnd) {
        // Calculate progress within section
        const progress = (viewportCenter - section.snapStart) / section.height;
        
        return {
          section,
          index: i,
          progress: Math.max(0, Math.min(1, progress)),
        };
      }
    }
    
    // Default to last section if past all
    if (sections.length > 0) {
      return {
        section: sections[sections.length - 1],
        index: sections.length - 1,
        progress: 1,
      };
    }
    
    return null;
  }, [sections]);

  // Snap to a specific section with spring physics
  const snapToSection = useCallback((sectionIndex, align = 'start') => {
    if (!sections[sectionIndex] || isSnapping) return;
    
    const section = sections[sectionIndex];
    const viewportHeight = window.innerHeight;
    
    let targetScroll;
    
    if (align === 'start') {
      targetScroll = section.snapStart;
    } else if (align === 'center') {
      targetScroll = section.snapStart + (section.height - viewportHeight) / 2;
    } else if (align === 'end') {
      targetScroll = section.snapEnd - viewportHeight;
    }
    
    // Clamp to valid scroll range
    const maxScroll = document.documentElement.scrollHeight - viewportHeight;
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    
    setIsSnapping(true);
    setCurrentSectionIndex(sectionIndex);
    
    // Use spring physics for smooth transition
    const springId = 'section-snap';
    
    if (!springPhysicsService.getSpring(springId)) {
      springPhysicsService.createSpring(
        springId,
        window.scrollY,
        targetScroll,
        springConfig.k,
        springConfig.c
      );
    } else {
      springPhysicsService.updateTarget(springId, targetScroll);
    }

    // Subscribe to spring updates
    let animationFrame;
    const updateScroll = () => {
      const spring = springPhysicsService.getSpring(springId);
      
      if (spring) {
        window.scrollTo(0, spring.value);
        
        // Check if settled
        if (spring.isSettled) {
          setIsSnapping(false);
          springPhysicsService.removeSpring(springId);
        } else {
          animationFrame = requestAnimationFrame(updateScroll);
        }
      }
    };

    // Start animation loop if not running
    if (!springPhysicsService.isRunning) {
      springPhysicsService.startLoop();
    }
    
    updateScroll();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [sections, isSnapping, springConfig]);

  // Handle scroll events
  useEffect(() => {
    if (!enabled || sections.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const state = scrollStateRef.current;
      
      // Determine scroll direction
      state.scrollDirection = scrollY > state.lastScrollY ? 'down' : 'up';
      state.lastScrollY = scrollY;
      
      // Mark as user scrolling
      state.isUserScrolling = true;
      clearTimeout(state.userScrollTimeout);
      
      state.userScrollTimeout = setTimeout(() => {
        state.isUserScrolling = false;
        
        // After user stops scrolling, check if we should snap
        if (!isSnapping) {
          const current = getCurrentSection(scrollY);
          
          if (current) {
            const { section, index, progress } = current;
            
            setCurrentSectionIndex(index);
            state.currentSection = current;
            state.sectionProgress = progress;
            
            // Snap logic for short sections
            if (!section.isTall) {
              // If we're partially into a short section, snap to it
              if (progress > snapThreshold && progress < 1 - snapThreshold) {
                snapToSection(index, 'start');
              }
            } else {
              // For tall sections, only snap when near boundaries
              const viewportHeight = window.innerHeight;
              const scrollInSection = scrollY - section.snapStart;
              const sectionScrollable = section.height - viewportHeight;
              
              // At top of tall section
              if (scrollInSection < viewportHeight * snapThreshold && state.scrollDirection === 'up') {
                snapToSection(index, 'start');
              }
              // At bottom of tall section, ready to move to next
              else if (scrollInSection > sectionScrollable - viewportHeight * snapThreshold && 
                       state.scrollDirection === 'down' &&
                       index < sections.length - 1) {
                snapToSection(index + 1, 'start');
              }
            }
          }
        }
      }, 150); // Debounce: wait 150ms after scroll stops
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollStateRef.current.userScrollTimeout);
    };
  }, [enabled, sections, isSnapping, getCurrentSection, snapToSection, snapThreshold]);

  // Keyboard navigation
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      if (isSnapping) return;
      
      const current = getCurrentSection(window.scrollY);
      if (!current) return;
      
      const { index } = current;
      
      // Arrow down or Page Down - next section
      if ((e.key === 'ArrowDown' && e.metaKey) || e.key === 'PageDown') {
        e.preventDefault();
        if (index < sections.length - 1) {
          snapToSection(index + 1, 'start');
        }
      }
      // Arrow up or Page Up - previous section
      else if ((e.key === 'ArrowUp' && e.metaKey) || e.key === 'PageUp') {
        e.preventDefault();
        if (index > 0) {
          snapToSection(index - 1, 'start');
        }
      }
      // Home - first section
      else if (e.key === 'Home') {
        e.preventDefault();
        snapToSection(0, 'start');
      }
      // End - last section
      else if (e.key === 'End') {
        e.preventDefault();
        snapToSection(sections.length - 1, 'start');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, sections, isSnapping, getCurrentSection, snapToSection]);

  return {
    currentSectionIndex,
    isSnapping,
    sections,
    snapToSection,
    measureSections,
    scrollState: scrollStateRef.current,
  };
};

export default useSectionSnap;
