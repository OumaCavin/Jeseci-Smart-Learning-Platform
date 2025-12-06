import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  startReplSession,
  executeReplCommand,
  updateReplSession,
} from '../../store/slices/jacSlice';
import { 
  PaperAirplaneIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { ReplSession, ReplCommand } from '../../types/jac';

interface REPLInterfaceProps {
  initialLanguage?: string;
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  className?: string;
}

export const REPLInterface: React.FC<REPLInterfaceProps> = ({
  initialLanguage = 'javascript',
  sessionId,
  onSessionChange,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { replSessions, isLoading } = useAppSelector(state => state.jac);
  
  const [currentSession, setCurrentSession] = useState<ReplSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize REPL session
  useEffect(() => {
    if (sessionId && replSessions[sessionId]) {
      setCurrentSession(replSessions[sessionId]);
      setCommandHistory(replSessions[sessionId].history.map(cmd => cmd.input));
    } else if (!sessionId) {
      dispatch(startReplSession(initialLanguage)).then((result) => {
        if (result.payload && onSessionChange) {
          onSessionChange(result.payload.id);
        }
      });
    }
  }, [sessionId, replSessions, initialLanguage, dispatch, onSessionChange]);
  
  // Load session data
  useEffect(() => {
    if (sessionId && replSessions[sessionId]) {
      setCurrentSession(replSessions[sessionId]);
    }
  }, [replSessions, sessionId]);
  
  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [currentSession?.history]);
  
  // Language options
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', prompt: 'js> ' },
    { value: 'typescript', label: 'TypeScript', prompt: 'ts> ' },
    { value: 'python', label: 'Python', prompt: '>>> ' },
    { value: 'ruby', label: 'Ruby', prompt: 'irb> ' },
    { value: 'php', label: 'PHP', prompt: 'php> ' },
    { value: 'java', label: 'Java', prompt: 'jshell> ' },
    { value: 'cpp', label: 'C++', prompt: 'cpp> ' },
    { value: 'rust', label: 'Rust', prompt: 'rust> ' },
  ];
  
  const currentLanguage = languageOptions.find(lang => 
    lang.value === currentSession?.language
  ) || languageOptions[0];
  
  const handleExecute = async () => {
    if (!inputValue.trim() || !currentSession || isExecuting) return;
    
    const command = inputValue.trim();
    setIsExecuting(true);
    
    try {
      await dispatch(executeReplCommand({
        sessionId: currentSession.id,
        command,
      }));
      
      // Add to history
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      
      // Clear input
      setInputValue('');
      
      // Focus back to input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
    } catch (error) {
      console.error('Failed to execute REPL command:', error);
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      handleClear();
    }
  };
  
  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
      const newIndex = historyIndex === -1 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex] || '');
    } else {
      const newIndex = historyIndex === -1 
        ? -1 
        : Math.min(commandHistory.length - 1, historyIndex + 1);
      setHistoryIndex(newIndex);
      setInputValue(newIndex === -1 ? '' : commandHistory[newIndex] || '');
    }
  };
  
  const handleClear = () => {
    if (!currentSession) return;
    
    dispatch(updateReplSession({
      id: currentSession.id,
      updates: {
        history: [],
      },
    }));
    
    setCommandHistory([]);
    setHistoryIndex(-1);
  };
  
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  
  const formatOutput = (output: string, isError: boolean = false) => {
    return output.split('\n').map((line, index) => (
      <div key={index} className={isError ? 'text-red-400' : ''}>
        {line}
      </div>
    ));
  };
  
  const getPrompt = () => {
    return currentLanguage.prompt;
  };
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <CommandLineIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">REPL</h3>
          <select
            value={currentSession?.language || initialLanguage}
            onChange={(e) => {
              // Handle language change - would typically restart session
              dispatch(startReplSession(e.target.value)).then((result) => {
                if (result.payload && onSessionChange) {
                  onSessionChange(result.payload.id);
                }
              });
            }}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languageOptions.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!currentSession?.history.length}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>
      
      {/* Output Area */}
      <div 
        ref={outputRef}
        className="h-96 overflow-auto p-4 bg-gray-900 text-gray-100 font-mono text-sm"
      >
        {currentSession?.history.length === 0 ? (
          <div className="text-gray-500 italic">
            Welcome to {currentLanguage.label} REPL!
            <br />
            Type commands below to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {currentSession?.history.map((command) => (
              <div key={command.id} className="space-y-1">
                {/* Input */}
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 text-xs font-mono mt-0.5">
                    {getPrompt()}
                  </span>
                  <div className="flex-1 text-gray-100">
                    {command.input}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(command.input)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200"
                  >
                    <DocumentDuplicateIcon className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Output */}
                {command.output && (
                  <div className="flex items-start space-x-2">
                    <span className="text-transparent">...</span>
                    <div className="flex-1 text-blue-300">
                      {formatOutput(command.output)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(command.output)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200"
                    >
                      <DocumentDuplicateIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {/* Error */}
                {command.error && (
                  <div className="flex items-start space-x-2">
                    <span className="text-transparent">...</span>
                    <div className="flex-1 text-red-400">
                      {formatOutput(command.error, true)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(command.error || '')}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200"
                    >
                      <DocumentDuplicateIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isExecuting && (
              <div className="flex items-center space-x-2 text-blue-400">
                <LoadingSpinner size="sm" />
                <span>Executing...</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="flex items-start space-x-2 p-3">
          <span className="text-gray-600 text-sm font-mono mt-2">
            {getPrompt()}
          </span>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enter ${currentLanguage.label} code...`}
              className="w-full p-2 bg-white border border-gray-300 rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
              rows={Math.max(1, Math.min(4, inputValue.split('\n').length))}
              disabled={isExecuting}
            />
          </div>
          <Button
            onClick={handleExecute}
            disabled={!inputValue.trim() || isExecuting}
            size="sm"
            className="mt-1"
          >
            {isExecuting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <PaperAirplaneIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              Commands: {currentSession?.history.length || 0}
            </span>
            {commandHistory.length > 0 && (
              <span>
                History: ↑↓ to navigate
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>Ctrl+L to clear</span>
            <span>Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};