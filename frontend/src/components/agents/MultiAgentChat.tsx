import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import BaseAgentChat from './BaseAgentChat';
import { 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  type: 'tutor' | 'curator' | 'evaluator' | 'quiz-master' | 'motivator' | 'tracker' | 'orchestrator';
  isActive: boolean;
  color: string;
}

interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  messages: any[];
  isActive: boolean;
}

interface MultiAgentChatProps {
  onSendMessage?: (agentId: string, message: string) => void;
  className?: string;
}

const MultiAgentChat: React.FC<MultiAgentChatProps> = ({ 
  onSendMessage,
  className = ''
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [availableAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Learning Tutor',
      description: 'Personalized tutoring and explanations',
      avatar: '',
      type: 'tutor',
      isActive: true,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: '2',
      name: 'Content Curator',
      description: 'Curates and recommends learning materials',
      avatar: '',
      type: 'curator',
      isActive: true,
      color: 'from-green-400 to-green-600'
    },
    {
      id: '3',
      name: 'Knowledge Evaluator',
      description: 'Assesses your understanding and progress',
      avatar: '',
      type: 'evaluator',
      isActive: true,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: '4',
      name: 'Quiz Master',
      description: 'Creates and conducts assessments',
      avatar: '',
      type: 'quiz-master',
      isActive: true,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: '5',
      name: 'Motivator',
      description: 'Provides encouragement and motivation',
      avatar: '',
      type: 'motivator',
      isActive: true,
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: '6',
      name: 'Progress Tracker',
      description: 'Tracks and analyzes your learning journey',
      avatar: '',
      type: 'tracker',
      isActive: true,
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      id: '7',
      name: 'System Orchestrator',
      description: 'Coordinates all AI agents and learning activities',
      avatar: '',
      type: 'orchestrator',
      isActive: true,
      color: 'from-red-400 to-red-600'
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      agentId: '1',
      agentName: 'Learning Tutor',
      messages: [],
      isActive: true
    }
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [showAgentSelector, setShowAgentSelector] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeAgent = availableAgents.find(a => a.id === activeConversation?.agentId);

  const handleSendMessage = (agentId: string, message: string) => {
    // Add message to conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.agentId === agentId 
          ? { 
              ...conv, 
              messages: [...conv.messages, {
                id: Date.now().toString(),
                content: message,
                sender: 'user',
                timestamp: new Date()
              }]
            }
          : conv
      )
    );

    // Call parent handler if provided
    if (onSendMessage) {
      onSendMessage(agentId, message);
    }
  };

  const startNewConversation = (agent: Agent) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      agentId: agent.id,
      agentName: agent.name,
      messages: [],
      isActive: true
    };

    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
    setShowAgentSelector(false);
  };

  const closeConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    // If closing active conversation, switch to another one
    if (activeConversationId === conversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      }
    }
  };

  const switchConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'tutor': return '🎓';
      case 'curator': return '📚';
      case 'evaluator': return '📊';
      case 'quiz-master': return '❓';
      case 'motivator': return '💪';
      case 'tracker': return '📈';
      case 'orchestrator': return '🎭';
      default: return '🤖';
    }
  };

  if (!activeAgent || !activeConversation) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <Card className="p-8 text-center">
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Agent Selected</h3>
          <p className="text-gray-600 mb-4">Choose an AI agent to start your learning conversation</p>
          <Button onClick={() => setShowAgentSelector(true)}>
            Select Agent
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex h-full ${className}`}>
      {/* Conversation Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">AI Agents</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAgentSelector(true)}
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            <span>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => switchConversation(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className={`w-8 h-8 bg-gradient-to-br ${availableAgents.find(a => a.id === conversation.agentId)?.color || 'from-gray-400 to-gray-600'} rounded-full flex items-center justify-center mr-3`}>
                    <span className="text-white text-xs">
                      {getAgentTypeIcon(availableAgents.find(a => a.id === conversation.agentId)?.type || '')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.agentName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                {conversations.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeConversation(conversation.id);
                    }}
                    className="ml-2"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Agent Selector Modal */}
        {showAgentSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Select AI Agent</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAgentSelector(false)}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => startNewConversation(agent)}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${agent.color} rounded-full flex items-center justify-center mr-3`}>
                          <span className="text-white text-sm">
                            {getAgentTypeIcon(agent.type)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{agent.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{agent.type}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <BaseAgentChat
          agent={activeAgent}
          onSendMessage={(message) => handleSendMessage(activeAgent.id, message)}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default MultiAgentChat;