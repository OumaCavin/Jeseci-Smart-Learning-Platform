import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAssessments } from '../../store/slices/assessmentSlice';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { 
  ClockIcon,
  TrophyIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimit: number;
  totalPoints: number;
  passingScore: number;
  questionCount: number;
  isCompleted?: boolean;
  userScore?: number;
  isPassed?: boolean;
  lastAttemptDate?: Date;
  thumbnail?: string;
}

const Assessments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assessments, loading } = useSelector((state: RootState) => state.assessment);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchAssessments());
  }, [dispatch]);

  const categories = ['All', 'Programming', 'Mathematics', 'Science', 'Language', 'Business', 'Design'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'time', label: 'Duration' }
  ];

  const filteredAssessments = assessments?.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || assessment.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || assessment.difficulty === selectedDifficulty;
    const matchesCompleted = !showCompleted || assessment.isCompleted;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesCompleted;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'time':
        return a.timeLimit - b.timeLimit;
      default:
        return new Date(b.id).getTime() - new Date(a.id).getTime();
    }
  }) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (assessment: Assessment) => {
    if (!assessment.isCompleted) {
      return <BookOpenIcon className="w-5 h-5 text-blue-500" />;
    }
    
    if (assessment.isPassed) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    
    return <XCircleIcon className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (assessment: Assessment) => {
    if (!assessment.isCompleted) {
      return 'Not Started';
    }
    
    if (assessment.isPassed) {
      return `Passed (${assessment.userScore}%)`;
    }
    
    return `Failed (${assessment.userScore}%)`;
  };

  const getStatusColor = (assessment: Assessment) => {
    if (!assessment.isCompleted) {
      return 'text-blue-600';
    }
    
    if (assessment.isPassed) {
      return 'text-green-600';
    }
    
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessments</h1>
          <p className="text-gray-600">
            Test your knowledge and track your progress with our comprehensive assessments
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search assessments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="mt-4 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Show completed only</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">{assessment.category}</span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(assessment)}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {assessment.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3">
                  {assessment.description}
                </p>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{assessment.timeLimit} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrophyIcon className="w-4 h-4 mr-2" />
                    <span>{assessment.totalPoints} pts</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    <span>{assessment.questionCount} q's</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    <span>{assessment.passingScore}% to pass</span>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${getStatusColor(assessment)}`}>
                      {getStatusText(assessment)}
                    </span>
                  </div>
                  
                  {assessment.lastAttemptDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last attempt:</span>
                      <span className="text-gray-900">
                        {new Date(assessment.lastAttemptDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar (if completed) */}
                {assessment.isCompleted && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Score</span>
                      <span>{assessment.userScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          assessment.isPassed ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${assessment.userScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex gap-2">
                  <Link to={`/assessment/${assessment.id}`} className="flex-1">
                    <Button 
                      variant={assessment.isCompleted ? "secondary" : "primary"}
                      className="w-full"
                      size="sm"
                    >
                      {assessment.isCompleted ? 'View Details' : 'Start Assessment'}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <FunnelIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button 
              variant="secondary" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setShowCompleted(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Empty State */}
        {assessments?.length === 0 && !loading && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments available</h3>
            <p className="text-gray-600">
              Check back later for new assessments or contact your instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;