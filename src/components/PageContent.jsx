import React from 'react';
import './PageContent.css';

/**
 * PageContent - Content wrapper with max-width
 * Based on <page-content> from index-clean.html
 */
const PageContent = ({ children }) => {
  return (
    <div className="page-content">
      {children}
    </div>
  );
};

export default PageContent;
