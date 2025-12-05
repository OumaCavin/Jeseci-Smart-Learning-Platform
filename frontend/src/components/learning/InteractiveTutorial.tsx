import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Progress } from '../ui/Progress';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'question' | 'exercise' | 'quiz' | 'code';
  data?: any;
  interactive?: {
    type: 'input' | 'multiple-choice' | 'drag-drop' | 'fill-blanks';
    question: string;
    options?: string[];
    correctAnswer?: string | string[];
    placeholder?: string;
  };
}

interface InteractiveTutorialProps {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
  onComplete?: (stepId: string, result?: any) => void;
  onStepComplete?: (stepId: string, result?: any) => void;
  onProgress?: (currentStep: number, totalSteps: number) => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  id,
  title,
  description,
  category,
  estimatedTime,
  difficulty,
  steps,
  onComplete,
  onStepComplete,
  onProgress,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [startTime] = useState(new Date());
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(new Set());

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  useEffect(() => {
    // Mark current step as visited
    setVisitedSteps(prev => new Set([...prev, currentStep.id]));
    setIsStepCompleted(false);
    setShowFeedback(false);
    setFeedback(null);
    
    // Notify progress
    onProgress?.(currentStepIndex + 1, steps.length);
  }, [currentStepIndex, currentStep.id, onProgress]);

  const validateAnswer = (step: TutorialStep, answer: any): { isCorrect: boolean; feedback: string } => {
    if (!step.interactive || !step.interactive.correctAnswer) {
      return { isCorrect: true, feedback: 'Answer recorded!' };
    }

    if (Array.isArray(step.interactive.correctAnswer)) {
      const isCorrect = step.interactive.correctAnswer.includes(answer);
      return {
        isCorrect,
        feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer${step.interactive.correctAnswer.length > 1 ? 's are' : ' is'}: ${step.interactive.correctAnswer.join(', ')}`
      };
    } else {
      const isCorrect = answer.toLowerCase().trim() === step.interactive.correctAnswer.toLowerCase().trim();
      return {
        isCorrect,
        feedback: isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${step.interactive.correctAnswer}`
      };
    }
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: answer }));
    
    if (currentStep.interactive) {
      const validation = validateAnswer(currentStep, answer);
      setFeedback(validation);
      setShowFeedback(true);
      
      if (validation.isCorrect) {
        setTimeout(() => {
          setIsStepCompleted(true);
          onStepComplete?.(currentStep.id, answer);
        }, 1500);
      }
    } else {
      setIsStepCompleted(true);
      onStepComplete?.(currentStep.id, answer);
    }
  };

  const nextStep = () => {
    if (isLastStep) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      onComplete?.(currentStep.id, { answers, duration, visitedSteps: Array.from(visitedSteps) });
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      default: return '❓';
    }
  };

  const renderInteractiveElement = () => {
    if (!currentStep.interactive) return null;

    const answer = answers[currentStep.id] || '';
    const validation = feedback ? validateAnswer(currentStep, answer) : null;

    switch (currentStep.interactive.type) {
      case 'input':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentStep.interactive.question}
            </label>
            <Input
              value={answer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentStep.interactive.placeholder || 'Type your answer here...'}
              disabled={isStepCompleted}
            />
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentStep.interactive.question}
            </p>
            <div className="space-y-2">
              {currentStep.interactive.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    answer === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  } ${isStepCompleted ? 'cursor-not-allowed opacity-75' : ''}`}
                >
                  <input
                    type="radio"
                    name={`step-${currentStep.id}`}
                    value={option}
                    checked={answer === option}
                    onChange={(e) => handleAnswer(e.target.value)}
                    disabled={isStepCompleted}
                    className="mr-3"
                  />
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'fill-blanks':
        const parts = currentStep.content.split(/\[([^\\]]+)\]/g);
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentStep.interactive.question}
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {parts.map((part, index) => {
                if (index % 2 === 1) {
                  // This is a blank
                  return (
                    <Input
                      key={index}
                      value={answer.split('|')[index / 2] || ''}
                      onChange={(e) => {
                        const newAnswers = [...(answer.split('|') || [])];
                        newAnswers[index / 2] = e.target.value;
                        handleAnswer(newAnswers.join('|'));
                      }}
                      placeholder={`Blank ${index / 2 + 1}`}
                      className="inline-block w-32 mx-1"
                      disabled={isStepCompleted}
                    />
                  );
                } else {
                  return <span key={index}>{part}</span>;
                }
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'info':
        return (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">{currentStep.content}</p>
          </div>
        );

      case 'question':
      case 'exercise':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{currentStep.content}</p>
            {renderInteractiveElement()}
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{currentStep.content}</p>
            {renderInteractiveElement()}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{currentStep.content}</p>
            {currentStep.data?.code && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{currentStep.data.code}</code>
              </pre>
            )}
            {renderInteractiveElement()}
          </div>
        );

      default:
        return <p className="text-gray-700 dark:text-gray-300">{currentStep.content}</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {getDifficultyIcon(difficulty)} {difficulty.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
          <span>📁 {category}</span>
          <span>•</span>
          <span>⏱️ {estimatedTime} min</span>
          <span>•</span>
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
        </div>
      </div>

      {/* Progress */}
      <Progress 
        value={((currentStepIndex + 1) / steps.length) * 100} 
        className="w-full" 
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Tutorial Steps
            </h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    index === currentStepIndex
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : visitedSteps.has(step.id)
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Step Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Step Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    {currentStep.type.toUpperCase()}
                  </span>
                  {currentStep.interactive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                      INTERACTIVE
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStep.title}
                </h2>
              </div>

              {/* Step Content */}
              <div className="min-h-[200px]">
                {renderStepContent()}
              </div>

              {/* Feedback */}
              {showFeedback && feedback && (
                <div className={`p-4 rounded-lg ${
                  feedback.type === 'success'
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  <div className="flex items-center space-x-2">
                    {feedback.type === 'success' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span>{feedback.message}</span>
                  </div>
                </div>
              )}

              {/* Step Complete Check */}
              {isStepCompleted && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800 dark:text-green-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Step completed!</span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={currentStepIndex === 0}
                >
                  ← Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {currentStep.interactive && !isStepCompleted && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Complete the step to continue
                    </div>
                  )}
                </div>

                <Button
                  onClick={nextStep}
                  disabled={currentStep.interactive && !isStepCompleted}
                  className="flex items-center space-x-2"
                >
                  <span>{isLastStep ? 'Complete Tutorial' : 'Next Step'}</span>
                  {!isLastStep && <span>→</span>}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};