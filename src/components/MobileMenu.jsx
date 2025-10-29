import React, { useState, useEffect } from 'react';
import hamburgerIcon from '../assets/hamburger.svg';
import treeIcon from '../assets/treeIcon.svg';
import { CHAPTER_LABELS } from '../data/content';
import './MobileMenu.css';

/**
 * MobileMenu - Navigation icons and hamburger menu
 * 
 * Features:
 * - Tree icon in top-left (goes to top) - visible on all screens
 * - Hamburger icon on mobile (shows menu)
 * - Icons change color based on background (black on white/gray, white on blue)
 * - Full-screen menu overlay
 * - Chapter navigation
 */
const MobileMenu = ({ scrollProgress, onScrollTo, currentChapter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnBlue, setIsOnBlue] = useState(false);

  // Detect if user is on a blue section to change icon color
  useEffect(() => {
    const checkBackground = () => {
      const sections = document.querySelectorAll('.book-page');
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const threshold = 100; // Check top 100px of viewport
      
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        // Check if section is at the top of viewport
        if (rect.top <= threshold && rect.bottom >= threshold) {
          const isBlue = section.hasAttribute('data-blue');
          setIsOnBlue(isBlue);
          break;
        }
      }
    };

    checkBackground();
    window.addEventListener('scroll', checkBackground);
    return () => window.removeEventListener('scroll', checkBackground);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  };

  const handleChapterClick = (index) => {
    const progress = index / (CHAPTER_LABELS.length - 1);
    onScrollTo(progress);
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Tree icon - top left */}
      <button
        className={`mobile-tree-icon ${isOnBlue ? 'on-blue' : ''}`}
        onClick={scrollToTop}
        aria-label="Go to top"
      >
        <img src={treeIcon} alt="Home" />
      </button>

      {/* Hamburger icon - top right */}
      <button
        className={`mobile-hamburger ${isOnBlue ? 'on-blue' : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <img src={hamburgerIcon} alt="Menu" />
      </button>

      {/* Full-screen menu overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleMenu} aria-label="Close menu">
              ✕
            </button>
            
            <nav className="mobile-menu-nav">
              <h2>Chapters</h2>
              <ul>
                {CHAPTER_LABELS.filter(chapter => chapter.display).map((chapter, index) => (
                  <li key={chapter.id}>
                    <button
                      onClick={() => handleChapterClick(chapter.id)}
                      className={currentChapter === chapter.label ? 'active' : ''}
                    >
                      <span className="chapter-number">{String(chapter.id).padStart(2, '0')}</span>
                      <span className="chapter-label">{chapter.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Progress indicator */}
            <div className="mobile-progress">
              <div 
                className="mobile-progress-bar" 
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
