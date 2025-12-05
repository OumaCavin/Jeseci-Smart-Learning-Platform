// Global TypeScript types

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  profile: {
    avatar?: string;
    bio?: string;
    learning_preferences?: any;
  };
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Generic utility types
export type AsyncThunkState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type EntityWithId<T> = T & { id: number };

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};