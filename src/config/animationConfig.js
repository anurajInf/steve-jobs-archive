/**
 * Animation Configuration
 * Centralized timing constants and easing functions for consistent animations
 */

export const TYPOGRAPHY_TIMING = {
  // ===== Reading Rhythm =====
  READING_PAUSE: 0.5,        // Pause between paragraphs (seconds)
  WORD_STAGGER: 0.03,        // Delay between words (seconds)
  CHAR_STAGGER: 0.02,        // Delay between characters (seconds)
  LINE_STAGGER: 0.2,         // Delay between lines (seconds)
  
  // ===== Animation Durations =====
  WORD_REVEAL: 0.8,          // Duration for word fade-in
  CHAR_REVEAL: 0.6,          // Duration for character fade-in
  PARAGRAPH_TRANSITION: 1.0, // Duration for paragraph transitions
  TITLE_REVEAL: 1.2,         // Duration for title animations
  
  // ===== Quote Breathing =====
  BREATH_DURATION: 4,        // One breath cycle (in/out)
  BREATH_SCALE_MIN: 0.98,    // Minimum scale (exhale)
  BREATH_SCALE_MAX: 1.02,    // Maximum scale (inhale)
  BREATH_OPACITY_MIN: 0.95,  // Minimum opacity
  BREATH_OPACITY_MAX: 1.0,   // Maximum opacity
  
  // ===== Hero Polaroid =====
  POLAROID_DEVELOP: 3,       // Photo development duration
  POLAROID_BLUR_START: 20,   // Starting blur (px)
  POLAROID_BLUR_END: 0,      // Ending blur (px)
  
  // ===== Gallery =====
  IMAGE_SCALE_START: 0.95,   // Starting scale for images
  IMAGE_SCALE_END: 1.0,      // Ending scale for images
  CAPTION_DELAY: 0.3,        // Delay before caption appears
};

export const EASING = {
  // ===== Default Easings =====
  DEFAULT: 'power2.out',
  SMOOTH: 'power1.inOut',
  SNAP: 'power3.out',
  
  // ===== Breathing/Organic =====
  BREATHING: 'sine.inOut',
  GENTLE: 'sine.out',
  FLOAT: 'sine.inOut',
  
  // ===== Entrance/Exit =====
  ENTRANCE: 'power3.out',
  EXIT: 'power2.in',
  
  // ===== Elastic/Bounce =====
  ELASTIC: 'elastic.out(1, 0.5)',
  BOUNCE: 'bounce.out',
  
  // ===== Custom Cubic Beziers =====
  APPLE: 'cubic-bezier(0.2, 0, 0, 1)',      // Apple-style easing
  LOVEFROM: 'cubic-bezier(0.4, 0, 0.2, 1)', // LoveFrom easing
};

export const SCROLL_TRIGGER_DEFAULTS = {
  // ===== Pin Effects =====
  PIN_DURATION: '200%',      // How long sections stay pinned
  PIN_SPACING: true,         // Add spacing after pinned element
  
  // ===== Scrub Settings =====
  SCRUB: 1,                  // Smooth scrubbing (1 second catch-up)
  SCRUB_SMOOTH: 0.5,         // Even smoother scrubbing
  SCRUB_INSTANT: true,       // No smoothing, instant response
  
  // ===== Snap Settings =====
  SNAP_DIRECTIONAL: true,    // Snap based on scroll direction
  SNAP_DURATION: 0.8,        // Snap animation duration
  
  // ===== Markers =====
  MARKERS: false,            // Show debug markers (set to true for dev)
};

export const PERFORMANCE = {
  // ===== GPU Acceleration =====
  FORCE_3D: true,            // Use force3D for transforms
  
  // ===== Batch Settings =====
  BATCH_INTERVAL: 0.1,       // Interval for batch animations
  BATCH_MAX: 5,              // Max elements per batch
  
  // ===== Mobile Optimizations =====
  REDUCE_MOTION_MEDIA: '(prefers-reduced-motion: reduce)',
  MOBILE_BREAKPOINT: 768,    // px
  
  // ===== Will-Change =====
  WILL_CHANGE_PROPS: ['transform', 'opacity'],
};

export const ENGAGEMENT = {
  // ===== Scroll Tracking =====
  SCROLL_THRESHOLD: 10,        // % - Trigger when scrolled 10% more
  SCROLL_POLL_RATE: 200,       // ms - Poll document height changes
  
  // ===== Time Tracking =====
  TIME_THRESHOLD: 3000,        // ms - Trigger every 3 seconds minimum
  
  // ===== Visibility Tracking =====
  TRACK_VISIBILITY: true,      // Track tab visibility
  TRACK_FOCUS: true,           // Track window focus
  PAUSE_WHEN_HIDDEN: true,     // Pause animations when tab hidden
  
  // ===== Animation Batching =====
  BATCH_SIZE: 3,               // Animate 3 elements at a time
  BATCH_DELAY: 100,            // ms between batches
  PRE_TRIGGER_OFFSET: 5,       // % - Pre-trigger animations 5% before zone
  
  // ===== Zone Configuration =====
  ZONE_OVERLAP: 10,            // % - Zones overlap by 10%
  MIN_ZONE_HEIGHT: 50,         // % - Minimum zone height
};

export const COLORS = {
  // ===== Text Colors =====
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#646464',
  TEXT_BLUE: '#0089D0',
  
  // ===== Background Colors =====
  BG_WHITE: '#FFFFFF',
  BG_BLACK: '#000000',
  BG_GRAY: '#F5F5F5',
  
  // ===== Highlight Colors =====
  HIGHLIGHT_YELLOW: 'rgba(255, 245, 0, 0.3)',
  HIGHLIGHT_BLUE: 'rgba(0, 137, 208, 0.2)',
};

/**
 * Get responsive timing based on screen size
 * @param {Object} timings - Object with desktop and mobile values
 * @returns {number} - Appropriate timing value
 */
export function getResponsiveTiming(timings) {
  const isMobile = window.innerWidth <= PERFORMANCE.MOBILE_BREAKPOINT;
  return isMobile ? timings.mobile : timings.desktop;
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia(PERFORMANCE.REDUCE_MOTION_MEDIA).matches;
}

/**
 * Get easing function based on context
 * @param {string} context - 'entrance', 'exit', 'breathing', etc.
 * @returns {string} - GSAP easing string
 */
export function getContextualEasing(context) {
  const easingMap = {
    entrance: EASING.ENTRANCE,
    exit: EASING.EXIT,
    breathing: EASING.BREATHING,
    default: EASING.DEFAULT,
    smooth: EASING.SMOOTH,
  };
  
  return easingMap[context] || EASING.DEFAULT;
}

/**
 * Create stagger configuration for GSAP
 * @param {Object} options - Stagger options
 * @returns {Object} - GSAP stagger config
 */
export function createStaggerConfig(options = {}) {
  const {
    amount = TYPOGRAPHY_TIMING.WORD_STAGGER,
    from = 'start',
    ease = EASING.DEFAULT,
    grid = null,
  } = options;
  
  const config = {
    each: amount,
    from: from,
    ease: ease,
  };
  
  if (grid) {
    config.grid = grid;
    config.axis = grid.axis || null;
  }
  
  return config;
}

export default {
  TYPOGRAPHY_TIMING,
  EASING,
  SCROLL_TRIGGER_DEFAULTS,
  PERFORMANCE,
  ENGAGEMENT,
  COLORS,
  getResponsiveTiming,
  prefersReducedMotion,
  getContextualEasing,
  createStaggerConfig,
};
