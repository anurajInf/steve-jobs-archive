/**
 * Spring Physics Service
 * Implements mass-spring-damper physics for buttery-smooth animations
 * Based on analysis of original Apple website scroll mechanics
 * 
 * Core Concept:
 * - Uses physics simulation instead of tweening
 * - Springs provide natural, organic motion
 * - Continuously running RAF loop with delta time normalization
 * - Auto-sleeps when all springs settle
 * 
 * Physics Formula:
 * F = -k * (value - target) - c * velocity
 * velocity += F * dt
 * value += velocity * dt
 */

class SpringPhysicsService {
  constructor() {
    // Spring storage
    this.springs = new Map();
    
    // Animation loop
    this.rafId = null;
    this.isRunning = false;
    this.lastTime = null;
    
    // Performance settings
    this.autoSleep = true;        // Auto-stop when all springs settle
    this.sleepThreshold = 0.001;  // Velocity below which spring is "settled"
    this.maxDeltaTime = 0.1;      // Cap dt to prevent large jumps (100ms)
    
    // Debug mode
    this.debugMode = false;
    this.debugCanvas = null;
    this.debugCtx = null;
    
    // Callbacks
    this.onUpdateCallbacks = [];
    
    // Bind methods
    this.step = this.step.bind(this);
    this.loop = this.loop.bind(this);
    
    console.log('⚙️ Spring Physics Service initialized');
  }

  /**
   * Create a new spring
   * @param {string} id - Unique identifier for this spring
   * @param {number} initialValue - Starting value
   * @param {number} target - Target value to spring towards
   * @param {number} k - Spring constant (stiffness) 0-1, higher = stiffer
   * @param {number} c - Damping constant (friction) 0-1, higher = more damping
   * @param {Object} metadata - Optional metadata for debugging
   */
  createSpring(id, initialValue = 0, target = 0, k = 0.5, c = 0.7, metadata = {}) {
    const spring = {
      id,
      value: initialValue,
      target: target,
      velocity: 0,
      k: k,           // Stiffness (0-1)
      c: c,           // Damping (0-1)
      metadata,       // For debugging
      isSettled: false,
    };
    
    this.springs.set(id, spring);
    
    if (this.debugMode) {
      console.log(`🎯 Spring created: ${id}`, spring);
    }
    
    return spring;
  }

  /**
   * Update spring target (smoothly animate to new value)
   * @param {string} id - Spring ID
   * @param {number} newTarget - New target value
   */
  updateTarget(id, newTarget) {
    const spring = this.springs.get(id);
    if (!spring) {
      console.warn(`⚠️ Spring not found: ${id}`);
      return;
    }
    
    spring.target = newTarget;
    spring.isSettled = false;
    
    // Auto-start loop if stopped
    if (!this.isRunning) {
      this.startLoop();
    }
  }

  /**
   * Set spring value directly (no animation)
   * @param {string} id - Spring ID
   * @param {number} newValue - New value
   */
  setValue(id, newValue) {
    const spring = this.springs.get(id);
    if (!spring) {
      console.warn(`⚠️ Spring not found: ${id}`);
      return;
    }
    
    spring.value = newValue;
    spring.velocity = 0;
    spring.isSettled = Math.abs(spring.value - spring.target) < this.sleepThreshold;
  }

  /**
   * Set spring configuration
   * @param {string} id - Spring ID
   * @param {Object} config - { k, c }
   */
  setConfig(id, { k, c }) {
    const spring = this.springs.get(id);
    if (!spring) {
      console.warn(`⚠️ Spring not found: ${id}`);
      return;
    }
    
    if (k !== undefined) spring.k = k;
    if (c !== undefined) spring.c = c;
  }

  /**
   * Get spring current value
   * @param {string} id - Spring ID
   * @returns {number|null}
   */
  getValue(id) {
    const spring = this.springs.get(id);
    return spring ? spring.value : null;
  }

  /**
   * Get spring data
   * @param {string} id - Spring ID
   * @returns {Object|null}
   */
  getSpring(id) {
    return this.springs.get(id);
  }

  /**
   * Remove a spring
   * @param {string} id - Spring ID
   */
  removeSpring(id) {
    const deleted = this.springs.delete(id);
    if (deleted && this.debugMode) {
      console.log(`🗑️ Spring removed: ${id}`);
    }
  }

  /**
   * Remove all springs
   */
  removeAllSprings() {
    this.springs.clear();
    if (this.debugMode) {
      console.log('🗑️ All springs removed');
    }
  }

  /**
   * Physics simulation step
   * Updates all springs based on delta time
   * @param {number} dt - Delta time in seconds
   */
  step(dt) {
    let allSettled = true;
    
    this.springs.forEach(spring => {
      // Skip if already settled
      if (spring.isSettled) return;
      
      // Calculate displacement from target
      const displacement = spring.value - spring.target;
      
      // Check if spring has settled
      if (Math.abs(spring.velocity) < this.sleepThreshold && 
          Math.abs(displacement) < this.sleepThreshold) {
        spring.value = spring.target;
        spring.velocity = 0;
        spring.isSettled = true;
        
        if (this.debugMode) {
          console.log(`😴 Spring settled: ${spring.id}`);
        }
        return;
      }
      
      // Spring is still active
      allSettled = false;
      
      // Apply spring-damper physics
      // F = -k * x - c * v
      const springForce = -spring.k * displacement;
      const dampingForce = -spring.c * spring.velocity;
      const totalForce = springForce + dampingForce;
      
      // Update velocity (Euler integration)
      spring.velocity += totalForce * dt;
      
      // Update position
      spring.value += spring.velocity * dt;
    });
    
    // Notify update callbacks
    this.notifyUpdate();
    
    // Auto-sleep if all springs settled
    if (allSettled && this.autoSleep && this.isRunning) {
      this.stopLoop();
      console.log('😴 All springs settled - loop stopped');
    }
  }

  /**
   * Animation loop (requestAnimationFrame)
   * @param {number} currentTime - High-res timestamp from RAF
   */
  loop(currentTime) {
    if (!this.isRunning) return;
    
    // Initialize lastTime on first frame
    if (this.lastTime === null) {
      this.lastTime = currentTime;
    }
    
    // Calculate delta time in seconds
    let dt = (currentTime - this.lastTime) / 1000;
    
    // Cap delta time to prevent large jumps
    // (e.g., when tab was inactive)
    dt = Math.min(dt, this.maxDeltaTime);
    
    this.lastTime = currentTime;
    
    // Update physics
    this.step(dt);
    
    // Render debug if enabled
    if (this.debugMode && this.debugCanvas) {
      this.renderDebug();
    }
    
    // Continue loop
    this.rafId = requestAnimationFrame(this.loop);
  }

  /**
   * Start animation loop
   */
  startLoop() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = null; // Reset time
    this.rafId = requestAnimationFrame(this.loop);
    
    if (this.debugMode) {
      console.log('▶️ Spring physics loop started');
    }
  }

  /**
   * Stop animation loop
   */
  stopLoop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    this.lastTime = null;
    
    if (this.debugMode) {
      console.log('⏸️ Spring physics loop stopped');
    }
  }

  /**
   * Register update callback
   * Called every frame with spring values
   * @param {Function} callback - (springs) => void
   * @returns {Function} - Unsubscribe function
   */
  onUpdate(callback) {
    if (typeof callback === 'function') {
      this.onUpdateCallbacks.push(callback);
    }
    
    return () => {
      this.onUpdateCallbacks = this.onUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all update callbacks
   */
  notifyUpdate() {
    if (this.onUpdateCallbacks.length === 0) return;
    
    // Convert springs map to object for easier access
    const springValues = {};
    this.springs.forEach((spring, id) => {
      springValues[id] = spring.value;
    });
    
    this.onUpdateCallbacks.forEach(callback => {
      try {
        callback(springValues, this.springs);
      } catch (error) {
        console.error('Error in spring update callback:', error);
      }
    });
  }

  /**
   * Enable debug mode with visual traces
   */
  enableDebug() {
    this.debugMode = true;
    this.createDebugCanvas();
    console.log('🐛 Debug mode enabled');
  }

  /**
   * Disable debug mode
   */
  disableDebug() {
    this.debugMode = false;
    this.removeDebugCanvas();
    console.log('🐛 Debug mode disabled');
  }

  /**
   * Create debug canvas overlay
   */
  createDebugCanvas() {
    if (this.debugCanvas) return;
    
    this.debugCanvas = document.createElement('canvas');
    this.debugCanvas.style.position = 'fixed';
    this.debugCanvas.style.top = '0';
    this.debugCanvas.style.left = '0';
    this.debugCanvas.style.width = '100%';
    this.debugCanvas.style.height = '100%';
    this.debugCanvas.style.pointerEvents = 'none';
    this.debugCanvas.style.zIndex = '9999';
    this.debugCanvas.width = window.innerWidth;
    this.debugCanvas.height = window.innerHeight;
    
    this.debugCtx = this.debugCanvas.getContext('2d');
    
    document.body.appendChild(this.debugCanvas);
    
    // Resize handler
    window.addEventListener('resize', () => {
      if (this.debugCanvas) {
        this.debugCanvas.width = window.innerWidth;
        this.debugCanvas.height = window.innerHeight;
      }
    });
  }

  /**
   * Remove debug canvas
   */
  removeDebugCanvas() {
    if (this.debugCanvas && this.debugCanvas.parentNode) {
      this.debugCanvas.parentNode.removeChild(this.debugCanvas);
    }
    this.debugCanvas = null;
    this.debugCtx = null;
  }

  /**
   * Render debug visualization
   */
  renderDebug() {
    if (!this.debugCtx) return;
    
    const ctx = this.debugCtx;
    const width = this.debugCanvas.width;
    const height = this.debugCanvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw spring info
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    
    let y = 20;
    this.springs.forEach(spring => {
      const status = spring.isSettled ? '😴' : '⚡';
      const text = `${status} ${spring.id}: ${spring.value.toFixed(3)} → ${spring.target.toFixed(3)} | v: ${spring.velocity.toFixed(3)}`;
      
      ctx.fillText(text, 10, y);
      y += 16;
    });
    
    // Draw FPS
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillText(`Springs: ${this.springs.size} | Running: ${this.isRunning}`, 10, height - 10);
  }

  /**
   * Get all springs state
   * @returns {Object}
   */
  getState() {
    const state = {
      isRunning: this.isRunning,
      springCount: this.springs.size,
      springs: {},
    };
    
    this.springs.forEach((spring, id) => {
      state.springs[id] = {
        value: spring.value,
        target: spring.target,
        velocity: spring.velocity,
        isSettled: spring.isSettled,
      };
    });
    
    return state;
  }

  /**
   * Reset service (stop loop, clear springs)
   */
  reset() {
    this.stopLoop();
    this.removeAllSprings();
    this.onUpdateCallbacks = [];
    console.log('🔄 Spring Physics Service reset');
  }
}

// Export singleton instance
const springPhysicsService = new SpringPhysicsService();
export default springPhysicsService;

// Also export class for testing
export { SpringPhysicsService };

/**
 * Spring Presets
 * Common configurations for different feel
 */
export const SPRING_PRESETS = {
  // Tight, responsive (good for UI elements)
  STIFF: { k: 0.8, c: 0.9 },
  
  // Balanced (good for smooth scrolling)
  SMOOTH: { k: 0.5, c: 0.7 },
  
  // Loose, bouncy (good for playful interactions)
  BOUNCY: { k: 0.3, c: 0.5 },
  
  // Very soft (good for subtle effects)
  SOFT: { k: 0.2, c: 0.8 },
  
  // Critically damped (no overshoot)
  CRITICAL: { k: 0.6, c: 1.0 },
};
