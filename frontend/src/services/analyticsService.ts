import { api } from './api';

export interface LearningAnalytics {
  userId: string;
  courseId?: string;
  timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: AnalyticsMetrics;
  insights: LearningInsights;
  recommendations: Recommendation[];
  trends: TrendData[];
  comparedTo: {
    previousPeriod: AnalyticsMetrics;
    peerAverage: AnalyticsMetrics;
  };
}

export interface AnalyticsMetrics {
  // Time-based metrics
  totalStudyTime: number; // in minutes
  averageSessionTime: number;
  sessionsCount: number;
  studyDays: number;
  streakDays: number;

  // Progress metrics
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  completionRate: number; // 0-100
  dropoutRate: number; // 0-100

  // Performance metrics
  averageQuizScore: number;
  averageAssignmentScore: number;
  totalQuizzesTaken: number;
  totalAssignmentsSubmitted: number;

  // Engagement metrics
  loginFrequency: number; // times per period
  dailyActiveDays: number;
  featureUsage: Record<string, number>;
  contentInteractionRate: number; // 0-100

  // Learning efficiency
  knowledgeRetentionRate: number; // 0-100
  skillImprovementRate: number; // 0-100
  strugglingTopics: string[];
  masteryTopics: string[];

  // Social metrics
  forumPosts: number;
  peerInteractions: number;
  helpRequests: number;
  helpProvided: number;
}

export interface LearningInsights {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  optimalStudyTime: string; // HH:mm format
  preferredSessionLength: number; // in minutes
  strongestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  difficultyPreference: 'easy' | 'medium' | 'hard' | 'adaptive';
  learningVelocity: 'slow' | 'moderate' | 'fast';
  retentionAbility: 'low' | 'medium' | 'high';
  procrastinationLevel: number; // 0-100
  motivationLevel: number; // 0-100
  burnoutRisk: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  nextMilestone: string;
  estimatedCompletionTime: number; // in days
}

export interface Recommendation {
  id: string;
  type: 'content' | 'study_plan' | 'difficulty' | 'schedule' | 'social';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionItems: string[];
  estimatedImpact: number; // 0-100
  effort: 'low' | 'medium' | 'high';
  category: string;
  relatedTopics: string[];
  metadata?: any;
}

export interface TrendData {
  date: string;
  metrics: Partial<AnalyticsMetrics>;
  notes?: string;
}

export interface CohortAnalysis {
  cohortType: 'enrollment' | 'completion' | 'graduation';
  cohortName: string;
  startDate: string;
  endDate?: string;
  totalStudents: number;
  activeStudents: number;
  retentionCurve: Array<{
    day: number;
    retentionRate: number; // 0-100
  }>;
  completionCurve: Array<{
    day: number;
    completionRate: number; // 0-100
  }>;
  performanceDistribution: Array<{
    scoreRange: string;
    studentCount: number;
  }>;
  dropOffPoints: Array<{
    lessonId: string;
    lessonTitle: string;
    dropOffRate: number; // 0-100
  }>;
}

export interface InstructorAnalytics {
  instructorId: string;
  courses: CourseAnalytics[];
  overallMetrics: {
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    averageRating: number;
    completionRate: number;
    retentionRate: number;
    averageStudyTime: number;
  };
  performance: {
    topPerformingCourses: Array<{
      courseId: string;
      courseTitle: string;
      metrics: Partial<AnalyticsMetrics>;
    }>;
    improvementOpportunities: string[];
    studentFeedback: Array<{
      courseId: string;
      rating: number;
      comment: string;
      studentId: string;
      createdAt: string;
    }>;
  };
}

export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  enrollmentMetrics: {
    totalEnrollments: number;
    activeEnrollments: number;
    completionRate: number;
    dropoutRate: number;
    averageStudyTime: number;
  };
  contentMetrics: {
    lessonCompletionRates: Array<{
      lessonId: string;
      lessonTitle: string;
      completionRate: number;
      averageTimeSpent: number;
      difficulty: number;
    }>;
    engagementMetrics: Record<string, number>;
    feedbackAnalysis: {
      positive: string[];
      negative: string[];
      suggestions: string[];
    };
  };
  performance: {
    averageQuizScore: number;
    averageAssignmentScore: number;
    improvementRate: number;
    strugglingStudents: string[];
    topPerformers: string[];
  };
  timeAnalysis: {
    peakActivity: string; // HH:mm format
    averageSessionLength: number;
    studyStreaks: Array<{
      studentId: string;
      streakLength: number;
      currentStreak: number;
    }>;
  };
}

class AnalyticsService {
  private readonly basePath = '/analytics';

  // Personal Learning Analytics
  async getLearningAnalytics(params: {
    courseId?: string;
    timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    startDate?: string;
    endDate?: string;
    includeInsights?: boolean;
    includeRecommendations?: boolean;
  }): Promise<LearningAnalytics> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    return api.get(`${this.basePath}/learning?${searchParams.toString()}`);
  }

  async getPersonalDashboard(): Promise<{
    summary: AnalyticsMetrics;
    weeklyProgress: TrendData[];
    recentAchievements: Array<{
      id: string;
      title: string;
      description: string;
      earnedAt: string;
    }>;
    upcomingDeadlines: Array<{
      id: string;
      title: string;
      dueDate: string;
      courseName: string;
    }>;
    currentStreak: number;
    studyGoal: {
      target: number;
      current: number;
      unit: 'minutes' | 'lessons' | 'courses';
    };
  }> {
    return api.get(`${this.basePath}/dashboard`);
  }

  async getStudyHabits(): Promise<{
    dailyPattern: Array<{
      hour: number;
      studyTime: number;
      sessions: number;
    }>;
    weeklyPattern: Array<{
      day: number;
      studyTime: number;
      sessions: number;
    }>;
    sessionLength: {
      average: number;
      distribution: Array<{
        range: string;
        frequency: number;
      }>;
    };
    consistencyScore: number; // 0-100
    recommendedSchedule: {
      optimalTime: string;
      sessionLength: number;
      frequency: 'daily' | 'weekly';
    };
  }> {
    return api.get(`${this.basePath}/study-habits`);
  }

  async getLearningEfficiency(): Promise<{
    retentionRate: number; // 0-100
    forgettingCurve: Array<{
      daysSince: number;
      retentionRate: number;
    }>;
    spacedRepetitionSchedule: Array<{
      topic: string;
      lastReview: string;
      nextReview: string;
      difficulty: number;
    }>;
    optimalReviewFrequency: number; // in days
  }> {
    return api.get(`${this.basePath}/efficiency`);
  }

  // Course Analytics
  async getCourseAnalytics(courseId: string, params?: {
    timeRange?: string;
    includeStudentDetails?: boolean;
  }): Promise<CourseAnalytics> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/courses/${courseId}?${searchParams.toString()}`);
  }

  async getCoursePerformance(courseId: string): Promise<{
    overall: {
      enrollmentCount: number;
      completionRate: number;
      averageScore: number;
      engagementLevel: number;
    };
    lessonBreakdown: Array<{
      lessonId: string;
      title: string;
      completionRate: number;
      averageScore: number;
      difficulty: number;
      timeSpent: number;
    }>;
    studentSegments: Array<{
      segment: string;
      count: number;
      metrics: Partial<AnalyticsMetrics>;
    }>;
  }> {
    return api.get(`${this.basePath}/courses/${courseId}/performance`);
  }

  async getCourseEngagement(courseId: string): Promise<{
    contentEngagement: Array<{
      contentId: string;
      contentType: string;
      title: string;
      views: number;
      interactions: number;
      completionRate: number;
      averageTimeSpent: number;
    }>;
    activityTimeline: Array<{
      timestamp: string;
      activity: string;
      userCount: number;
    }>;
    dropoutAnalysis: Array<{
      lessonId: string;
      title: string;
      dropoutRate: number;
      avgTimeSpent: number;
      commonExitPoints: string[];
    }>;
  }> {
    return api.get(`${this.basePath}/courses/${courseId}/engagement`);
  }

  // Instructor Analytics
  async getInstructorAnalytics(): Promise<InstructorAnalytics> {
    return api.get(`${this.basePath}/instructor`);
  }

  async getInstructorPerformance(): Promise<{
    courses: Array<{
      courseId: string;
      title: string;
      metrics: {
        enrollment: number;
        completionRate: number;
        averageRating: number;
        revenue: number;
        engagement: number;
      };
      trends: {
        enrollmentGrowth: number;
        ratingTrend: number;
        completionTrend: number;
      };
    }>;
    recommendations: string[];
    successFactors: string[];
    improvementAreas: string[];
  }> {
    return api.get(`${this.basePath}/instructor/performance`);
  }

  // Cohort Analysis
  async getCohortAnalysis(params: {
    cohortType?: 'enrollment' | 'completion' | 'graduation';
    startDate?: string;
    endDate?: string;
    courseId?: string;
  }): Promise<CohortAnalysis[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value);
      }
    });
    
    return api.get(`${this.basePath}/cohorts?${searchParams.toString()}`);
  }

  async createCohort(cohortData: {
    name: string;
    type: 'enrollment' | 'completion' | 'graduation';
    startDate: string;
    endDate?: string;
    criteria: {
      courses?: string[];
      filters?: Record<string, any>;
    };
  }): Promise<{ cohortId: string }> {
    return api.post(`${this.basePath}/cohorts`, cohortData);
  }

  // Predictive Analytics
  async getPredictions(params: {
    courseId?: string;
    timeHorizon?: 'week' | 'month' | 'quarter';
    metric?: string;
  }): Promise<{
    completionPrediction: {
      probability: number; // 0-100
      estimatedCompletionDate: string;
      riskFactors: string[];
      recommendations: string[];
    };
    performancePrediction: {
      predictedScore: number;
      confidence: number; // 0-100
      factors: Array<{
        factor: string;
        impact: number; // -100 to 100
      }>;
    };
    engagementPrediction: {
      predictedActivity: number;
      dropoutRisk: number; // 0-100
      optimalIntervention: string;
    };
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value);
      }
    });
    
    return api.get(`${this.basePath}/predictions?${searchParams.toString()}`);
  }

  // Comparative Analytics
  async getPeerComparison(params: {
    metric: string;
    timeRange?: string;
    comparisonType?: 'course' | 'cohort' | 'similar-students';
    filters?: Record<string, any>;
  }): Promise<{
    percentile: number; // 0-100
    peerAverage: number;
    topPerformers: number;
    improvementNeeded: number;
    recommendations: string[];
    trend: 'improving' | 'stable' | 'declining';
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    return api.get(`${this.basePath}/comparison?${searchParams.toString()}`);
  }

  // Real-time Analytics
  async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    currentSessions: number;
    todayEnrollments: number;
    todayCompletions: number;
    systemHealth: {
      cpu: number;
      memory: number;
      responseTime: number;
      errorRate: number;
    };
    recentActivity: Array<{
      timestamp: string;
      event: string;
      userCount: number;
    }>;
  }> {
    return api.get(`${this.basePath}/realtime`);
  }

  // Export and Reports
  async exportAnalytics(params: {
    reportType: 'learning' | 'course' | 'instructor' | 'cohort';
    format: 'pdf' | 'csv' | 'xlsx';
    timeRange?: string;
    courseId?: string;
    includeVisualizations?: boolean;
  }): Promise<{
    downloadUrl: string;
    expiresAt: string;
    reportId: string;
  }> {
    return api.post(`${this.basePath}/export`, params);
  }

  async generateCustomReport(params: {
    title: string;
    description: string;
    metrics: string[];
    filters: Record<string, any>;
    visualization: 'chart' | 'table' | 'dashboard';
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      recipients: string[];
    };
  }): Promise<{ reportId: string; scheduled: boolean }> {
    return api.post(`${this.basePath}/reports/custom`, params);
  }

  async getScheduledReports(): Promise<Array<{
    reportId: string;
    title: string;
    frequency: string;
    nextRun: string;
    recipients: string[];
    isActive: boolean;
  }>> {
    return api.get(`${this.basePath}/reports/scheduled`);
  }

  // A/B Testing
  async createExperiment(params: {
    name: string;
    description: string;
    hypothesis: string;
    variants: Array<{
      name: string;
      description: string;
      trafficPercentage: number;
    }>;
    metrics: string[];
    startDate: string;
    endDate?: string;
    minSampleSize?: number;
  }): Promise<{ experimentId: string }> {
    return api.post(`${this.basePath}/experiments`, params);
  }

  async getExperimentResults(experimentId: string): Promise<{
    status: 'running' | 'completed' | 'paused';
    results: Array<{
      variant: string;
      metrics: Record<string, number>;
      confidence: number; // 0-100
      significance: number; // 0-100
    }>;
    winner?: string;
    recommendation: string;
  }> {
    return api.get(`${this.basePath}/experiments/${experimentId}/results`);
  }

  // API Rate Limits and Performance
  async getApiUsage(): Promise<{
    dailyUsage: Array<{
      date: string;
      requests: number;
      responseTime: number;
      errorRate: number;
    }>;
    currentRate: {
      used: number;
      limit: number;
      resetTime: string;
    };
    topEndpoints: Array<{
      endpoint: string;
      requests: number;
      avgResponseTime: number;
    }>;
  }> {
    return api.get(`${this.basePath}/usage`);
  }
}

export const analyticsService = new AnalyticsService();