/**
 * Modern Proxy Configuration for Jeseci Interactive Learning Platform
 * Updated for React Scripts 5.x with webpack-dev-server compatibility
 * 
 * @author Cavin Otieno
 * @version 3.0.0
 * @date 2025-12-05
 */

const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

// Educational Platform Proxy Configuration
const setupProxy = (app, options) => {
    console.log('🎓 Initializing Modern Educational Platform Proxy Configuration');
    
    // API Backend Proxy
    const apiProxy = createProxyMiddleware({
        target: process.env.REACT_APP_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        logLevel: 'warn',
        ws: true,
        pathRewrite: {
            '^/api': '/api', // keep /api path
        },
        onError: (err, req, res) => {
            console.error('API Proxy Error:', err.message);
            if (!res.headersSent) {
                res.status(502).json({
                    error: 'Backend service unavailable',
                    message: 'Educational service temporarily unavailable. Please try again.',
                    timestamp: new Date().toISOString()
                });
            }
        },
        onProxyReq: (proxyReq, req, res) => {
            // Add educational context headers
            proxyReq.setHeader('X-Request-ID', `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
            proxyReq.setHeader('X-Learning-Platform', 'Jeseci');
            
            // Add user type from headers if available
            const userType = req.headers['x-user-type'] || 'student';
            proxyReq.setHeader('X-User-Type', userType);
        },
        onProxyRes: (proxyRes, req, res) => {
            // Add cache headers for educational content
            if (proxyRes.headers['content-type']?.includes('application/json')) {
                proxyRes.headers['X-Learn-Enhanced'] = 'true';
                proxyRes.headers['Cache-Control'] = 'private, max-age=300'; // 5 minutes
            }
        }
    });

    // Authentication Proxy
    const authProxy = createProxyMiddleware({
        target: process.env.REACT_APP_AUTH_URL || 'http://localhost:8000',
        changeOrigin: true,
        logLevel: 'warn',
        pathRewrite: {
            '^/auth': '/api/auth',
        },
        onError: (err, req, res) => {
            console.error('Auth Proxy Error:', err.message);
            if (!res.headersSent) {
                res.status(502).json({
                    error: 'Authentication service unavailable',
                    message: 'Login service temporarily unavailable',
                    timestamp: new Date().toISOString()
                });
            }
        }
    });

    // Content Delivery Proxy
    const contentProxy = createProxyMiddleware({
        target: process.env.REACT_APP_CONTENT_URL || 'http://localhost:8000',
        changeOrigin: true,
        logLevel: 'warn',
        pathRewrite: {
            '^/content': '/api/content',
        },
        onError: (err, req, res) => {
            console.error('Content Proxy Error:', err.message);
            if (!res.headersSent) {
                res.status(502).json({
                    error: 'Content service unavailable',
                    message: 'Educational content temporarily unavailable',
                    timestamp: new Date().toISOString()
                });
            }
        }
    });

    // Analytics Proxy
    const analyticsProxy = createProxyMiddleware({
        target: process.env.REACT_APP_ANALYTICS_URL || 'http://localhost:8000',
        changeOrigin: true,
        logLevel: 'warn',
        pathRewrite: {
            '^/analytics': '/api/analytics',
        },
        onError: (err, req, res) => {
            console.error('Analytics Proxy Error:', err.message);
            if (!res.headersSent) {
                res.status(502).json({
                    error: 'Analytics service unavailable',
                    message: 'Learning analytics temporarily unavailable',
                    timestamp: new Date().toISOString()
                });
            }
        }
    });

    // WebSocket Proxy for real-time learning
    const wsProxy = createProxyMiddleware({
        target: process.env.REACT_APP_WS_URL || 'ws://localhost:8000',
        changeOrigin: true,
        ws: true,
        onError: (err, req, socket) => {
            console.error('WebSocket Proxy Error:', err.message);
            socket.end('HTTP/1.1 502 Educational WebSocket Service Unavailable\r\n\r\n');
        }
    });

    // Register proxies
    app.use('/api', apiProxy);
    app.use('/auth', authProxy);
    app.use('/content', contentProxy);
    app.use('/analytics', analyticsProxy);
    app.use('/ws', wsProxy);
    app.use('/socket.io', wsProxy); // Socket.IO WebSocket support

    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Jeseci Frontend Proxy',
            version: '3.0.0',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            educationalMode: 'active'
        });
    });

    // Educational insights endpoint
    app.get('/api/educational-insights', (req, res) => {
        res.json({
            status: 'operational',
            platform: 'Jeseci Interactive Learning Platform',
            capabilities: {
                adaptiveLearning: true,
                realTimeAnalytics: true,
                multiModalContent: true,
                accessibilitySupport: true,
                personalizedTutoring: true
            },
            supportedFormats: ['JSON', 'WebSocket', 'Streaming', 'Interactive'],
            lastUpdated: new Date().toISOString()
        });
    });

    console.log('✅ Modern Educational Platform Proxy Configuration Initialized');
    console.log('🎯 Educational Services: ACTIVE');
    console.log('📈 Analytics Engine: ACTIVE');
    console.log('🌐 WebSocket Support: ACTIVE');
    console.log('🔐 Authentication Proxy: ACTIVE');
    console.log('📚 Content Delivery: ACTIVE');
};

module.exports = setupProxy;