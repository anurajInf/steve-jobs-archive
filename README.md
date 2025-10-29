# Steve Jobs Archive - Scroll Clone

A beautifully crafted, interactive scroll experience inspired by the Steve Jobs Archive's "Make Something Wonderful" book. This project recreates the immersive storytelling experience with smooth scrolling animations, responsive design, and spring-based physics.

![Steve Jobs Archive Clone](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **Smooth Scroll Experience**: Native CSS scroll-snap with intelligent section detection
- **Spring-Based Animations**: Physics-based animations powered by custom spring system
- **Responsive Design**: Fully responsive from mobile to desktop with adaptive navigation
- **Dynamic Color Theming**: Icons and UI elements adapt to section backgrounds
- **Optimized Performance**: Lazy loading images, optimized bundle size, and efficient rendering
- **Accessibility**: Keyboard navigation, ARIA labels, and semantic HTML
- **Clean Architecture**: Modular component structure with separation of concerns

## 🚀 Tech Stack

- **React 19.1.1** - UI library with latest features
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **GSAP 3.13.0** - Animation library for smooth transitions
- **CSS3** - Modern CSS with scroll-snap, flexbox, and grid
- **Custom Spring Physics** - Proprietary spring animation system

## 📁 Project Structure

```
steve-jobs-scroll-clone/
├── src/
│   ├── components/          # React components
│   │   ├── MainContent.jsx          # Main container & orchestrator
│   │   ├── Section.jsx              # Section wrapper component
│   │   ├── PageContent.jsx          # Content layout component
│   │   ├── ResponsiveImage.jsx      # Optimized image component
│   │   ├── NavigationClean.jsx      # Desktop navigation
│   │   ├── ScrubScroller.jsx        # Progress scrubber with labels
│   │   ├── MobileMenu.jsx           # Mobile navigation & tree icon
│   │   └── *.css                    # Component-specific styles
│   │
│   ├── services/            # Core services
│   │   ├── scrollAnimationOrchestrator.js  # Animation coordinator
│   │   └── springPhysicsService.js         # Spring physics engine
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useSectionScroll.js      # Scroll behavior management
│   │   └── useSectionSnap.js        # Snap point detection
│   │
│   ├── config/             # Configuration files
│   │   ├── animationConfig.js       # Animation presets & timing
│   │   └── scrollAnimationConfig.js # Scroll-based animations
│   │
│   ├── data/               # Content data
│   │   └── content.js               # Sections & chapter data
│   │
│   ├── styles/             # Global styles
│   │   └── design-tokens.css        # CSS variables & tokens
│   │
│   ├── assets/             # Static assets
│   │   ├── hamburger.svg            # Menu icon
│   │   ├── treeIcon.svg             # Home/logo icon
│   │   └── photo-*.{jpg,webp}       # Optimized images
│   │
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
│
├── public/                 # Static public assets
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # Dependencies & scripts
└── README.md             # This file

```

## 🎯 Key Components

### MainContent
The orchestrator component that:
- Manages scroll state and progress
- Coordinates animations across sections
- Handles navigation and section rendering
- Integrates scroll animation orchestrator

### ScrollAnimationOrchestrator
Central service that:
- Listens to scroll events
- Calculates scroll progress
- Updates scrubber and label animations
- Triggers spring-based transitions

### SpringPhysicsService
Physics engine providing:
- Configurable spring presets (gentle, medium, snappy, tight)
- Spring simulation with damping and stiffness
- Smooth value interpolation
- Performance-optimized calculations

### ScrubScroller
Desktop navigation featuring:
- Vertical progress indicator
- Animated chapter labels
- Spring-based reveal animations
- Click-to-scroll functionality

### MobileMenu
Mobile navigation with:
- Hamburger menu overlay
- Tree icon (home button)
- Dynamic color adaptation based on section background
- Chapter list with progress indicator

### ResponsiveImage
Optimized image component:
- Responsive image loading (256px thumbnails, 1500px full-size)
- WebP format support with JPG fallback
- Lazy loading
- Proper aspect ratio handling

## 🎨 Design System

The project follows the Steve Jobs Archive design language:

**Colors:**
- Blue sections: `#0089D0`
- Gray sections: `#646464`
- Light gray: `#f1f1f1`
- Black text: `#000000`
- White text: `#FFFFFF`

**Typography:**
- Font family: `'lf'` serif (with fallbacks)
- Dynamic font sizing: `calc(max(min(14px + 0.75vw, 50px), 14.5px + 0.75vw))`
- Font features: `'rvrn', 'calt', 'kern', 'liga', 'ss03', 'ss15', 'ss18'`

**Layout:**
- Content max-width: `900px`
- Scroll-snap: mandatory on Y-axis
- Section min-height: `100vh`
- Responsive breakpoints: 768px, 1180px

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd steve-jobs-scroll-clone

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Available Scripts

- `npm run dev` - Start Vite dev server (default: http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel will auto-detect Vite and configure build settings
4. Deploy!

Or use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x

## 🎭 Animation System

The project uses a sophisticated animation orchestration system:

1. **Scroll Detection**: Tracks scroll position and calculates progress
2. **Section Mapping**: Maps scroll position to current section
3. **Spring Physics**: Applies spring-based easing to animations
4. **Label Animations**: Animates scrubber labels with staggered timing
5. **State Management**: Maintains animation state across renders

### Spring Presets

- **Gentle**: Slow, smooth transitions (damping: 0.8, stiffness: 0.1)
- **Medium**: Balanced feel (damping: 0.7, stiffness: 0.2)
- **Snappy**: Quick response (damping: 0.6, stiffness: 0.3)
- **Tight**: Minimal overshoot (damping: 0.9, stiffness: 0.4)

## 📱 Responsive Behavior

- **Desktop (> 768px)**: 
  - Side scrubber with chapter labels
  - Tree icon top-left
  - Larger font sizes

- **Mobile (≤ 768px)**:
  - Hamburger menu
  - Compact tree icon
  - Optimized spacing
  - Touch-friendly targets (44px)

## 🎨 Image Optimization

Images are optimized in two sizes:
- **Thumbnail**: 256px width (JPG) for fast loading
- **Full-size**: 1500px width (WebP) for quality display

The `ResponsiveImage` component automatically selects the appropriate size based on viewport width.

## 🔧 Configuration

### Animation Timing
Edit `src/config/animationConfig.js` to adjust:
- Scrubber reveal duration
- Label animation delays
- Spring presets
- Timing functions

### Content
Edit `src/data/content.js` to modify:
- Section content
- Chapter labels
- Image assignments
- Section types

## 🐛 Troubleshooting

**Icons not visible on mobile:**
- Ensure icons have proper contrast (check `MobileMenu.css`)
- Verify z-index stacking (should be 1002+)

**Scroll snap not working:**
- Check `scroll-snap-type` on main container
- Verify `scroll-snap-align` on sections

**Images not loading:**
- Check asset paths in `ResponsiveImage.jsx`
- Ensure images exist in `src/assets/`

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Inspired by the beautiful design of the Steve Jobs Archive's "Make Something Wonderful" book.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and attention to detail**
