# Architecture Documentation

## Overview

This project implements a sophisticated scroll-based storytelling experience with a clean, modular architecture. The system is built around three core pillars: **Component Composition**, **Animation Orchestration**, and **State Management**.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         MainContent                          │
│  (Orchestrator - manages state, scroll, and rendering)      │
└─────────────┬───────────────────────────────────────────────┘
              │
              ├──> ScrollAnimationOrchestrator (Service)
              │    └──> SpringPhysicsService
              │
              ├──> ScrubScroller (Desktop Navigation)
              │
              ├──> MobileMenu (Mobile Navigation)
              │
              └──> Section Components (Content Rendering)
                   ├──> PageContent
                   ├──> ResponsiveImage
                   └──> Text/Quote sections
```

## Core Components

### 1. MainContent (Orchestrator)

**Location**: `src/components/MainContent.jsx`

**Responsibilities**:
- Central state management for scroll position
- Coordination of all child components
- Section rendering based on data structure
- Integration of animation orchestrator

**Key State**:
```javascript
{
  scrollProgress: number,      // Overall scroll progress (0-1)
  scrubberProgress: number,    // Scrubber animation progress
  labelAnimations: array,      // Label animation states
  currentSection: string,      // Active section/chapter
  isOrchestratorReady: boolean // Orchestrator init state
}
```

**Data Flow**:
1. Imports section data from `content.js`
2. Initializes `scrollAnimationOrchestrator`
3. Receives scroll updates via callbacks
4. Passes state down to navigation components
5. Renders sections dynamically based on type

### 2. ScrollAnimationOrchestrator

**Location**: `src/services/scrollAnimationOrchestrator.js`

**Purpose**: Central animation coordinator that translates scroll events into animated states.

**Key Methods**:
- `init(sections, callbacks)` - Initialize with section data and update callbacks
- `start()` - Begin listening to scroll events
- `stop()` - Cleanup and stop listening
- `scrollToProgress(progress)` - Programmatic scrolling

**Animation Pipeline**:
```
Scroll Event
    ↓
Calculate Progress (0-1)
    ↓
Map to Section
    ↓
Update Scrubber Position (Spring Physics)
    ↓
Calculate Label Animations (Stagger + Spring)
    ↓
Fire Callbacks
    ↓
Components Re-render
```

**Integration Points**:
- Listens to: `window.scroll`, `window.resize`
- Updates: `scrollProgress`, `scrubberProgress`, `labelAnimations`
- Uses: `SpringPhysicsService` for smooth transitions

### 3. SpringPhysicsService

**Location**: `src/services/springPhysicsService.js`

**Purpose**: Physics-based animation engine for natural motion.

**Spring Equation**:
```
acceleration = -stiffness * displacement - damping * velocity
velocity += acceleration * deltaTime
position += velocity * deltaTime
```

**Presets**:
| Preset  | Damping | Stiffness | Use Case              |
|---------|---------|-----------|----------------------|
| gentle  | 0.8     | 0.1       | Slow, smooth         |
| medium  | 0.7     | 0.2       | Balanced (default)   |
| snappy  | 0.6     | 0.3       | Quick response       |
| tight   | 0.9     | 0.4       | Minimal overshoot    |

**API**:
```javascript
// Create spring
const spring = createSpring(initialValue, 'medium');

// Update spring
const newValue = spring.update(targetValue, deltaTime);

// Check completion
if (spring.isAtRest()) { /* animation complete */ }
```

### 4. Section Component

**Location**: `src/components/Section.jsx`

**Purpose**: Wrapper component that applies scroll-snap and styling.

**Props**:
```javascript
{
  id: string,           // Unique section identifier
  children: ReactNode,  // Section content
  gray: boolean,        // Gray background
  blue: boolean,        // Blue background
  black: boolean,       // Black background
  cover: boolean        // Cover page styling
}
```

**Features**:
- Scroll-snap alignment
- Background color management via data attributes
- Minimum height constraints
- Accessibility (section landmarks)

### 5. Navigation Components

#### ScrubScroller (Desktop)

**Location**: `src/components/ScrubScroller.jsx`

**Features**:
- Vertical progress indicator
- Chapter labels with spring animations
- Click-to-scroll functionality
- Active chapter highlighting

**Animation Logic**:
```javascript
// Each label has its own animation state
{
  opacity: springValue,    // 0 to 1 based on scroll
  y: springValue,          // Vertical position
  active: boolean          // Current chapter
}
```

**Responsive**:
- Visible: > 768px
- Position: Fixed right side
- Z-index: 1000

#### MobileMenu

**Location**: `src/components/MobileMenu.jsx`

**Features**:
- Tree icon (home button) - always visible
- Hamburger menu - mobile only
- Dynamic icon colors based on section background
- Full-screen overlay menu

**Background Detection**:
```javascript
// Detects section at top of viewport
const checkBackground = () => {
  const sections = document.querySelectorAll('.book-page');
  // Find section at top
  // Check if it has [data-blue] attribute
  // Update icon color accordingly
};
```

**Color Logic**:
- White/Gray sections → Black icons
- Blue sections → White icons
- Smooth transitions with CSS filters

### 6. Content Components

#### PageContent

**Location**: `src/components/PageContent.jsx`

**Purpose**: Content layout wrapper with max-width constraints.

**Variants**:
- Cover page: Centered, reduced padding
- Quote page: Italic text, centered
- Text page: Standard paragraph layout
- Black page: White text on black background

#### ResponsiveImage

**Location**: `src/components/ResponsiveImage.jsx`

**Purpose**: Optimized image loading with responsive sources.

**Image Strategy**:
```html
<picture>
  <source 
    srcset="photo-X~1500.webp" 
    type="image/webp" 
    media="(min-width: 768px)" 
  />
  <source 
    srcset="photo-X~256.jpg" 
    type="image/jpeg" 
  />
  <img src="photo-X~256.jpg" />
</picture>
```

**Benefits**:
- WebP for modern browsers (better compression)
- JPG fallback for compatibility
- Mobile gets smaller images (256px)
- Desktop gets full-size (1500px)
- Lazy loading built-in

## Data Architecture

### Content Structure

**Location**: `src/data/content.js`

**Schema**:
```javascript
{
  sections: [
    {
      id: string,              // Unique identifier
      type: string,            // 'cover' | 'quote' | 'text' | 'title' | 'image'
      pageType: string,        // 'cover' | 'text' | 'black'
      chapter: string,         // Chapter name
      sticky: string,          // Sticky label text
      scrubber: string,        // Scrubber label text
      gray/blue/black: bool,   // Background color flags
      title: string,           // Section title
      subtitle: string,        // Section subtitle
      paragraphs: array,       // Text content
      photoNumber: number,     // Image reference
      caption: string,         // Image caption
      coverPhoto: number       // Cover page photo
    }
  ],
  
  CHAPTER_LABELS: [
    {
      id: number,              // Chapter index
      label: string,           // Display name
      display: boolean         // Show in navigation
    }
  ]
}
```

### Configuration Files

#### animationConfig.js

**Purpose**: Centralized animation timing and presets.

```javascript
{
  // Timing
  SCRUBBER_REVEAL: number,
  LABEL_DELAY_BASE: number,
  LABEL_STAGGER: number,
  
  // Spring Presets
  GENTLE/MEDIUM/SNAPPY/TIGHT: { damping, stiffness }
}
```

#### scrollAnimationConfig.js

**Purpose**: Scroll-based animation configurations.

```javascript
{
  scrollTriggers: [
    {
      element: selector,
      start: string,
      end: string,
      animations: [ /* GSAP animations */ ]
    }
  ]
}
```

## Custom Hooks

### useSectionScroll

**Location**: `src/hooks/useSectionScroll.js`

**Purpose**: Intelligent scroll behavior management.

**Features**:
- Smooth scrolling between sections
- Keyboard navigation (Arrow Up/Down)
- Prevents default scroll hijacking
- Debounced scroll handling

**Usage**:
```javascript
const MainContent = () => {
  useSectionScroll(enabled); // Pass true to activate
  // ...
};
```

### useSectionSnap

**Location**: `src/hooks/useSectionSnap.js`

**Purpose**: Detect and manage scroll snap points.

**Features**:
- Identifies current snapped section
- Fires callbacks on section change
- Handles edge cases (top/bottom)
- Debounced for performance

## Styling Architecture

### Design Tokens

**Location**: `src/styles/design-tokens.css`

**Variables**:
```css
:root {
  --background-blue: #0089D0;
  --background-gray: #646464;
  --background-light-gray: #f1f1f1;
  --text-white: #FFF;
  --text-black: #000000;
  --content-max-width: 900px;
  /* ... */
}
```

### Component Styles

Each component has its own CSS file following BEM-like conventions:

- `MainContent.css` - Cover pages, blue sections, figures
- `Section.css` - Section backgrounds, scroll-snap
- `PageContent.css` - Content layouts, typography
- `ScrubScroller.css` - Navigation styling
- `MobileMenu.css` - Mobile-specific styles
- `ResponsiveImage.css` - Image containers

### Responsive Strategy

**Breakpoints**:
- Mobile: ≤ 768px
- Tablet: 769px - 1180px
- Desktop: > 1180px

**Approach**:
- Mobile-first base styles
- Progressive enhancement via `@media (min-width: ...)`
- Touch-friendly targets (44px minimum)
- Reduced motion support

## Performance Optimizations

### 1. Image Optimization
- Responsive image sources
- WebP format with fallback
- Lazy loading
- Proper sizing (256px/1500px)

### 2. Bundle Optimization
- Vite code splitting
- Tree shaking
- Minification
- Dead code elimination

### 3. Runtime Performance
- Debounced scroll listeners
- RequestAnimationFrame for animations
- Memoized calculations
- Efficient re-renders (React.memo where needed)

### 4. CSS Performance
- GPU-accelerated transforms
- Will-change hints
- Scroll-snap (native browser feature)
- Minimal repaints

## Build & Deployment

### Build Process

1. **Development** (`npm run dev`)
   - Vite dev server with HMR
   - Fast refresh
   - Source maps

2. **Production** (`npm run build`)
   - Vite production build
   - Asset optimization
   - Code splitting
   - Hash-based caching

### Output Structure

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── vendor-[hash].js     # Third-party libs
│   ├── index-[hash].css     # Styles
│   └── *.{jpg,webp,svg}     # Optimized images
```

### Deployment Targets

- **Vercel** (recommended): Auto-deploy from Git
- **Netlify**: Drag & drop or Git integration
- **Static Hosting**: Any CDN (CloudFlare, AWS S3, etc.)

## Error Handling

### Graceful Degradation

- CSS scroll-snap fallback to normal scroll
- Missing images show alt text
- Animation failures don't break layout
- Mobile menu fallback to simple list

### Edge Cases

- **No JavaScript**: Basic content still accessible
- **Slow Network**: Thumbnails load first
- **Old Browsers**: Polyfills via Vite
- **Reduced Motion**: CSS media query support

## Testing Strategy

### Manual Testing Checklist

- [ ] Desktop scroll experience
- [ ] Mobile navigation
- [ ] Keyboard accessibility
- [ ] Image loading (throttled network)
- [ ] Cross-browser compatibility
- [ ] Responsive breakpoints
- [ ] Animation performance (60fps)

### Recommended Tools

- Lighthouse (Performance audit)
- React DevTools (Component profiling)
- Network throttling (Image optimization)
- Accessibility Inspector (A11y)

## Future Enhancements

### Potential Improvements

1. **Animations**
   - Parallax effects on images
   - Text reveal animations
   - Micro-interactions

2. **Performance**
   - Intersection Observer for lazy rendering
   - Virtual scrolling for long content
   - Image CDN integration

3. **Features**
   - Dark mode toggle
   - Reading progress indicator
   - Share functionality
   - Print-friendly layout

4. **Accessibility**
   - Screen reader announcements
   - Focus management
   - High contrast mode

## Maintenance

### Adding New Sections

1. Add section data to `src/data/content.js`
2. Add images to `src/assets/` (if needed)
3. Update `CHAPTER_LABELS` array
4. Test scroll behavior
5. Verify responsive layout

### Modifying Animations

1. Edit presets in `src/config/animationConfig.js`
2. Test across devices
3. Check performance (should maintain 60fps)
4. Update documentation

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update safely
npm update

# Major version updates (careful!)
npm install react@latest react-dom@latest
```

## Troubleshooting

### Common Issues

**Scroll snap not working**
- Check `scroll-snap-type` on main container
- Verify `scroll-snap-align` on sections
- Ensure sections are direct children

**Images not loading**
- Verify paths in `ResponsiveImage.jsx`
- Check asset existence in `src/assets/`
- Inspect network tab for 404s

**Animations choppy**
- Check FPS in DevTools Performance tab
- Reduce spring stiffness
- Verify no memory leaks

**Mobile menu not visible**
- Check z-index stacking
- Verify media query breakpoints
- Inspect icon color contrast

---

**Last Updated**: October 29, 2025  
**Version**: 1.0.0
