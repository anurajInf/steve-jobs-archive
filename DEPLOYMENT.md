# Deployment Guide

This guide covers deploying your Steve Jobs Archive clone to various platforms.

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy from GitHub

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Steve Jobs Archive clone"
   git branch -M main
   git remote add origin https://github.com/yourusername/steve-jobs-scroll-clone.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

   That's it! Your site will be live in ~1 minute.

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Set up and deploy: Y
   - Which scope: (select your account)
   - Link to existing project: N
   - Project name: steve-jobs-scroll-clone
   - Directory: ./ (press Enter)
   - Override settings: N

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The project includes a `vercel.json` with optimized settings:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- Asset caching: 1 year for immutable assets
- SPA routing: All routes serve `index.html`

## Deploy to Netlify

### Option 1: Drag & Drop

1. Build your project locally:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com) → Sites → Drag & Drop
3. Drag the `dist` folder to deploy

### Option 2: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Netlify Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js**
   Add base path:
   ```javascript
   export default defineConfig({
     base: '/steve-jobs-scroll-clone/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to your repo → Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages / root
   - Save

## Deploy to Cloudflare Pages

### Option 1: Dashboard Deploy

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pages → Create a project → Connect to Git
3. Select your repository
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: (none needed)
5. Save and Deploy

### Option 2: Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm i -g wrangler
   ```

2. **Login**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   npm run build
   wrangler pages deploy dist
   ```

## Deploy to AWS S3 + CloudFront

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Upload files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Configure bucket for static hosting**
   - Enable static website hosting
   - Index document: index.html
   - Error document: index.html

5. **Create CloudFront distribution**
   - Origin: Your S3 bucket
   - Viewer protocol: Redirect HTTP to HTTPS
   - Cache behavior: Cache based on selected headers
   - Error pages: 404 → /index.html (for SPA routing)

## Environment Variables (if needed)

If you need environment variables:

1. **Create `.env.local`** (never commit this!)
   ```env
   VITE_API_URL=https://api.example.com
   VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
   ```

2. **Access in code**
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. **Configure in hosting platform**
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables
   - CloudFlare: Settings → Environment variables

## Custom Domain Setup

### Vercel
1. Go to Project → Settings → Domains
2. Add your domain
3. Configure DNS (Vercel provides instructions)

### Netlify
1. Site settings → Domain management → Add custom domain
2. Update your DNS settings

### Cloudflare Pages
1. Custom domains → Set up a custom domain
2. DNS automatically configured if using Cloudflare DNS

## Post-Deployment Checklist

- [ ] Test all scroll interactions
- [ ] Verify mobile menu works
- [ ] Check image loading (all sizes)
- [ ] Test on mobile devices
- [ ] Verify cross-browser compatibility
- [ ] Test keyboard navigation
- [ ] Run Lighthouse audit
- [ ] Verify SEO meta tags
- [ ] Test social media previews
- [ ] Check HTTPS is working
- [ ] Verify custom domain (if applicable)

## Performance Optimization

### After Deployment

1. **Enable Compression**
   - Gzip/Brotli compression (usually automatic on modern hosts)

2. **CDN Configuration**
   - Asset caching headers (configured in vercel.json)
   - Image optimization

3. **Monitoring**
   - Set up Vercel Analytics (free)
   - Or use Google Analytics
   - Monitor Core Web Vitals

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Solution: Delete `node_modules` and `package-lock.json`, run `npm install`

**Error: "Out of memory"**
- Solution: Increase Node memory: `NODE_OPTIONS=--max_old_space_size=4096 npm run build`

### Routes Not Working (404s)

**Problem**: Direct URLs like `/section-2` return 404
- Solution: Ensure SPA redirect rules are configured (see vercel.json or netlify.toml)

### Images Not Loading

**Problem**: Images show broken links
- Solution: Check image paths (should be `/src/assets/...` in dev, gets processed by Vite)

### Slow Performance

**Problem**: Low Lighthouse scores
- Solutions:
  - Enable compression
  - Verify image optimization
  - Check bundle size: `npm run build -- --mode analyze`
  - Consider code splitting

## Continuous Deployment

Once deployed via Git integration:

1. **Make changes locally**
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```

2. **Automatic deployment**
   - Vercel/Netlify/Cloudflare automatically detect push
   - Build and deploy in 1-2 minutes
   - Preview URLs for pull requests

## Rollback

### Vercel
- Deployments → Click on previous deployment → "Promote to Production"

### Netlify
- Deploys → Click on previous deploy → "Publish deploy"

### Cloudflare Pages
- Deployments → Rollback to previous version

## Support

If you encounter issues:

1. Check build logs in your hosting platform
2. Verify `package.json` and `vercel.json` are committed
3. Ensure `.gitignore` doesn't exclude necessary files
4. Test build locally: `npm run build && npm run preview`

---

**Ready to deploy? Start with Vercel for the easiest experience!**

```bash
npm i -g vercel
vercel
```
