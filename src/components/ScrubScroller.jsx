import React, { useRef, useState, useEffect } from 'react';
import './ScrubScroller.css';

/**
 * ScrubScroller - Interactive sidebar navigation
 * 
 * Design matches Steve Jobs Archive:
 * - Thin vertical line (track) on right side  
 * - White progress bar fills from top as user scrolls
 * - ALL chapter labels always visible with spring-based animations
 * - Active section: bright white (or blue on light sections)
 * - Proximity-based: opacity, scale, Y-position
 * - Smooth spring physics for all interactions
 */
const ScrubScroller = ({ 
  scrollProgress = 0, 
  onScrollTo,
  currentChapter = '',
  chapters,
  labelAnimations = [], // Animation data from orchestrator
  scrubberProgress = 0, // Spring-smoothed scrubber progress
}) => {
  // Convert CHAPTER_LABELS format if needed
  const chapterList = React.useMemo(() => {
    if (!chapters || chapters.length === 0) return [];
    // If chapters are objects with label property, extract labels
    if (typeof chapters[0] === 'object' && chapters[0].label !== undefined) {
      return chapters.filter(ch => ch.display).map(ch => ch.label);
    }
    // Otherwise assume it's already an array of strings
    return chapters;
  }, [chapters]);
  const [isDragging, setIsDragging] = useState(false);
  
  const touchRef = useRef(null);

  // Find current chapter index for passed/active states
  const currentChapterIndex = chapterList.indexOf(currentChapter);

  // Use spring-smoothed progress for scrubber fill
  const fillProgress = scrubberProgress || scrollProgress;

  // Pointer interaction handlers with spring integration
  const handlePointerDown = (e) => {
    if (!touchRef.current) return;
    
    setIsDragging(true);
    const rect = touchRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / rect.height));
    
    if (onScrollTo) {
      onScrollTo(progress);
    }

    touchRef.current.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !touchRef.current) return;

    const rect = touchRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / rect.height));
    
    if (onScrollTo) {
      onScrollTo(progress);
    }

    e.preventDefault();
  };

  const handlePointerUp = (e) => {
    if (!touchRef.current) return;
    
    setIsDragging(false);
    touchRef.current.releasePointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handleWheel = (e) => {
    if (!touchRef.current) return;
    
    const delta = e.deltaY * 0.001;
    const newProgress = Math.max(0, Math.min(1, scrollProgress + delta));
    
    if (onScrollTo) {
      onScrollTo(newProgress);
    }

    e.preventDefault();
  };

  return (
    <div className={`scrub-scroller ${isDragging ? 'dragging' : ''}`}>
      {/* Current Section Indicator - Top Right */}
      {currentChapter && (
        <div className="section-indicator">
          <span className="section-indicator-text">{currentChapter}</span>
        </div>
      )}
      
      <div
        ref={touchRef}
        className="scrub-scroller-touch"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Background Track - rendered as segments between labels */}
        <div className="scrub-track">
          {/* Render segments between each label */}
          {chapterList.map((chapter, index) => {
            if (index === chapterList.length - 1) return null; // No segment after last label
            
            const startProgress = index / (chapterList.length - 1);
            const endProgress = (index + 1) / (chapterList.length - 1);
            const segmentHeight = (endProgress - startProgress) * 100;
            
            // Calculate if this segment should be filled (use spring-smoothed progress)
            const segmentFillPercentage = Math.max(0, Math.min(1,
              (fillProgress - startProgress) / (endProgress - startProgress)
            ));
            
            return (
              <div
                key={`segment-${index}`}
                className="scrub-track-segment"
                style={{
                  top: `${startProgress * 100}%`,
                  height: `${segmentHeight}%`
                }}
              >
                {/* Filled portion of this segment - spring-animated */}
                <div
                  className="scrub-track-segment-filled"
                  style={{
                    height: `${segmentFillPercentage * 100}%`,
                    transition: 'none', // Spring physics handles smoothing
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Chapter Labels - Hidden by default, visible on hover */}
        {chapterList.map((chapter, index) => {
          const labelProgress = index / (chapterList.length - 1 || 1);
          const isActive = chapter === currentChapter;
          const isPassed = currentChapterIndex >= 0 && index < currentChapterIndex;
          
          // Get animation data from orchestrator (if available)
          const animation = labelAnimations[index] || {
            opacity: 0, // Hidden by default, CSS hover will show them
            scale: isActive ? 1.1 : 1,
            yOffset: 0,
          };
          
          return (
            <div
              key={index}
              className={`scrub-label ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
              style={{
                top: `${labelProgress * 100}%`,
                opacity: animation.opacity,
                transform: `translateY(${animation.yOffset}px) scale(${animation.scale})`,
                transition: 'none', // Spring physics handles smoothing
              }}
            >
              <span className="scrub-label-text">{chapter}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrubScroller;
