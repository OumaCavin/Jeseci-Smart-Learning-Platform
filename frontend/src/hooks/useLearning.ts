import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout, updateProfile } from '../store/slices/authSlice';

// Authentication hook
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // Login logic would be handled by the authService
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Dispatch login success action
        dispatch({ type: 'auth/loginSuccess', payload: data });
        return data;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      dispatch({ type: 'auth/loginFailure', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
    }
  };

  const updateUserProfile = async (profileData: any) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateProfile(data));
        return data;
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateUserProfile,
  };
};

// API hook with loading and error states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('API call failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { apiCall, loading, error, resetError };
};

// Theme hook
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
};

// Notification hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  const addNotification = (notification: Omit<typeof notifications[0], 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove after 5 seconds for success notifications
    if (notification.type === 'success') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    unreadCount,
  };
};

// Study session hook
export const useStudySession = () => {
  const [session, setSession] = useState<{
    isActive: boolean;
    startTime: Date | null;
    duration: number;
    subject: string | null;
    activities: Array<{
      type: string;
      startTime: Date;
      endTime?: Date;
      data?: any;
    }>;
  }>({
    isActive: false,
    startTime: null,
    duration: 0,
    subject: null,
    activities: [],
  });

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (session.isActive && session.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = now.getTime() - session.startTime!.getTime();
        setElapsedTime(Math.floor(duration / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session.isActive, session.startTime]);

  const startSession = (subject: string) => {
    setSession({
      isActive: true,
      startTime: new Date(),
      duration: 0,
      subject,
      activities: [],
    });
    setElapsedTime(0);
  };

  const endSession = () => {
    if (session.isActive && session.startTime) {
      const finalDuration = Math.floor(
        (new Date().getTime() - session.startTime.getTime()) / 1000
      );
      
      setSession(prev => ({
        ...prev,
        isActive: false,
        duration: finalDuration,
      }));
      
      // Here you would typically save the session data to the backend
      console.log('Study session ended:', {
        subject: session.subject,
        duration: finalDuration,
        activities: session.activities,
      });
    }
  };

  const addActivity = (activity: Omit<typeof session.activities[0], 'startTime'>) => {
    setSession(prev => ({
      ...prev,
      activities: [
        ...prev.activities,
        { ...activity, startTime: new Date() },
      ],
    }));
  };

  return {
    session,
    elapsedTime,
    startSession,
    endSession,
    addActivity,
  };
};

// Learning progress hook
export const useLearningProgress = (userId: string) => {
  const [progress, setProgress] = useState<{
    completedLessons: number;
    totalLessons: number;
    completedQuizzes: number;
    totalQuizzes: number;
    studyStreak: number;
    totalStudyTime: number;
    lastActivityDate: Date | null;
    achievements: string[];
  }>({
    completedLessons: 0,
    totalLessons: 0,
    completedQuizzes: 0,
    totalQuizzes: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    lastActivityDate: null,
    achievements: [],
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/progress`);
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  const updateProgress = async (updates: Partial<typeof progress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
    
    try {
      await fetch(`/api/users/${userId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const calculateCompletionPercentage = () => {
    const lessonProgress = progress.totalLessons > 0 
      ? (progress.completedLessons / progress.totalLessons) * 100 
      : 0;
    const quizProgress = progress.totalQuizzes > 0 
      ? (progress.completedQuizzes / progress.totalQuizzes) * 100 
      : 0;
    
    return Math.round((lessonProgress + quizProgress) / 2);
  };

  return {
    progress,
    updateProgress,
    completionPercentage: calculateCompletionPercentage(),
  };
};