#!/usr/bin/env python3
"""
Minimal WebSocket Test Server
Tests WebSocket functionality without full Django setup
"""
import asyncio
import json
from daphne.server import Server
from daphne.endpoints import build_endpoint_description_strings

class TestWebSocketApp:
    """Simple WebSocket application for testing"""
    
    async def __call__(self, scope, receive, send):
        """
        Handle WebSocket connections
        """
        if scope['type'] == 'websocket':
            await self.handle_websocket(scope, receive, send)
        elif scope['type'] == 'http':
            await self.handle_http(scope, receive, send)
    
    async def handle_websocket(self, scope, receive, send):
        """Handle WebSocket connection"""
        await send({
            'type': 'websocket.accept',
            'path': scope.get('path', '/'),
        })
        
        # Send welcome message
        await send({
            'type': 'websocket.send',
            'text': json.dumps({
                'type': 'welcome',
                'message': 'WebSocket connection established!',
                'status': 'connected',
                'timestamp': asyncio.get_event_loop().time()
            })
        })
        
        # Listen for messages
        while True:
            try:
                message = await receive()
                if message['type'] == 'websocket.disconnect':
                    break
                
                if message['type'] == 'websocket.receive':
                    data = message.get('text', '')
                    await send({
                        'type': 'websocket.send',
                        'text': json.dumps({
                            'type': 'echo',
                            'original': data,
                            'response': f'Echo: {data}',
                            'timestamp': asyncio.get_event_loop().time()
                        })
                    })
            except Exception as e:
                await send({
                    'type': 'websocket.send',
                    'text': json.dumps({
                        'type': 'error',
                        'message': str(e)
                    })
                })
                break
    
    async def handle_http(self, scope, receive, send):
        """Handle HTTP requests"""
        if scope['path'] == '/':
            await send({
                'type': 'http.response.start',
                'status': 200,
                'headers': [[b'content-type', b'application/json']],
            })
            await send({
                'type': 'http.response.body',
                'body': json.dumps({
                    'status': 'running',
                    'message': 'WebSocket Test Server',
                    'endpoints': {
                        'websocket': 'ws://localhost:8001/ws/test/',
                        'http': 'http://localhost:8001/'
                    },
                    'test_instructions': {
                        'websocket': 'Connect to ws://localhost:8001/ws/test/',
                        'message': 'Send any text message to receive an echo response'
                    }
                }).encode()
            })

async def main():
    """Start the WebSocket test server"""
    print("🚀 Starting WebSocket Test Server...")
    print("📡 WebSocket URL: ws://localhost:8001/ws/test/")
    print("🌐 HTTP API: http://localhost:8001/")
    print("📋 Test Instructions:")
    print("   1. Open browser to http://localhost:8001/")
    print("   2. Connect to WebSocket at ws://localhost:8001/ws/test/")
    print("   3. Send test messages and receive echo responses")
    print("   4. Press Ctrl+C to stop")
    print("-" * 60)
    
    # Build endpoint description
    endpoint_description = build_endpoint_description_strings(
        host="127.0.0.1",
        port="8001",
    )
    
    # Create and start server
    server = Server(
        application=TestWebSocketApp(),
        endpoints=endpoint_description,
        signal_handlers=False,
    )
    
    try:
        await server.run()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")

if __name__ == "__main__":
    asyncio.run(main())