# GitHub Deployment - Quick Start Script
# Run these commands one by one in PowerShell

# ============================================
# STEP 1: Configure Git (Replace with YOUR info)
# ============================================
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# ============================================
# STEP 2: Commit Your Code
# ============================================
git commit -m "Initial commit: Fencing Club Management Platform with 14 features"

# ============================================
# STEP 3: Create GitHub Repository
# ============================================
# Go to: https://github.com/new
# - Repository name: antigravity
# - Description: Fencing Club Management Platform
# - Public or Private (your choice)
# - DO NOT check "Add README"
# - Click "Create repository"

# ============================================
# STEP 4: Push to GitHub (Replace YOUR_USERNAME)
# ============================================
git remote add origin https://github.com/YOUR_USERNAME/antigravity.git
git branch -M main
git push -u origin main

# ============================================
# STEP 5: Deploy to Vercel
# ============================================
# Go to: https://vercel.com
# - Sign in with GitHub
# - Click "Add New..." → "Project"
# - Import your "antigravity" repository
# - Click "Deploy"
# - Done! Get your live URL

# ============================================
# Your app will be live at:
# https://antigravity-xxx.vercel.app
# ============================================
