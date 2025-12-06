// API Test Component for JESECI Learning Platform
// Tests AI service connectivity and functionality
// Created by Cavin Otieno

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TestResult {
  service: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  response?: string;
  error?: string;
}

const ApiTestComponent: React.FC = () => {
  const [geminiResult, setGeminiResult] = useState<TestResult>({
    service: 'Gemini',
    status: 'idle',
    message: 'Ready to test'
  });

  const [openaiResult, setOpenaiResult] = useState<TestResult>({
    service: 'OpenAI',
    status: 'idle',
    message: 'Ready to test'
  });

  const [testPrompt, setTestPrompt] = useState('Explain what JavaScript is in simple terms.');
  const [allTestsRun, setAllTestsRun] = useState(false);

  // Check API key configuration on component mount
  useEffect(() => {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!geminiKey) {
      setGeminiResult(prev => ({
        ...prev,
        status: 'error',
        message: 'API key not configured',
        error: 'VITE_GEMINI_API_KEY is not set'
      }));
    }

    if (!openaiKey) {
      setOpenaiResult(prev => ({
        ...prev,
        status: 'error',
        message: 'API key not configured',
        error: 'VITE_OPENAI_API_KEY is not set'
      }));
    }
  }, []);

  const testGeminiService = async () => {
    setGeminiResult(prev => ({ ...prev, status: 'testing', message: 'Testing Gemini API...' }));

    try {
      const { GeminiService } = await import('../../services/geminiService');
      const geminiService = new GeminiService();
      
      const response = await geminiService.generateContent(testPrompt);
      
      setGeminiResult({
        service: 'Gemini',
        status: 'success',
        message: '✅ Gemini API test successful!',
        response: response.slice(0, 500) + (response.length > 500 ? '...' : '') // Limit response length
      });
    } catch (error) {
      setGeminiResult({
        service: 'Gemini',
        status: 'error',
        message: '❌ Gemini API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testOpenAIService = async () => {
    setOpenaiResult(prev => ({ ...prev, status: 'testing', message: 'Testing OpenAI API...' }));

    try {
      const { OpenAIService } = await import('../../services/openaiService');
      const openaiService = new OpenAIService();
      
      const response = await openaiService.generateLearningContent(testPrompt);
      
      setOpenaiResult({
        service: 'OpenAI',
        status: 'success',
        message: '✅ OpenAI API test successful!',
        response: response.slice(0, 500) + (response.length > 500 ? '...' : '') // Limit response length
      });
    } catch (error) {
      setOpenaiResult({
        service: 'OpenAI',
        status: 'error',
        message: '❌ OpenAI API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const runAllTests = async () => {
    setAllTestsRun(false);
    await Promise.all([
      testGeminiService(),
      testOpenAIService()
    ]);
    setAllTestsRun(true);
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'testing': return '⟳';
      default: return '○';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🧪 AI Services Test Panel
        </h2>
        <p className="text-gray-600">
          Test the connectivity and functionality of your AI service integrations
        </p>
      </div>

      {/* Test Prompt Input */}
      <Card>
        <CardHeader>
          <CardTitle>Test Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Prompt to send to AI services:"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Enter your test prompt here..."
          />
          <div className="flex space-x-3">
            <Button onClick={runAllTests} className="flex-1">
              🚀 Run All Tests
            </Button>
            <Button 
              onClick={testGeminiService} 
              variant="outline" 
              disabled={geminiResult.status === 'testing'}
            >
              {getStatusIcon(geminiResult.status)} Test Gemini
            </Button>
            <Button 
              onClick={testOpenAIService} 
              variant="outline" 
              disabled={openaiResult.status === 'testing'}
            >
              {getStatusIcon(openaiResult.status)} Test OpenAI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gemini Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🤖 Google Gemini</span>
              <span className={`text-sm ${getStatusColor(geminiResult.status)}`}>
                {getStatusIcon(geminiResult.status)} {geminiResult.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <p className={`text-sm ${getStatusColor(geminiResult.status)}`}>
                {geminiResult.message}
              </p>
            </div>
            
            {geminiResult.response && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-800 max-h-48 overflow-y-auto">
                  {geminiResult.response}
                </div>
              </div>
            )}
            
            {geminiResult.error && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Error:</p>
                <div className="bg-red-50 p-3 rounded-lg text-xs text-red-800">
                  {geminiResult.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* OpenAI Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🧠 OpenAI GPT</span>
              <span className={`text-sm ${getStatusColor(openaiResult.status)}`}>
                {getStatusIcon(openaiResult.status)} {openaiResult.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <p className={`text-sm ${getStatusColor(openaiResult.status)}`}>
                {openaiResult.message}
              </p>
            </div>
            
            {openaiResult.response && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-800 max-h-48 overflow-y-auto">
                  {openaiResult.response}
                </div>
              </div>
            )}
            
            {openaiResult.error && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Error:</p>
                <div className="bg-red-50 p-3 rounded-lg text-xs text-red-800">
                  {openaiResult.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>📋 API Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Gemini API Key:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_GEMINI_API_KEY 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">OpenAI API Key:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_OPENAI_API_KEY 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTestComponent;