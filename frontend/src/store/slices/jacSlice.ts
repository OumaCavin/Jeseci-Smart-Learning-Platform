import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { JACState, CodeExecution, DebugSession, ReplSession, Breakpoint, ReplCommand } from '../../types/jac';

// Initial state
const initialState: JACState = {
  executions: {},
  debugSessions: {},
  replSessions: {},
  config: null,
  stats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const createExecution = createAsyncThunk(
  'jac/createExecution',
  async (executionData: Omit<CodeExecution, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/jac/executions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(executionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create execution');
    }
    
    return await response.json();
  }
);

export const executeCode = createAsyncThunk(
  'jac/executeCode',
  async ({ executionId, code, language }: { 
    executionId: string; 
    code: string; 
    language: string; 
  }) => {
    const response = await fetch(`/api/jac/executions/${executionId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to execute code');
    }
    
    return await response.json();
  }
);

export const startDebugSession = createAsyncThunk(
  'jac/startDebugSession',
  async (executionId: string) => {
    const response = await fetch('/api/jac/debug-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ executionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to start debug session');
    }
    
    return await response.json();
  }
);

export const addBreakpoint = createAsyncThunk(
  'jac/addBreakpoint',
  async ({ debugSessionId, breakpoint }: { 
    debugSessionId: string; 
    breakpoint: Omit<Breakpoint, 'id' | 'createdAt'>; 
  }) => {
    const response = await fetch(`/api/jac/debug-sessions/${debugSessionId}/breakpoints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(breakpoint),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add breakpoint');
    }
    
    return await response.json();
  }
);

export const startReplSession = createAsyncThunk(
  'jac/startReplSession',
  async (language: string) => {
    const response = await fetch('/api/jac/repl-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to start REPL session');
    }
    
    return await response.json();
  }
);

export const executeReplCommand = createAsyncThunk(
  'jac/executeReplCommand',
  async ({ sessionId, command }: { 
    sessionId: string; 
    command: string; 
  }) => {
    const response = await fetch(`/api/jac/repl-sessions/${sessionId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to execute REPL command');
    }
    
    return await response.json();
  }
);

export const fetchJACStats = createAsyncThunk(
  'jac/fetchStats',
  async () => {
    const response = await fetch('/api/jac/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch JAC stats');
    }
    
    return await response.json();
  }
);

const jacSlice = createSlice({
  name: 'jac',
  initialState,
  reducers: {
    updateExecution: (state, action: PayloadAction<{
      id: string;
      updates: Partial<CodeExecution>;
    }>) => {
      const { id, updates } = action.payload;
      if (state.executions[id]) {
        state.executions[id] = {
          ...state.executions[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    deleteExecution: (state, action: PayloadAction<string>) => {
      delete state.executions[action.payload];
    },
    
    clearExecutions: (state) => {
      state.executions = {};
    },
    
    updateDebugSession: (state, action: PayloadAction<{
      id: string;
      updates: Partial<DebugSession>;
    }>) => {
      const { id, updates } = action.payload;
      if (state.debugSessions[id]) {
        state.debugSessions[id] = {
          ...state.debugSessions[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    terminateDebugSession: (state, action: PayloadAction<string>) => {
      const session = state.debugSessions[action.payload];
      if (session) {
        session.status = 'terminated';
        session.updatedAt = new Date().toISOString();
      }
    },
    
    updateReplSession: (state, action: PayloadAction<{
      id: string;
      updates: Partial<ReplSession>;
    }>) => {
      const { id, updates } = action.payload;
      if (state.replSessions[id]) {
        state.replSessions[id] = {
          ...state.replSessions[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    addReplCommand: (state, action: PayloadAction<{
      sessionId: string;
      command: ReplCommand;
    }>) => {
      const { sessionId, command } = action.payload;
      const session = state.replSessions[sessionId];
      if (session) {
        session.history.push(command);
        session.currentCommand = '';
        session.updatedAt = new Date().toISOString();
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create execution
    builder
      .addCase(createExecution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExecution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.executions[action.payload.id] = action.payload;
      })
      .addCase(createExecution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create execution';
      });
    
    // Execute code
    builder
      .addCase(executeCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(executeCode.fulfilled, (state, action) => {
        state.isLoading = false;
        const execution = state.executions[action.payload.id];
        if (execution) {
          Object.assign(execution, action.payload);
          execution.updatedAt = new Date().toISOString();
        }
      })
      .addCase(executeCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to execute code';
      });
    
    // Start debug session
    builder
      .addCase(startDebugSession.fulfilled, (state, action) => {
        state.debugSessions[action.payload.id] = action.payload;
      });
    
    // Add breakpoint
    builder
      .addCase(addBreakpoint.fulfilled, (state, action) => {
        const session = state.debugSessions[action.meta.arg.debugSessionId];
        if (session) {
          session.breakpoints.push(action.payload);
          session.updatedAt = new Date().toISOString();
        }
      });
    
    // Start REPL session
    builder
      .addCase(startReplSession.fulfilled, (state, action) => {
        state.replSessions[action.payload.id] = action.payload;
      });
    
    // Execute REPL command
    builder
      .addCase(executeReplCommand.fulfilled, (state, action) => {
        const session = state.replSessions[action.payload.sessionId];
        if (session) {
          session.history.push(action.payload.command);
          session.updatedAt = new Date().toISOString();
        }
      });
    
    // Fetch stats
    builder
      .addCase(fetchJACStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJACStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchJACStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const {
  updateExecution,
  deleteExecution,
  clearExecutions,
  updateDebugSession,
  terminateDebugSession,
  updateReplSession,
  addReplCommand,
  clearError,
} = jacSlice.actions;

export default jacSlice.reducer;