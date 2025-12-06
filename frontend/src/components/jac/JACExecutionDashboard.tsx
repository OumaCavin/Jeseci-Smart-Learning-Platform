import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchJACStats,
  createExecution,
  executeCode,
} from '../../store/slices/jacSlice';
import {
  PlayIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  EyeIcon,
  StopIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { CodeExecutionPanel } from './CodeExecutionPanel';
import { DebuggerInterface } from './DebuggerInterface';
import { REPLInterface } from './REPLInterface';
import type { CodeExecution } from '../../types/jac';

interface JACExecutionDashboardProps {
  userId?: string;
  initialCode?: string;
  className?: string;
}

export const JACExecutionDashboard: React.FC<JACExecutionDashboardProps> = ({
  userId,
  initialCode = '',
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const { executions, stats, isLoading } = useAppSelector(state => state.jac);
  
  const [activeTab, setActiveTab] = useState<'executions' | 'debugger' | 'repl' | 'stats'>('executions');
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showNewExecution, setShowNewExecution] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'success' | 'error'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReplSession, setSelectedReplSession] = useState<string | null>(null);
  
  // Load JAC stats on component mount
  useEffect(() => {
    dispatch(fetchJACStats());
  }, [dispatch]);
  
  // Load user executions
  const userExecutions = Object.values(executions).filter(execution => 
    !userId || execution.createdBy === userId
  );
  
  // Filter executions
  const filteredExecutions = userExecutions.filter(execution => {
    const matchesStatus = filterStatus === 'all' || execution.status === filterStatus;
    const matchesSearch = !searchTerm || 
      execution.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.language.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleCreateExecution = () => {
    setShowNewExecution(true);
  };
  
  const handleExecutionSelect = (executionId: string) => {
    setSelectedExecution(executionId);
  };
  
  const handleDebugExecution = (executionId: string) => {
    setSelectedExecution(executionId);
    setIsDebugMode(true);
    setActiveTab('debugger');
  };
  
  const handleReplSessionChange = (sessionId: string) => {
    setSelectedReplSession(sessionId);
  };
  
  const handleDeleteExecution = async (executionId: string) => {
    // Implementation would call deleteExecution action
    console.log('Delete execution:', executionId);
  };
  
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  const getStatusColor = (status: CodeExecution['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'timeout': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status: CodeExecution['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '🔄';
      case 'timeout': return '⏱️';
      default: return '⏸️';
    }
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">JAC Execution Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Execute, debug, and analyze your code with the JavaScript Assembly Code platform
          </p>
        </div>
        <Button onClick={handleCreateExecution}>
          <PlayIcon className="h-4 w-4 mr-2" />
          New Execution
        </Button>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'executions', label: 'Executions', icon: DocumentTextIcon },
            { id: 'repl', label: 'REPL', icon: CogIcon },
            { id: 'debugger', label: 'Debugger', icon: PlayIcon },
            { id: 'stats', label: 'Statistics', icon: ChartBarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-96">
        {/* Executions Tab */}
        {activeTab === 'executions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search executions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            {/* Execution List */}
            <div className="grid gap-4">
              {filteredExecutions.map((execution) => (
                <Card key={execution.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getStatusIcon(execution.status)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                              {execution.status.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">{execution.language}</span>
                            {execution.duration > 0 && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatDuration(execution.duration)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {execution.code.substring(0, 100)}
                            {execution.code.length > 100 && '...'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(execution.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExecutionSelect(execution.id)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDebugExecution(execution.id)}
                        disabled={execution.status !== 'success'}
                      >
                        <PlayIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Copy execution code */}}
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExecution(execution.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredExecutions.length === 0 && (
                <Card className="p-8 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No executions found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first code execution to get started'
                    }
                  </p>
                  <Button onClick={handleCreateExecution}>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    New Execution
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}
        
        {/* REPL Tab */}
        {activeTab === 'repl' && (
          <REPLInterface
            initialLanguage="javascript"
            sessionId={selectedReplSession || undefined}
            onSessionChange={handleReplSessionChange}
            className="h-full"
          />
        )}
        
        {/* Debugger Tab */}
        {activeTab === 'debugger' && selectedExecution && (
          <DebuggerInterface
            executionId={selectedExecution}
            isOpen={true}
            onClose={() => setIsDebugMode(false)}
          />
        )}
        
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Executions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalExecutions || 0}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {((stats?.successRate || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Execution Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.averageExecutionTime ? formatDuration(stats.averageExecutionTime) : '0ms'}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center">
                <CogIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(executions).filter(e => e.status === 'running').length}
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Popular Languages */}
            {stats?.popularLanguages && (
              <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Languages</h3>
                <div className="space-y-3">
                  {stats.popularLanguages.map((lang, index) => (
                    <div key={lang.language} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🔹</span>
                        <span className="font-medium text-gray-900">{lang.language}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{lang.count}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-12 text-right">
                          {lang.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Recent Activity */}
            {stats?.recentActivity && (
              <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  {stats.recentActivity.slice(0, 7).map((day) => (
                    <div key={day.date} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span>{day.executions} executions</span>
                        <span className="text-green-600">
                          {((day.successRate || 0) * 100).toFixed(0)}% success
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
      
      {/* New Execution Modal/Inline */}
      {showNewExecution && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Execution</h3>
          <CodeExecutionPanel
            initialCode={initialCode}
            language="javascript"
            onExecutionComplete={(result) => {
              setShowNewExecution(false);
              if (result.status === 'success') {
                dispatch(fetchJACStats());
              }
            }}
          />
        </div>
      )}
    </div>
  );
};