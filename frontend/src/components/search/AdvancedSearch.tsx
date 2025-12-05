import React, { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PlayIcon,
  StarIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { LearningPath, FlashcardDeck, Quiz, Exercise, Agent } from '../../types';

interface SearchResult {
  id: string;
  type: 'learning-path' | 'flashcard-deck' | 'quiz' | 'exercise' | 'agent' | 'content';
  title: string;
  description: string;
  thumbnail?: string;
  author: string;
  rating?: number;
  difficulty?: string;
  subject?: string;
  tags: string[];
  relevanceScore: number;
  metadata: Record<string, any>;
}

interface AdvancedSearchProps {
  onResultsChange?: (results: SearchResult[]) => void;
  className?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onResultsChange,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock search data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'learning-path',
      title: 'Introduction to Machine Learning',
      description: 'A comprehensive path covering the fundamentals of machine learning algorithms and their applications.',
      author: 'Dr. Sarah Johnson',
      rating: 4.8,
      difficulty: 'Intermediate',
      subject: 'Computer Science',
      tags: ['ml', 'algorithms', 'python', 'data-science'],
      relevanceScore: 95,
      metadata: {
        duration: '20 hours',
        lessons: 15,
        enrolled: 1234,
      },
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Calculus Fundamentals Quiz',
      description: 'Test your understanding of basic calculus concepts including derivatives and integrals.',
      author: 'Math Department',
      difficulty: 'Beginner',
      subject: 'Mathematics',
      tags: ['calculus', 'derivatives', 'integrals', 'math'],
      relevanceScore: 88,
      metadata: {
        questions: 25,
        timeLimit: 30,
        attempts: 3,
      },
    },
    {
      id: '3',
      type: 'flashcard-deck',
      title: 'Organic Chemistry Reactions',
      description: 'Essential organic chemistry reactions with mechanisms and examples.',
      author: 'Prof. Michael Chen',
      rating: 4.6,
      difficulty: 'Advanced',
      subject: 'Chemistry',
      tags: ['organic-chemistry', 'reactions', 'mechanisms'],
      relevanceScore: 82,
      metadata: {
        cards: 150,
        studied: 89,
      },
    },
    {
      id: '4',
      type: 'exercise',
      title: 'Python Data Analysis Project',
      description: 'Build a complete data analysis project using pandas, numpy, and matplotlib.',
      author: 'Code Academy',
      difficulty: 'Intermediate',
      subject: 'Computer Science',
      tags: ['python', 'data-analysis', 'pandas', 'project'],
      relevanceScore: 79,
      metadata: {
        estimatedTime: '4 hours',
        difficulty: 'intermediate',
      },
    },
    {
      id: '5',
      type: 'agent',
      title: 'Math Tutor AI',
      description: 'Personalized math tutoring with step-by-step explanations and practice problems.',
      author: 'AI Learning Team',
      rating: 4.9,
      subject: 'Mathematics',
      tags: ['tutor', 'math', 'personalized', 'ai'],
      relevanceScore: 75,
      metadata: {
        responses: 1250,
        satisfaction: 4.9,
      },
    },
  ];

  const mockSuggestions = [
    'machine learning',
    'python programming',
    'calculus derivatives',
    'organic chemistry',
    'data analysis',
    'web development',
    'artificial intelligence',
    'statistics',
  ];

  // Initialize search history
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
        onResultsChange?.([]);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        result.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Sort by relevance
      filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      setResults(filteredResults);
      onResultsChange?.(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      const newHistory = [searchQuery, ...recentSearches.slice(0, 4)];
      setRecentSearches(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify([searchQuery, ...searchHistory]));
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    searchInputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'learning-path': return <BookOpenIcon className="h-5 w-5" />;
      case 'flashcard-deck': return <AcademicCapIcon className="h-5 w-5" />;
      case 'quiz': return <DocumentTextIcon className="h-5 w-5" />;
      case 'exercise': return <PlayIcon className="h-5 w-5" />;
      case 'agent': return <UserIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'learning-path': return 'Learning Path';
      case 'flashcard-deck': return 'Flashcard Deck';
      case 'quiz': return 'Quiz';
      case 'exercise': return 'Exercise';
      case 'agent': return 'AI Agent';
      default: return 'Content';
    }
  };

  const formatMetadata = (metadata: Record<string, any>) => {
    return Object.entries(metadata).map(([key, value]) => {
      if (key === 'duration' || key === 'estimatedTime') return `${value}`;
      if (key === 'cards') return `${value} cards`;
      if (key === 'questions') return `${value} questions`;
      if (key === 'lessons') return `${value} lessons`;
      if (key === 'enrolled') return `${value} enrolled`;
      if (key === 'timeLimit') return `${value} min`;
      if (key === 'attempts') return `${value} attempts`;
      return `${key}: ${value}`;
    }).join(' • ');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for learning paths, quizzes, exercises, agents..."
              className="pl-10 pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query);
                }
              }}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Search suggestions */}
          {query && suggestions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-2 p-2 z-10">
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </Card>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <FunnelIcon className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        
        <Button onClick={() => handleSearch(query)}>
          Search
        </Button>
      </div>

      {/* Recent searches */}
      {!query && recentSearches.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setQuery(search)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
              >
                {search}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Filters panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Types</option>
                <option value="learning-path">Learning Paths</option>
                <option value="quiz">Quizzes</option>
                <option value="exercise">Exercises</option>
                <option value="flashcard-deck">Flashcards</option>
                <option value="agent">AI Agents</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="computer-science">Computer Science</option>
                <option value="chemistry">Chemistry</option>
                <option value="physics">Physics</option>
                <option value="biology">Biology</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ stars</option>
                <option value="4.0">4.0+ stars</option>
                <option value="3.5">3.5+ stars</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {isSearching && (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          </div>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
          
          <div className="space-y-3">
            {results.map((result) => (
              <Card key={result.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  {result.thumbnail ? (
                    <img 
                      src={result.thumbnail} 
                      alt={result.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getTypeIcon(result.type)}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {getTypeLabel(result.type)}
                          </span>
                          {result.difficulty && (
                            <span className="text-xs text-gray-500">
                              {result.difficulty}
                            </span>
                          )}
                          {result.subject && (
                            <span className="text-xs text-gray-500">
                              {result.subject}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {result.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {result.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <span className="flex items-center space-x-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{result.author}</span>
                          </span>
                          
                          {result.rating && (
                            <span className="flex items-center space-x-1">
                              <StarIcon className="h-3 w-3" />
                              <span>{result.rating}</span>
                            </span>
                          )}
                          
                          <span>{formatMetadata(result.metadata)}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <BookmarkIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {query && !isSearching && results.length === 0 && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Search suggestions:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {mockSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};