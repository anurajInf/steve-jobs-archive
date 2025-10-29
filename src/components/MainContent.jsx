import React, { useRef, useState, useEffect } from 'react';
import { sections, CHAPTER_LABELS } from '../data/content';
import Section from './Section';
import PageContent from './PageContent';
import ResponsiveImage from './ResponsiveImage';
import NavigationClean from './NavigationClean';
import ScrubScroller from './ScrubScroller';
import MobileMenu from './MobileMenu';
import { SPRING_PRESETS } from '../services/springPhysicsService';
import scrollAnimationOrchestrator from '../services/scrollAnimationOrchestrator';
import useSectionScroll from '../hooks/useSectionScroll';
import './MainContent.css';

// Import cover photo images
import photo18_256 from '../assets/photo-18~256.jpg';
import photo18_1500 from '../assets/photo-18~1500.jpg';

/**
 * MainContent - Renders all book sections based on content.js
 * Converts section data to appropriate React components
 * Now with integrated scroll orchestration, scrub scroller, and spring physics
 */
const MainContent = () => {
  const mainRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrubberProgress, setScrubberProgress] = useState(0);
  const [labelAnimations, setLabelAnimations] = useState([]);
  const [currentSection, setCurrentSection] = useState('');
  const [showSnapDebug, setShowSnapDebug] = useState(false); // Toggle with Alt+D
  const [isOrchestratorReady, setIsOrchestratorReady] = useState(false);
  
  // Enable intelligent section scrolling
  useSectionScroll(true);
  
  // Initialize orchestrator
  useEffect(() => {
    // Wait for DOM to be ready
    const initTimeout = setTimeout(() => {
      scrollAnimationOrchestrator.init(sections, {
        onScrollProgressUpdate: (progress) => {
          setScrollProgress(progress);
        },
        onScrubberUpdate: (progress) => {
          setScrubberProgress(progress);
        },
        onLabelUpdate: (animations) => {
          setLabelAnimations(animations);
        },
        onContentTransformUpdate: (transform) => {
          // Optional: Apply minimode transforms to main content
          // For now, we'll skip this unless you want zoomed-out mode
        },
      });
      
      scrollAnimationOrchestrator.start();
      setIsOrchestratorReady(true);
      
      console.log('✅ Scroll Animation Orchestrator ready');
    }, 100);
    
    return () => {
      clearTimeout(initTimeout);
      scrollAnimationOrchestrator.stop();
    };
  }, []);
  
  // Simple scroll tracking (backup for body background changes and current chapter)
  useEffect(() => {
    const handleScroll = () => {
      // Background color detection
      const viewportCenter = window.innerHeight / 2;
      const element = document.elementFromPoint(window.innerWidth / 2, viewportCenter);
      
      if (element) {
        const section = element.closest('[data-gray], [data-blue], [data-black], [data-cover]');
        
        // Remove all background classes
        document.body.classList.remove('light-bg', 'blue-bg', 'black-bg');
        
        if (section) {
          // Update current chapter from section's data-chapter or data-sticky
          const chapterName = section.getAttribute('data-sticky') || 
                            section.getAttribute('data-scrubber') ||
                            section.getAttribute('data-chapter') || '';
          
          if (chapterName) {
            setCurrentSection(chapterName);
          }
          
          if (section.hasAttribute('data-gray') || section.hasAttribute('data-cover')) {
            document.body.classList.add('light-bg');
          } else if (section.hasAttribute('data-blue')) {
            document.body.classList.add('blue-bg');
          } else if (section.hasAttribute('data-black')) {
            document.body.classList.add('black-bg');
          }
        } else {
          // Default to light background
          document.body.classList.add('light-bg');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Debug toggle (Alt+D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'd') {
        setShowSnapDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Scroll to progress handler (for scrubber interaction)
  const scrollToProgress = (progress) => {
    if (isOrchestratorReady) {
      // Use orchestrator's smooth spring-based scrolling
      scrollAnimationOrchestrator.scrollToProgress(progress, true);
    } else {
      // Fallback to native smooth scroll
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: progress * docHeight, behavior: 'smooth' });
    }
  };
  
  const handleSectionChange = (index, section) => {
    // Update current section when snap changes
    console.log('Section changed to:', index, section);
  };
  
  const renderSection = (section, index) => {
    const { id, type, pageType } = section;
    
    switch (type) {
      case 'cover':
        return renderCoverPage(section);
      case 'quote':
        return renderQuotePage(section);
      case 'text':
        return renderTextPage(section);
      case 'title':
        return renderTitlePage(section);
      case 'image':
        return renderImagePage(section);
      case 'part':
        return renderPartPage(section);
      default:
        return null;
    }
  };
  
  const renderCoverPage = (section) => {
    return (
      <Section 
        key={section.id}
        id={section.id}
        chapter={section.chapter}
        bookCover
        cover
        gray={section.gray}
        verticalCenter={section.verticalCenter}
        sticky={section.sticky}
        scrubber={section.scrubber}
      >
        <PageContent>
          {section.coverPhoto && (
            <div className="cover-photo-inline">
              <img 
                src={photo18_1500}
                srcSet={`${photo18_256} 256w, ${photo18_1500} 1500w`}
                sizes="(max-width: 768px) 240px, 320px"
                alt="Steve Jobs"
                loading="eager"
              />
            </div>
          )}
          <div className="cover-text">
            <h1>{section.title}</h1>
            <h2>{section.subtitle}</h2>
          </div>
        </PageContent>
      </Section>
    );
  };
  
  const renderQuotePage = (section) => {
    return (
      <Section 
        key={section.id}
        id={section.id}
        chapter={section.chapter}
        gray={section.gray}
        verticalCenter={section.verticalCenter}
      >
        <PageContent>
          {section.paragraphs.map((para, i) => (
            <p key={i} className={i === section.paragraphs.length - 1 ? 'quote-author' : ''}>
              {para}
            </p>
          ))}
        </PageContent>
      </Section>
    );
  };
  
  const renderTextPage = (section) => {
    return (
      <Section 
        key={section.id}
        id={section.id}
        chapter={section.chapter}
        sticky={section.sticky}
        scrubber={section.scrubber}
      >
        <PageContent>
          {section.title && <h1>{section.title.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < section.title.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}</h1>}
          
          {section.subtitles && section.subtitles.map((subtitle, i) => (
            <h3 key={i}>{subtitle}</h3>
          ))}
          
          {section.narration && section.narration.map((para, i) => (
            <p key={`narration-${i}`} className="narration">{para}</p>
          ))}
          
          {section.paragraphs && section.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </PageContent>
      </Section>
    );
  };
  
  const renderTitlePage = (section) => {
    return (
      <Section 
        key={section.id}
        id={section.id}
        chapter={section.chapter}
        blue={section.blue}
        titlePage={section.titlePage}
      >
        <PageContent>
          <h1>{section.title}</h1>
          <h2>{section.subtitle}</h2>
          {section.paragraphs && section.paragraphs.map((para, i) => (
            <p key={i}>
              {para.includes('✂') ? (
                <>
                  <mark className="snip">✂</mark>
                  {para.replace('✂', '')}
                </>
              ) : para}
            </p>
          ))}
        </PageContent>
      </Section>
    );
  };
  
  const renderImagePage = (section) => {
    return (
      <Section 
        key={section.id}
        id={section.id}
        chapter={section.chapter}
        black={section.black}
      >
        <PageContent>
          {section.images && section.images.map((img, i) => (
            <ResponsiveImage
              key={i}
              photoNumber={img.photoNumber} // Add photoNumber to content.js images
              alt={img.alt}
              caption={img.caption}
              portrait={img.portrait}
            />
          ))}
        </PageContent>
      </Section>
    );
  };
  
  const renderPartPage = (section) => {
    return (
      <Section 
        key={section.id}
        id={section.id}
        chapter={section.chapter}
        blue={section.blue}
        sticky={section.sticky}
        scrubber={section.scrubber}
      >
        <PageContent>
          <h1>{section.title}</h1>
          <h2>{section.subtitle}</h2>
        </PageContent>
      </Section>
    );
  };
  
  return (
    <>
      {/* Desktop navigation - now with spring animations */}
      <ScrubScroller 
        scrollProgress={scrollProgress}
        scrubberProgress={scrubberProgress}
        labelAnimations={labelAnimations}
        onScrollTo={scrollToProgress}
        currentChapter={currentSection}
        chapters={CHAPTER_LABELS}
      />
      
      {/* Navigation with tree icon */}
      <MobileMenu
        scrollProgress={scrollProgress}
        onScrollTo={scrollToProgress}
        currentChapter={currentSection}
      />
      
      {/* Main content - using native CSS scroll-snap + custom scroll handler */}
      <main id="main" ref={mainRef}>
        {sections.map((section, index) => renderSection(section, index))}
      </main>
    </>
  );
};

export default MainContent;
