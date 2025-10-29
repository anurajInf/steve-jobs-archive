#!/bin/bash

echo "🚀 Pushing to GitHub: anuraj-rajput/steve-jobs-archive"
echo ""
echo "Please paste your GitHub Personal Access Token:"
read -s TOKEN

echo ""
echo "📤 Setting remote and pushing..."

# Add remote with token
git remote add origin https://${TOKEN}@github.com/anuraj-rajput/steve-jobs-archive.git

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View at: https://github.com/anuraj-rajput/steve-jobs-archive"
    
    # Remove token from remote URL for security
    git remote set-url origin https://github.com/anuraj-rajput/steve-jobs-archive.git
    echo "🔒 Token removed from git config for security"
    
    echo ""
    echo "🚀 Next step - Deploy to Vercel:"
    echo "   npm install -g vercel"
    echo "   vercel --prod"
else
    echo ""
    echo "❌ Push failed. Removing remote..."
    git remote remove origin
    echo "Please check your token and try again."
fi
