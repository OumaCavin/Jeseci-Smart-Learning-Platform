// Centralized API configuration and request handlers
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_TIMEOUT = 10000;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API request methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.put(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.patch(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.delete(url, config),
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/auth/login/',
    register: '/api/auth/register/',
    logout: '/api/auth/logout/',
    refresh: '/api/auth/refresh/',
    profile: '/api/auth/profile/',
  },
  dashboard: {
    overview: '/api/dashboard/overview/',
    analytics: '/api/dashboard/analytics/',
  },
  learning: {
    paths: '/api/learning/paths/',
    modules: '/api/learning/modules/',
    progress: '/api/learning/progress/',
  },
  assessments: {
    list: '/api/assessments/',
    create: '/api/assessments/create/',
    submit: '/api/assessments/submit/',
    results: '/api/assessments/results/',
  },
  chat: {
    send: '/api/chat/send/',
    history: '/api/chat/history/',
    agents: '/api/chat/agents/',
  },
  search: {
    query: '/api/search/query/',
    suggestions: '/api/search/suggestions/',
    filters: '/api/search/filters/',
  },
};

export default api;