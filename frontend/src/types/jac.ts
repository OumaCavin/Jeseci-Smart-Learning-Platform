// JAC (JavaScript Assembly Code) Execution Types

export interface CodeExecution {
  id: string;
  code: string;
  language: string;
  status: 'idle' | 'running' | 'success' | 'error' | 'timeout';
  startTime: string;
  endTime?: string;
  duration: number; // in milliseconds
  output: string;
  error: string;
  timeout?: number;
  memoryLimit?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebugSession {
  id: string;
  executionId: string;
  status: 'active' | 'paused' | 'completed' | 'terminated';
  breakpoints: Breakpoint[];
  currentLine: number;
  variables: Variable[];
  callStack: CallStackFrame[];
  watchExpressions: WatchExpression[];
  createdAt: string;
  updatedAt: string;
}

export interface Breakpoint {
  id: string;
  line: number;
  column?: number;
  condition?: string;
  enabled: boolean;
  hitCount: number;
  hitLimit?: number;
  createdAt: string;
}

export interface Variable {
  name: string;
  value: string;
  type: string;
  scope: 'global' | 'local' | 'closure';
  watchExpressionId?: string;
}

export interface CallStackFrame {
  id: string;
  functionName: string;
  fileName: string;
  line: number;
  column: number;
  scope: Record<string, any>;
}

export interface WatchExpression {
  id: string;
  expression: string;
  value: string;
  type: string;
  error?: string;
  enabled: boolean;
}

export interface ReplSession {
  id: string;
  language: string;
  history: ReplCommand[];
  currentCommand: string;
  status: 'active' | 'inactive';
  environment: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ReplCommand {
  id: string;
  input: string;
  output: string;
  error?: string;
  timestamp: string;
  duration: number;
}

export interface JACConfig {
  languages: JACLanguage[];
  defaultTimeout: number;
  defaultMemoryLimit: number;
  sandboxEnabled: boolean;
  securitySettings: SecuritySettings;
}

export interface JACLanguage {
  id: string;
  name: string;
  version: string;
  aliases: string[];
  extensions: string[];
  executor: string;
  syntaxHighlighting: string;
}

export interface SecuritySettings {
  networkAccess: boolean;
  fileSystemAccess: boolean;
  externalImports: boolean;
  evalFunction: boolean;
  requireFunction: boolean;
}

export interface ExecutionMetrics {
  executionId: string;
  cpuTime: number;
  wallTime: number;
  memoryUsage: {
    peak: number;
    average: number;
    current: number;
  };
  ioOperations: {
    reads: number;
    writes: number;
  };
  networkRequests: number;
  errors: ExecutionError[];
}

export interface ExecutionError {
  type: 'syntax' | 'runtime' | 'timeout' | 'memory' | 'security';
  message: string;
  line?: number;
  column?: number;
  stackTrace?: string;
  timestamp: string;
}

export interface JACStats {
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  popularLanguages: Array<{
    language: string;
    count: number;
    percentage: number;
  }>;
  errorRateByType: Record<string, number>;
  recentActivity: Array<{
    date: string;
    executions: number;
    successRate: number;
  }>;
}

// Action types for Redux
export interface JACState {
  executions: Record<string, CodeExecution>;
  debugSessions: Record<string, DebugSession>;
  replSessions: Record<string, ReplSession>;
  config: JACConfig | null;
  stats: JACStats | null;
  isLoading: boolean;
  error: string | null;
}