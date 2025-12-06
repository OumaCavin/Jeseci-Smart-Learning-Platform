// Authentication service
import { apiClient, endpoints } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

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

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        endpoints.auth.login,
        credentials
      );
      
      const { access, refresh, user } = response.data;
      
      // Store tokens and user data
      this.setTokens(access, refresh);
      this.setUser(user);
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        endpoints.auth.register,
        userData
      );
      
      const { access, refresh, user } = response.data;
      
      // Store tokens and user data
      this.setTokens(access, refresh);
      this.setUser(user);
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token is valid
      const token = this.getAccessToken();
      if (token) {
        await apiClient.post(endpoints.auth.logout);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      this.clearTokens();
      this.clearUser();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<TokenPair> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<TokenPair>(endpoints.auth.refresh, {
        refresh: refreshToken,
      });

      const { access, refresh } = response.data;
      this.setTokens(access, refresh);
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      this.clearUser();
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>(endpoints.auth.profile);
      this.setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  // Get stored access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get stored user data
  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Set tokens
  private setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
  }

  // Set user data
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Clear tokens
  private clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Clear user data
  private clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.patch<User>(endpoints.auth.profile, userData);
      this.setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  // Password reset request
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/api/auth/password-reset/', { email });
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  }

  // Password reset confirmation
  async confirmPasswordReset(token: string, password: string): Promise<void> {
    try {
      await apiClient.post('/api/auth/password-reset/confirm/', {
        token,
        password,
      });
    } catch (error) {
      console.error('Password reset confirmation failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;