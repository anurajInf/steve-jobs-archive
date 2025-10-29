/**
 * Scroll Animation Orchestrator
 * Coordinates smooth spring-based animations across:
 * - Scroll progress (momentum-based scrolling)
 * - Scrubber fill (SVG path animation)
 * - Label transforms (opacity, scale, Y-position)
 * - Content transforms (minimode / zoom-out)
 * 
 * This is the "brain" that ties scroll events to spring physics,
 * creating the buttery-smooth Apple-style interaction layer.
 */

import springPhysicsService, { SPRING_PRESETS } from './springPhysicsService';
import SCROLL_ANIMATION_CONFIG from '../config/scrollAnimationConfig';

class ScrollAnimationOrchestrator {
  constructor() {
    // State
    this.isInitialized = false;
    this.isActive = false;
    
    // Section data (populated on init)
    this.sections = [];
    this.sectionPositions = []; // { top, height, center }
    
    // Scroll state
    this.scrollTarget = 0;
    this.currentScrollProgress = 0;
    this.documentHeight = 0;
    this.viewportHeight = 0;
    
    // Minimode state
    this.minimodeActive = false;
    
    // Callbacks
    this.onScrollProgressUpdate = null;
    this.onScrubberUpdate = null;
    this.onLabelUpdate = null;
    this.onContentTransformUpdate = null;
    
    // Spring IDs
    this.SPRING_IDS = {
      SCROLL: 'scroll-main',
      SCRUBBER_FILL: 'scrubber-fill',
      MINIMODE_SCALE: 'minimode-scale',
      MINIMODE_Y: 'minimode-y',
    };
    
    // Configuration (use imported config)
    this.config = {
      // Scroll spring
      scrollSpring: SCROLL_ANIMATION_CONFIG.scrollSpring,
      
      // Scrubber spring
      scrubberSpring: SCROLL_ANIMATION_CONFIG.scrubberSpring,
      
      // Label animation ranges
      labelFadeRange: SCROLL_ANIMATION_CONFIG.labelAnimation.fadeRange,
      labelScaleMin: SCROLL_ANIMATION_CONFIG.labelAnimation.scaleMin,
      labelScaleMax: SCROLL_ANIMATION_CONFIG.labelAnimation.scaleMax,
      labelYOffsetMax: SCROLL_ANIMATION_CONFIG.labelAnimation.yOffsetMax,
      
      // Minimode transforms
      minimodeScale: SCROLL_ANIMATION_CONFIG.minimode.scale,
      minimodeY: SCROLL_ANIMATION_CONFIG.minimode.y,
      minimodeSpring: SCROLL_ANIMATION_CONFIG.minimode.spring,
      
      // Performance
      autoSleep: SCROLL_ANIMATION_CONFIG.performance.autoSleep,
      
      // Debug
      debug: SCROLL_ANIMATION_CONFIG.debug,
    };
    
    console.log('🎬 Scroll Animation Orchestrator initialized');
  }

  /**
   * Initialize orchestrator with section data
   * @param {Array} sections - Section elements or data
   * @param {Object} callbacks - { onScrollProgressUpdate, onScrubberUpdate, onLabelUpdate }
   */
  init(sections, callbacks = {}) {
    if (this.isInitialized) {
      console.warn('⚠️ Orchestrator already initialized');
      return;
    }
    
    this.sections = sections;
    this.onScrollProgressUpdate = callbacks.onScrollProgressUpdate;
    this.onScrubberUpdate = callbacks.onScrubberUpdate;
    this.onLabelUpdate = callbacks.onLabelUpdate;
    this.onContentTransformUpdate = callbacks.onContentTransformUpdate;
    
    // Measure sections
    this.measureSections();
    
    // Create springs
    this.createSprings();
    
    // Register spring update callback
    springPhysicsService.onUpdate(this.handleSpringUpdate.bind(this));
    
    this.isInitialized = true;
    
    if (this.config.debug) {
      console.log('✅ Orchestrator initialized', {
        sections: this.sections.length,
        sectionPositions: this.sectionPositions,
      });
    }
  }

  /**
   * Measure section positions and heights
   */
  measureSections() {
    this.documentHeight = document.documentElement.scrollHeight;
    this.viewportHeight = window.innerHeight;
    
    this.sectionPositions = this.sections.map((section, i) => {
      let element;
      
      // Handle both DOM elements and data objects
      if (section instanceof HTMLElement) {
        element = section;
      } else if (section.id) {
        element = document.getElementById(section.id);
      }
      
      if (!element) {
        console.warn(`⚠️ Section element not found for index ${i}`);
        return { top: 0, height: 0, center: 0 };
      }
      
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const top = rect.top + scrollTop;
      const height = rect.height;
      const center = top + height / 2;
      
      return { top, height, center };
    });
    
    if (this.config.debug) {
      console.log('📏 Sections measured:', this.sectionPositions);
    }
  }

  /**
   * Create animation springs
   */
  createSprings() {
    const { scrollSpring, scrubberSpring, minimodeSpring } = this.config;
    
    // Main scroll spring
    springPhysicsService.createSpring(
      this.SPRING_IDS.SCROLL,
      0, // initial value
      0, // initial target
      scrollSpring.k,
      scrollSpring.c,
      { label: 'Scroll Progress' }
    );
    
    // Scrubber fill spring (follows scroll)
    springPhysicsService.createSpring(
      this.SPRING_IDS.SCRUBBER_FILL,
      0,
      0,
      scrubberSpring.k,
      scrubberSpring.c,
      { label: 'Scrubber Fill' }
    );
    
    // Minimode springs
    springPhysicsService.createSpring(
      this.SPRING_IDS.MINIMODE_SCALE,
      1, // start at normal scale
      1,
      minimodeSpring.k,
      minimodeSpring.c,
      { label: 'Minimode Scale' }
    );
    
    springPhysicsService.createSpring(
      this.SPRING_IDS.MINIMODE_Y,
      0, // start at normal position
      0,
      minimodeSpring.k,
      minimodeSpring.c,
      { label: 'Minimode Y' }
    );
    
    if (this.config.debug) {
      console.log('🎯 Springs created:', Object.values(this.SPRING_IDS));
    }
  }

  /**
   * Start animation loop
   */
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    springPhysicsService.startLoop();
    
    // Add scroll listener
    this.handleNativeScroll = this.handleNativeScroll.bind(this);
    window.addEventListener('scroll', this.handleNativeScroll, { passive: true });
    
    // Add resize listener
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    if (this.config.debug) {
      console.log('▶️ Orchestrator started');
    }
  }

  /**
   * Stop animation loop
   */
  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    springPhysicsService.stopLoop();
    
    window.removeEventListener('scroll', this.handleNativeScroll);
    window.removeEventListener('resize', this.handleResize);
    
    if (this.config.debug) {
      console.log('⏸️ Orchestrator stopped');
    }
  }

  /**
   * Handle native browser scroll events
   * Updates the target for the scroll spring
   */
  handleNativeScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = this.documentHeight - this.viewportHeight;
    
    // Calculate normalized scroll progress (0-1)
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    
    // Update scroll spring target
    springPhysicsService.updateTarget(this.SPRING_IDS.SCROLL, progress);
    
    // Also update scrubber spring target (with same value for now)
    springPhysicsService.updateTarget(this.SPRING_IDS.SCRUBBER_FILL, progress);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Debounce resize
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.measureSections();
      
      // Re-sync scroll position
      this.handleNativeScroll();
    }, 150);
  }

  /**
   * Spring update callback
   * Called every frame with current spring values
   * @param {Object} springValues - { springId: value }
   * @param {Map} springs - All spring instances
   */
  handleSpringUpdate(springValues, springs) {
    const scrollProgress = springValues[this.SPRING_IDS.SCROLL] || 0;
    const scrubberProgress = springValues[this.SPRING_IDS.SCRUBBER_FILL] || 0;
    const minimodeScale = springValues[this.SPRING_IDS.MINIMODE_SCALE] || 1;
    const minimodeY = springValues[this.SPRING_IDS.MINIMODE_Y] || 0;
    
    this.currentScrollProgress = scrollProgress;
    
    // Update scroll progress callback
    if (this.onScrollProgressUpdate) {
      this.onScrollProgressUpdate(scrollProgress);
    }
    
    // Update scrubber callback
    if (this.onScrubberUpdate) {
      this.onScrubberUpdate(scrubberProgress);
    }
    
    // Update labels callback
    if (this.onLabelUpdate) {
      const labelAnimations = this.calculateLabelAnimations(scrollProgress);
      this.onLabelUpdate(labelAnimations);
    }
    
    // Update content transform callback
    if (this.onContentTransformUpdate) {
      this.onContentTransformUpdate({
        scale: minimodeScale,
        y: minimodeY,
      });
    }
  }

  /**
   * Calculate label animations based on scroll progress
   * Returns animation data for each label
   * @param {number} scrollProgress - Current scroll progress (0-1)
   * @returns {Array} - Label animation data
   */
  calculateLabelAnimations(scrollProgress) {
    if (this.sectionPositions.length === 0) return [];
    
    const maxScroll = this.documentHeight - this.viewportHeight;
    const currentScrollY = scrollProgress * maxScroll;
    
    return this.sectionPositions.map((position, index) => {
      // Calculate label's ideal position as percentage
      const labelProgress = index / (this.sectionPositions.length - 1 || 1);
      
      // Calculate distance from current scroll to this section
      // Normalize to 0-1 range based on viewport height
      const distance = Math.abs(currentScrollY - position.center) / this.viewportHeight;
      
      // Calculate opacity (fades based on distance)
      const opacity = Math.max(0, Math.min(1, 1 - (distance / this.config.labelFadeRange)));
      
      // Calculate scale (grows when active)
      const scaleRange = this.config.labelScaleMax - this.config.labelScaleMin;
      const scale = this.config.labelScaleMin + (opacity * scaleRange);
      
      // Calculate Y offset (moves slightly when active)
      const yOffset = opacity * -this.config.labelYOffsetMax;
      
      // Determine if this is the active (closest) label
      const isActive = distance < 0.5; // Within half viewport height
      
      return {
        index,
        labelProgress,
        opacity,
        scale,
        yOffset,
        isActive,
      };
    });
  }

  /**
   * Programmatically scroll to a specific progress value
   * @param {number} progress - Target progress (0-1)
   * @param {boolean} smooth - Use spring animation (default: true)
   */
  scrollToProgress(progress, smooth = true) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    if (smooth) {
      // Update spring target
      springPhysicsService.updateTarget(this.SPRING_IDS.SCROLL, clampedProgress);
      springPhysicsService.updateTarget(this.SPRING_IDS.SCRUBBER_FILL, clampedProgress);
      
      // Also update native scroll (will be smoothed by spring)
      const maxScroll = this.documentHeight - this.viewportHeight;
      const targetScrollY = clampedProgress * maxScroll;
      
      // Use smooth native scroll as fallback
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    } else {
      // Instant jump
      const maxScroll = this.documentHeight - this.viewportHeight;
      const targetScrollY = clampedProgress * maxScroll;
      
      window.scrollTo({
        top: targetScrollY,
        behavior: 'auto',
      });
      
      // Update springs instantly
      springPhysicsService.setValue(this.SPRING_IDS.SCROLL, clampedProgress);
      springPhysicsService.setValue(this.SPRING_IDS.SCRUBBER_FILL, clampedProgress);
    }
  }

  /**
   * Scroll to a specific section index
   * @param {number} sectionIndex - Section index
   * @param {boolean} smooth - Use spring animation
   */
  scrollToSection(sectionIndex, smooth = true) {
    if (sectionIndex < 0 || sectionIndex >= this.sectionPositions.length) {
      console.warn(`⚠️ Invalid section index: ${sectionIndex}`);
      return;
    }
    
    const position = this.sectionPositions[sectionIndex];
    const maxScroll = this.documentHeight - this.viewportHeight;
    const progress = position.top / maxScroll;
    
    this.scrollToProgress(progress, smooth);
  }

  /**
   * Toggle minimode (zoomed-out navigation view)
   * @param {boolean} enabled - Enable minimode
   */
  setMinimode(enabled) {
    this.minimodeActive = enabled;
    
    const targetScale = enabled ? this.config.minimodeScale : 1;
    const targetY = enabled ? this.config.minimodeY : 0;
    
    springPhysicsService.updateTarget(this.SPRING_IDS.MINIMODE_SCALE, targetScale);
    springPhysicsService.updateTarget(this.SPRING_IDS.MINIMODE_Y, targetY);
    
    if (this.config.debug) {
      console.log(`🔍 Minimode ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Update configuration
   * @param {Object} newConfig - Configuration overrides
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Update spring configs if provided
    if (newConfig.scrollSpring) {
      springPhysicsService.setConfig(this.SPRING_IDS.SCROLL, newConfig.scrollSpring);
    }
    if (newConfig.scrubberSpring) {
      springPhysicsService.setConfig(this.SPRING_IDS.SCRUBBER_FILL, newConfig.scrubberSpring);
    }
    if (newConfig.minimodeSpring) {
      springPhysicsService.setConfig(this.SPRING_IDS.MINIMODE_SCALE, newConfig.minimodeSpring);
      springPhysicsService.setConfig(this.SPRING_IDS.MINIMODE_Y, newConfig.minimodeSpring);
    }
  }

  /**
   * Get current state
   * @returns {Object}
   */
  getState() {
    return {
      isInitialized: this.isInitialized,
      isActive: this.isActive,
      scrollProgress: this.currentScrollProgress,
      minimodeActive: this.minimodeActive,
      sectionCount: this.sections.length,
      springs: springPhysicsService.getState(),
    };
  }

  /**
   * Enable debug mode
   */
  enableDebug() {
    this.config.debug = true;
    springPhysicsService.enableDebug();
    console.log('🐛 Orchestrator debug enabled');
  }

  /**
   * Disable debug mode
   */
  disableDebug() {
    this.config.debug = false;
    springPhysicsService.disableDebug();
    console.log('🐛 Orchestrator debug disabled');
  }

  /**
   * Cleanup and reset
   */
  destroy() {
    this.stop();
    
    // Remove springs
    Object.values(this.SPRING_IDS).forEach(id => {
      springPhysicsService.removeSpring(id);
    });
    
    // Clear callbacks
    this.onScrollProgressUpdate = null;
    this.onScrubberUpdate = null;
    this.onLabelUpdate = null;
    this.onContentTransformUpdate = null;
    
    // Reset state
    this.isInitialized = false;
    this.sections = [];
    this.sectionPositions = [];
    
    console.log('🗑️ Orchestrator destroyed');
  }
}

// Export singleton instance
const scrollAnimationOrchestrator = new ScrollAnimationOrchestrator();
export default scrollAnimationOrchestrator;

// Also export class for testing
export { ScrollAnimationOrchestrator };
