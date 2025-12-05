import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  PlayIcon, 
  StopIcon, 
  DocumentDuplicateIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { createExecution, updateExecution, deleteExecution } from '../../store/slices/jacSlice';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { CodeExecution } from '../../types';

interface CodeExecutionPanelProps {
  initialCode?: string;
  language?: string;
  executionId?: string;
  onExecutionComplete?: (result: any) => void;
}

export const CodeExecutionPanel: React.FC<CodeExecutionPanelProps> = ({
  initialCode = '',
  language = 'javascript',
  executionId,
  onExecutionComplete
}) => {
  const dispatch = useAppDispatch();
  const { executions, isLoading } = useAppSelector(state => state.jac);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Language options
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
  ];
  
  // Load execution data if executionId is provided
  useEffect(() => {
    if (executionId && executions[executionId]) {
      const execution = executions[executionId];
      setCode(execution.code);
      setOutput(execution.output || '');
      setStatus(execution.status);
    }
  }, [executionId, executions]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);
  
  const handleExecute = async () => {
    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }
    
    setIsExecuting(true);
    setStatus('running');
    setError('');
    const startTime = Date.now();
    
    try {
      // Create new execution or update existing
      const executionData: Omit<CodeExecution, 'id'> = {
        code,
        language,
        status: 'running',
        startTime: new Date().toISOString(),
        endTime: undefined,
        output: '',
        error: '',
        duration: 0,
      };
      
      let currentExecutionId = executionId;
      
      if (!executionId) {
        const result = await dispatch(createExecution(executionData));
        if (result.payload) {
          currentExecutionId = result.payload.id;
        }
      }
      
      // Simulate code execution (replace with actual JAC API call)
      setTimeout(async () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        setExecutionTime(duration);
        
        // Mock execution result
        const isSuccess = Math.random() > 0.1; // 90% success rate
        const executionStatus = isSuccess ? 'success' : 'error';
        const mockOutput = isSuccess 
          ? `Code executed successfully!\n\nOutput:\n${code.includes('console.log') ? 'Hello from console!' : 'Program completed.'}\n\nExecution time: ${duration}ms`
          : `Runtime Error: ${language === 'javascript' ? 'ReferenceError: variable is not defined' : 'Syntax error in code'}`;
        
        setOutput(mockOutput);
        setStatus(executionStatus);
        setError(isSuccess ? '' : 'Execution failed');
        
        // Update execution in store
        if (currentExecutionId) {
          await dispatch(updateExecution({
            id: currentExecutionId,
            updates: {
              status: executionStatus,
              output: mockOutput,
              error: isSuccess ? '' : mockOutput,
              endTime: new Date().toISOString(),
              duration
            }
          }));
        }
        
        setIsExecuting(false);
        if (onExecutionComplete && isSuccess) {
          onExecutionComplete({
            status: executionStatus,
            output: mockOutput,
            duration
          });
        }
      }, 1000 + Math.random() * 2000); // 1-3 seconds execution time
      
    } catch (err) {
      setError('Failed to execute code');
      setStatus('error');
      setIsExecuting(false);
    }
  };
  
  const handleClear = () => {
    setCode('');
    setOutput('');
    setError('');
    setStatus('idle');
    setExecutionTime(0);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  const handleLoadExample = (exampleCode: string, lang: string) => {
    setCode(exampleCode);
    // Update language if needed
  };
  
  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Code Execution</h3>
          <select
            value={language}
            onChange={(e) => {/* Update language */}}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeout (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                defaultValue="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Memory Limit (MB)
              </label>
              <input
                type="number"
                min="64"
                max="2048"
                defaultValue="256"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Code Editor */}
        <div className="border-r border-gray-200">
          <div className="p-3 bg-gray-800 text-white text-sm font-mono flex items-center justify-between">
            <span>Code Editor</span>
            <div className="flex items-center space-x-2">
              {status === 'running' && <LoadingSpinner size="sm" />}
              {status === 'success' && <CheckCircleIcon className="h-4 w-4 text-green-400" />}
              {status === 'error' && <XCircleIcon className="h-4 w-4 text-red-400" />}
              <span className="text-xs text-gray-400">
                {language.toUpperCase()}
              </span>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here..."
            className="w-full h-96 p-4 font-mono text-sm border-none resize-none focus:outline-none focus:ring-0"
            style={{ minHeight: '400px' }}
          />
        </div>
        
        {/* Output Panel */}
        <div>
          <div className="p-3 bg-gray-800 text-white text-sm font-mono flex items-center justify-between">
            <span>Output</span>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              {isExecuting && <ClockIcon className="h-4 w-4" />}
              <span>{executionTime > 0 && formatExecutionTime(executionTime)}</span>
            </div>
          </div>
          <div className="p-4 h-96 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto">
            {isExecuting && (
              <div className="flex items-center space-x-2 text-blue-400">
                <LoadingSpinner size="sm" />
                <span>Executing code...</span>
              </div>
            )}
            {output && (
              <div className="whitespace-pre-wrap">{output}</div>
            )}
            {error && !isExecuting && (
              <div className="text-red-400">
                <div className="font-semibold">Error:</div>
                <div className="whitespace-pre-wrap">{error}</div>
              </div>
            )}
            {!output && !isExecuting && !error && (
              <div className="text-gray-500 italic">
                Run your code to see output here...
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {code.split('\n').length} lines • {code.length} characters
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isExecuting}
          >
            Clear
          </Button>
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !code.trim()}
            className="flex items-center space-x-2"
          >
            {isExecuting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" />
                <span>Run Code</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};