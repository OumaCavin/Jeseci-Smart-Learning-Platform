import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AnalyticsChart, createLineChartConfig, createBarChartConfig, createDoughnutChartConfig } from './AnalyticsChart';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { 
  AnalyticsData, 
  ChartConfig, 
  LearningMetrics, 
  PerformanceMetrics, 
  BehavioralMetrics,
  PredictiveMetrics 
} from '../../types/analytics';

interface AnalyticsDashboardProps {
  userId?: string;
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userId,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'performance' | 'behavioral' | 'predictive'>('overview');

  // Mock analytics data (in real implementation, this would come from API)
  const mockAnalyticsData: AnalyticsData = {
    userId: userId || 'current-user',
    period: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
      granularity: 'day',
      label: 'Last 7 days',
    },
    overview: {
      totalStudyTime: 840, // 14 hours
      completedLessons: 23,
      completedAssessments: 8,
      averageScore: 87.5,
      currentStreak: 5,
      longestStreak: 12,
      totalPoints: 2450,
      activeDays: 7,
      engagementRate: 92,
      improvementRate: 15,
    },
    learningMetrics: {
      timeSpentBySubject: {
        'Mathematics': 240,
        'Physics': 180,
        'Chemistry': 120,
        'Biology': 160,
        'Computer Science': 140,
      },
      lessonsCompletedByDifficulty: {
        'Beginner': 10,
        'Intermediate': 8,
        'Advanced': 5,
      },
      learningVelocity: [
        { date: '2025-11-29', value: 2.1 },
        { date: '2025-11-30', value: 2.8 },
        { date: '2025-12-01', value: 3.2 },
        { date: '2025-12-02', value: 2.9 },
        { date: '2025-12-03', value: 3.5 },
        { date: '2025-12-04', value: 3.1 },
        { date: '2025-12-05', value: 3.8 },
      ],
      knowledgeRetentionRate: [
        { date: '2025-11-29', value: 78 },
        { date: '2025-11-30', value: 82 },
        { date: '2025-12-01', value: 85 },
        { date: '2025-12-02', value: 88 },
        { date: '2025-12-03', value: 90 },
        { date: '2025-12-04', value: 87 },
        { date: '2025-12-05', value: 92 },
      ],
      topicMastery: [
        {
          topic: 'Calculus',
          masteryLevel: 85,
          timeSpent: 120,
          lastStudied: '2025-12-05',
          assessmentsCompleted: 4,
          averageScore: 88,
          confidenceLevel: 90,
        },
        {
          topic: 'Quantum Physics',
          masteryLevel: 72,
          timeSpent: 90,
          lastStudied: '2025-12-04',
          assessmentsCompleted: 3,
          averageScore: 82,
          confidenceLevel: 75,
        },
        {
          topic: 'Organic Chemistry',
          masteryLevel: 78,
          timeSpent: 80,
          lastStudied: '2025-12-03',
          assessmentsCompleted: 2,
          averageScore: 85,
          confidenceLevel: 80,
        },
      ],
      skillProgression: [
        {
          skill: 'Problem Solving',
          currentLevel: 7,
          previousLevel: 5,
          progressRate: 40,
          targetLevel: 10,
          estimatedDaysToTarget: 30,
        },
        {
          skill: 'Critical Thinking',
          currentLevel: 8,
          previousLevel: 6,
          progressRate: 33,
          targetLevel: 10,
          estimatedDaysToTarget: 25,
        },
      ],
    },
    performanceMetrics: {
      assessmentScores: [
        {
          assessmentId: '1',
          assessmentTitle: 'Calculus Fundamentals',
          subject: 'Mathematics',
          score: 85,
          maxScore: 100,
          percentage: 85,
          attempts: 1,
          timeSpent: 45,
          completedAt: '2025-12-05',
          difficulty: 'intermediate',
        },
        {
          assessmentId: '2',
          assessmentTitle: 'Quantum Mechanics Basics',
          subject: 'Physics',
          score: 78,
          maxScore: 100,
          percentage: 78,
          attempts: 2,
          timeSpent: 60,
          completedAt: '2025-12-04',
          difficulty: 'advanced',
        },
      ],
      improvementTrend: [
        { date: '2025-11-29', value: 82 },
        { date: '2025-11-30', value: 84 },
        { date: '2025-12-01', value: 86 },
        { date: '2025-12-02', value: 85 },
        { date: '2025-12-03', value: 88 },
        { date: '2025-12-04', value: 87 },
        { date: '2025-12-05', value: 90 },
      ],
      strongestSubjects: [
        { subject: 'Mathematics', averageScore: 88, totalTimeSpent: 240, lessonsCompleted: 8, assessmentsCompleted: 3, improvementRate: 12, confidenceLevel: 85 },
        { subject: 'Biology', averageScore: 92, totalTimeSpent: 160, lessonsCompleted: 6, assessmentsCompleted: 2, improvementRate: 8, confidenceLevel: 90 },
      ],
      weakestSubjects: [
        { subject: 'Chemistry', averageScore: 75, totalTimeSpent: 120, lessonsCompleted: 5, assessmentsCompleted: 2, improvementRate: 5, confidenceLevel: 70 },
        { subject: 'Physics', averageScore: 78, totalTimeSpent: 180, lessonsCompleted: 7, assessmentsCompleted: 3, improvementRate: 8, confidenceLevel: 75 },
      ],
      averageCompletionTime: [
        { date: '2025-11-29', value: 42 },
        { date: '2025-11-30', value: 38 },
        { date: '2025-12-01', value: 35 },
        { date: '2025-12-02', value: 40 },
        { date: '2025-12-03', value: 37 },
        { date: '2025-12-04', value: 33 },
        { date: '2025-12-05', value: 30 },
      ],
      attemptsPerAssessment: {
        '1': 1,
        '2': 2,
        '3': 1,
        '4': 3,
      },
      scoreDistribution: {
        excellent: 35,
        good: 30,
        average: 20,
        belowAverage: 10,
        poor: 5,
      },
      percentileRanking: {
        'Mathematics': 85,
        'Physics': 78,
        'Chemistry': 72,
        'Biology': 90,
        'Computer Science': 82,
      },
    },
    behavioralMetrics: {
      studySessionPatterns: [
        { dayOfWeek: 1, hourOfDay: 9, sessionCount: 3, averageDuration: 45, productivity: 85 },
        { dayOfWeek: 1, hourOfDay: 14, sessionCount: 2, averageDuration: 60, productivity: 90 },
        { dayOfWeek: 2, hourOfDay: 10, sessionCount: 4, averageDuration: 50, productivity: 88 },
        { dayOfWeek: 2, hourOfDay: 15, sessionCount: 1, averageDuration: 90, productivity: 95 },
      ],
      peakProductivityHours: [14, 15, 16],
      averageSessionDuration: 52,
      breakFrequency: 2.5, // breaks per hour
      learningPathAdherence: 88,
      helpSeekingMetrics: {
        totalHelpRequests: 12,
        helpRequestsByType: {
          'content': 5,
          'technical': 3,
          'concept': 4,
        },
        responseTime: 15, // minutes
        resolutionRate: 85,
        satisfactionRating: 4.2,
      },
      collaborationMetrics: {
        groupStudySessions: 8,
        peerInteractions: 25,
        knowledgeSharing: 15,
        leadershipInstances: 3,
        helpProvided: 18,
        helpReceived: 12,
      },
    },
    predictiveMetrics: {
      nextRecommendedAssessment: null,
      estimatedCompletionTime: 45, // days
      projectedScoreImprovement: 8, // percentage
      learningPathOptimizations: [
        {
          currentPath: 'Traditional Linear Path',
          suggestedPath: 'Adaptive Personalized Path',
          estimatedTimeReduction: 15,
          confidenceImprovement: 12,
          reason: 'Based on your learning patterns and strengths',
        },
      ],
      riskFactors: [
        {
          type: 'Low Engagement',
          severity: 'medium',
          description: 'Declining study time over the past 3 days',
          probability: 65,
          recommendedAction: 'Increase session frequency or variety',
        },
      ],
      strengthAreas: [
        {
          area: 'Problem Solving',
          strength: 85,
          evidence: ['High scores in mathematics', 'Quick completion times', 'Low error rates'],
          leverageOpportunities: ['Peer tutoring', 'Advanced challenges', 'Teaching opportunities'],
        },
      ],
    },
    comparisonMetrics: {
      peerRanking: {
        overall: 85,
        bySubject: {
          'Mathematics': 90,
          'Physics': 78,
          'Chemistry': 72,
          'Biology': 92,
          'Computer Science': 82,
        },
        totalPeers: 100,
        ranking: 15,
      },
      cohortComparison: {
        cohortSize: 50,
        cohortAverageScore: 78,
        userScore: 87,
        percentile: 85,
        strengths: ['Mathematics', 'Problem-solving speed', 'Consistency'],
        improvements: ['Chemistry retention', 'Physics concepts'],
      },
      historicalComparison: {
        previousPeriod: {
          // Previous period data would be here
        } as any,
        changes: [
          { metric: 'Study Time', previousValue: 720, currentValue: 840, change: 16.7, trend: 'up' },
          { metric: 'Average Score', previousValue: 82, currentValue: 87.5, change: 6.7, trend: 'up' },
          { metric: 'Completed Lessons', previousValue: 18, currentValue: 23, change: 27.8, trend: 'up' },
        ],
      },
      benchmarkComparison: {
        industry: 'STEM Education',
        userScore: 87,
        industryAverage: 78,
        percentile: 85,
        gap: 9,
        recommendations: ['Focus on advanced topics', 'Consider peer mentoring', 'Explore specialized tracks'],
      },
    },
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setIsLoading(false);
    }, 1000);
  }, [userId, selectedPeriod]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 mt-2">Loading analytics data...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8 text-center">
          <p className="text-gray-500">No analytics data available</p>
        </Card>
      </div>
    );
  }

  // Generate chart configurations
  const learningVelocityChart = createLineChartConfig(
    'Learning Velocity',
    {
      labels: analyticsData.learningMetrics.learningVelocity.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [{
        label: 'Lessons per day',
        data: analyticsData.learningMetrics.learningVelocity.map(d => d.value),
        color: '#3B82F6',
      }],
    }
  );

  const performanceTrendChart = createLineChartConfig(
    'Performance Trend',
    {
      labels: analyticsData.performanceMetrics.improvementTrend.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [{
        label: 'Average Score (%)',
        data: analyticsData.performanceMetrics.improvementTrend.map(d => d.value),
        color: '#10B981',
      }],
    }
  );

  const scoreDistributionChart = createDoughnutChartConfig(
    'Score Distribution',
    {
      labels: ['Excellent (90-100%)', 'Good (80-89%)', 'Average (70-79%)', 'Below Average (60-69%)', 'Poor (<60%)'],
      values: Object.values(analyticsData.performanceMetrics.scoreDistribution),
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'],
    }
  );

  const timeSpentChart = createBarChartConfig(
    'Time Spent by Subject',
    {
      labels: Object.keys(analyticsData.learningMetrics.timeSpentBySubject),
      datasets: [{
        label: 'Minutes',
        data: Object.values(analyticsData.learningMetrics.timeSpentBySubject),
        color: '#8B5CF6',
      }],
    }
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your learning journey and performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(analyticsData.overview.totalStudyTime)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData.overview.averageScore)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.completedLessons}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.currentStreak} days
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'learning', label: 'Learning Metrics' },
            { id: 'performance', label: 'Performance' },
            { id: 'behavioral', label: 'Behavioral Insights' },
            { id: 'predictive', label: 'Predictions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart config={learningVelocityChart} />
            <AnalyticsChart config={performanceTrendChart} />
            <AnalyticsChart config={scoreDistributionChart} />
            <AnalyticsChart config={timeSpentChart} />
          </div>
        )}

        {/* Learning Metrics Tab */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart config={timeSpentChart} />
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Mastery</h3>
                <div className="space-y-4">
                  {analyticsData.learningMetrics.topicMastery.map((topic, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                        <span className="text-sm font-medium text-gray-600">
                          {topic.masteryLevel}% mastery
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${topic.masteryLevel}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Last studied: {new Date(topic.lastStudied).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart config={performanceTrendChart} />
              <AnalyticsChart config={scoreDistributionChart} />
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Scores</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.performanceMetrics.assessmentScores.map((score, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {score.assessmentTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {score.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {score.percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {score.attempts}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTime(score.timeSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Behavioral Insights Tab */}
        {activeTab === 'behavioral' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Session Patterns</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Session Duration</span>
                  <span className="font-medium">{formatTime(analyticsData.behavioralMetrics.averageSessionDuration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Break Frequency</span>
                  <span className="font-medium">{analyticsData.behavioralMetrics.breakFrequency}/hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Learning Path Adherence</span>
                  <span className="font-medium">{formatPercentage(analyticsData.behavioralMetrics.learningPathAdherence)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Peak Productivity Hours</span>
                  <span className="font-medium">
                    {analyticsData.behavioralMetrics.peakProductivityHours.join(', ')}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Group Study Sessions</span>
                  <span className="font-medium">{analyticsData.behavioralMetrics.collaborationMetrics.groupStudySessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Peer Interactions</span>
                  <span className="font-medium">{analyticsData.behavioralMetrics.collaborationMetrics.peerInteractions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Knowledge Sharing</span>
                  <span className="font-medium">{analyticsData.behavioralMetrics.collaborationMetrics.knowledgeSharing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Leadership Instances</span>
                  <span className="font-medium">{analyticsData.behavioralMetrics.collaborationMetrics.leadershipInstances}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictive' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictions & Recommendations</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900">Estimated Completion</h4>
                  <p className="text-sm text-gray-600">
                    {analyticsData.predictiveMetrics.estimatedCompletionTime} days remaining
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">Projected Score Improvement</h4>
                  <p className="text-sm text-gray-600">
                    +{analyticsData.predictiveMetrics.projectedScoreImprovement}% in next period
                  </p>
                </div>
                {analyticsData.predictiveMetrics.riskFactors.map((risk, index) => (
                  <div key={index} className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium text-gray-900">{risk.type}</h4>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Probability: {risk.probability}% • {risk.recommendedAction}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strength Areas</h3>
              <div className="space-y-4">
                {analyticsData.predictiveMetrics.strengthAreas.map((strength, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{strength.area}</h4>
                      <span className="text-sm font-medium text-gray-600">
                        {strength.strength}% strength
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${strength.strength}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Leverage: {strength.leverageOpportunities.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};