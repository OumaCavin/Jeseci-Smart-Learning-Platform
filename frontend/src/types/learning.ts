// Learning Components Types

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  maxAttempts?: number;
  randomizeQuestions?: boolean;
  showCorrectAnswers: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'multiple-select' | 'short-answer';
  options?: string[]; // for multiple-choice and multiple-select
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  media?: QuestionMedia[];
}

export interface QuestionMedia {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  caption?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  timestamp: string;
  timeSpent: number; // in seconds
}

export interface QuizResult {
  quizId: string;
  userId: string;
  answers: UserAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  completedAt: string;
  feedback: string;
  attempt: number;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: 'coding' | 'math' | 'writing' | 'diagram' | 'simulation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  estimatedTime: number; // in minutes
  maxScore: number;
  rubric?: ExerciseRubric;
  starterCode?: string;
  testCases?: TestCase[];
  resources?: ExerciseResource[];
  hints: Hint[];
  solution?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ExerciseRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  name: string;
  description: string;
  points: number;
}

export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  isHidden: boolean;
  weight: number;
}

export interface ExerciseResource {
  type: 'link' | 'document' | 'video' | 'image';
  title: string;
  url: string;
  description?: string;
}

export interface Hint {
  id: string;
  text: string;
  order: number;
  cost: number; // points deducted for using this hint
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  userId: string;
  content: string;
  attachments?: SubmissionAttachment[];
  score?: number;
  feedback?: string;
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  submittedAt?: string;
  gradedAt?: string;
  gradedBy?: string;
  rubricScores?: Record<string, number>;
}

export interface SubmissionAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  media?: FlashcardMedia[];
  notes?: string;
  sources?: string[];
}

export interface FlashcardMedia {
  type: 'image' | 'audio' | 'video';
  url: string;
  alt?: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  subject: string;
  difficulty: 'mixed' | 'beginner' | 'intermediate' | 'advanced';
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  stats: DeckStats;
}

export interface DeckStats {
  totalCards: number;
  cardsStudied: number;
  masteryRate: number; // percentage of cards mastered
  averageStudyTime: number; // in minutes
  lastStudied?: string;
  studyStreak: number;
}

export interface StudySession {
  id: string;
  deckId: string;
  userId: string;
  cardsReviewed: number;
  cardsCorrect: number;
  cardsIncorrect: number;
  timeSpent: number; // in seconds
  startedAt: string;
  endedAt: string;
  studyMode: 'review' | 'learn' | 'test';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in hours
  modules: LearningModule[];
  prerequisites: string[];
  skills: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPublic: boolean;
  enrollmentCount: number;
  completionRate: number;
  rating: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'exercise' | 'quiz' | 'project';
  order: number;
  estimatedDuration: number; // in minutes
  content: ModuleContent[];
  prerequisites: string[];
  isOptional: boolean;
  isLocked: boolean;
  completionCriteria: CompletionCriteria;
}

export interface ModuleContent {
  id: string;
  type: 'text' | 'video' | 'interactive' | 'simulation' | 'external';
  title: string;
  content: string;
  duration?: number; // in minutes
  order: number;
}

export interface CompletionCriteria {
  type: 'view' | 'completion' | 'score' | 'time';
  threshold?: number;
  required: boolean;
}

export interface LearningProgress {
  userId: string;
  pathId: string;
  moduleId?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  progress: number; // 0-100
  timeSpent: number; // in minutes
  lastAccessed: string;
  completionDate?: string;
  score?: number;
  attempts: number;
  nextReview?: string;
}

// Study Analytics
export interface StudyAnalytics {
  userId: string;
  totalStudyTime: number; // in minutes
  studySessions: StudySession[];
  averageSessionDuration: number;
  studyStreak: number;
  longestStreak: number;
  cardsMastered: number;
  accuracy: number; // percentage
  preferredStudyTimes: number[]; // hours of day
  subjectDistribution: Record<string, number>; // subject -> time spent
  improvementTrend: DataPoint[];
  retentionRate: number; // percentage
}

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

// Adaptive Learning
export interface AdaptiveLearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  pacePreference: 'slow' | 'normal' | 'fast';
  difficultyPreference: 'challenging' | 'balanced' | 'comfortable';
  strengthAreas: string[];
  weaknessAreas: string[];
  recommendedNextContent: string[];
  optimalSessionLength: number; // in minutes
  peakPerformanceHours: number[];
}

export interface PersonalizationSettings {
  userId: string;
  notifications: NotificationSettings;
  studyReminders: StudyReminder[];
  difficultyAdjustment: 'manual' | 'adaptive' | 'mixed';
  contentFiltering: ContentFilter;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  studyReminders: boolean;
  achievements: boolean;
  streakWarnings: boolean;
  newContent: boolean;
  peerActivity: boolean;
}

export interface StudyReminder {
  id: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 for days of week
  isActive: boolean;
}

export interface ContentFilter {
  subjects: string[];
  difficultyLevels: string[];
  contentTypes: string[];
  maxSessionLength?: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  textToSpeech: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
}