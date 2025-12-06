import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAssessment, startAssessment, fetchUserResults } from '../../store/slices/assessmentSlice';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { 
  ClockIcon,
  TrophyIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface Assessment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  timeLimit: number;
  totalPoints: number;
  passingScore: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  createdAt: Date;
  questionCount: number;
  estimatedTime: number;
}

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAssessment, userResults, loading } = useSelector((state: RootState) => state.assessment);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAssessment(id));
      dispatch(fetchUserResults(id));
    }
  }, [dispatch, id]);

  const handleStartAssessment = async () => {
    if (!currentAssessment) return;

    setHasStarted(true);
    
    try {
      const result = await dispatch(startAssessment(currentAssessment.id));
      if (startAssessment.fulfilled.match(result)) {
        navigate(`/assessment/${currentAssessment.id}/take`);
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      setHasStarted(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getAssessmentStats = () => {
    if (!userResults) return null;

    const totalAttempts = userResults.length;
    const bestScore = Math.max(...userResults.map(r => r.score));
    const averageScore = userResults.reduce((sum, r) => sum + r.score, 0) / totalAttempts;
    const passedCount = userResults.filter(r => r.score >= (currentAssessment?.passingScore || 0)).length;
    const lastAttempt = userResults[userResults.length - 1];

    return {
      totalAttempts,
      bestScore,
      averageScore: Math.round(averageScore),
      passedCount,
      lastAttempt
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment details...</p>
        </div>
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Not Found</h3>
          <p className="text-gray-600 mb-4">The requested assessment could not be found.</p>
          <Button onClick={() => navigate('/assessments')}>Back to Assessments</Button>
        </Card>
      </div>
    );
  }

  const stats = getAssessmentStats();
  const canStart = !stats || stats.totalAttempts === 0 || !stats.passedCount;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/assessments')}
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
        </div>

        {/* Header */}
        <Card className="mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${getDifficultyColor(currentAssessment.difficulty)}`}>
                    {currentAssessment.difficulty}
                  </span>
                  <span className="text-sm text-blue-600 font-medium">{currentAssessment.category}</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {currentAssessment.title}
                </h1>
                
                <p className="text-gray-600 text-lg mb-4">
                  {currentAssessment.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{currentAssessment.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-2" />
                    <span>{currentAssessment.totalPoints} points</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    <span>{currentAssessment.questionCount} questions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Created on {formatDate(currentAssessment.createdAt)}
              </div>
              
              {canStart ? (
                <Button 
                  onClick={handleStartAssessment}
                  disabled={hasStarted}
                  loading={hasStarted}
                  className="px-8 py-3"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Start Assessment
                </Button>
              ) : (
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  <span>Already Passed</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {currentAssessment.instructions}
            </div>
          </div>
        </Card>

        {/* User Statistics */}
        {stats && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {stats.totalAttempts}
                  </div>
                  <div className="text-sm text-gray-600">Total Attempts</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {stats.bestScore}%
                  </div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {stats.averageScore}%
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {stats.passedCount}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
              </div>

              {stats.lastAttempt && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Latest Attempt</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">
                        {formatDate(stats.lastAttempt.completedAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-3">
                        {stats.lastAttempt.score}%
                      </span>
                      {stats.lastAttempt.score >= currentAssessment.passingScore ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Recent Results */}
        {userResults && userResults.length > 0 && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attempts</h2>
              
              <div className="space-y-3">
                {userResults.slice(-5).reverse().map((result, index) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        Attempt {userResults.length - index}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(result.completedAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-3">
                        {result.score}%
                      </span>
                      {result.score >= currentAssessment.passingScore ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {userResults.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost">View All Attempts</Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetail;