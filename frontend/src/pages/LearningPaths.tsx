import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchLearningPaths } from '../store/slices/learningSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  BookOpenIcon, 
  ClockIcon, 
  UserGroupIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  studentsCount: number;
  rating: number;
  modules: any[];
  completedModules: number;
  totalModules: number;
  isActive: boolean;
  thumbnail?: string;
}

const LearningPaths: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { learningPaths, loading } = useSelector((state: RootState) => state.learning);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    dispatch(fetchLearningPaths());
  }, [dispatch]);

  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'duration', label: 'Shortest Duration' }
  ];

  const filteredPaths = learningPaths?.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || path.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || path.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      default:
        return b.studentsCount - a.studentsCount;
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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Paths</h1>
          <p className="text-gray-600">
            Discover structured learning journeys tailored to your goals
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search paths..."
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
          </div>
        </Card>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <Card key={path.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 relative">
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                </div>
                {path.isActive && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                      In Progress
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <BookOpenIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600 font-medium">{path.category}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {path.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {path.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    <span>{path.studentsCount.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center">
                    {renderStars(path.rating)}
                    <span className="ml-1">({path.rating})</span>
                  </div>
                </div>

                {/* Progress Bar (if active) */}
                {path.isActive && (
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
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {path.isActive ? (
                    <Link to={`/learning-path/${path.id}`} className="flex-1">
                      <Button className="w-full">
                        Continue
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/learning-path/${path.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        Start Path
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <FunnelIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button 
              variant="secondary" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPaths;