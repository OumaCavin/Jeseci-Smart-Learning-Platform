import { api } from './api';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in hours
  category: string;
  skills: string[];
  prerequisites: string[];
  learningObjectives: string[];
  courses: PathCourse[];
  milestones: Milestone[];
  progress: PathProgress;
  isPersonalized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PathCourse {
  courseId: string;
  courseTitle: string;
  order: number;
  estimatedTime: number;
  prerequisites: string[];
  learningOutcomes: string[];
  isOptional: boolean;
  isCompleted?: boolean;
  progress?: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
  requiredCourses: string[];
  skills: string[];
  estimatedCompletion: string;
  badge?: {
    name: string;
    icon: string;
    description: string;
  };
  isCompleted?: boolean;
  completedAt?: string;
}

export interface PathProgress {
  userId: string;
  pathId: string;
  overallProgress: number; // 0-100
  completedCourses: number;
  totalCourses: number;
  timeSpent: number; // in minutes
  currentCourse?: {
    courseId: string;
    courseTitle: string;
    moduleId: string;
    lessonId: string;
  };
  milestones: {
    completed: number;
    total: number;
  };
  estimatedCompletionDate: string;
  streakDays: number;
  lastActivityAt: string;
}

export interface Recommendation {
  id: string;
  type: 'course' | 'learning_path' | 'skill' | 'study_session' | 'mentor' | 'resource';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  reason: string; // Why this recommendation was made
  confidence: number; // 0-100
  category: string;
  metadata: {
    entityId: string;
    entityType: string;
    estimatedImpact: number; // 0-100
    effort: 'low' | 'medium' | 'high';
    timeRequired: number; // in minutes
    relatedTopics: string[];
  };
  actionItems: string[];
  benefits: string[];
  alternativeOptions?: Recommendation[];
  expiresAt?: string;
  isDismissed: boolean;
  isCompleted: boolean;
  createdAt: string;
}

export interface SkillProfile {
  userId: string;
  skills: SkillAssessment[];
  overallLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  learningVelocity: 'slow' | 'moderate' | 'fast';
  strengths: string[];
  weaknesses: string[];
  recommendedSkills: Array<{
    skill: string;
    priority: number; // 0-100
    reason: string;
    estimatedTimeToMaster: number; // in hours
  }>;
  skillGapAnalysis: Array<{
    skill: string;
    currentLevel: number; // 0-100
    requiredLevel: number; // 0-100
    gap: number;
    recommendations: string[];
  }>;
  updatedAt: string;
}

export interface SkillAssessment {
  skill: string;
  level: number; // 0-100
  confidence: number; // 0-100
  evidenceCount: number;
  lastAssessed: string;
  assessmentMethod: 'quiz' | 'project' | 'peer_review' | 'instructor' | 'self_assessment';
  subSkills: Array<{
    name: string;
    level: number; // 0-100
    evidence: string[];
  }>;
}

export interface PersonalizedContent {
  courses: Array<{
    courseId: string;
    courseTitle: string;
    instructor: string;
    matchScore: number; // 0-100
    reasons: string[];
    expectedOutcomes: string[];
  }>;
  studySessions: Array<{
    type: string;
    topic: string;
    duration: number;
    difficulty: string;
    peerLevel: 'similar' | 'higher' | 'lower';
    schedule: {
      date: string;
      time: string;
      timezone: string;
    };
  }>;
  resources: Array<{
    type: 'article' | 'video' | 'book' | 'tool' | 'course';
    title: string;
    url: string;
    relevance: number; // 0-100
    topics: string[];
  }>;
  challenges: Array<{
    type: 'quiz' | 'project' | 'simulation' | 'case_study';
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;
    skills: string[];
    rewards: string[];
  }>;
}

class RecommendationService {
  private readonly basePath = '/recommendations';

  // Learning Path Management
  async getRecommendedPaths(params?: {
    category?: string;
    difficulty?: string;
    skillLevel?: string;
    timeAvailable?: number; // in hours
    goals?: string[];
  }): Promise<{
    paths: LearningPath[];
    personalized: boolean;
    explanation: string;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return api.get(`${this.basePath}/paths?${searchParams.toString()}`);
  }

  async createCustomPath(pathData: {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    courses: string[];
    goals: string[];
    timeConstraint?: number;
  }): Promise<LearningPath> {
    return api.post(`${this.basePath}/paths`, pathData);
  }

  async getPathProgress(pathId: string): Promise<PathProgress> {
    return api.get(`${this.basePath}/paths/${pathId}/progress`);
  }

  async startLearningPath(pathId: string): Promise<PathProgress> {
    return api.post(`${this.basePath}/paths/${pathId}/start`);
  }

  async updatePathProgress(pathId: string, progress: {
    courseId: string;
    moduleId?: string;
    lessonId?: string;
    completed?: boolean;
    timeSpent?: number;
  }): Promise<PathProgress> {
    return api.put(`${this.basePath}/paths/${pathId}/progress`, progress);
  }

  async completeMilestone(pathId: string, milestoneId: string): Promise<{
    milestone: Milestone;
    badge?: any;
    rewards: string[];
  }> {
    return api.post(`${this.basePath}/paths/${pathId}/milestones/${milestoneId}/complete`);
  }

  async getPathAnalytics(pathId: string): Promise<{
    completionRate: number;
    averageTimeToComplete: number;
    difficultyRating: number;
    satisfactionScore: number;
    similarPaths: Array<{
      id: string;
      title: string;
      similarity: number;
    }>;
  }> {
    return api.get(`${this.basePath}/paths/${pathId}/analytics`);
  }

  // Course Recommendations
  async getCourseRecommendations(params?: {
    courseId?: string;
    category?: string;
    difficulty?: string;
    instructorPreference?: string;
    duration?: string;
    priceRange?: string;
    rating?: number;
    skills?: string[];
    goals?: string[];
    excludeCompleted?: boolean;
    limit?: number;
  }): Promise<{
    courses: Array<{
      courseId: string;
      courseTitle: string;
      instructor: string;
      rating: number;
      price: number;
      duration: number;
      level: string;
      matchScore: number; // 0-100
      reasons: string[];
      expectedOutcomes: string[];
      alternatives?: string[];
    }>;
    explanation: string;
    confidence: number; // 0-100
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return api.get(`${this.basePath}/courses?${searchParams.toString()}`);
  }

  async rateRecommendation(recommendationId: string, rating: {
    helpful: boolean;
    relevant: boolean;
    accurate: boolean;
    feedback?: string;
  }): Promise<void> {
    return api.post(`${this.basePath}/${recommendationId}/rate`, rating);
  }

  // Personalized Recommendations
  async getPersonalizedRecommendations(params?: {
    type?: 'course' | 'skill' | 'study_session' | 'mentor' | 'resource';
    category?: string;
    limit?: number;
    includeReasoning?: boolean;
  }): Promise<{
    recommendations: Recommendation[];
    summary: {
      totalRecommendations: number;
      highPriorityCount: number;
      averageConfidence: number;
      primaryTopics: string[];
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/personalized?${searchParams.toString()}`);
  }

  async updateRecommendationPreferences(preferences: {
    preferredTopics: string[];
    preferredInstructors: string[];
    preferredDuration: string;
    preferredDifficulty: string;
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    goals: string[];
    timeAvailability: number; // hours per week
    budget?: number;
    deadlines?: Array<{
      goal: string;
      deadline: string;
    }>;
  }): Promise<void> {
    return api.put(`${this.basePath}/preferences`, preferences);
  }

  async getRecommendationPreferences(): Promise<{
    preferredTopics: string[];
    preferredInstructors: string[];
    preferredDuration: string;
    preferredDifficulty: string;
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    goals: string[];
    timeAvailability: number;
    budget?: number;
    deadlines?: Array<{
      goal: string;
      deadline: string;
    }>;
  }> {
    return api.get(`${this.basePath}/preferences`);
  }

  // Skill Assessment and Recommendations
  async getSkillProfile(): Promise<SkillProfile> {
    return api.get(`${this.basePath}/skills/profile`);
  }

  async assessSkill(skill: string, assessment: {
    method: 'quiz' | 'project' | 'peer_review' | 'instructor' | 'self_assessment';
    score: number; // 0-100
    evidence?: string[];
    confidence?: number; // 0-100
    subSkills?: Array<{
      name: string;
      score: number;
      evidence: string[];
    }>;
  }): Promise<SkillAssessment> {
    return api.post(`${this.basePath}/skills/${skill}/assess`, assessment);
  }

  async getSkillRecommendations(): Promise<{
    skillsToLearn: Array<{
      skill: string;
      priority: number; // 0-100
      reason: string;
      estimatedTimeToMaster: number; // in hours
      prerequisites: string[];
      learningResources: string[];
    }>;
    skillsToImprove: Array<{
      skill: string;
      currentLevel: number;
      targetLevel: number;
      gap: number;
      recommendations: string[];
    }>;
    careerRelevance: Array<{
      skill: string;
      demand: number; // 0-100
      averageSalary: number;
      jobPostings: number;
    }>;
  }> {
    return api.get(`${this.basePath}/skills/recommendations`);
  }

  async trackSkillUsage(skill: string, usage: {
    context: string;
    difficulty: 'easy' | 'medium' | 'hard';
    success: boolean;
    timeSpent: number;
    resourcesUsed: string[];
  }): Promise<void> {
    return api.post(`${this.basePath}/skills/${skill}/track`, usage);
  }

  // Study Session Recommendations
  async getStudySessionRecommendations(params?: {
    subject?: string;
    duration?: number; // in minutes
    difficulty?: string;
    peerLevel?: string;
    format?: 'individual' | 'group' | 'mentor';
    schedule?: {
      date: string;
      time: string;
      timezone: string;
    };
  }): Promise<{
    sessions: Array<{
      type: string;
      topic: string;
      duration: number;
      difficulty: string;
      participants: number;
      maxParticipants?: number;
      host?: {
        id: string;
        name: string;
        rating: number;
        expertise: string[];
      };
      schedule: {
        date: string;
        time: string;
        timezone: string;
      };
      description: string;
      goals: string[];
      expectedOutcomes: string[];
      matchScore: number; // 0-100
      reasons: string[];
    }>;
    summary: {
      totalSessions: number;
      recommendedCount: number;
      primaryTopics: string[];
      averageDifficulty: string;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object' && key !== 'schedule') {
            searchParams.append(key, JSON.stringify(value));
          } else if (key === 'schedule') {
            Object.entries(value).forEach(([scheduleKey, scheduleValue]) => {
              searchParams.append(`schedule.${scheduleKey}`, scheduleValue.toString());
            });
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return api.get(`${this.basePath}/study-sessions?${searchParams.toString()}`);
  }

  async createStudySession(session: {
    type: string;
    topic: string;
    duration: number;
    maxParticipants?: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    requirements?: string[];
    goals: string[];
    scheduledTime?: string;
  }): Promise<{
    sessionId: string;
    invitation: string;
    recommendedParticipants: string[];
  }> {
    return api.post(`${this.basePath}/study-sessions/create`, session);
  }

  // Mentor Recommendations
  async getMentorRecommendations(params?: {
    expertise?: string[];
    experience?: number;
    availability?: string;
    timezone?: string;
    rating?: number;
    communicationStyle?: string;
    goals?: string[];
  }): Promise<{
    mentors: Array<{
      id: string;
      name: string;
      avatar?: string;
      expertise: string[];
      experience: number;
      rating: number;
      totalMentees: number;
      activeMentees: number;
      availability: string[];
      communicationStyle: string;
      timeZone: string;
      bio: string;
      approach: string;
      successStories: string[];
      hourlyRate?: number;
      matchScore: number; // 0-100
      reasons: string[];
      nextAvailable: string;
    }>;
    summary: {
      totalMentors: number;
      recommendedCount: number;
      averageExperience: number;
      averageRating: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return api.get(`${this.basePath}/mentors?${searchParams.toString()}`);
  }

  // Resource Recommendations
  async getResourceRecommendations(params?: {
    type?: 'article' | 'video' | 'book' | 'tool' | 'course' | 'podcast';
    topic?: string;
    difficulty?: string;
    length?: 'short' | 'medium' | 'long';
    format?: 'text' | 'audio' | 'video' | 'interactive';
    language?: string;
    source?: string;
    limit?: number;
  }): Promise<{
    resources: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      author?: string;
      source: string;
      url?: string;
      difficulty: string;
      estimatedReadTime?: number;
      topics: string[];
      skills: string[];
      rating?: number;
      popularity: number; // 0-100
      relevance: number; // 0-100
      matchScore: number; // 0-100
      reasons: string[];
      preview?: string;
      tags: string[];
      publishedAt?: string;
    }>;
    summary: {
      totalResources: number;
      averageRelevance: number;
      primaryTopics: string[];
      resourceTypes: Record<string, number>;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/resources?${searchParams.toString()}`);
  }

  // Recommendation Feedback and Learning
  async provideFeedback(recommendationId: string, feedback: {
    type: 'dismiss' | 'complete' | 'helpful' | 'not_helpful';
    reason?: string;
    rating?: number;
    alternative?: string;
    comments?: string;
  }): Promise<void> {
    return api.post(`${this.basePath}/${recommendationId}/feedback`, feedback);
  }

  async getFeedbackAnalytics(): Promise<{
    recommendationEffectiveness: {
      totalShown: number;
      totalClicked: number;
      totalCompleted: number;
      clickRate: number;
      completionRate: number;
    };
    categoryPerformance: Record<string, {
      shown: number;
      clicked: number;
      completed: number;
      satisfaction: number;
    }>;
    topPerformingRecommendations: Array<{
      recommendation: string;
      completionRate: number;
      satisfaction: number;
    }>;
    improvementSuggestions: string[];
  }> {
    return api.get(`${this.basePath}/feedback/analytics`);
  }

  // A/B Testing for Recommendations
  async participateInExperiment(experimentId: string, variant: string): Promise<{
    success: boolean;
    trackingId: string;
  }> {
    return api.post(`${this.basePath}/experiments/${experimentId}/participate`, { variant });
  }

  async recordRecommendationOutcome(recommendationId: string, outcome: {
    action: 'viewed' | 'clicked' | 'started' | 'completed' | 'dismissed';
    timeToAction?: number; // in milliseconds
    context?: Record<string, any>;
  }): Promise<void> {
    return api.post(`${this.basePath}/${recommendationId}/outcome`, outcome);
  }

  // Advanced Analytics
  async getRecommendationAnalytics(params?: {
    timeRange?: 'day' | 'week' | 'month' | 'quarter';
    includeBreakdown?: boolean;
    includePredictions?: boolean;
  }): Promise<{
    performance: {
      totalRecommendations: number;
      clickThroughRate: number;
      conversionRate: number;
      satisfactionScore: number;
      averageTimeToCompletion: number;
    };
    trends: Array<{
      date: string;
      recommendations: number;
      clicks: number;
      completions: number;
      satisfaction: number;
    }>;
    categories: Record<string, {
      recommended: number;
      clicked: number;
      completed: number;
      satisfaction: number;
    }>;
    predictions: {
      nextWeekRecommendations: number;
      expectedClickRate: number;
      expectedCompletionRate: number;
      trendingTopics: string[];
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/analytics?${searchParams.toString()}`);
  }
}

export const recommendationService = new RecommendationService();