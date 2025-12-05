import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Progress } from '../ui/Progress';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { CodeExecutionPanel } from '../jac/CodeExecutionPanel';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
  hidden?: boolean;
}

interface ExerciseStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  hints: string[];
  testCases: TestCase[];
}

interface CodeExerciseProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  estimatedTime: number; // in minutes
  starterCode: string;
  language: string;
  steps: ExerciseStep[];
  hints: string[];
  solution?: {
    code: string;
    explanation: string;
  };
  onComplete?: (stepId: string, passed: boolean) => void;
  onHintUsed?: (hint: string) => void;
}

export const CodeExercise: React.FC<CodeExerciseProps> = ({
  id,
  title,
  description,
  difficulty,
  category,
  estimatedTime,
  starterCode,
  language,
  steps,
  hints,
  solution,
  onComplete,
  onHintUsed,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    testCase: TestCase;
    passed: boolean;
    actualOutput?: string;
    error?: string;
  }>>([]);
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShowSolution, setIsShowSolution] = useState(false);
  
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const runCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setOutput('Running...');
    
    try {
      // Simulate code execution - in real implementation, this would call your code execution service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll simulate test execution
      const results = await runTests(code, currentStep.testCases);
      setTestResults(results);
      
      if (results.every(result => result.passed)) {
        setOutput('✅ All tests passed! Great job!');
        
        if (isLastStep) {
          setIsCompleted(true);
          onComplete?.(currentStep.id, true);
        }
      } else {
        const failedCount = results.filter(r => !r.passed).length;
        setOutput(`❌ ${failedCount} test(s) failed. Check the results below.`);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runTests = async (code: string, testCases: TestCase[]): Promise<Array<{
    testCase: TestCase;
    passed: boolean;
    actualOutput?: string;
    error?: string;
  }>> => {
    // This is a mock implementation - in a real app, you'd send the code to a backend service
    const results = testCases.map(testCase => {
      try {
        // Simulate code execution based on simple logic
        const actualOutput = simulateCodeExecution(code, testCase.input);
        const passed = actualOutput.trim() === testCase.expectedOutput.trim();
        
        return {
          testCase,
          passed,
          actualOutput,
        };
      } catch (error) {
        return {
          testCase,
          passed: false,
          error: error instanceof Error ? error.message : 'Execution error',
        };
      }
    });
    
    return results;
  };

  const simulateCodeExecution = (code: string, input: string): string => {
    // This is a very basic simulation - in a real implementation,
    // you'd have proper code execution infrastructure
    
    // Simple string manipulation exercises
    if (code.includes('reverse') && code.includes('string')) {
      return input.split('').reverse().join('');
    }
    
    if (code.includes('uppercase') || code.includes('toUpperCase')) {
      return input.toUpperCase();
    }
    
    if (code.includes('lowercase') || code.includes('toLowerCase')) {
      return input.toLowerCase();
    }
    
    if (code.includes('length') || code.includes('size')) {
      return input.length.toString();
    }
    
    // Default: return input for basic exercises
    return input;
  };

  const nextStep = () => {
    if (!isLastStep) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setCode(steps[nextIndex].code || starterCode);
      setTestResults([]);
      setOutput('');
      setShowHints(false);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setCode(steps[prevIndex].code || starterCode);
      setTestResults([]);
      setOutput('');
    }
  };

  const useHint = (hintIndex: number) => {
    const hint = hints[hintIndex];
    if (!usedHints.includes(hint)) {
      setUsedHints(prev => [...prev, hint]);
      onHintUsed?.(hint);
    }
  };

  const showSolution = () => {
    setIsShowSolution(true);
    if (solution?.code) {
      setCode(solution.code);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'hard': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'expert': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🟠';
      case 'expert': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {getDifficultyIcon(difficulty)} {difficulty.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
            <span>Category: {category}</span>
            <span>•</span>
            <span>⏱️ {estimatedTime} min</span>
            <span>•</span>
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
          </div>
        </div>
        
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Completed!</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <Progress 
        value={((currentStepIndex + 1) / steps.length) * 100} 
        className="w-full" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Instructions and Code */}
        <div className="space-y-6">
          {/* Current Step */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Step {currentStepIndex + 1}: {currentStep.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentStep.description}
            </p>
            
            {/* Code Editor */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Code ({language})
                </label>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowHints(!showHints)}
                  >
                    💡 Hints ({usedHints.length}/{hints.length})
                  </Button>
                  {solution && !isCompleted && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={showSolution}
                    >
                      Show Solution
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
                {isRunning && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center rounded-md">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={runCode}
                  disabled={isRunning || !code.trim()}
                  className="flex-1"
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                
                {!isLastStep && (
                  <Button
                    variant="outline"
                    onClick={nextStep}
                    disabled={!testResults.every(r => r.passed)}
                  >
                    Next Step →
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Output */}
          {(output || testResults.length > 0) && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Results
              </h3>
              
              {output && (
                <div className={`p-3 rounded-lg mb-4 ${
                  output.includes('✅') 
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : output.includes('❌')
                    ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {output}
                </div>
              )}
              
              {/* Test Cases Results */}
              {testResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Test Cases:
                  </h4>
                  {testResults.map((result, index) => (
                    <div
                      key={result.testCase.id}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">
                          Test Case {index + 1}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.passed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                        }`}>
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {result.testCase.description}
                      </p>
                      
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">Input:</span> {result.testCase.input}
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span> {result.testCase.expectedOutput}
                        </div>
                        {result.actualOutput && (
                          <div>
                            <span className="font-medium">Actual:</span> {result.actualOutput}
                          </div>
                        )}
                        {result.error && (
                          <div className="text-red-600 dark:text-red-400">
                            <span className="font-medium">Error:</span> {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Hints */}
          {showHints && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Hints
              </h3>
              <div className="space-y-3">
                {hints.map((hint, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      usedHints.includes(hint)
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => useHint(index)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {hint}
                      </p>
                      {usedHints.includes(hint) && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                          ✓ Used
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Solution */}
          {isShowSolution && solution && (
            <Card className="p-6 border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Solution & Explanation
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Solution Code:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto">
                    {solution.code}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Explanation:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {solution.explanation}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel - Navigation and Tips */}
        <div className="space-y-6">
          {/* Step Navigation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exercise Steps
            </h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === currentStepIndex
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : index < currentStepIndex
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        Step {index + 1}: {step.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {index < currentStepIndex && (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {index === currentStepIndex && (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Exercise Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exercise Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Test Cases Passed</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {testResults.filter(r => r.passed).length} / {testResults.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hints Used</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {usedHints.length} / {hints.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Step</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentStepIndex + 1} / {steps.length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};