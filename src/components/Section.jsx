import React from 'react';
import './Section.css';

/**
 * Section - Combined book section and page component
 * Merges BookSection and BookPage for cleaner structure
 * 
 * Supports:
 * - Section snapping with data-section attribute
 * - Different background colors (gray, blue, black)
 * - Sticky and scrubber effects
 * - Chapter/section tracking
 */
const Section = ({ 
  id,
  chapter = '',
  bookCover = false,
  cover = false,
  gray = false,
  blue = false,
  black = false,
  verticalCenter = false,
  titlePage = false,
  sticky = '',
  scrubber = '',
  snapFull = false,
  snapAuto = false,
  children 
}) => {
  return (
    <div 
      className="book-section"
      data-chapter={chapter}
      data-book-cover={bookCover || undefined}
    >
      <div 
        id={id}
        className="book-page"
        data-section
        data-cover={cover || undefined}
        data-gray={gray || undefined}
        data-blue={blue || undefined}
        data-black={black || undefined}
        data-vertical-center={verticalCenter || undefined}
        data-title-page={titlePage || undefined}
        data-sticky={sticky || undefined}
        data-scrubber={scrubber || undefined}
        data-snap-full={snapFull || undefined}
        data-snap-auto={snapAuto || undefined}
      >
        <div className="snap-start"></div>
        <div className="snap-end"></div>
        <div className="nav-occluder"></div>
        {children}
      </div>
    </div>
  );
};

export default Section;
