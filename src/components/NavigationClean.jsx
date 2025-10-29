import React, { useState } from 'react';
import './NavigationClean.css';

/**
 * Navigation - Clean structure from index-clean.html
 * Simple top nav with logo, chapter indicator, and menu
 */
const NavigationClean = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Listen to scroll to update chapter (basic implementation)
  React.useEffect(() => {
    const handleScroll = () => {
      const pages = document.querySelectorAll('[data-sticky]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      pages.forEach(page => {
        const pageTop = page.offsetTop;
        const pageBottom = pageTop + page.offsetHeight;
        
        if (scrollPosition >= pageTop && scrollPosition < pageBottom) {
          const chapter = page.getAttribute('data-sticky');
          if (chapter) {
            setCurrentChapter(chapter);
          }
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="main-nav">
      <div className="nav-content">
        <div className="nav-left">
          <a href="#" className="logo">Steve Jobs Archive</a>
        </div>
        <div className="nav-center">
          <span id="chapter-indicator">{currentChapter}</span>
        </div>
        <div className="nav-right">
          <button id="menu-button" onClick={toggleMenu}>Menu</button>
        </div>
      </div>
      
      {/* Table of Contents */}
      {menuOpen && (
        <div className="table-of-contents" onClick={toggleMenu}>
          <ul>
            <li><a href="#cover">Make Something Wonderful</a></li>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#preface">Preface</a></li>
            <li><a href="#part-1">1976–1985</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavigationClean;
