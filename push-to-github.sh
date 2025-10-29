#!/bin/bash

# GitHub Push Helper Script
# Make this executable: chmod +x push-to-github.sh

echo "🚀 Pushing to GitHub: anuraj-rajput/steve-jobs-archive"
echo ""
echo "If you haven't created the repository yet:"
echo "1. Go to: https://github.com/new"
echo "2. Name: steve-jobs-archive"
echo "3. Don't initialize with README"
echo "4. Click 'Create repository'"
echo ""
echo "Enter your GitHub Personal Access Token:"
echo "(Get one at: https://github.com/settings/tokens)"
read -s TOKEN

# Set remote with token
git remote set-url origin https://${TOKEN}@github.com/anuraj-rajput/steve-jobs-archive.git

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View at: https://github.com/anuraj-rajput/steve-jobs-archive"
    echo ""
    echo "🚀 Ready to deploy to Vercel:"
    echo "   npm install -g vercel"
    echo "   vercel --prod"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Repository exists on GitHub"
    echo "2. Token has correct permissions (repo scope)"
    echo "3. You're logged in as anuraj-rajput"
fi

# Remove token from remote URL for security
git remote set-url origin https://github.com/anuraj-rajput/steve-jobs-archive.git

echo ""
echo "🔒 Token removed from git remote for security"
