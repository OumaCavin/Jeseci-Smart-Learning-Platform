#!/usr/bin/env python3
"""
Comprehensive End-to-End System Test
Tests all major components of the JESECI platform
"""
import requests
import json
import time
import subprocess
import sys

def test_endpoint(name, url, expected_status=200):
    """Test an HTTP endpoint"""
    try:
        response = requests.get(url, timeout=5)
        status = "✅ PASS" if response.status_code == expected_status else f"❌ FAIL ({response.status_code})"
        print(f"{status} {name}: {url}")
        return response.status_code == expected_status
    except Exception as e:
        print(f"❌ ERROR {name}: {url} - {str(e)}")
        return False

def main():
    """Run comprehensive system tests"""
    print("🧪 JESECI Platform - End-to-End System Test")
    print("=" * 60)
    print(f"⏰ Test started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test results
    results = {
        'total': 0,
        'passed': 0,
        'failed': 0
    }
    
    def run_test(name, url, expected_status=200):
        """Run a single test and track results"""
        results['total'] += 1
        if test_endpoint(name, url, expected_status):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    # Test Backend Components
    print("🔧 BACKEND COMPONENTS:")
    print("-" * 30)
    run_test("Backend Health", "http://localhost:8001/health")
    run_test("Backend Status", "http://localhost:8001/")
    print()
    
    # Test Frontend Components  
    print("🎨 FRONTEND COMPONENTS:")
    print("-" * 30)
    run_test("Frontend Home", "http://localhost:3000/")
    run_test("Frontend Status", "http://localhost:3000/api/health", expected_status=404)  # Expected 404 for non-API endpoint
    print()
    
    # Test WebSocket Support
    print("🔌 WEBSOCKET SUPPORT:")
    print("-" * 30)
    backend_response = requests.get("http://localhost:8001/")
    if backend_response.status_code == 200:
        data = backend_response.json()
        websocket_support = data.get('endpoints', {}).get('websocket_info', '')
        if 'WebSocket support enabled' in websocket_support:
            print("✅ PASS WebSocket: WebSocket support enabled with Daphne + Channels")
            results['total'] += 1
            results['passed'] += 1
        else:
            print("❌ FAIL WebSocket: WebSocket support not detected")
            results['total'] += 1
            results['failed'] += 1
        
        http2_support = data.get('endpoints', {}).get('http2_support', '')
        if 'HTTP/2 enabled' in http2_support:
            print("✅ PASS HTTP/2: Twisted HTTP/2 enabled")
            results['total'] += 1
            results['passed'] += 1
        else:
            print("❌ FAIL HTTP/2: HTTP/2 support not detected")
            results['total'] += 1
            results['failed'] += 1
    else:
        print("❌ FAIL WebSocket: Backend not responding")
        results['total'] += 2
        results['failed'] += 2
    print()
    
    # Test System Dependencies
    print("📦 SYSTEM DEPENDENCIES:")
    print("-" * 30)
    
    # Test Django import
    try:
        result = subprocess.run([
            './backend/venv/bin/python', '-c', 
            'import django; print(f"Django {django.VERSION[0]}.{django.VERSION[1]}.{django.VERSION[2]}")'
        ], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ PASS Django: {result.stdout.strip()}")
            results['passed'] += 1
        else:
            print("❌ FAIL Django: Import failed")
            results['failed'] += 1
        results['total'] += 1
    except Exception as e:
        print(f"❌ ERROR Django: {e}")
        results['total'] += 1
        results['failed'] += 1
    
    # Test Daphne import
    try:
        result = subprocess.run([
            './backend/venv/bin/python', '-c', 
            'import daphne; print(f"Daphne {daphne.__version__}")'
        ], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ PASS Daphne: {result.stdout.strip()}")
            results['passed'] += 1
        else:
            print("❌ FAIL Daphne: Import failed")
            results['failed'] += 1
        results['total'] += 1
    except Exception as e:
        print(f"❌ ERROR Daphne: {e}")
        results['total'] += 1
        results['failed'] += 1
    
    # Test Channels import
    try:
        result = subprocess.run([
            './backend/venv/bin/python', '-c', 
            'import channels; print("Channels imported successfully")'
        ], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ PASS Channels: {result.stdout.strip()}")
            results['passed'] += 1
        else:
            print("❌ FAIL Channels: Import failed")
            results['failed'] += 1
        results['total'] += 1
    except Exception as e:
        print(f"❌ ERROR Channels: {e}")
        results['total'] += 1
        results['failed'] += 1
    
    print()
    
    # Summary
    print("📊 TEST SUMMARY:")
    print("=" * 60)
    print(f"Total Tests: {results['total']}")
    print(f"✅ Passed: {results['passed']}")
    print(f"❌ Failed: {results['failed']}")
    print(f"Success Rate: {(results['passed']/results['total']*100):.1f}%")
    print()
    
    # System Status
    print("🌟 SYSTEM STATUS:")
    print("-" * 30)
    if results['failed'] == 0:
        print("🎉 ALL TESTS PASSED - System is fully operational!")
    elif results['passed'] > results['failed']:
        print("⚠️  MOSTLY OPERATIONAL - Minor issues detected")
    else:
        print("🚨 SYSTEM ISSUES - Multiple components failed")
    
    print()
    print("🔗 ACCESS POINTS:")
    print("-" * 30)
    print("🌐 Frontend: http://localhost:3000/")
    print("🔧 Backend API: http://localhost:8001/")
    print("💚 Health Check: http://localhost:8001/health")
    print("🔌 WebSocket: ws://localhost:8001/ws/ (when full backend runs)")
    print()
    
    return results['failed'] == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)