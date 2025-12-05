// Agent slice for managing AI chat functionality
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';

export interface Agent {
  id: string;
  name: string;
  type: 'chat' | 'content_curator' | 'quiz_master' | 'evaluator' | 'progress_tracker' | 'motivator';
  description: string;
  avatar?: string;
  capabilities: string[];
  is_active: boolean;
  system_prompt: string;
  parameters: {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
  };
}

export interface ChatMessage {
  id: string;
  agent_id: string;
  user_id?: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    tokens_used?: number;
    response_time?: number;
    confidence?: number;
  };
  attachments?: Array<{
    type: 'image' | 'file' | 'code';
    url: string;
    name: string;
  }>;
}

export interface ChatSession {
  id: string;
  user_id: string;
  agent_ids: string[];
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  context?: {
    current_topic?: string;
    learning_objectives?: string[];
    user_level?: 'beginner' | 'intermediate' | 'advanced';
    subject_area?: string;
  };
}

export interface AgentState {
  agents: Agent[];
  activeAgents: string[];
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  streaming: boolean;
}

const initialState: AgentState = {
  agents: [],
  activeAgents: [],
  currentSession: null,
  sessions: [],
  messages: [],
  isLoading: false,
  isTyping: false,
  error: null,
  streaming: false,
};

// Async thunks
export const fetchAgents = createAsyncThunk(
  'agent/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Agent[]>('/api/chat/agents/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch agents');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'agent/sendMessage',
  async (
    { sessionId, message, agentId }: { sessionId: string; message: string; agentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<ChatMessage>('/api/chat/send/', {
        session_id: sessionId,
        message,
        agent_id: agentId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to send message');
    }
  }
);

export const createSession = createAsyncThunk(
  'agent/createSession',
  async (
    { agentIds, title }: { agentIds: string[]; title: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post<ChatSession>('/api/chat/sessions/', {
        agent_ids: agentIds,
        title,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to create session');
    }
  }
);

export const fetchSessions = createAsyncThunk(
  'agent/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ChatSession[]>('/api/chat/sessions/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch sessions');
    }
  }
);

export const loadSession = createAsyncThunk(
  'agent/loadSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ChatSession>(`/api/chat/sessions/${sessionId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to load session');
    }
  }
);

export const streamMessage = createAsyncThunk(
  'agent/streamMessage',
  async (
    { sessionId, message, agentId }: { sessionId: string; message: string; agentId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/chat/stream/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message,
          agent_id: agentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const fullContent = new TextDecoder().decode(
        new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      );
      
      return JSON.parse(fullContent) as ChatMessage;
    } catch (error: any) {
      return rejectWithValue('Failed to stream message');
    }
  }
);

// Agent slice
const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveAgents: (state, action: PayloadAction<string[]>) => {
      state.activeAgents = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.streaming = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<{ messageId: string; updates: Partial<ChatMessage> }>) => {
      const messageIndex = state.messages.findIndex(m => m.id === action.payload.messageId);
      if (messageIndex >= 0) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...action.payload.updates,
        };
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setCurrentSession: (state, action: PayloadAction<ChatSession>) => {
      state.currentSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch agents
      .addCase(fetchAgents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.payload as string;
      })
      
      // Create session
      .addCase(createSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.push(action.payload);
        state.currentSession = action.payload;
        state.messages = action.payload.messages || [];
      })
      .addCase(createSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch sessions
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      
      // Load session
      .addCase(loadSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.messages = action.payload.messages || [];
        state.activeAgents = action.payload.agent_ids;
      })
      .addCase(loadSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Stream message
      .addCase(streamMessage.pending, (state) => {
        state.isLoading = true;
        state.streaming = true;
        state.isTyping = true;
      })
      .addCase(streamMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.streaming = false;
        state.isTyping = false;
        state.messages.push(action.payload);
      })
      .addCase(streamMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.streaming = false;
        state.isTyping = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setActiveAgents,
  setIsTyping,
  setStreaming,
  addMessage,
  updateMessage,
  clearMessages,
  setCurrentSession,
} = agentSlice.actions;

export default agentSlice.reducer;