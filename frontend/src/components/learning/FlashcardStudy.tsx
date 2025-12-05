import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  RotateCcwIcon,
  CheckIcon,
  XMarkIcon,
  LightBulbIcon,
  ClockIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Flashcard, FlashcardDeck, StudySession } from '../../types/learning';

interface FlashcardStudyProps {
  deck: FlashcardDeck;
  studyMode: 'review' | 'learn' | 'test';
  onSessionComplete?: (session: StudySession) => void;
  className?: string;
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({
  deck,
  studyMode,
  onSessionComplete,
  className = '',
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [sessionStats, setSessionStats] = useState({
    cardsReviewed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    hintsUsed: 0,
    timeSpent: 0,
  });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentCard = selectedCards[currentCardIndex];
  const progress = selectedCards.length > 0 ? ((currentCardIndex + 1) / selectedCards.length) * 100 : 0;

  // Initialize study session
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading cards based on study mode
    setTimeout(() => {
      let cardsToStudy = [...deck.cards];
      
      // Filter cards based on study mode
      switch (studyMode) {
        case 'review':
          // Only study cards that need review (mock logic)
          cardsToStudy = deck.cards.filter(() => Math.random() > 0.3);
          break;
        case 'learn':
          // Focus on new or difficult cards
          cardsToStudy = deck.cards.filter(card => 
            card.difficulty === 'medium' || card.difficulty === 'hard'
          );
          break;
        case 'test':
          // Test mode - could be all cards or randomized
          cardsToStudy = [...deck.cards].sort(() => Math.random() - 0.5);
          break;
      }
      
      setSelectedCards(cardsToStudy);
      setIsLoading(false);
    }, 500);
  }, [deck, studyMode]);

  const handleCardFlip = () => {
    setShowBack(!showBack);
  };

  const handleResponse = (isCorrect: boolean, usedHint: boolean = false) => {
    setSessionStats(prev => ({
      cardsReviewed: prev.cardsReviewed + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
      hintsUsed: prev.hintsUsed + (usedHint ? 1 : 0),
      timeSpent: prev.timeSpent + 0, // Would calculate actual time in real implementation
    }));

    // Move to next card or complete session
    if (currentCardIndex < selectedCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowBack(false);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    const session: StudySession = {
      id: `session-${Date.now()}`,
      deckId: deck.id,
      userId: 'current-user', // Would get from auth context
      cardsReviewed: sessionStats.cardsReviewed,
      cardsCorrect: sessionStats.correctAnswers,
      cardsIncorrect: sessionStats.incorrectAnswers,
      timeSpent: Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000),
      startedAt: sessionStartTime.toISOString(),
      endedAt: new Date().toISOString(),
      studyMode,
    };

    setSessionComplete(true);
    
    if (onSessionComplete) {
      onSessionComplete(session);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowBack(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < selectedCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowBack(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 mt-2">Preparing your study session...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (selectedCards.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8">
          <div className="text-center space-y-4">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">No Cards to Study</h2>
            <p className="text-gray-600">
              Great job! You've mastered all the cards in this deck for now.
              Come back later for a review session.
            </p>
            <div className="mt-6">
              <Button onClick={() => window.location.reload()}>
                Return to Deck
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = sessionStats.cardsReviewed > 0 
      ? (sessionStats.correctAnswers / sessionStats.cardsReviewed) * 100 
      : 0;
    
    const timeSpent = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);

    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
              <p className="text-gray-600">Great work studying your flashcards</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{sessionStats.cardsReviewed}</p>
                <p className="text-sm text-gray-600">Cards Reviewed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{accuracy.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{formatTime(timeSpent)}</p>
                <p className="text-sm text-gray-600">Time Spent</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{sessionStats.correctAnswers}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Return to Deck
              </Button>
              <Button onClick={() => window.location.reload()}>
                Study Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{deck.name}</h1>
            <p className="text-sm text-gray-600">{studyMode.charAt(0).toUpperCase() + studyMode.slice(1)} Mode</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Card {currentCardIndex + 1} of {selectedCards.length}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">
                {sessionStats.correctAnswers} correct
              </span>
              {sessionStats.incorrectAnswers > 0 && (
                <span className="text-xs text-red-500">
                  {sessionStats.incorrectAnswers} incorrect
                </span>
              )}
            </div>
          </div>
        </div>
        
        <Progress value={progress} className="w-full" />
      </Card>

      {/* Main flashcard */}
      <div className="flex justify-center">
        <Card className="p-8 max-w-2xl w-full min-h-96">
          <div className="space-y-6">
            {/* Card header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                  {currentCard.difficulty}
                </span>
                <span className="text-xs text-gray-500">{currentCard.subject}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCardFlip}
              >
                {showBack ? (
                  <>
                    <EyeSlashIcon className="h-4 w-4 mr-1" />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Show Answer
                  </>
                )}
              </Button>
            </div>

            {/* Card content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-lg font-medium text-gray-900">
                  {!showBack ? currentCard.front : currentCard.back}
                </div>
                
                {currentCard.media && currentCard.media.length > 0 && (
                  <div className="space-y-2">
                    {currentCard.media.map((media, index) => (
                      <div key={index}>
                        {media.type === 'image' && (
                          <img 
                            src={media.url} 
                            alt={media.alt} 
                            className="max-w-full max-h-48 mx-auto rounded-lg"
                          />
                        )}
                        {media.type === 'audio' && (
                          <audio controls className="max-w-full">
                            <source src={media.url} />
                          </audio>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!showBack && (
                  <p className="text-sm text-gray-500">
                    Click "Show Answer" to see the answer
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousCard}
                disabled={currentCardIndex === 0}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {showBack && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleResponse(false)}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Incorrect
                  </Button>
                  <Button
                    onClick={() => handleResponse(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Correct
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                onClick={handleNextCard}
                disabled={currentCardIndex === selectedCards.length - 1}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Study tips */}
      {studyMode === 'learn' && (
        <Card className="p-4">
          <div className="flex items-start space-x-3">
            <LightBulbIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Study Tips</h3>
              <p className="text-sm text-gray-600">
                Focus on understanding the concept, not just memorizing. Take your time with each card 
                and use the "Incorrect" button to mark cards you need to review again.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Keyboard shortcuts help */}
      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
          <div><kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> Flip card</div>
          <div><kbd className="px-2 py-1 bg-gray-100 rounded">←</kbd> Previous</div>
          <div><kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd> Next</div>
          <div><kbd className="px-2 py-1 bg-gray-100 rounded">1</kbd> Correct</div>
        </div>
      </Card>
    </div>
  );
};