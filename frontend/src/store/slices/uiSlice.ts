// UI slice for managing global UI state
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface UIState {
  // Loading states
  globalLoading: boolean;
  pageLoading: boolean;
  
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Notifications
  notifications: NotificationState[];
  
  // Modal state
  activeModal: string | null;
  modalData: any;
  
  // Page transition
  pageTransition: 'fade' | 'slide' | 'none';
  
  // Layout preferences
  layout: 'boxed' | 'fluid';
  
  // Device info
  isMobile: boolean;
  isTablet: boolean;
  screenSize: {
    width: number;
    height: number;
  };
  
  // Error boundaries
  hasError: boolean;
  error: string | null;
}

const initialState: UIState = {
  globalLoading: false,
  pageLoading: false,
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'light',
  notifications: [],
  activeModal: null,
  modalData: null,
  pageTransition: 'fade',
  layout: 'fluid',
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  screenSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  hasError: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modal
    openModal: (state, action: PayloadAction<{ modalId: string; data?: any }>) => {
      state.activeModal = action.payload.modalId;
      state.modalData = action.payload.data;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    
    // Page transition
    setPageTransition: (state, action: PayloadAction<'fade' | 'slide' | 'none'>) => {
      state.pageTransition = action.payload;
    },
    
    // Layout
    setLayout: (state, action: PayloadAction<'boxed' | 'fluid'>) => {
      state.layout = action.payload;
    },
    
    // Device info
    updateScreenSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.screenSize = action.payload;
      state.isMobile = action.payload.width < 768;
      state.isTablet = action.payload.width >= 768 && action.payload.width < 1024;
    },
    
    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.hasError = !!action.payload;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.hasError = false;
      state.error = null;
    },
    
    // Reset UI state
    resetUI: (state) => {
      return {
        ...initialState,
        theme: state.theme,
        layout: state.layout,
      };
    },
  },
});

export const {
  setGlobalLoading,
  setPageLoading,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setPageTransition,
  setLayout,
  updateScreenSize,
  setError,
  clearError,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;