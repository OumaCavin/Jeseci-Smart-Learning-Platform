import { api } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  timezone: string;
  language: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: 'student' | 'instructor' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
  statistics: UserStatistics;
  socialLinks: SocialLinks;
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: {
    courseUpdates: boolean;
    assignments: boolean;
    achievements: boolean;
    marketing: boolean;
  };
  pushNotifications: {
    studyReminders: boolean;
    newCourses: boolean;
    socialActivity: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showAchievements: boolean;
    allowMessages: boolean;
  };
  learning: {
    preferredSessionLength: number;
    difficultyPreference: 'easy' | 'medium' | 'hard' | 'adaptive';
    videoQuality: 'auto' | '720p' | '1080p';
    autoplay: boolean;
    subtitles: boolean;
  };
}

export interface UserStatistics {
  totalStudyTime: number; // in minutes
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  assignmentsSubmitted: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  totalAchievements: number;
  totalPoints: number;
  rank: number;
  level: number;
  rankLevel: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  portfolio?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  timezone?: string;
  language?: string;
  socialLinks?: Partial<SocialLinks>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class UserService {
  private readonly basePath = '/users';

  // User Profile Management
  async getCurrentUser(): Promise<User> {
    return api.get(`${this.basePath}/me`);
  }

  async getUser(userId: string): Promise<User> {
    return api.get(`${this.basePath}/${userId}`);
  }

  async updateUser(userId: string, updateData: UpdateUserData): Promise<User> {
    return api.put(`${this.basePath}/${userId}`, updateData);
  }

  async updateCurrentUser(updateData: UpdateUserData): Promise<User> {
    return api.put(`${this.basePath}/me`, updateData);
  }

  async deleteUser(userId: string, password: string): Promise<void> {
    return api.delete(`${this.basePath}/${userId}`, { password });
  }

  async deactivateAccount(): Promise<void> {
    return api.post(`${this.basePath}/me/deactivate`);
  }

  async reactivateAccount(): Promise<void> {
    return api.post(`${this.basePath}/me/reactivate`);
  }

  // Avatar Management
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(`${this.basePath}/me/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async deleteAvatar(): Promise<void> {
    return api.delete(`${this.basePath}/me/avatar`);
  }

  // Password Management
  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    return api.put(`${this.basePath}/me/password`, passwordData);
  }

  async forgotPassword(email: string): Promise<void> {
    return api.post(`${this.basePath}/forgot-password`, { email });
  }

  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    return api.post(`${this.basePath}/reset-password`, {
      token,
      newPassword,
      confirmPassword
    });
  }

  // Email Verification
  async verifyEmail(token: string): Promise<void> {
    return api.post(`${this.basePath}/verify-email`, { token });
  }

  async resendEmailVerification(): Promise<void> {
    return api.post(`${this.basePath}/me/resend-verification`);
  }

  // Phone Verification
  async verifyPhone(phoneNumber: string, code: string): Promise<void> {
    return api.post(`${this.basePath}/verify-phone`, { phoneNumber, code });
  }

  async sendPhoneVerification(phoneNumber: string): Promise<void> {
    return api.post(`${this.basePath}/send-phone-verification`, { phoneNumber });
  }

  // User Preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return api.put(`${this.basePath}/me/preferences`, preferences);
  }

  async getPreferences(): Promise<UserPreferences> {
    return api.get(`${this.basePath}/me/preferences`);
  }

  // Education Management
  async addEducation(education: Omit<Education, 'id'>): Promise<Education> {
    return api.post(`${this.basePath}/me/education`, education);
  }

  async updateEducation(educationId: string, education: Partial<Education>): Promise<Education> {
    return api.put(`${this.basePath}/me/education/${educationId}`, education);
  }

  async deleteEducation(educationId: string): Promise<void> {
    return api.delete(`${this.basePath}/me/education/${educationId}`);
  }

  async getEducation(): Promise<Education[]> {
    return api.get(`${this.basePath}/me/education`);
  }

  // Experience Management
  async addExperience(experience: Omit<Experience, 'id'>): Promise<Experience> {
    return api.post(`${this.basePath}/me/experience`, experience);
  }

  async updateExperience(experienceId: string, experience: Partial<Experience>): Promise<Experience> {
    return api.put(`${this.basePath}/me/experience/${experienceId}`, experience);
  }

  async deleteExperience(experienceId: string): Promise<void> {
    return api.delete(`${this.basePath}/me/experience/${experienceId}`);
  }

  async getExperience(): Promise<Experience[]> {
    return api.get(`${this.basePath}/me/experience`);
  }

  // Certification Management
  async addCertification(certification: Omit<Certification, 'id'>): Promise<Certification> {
    return api.post(`${this.basePath}/me/certifications`, certification);
  }

  async updateCertification(certificationId: string, certification: Partial<Certification>): Promise<Certification> {
    return api.put(`${this.basePath}/me/certifications/${certificationId}`, certification);
  }

  async deleteCertification(certificationId: string): Promise<void> {
    return api.delete(`${this.basePath}/me/certifications/${certificationId}`);
  }

  async getCertifications(): Promise<Certification[]> {
    return api.get(`${this.basePath}/me/certifications`);
  }

  // User Statistics
  async getUserStatistics(userId: string): Promise<UserStatistics> {
    return api.get(`${this.basePath}/${userId}/statistics`);
  }

  async getMyStatistics(): Promise<UserStatistics> {
    return api.get(`${this.basePath}/me/statistics`);
  }

  async refreshStatistics(): Promise<UserStatistics> {
    return api.post(`${this.basePath}/me/statistics/refresh`);
  }

  // User Discovery
  async searchUsers(query: string, filters?: {
    role?: string;
    skill?: string;
    location?: string;
    sortBy?: 'name' | 'recent' | 'popular';
  }): Promise<User[]> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }
    
    return api.get(`/search/users?${params.toString()}`);
  }

  async getInstructors(filters?: {
    category?: string;
    rating?: number;
    sortBy?: 'rating' | 'courses' | 'recent';
  }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }
    
    return api.get(`/instructors?${params.toString()}`);
  }

  // Following and Connections
  async followUser(userId: string): Promise<void> {
    return api.post(`${this.basePath}/${userId}/follow`);
  }

  async unfollowUser(userId: string): Promise<void> {
    return api.delete(`${this.basePath}/${userId}/follow`);
  }

  async getFollowers(userId: string): Promise<{ user: User; followedAt: string }[]> {
    return api.get(`${this.basePath}/${userId}/followers`);
  }

  async getFollowing(userId: string): Promise<{ user: User; followedAt: string }[]> {
    return api.get(`${this.basePath}/${userId}/following`);
  }

  async getMyFollowers(): Promise<{ user: User; followedAt: string }[]> {
    return api.get(`${this.basePath}/me/followers`);
  }

  async getMyFollowing(): Promise<{ user: User; followedAt: string }[]> {
    return api.get(`${this.basePath}/me/following`);
  }

  // User Activity
  async getUserActivity(userId: string, limit = 20): Promise<Array<{
    id: string;
    type: 'course_enrolled' | 'course_completed' | 'achievement_earned' | 'certification_earned';
    data: any;
    createdAt: string;
  }>> {
    return api.get(`${this.basePath}/${userId}/activity?limit=${limit}`);
  }

  async getMyActivity(limit = 20): Promise<Array<{
    id: string;
    type: 'course_enrolled' | 'course_completed' | 'achievement_earned' | 'certification_earned';
    data: any;
    createdAt: string;
  }>> {
    return api.get(`${this.basePath}/me/activity?limit=${limit}`);
  }

  // Account Management
  async exportUserData(format: 'json' | 'csv'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    return api.post(`${this.basePath}/me/export`, { format });
  }

  async requestDataDeletion(): Promise<{
    requestId: string;
    deletionDate: string;
  }> {
    return api.post(`${this.basePath}/me/delete-request`);
  }

  async cancelDataDeletion(): Promise<void> {
    return api.delete(`${this.basePath}/me/delete-request`);
  }

  // Two-Factor Authentication
  async enableTwoFactor(): Promise<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  }> {
    return api.post(`${this.basePath}/me/2fa/enable`);
  }

  async confirmTwoFactor(token: string): Promise<{ backupCodes: string[] }> {
    return api.post(`${this.basePath}/me/2fa/confirm`, { token });
  }

  async disableTwoFactor(token: string): Promise<void> {
    return api.post(`${this.basePath}/me/2fa/disable`, { token });
  }

  async verifyTwoFactor(token: string): Promise<boolean> {
    return api.post(`${this.basePath}/me/2fa/verify`, { token });
  }

  // Privacy Settings
  async updatePrivacySettings(settings: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showAchievements: boolean;
    allowMessages: boolean;
    allowCourseRecommendations: boolean;
  }): Promise<void> {
    return api.put(`${this.basePath}/me/privacy`, settings);
  }

  async getPrivacySettings(): Promise<{
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    showAchievements: boolean;
    allowMessages: boolean;
    allowCourseRecommendations: boolean;
    blockedUsers: string[];
  }> {
    return api.get(`${this.basePath}/me/privacy`);
  }

  async blockUser(userId: string): Promise<void> {
    return api.post(`${this.basePath}/me/block/${userId}`);
  }

  async unblockUser(userId: string): Promise<void> {
    return api.delete(`${this.basePath}/me/block/${userId}`);
  }
}

export const userService = new UserService();