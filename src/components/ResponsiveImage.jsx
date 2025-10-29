import React, { useState, useEffect } from 'react';
import './ResponsiveImage.css';

/**
 * ResponsiveImage - Optimized image component
 * 
 * Features:
 * - Loads small JPEG on mobile (256px)
 * - Loads large WebP on desktop (1500px)
 * - Lazy loading with intersection observer
 * - Smooth fade-in animation
 * - Portrait/landscape support
 */
const ResponsiveImage = ({ 
  photoNumber,  // e.g., "2", "4", "6", etc.
  alt = '',
  caption = '',
  portrait = false,
  className = ''
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = React.useRef(null);

  // Determine if mobile based on screen width
  const isMobile = window.innerWidth <= 768;
  
  // Build image paths
  const smallSrc = `/src/assets/photo-${photoNumber}~256.jpg`;
  const largeSrc = `/src/assets/photo-${photoNumber}~1500.webp`;
  
  // Choose appropriate image based on device
  const imageSrc = isMobile ? smallSrc : largeSrc;

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <figure className={`responsive-image ${className}`} ref={imgRef}>
      <div className={`image-wrapper ${portrait ? 'portrait' : 'landscape'}`}>
        {isVisible && (
          <picture>
            {/* WebP for modern browsers */}
            {!isMobile && (
              <source srcSet={largeSrc} type="image/webp" />
            )}
            {/* Fallback JPEG */}
            <img
              className={`${portrait ? 'portrait' : 'landscape'} ${loaded ? 'loaded' : ''}`}
              src={imageSrc}
              alt={alt}
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
          </picture>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

export default ResponsiveImage;
