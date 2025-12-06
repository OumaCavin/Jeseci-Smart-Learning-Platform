#!/bin/bash

# Start Frontend React Application Script

echo "🎨 Starting JESECI Interactive Learning Platform - React Frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Change to frontend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/frontend"

print_info "Current directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found! Run setup.sh first."
    exit 1
fi

# Enhanced Package Manager Detection
print_info "🔍 Detecting package manager..."

# Detect package manager with priority: pnpm > npm > yarn
PACKAGE_MANAGER=""
START_COMMAND=""

if command -v pnpm >/dev/null 2>&1; then
    PACKAGE_MANAGER="pnpm"
    START_COMMAND="pnpm start"
    print_success "✅ Using pnpm (preferred package manager)"
elif command -v npm >/dev/null 2>&1; then
    PACKAGE_MANAGER="npm"
    START_COMMAND="npm start"
    print_success "✅ Using npm as fallback"
elif command -v yarn >/dev/null 2>&1; then
    PACKAGE_MANAGER="yarn"
    START_COMMAND="yarn start"
    print_warning "⚠️  Using yarn (not recommended for this project)"
else
    print_error "❌ No package manager found! Please install Node.js and npm/pnpm"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies with $PACKAGE_MANAGER..."
    
    if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
        pnpm install
    elif [ "$PACKAGE_MANAGER" = "npm" ]; then
        npm install --no-frozen-lockfile
    else
        yarn install
    fi
    
    if [ $? -eq 0 ]; then
        print_success "✅ Dependencies installed successfully with $PACKAGE_MANAGER"
    else
        print_error "❌ Failed to install dependencies"
        exit 1
    fi
else
    print_success "✅ Dependencies already installed"
fi

# Check Node.js version
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v)
    print_info "Node.js version: $NODE_VERSION"
else
    print_error "Node.js not found! Please install Node.js first."
    exit 1
fi

# Check detected package manager version
if [ "$PACKAGE_MANAGER" = "pnpm" ] && command -v pnpm >/dev/null 2>&1; then
    PNPM_VERSION=$(pnpm -v)
    print_info "pnpm version: $PNPM_VERSION"
elif [ "$PACKAGE_MANAGER" = "npm" ] && command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm -v)
    print_info "npm version: $NPM_VERSION"
elif [ "$PACKAGE_MANAGER" = "yarn" ] && command -v yarn >/dev/null 2>&1; then
    YARN_VERSION=$(yarn -v)
    print_info "yarn version: $YARN_VERSION"
fi

# Display service information
print_info "====================================="
print_info "Frontend Application Information:"
print_info "====================================="
print_info "Frontend URL: http://localhost:3000"
print_info "API Endpoint: http://localhost:8001/api/"
print_info "WebSocket: ws://localhost:8001/ws/chat/"
print_info "Built with: React 18.2.0 + TypeScript"
print_info "UI Framework: Tailwind CSS"
print_info "====================================="

print_info "Available routes after startup:"
print_info "  • / - Home/Dashboard"
print_info "  • /login - User Login"
print_info "  • /register - User Registration"
print_info "  • /dashboard - Main Dashboard"
print_info "  • /learning - Interactive Learning"
print_info "  • /progress - Progress Tracking"
print_info "  • /chat - Real-time Chat (WebSocket)"
print_info "  • /ai-assistant - AI Learning Assistant"

# Start React development server with detected package manager
print_success "Starting React development server with $PACKAGE_MANAGER..."
echo ""
echo "The application will open automatically in your browser"
echo "Press Ctrl+C to stop the server"
echo ""

# Use the detected package manager
eval $START_COMMAND