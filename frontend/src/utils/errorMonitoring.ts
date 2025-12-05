/**
 * Enterprise Error Monitoring Utility for Jeseci Smart Learning Platform
 * Provides comprehensive error tracking, reporting, and analysis
 */

import React from 'react';

// Type definitions for error reporting
export interface ErrorReport {
  id: string;
  message: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  context?: Record<string, any>;
  stack?: string;
  componentStack?: string;
  learningContext?: LearningContext;
  aiInsights?: AIInsight[];
}

export interface LearningContext {
  learningOutcomeRisk: 'low' | 'medium' | 'high';
  userProgress: number;
  currentModule?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface AIInsight {
  type: 'pattern' | 'recommendation' | 'prediction';
  description: string;
  confidence: number; // 0-1
  action?: string;
}

export interface ComplianceFinding {
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  regulation: string;
  remediation: string;
}

export interface AuditEntry {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  details: Record<string, any>;
}

// Error impact analysis
export interface ErrorImpact {
  userCount: number;
  businessImpact: number;
  learningImpact?: {
    affectedLearners: number;
    courseDisruption: boolean;
    progressionDelay: number; // in hours
  };
}

/**
 * Enterprise Error Monitoring System
 * Handles error capture, analysis, and reporting for educational platform
 */
export class ErrorMonitoringService {
  private errors: Map<string, ErrorReport> = new Map();
  private maxErrors = 1000;
  private reportingEndpoint = process.env.REACT_APP_ERROR_REPORTING_ENDPOINT || '/api/errors';

  /**
   * Capture and process an error with comprehensive context
   */
  public captureError(
    error: Error | string,
    options: {
      category?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      userId?: string;
      sessionId?: string;
      context?: Record<string, any>;
      componentStack?: string;
      learningContext?: LearningContext;
    } = {}
  ): string {
    const errorId = this.generateErrorId();
    const timestamp = new Date();
    
    // Convert error to string if needed
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;
    
    // Create comprehensive error report
    const errorReport: ErrorReport = {
      id: errorId,
      message,
      category: options.category || this.categorizeError(error),
      severity: options.severity || this.determineSeverity(error, options.context),
      timestamp,
      userId: options.userId,
      sessionId: options.sessionId,
      context: options.context,
      stack,
      componentStack: options.componentStack,
      learningContext: options.learningContext,
      aiInsights: this.generateAIInsights(message, options.context)
    };

    // Store error
    this.errors.set(errorId, errorReport);
    
    // Maintain storage limit
    if (this.errors.size > this.maxErrors) {
      this.cleanupOldErrors();
    }

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      this.logErrorToConsole(errorReport);
    }

    // Auto-report critical errors
    if (errorReport.severity === 'critical') {
      this.reportToEndpoint(errorReport).catch(console.error);
    }

    return errorId;
  }

  /**
   * Generate a user-friendly error message with proper template literal syntax
   */
  private generateErrorMessage(errorReport: ErrorReport, impact?: ErrorImpact): string {
    // Fixed: Proper template literal syntax without nested template expressions
    const severityText = errorReport.severity.toUpperCase();
    const categoryText = errorReport.category;
    let message = `🚨 ${severityText} ${categoryText} error detected`;
    
    if (impact) {
      const userCount = impact.userCount;
      const businessImpact = impact.businessImpact;
      message += ` | Impact: ${userCount} users, ${businessImpact} business impact`;
    }
    
    if (errorReport.learningContext && errorReport.learningContext.learningOutcomeRisk !== 'low') {
      const riskLevel = errorReport.learningContext.learningOutcomeRisk;
      message += ` | Learning Risk: ${riskLevel}`;
    }
    
    return message;
  }

  /**
   * Analyze error patterns for recurring issues
   */
  public analyzeErrorPatterns(): Array<{
    patternId: string;
    frequency: number;
    timeWindow: string;
    errorTypes: string[];
    description: string;
    priority: number;
  }> {
    const errors = Array.from(this.errors.values());
    const patterns: Array<{
      patternId: string;
      frequency: number;
      timeWindow: string;
      errorTypes: string[];
      description: string;
      priority: number;
    }> = [];

    // Group errors by category and message pattern
    const groupedErrors = new Map<string, ErrorReport[]>();
    
    errors.forEach(error => {
      const key = `${error.category}_${error.message}`;
      if (!groupedErrors.has(key)) {
        groupedErrors.set(key, []);
      }
      groupedErrors.get(key)!.push(error);
    });

    // Identify recurring patterns
    groupedErrors.forEach((errorGroup, key) => {
      if (errorGroup.length > 2) {
        const patternId = `pattern_${key}`;
        const firstError = errorGroup[0];
        
        patterns.push({
          patternId,
          frequency: errorGroup.length,
          timeWindow: '30d',
          errorTypes: [firstError.category],
          description: `Recurring ${firstError.category} errors pattern detected`,
          priority: this.calculatePriority(firstError) * errorGroup.length
        });
      }
    });

    return patterns;
  }

  /**
   * Calculate user impact metrics
   */
  private calculateUserImpact(errors: ErrorReport[]): ErrorImpact {
    const usersAffected = new Set(
      errors.map(e => e.userId).filter(Boolean)
    ).size;
    
    const sessionsImpacted = new Set(
      errors.map(e => e.sessionId).filter(Boolean)
    ).size;
    
    const errorRate = errors.length / Math.max(usersAffected, 1);
    const recoveryRate = 0.85;

    return {
      userCount: usersAffected,
      businessImpact: this.calculateBusinessImpact(errors),
      learningImpact: {
        affectedLearners: usersAffected,
        courseDisruption: errorRate > 0.1,
        progressionDelay: errors.length * 0.5 // 30 minutes per error
      }
    };
  }

  /**
   * Calculate business impact of errors
   */
  private calculateBusinessImpact(errors: ErrorReport[]): number {
    const criticalErrors = errors.filter(e => e.severity === 'critical').length;
    const revenueImpact = criticalErrors * 1000; // $1000 per critical error
    const productivityImpact = errors.length * 50; // 50 minutes per error
    
    return -(revenueImpact + productivityImpact);
  }

  /**
   * Perform compliance checks for regulatory requirements
   */
  public performComplianceCheck(type: 'gdpr' | 'ferpa' | 'ccpa'): ComplianceFinding[] {
    const findings: ComplianceFinding[] = [];
    
    if (type === 'gdpr') {
      // Check for PII in error logs
      const errorsWithPII = Array.from(this.errors.values()).filter(e => 
        this.containsPII(e.message) || this.containsPII(JSON.stringify(e.context || {}))
      );
      
      if (errorsWithPII.length > 0) {
        findings.push({
          severity: 'medium',
          category: 'data_protection',
          description: 'Potential PII detected in error logs',
          regulation: 'GDPR Article 32',
          remediation: 'Implement PII anonymization in error logging'
        });
      }
    }
    
    return findings;
  }

  /**
   * Generate audit trail for compliance
   */
  public generateAuditTrail(): AuditEntry[] {
    return [{
      timestamp: new Date().toISOString(),
      userId: 'system',
      action: 'compliance_check',
      resource: 'error_monitoring',
      result: 'success',
      details: { reportType: 'automated' }
    }];
  }

  /**
   * Private helper methods
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizeError(error: Error | string): string {
    const message = typeof error === 'string' ? error : error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) return 'network';
    if (message.includes('auth') || message.includes('permission')) return 'authentication';
    if (message.includes('render') || message.includes('component')) return 'rendering';
    if (message.includes('validation') || message.includes('input')) return 'validation';
    
    return 'general';
  }

  private determineSeverity(error: Error | string, context?: Record<string, any>): 'low' | 'medium' | 'high' | 'critical' {
    const message = typeof error === 'string' ? error : error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) return 'critical';
    if (message.includes('security') || message.includes('unauthorized')) return 'high';
    if (message.includes('warning') || message.includes('deprecated')) return 'medium';
    
    return 'low';
  }

  private generateAIInsights(message: string, context?: Record<string, any>): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Pattern detection
    if (message.includes('network')) {
      insights.push({
        type: 'pattern',
        description: 'Network connectivity issues detected',
        confidence: 0.8,
        action: 'Check network stability and retry mechanisms'
      });
    }
    
    // Recommendation
    if (context?.userAgent?.includes('Safari')) {
      insights.push({
        type: 'recommendation',
        description: 'Consider browser compatibility issues',
        confidence: 0.7,
        action: 'Implement Safari-specific fallbacks'
      });
    }
    
    return insights;
  }

  private containsPII(text: string): boolean {
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/ // Credit card
    ];
    
    return piiPatterns.some(pattern => pattern.test(text));
  }

  private extractComponentName(componentStack: string): string {
    const match = componentStack.match(/at ([A-Za-z]+)/);
    return match ? match[1] : 'Unknown';
  }

  private determineErrorPhase(componentStack: string): string {
    if (componentStack.includes('constructor')) return 'mounting';
    if (componentStack.includes('componentDid')) return 'updating';
    if (componentStack.includes('render')) return 'rendering';
    return 'unknown';
  }

  private getApiErrorSeverity(response: Response): 'low' | 'medium' | 'high' | 'critical' {
    if (response.status >= 500) return 'critical';
    if (response.status >= 400) return 'high';
    if (response.status >= 300) return 'medium';
    return 'low';
  }

  private logErrorToConsole(errorReport: ErrorReport): void {
    console.group('🚨 Enterprise Error Intelligence Alert');
    console.error('Error ID:', errorReport.id);
    console.error('Message:', errorReport.message);
    console.error('Category:', errorReport.category);
    console.error('Severity:', errorReport.severity);
    console.error('Context:', errorReport.context);
    
    if (errorReport.aiInsights && errorReport.aiInsights.length > 0) {
      console.group('🧠 AI Insights');
      errorReport.aiInsights.forEach(insight => {
        const confidencePercent = Math.round(insight.confidence * 100);
        console.log(`${insight.type}: ${insight.description} (${confidencePercent}% confidence)`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  private calculatePriority(error: ErrorReport): number {
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 5 };
    return severityWeights[error.severity];
  }

  private cleanupOldErrors(): void {
    const errors = Array.from(this.errors.entries());
    errors.sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime());
    
    const toDelete = errors.slice(0, errors.length - this.maxErrors);
    toDelete.forEach(([id]) => this.errors.delete(id));
  }

  private async reportToEndpoint(errorReport: ErrorReport): Promise<void> {
    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_ERROR_REPORTING_TOKEN}`
        },
        body: JSON.stringify(errorReport)
      });
    } catch (reportingError) {
      console.warn('Failed to report error to endpoint:', reportingError);
    }
  }
}

// React Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorReport?: ErrorReport;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorMonitoring = new ErrorMonitoringService();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capture error with comprehensive context
    const errorId = this.errorMonitoring.captureError(error, {
      category: 'react',
      severity: 'high',
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });

    // Store error info for UI display
    this.setState({ 
      errorReport: { 
        id: errorId, 
        message: error.message, 
        category: 'react', 
        severity: 'high',
        timestamp: new Date()
      } 
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorReport: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return React.createElement(FallbackComponent, { 
          error: this.state.error, 
          retry: this.retry 
        });
      }

      // Default error UI
      return React.createElement('div', { className: 'error-boundary p-4 bg-red-50 border border-red-200 rounded' },
        React.createElement('h2', { className: 'text-lg font-bold text-red-800 mb-2' }, 'Something went wrong'),
        React.createElement('p', { className: 'text-sm text-red-800 font-mono mb-2' }, this.state.error.message),
        this.state.errorReport && React.createElement('div', { className: 'mt-2 text-xs text-gray-600' },
          React.createElement('p', null, `Error ID: ${this.state.errorReport.id}`),
          React.createElement('p', null, `Category: ${this.state.errorReport.category}`),
          React.createElement('p', null, `Severity: ${this.state.errorReport.severity}`)
        ),
        React.createElement('div', { className: 'flex justify-center space-x-4 mt-4' },
          React.createElement('button', { 
            onClick: this.retry, 
            className: 'px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700' 
          }, 'Try Again'),
          React.createElement('button', { 
            onClick: () => window.location.reload(), 
            className: 'px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700' 
          }, 'Reload Page')
        )
      );
    }

    return this.props.children;
  }
}

// Higher-Order Component for error tracking
export function withErrorTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    category?: string;
    context?: Record<string, any>;
  } = {}
) {
  const ErrorTrackedComponent: React.FC<P> = (props) => {
    const errorMonitoring = new ErrorMonitoringService();

    React.useEffect(() => {
      // Component mount tracking
      return () => {
        // Component unmount cleanup
      };
    }, []);

    // Error handler for wrapped component
    const handleError = React.useCallback((error: Error, errorInfo: React.ErrorInfo) => {
      errorMonitoring.captureError(error, {
        category: options.category || 'component',
        context: {
          ...options.context,
          componentName: WrappedComponent.displayName || WrappedComponent.name,
          props: JSON.stringify(props)
        }
      });
    }, [props, options, errorMonitoring]);

    return React.createElement(WrappedComponent, {
      ...props,
      onError: handleError
    });
  };

  ErrorTrackedComponent.displayName = `ErrorTracked(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ErrorTrackedComponent;
}

// Export singleton instance for global use
export const errorMonitoring = new ErrorMonitoringService();

// Convenience functions for common error scenarios
export const captureAPIError = (error: Error, response?: Response) => {
  const severity = response ? errorMonitoring['getApiErrorSeverity'](response) : 'medium';
  return errorMonitoring.captureError(error, {
    category: 'api',
    severity
  });
};

export const captureAuthError = (error: Error) => {
  return errorMonitoring.captureError(error, {
    category: 'authentication',
    severity: 'high'
  });
};

export const captureLearningError = (error: Error, learningContext: LearningContext) => {
  return errorMonitoring.captureError(error, {
    category: 'learning',
    severity: 'medium',
    learningContext
  });
};