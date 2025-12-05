# JESECI Backend Setup Guide with WebSocket Support

## Quick Setup Commands

### Option 1: Complete Setup (Recommended)
```bash
# Run complete setup
./setup.sh

# After setup completes, start backend with WebSocket support
./start_websocket_backend.sh
```

### Option 2: Backend Only Setup
```bash
# Navigate to backend
cd backend

# Run comprehensive setup
./comprehensive_setup.sh

# Start backend with WebSocket support
daphne -b 0.0.0.0 -p 8001 jeseci_platform.asgi:application
```

## Environment Configuration

### Step 1: Edit .env file
After running setup, edit `backend/.env` and add your API keys:

```bash
# Open the .env file
nano backend/.env

# Add your actual API keys:
OPENAI_API_KEY=sk-your-actual-openai-key
GEMINI_API_KEY=AIza-your-actual-gemini-key
VITE_OPENAI_API_KEY=sk-your-actual-openai-key
VITE_GEMINI_API_KEY=AIza-your-actual-gemini-key
REACT_APP_OPENAI_API_KEY=sk-your-actual-openai-key
REACT_APP_GEMINI_API_KEY=AIza-your-actual-gemini-key
```

### Step 2: Load Environment Variables
```bash
# In backend directory
cd backend
source .env
```

## Script Comparison

| Script | WebSocket Support | Port | Server Type |
|--------|------------------|------|-------------|
| `setup.sh` | ❌ No | 8000 | Django runserver |
| `start_backend.sh` | ❌ No | 8000 | Django runserver |
| `start_websocket_backend.sh` | ✅ Yes | 8001 | Daphne ASGI |
| Manual Daphne | ✅ Yes | 8001 | Daphne ASGI |

## Recommended Workflow

### 1. Initial Setup
```bash
./setup.sh
```

### 2. Edit Environment Variables
```bash
# Edit backend/.env with your API keys
```

### 3. Start Backend with WebSocket
```bash
./start_websocket_backend.sh
```

### 4. Start Frontend (in new terminal)
```bash
cd frontend
npm start
```

## Access Points (with WebSocket)
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api/
- **API Documentation**: http://localhost:8001/api/schema/
- **Admin Panel**: http://localhost:8001/admin/
- **WebSocket Chat**: ws://localhost:8001/ws/chat/
- **WebSocket Notifications**: ws://localhost:8001/ws/notifications/

## Troubleshooting

### Port Conflicts
If port 8001 is in use:
```bash
# Find process using port 8001
lsof -i :8001

# Kill the process
kill -9 <PID>
```

### WebSocket Connection Issues
1. Ensure Daphne is running (not Django runserver)
2. Check frontend WebSocket URL: `ws://localhost:8001/ws/chat/`
3. Verify environment variables are loaded
4. Check Django Channels configuration in settings.py

### Environment Variables Not Loading
```bash
# Make sure you're in the backend directory
cd backend

# Load environment variables explicitly
set -a
source .env
set +a

# Verify variables are loaded
echo $DEBUG
echo $OPENAI_API_KEY
```

## WebSocket Testing
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. The frontend should show WebSocket connection to `ws://localhost:8001/ws/chat/`
5. Connection should show status "101 Switching Protocols"

## Frontend Configuration
The frontend is already configured to connect to:
- **API Base URL**: `http://localhost:8001/api/`
- **WebSocket Base URL**: `ws://localhost:8001/ws/`

No additional frontend configuration needed!