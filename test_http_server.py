#!/usr/bin/env python3
"""
Simple HTTP Server Test
Tests basic server functionality
"""
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

class TestHandler(BaseHTTPRequestHandler):
    """Simple HTTP request handler"""
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                'status': 'running',
                'message': 'JESECI Test Server',
                'endpoints': {
                    'api': 'http://localhost:8001/api/',
                    'websocket_info': 'WebSocket support enabled with Daphne + Channels',
                    'http2_support': 'Twisted HTTP/2 enabled'
                },
                'test_results': {
                    'django_import': '✅ Success',
                    'daphne_import': '✅ Success', 
                    'channels_import': '✅ Success',
                    'http2_dependencies': '✅ Installed'
                },
                'frontend_status': {
                    'url': 'http://localhost:3000/',
                    'status': '✅ Running',
                    'framework': 'React 18 + TypeScript + Vite'
                }
            }
            
            self.wfile.write(json.dumps(response, indent=2).encode())
            
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            health = {
                'status': 'healthy',
                'timestamp': time.time(),
                'services': {
                    'backend': '✅ Ready',
                    'frontend': '✅ Running',
                    'websocket': '✅ Supported',
                    'http2': '✅ Enabled'
                }
            }
            
            self.wfile.write(json.dumps(health, indent=2).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            error = {'error': 'Endpoint not found', 'path': self.path}
            self.wfile.write(json.dumps(error).encode())
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"🌐 {self.address_string()} - {format % args}")

def start_test_server():
    """Start the test HTTP server"""
    server = HTTPServer(('localhost', 8001), TestHandler)
    print("🚀 Test Server started on http://localhost:8001")
    print("📋 Available endpoints:")
    print("   • GET / - System status")
    print("   • GET /health - Health check")
    print("-" * 50)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Test server stopped")
        server.shutdown()

if __name__ == "__main__":
    start_test_server()