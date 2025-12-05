#!/bin/bash

# Start Backend Server Script
# Starts Django development server

echo "🚀 Starting JESECI Interactive Learning Platform - Backend Server"

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
    print_info "You can also copy .env.template to .env and fill in your API keys"
    exit 1
fi

# Load environment variables
print_info "Loading environment variables..."
source .env

# Check for required environment variables
print_info "Checking required environment variables..."
required_vars=("DJANGO_SECRET_KEY" "OPENAI_API_KEY" "GEMINI_API_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"your-"* ]]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_warning "Some required environment variables are not set:"
    for var in "${missing_vars[@]}"; do
        print_warning "  - $var"
    done
    print_info "Please update your .env file with actual values"
    print_info "You can use .env.template as a reference"
    print_warning "Server will start, but API functionality may not work properly"
fi

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

# Set Python path
export PYTHONPATH="${PWD}:${PYTHONPATH}"

# Check and install WebSocket dependencies
print_info "Checking WebSocket dependencies..."
python -c "import daphne" 2>/dev/null || {
    print_warning "Daphne not installed. Installing for WebSocket support..."
    pip install daphne channels
    print_success "Daphne and Channels installed successfully"
}

print_success "WebSocket dependencies verified"

# Run database migrations
print_info "Running database migrations..."
python manage.py migrate
if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
    exit 1
fi

# Collect static files
print_info "Collecting static files..."
python manage.py collectstatic --noinput
if [ $? -eq 0 ]; then
    print_success "Static files collected"
else
    print_warning "Static file collection failed (may be normal for development)"
fi

# Display service information
print_info "====================================="
print_info "Backend Server Information:"
print_info "====================================="
print_info "Backend API: http://localhost:8001"
print_info "API Docs: http://localhost:8001/api/schema/"
print_info "Admin Panel: http://localhost:8001/admin/"
print_info "Health Check: http://localhost:8001/api/health/"
print_info "WebSocket: ws://localhost:8001/ws/chat/"
print_info "====================================="

# Start Daphne ASGI server (supports WebSockets)
print_success "Starting Daphne ASGI server (with WebSocket support)..."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

daphne -b 0.0.0.0 -p 8001 jeseci_platform.asgi:application