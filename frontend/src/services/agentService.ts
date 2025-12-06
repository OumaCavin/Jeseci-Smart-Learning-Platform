import api from './api';

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'tutor' | 'curator' | 'evaluator' | 'quiz-master' | 'motivator' | 'tracker' | 'orchestrator';
  avatar?: string;
  isActive: boolean;
  capabilities: string[];
  personality: string;
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type: 'text' | 'code' | 'suggestion' | 'error';
  metadata?: {
    agentId?: string;
    conversationId?: string;
    tokenCount?: number;
    responseTime?: number;
  };
}

export interface Conversation {
  id: string;
  agentId: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    totalMessages: number;
    averageResponseTime: number;
    topics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

export interface AgentResponse {
  message: string;
  agentId: string;
  conversationId: string;
  responseTime: number;
  tokensUsed: number;
  suggestions?: string[];
  followUpQuestions?: string[];
  metadata?: {
    confidence: number;
    sources?: string[];
    reasoning?: string;
  };
}

class AgentService {
  private baseURL = '/api/agents';

  // Agent Management
  async getAgents(): Promise<Agent[]> {
    try {
      const response = await api.get(`${this.baseURL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  async getAgent(agentId: string): Promise<Agent> {
    try {
      const response = await api.get(`${this.baseURL}/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
  }

  async getActiveAgents(): Promise<Agent[]> {
    try {
      const response = await api.get(`${this.baseURL}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active agents:', error);
      throw error;
    }
  }

  // Conversation Management
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get(`${this.baseURL}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await api.get(`${this.baseURL}/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async createConversation(agentId: string, title?: string): Promise<Conversation> {
    try {
      const response = await api.post(`${this.baseURL}/conversations`, {
        agentId,
        title: title || 'New Conversation'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/conversations/${conversationId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  async updateConversationTitle(conversationId: string, title: string): Promise<Conversation> {
    try {
      const response = await api.patch(`${this.baseURL}/conversations/${conversationId}`, {
        title
      });
      return response.data;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  }

  // Chat Messaging
  async sendMessage(
    conversationId: string, 
    content: string, 
    options?: {
      includeContext?: boolean;
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<AgentResponse> {
    try {
      const response = await api.post(`${this.baseURL}/conversations/${conversationId}/messages`, {
        content,
        options: {
          includeContext: options?.includeContext ?? true,
          maxTokens: options?.maxTokens ?? 1000,
          temperature: options?.temperature ?? 0.7,
          ...options
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    try {
      const response = await api.get(`${this.baseURL}/conversations/${conversationId}/messages`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/conversations/${conversationId}/messages/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Real-time Chat (WebSocket)
  connectToAgentChat(
    conversationId: string,
    onMessage: (message: Partial<ChatMessage>) => void,
    onTyping: (agentId: string, isTyping: boolean) => void,
    onError: (error: any) => void
  ): WebSocket {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/agents/chat/${conversationId}`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'message':
            onMessage(data.payload);
            break;
          case 'typing':
            onTyping(data.payload.agentId, data.payload.isTyping);
            break;
          case 'error':
            onError(data.payload);
            break;
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = onError;
    
    return ws;
  }

  // Agent Analytics
  async getAgentAnalytics(agentId: string, timeframe = '30d'): Promise<{
    totalConversations: number;
    totalMessages: number;
    averageResponseTime: number;
    satisfaction: number;
    commonTopics: { topic: string; count: number; }[];
    hourlyActivity: { hour: number; messages: number; }[];
  }> {
    try {
      const response = await api.get(`${this.baseURL}/${agentId}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching agent analytics:', error);
      throw error;
    }
  }

  async getConversationAnalytics(conversationId: string): Promise<{
    totalMessages: number;
    messageDistribution: { user: number; agent: number; };
    averageResponseTime: number;
    topics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    engagement: number;
  }> {
    try {
      const response = await api.get(`${this.baseURL}/conversations/${conversationId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation analytics:', error);
      throw error;
    }
  }

  // Agent Configuration
  async updateAgentConfig(agentId: string, config: Partial<Agent>): Promise<Agent> {
    try {
      const response = await api.patch(`${this.baseURL}/${agentId}/config`, config);
      return response.data;
    } catch (error) {
      console.error('Error updating agent config:', error);
      throw error;
    }
  }

  async getAgentHealth(agentId: string): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    lastPing: Date;
    responseTime: number;
    errorRate: number;
    uptime: number;
  }> {
    try {
      const response = await api.get(`${this.baseURL}/${agentId}/health`);
      return response.data;
    } catch (error) {
      console.error('Error fetching agent health:', error);
      throw error;
    }
  }

  // Streaming Responses (for real-time typing indicators)
  async streamMessage(
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: any) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${api.defaults.baseURL}${this.baseURL}/conversations/${conversationId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.defaults.headers.Authorization?.split(' ')[1]}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk') {
                onChunk(data.content);
              }
            } catch (e) {
              console.error('Error parsing stream chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      onError(error);
    }
  }

  // File Upload Support
  async uploadFile(
    conversationId: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<{ url: string; filename: string; size: number; }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      const response = await api.post(`${this.baseURL}/conversations/${conversationId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

const agentService = new AgentService();
export default agentService;