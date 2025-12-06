import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'code' | 'suggestion';
}

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  isActive: boolean;
}

interface BaseAgentChatProps {
  agent: Agent;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

const BaseAgentChat: React.FC<BaseAgentChatProps> = ({ 
  agent, 
  onSendMessage, 
  isLoading = false,
  className = ''
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm ${agent.name}. I'm here to help you with your learning journey. What would you like to explore today?`,
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate agent response
      setTimeout(() => {
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `I understand you're asking about "${inputMessage}". Let me help you with that. This is a simulated response from ${agent.name}.`,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, agentResponse]);
        setIsTyping(false);
      }, 1500);
      
      onSendMessage(inputMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const formatMessage = (content: string, type?: string) => {
    if (type === 'code') {
      return (
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto">
          <code>{content}</code>
        </pre>
      );
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  const quickPrompts = [
    "Explain this concept",
    "Give me practice exercises",
    "What are the key points?",
    "How can I improve?",
    "Show me examples"
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <Card className="mb-4">
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-4">
              {agent.avatar ? (
                <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full" />
              ) : (
                <SparklesIcon className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.description}</p>
            </div>
            <div className="ml-auto">
              <div className={`w-3 h-3 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.sender === 'agent' && (
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-2">
                      <SparklesIcon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{agent.name}</span>
                  </div>
                )}
                {message.sender === 'user' && (
                  <div className="flex items-center mb-1 justify-end">
                    <span className="text-xs font-medium text-blue-100 mr-2">{user?.name}</span>
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <UserIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <div className={message.sender === 'user' ? 'text-white' : 'text-gray-900'}>
                  {formatMessage(message.content, message.type)}
                </div>
                <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-2">
                    <SparklesIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{agent.name}</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${agent.name} anything...`}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className="px-4"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default BaseAgentChat;