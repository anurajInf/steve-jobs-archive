import React, { useState, useEffect } from 'react';
import './ResponsiveImage.css';

// Import all images
import photo2_256 from '../assets/photo-2~256.jpg';
import photo2_1500 from '../assets/photo-2~1500.webp';
import photo6_256 from '../assets/photo-6~256.jpg';
import photo6_1500 from '../assets/photo-6~1500.webp';
import photo18_256 from '../assets/photo-18~256.jpg';
import photo18_1500 from '../assets/photo-18~1500.jpg';
import photo64_256 from '../assets/photo-64~256.jpg';
import photo64_1500 from '../assets/photo-64~1500.webp';

// Map photo numbers to imported images
const imageMap = {
  2: { small: photo2_256, large: photo2_1500, isWebP: true },
  6: { small: photo6_256, large: photo6_1500, isWebP: true },
  18: { small: photo18_256, large: photo18_1500, isWebP: false },
  64: { small: photo64_256, large: photo64_1500, isWebP: true },
};

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
  photoNumber,  // e.g., 2, 4, 6, 18, 64
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
  
  // Get image paths from map
  const images = imageMap[photoNumber];
  
  if (!images) {
    console.error(`Image not found for photo number: ${photoNumber}`);
    return null;
  }
  
  // Choose appropriate image based on device
  const imageSrc = isMobile ? images.small : images.large;

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
            {/* WebP for modern browsers on desktop */}
            {!isMobile && images.isWebP && (
              <source srcSet={images.large} type="image/webp" />
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
