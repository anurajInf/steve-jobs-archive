# Git & Deployment Quick Start

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Initialize Git

```bash
# Navigate to project
cd /Users/rajput/Desktop/steve-jobs-scroll-clone

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Steve Jobs Archive clone v1.0.0

✨ Features:
- Smooth scroll experience with spring physics
- Responsive design (mobile + desktop)
- Optimized images and bundle size
- Dynamic color theming
- Professional documentation

📦 Bundle: 79KB gzipped
🎯 Ready for production"
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `steve-jobs-scroll-clone`
3. Description: `Interactive scroll experience inspired by Steve Jobs Archive`
4. Public or Private (your choice)
5. **DO NOT** initialize with README (we have one)
6. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/steve-jobs-scroll-clone.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Deploy to Vercel (Easiest)

**Option A: Deploy from GitHub (Recommended)**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click "Deploy"
4. Done! ✨ Your site is live

**Option B: Deploy with CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

That's it! Your site will be live at `https://your-project.vercel.app`

## 📋 Pre-Deployment Checklist

Before pushing to Git, verify:

- [x] Unused assets removed
- [x] Documentation complete
- [x] Build passes (`npm run build`)
- [x] No sensitive data in code
- [x] .gitignore properly configured
- [x] package.json updated

Before deploying, update:

- [ ] Author name in `package.json`
- [ ] Repository URL in `package.json`
- [ ] GitHub repository URL
- [ ] Any environment variables (if needed)

## 🔧 Update Author & Repository

Edit `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/steve-jobs-scroll-clone"
  }
}
```

## 🌐 Custom Domain (Optional)

### On Vercel

1. Go to your project → Settings → Domains
2. Add your domain (e.g., `stevejobs.yourdomain.com`)
3. Update your DNS:
   - **Type**: CNAME
   - **Name**: stevejobs (or @)
   - **Value**: cname.vercel-dns.com

4. Vercel auto-provisions SSL certificate
5. Wait for DNS propagation (5-10 minutes)

## 📊 Post-Deployment

After deployment:

1. **Test your live site**
   - Desktop scroll experience
   - Mobile navigation
   - All images loading
   - Cross-browser compatibility

2. **Run Lighthouse audit**
   - Open DevTools (F12)
   - Lighthouse tab
   - Run audit
   - Aim for 90+ scores

3. **Share your work!** 🎉

## 🔄 Making Updates

After initial deployment:

```bash
# Make your changes
# ...

# Commit changes
git add .
git commit -m "Update: description of changes"

# Push to GitHub
git push

# Vercel auto-deploys! ✨
```

## 🆘 Troubleshooting

### Build Fails on Vercel

1. Check build logs in Vercel dashboard
2. Verify it builds locally: `npm run build`
3. Ensure all dependencies in `package.json`
4. Check Node version (should be 18+)

### Images Not Loading

1. Verify image paths are correct
2. Check browser console for errors
3. Ensure images are in `src/assets/`
4. Rebuild: `npm run build`

### 404 on Routes

1. Ensure `vercel.json` is in repository
2. Check rewrites configuration
3. Clear Vercel cache and redeploy

## 📚 Documentation Guide

Your project includes:

- **README.md** - Start here! Project overview
- **ARCHITECTURE.md** - Technical deep dive
- **DEPLOYMENT.md** - Complete deployment guide
- **CLEANUP_SUMMARY.md** - What was cleaned up
- **GIT_QUICKSTART.md** - This file

## 🎯 Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy to Vercel
3. ✅ Test live site
4. ✅ Share your creation!
5. ⭐ Star the repo (optional)
6. 📱 Share on social media

## 🚀 Deployment Platforms

Choose your platform:

| Platform | Difficulty | Time | Best For |
|----------|-----------|------|----------|
| **Vercel** | ⭐ Easy | 2 min | Recommended! |
| Netlify | ⭐ Easy | 3 min | Alternative |
| GitHub Pages | ⭐⭐ Medium | 5 min | Free hosting |
| Cloudflare | ⭐⭐ Medium | 5 min | Global CDN |

## ✨ You're Ready!

Your project is production-ready. Time to deploy! 🚀

```bash
# One command to deploy:
vercel --prod
```

---

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides.

**Issues?** Review build logs and [ARCHITECTURE.md](./ARCHITECTURE.md).

**Good luck!** 🍀
