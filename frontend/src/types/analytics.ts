// Analytics Dashboard Types
import type { User, LearningPath, Assessment, Agent } from '../types';

export interface AnalyticsData {
  userId: string;
  period: AnalyticsPeriod;
  overview: AnalyticsOverview;
  learningMetrics: LearningMetrics;
  performanceMetrics: PerformanceMetrics;
  behavioralMetrics: BehavioralMetrics;
  predictiveMetrics: PredictiveMetrics;
  comparisonMetrics: ComparisonMetrics;
}

export interface AnalyticsPeriod {
  start: string;
  end: string;
  granularity: 'day' | 'week' | 'month' | 'quarter';
  label: string;
}

export interface AnalyticsOverview {
  totalStudyTime: number; // in minutes
  completedLessons: number;
  completedAssessments: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  activeDays: number;
  engagementRate: number; // percentage
  improvementRate: number; // percentage
}

export interface LearningMetrics {
  timeSpentBySubject: Record<string, number>; // subject -> minutes
  lessonsCompletedByDifficulty: Record<string, number>;
  learningVelocity: DataPoint[];
  knowledgeRetentionRate: DataPoint[];
  topicMastery: TopicMastery[];
  skillProgression: SkillProgression[];
}

export interface PerformanceMetrics {
  assessmentScores: AssessmentScore[];
  improvementTrend: DataPoint[];
  strongestSubjects: SubjectPerformance[];
  weakestSubjects: SubjectPerformance[];
  averageCompletionTime: DataPoint[];
  attemptsPerAssessment: Record<string, number>;
  scoreDistribution: ScoreDistribution;
  percentileRanking: Record<string, number>;
}

export interface BehavioralMetrics {
  studySessionPatterns: StudySessionPattern[];
  peakProductivityHours: number[];
  averageSessionDuration: number;
  breakFrequency: number;
  learningPathAdherence: number; // percentage
  helpSeekingBehavior: HelpSeekingMetrics;
  collaborationMetrics: CollaborationMetrics;
}

export interface PredictiveMetrics {
  nextRecommendedAssessment: Assessment | null;
  estimatedCompletionTime: number; // days
  projectedScoreImprovement: number;
  learningPathOptimizations: LearningPathOptimization[];
  riskFactors: RiskFactor[];
  strengthAreas: StrengthArea[];
}

export interface ComparisonMetrics {
  peerRanking: PeerRanking;
  cohortComparison: CohortComparison;
  historicalComparison: HistoricalComparison;
  benchmarkComparison: BenchmarkComparison;
}

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface TopicMastery {
  topic: string;
  masteryLevel: number; // 0-100
  timeSpent: number; // minutes
  lastStudied: string;
  assessmentsCompleted: number;
  averageScore: number;
  confidenceLevel: number; // 0-100
}

export interface SkillProgression {
  skill: string;
  currentLevel: number;
  previousLevel: number;
  progressRate: number; // percentage
  targetLevel: number;
  estimatedDaysToTarget: number;
}

export interface AssessmentScore {
  assessmentId: string;
  assessmentTitle: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  attempts: number;
  timeSpent: number; // minutes
  completedAt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  totalTimeSpent: number; // minutes
  lessonsCompleted: number;
  assessmentsCompleted: number;
  improvementRate: number; // percentage
  confidenceLevel: number; // 0-100
}

export interface ScoreDistribution {
  excellent: number; // 90-100%
  good: number; // 80-89%
  average: number; // 70-79%
  belowAverage: number; // 60-69%
  poor: number; // <60%
}

export interface StudySessionPattern {
  dayOfWeek: number; // 0-6
  hourOfDay: number; // 0-23
  sessionCount: number;
  averageDuration: number; // minutes
  productivity: number; // 0-100
}

export interface HelpSeekingMetrics {
  totalHelpRequests: number;
  helpRequestsByType: Record<string, number>;
  responseTime: number; // average minutes
  resolutionRate: number; // percentage
  satisfactionRating: number; // 1-5
}

export interface CollaborationMetrics {
  groupStudySessions: number;
  peerInteractions: number;
  knowledgeSharing: number; // messages/files shared
  leadershipInstances: number;
  helpProvided: number;
  helpReceived: number;
}

export interface LearningPathOptimization {
  currentPath: string;
  suggestedPath: string;
  estimatedTimeReduction: number; // percentage
  confidenceImprovement: number; // percentage
  reason: string;
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  probability: number; // percentage
  recommendedAction: string;
}

export interface StrengthArea {
  area: string;
  strength: number; // 0-100
  evidence: string[];
  leverageOpportunities: string[];
}

export interface PeerRanking {
  overall: number; // percentile
  bySubject: Record<string, number>;
  totalPeers: number;
  ranking: number;
}

export interface CohortComparison {
  cohortSize: number;
  cohortAverageScore: number;
  userScore: number;
  percentile: number;
  strengths: string[];
  improvements: string[];
}

export interface HistoricalComparison {
  previousPeriod: AnalyticsData;
  changes: {
    metric: string;
    previousValue: number;
    currentValue: number;
    change: number; // percentage
    trend: 'up' | 'down' | 'stable';
  }[];
}

export interface BenchmarkComparison {
  industry: string;
  userScore: number;
  industryAverage: number;
  percentile: number;
  gap: number;
  recommendations: string[];
}

// Chart-specific interfaces
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
  title: string;
  description?: string;
  data: ChartData;
  options: ChartOptions;
  responsive: boolean;
  animation: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartOptions {
  plugins: {
    title?: {
      display: boolean;
      text: string;
      font?: {
        size?: number;
        weight?: string;
      };
    };
    legend?: {
      display: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled: boolean;
      backgroundColor?: string;
      titleColor?: string;
      bodyColor?: string;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
      beginAtZero?: boolean;
    };
  };
}

// Action types for Redux
export interface AnalyticsState {
  analytics: Record<string, AnalyticsData>; // userId -> analytics
  isLoading: boolean;
  error: string | null;
  selectedPeriod: AnalyticsPeriod;
  selectedMetrics: string[];
  comparisonMode: boolean;
  selectedComparisons: string[];
}