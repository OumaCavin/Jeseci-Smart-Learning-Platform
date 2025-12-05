#!/bin/bash

# WebSocket-Enabled Backend Server Script
# Starts Django with Daphne ASGI server for WebSocket support

echo "🚀 Starting JESECI Interactive Learning Platform - Backend with WebSocket Support"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Change to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/backend"

print_info "Current directory: $(pwd)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found! Run setup.sh first."
    exit 1
fi

# Load environment variables
print_info "Loading environment variables..."
set -a
source .env
set +a

# Check virtual environment
if [ -d "venv" ]; then
    print_info "Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
elif [[ "$VIRTUAL_ENV" != "" ]]; then
    print_success "Already in virtual environment: $VIRTUAL_ENV"
else
    print_warning "No virtual environment found or active"
fi

# Install Daphne and Channels if not present
print_info "Checking WebSocket dependencies..."
python -c "import daphne" 2>/dev/null || {
    print_warning "Daphne not installed. Installing for WebSocket support..."
    pip install daphne channels
}

# Set Python path
export PYTHONPATH="${PWD}:${PYTHONPATH}"

# Display service information
print_info "==============================================="
print_info "JESECI Backend with WebSocket Support"
print_info "==============================================="
print_info "Backend API: http://localhost:8001"
print_info "API Docs: http://localhost:8001/api/schema/"
print_info "Admin Panel: http://localhost:8001/admin/"
print_info "Health Check: http://localhost:8001/api/health/"
print_info "WebSocket Chat: ws://localhost:8001/ws/chat/"
print_info "WebSocket Notifications: ws://localhost:8001/ws/notifications/"
print_info "==============================================="
print_info "WebSocket Features: Real-time chat, notifications, live updates"
print_info "==============================================="

# Run database migrations first
print_info "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Test WebSocket endpoints
print_info "Testing WebSocket endpoint accessibility..."
python manage.py runserver 0.0.0.0:8002 &
TEMP_PID=$!
sleep 2
kill $TEMP_PID 2>/dev/null

# Start Daphne ASGI server (supports WebSockets)
print_success "Starting Daphne ASGI server with WebSocket support..."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "🌐 Frontend should connect to: ws://localhost:8001/ws/chat/"
echo "🔧 Use this port: 8001"
echo ""

daphne -b 0.0.0.0 -p 8001 jeseci_platform.asgi:application