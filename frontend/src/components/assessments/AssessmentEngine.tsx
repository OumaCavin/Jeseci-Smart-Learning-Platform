import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAssessment, submitAssessment } from '../../store/slices/assessmentSlice';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'code';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  totalPoints: number;
  questions: Question[];
  passingScore: number;
  instructions: string;
}

const AssessmentEngine: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAssessment, loading } = useSelector((state: RootState) => state.assessment);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAssessment(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentAssessment && !isSubmitted) {
      setTimeRemaining(currentAssessment.timeLimit * 60); // Convert to seconds
    }
  }, [currentAssessment, isSubmitted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0 && !isSubmitted) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentAssessment && currentQuestionIndex < currentAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!currentAssessment) return;

    setIsSubmitted(true);
    
    try {
      const result = await dispatch(submitAssessment({
        assessmentId: currentAssessment.id,
        answers,
        timeSpent: currentAssessment.timeLimit * 60 - timeRemaining
      }));
      
      if (submitAssessment.fulfilled.match(result)) {
        setResults(result.payload);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  const renderQuestion = (question: Question) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="mr-3"
                  disabled={isSubmitted}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            {['True', 'False'].map((option) => (
              <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="mr-3"
                  disabled={isSubmitted}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'short-answer':
        return (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
            disabled={isSubmitted}
          />
        );

      case 'essay':
        return (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Write your essay response..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={8}
            disabled={isSubmitted}
          />
        );

      case 'code':
        return (
          <div>
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Write your code here..."
              className="w-full p-3 border border-gray-300 rounded-lg font-mono"
              rows={10}
              disabled={isSubmitted}
            />
            <p className="text-sm text-gray-500 mt-2">
              Use proper syntax and indentation for your code
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const calculateScore = () => {
    if (!currentAssessment || !results) return 0;
    
    let totalScore = 0;
    currentAssessment.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer || 
                       (Array.isArray(question.correctAnswer) && 
                        question.correctAnswer.includes(userAnswer));
      
      if (isCorrect) {
        totalScore += question.points;
      }
    });
    
    return totalScore;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
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

  if (showResults && results) {
    const score = calculateScore();
    const percentage = (score / currentAssessment.totalPoints) * 100;
    const passed = percentage >= currentAssessment.passingScore;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="mb-6">
              {passed ? (
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Assessment {passed ? 'Completed' : 'Failed'}
              </h1>
              <p className="text-gray-600">
                {passed ? 'Congratulations! You passed the assessment.' : 'You did not meet the passing criteria.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {score}/{currentAssessment.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(percentage)}%
                </div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatTime(currentAssessment.timeLimit * 60 - timeRemaining)}
                </div>
                <div className="text-sm text-gray-600">Time Used</div>
              </div>
            </div>

            {passed && (
              <div className="mb-6">
                <TrophyIcon className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600">You've earned a new achievement!</p>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/assessments')}>
                Back to Assessments
              </Button>
              <Button variant="secondary" onClick={() => window.print()}>
                Print Results
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = currentAssessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentAssessment.title}</h1>
                <p className="text-gray-600">{currentAssessment.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-red-600 mb-1">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span className="text-lg font-semibold">{formatTime(timeRemaining)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {currentAssessment.questions.length}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        {currentQuestionIndex === 0 && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h2>
              <div className="text-gray-700">
                <p className="mb-2">{currentAssessment.instructions}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Time limit: {currentAssessment.timeLimit} minutes</li>
                  <li>Total points: {currentAssessment.totalPoints}</li>
                  <li>Passing score: {currentAssessment.passingScore}%</li>
                  <li>You can navigate between questions using Previous/Next buttons</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Question */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Question {currentQuestionIndex + 1}
              </h2>
              <span className="text-sm text-gray-500">
                {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-900 mb-4">{currentQuestion.question}</p>
              {renderQuestion(currentQuestion)}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between">
              <Button 
                variant="secondary" 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <div className="flex space-x-4">
                {currentQuestionIndex < currentAssessment.questions.length - 1 ? (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentEngine;