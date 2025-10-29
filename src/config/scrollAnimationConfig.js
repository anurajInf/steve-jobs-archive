/**
 * Scroll Animation Configuration
 * Fine-tune spring physics and animation parameters for the buttery-smooth feel
 * 
 * HOW TO TUNE:
 * 
 * Spring Constants (k = stiffness, c = damping):
 * - Higher k = stiffer, faster response (0.1 - 1.0)
 * - Higher c = more damping, less bounce (0.1 - 1.0)
 * - For "Apple feel": k = 0.4-0.6, c = 0.7-0.9
 * 
 * Label Animations:
 * - labelFadeRange: Distance (0-1) over which labels fade in/out
 * - labelScaleMin/Max: Size range for inactive/active labels
 * - labelYOffsetMax: How far labels move vertically
 */

import { SPRING_PRESETS } from '../services/springPhysicsService';

export const SCROLL_ANIMATION_CONFIG = {
  // ===== SCROLL SPRING =====
  // Controls main scroll momentum and smoothness
  // For immediate sync with scrubber, use higher values
  scrollSpring: {
    k: 0.9,  // Very stiff for immediate response
    c: 0.95, // Heavy damping for no bounce
  },
  
  // ===== SCRUBBER SPRING =====
  // Controls scrubber fill animation (should match scroll exactly)
  // NO LAG - same as scroll spring for perfect sync
  scrubberSpring: {
    k: 0.9,   // Same as scroll - instant sync
    c: 0.95,  // Same as scroll - instant sync
  },
  
  // ===== LABEL ANIMATIONS =====
  // Proximity-based opacity, scale, and Y-position
  labelAnimation: {
    fadeRange: 0.15,         // Distance (viewport heights) over which labels fade
    scaleMin: 0.85,          // Minimum scale for distant labels
    scaleMax: 1.15,          // Maximum scale for active labels
    yOffsetMax: 10,          // Max Y translation in pixels
  },
  
  // ===== MINIMODE (ZOOM-OUT) =====
  // For future "overview mode" feature
  minimode: {
    scale: 0.75,             // Zoomed-out scale
    y: -100,                 // Y offset in pixels
    spring: {
      k: 0.6,                // Stiffer for responsive minimode toggle
      c: 0.8,                // More damping for smooth settle
    },
  },
  
  // ===== PERFORMANCE =====
  performance: {
    autoSleep: true,         // Auto-pause springs when settled
    sleepThreshold: 0.001,   // Velocity threshold for sleep
    maxDeltaTime: 0.1,       // Cap delta time to prevent jumps (100ms)
  },
  
  // ===== DEBUG =====
  debug: false,              // Enable console logging and debug overlay
};

/**
 * Preset configurations for different feels
 */
export const SCROLL_ANIMATION_PRESETS = {
  // Apple-style: Smooth, polished, minimal bounce
  APPLE: {
    scrollSpring: { k: 0.5, c: 0.75 },
    scrubberSpring: { k: 0.4, c: 0.7 },
    labelAnimation: { fadeRange: 0.15, scaleMin: 0.85, scaleMax: 1.15, yOffsetMax: 10 },
  },
  
  // Snappy: Quick response, tight feel
  SNAPPY: {
    scrollSpring: { k: 0.7, c: 0.85 },
    scrubberSpring: { k: 0.6, c: 0.8 },
    labelAnimation: { fadeRange: 0.12, scaleMin: 0.9, scaleMax: 1.1, yOffsetMax: 8 },
  },
  
  // Floaty: Soft, organic, more bounce
  FLOATY: {
    scrollSpring: { k: 0.3, c: 0.6 },
    scrubberSpring: { k: 0.25, c: 0.55 },
    labelAnimation: { fadeRange: 0.2, scaleMin: 0.8, scaleMax: 1.2, yOffsetMax: 15 },
  },
  
  // Instant: Minimal spring, almost instant response
  INSTANT: {
    scrollSpring: { k: 0.9, c: 0.95 },
    scrubberSpring: { k: 0.85, c: 0.9 },
    labelAnimation: { fadeRange: 0.1, scaleMin: 0.95, scaleMax: 1.05, yOffsetMax: 5 },
  },
};

/**
 * Apply a preset configuration
 * @param {string} presetName - 'APPLE', 'SNAPPY', 'FLOATY', or 'INSTANT'
 * @returns {Object} - Configuration object
 */
export function applyPreset(presetName) {
  const preset = SCROLL_ANIMATION_PRESETS[presetName];
  
  if (!preset) {
    console.warn(`⚠️ Unknown preset: ${presetName}`);
    return SCROLL_ANIMATION_CONFIG;
  }
  
  return {
    ...SCROLL_ANIMATION_CONFIG,
    ...preset,
  };
}

/**
 * Get configuration for specific device/preference
 * @param {Object} options - { reducedMotion, isMobile, isTablet }
 * @returns {Object} - Adapted configuration
 */
export function getAdaptiveConfig(options = {}) {
  const { reducedMotion = false, isMobile = false, isTablet = false } = options;
  
  let config = { ...SCROLL_ANIMATION_CONFIG };
  
  // Reduce motion: Use snappier, less bouncy springs
  if (reducedMotion) {
    config.scrollSpring = { k: 0.9, c: 0.95 };
    config.scrubberSpring = { k: 0.85, c: 0.9 };
    config.labelAnimation.scaleMin = 0.95;
    config.labelAnimation.scaleMax = 1.05;
    config.labelAnimation.yOffsetMax = 5;
  }
  
  // Mobile: Slightly snappier for better responsiveness
  if (isMobile) {
    config.scrollSpring = { k: 0.6, c: 0.8 };
    config.scrubberSpring = { k: 0.5, c: 0.75 };
  }
  
  // Tablet: Balanced between desktop and mobile
  if (isTablet) {
    config.scrollSpring = { k: 0.55, c: 0.75 };
    config.scrubberSpring = { k: 0.45, c: 0.7 };
  }
  
  return config;
}

export default SCROLL_ANIMATION_CONFIG;
