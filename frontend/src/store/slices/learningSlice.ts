// Learning slice for managing learning paths and progress
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, endpoints } from '../../services/api';

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number; // in hours
  progress: number; // percentage 0-100
  modules_count: number;
  completed_modules: number;
  thumbnail?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface LearningModule {
  id: number;
  path_id: number;
  title: string;
  description: string;
  content_type: 'video' | 'text' | 'interactive' | 'quiz';
  order: number;
  estimated_duration: number;
  completed: boolean;
  locked: boolean;
  content_url?: string;
  resources: Array<{
    title: string;
    type: string;
    url: string;
  }>;
}

export interface UserProgress {
  user_id: number;
  module_id: number;
  completed: boolean;
  score?: number;
  time_spent: number; // in minutes
  last_accessed: string;
  notes?: string;
}

export interface LearningState {
  paths: LearningPath[];
  currentPath: LearningPath | null;
  modules: LearningModule[];
  currentModule: LearningModule | null;
  progress: UserProgress[];
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    earned_at: string;
  }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  paths: [],
  currentPath: null,
  modules: [],
  currentModule: null,
  progress: [],
  achievements: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchLearningPaths = createAsyncThunk(
  'learning/fetchPaths',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<LearningPath[]>(endpoints.learning.paths);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch learning paths');
    }
  }
);

export const fetchLearningPathDetail = createAsyncThunk(
  'learning/fetchPathDetail',
  async (pathId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<LearningPath>(`${endpoints.learning.paths}${pathId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch learning path details');
    }
  }
);

export const fetchModules = createAsyncThunk(
  'learning/fetchModules',
  async (pathId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<LearningModule[]>(`${endpoints.learning.modules}?path_id=${pathId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch modules');
    }
  }
);

export const updateProgress = createAsyncThunk(
  'learning/updateProgress',
  async ({ moduleId, progressData }: { moduleId: number; progressData: Partial<UserProgress> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<UserProgress>(endpoints.learning.progress, {
        module_id: moduleId,
        ...progressData,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to update progress');
    }
  }
);

// Learning slice
const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPath: (state, action: PayloadAction<LearningPath>) => {
      state.currentPath = action.payload;
    },
    setCurrentModule: (state, action: PayloadAction<LearningModule>) => {
      state.currentModule = action.payload;
    },
    updateModuleProgress: (state, action: PayloadAction<{ moduleId: number; progress: number }>) => {
      const module = state.modules.find(m => m.id === action.payload.moduleId);
      if (module) {
        module.completed = action.payload.progress >= 100;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch learning paths
      .addCase(fetchLearningPaths.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLearningPaths.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paths = action.payload;
      })
      .addCase(fetchLearningPaths.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch learning path detail
      .addCase(fetchLearningPathDetail.fulfilled, (state, action) => {
        state.currentPath = action.payload;
      })
      
      // Fetch modules
      .addCase(fetchModules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update progress
      .addCase(updateProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update or add progress
        const existingProgressIndex = state.progress.findIndex(
          p => p.module_id === action.payload.module_id
        );
        if (existingProgressIndex >= 0) {
          state.progress[existingProgressIndex] = action.payload;
        } else {
          state.progress.push(action.payload);
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentPath,
  setCurrentModule,
  updateModuleProgress,
} = learningSlice.actions;

export default learningSlice.reducer;