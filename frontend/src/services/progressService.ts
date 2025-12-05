import { api } from './api';

export interface LearningProgress {
  userId: string;
  courseId: string;
  overallProgress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
  timeSpent: number; // in minutes
  streak: number; // consecutive days
  lastActivity: string;
  currentLesson?: {
    moduleId: string;
    lessonId: string;
  };
  achievements: Achievement[];
  certificates: Certificate[];
}

export interface LessonProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  isCompleted: boolean;
  timeSpent: number; // in minutes
  attempts: number;
  lastAttempt: string;
  score?: number;
  notes?: string;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'milestone' | 'social' | 'special';
  condition: string;
  earnedAt: string;
  points: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  certificateUrl: string;
  verificationCode: string;
  skills: string[];
}

export interface StudySession {
  id: string;
  userId: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  activityType: 'lesson' | 'assignment' | 'quiz' | 'practice';
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  completedActivities: number;
  focusScore: number; // 0-100
  notes?: string;
}

export interface LearningStatistics {
  totalStudyTime: number; // in minutes
  totalCoursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionTime: number;
  totalAchievements: number;
  totalPoints: number;
  rank: number;
  weeklyProgress: Array<{
    date: string;
    studyTime: number;
    activitiesCompleted: number;
  }>;
  subjectProgress: Array<{
    subject: string;
    progress: number;
    timeSpent: number;
  }>;
}

class ProgressService {
  private readonly basePath = '/progress';

  // Course Progress
  async getCourseProgress(courseId: string): Promise<LearningProgress> {
    return api.get(`${this.basePath}/courses/${courseId}`);
  }

  async getAllCourseProgress(): Promise<LearningProgress[]> {
    return api.get(`${this.basePath}/courses`);
  }

  async updateLessonProgress(courseId: string, moduleId: string, lessonId: string, progress: {
    timeSpent?: number;
    score?: number;
    notes?: string;
  }): Promise<LessonProgress> {
    return api.put(`${this.basePath}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, progress);
  }

  async markLessonComplete(courseId: string, moduleId: string, lessonId: string): Promise<LessonProgress> {
    return api.post(`${this.basePath}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`);
  }

  async markLessonIncomplete(courseId: string, moduleId: string, lessonId: string): Promise<LessonProgress> {
    return api.delete(`${this.basePath}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`);
  }

  // Study Sessions
  async startStudySession(data: {
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
    activityType: 'lesson' | 'assignment' | 'quiz' | 'practice';
  }): Promise<StudySession> {
    return api.post(`${this.basePath}/sessions`, {
      ...data,
      startTime: new Date().toISOString()
    });
  }

  async endStudySession(sessionId: string, data: {
    duration?: number;
    completedActivities?: number;
    focusScore?: number;
    notes?: string;
  }): Promise<StudySession> {
    return api.put(`${this.basePath}/sessions/${sessionId}`, {
      ...data,
      endTime: new Date().toISOString()
    });
  }

  async getStudySessions(filters?: {
    startDate?: string;
    endDate?: string;
    courseId?: string;
    activityType?: string;
  }): Promise<StudySession[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }
    
    return api.get(`${this.basePath}/sessions?${params.toString()}`);
  }

  async getCurrentSession(): Promise<StudySession | null> {
    try {
      return await api.get(`${this.basePath}/sessions/current`);
    } catch (error) {
      return null;
    }
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return api.get(`${this.basePath}/achievements`);
  }

  async getEarnedAchievements(): Promise<Achievement[]> {
    return api.get(`${this.basePath}/achievements/earned`);
  }

  async checkAchievements(activity: {
    type: string;
    data: any;
  }): Promise<Achievement[]> {
    return api.post(`${this.basePath}/achievements/check`, activity);
  }

  // Certificates
  async getCertificates(): Promise<Certificate[]> {
    return api.get(`${this.basePath}/certificates`);
  }

  async generateCertificate(courseId: string): Promise<Certificate> {
    return api.post(`${this.basePath}/certificates/generate`, { courseId });
  }

  async verifyCertificate(verificationCode: string): Promise<{
    isValid: boolean;
    certificate?: Certificate;
  }> {
    return api.get(`${this.basePath}/certificates/verify/${verificationCode}`);
  }

  async downloadCertificate(certificateId: string): Promise<string> {
    return api.get(`${this.basePath}/certificates/${certificateId}/download`);
  }

  // Learning Statistics
  async getLearningStatistics(timeRange: 'week' | 'month' | 'year' | 'all'): Promise<LearningStatistics> {
    return api.get(`${this.basePath}/statistics?range=${timeRange}`);
  }

  async getWeeklyProgress(): Promise<Array<{
    date: string;
    studyTime: number;
    activitiesCompleted: number;
    coursesVisited: number;
  }>> {
    return api.get(`${this.basePath}/statistics/weekly`);
  }

  async getMonthlyProgress(): Promise<Array<{
    week: string;
    studyTime: number;
    achievements: number;
    coursesCompleted: number;
  }>> {
    return api.get(`${this.basePath}/statistics/monthly`);
  }

  // Streaks and Goals
  async getCurrentStreak(): Promise<{
    current: number;
    longest: number;
    lastStudyDate: string;
    nextGoal: number;
  }> {
    return api.get(`${this.basePath}/streak`);
  }

  async setLearningGoal(goal: {
    type: 'daily' | 'weekly' | 'monthly';
    target: number;
    unit: 'minutes' | 'lessons' | 'courses';
  }): Promise<void> {
    return api.post(`${this.basePath}/goals`, goal);
  }

  async getLearningGoals(): Promise<Array<{
    id: string;
    type: 'daily' | 'weekly' | 'monthly';
    target: number;
    unit: 'minutes' | 'lessons' | 'courses';
    progress: number;
    isCompleted: boolean;
    createdAt: string;
  }>> {
    return api.get(`${this.basePath}/goals`);
  }

  // Learning Path Recommendations
  async getRecommendedPath(subject: string): Promise<{
    nextLessons: Array<{
      lessonId: string;
      lessonTitle: string;
      moduleTitle: string;
      estimatedTime: number;
      difficulty: number;
    }>;
    estimatedCompletion: string;
    skillsToGain: string[];
  }> {
    return api.get(`${this.basePath}/recommendations/${subject}`);
  }

  async updateLearningPreferences(preferences: {
    preferredSessionLength: number;
    studyReminders: boolean;
    difficultyPreference: 'easy' | 'medium' | 'hard';
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  }): Promise<void> {
    return api.put(`${this.basePath}/preferences`, preferences);
  }

  async getLearningPreferences(): Promise<{
    preferredSessionLength: number;
    studyReminders: boolean;
    difficultyPreference: 'easy' | 'medium' | 'hard';
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    optimalStudyTimes: string[];
    weakSubjects: string[];
    strongSubjects: string[];
  }> {
    return api.get(`${this.basePath}/preferences`);
  }

  // Progress Analytics
  async getProgressAnalytics(courseId?: string): Promise<{
    timeSpentByDay: Array<{ date: string; minutes: number }>;
    completionRate: number;
    averageSessionTime: number;
    retentionRate: number;
    strugglePoints: Array<{
      lessonId: string;
      lessonTitle: string;
      averageAttempts: number;
      dropOffRate: number;
    }>;
    strengths: Array<{
      subject: string;
      proficiency: number;
      improvementRate: number;
    }>;
  }> {
    const params = courseId ? `?courseId=${courseId}` : '';
    return api.get(`${this.basePath}/analytics${params}`);
  }

  // Export Progress Data
  async exportProgressData(format: 'json' | 'csv' | 'pdf'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    return api.post(`${this.basePath}/export`, { format });
  }

  // Reset Progress
  async resetCourseProgress(courseId: string): Promise<void> {
    return api.delete(`${this.basePath}/courses/${courseId}`);
  }

  async resetAllProgress(): Promise<void> {
    return api.delete(`${this.basePath}/reset`);
  }
}

export const progressService = new ProgressService();