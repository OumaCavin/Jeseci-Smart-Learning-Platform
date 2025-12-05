// Assessment slice for managing assessments and results
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, endpoints } from '../../services/api';

export interface Assessment {
  id: number;
  title: string;
  description: string;
  type: 'quiz' | 'exam' | 'practice' | 'assignment';
  difficulty: 'easy' | 'medium' | 'hard';
  duration_minutes: number;
  max_attempts: number;
  passing_score: number;
  total_questions: number;
  questions: AssessmentQuestion[];
  tags: string[];
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

export interface AssessmentQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code';
  options?: string[]; // for multiple choice
  correct_answer?: string;
  points: number;
  explanation?: string;
}

export interface AssessmentAttempt {
  id: number;
  assessment_id: number;
  user_id: number;
  started_at: string;
  completed_at?: string;
  score?: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  time_taken: number; // in minutes
  answers: AssessmentAnswer[];
  feedback?: string;
}

export interface AssessmentAnswer {
  question_id: number;
  answer_text: string;
  is_correct?: boolean;
  points_earned: number;
}

export interface AssessmentState {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  attempts: AssessmentAttempt[];
  currentAttempt: AssessmentAttempt | null;
  results: AssessmentAttempt[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AssessmentState = {
  assessments: [],
  currentAssessment: null,
  attempts: [],
  currentAttempt: null,
  results: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAssessments = createAsyncThunk(
  'assessment/fetchAssessments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Assessment[]>(endpoints.assessments.list);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch assessments');
    }
  }
);

export const fetchAssessmentDetail = createAsyncThunk(
  'assessment/fetchAssessmentDetail',
  async (assessmentId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Assessment>(`${endpoints.assessments.list}${assessmentId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch assessment details');
    }
  }
);

export const createAssessment = createAsyncThunk(
  'assessment/createAssessment',
  async (assessmentData: Partial<Assessment>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Assessment>(endpoints.assessments.create, assessmentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to create assessment');
    }
  }
);

export const startAssessment = createAsyncThunk(
  'assessment/startAssessment',
  async (assessmentId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AssessmentAttempt>(`${endpoints.assessments.list}${assessmentId}/start/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to start assessment');
    }
  }
);

export const submitAssessment = createAsyncThunk(
  'assessment/submitAssessment',
  async ({ attemptId, answers }: { attemptId: number; answers: AssessmentAnswer[] }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AssessmentAttempt>(endpoints.assessments.submit, {
        attempt_id: attemptId,
        answers,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to submit assessment');
    }
  }
);

export const fetchAssessmentResults = createAsyncThunk(
  'assessment/fetchResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<AssessmentAttempt[]>(endpoints.assessments.results);
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch assessment results');
    }
  }
);

// Assessment slice
const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAssessment: (state, action: PayloadAction<Assessment>) => {
      state.currentAssessment = action.payload;
    },
    setCurrentAttempt: (state, action: PayloadAction<AssessmentAttempt>) => {
      state.currentAttempt = action.payload;
    },
    updateAnswer: (state, action: PayloadAction<{ questionId: number; answer: string }>) => {
      if (state.currentAttempt) {
        const existingAnswerIndex = state.currentAttempt.answers.findIndex(
          a => a.question_id === action.payload.questionId
        );
        if (existingAnswerIndex >= 0) {
          state.currentAttempt.answers[existingAnswerIndex].answer_text = action.payload.answer;
        } else {
          state.currentAttempt.answers.push({
            question_id: action.payload.questionId,
            answer_text: action.payload.answer,
            points_earned: 0,
          });
        }
      }
    },
    clearCurrentAttempt: (state) => {
      state.currentAttempt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assessments
      .addCase(fetchAssessments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessments = action.payload;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch assessment detail
      .addCase(fetchAssessmentDetail.fulfilled, (state, action) => {
        state.currentAssessment = action.payload;
      })
      
      // Create assessment
      .addCase(createAssessment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessments.push(action.payload);
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Start assessment
      .addCase(startAssessment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAttempt = action.payload;
      })
      .addCase(startAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Submit assessment
      .addCase(submitAssessment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAttempt = null;
        state.results.push(action.payload);
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch results
      .addCase(fetchAssessmentResults.fulfilled, (state, action) => {
        state.results = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentAssessment,
  setCurrentAttempt,
  updateAnswer,
  clearCurrentAttempt,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;