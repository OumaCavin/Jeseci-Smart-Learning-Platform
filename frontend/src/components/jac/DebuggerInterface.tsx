import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  startDebugSession,
  addBreakpoint,
  terminateDebugSession,
  updateDebugSession,
} from '../../store/slices/jacSlice';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import type { DebugSession, Breakpoint, Variable, CallStackFrame } from '../../types/jac';

interface DebuggerInterfaceProps {
  executionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DebuggerInterface: React.FC<DebuggerInterfaceProps> = ({
  executionId,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { debugSessions, isLoading } = useAppSelector(state => state.jac);
  
  const [debugSession, setDebugSession] = useState<DebugSession | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [watchExpression, setWatchExpression] = useState('');
  const [showAddBreakpoint, setShowAddBreakpoint] = useState(false);
  const [newBreakpointLine, setNewBreakpointLine] = useState('');
  const [breakpointCondition, setBreakpointCondition] = useState('');
  const [expandedScopes, setExpandedScopes] = useState<Set<string>>(new Set());
  
  const codeEditorRef = useRef<HTMLDivElement>(null);
  
  // Initialize debug session
  useEffect(() => {
    if (isOpen && executionId && !debugSessions[executionId]) {
      dispatch(startDebugSession(executionId));
    }
  }, [isOpen, executionId, dispatch, debugSessions]);
  
  // Load debug session
  useEffect(() => {
    if (debugSessions[executionId]) {
      setDebugSession(debugSessions[executionId]);
    }
  }, [debugSessions, executionId]);
  
  const handleStartDebug = async () => {
    if (!debugSession) return;
    
    try {
      dispatch(updateDebugSession({
        id: debugSession.id,
        updates: { status: 'active' }
      }));
      // In a real implementation, this would start the debug process
    } catch (error) {
      console.error('Failed to start debug session:', error);
    }
  };
  
  const handlePauseDebug = () => {
    if (!debugSession) return;
    
    dispatch(updateDebugSession({
      id: debugSession.id,
      updates: { status: 'paused' }
    }));
  };
  
  const handleStopDebug = () => {
    if (!debugSession) return;
    
    dispatch(terminateDebugSession(debugSession.id));
    onClose();
  };
  
  const handleStepOver = () => {
    // Step over logic
    console.log('Step over');
  };
  
  const handleStepInto = () => {
    // Step into logic
    console.log('Step into');
  };
  
  const handleStepOut = () => {
    // Step out logic
    console.log('Step out');
  };
  
  const handleAddBreakpoint = async () => {
    if (!debugSession || !newBreakpointLine) return;
    
    const breakpoint: Omit<Breakpoint, 'id' | 'createdAt'> = {
      line: parseInt(newBreakpointLine),
      condition: breakpointCondition || undefined,
      enabled: true,
      hitCount: 0,
    };
    
    try {
      await dispatch(addBreakpoint({
        debugSessionId: debugSession.id,
        breakpoint,
      }));
      
      setShowAddBreakpoint(false);
      setNewBreakpointLine('');
      setBreakpointCondition('');
    } catch (error) {
      console.error('Failed to add breakpoint:', error);
    }
  };
  
  const handleToggleBreakpoint = (breakpointId: string) => {
    // Toggle breakpoint enabled/disabled
    console.log('Toggle breakpoint:', breakpointId);
  };
  
  const handleRemoveBreakpoint = (breakpointId: string) => {
    // Remove breakpoint
    console.log('Remove breakpoint:', breakpointId);
  };
  
  const handleAddWatchExpression = () => {
    if (!watchExpression.trim() || !debugSession) return;
    
    // Add watch expression logic
    console.log('Add watch expression:', watchExpression);
    setWatchExpression('');
  };
  
  const toggleScopeExpansion = (scopeName: string) => {
    const newExpanded = new Set(expandedScopes);
    if (newExpanded.has(scopeName)) {
      newExpanded.delete(scopeName);
    } else {
      newExpanded.add(scopeName);
    }
    setExpandedScopes(newExpanded);
  };
  
  const getStatusColor = (status: DebugSession['status']) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'completed': return 'text-blue-600';
      case 'terminated': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getStatusIcon = (status: DebugSession['status']) => {
    switch (status) {
      case 'active': return '🔄';
      case 'paused': return '⏸️';
      case 'completed': return '✅';
      case 'terminated': return '⏹️';
      default: return '⏸️';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Debugger</h2>
            {debugSession && (
              <div className={`flex items-center space-x-2 ${getStatusColor(debugSession.status)}`}>
                <span className="text-lg">{getStatusIcon(debugSession.status)}</span>
                <span className="text-sm font-medium capitalize">{debugSession.status}</span>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        
        {/* Control Panel */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleStartDebug}
              disabled={debugSession?.status === 'active' || isLoading}
              size="sm"
              className="flex items-center space-x-1"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Start</span>
            </Button>
            <Button
              onClick={handlePauseDebug}
              disabled={debugSession?.status !== 'active' || isLoading}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <PauseIcon className="h-4 w-4" />
              <span>Pause</span>
            </Button>
            <Button
              onClick={handleStopDebug}
              disabled={!debugSession || isLoading}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <StopIcon className="h-4 w-4" />
              <span>Stop</span>
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button
              onClick={handleStepOver}
              disabled={debugSession?.status !== 'paused' || isLoading}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <ForwardIcon className="h-4 w-4" />
              <span>Step Over</span>
            </Button>
            <Button
              onClick={handleStepInto}
              disabled={debugSession?.status !== 'paused' || isLoading}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <BackIcon className="h-4 w-4" />
              <span>Step Into</span>
            </Button>
            <Button
              onClick={handleStepOut}
              disabled={debugSession?.status !== 'paused' || isLoading}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <ForwardIcon className="h-4 w-4" />
              <span>Step Out</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowAddBreakpoint(true)}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Breakpoint</span>
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Code Editor */}
          <div className="flex-1 flex flex-col border-r border-gray-200">
            <div className="p-3 bg-gray-800 text-white text-sm font-mono">
              Code Editor
            </div>
            <div 
              ref={codeEditorRef}
              className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto"
            >
              {/* Mock code lines */}
              <div className="space-y-1">
                {Array.from({ length: 50 }, (_, i) => {
                  const lineNumber = i + 1;
                  const hasBreakpoint = debugSession?.breakpoints.some(bp => bp.line === lineNumber);
                  const isCurrentLine = debugSession?.currentLine === lineNumber;
                  
                  return (
                    <div
                      key={lineNumber}
                      className={`flex items-start group cursor-pointer hover:bg-gray-800 ${
                        isCurrentLine ? 'bg-yellow-900 bg-opacity-30' : ''
                      }`}
                      onClick={() => {
                        setNewBreakpointLine(lineNumber.toString());
                        setShowAddBreakpoint(true);
                      }}
                    >
                      <span className="w-12 text-gray-500 text-right pr-4 select-none">
                        {lineNumber}
                      </span>
                      <div className="flex-1">
                        {lineNumber === 1 && 'function calculateSum(a, b) {'}
                        {lineNumber === 2 && '  const sum = a + b;'}
                        {lineNumber === 3 && '  console.log("Sum:", sum);'}
                        {lineNumber === 4 && '  return sum;'}
                        {lineNumber === 5 && '}'}
                        {lineNumber > 5 && `  // Line ${lineNumber}`}
                      </div>
                      {hasBreakpoint && (
                        <span className="ml-2 text-red-400 opacity-0 group-hover:opacity-100">
                          🔴
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right Panel */}
          <div className="w-96 flex flex-col">
            {/* Breakpoints */}
            <div className="border-b border-gray-200">
              <div className="p-3 bg-gray-50 text-sm font-medium text-gray-900">
                Breakpoints ({debugSession?.breakpoints.length || 0})
              </div>
              <div className="max-h-32 overflow-auto">
                {debugSession?.breakpoints.map((breakpoint) => (
                  <div
                    key={breakpoint.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`w-2 h-2 rounded-full ${
                          breakpoint.enabled ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-sm font-mono">Line {breakpoint.line}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleBreakpoint(breakpoint.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveBreakpoint(breakpoint.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )) || (
                  <div className="p-4 text-sm text-gray-500 italic">
                    No breakpoints set
                  </div>
                )}
              </div>
            </div>
            
            {/* Variables */}
            <div className="border-b border-gray-200 flex-1">
              <div className="p-3 bg-gray-50 text-sm font-medium text-gray-900">
                Variables
              </div>
              <div className="max-h-48 overflow-auto">
                {debugSession?.variables.map((variable) => (
                  <div
                    key={variable.name}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {variable.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {variable.type} • {variable.value}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="p-4 text-sm text-gray-500 italic">
                    No variables available
                  </div>
                )}
              </div>
            </div>
            
            {/* Call Stack */}
            <div className="border-b border-gray-200 flex-1">
              <div className="p-3 bg-gray-50 text-sm font-medium text-gray-900">
                Call Stack
              </div>
              <div className="max-h-48 overflow-auto">
                {debugSession?.callStack.map((frame, index) => (
                  <div
                    key={frame.id}
                    className="p-2 hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {frame.functionName}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {frame.fileName}:{frame.line}:{frame.column}
                    </div>
                  </div>
                )) || (
                  <div className="p-4 text-sm text-gray-500 italic">
                    No call stack available
                  </div>
                )}
              </div>
            </div>
            
            {/* Watch Expressions */}
            <div className="flex-1">
              <div className="p-3 bg-gray-50 text-sm font-medium text-gray-900">
                Watch Expressions
              </div>
              <div className="p-3 border-b border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    value={watchExpression}
                    onChange={(e) => setWatchExpression(e.target.value)}
                    placeholder="Enter expression to watch..."
                    size="sm"
                  />
                  <Button
                    onClick={handleAddWatchExpression}
                    disabled={!watchExpression.trim()}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="max-h-32 overflow-auto">
                {debugSession?.watchExpressions.map((watch) => (
                  <div
                    key={watch.id}
                    className="p-2 hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {watch.expression}
                    </div>
                    <div className="text-xs text-gray-500">
                      {watch.value}
                      {watch.error && (
                        <span className="text-red-500 ml-1">({watch.error})</span>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="p-4 text-sm text-gray-500 italic">
                    No watch expressions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Breakpoint Modal */}
      <Modal
        isOpen={showAddBreakpoint}
        onClose={() => setShowAddBreakpoint(false)}
        title="Add Breakpoint"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line Number
            </label>
            <Input
              type="number"
              value={newBreakpointLine}
              onChange={(e) => setNewBreakpointLine(e.target.value)}
              placeholder="Enter line number..."
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition (optional)
            </label>
            <Input
              value={breakpointCondition}
              onChange={(e) => setBreakpointCondition(e.target.value)}
              placeholder="Enter condition expression..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAddBreakpoint(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBreakpoint}
              disabled={!newBreakpointLine}
            >
              Add Breakpoint
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};