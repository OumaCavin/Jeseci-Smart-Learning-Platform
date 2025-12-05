#!/bin/bash
# Automated dependency fix script for local execution
# Copy this script to your local machine and run: bash fix-local-dependencies.sh

echo "🛠️  Jeseci Platform - Local Dependency Fix"
echo "==========================================="

# Navigate to project directory (adjust path if different)
PROJECT_DIR="$HOME/projects/Jeseci-Smart-Learning-Platform/frontend"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Error: Project directory not found at $PROJECT_DIR"
    echo "Please update the PROJECT_DIR variable in this script"
    exit 1
fi

echo "📁 Project directory: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo ""
echo "🧹 Step 1: Cleaning existing installation..."
rm -rf node_modules package-lock.json
echo "✅ Cleanup completed"

echo ""
echo "📦 Step 2: Installing dependencies with memory optimization..."
NODE_OPTIONS="--max-old-space-size=4096" npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Installation successful!"
    echo ""
    echo "🚀 Step 3: Starting development server..."
    echo "Opening http://localhost:3000 in your browser..."
    npm start
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    echo ""
    echo "🔧 Troubleshooting suggestions:"
    echo "1. Increase memory: NODE_OPTIONS=\"--max-old-space-size=6144\" npm install --legacy-peer-deps"
    echo "2. Clear npm cache: npm cache clean --force"
    echo "3. Check Node.js version: node --version (recommended: 16.x or higher)"
    echo "4. Try different registry: npm config set registry https://registry.npmjs.org/"
fi