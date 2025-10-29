/**
 * Section-Based Scroll Hook
 * 
 * Implements intelligent section scrolling:
 * - Small scroll = jump to next/prev section
 * - Long sections (>100vh) = scroll within section first
 * - One section visible at a time
 * - Smooth section transitions
 */

import { useEffect, useRef } from 'react';

export const useSectionScroll = (enabled = true) => {
  const scrollTimeoutRef = useRef(null);
  const currentSectionRef = useRef(0);
  const isScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  
  useEffect(() => {
    if (!enabled) return;
    
    let sections = [];
    let scrollTimeout = null;
    
    const updateSections = () => {
      // Get all sections with scroll-snap-align
      sections = Array.from(document.querySelectorAll('.book-section')).map(section => {
        const rect = section.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
          element: section,
          top: rect.top + scrollTop,
          bottom: rect.bottom + scrollTop,
          height: rect.height,
        };
      });
    };
    
    const getCurrentSection = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const viewportCenter = scrollTop + viewportHeight / 2;
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (viewportCenter >= section.top && viewportCenter < section.bottom) {
          return i;
        }
      }
      
      return 0;
    };
    
    const scrollToSection = (index, behavior = 'smooth') => {
      // Clamp index to valid range
      const clampedIndex = Math.max(0, Math.min(index, sections.length - 1));
      
      // If trying to scroll beyond bounds, do nothing
      if (index !== clampedIndex) {
        return;
      }
      
      isScrollingRef.current = true;
      const section = sections[clampedIndex];
      
      window.scrollTo({
        top: section.top,
        behavior: behavior,
      });
      
      currentSectionRef.current = clampedIndex;
      
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    };
    
    const handleWheel = (e) => {
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }
      
      // Ignore very small deltas (touchpad precision scrolling)
      if (Math.abs(e.deltaY) < 5) {
        return;
      }
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const currentSection = getCurrentSection();
      const section = sections[currentSection];
      
      if (!section) return;
      
      const viewportHeight = window.innerHeight;
      const sectionTop = section.top;
      const sectionBottom = section.bottom;
      const sectionHeight = section.height;
      const scrollWithinSection = scrollTop - sectionTop;
      
      // Check if we're at the very last section
      const isLastSection = currentSection === sections.length - 1;
      const isFirstSection = currentSection === 0;
      
      // Check if section is longer than viewport
      const isLongSection = sectionHeight > viewportHeight * 1.1; // 110% threshold
      
      if (isLongSection) {
        // For long sections, check if we're at top or bottom
        const atSectionTop = scrollWithinSection < 50; // Larger threshold (50px)
        const atSectionBottom = (sectionBottom - (scrollTop + viewportHeight)) < 50; // Larger threshold
        
        if (e.deltaY > 0 && atSectionBottom) {
          // Scrolling down at bottom of long section
          if (isLastSection) {
            // Do nothing - prevent scroll beyond last section
            return;
          }
          // Go to next section
          e.preventDefault();
          scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && atSectionTop) {
          // Scrolling up at top of long section
          if (isFirstSection) {
            // Do nothing - prevent scroll before first section
            return;
          }
          // Go to previous section
          e.preventDefault();
          scrollToSection(currentSection - 1);
        }
        // Otherwise, let natural scroll happen within the section
      } else {
        // For short sections (<=100vh), any scroll jumps to next/prev
        e.preventDefault();
        
        if (e.deltaY > 0) {
          // Scroll down
          if (isLastSection) {
            // Do nothing - we're at the last section, can't go further
            return;
          }
          scrollToSection(currentSection + 1);
        } else {
          // Scroll up
          if (isFirstSection) {
            // Do nothing - we're at the first section, can't go earlier
            return;
          }
          scrollToSection(currentSection - 1);
        }
      }
    };
    
    const handleKeyDown = (e) => {
      if (isScrollingRef.current) return;
      
      const currentSection = getCurrentSection();
      
      // Arrow keys and Page Up/Down
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        scrollToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(currentSection - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(sections.length - 1);
      }
    };
    
    const handleScroll = () => {
      // Update current section on natural scroll (e.g., from clicking scrubber)
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const section = getCurrentSection();
        currentSectionRef.current = section;
      }, 100);
    };
    
    // Initialize
    updateSections();
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSections);
    
    // Initial scroll to first section
    setTimeout(() => {
      scrollToSection(0, 'auto');
    }, 100);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSections);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [enabled]);
  
  return null;
};

export default useSectionScroll;
