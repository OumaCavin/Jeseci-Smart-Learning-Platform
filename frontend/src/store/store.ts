// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import learningReducer from './slices/learningSlice';
import assessmentReducer from './slices/assessmentSlice';
import agentReducer from './slices/agentSlice';
import searchReducer from './slices/searchSlice';

// Root state interface
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  ui: ReturnType<typeof uiReducer>;
  learning: ReturnType<typeof learningReducer>;
  assessment: ReturnType<typeof assessmentReducer>;
  agent: ReturnType<typeof agentReducer>;
  search: ReturnType<typeof searchReducer>;
}

// Store configuration
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    learning: learningReducer,
    assessment: assessmentReducer,
    agent: agentReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'agent/addMessage',
          'agent/setLoading',
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['agent.messages', 'agent.responses'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppThunk = typeof store.dispatch;

// Store persist configuration (can be extended later)
export const persistConfig = {
  key: 'jeseci-learning',
  storage: {
    getItem: (key: string) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
      }
    },
    setItem: (key: string, value: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error setting item in localStorage:', error);
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing item from localStorage:', error);
      }
    },
  },
  // Only persist auth and ui state initially
  whitelist: ['auth', 'ui'],
};

export default store;