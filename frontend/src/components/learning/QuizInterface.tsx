import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Quiz, Question, UserAnswer, QuizResult } from '../../types';

interface QuizInterfaceProps {
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
  onExit?: () => void;
  className?: string;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  quiz,
  onComplete,
  onExit,
  className = '',
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null); // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!quizStarted || !timeRemaining || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining, quizCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        timestamp: new Date().toISOString(),
        timeSpent: 0, // Would track actual time in real implementation
      },
    }));
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleToggleReview = (questionId: string) => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
    } else {
      newMarked.add(questionId);
    }
    setMarkedForReview(newMarked);
  };

  const handleToggleExplanation = (questionId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const calculateScore = (): QuizResult => {
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      totalPoints += question.points;

      if (userAnswer) {
        let isCorrect = false;

        switch (question.type) {
          case 'multiple-choice':
          case 'true-false':
            isCorrect = userAnswer.answer === question.correctAnswer;
            break;
          case 'multiple-select':
            const correctAnswers = Array.isArray(question.correctAnswer) 
              ? question.correctAnswer 
              : [question.correctAnswer];
            const userAnswers = Array.isArray(userAnswer.answer) 
              ? userAnswer.answer 
              : [userAnswer.answer];
            isCorrect = correctAnswers.length === userAnswers.length && 
                       correctAnswers.every(ans => userAnswers.includes(ans));
            break;
          case 'short-answer':
            // In real implementation, would use fuzzy matching or AI
            isCorrect = String(userAnswer.answer).toLowerCase().trim() === 
                       String(question.correctAnswer).toLowerCase().trim();
            break;
        }

        if (isCorrect) {
          correctAnswers += 1;
          earnedPoints += question.points;
        }
      }
    });

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    return {
      quizId: quiz.id,
      userId: 'current-user', // Would get from auth context
      answers: Object.values(answers),
      score: earnedPoints,
      maxScore: totalPoints,
      percentage,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent: quiz.timeLimit ? (quiz.timeLimit * 60 - (timeRemaining || 0)) : 0,
      completedAt: new Date().toISOString(),
      feedback: generateFeedback(percentage, correctAnswers, quiz.questions.length),
    };
  };

  const generateFeedback = (percentage: number, correct: number, total: number): string => {
    if (percentage >= 90) {
      return `Excellent work! You scored ${correct} out of ${total} questions correctly. You've demonstrated a strong understanding of the material.`;
    } else if (percentage >= 80) {
      return `Great job! You scored ${correct} out of ${total} questions correctly. You have a good grasp of the concepts with room for minor improvements.`;
    } else if (percentage >= 70) {
      return `Good effort! You scored ${correct} out of ${total} questions correctly. Consider reviewing the areas where you struggled.`;
    } else if (percentage >= 60) {
      return `You scored ${correct} out of ${total} questions correctly. Keep studying and practice more to improve your understanding.`;
    } else {
      return `You scored ${correct} out of ${total} questions correctly. I recommend reviewing the study materials before attempting this quiz again.`;
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = calculateScore();
      setQuizCompleted(true);
      onComplete(result);
      setIsSubmitting(false);
    }, 1000);
  };

  if (!quizStarted) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{quiz.questions.length}</p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
              </div>

              {quiz.timeLimit && (
                <div className="flex items-center justify-center space-x-3">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{quiz.timeLimit} minutes</p>
                    <p className="text-sm text-gray-600">Time Limit</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{quiz.passingScore}%</p>
                  <p className="text-sm text-gray-600">Passing Score</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Instructions</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• You can navigate between questions using the navigation panel</li>
                  {quiz.timeLimit && <li>• The quiz will auto-submit when time runs out</li>}
                  <li>• Mark questions for review if you're unsure</li>
                  <li>• You can review explanations after submitting</li>
                </ul>
              </div>

              <Button onClick={handleStartQuiz} size="lg" className="px-8">
                Start Quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const result = calculateScore();
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600">Great work on completing the quiz</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{result.percentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Final Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{result.correctAnswers}</p>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{formatTime(result.timeSpent)}</p>
                <p className="text-sm text-gray-600">Time Taken</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{result.feedback}</p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={onExit}>
                Exit Quiz
              </Button>
              <Button onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with timer and progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">{quiz.title}</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {timeRemaining !== null && (
              <div className={`flex items-center space-x-2 ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                <ClockIcon className="h-4 w-4" />
                <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={onExit}>
              Exit
            </Button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{answeredQuestions} of {quiz.questions.length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main question area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              {/* Question header */}
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentQuestion.question}
                </h2>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleReview(currentQuestion.id)}
                    className={markedForReview.has(currentQuestion.id) ? 'bg-yellow-50 border-yellow-300' : ''}
                  >
                    <BookmarkIcon className="h-4 w-4 mr-1" />
                    {markedForReview.has(currentQuestion.id) ? 'Marked' : 'Mark for Review'}
                  </Button>
                </div>
              </div>

              {/* Question points */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span className="capitalize">{currentQuestion.type.replace('-', ' ')}</span>
              </div>

              {/* Answer options */}
              <div className="space-y-3">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = answers[currentQuestion.id]?.answer === option;
                      return (
                        <label
                          key={index}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                            className="mr-3"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === 'true-false' && (
                  <div className="space-y-2">
                    {['True', 'False'].map((option) => {
                      const isSelected = answers[currentQuestion.id]?.answer === option;
                      return (
                        <label
                          key={option}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                            className="mr-3"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === 'multiple-select' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => {
                      const userAnswer = answers[currentQuestion.id]?.answer;
                      const isSelected = Array.isArray(userAnswer) && userAnswer.includes(option);
                      return (
                        <label
                          key={index}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                              if (e.target.checked) {
                                handleAnswerSelect(currentQuestion.id, [...currentAnswers, option]);
                              } else {
                                handleAnswerSelect(currentQuestion.id, currentAnswers.filter(a => a !== option));
                              }
                            }}
                            className="mr-3"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === 'short-answer' && (
                  <Input
                    value={answers[currentQuestion.id]?.answer || ''}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-3">
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || answeredQuestions === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Quiz'
                  )}
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question navigation sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Questions</h3>
            <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
              {quiz.questions.map((question, index) => {
                const isAnswered = answers[question.id];
                const isMarked = markedForReview.has(question.id);
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isAnswered
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : isMarked
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded" />
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded" />
                <span className="text-gray-600">Marked for review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded" />
                <span className="text-gray-600">Not answered</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};