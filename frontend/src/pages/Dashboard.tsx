import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUserProfile } from '../store/slices/authSlice';
import { fetchLearningPaths } from '../store/slices/learningSlice';
import { fetchRecentAssessments } from '../store/slices/assessmentSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BookOpenIcon, CheckCircleIcon, TrophyIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface DashboardStats {
  activePaths: number;
  completedModules: number;
  totalAssessments: number;
  achievements: number;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { learningPaths } = useSelector((state: RootState) => state.learning);
  const { assessments } = useSelector((state: RootState) => state.assessment);

  useEffect(() => {
    if (user) {
      dispatch(fetchLearningPaths());
      dispatch(fetchRecentAssessments());
    }
  }, [dispatch, user]);

  const stats: DashboardStats = {
    activePaths: learningPaths?.filter(path => path.isActive).length || 0,
    completedModules: learningPaths?.reduce((total, path) => {
      return total + path.modules.filter(module => module.isCompleted).length;
    }, 0) || 0,
    totalAssessments: assessments?.length || 0,
    achievements: 12 // Mock data - would come from user profile
  };

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current learning path',
      icon: BookOpenIcon,
      action: () => console.log('Continue learning'),
      color: 'bg-blue-500'
    },
    {
      title: 'Take Assessment',
      description: 'Test your knowledge',
      icon: CheckCircleIcon,
      action: () => console.log('Take assessment'),
      color: 'bg-green-500'
    },
    {
      title: 'Chat with AI',
      description: 'Get personalized help',
      icon: ChatBubbleLeftRightIcon,
      action: () => console.log('Chat with AI'),
      color: 'bg-purple-500'
    },
    {
      title: 'View Achievements',
      description: 'Check your progress',
      icon: TrophyIcon,
      action: () => console.log('View achievements'),
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Learner'}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpenIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Paths</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activePaths}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Modules</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedModules}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalAssessments}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Achievements</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.achievements}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="p-6" onClick={action.action}>
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Learning Paths */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths?.slice(0, 3).map((path) => (
              <Card key={path.id}>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{path.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((path.completedModules / path.totalModules) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(path.completedModules / path.totalModules) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button className="w-full">Continue</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Completed "JavaScript Fundamentals" module</span>
                <span className="ml-auto text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Started "React Advanced Patterns" course</span>
                <span className="ml-auto text-sm text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Earned "JavaScript Expert" badge</span>
                <span className="ml-auto text-sm text-gray-500">2 days ago</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;