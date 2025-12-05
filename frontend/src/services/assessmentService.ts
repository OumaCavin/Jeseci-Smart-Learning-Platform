import api from './api';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'code' | 'drag-drop' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    alt?: string;
  };
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimit: number; // in minutes
  totalPoints: number;
  passingScore: number;
  questionCount: number;
  questions: Question[];
  isAdaptive: boolean;
  randomizeQuestions: boolean;
  allowReview: boolean;
  showResultsImmediately: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublished: boolean;
  tags: string[];
  prerequisites?: string[];
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  timeSpent: number; // in seconds
  answers: Record<string, any>;
  score: number;
  percentage: number;
  isPassed: boolean;
  questionResults: QuestionResult[];
  feedback?: string;
  attemptNumber: number;
}

export interface QuestionResult {
  questionId: string;
  userAnswer: any;
  correctAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  timeSpent: number; // in seconds
  attempts: number;
}

export interface AssessmentAnalytics {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  averageTime: number;
  difficultyDistribution: { easy: number; medium: number; hard: number; };
  questionAnalytics: {
    questionId: string;
    correctRate: number;
    averageTime: number;
    commonErrors: string[];
  }[];
  performanceByCategory: { [category: string]: number; };
  timeDistribution: { timeRange: string; count: number; }[];
}

class AssessmentService {
  private baseURL = '/api/assessments';

  // Assessment Management
  async getAssessments(params?: {
    category?: string;
    difficulty?: string;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ assessments: Assessment[]; total: number; }> {
    try {
      const response = await api.get(this.baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }

  async getAssessment(assessmentId: string): Promise<Assessment> {
    try {
      const response = await api.get(`${this.baseURL}/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }
  }

  async createAssessment(assessment: Partial<Assessment>): Promise<Assessment> {
    try {
      const response = await api.post(this.baseURL, assessment);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  async updateAssessment(assessmentId: string, updates: Partial<Assessment>): Promise<Assessment> {
    try {
      const response = await api.patch(`${this.baseURL}/${assessmentId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }

  async deleteAssessment(assessmentId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${assessmentId}`);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }

  async publishAssessment(assessmentId: string): Promise<Assessment> {
    try {
      const response = await api.post(`${this.baseURL}/${assessmentId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing assessment:', error);
      throw error;
    }
  }

  async unpublishAssessment(assessmentId: string): Promise<Assessment> {
    try {
      const response = await api.post(`${this.baseURL}/${assessmentId}/unpublish`);
      return response.data;
    } catch (error) {
      console.error('Error unpublishing assessment:', error);
      throw error;
    }
  }

  // Assessment Attempts
  async startAssessment(assessmentId: string): Promise<AssessmentAttempt> {
    try {
      const response = await api.post(`${this.baseURL}/${assessmentId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting assessment:', error);
      throw error;
    }
  }

  async saveAnswer(
    attemptId: string, 
    questionId: string, 
    answer: any,
    timeSpent?: number
  ): Promise<{ isCorrect?: boolean; feedback?: string; }> {
    try {
      const response = await api.post(`${this.baseURL}/attempts/${attemptId}/answers`, {
        questionId,
        answer,
        timeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  }

  async submitAssessment(attemptId: string): Promise<AssessmentAttempt> {
    try {
      const response = await api.post(`${this.baseURL}/attempts/${attemptId}/submit`);
      return response.data;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }

  async getAttempt(attemptId: string): Promise<AssessmentAttempt> {
    try {
      const response = await api.get(`${this.baseURL}/attempts/${attemptId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attempt:', error);
      throw error;
    }
  }

  async getUserAttempts(userId: string, assessmentId?: string): Promise<AssessmentAttempt[]> {
    try {
      const response = await api.get(`${this.baseURL}/attempts`, {
        params: { userId, assessmentId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user attempts:', error);
      throw error;
    }
  }

  async getCurrentAttempt(assessmentId: string): Promise<AssessmentAttempt | null> {
    try {
      const response = await api.get(`${this.baseURL}/${assessmentId}/current-attempt`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching current attempt:', error);
      throw error;
    }
  }

  // Real-time Assessment (WebSocket)
  connectToAssessment(
    attemptId: string,
    onAnswer: (data: any) => void,
    onTimeUpdate: (timeRemaining: number) => void,
    onAutoSubmit: () => void,
    onError: (error: any) => void
  ): WebSocket {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/assessments/attempts/${attemptId}`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'answer_saved':
            onAnswer(data.payload);
            break;
          case 'time_update':
            onTimeUpdate(data.payload.timeRemaining);
            break;
          case 'auto_submit':
            onAutoSubmit();
            break;
          case 'error':
            onError(data.payload);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = onError;
    return ws;
  }

  // Question Bank Management
  async getQuestions(params?: {
    category?: string;
    difficulty?: string;
    type?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ questions: Question[]; total: number; }> {
    try {
      const response = await api.get(`${this.baseURL}/questions`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  async createQuestion(question: Partial<Question>): Promise<Question> {
    try {
      const response = await api.post(`${this.baseURL}/questions`, question);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async updateQuestion(questionId: string, updates: Partial<Question>): Promise<Question> {
    try {
      const response = await api.patch(`${this.baseURL}/questions/${questionId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  async deleteQuestion(questionId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/questions/${questionId}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  async importQuestions(file: File, format: 'json' | 'csv' | 'xlsx'): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);

      const response = await api.post(`${this.baseURL}/questions/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing questions:', error);
      throw error;
    }
  }

  async exportQuestions(assessmentId?: string, format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseURL}/questions/export`, {
        params: { assessmentId, format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting questions:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  async getAssessmentAnalytics(assessmentId: string, timeframe?: string): Promise<AssessmentAnalytics> {
    try {
      const response = await api.get(`${this.baseURL}/${assessmentId}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment analytics:', error);
      throw error;
    }
  }

  async getUserProgress(userId: string, params?: {
    category?: string;
    timeframe?: string;
  }): Promise<{
    totalAssessments: number;
    completedAssessments: number;
    averageScore: number;
    totalPoints: number;
    earnedPoints: number;
    performanceTrend: { date: string; score: number; }[];
    categoryBreakdown: { category: string; score: number; attempts: number; }[];
    achievements: { id: string; title: string; earnedAt: Date; }[];
  }> {
    try {
      const response = await api.get(`${this.baseURL}/analytics/user-progress/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  async generateReport(
    assessmentId: string,
    format: 'pdf' | 'excel' | 'csv',
    includeUserData: boolean = true
  ): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseURL}/${assessmentId}/report`, {
        params: { format, includeUserData },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Adaptive Assessment
  async getAdaptiveQuestions(
    assessmentId: string,
    userAbility: number,
    targetQuestions: number = 10
  ): Promise<Question[]> {
    try {
      const response = await api.post(`${this.baseURL}/${assessmentId}/adaptive`, {
        userAbility,
        targetQuestions
      });
      return response.data;
    } catch (error) {
      console.error('Error getting adaptive questions:', error);
      throw error;
    }
  }

  async updateUserAbility(
    attemptId: string,
    questionId: string,
    isCorrect: boolean,
    difficulty: number
  ): Promise<{ newAbility: number; confidence: number; }> {
    try {
      const response = await api.post(`${this.baseURL}/attempts/${attemptId}/ability`, {
        questionId,
        isCorrect,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user ability:', error);
      throw error;
    }
  }

  // Proctoring and Security
  async enableProctoring(attemptId: string): Promise<{
    sessionId: string;
    streamKey: string;
    rules: string[];
  }> {
    try {
      const response = await api.post(`${this.baseURL}/attempts/${attemptId}/proctoring`);
      return response.data;
    } catch (error) {
      console.error('Error enabling proctoring:', error);
      throw error;
    }
  }

  async reportSuspiciousActivity(
    attemptId: string,
    activity: 'tab_switch' | 'fullscreen_exit' | 'multiple_faces' | 'no_face_detected' | 'phone_detected',
    details?: string
  ): Promise<void> {
    try {
      await api.post(`${this.baseURL}/attempts/${attemptId}/suspicious`, {
        activity,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error reporting suspicious activity:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUpdateAssessments(
    assessmentIds: string[],
    updates: Partial<Assessment>
  ): Promise<{ updated: number; errors: string[]; }> {
    try {
      const response = await api.patch(`${this.baseURL}/bulk-update`, {
        assessmentIds,
        updates
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating assessments:', error);
      throw error;
    }
  }

  async cloneAssessment(assessmentId: string, title: string): Promise<Assessment> {
    try {
      const response = await api.post(`${this.baseURL}/${assessmentId}/clone`, { title });
      return response.data;
    } catch (error) {
      console.error('Error cloning assessment:', error);
      throw error;
    }
  }
}

const assessmentService = new AssessmentService();
export default assessmentService;