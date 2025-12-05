#!/bin/bash

echo "🔧 Fixing npm dependency conflicts..."

# Clean environment
echo "🧹 Cleaning npm cache and node_modules..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Install with memory optimization and legacy peer deps
echo "📦 Installing dependencies with fixes..."
NODE_OPTIONS="--max-old-space-size=4096" npm install --legacy-peer-deps

# Verify installation
echo "✅ Verifying installation..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed successfully!"
    
    # Check React versions
    echo "📋 Installed React versions:"
    npm list @types/react @types/react-dom react react-dom
    
    # Test compilation
    echo "🧪 Testing TypeScript compilation..."
    npx tsc --noEmit
    
    echo "🚀 Starting development server..."
    npm start
else
    echo "❌ Installation failed. Trying alternative approach..."
    
    # Alternative: Install without legacy peer deps but with force
    npm install --force
    
    # If that fails, try with --legacy-peer-deps and --force
    npm install --legacy-peer-deps --force
fi