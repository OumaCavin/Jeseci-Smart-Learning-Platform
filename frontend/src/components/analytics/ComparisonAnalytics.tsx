import React, { useState } from 'react';
import {
  UserGroupIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnalyticsChart, createBarChartConfig, createLineChartConfig, createDoughnutChartConfig } from './AnalyticsChart';
import type { ComparisonMetrics } from '../../types/analytics';

interface ComparisonAnalyticsProps {
  userId: string;
  className?: string;
}

export const ComparisonAnalytics: React.FC<ComparisonAnalyticsProps> = ({
  userId,
  className = '',
}) => {
  const [comparisonType, setComparisonType] = useState<'peers' | 'cohort' | 'historical' | 'benchmark'>('cohort');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['all']);
  const [timeRange, setTimeRange] = useState('month');

  // Mock comparison data
  const mockComparisonData: ComparisonMetrics = {
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
        userId: 'current-user',
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          granularity: 'week',
          label: 'Previous 3 weeks',
        },
        overview: {
          totalStudyTime: 720,
          completedLessons: 18,
          completedAssessments: 6,
          averageScore: 82,
          currentStreak: 3,
          longestStreak: 8,
          totalPoints: 2100,
          activeDays: 5,
          engagementRate: 85,
          improvementRate: 5,
        },
      } as any,
      changes: [
        { metric: 'Study Time', previousValue: 720, currentValue: 840, change: 16.7, trend: 'up' },
        { metric: 'Average Score', previousValue: 82, currentValue: 87.5, change: 6.7, trend: 'up' },
        { metric: 'Completed Lessons', previousValue: 18, currentValue: 23, change: 27.8, trend: 'up' },
        { metric: 'Completed Assessments', previousValue: 6, currentValue: 8, change: 33.3, trend: 'up' },
        { metric: 'Active Days', previousValue: 5, currentValue: 7, change: 40.0, trend: 'up' },
      ],
    },
    benchmarkComparison: {
      industry: 'STEM Education',
      userScore: 87,
      industryAverage: 78,
      percentile: 85,
      gap: 9,
      recommendations: [
        'Focus on advanced topics',
        'Consider peer mentoring',
        'Explore specialized tracks',
        'Participate in competitions',
      ],
    },
  };

  // Generate comparison charts
  const subjectComparisonChart = createBarChartConfig(
    'Performance by Subject',
    {
      labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
      datasets: [
        {
          label: 'Your Score',
          data: [88, 78, 75, 92, 85],
          color: '#3B82F6',
        },
        {
          label: 'Peer Average',
          data: [82, 75, 78, 85, 80],
          color: '#10B981',
        },
        {
          label: 'Cohort Average',
          data: [85, 77, 76, 88, 82],
          color: '#F59E0B',
        },
      ],
    }
  );

  const progressComparisonChart = createLineChartConfig(
    'Progress Comparison',
    {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Your Progress',
          data: [70, 75, 80, 87],
          color: '#3B82F6',
        },
        {
          label: 'Cohort Average',
          data: [65, 70, 73, 78],
          color: '#10B981',
        },
      ],
    }
  );

  const rankingDistributionChart = createDoughnutChartConfig(
    'Ranking Distribution',
    {
      labels: ['Top 10%', 'Top 25%', 'Top 50%', 'Bottom 50%'],
      values: [15, 35, 35, 15],
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
    }
  );

  const handleComparisonTypeChange = (type: typeof comparisonType) => {
    setComparisonType(type);
  };

  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getComparisonTabs = () => [
    { id: 'peers', label: 'Peer Ranking', icon: UserGroupIcon },
    { id: 'cohort', label: 'Cohort Analysis', icon: AcademicCapIcon },
    { id: 'historical', label: 'Historical', icon: ChartBarIcon },
    { id: 'benchmark', label: 'Benchmark', icon: TrendingUpIcon },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Comparison Analytics</h2>
          <p className="text-gray-600 mt-1">
            Compare your performance with peers, cohorts, and industry benchmarks
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {getComparisonTabs().map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleComparisonTypeChange(tab.id as typeof comparisonType)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                comparisonType === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {/* Peer Ranking Tab */}
        {comparisonType === 'peers' && (
          <div className="space-y-6">
            {/* Ranking Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <UserGroupIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  #{mockComparisonData.peerRanking.ranking}
                </p>
                <p className="text-sm text-gray-600">out of {mockComparisonData.peerRanking.totalPeers} peers</p>
                <p className="text-xs text-gray-500 mt-1">
                  {mockComparisonData.peerRanking.overall}th percentile overall
                </p>
              </Card>

              <Card className="p-6 text-center">
                <ChartBarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {mockComparisonData.cohortComparison.percentile}th
                </p>
                <p className="text-sm text-gray-600">percentile in cohort</p>
                <p className="text-xs text-gray-500 mt-1">
                  Cohort size: {mockComparisonData.cohortComparison.cohortSize}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <AcademicCapIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {mockComparisonData.benchmarkComparison.percentile}th
                </p>
                <p className="text-sm text-gray-600">percentile vs industry</p>
                <p className="text-xs text-gray-500 mt-1">
                  {mockComparisonData.benchmarkComparison.industry}
                </p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart config={subjectComparisonChart} />
              <AnalyticsChart config={rankingDistributionChart} />
            </div>
          </div>
        )}

        {/* Cohort Analysis Tab */}
        {comparisonType === 'cohort' && (
          <div className="space-y-6">
            {/* Cohort Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Your Score</span>
                    <span className="font-bold text-lg text-blue-600">
                      {mockComparisonData.cohortComparison.userScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cohort Average</span>
                    <span className="font-medium text-gray-900">
                      {mockComparisonData.cohortComparison.cohortAverageScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Difference</span>
                    <span className="font-medium text-green-600">
                      +{mockComparisonData.cohortComparison.userScore - mockComparisonData.cohortComparison.cohortAverageScore}%
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths & Improvements</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2">Strengths</h4>
                    <div className="space-y-1">
                      {mockComparisonData.cohortComparison.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-orange-700 mb-2">Areas for Improvement</h4>
                    <div className="space-y-1">
                      {mockComparisonData.cohortComparison.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          <span className="text-sm text-gray-700">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Progress Chart */}
            <AnalyticsChart config={progressComparisonChart} />
          </div>
        )}

        {/* Historical Comparison Tab */}
        {comparisonType === 'historical' && (
          <div className="space-y-6">
            {/* Changes Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {mockComparisonData.historicalComparison.changes.map((change, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {change.metric}
                    </span>
                    {getTrendIcon(change.trend)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatChange(change.change)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {change.previousValue} → {change.currentValue}
                  </div>
                </Card>
              ))}
            </div>

            {/* Historical Chart */}
            <AnalyticsChart config={progressComparisonChart} />

            {/* Detailed Changes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Changes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Previous Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockComparisonData.historicalComparison.changes.map((change, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {change.metric}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {change.previousValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {change.currentValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatChange(change.change)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTrendIcon(change.trend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Benchmark Comparison Tab */}
        {comparisonType === 'benchmark' && (
          <div className="space-y-6">
            {/* Benchmark Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {mockComparisonData.benchmarkComparison.industry} Benchmark
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Your Score</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {mockComparisonData.benchmarkComparison.userScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Industry Average</span>
                    <span className="text-xl font-medium text-gray-900">
                      {mockComparisonData.benchmarkComparison.industryAverage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Performance Gap</span>
                    <span className="text-xl font-medium text-green-600">
                      +{mockComparisonData.benchmarkComparison.gap}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Industry Percentile</span>
                    <span className="text-xl font-medium text-purple-600">
                      {mockComparisonData.benchmarkComparison.percentile}th
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {mockComparisonData.benchmarkComparison.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Subject Comparison Chart */}
            <AnalyticsChart config={subjectComparisonChart} />
          </div>
        )}
      </div>
    </div>
  );
};