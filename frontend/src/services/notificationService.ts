import { api } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: NotificationCategory;
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
  clickedAt?: string;
}

export type NotificationType = 
  | 'course_enrolled'
  | 'course_completed'
  | 'assignment_due'
  | 'assignment_submitted'
  | 'assignment_graded'
  | 'quiz_available'
  | 'quiz_completed'
  | 'achievement_earned'
  | 'certificate_earned'
  | 'streak_milestone'
  | 'study_reminder'
  | 'new_course'
  | 'course_update'
  | 'instructor_message'
  | 'peer_activity'
  | 'system_maintenance'
  | 'payment_success'
  | 'payment_failed'
  | 'subscription_renewed'
  | 'subscription_cancelled';

export type NotificationCategory = 
  | 'course'
  | 'assignment'
  | 'achievement'
  | 'social'
  | 'system'
  | 'payment'
  | 'reminder';

export interface NotificationPreferences {
  userId: string;
  email: {
    [key in NotificationType]?: boolean;
  };
  push: {
    [key in NotificationType]?: boolean;
  };
  inApp: {
    [key in NotificationType]?: boolean;
  };
  studyReminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    time: string; // HH:mm format
    days: number[]; // 0-6 for Sunday-Saturday
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    timezone: string;
  };
}

export interface NotificationSettings {
  enableEmail: boolean;
  enablePush: boolean;
  enableInApp: boolean;
  enableBadges: boolean;
  enableSound: boolean;
  batchNotifications: boolean;
  batchFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

class NotificationService {
  private readonly basePath = '/notifications';

  // Notification Management
  async getNotifications(params?: {
    type?: NotificationType;
    category?: NotificationCategory;
    isRead?: boolean;
    priority?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'priority' | 'title';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
    hasMore: boolean;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}?${searchParams.toString()}`);
  }

  async getNotification(notificationId: string): Promise<Notification> {
    return api.get(`${this.basePath}/${notificationId}`);
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return api.put(`${this.basePath}/${notificationId}/read`);
  }

  async markAsUnread(notificationId: string): Promise<Notification> {
    return api.put(`${this.basePath}/${notificationId}/unread`);
  }

  async markAllAsRead(): Promise<{ updatedCount: number }> {
    return api.put(`${this.basePath}/read-all`);
  }

  async archiveNotification(notificationId: string): Promise<Notification> {
    return api.put(`${this.basePath}/${notificationId}/archive`);
  }

  async unarchiveNotification(notificationId: string): Promise<Notification> {
    return api.put(`${this.basePath}/${notificationId}/unarchive`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    return api.delete(`${this.basePath}/${notificationId}`);
  }

  async deleteMultiple(notificationIds: string[]): Promise<{ deletedCount: number }> {
    return api.delete(`${this.basePath}/batch-delete`, { notificationIds });
  }

  async deleteRead(): Promise<{ deletedCount: number }> {
    return api.delete(`${this.basePath}/delete-read`);
  }

  async deleteArchived(): Promise<{ deletedCount: number }> {
    return api.delete(`${this.basePath}/delete-archived`);
  }

  // Real-time Notifications (WebSocket)
  async subscribeToNotifications(): Promise<EventSource> {
    // This would connect to WebSocket endpoint
    return api.getEventSource('/notifications/stream');
  }

  async unsubscribeFromNotifications(): Promise<void> {
    return api.closeEventSource('/notifications/stream');
  }

  // Notification Creation (Admin/Instructor)
  async createNotification(notification: {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: NotificationCategory;
    targetUsers?: string[]; // If not provided, will be sent to all relevant users
    userFilter?: {
      role?: string[];
      enrolledCourses?: string[];
      activityStatus?: 'active' | 'inactive';
    };
    scheduleAt?: string;
    expiresAt?: string;
    actionUrl?: string;
    actionText?: string;
  }): Promise<{ notificationId: string; sentCount: number }> {
    return api.post(`${this.basePath}/create`, notification);
  }

  async scheduleNotification(notification: {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: NotificationCategory;
    scheduleAt: string;
    targetUsers?: string[];
    expiresAt?: string;
    actionUrl?: string;
    actionText?: string;
  }): Promise<{ scheduledId: string }> {
    return api.post(`${this.basePath}/schedule`, notification);
  }

  async cancelScheduledNotification(scheduledId: string): Promise<void> {
    return api.delete(`${this.basePath}/scheduled/${scheduledId}`);
  }

  async getScheduledNotifications(): Promise<Array<{
    id: string;
    notification: any;
    scheduleAt: string;
    targetUsers: string[];
    status: 'pending' | 'sent' | 'failed' | 'cancelled';
  }>> {
    return api.get(`${this.basePath}/scheduled`);
  }

  // Study Reminders
  async setStudyReminder(reminder: {
    enabled: boolean;
    time: string; // HH:mm
    frequency: 'daily' | 'weekly' | 'custom';
    days?: number[]; // For weekly custom
    courses?: string[]; // Specific courses to remind about
  }): Promise<void> {
    return api.put(`${this.basePath}/reminders/study`, reminder);
  }

  async getStudyReminders(): Promise<{
    enabled: boolean;
    time: string;
    frequency: 'daily' | 'weekly' | 'custom';
    days?: number[];
    courses?: string[];
  }> {
    return api.get(`${this.basePath}/reminders/study`);
  }

  async snoozeNotification(notificationId: string, duration: '1h' | '4h' | '1d' | '1w'): Promise<void> {
    return api.post(`${this.basePath}/${notificationId}/snooze`, { duration });
  }

  // Notification Preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return api.get(`${this.basePath}/preferences`);
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return api.put(`${this.basePath}/preferences`, preferences);
  }

  async updateNotificationTypePreference(
    type: NotificationType,
    channels: {
      email?: boolean;
      push?: boolean;
      inApp?: boolean;
    }
  ): Promise<void> {
    return api.put(`${this.basePath}/preferences/type/${type}`, channels);
  }

  async resetNotificationPreferences(): Promise<NotificationPreferences> {
    return api.delete(`${this.basePath}/preferences/reset`);
  }

  // Notification Categories
  async getNotificationsByCategory(category: NotificationCategory, params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<{
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/category/${category}?${searchParams.toString()}`);
  }

  // Analytics and Insights
  async getNotificationAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    type?: NotificationType;
  }): Promise<{
    totalSent: number;
    totalRead: number;
    totalClicked: number;
    readRate: number;
    clickRate: number;
    byType: Record<string, {
      sent: number;
      read: number;
      clicked: number;
    }>;
    byCategory: Record<string, {
      sent: number;
      read: number;
      clicked: number;
    }>;
    dailyStats: Array<{
      date: string;
      sent: number;
      read: number;
      clicked: number;
    }>;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      });
    }
    
    return api.get(`${this.basePath}/analytics?${searchParams.toString()}`);
  }

  async getNotificationSummary(): Promise<{
    unreadCount: number;
    totalCount: number;
    urgentCount: number;
    categoryBreakdown: Record<NotificationCategory, number>;
    recentActivity: Notification[];
  }> {
    return api.get(`${this.basePath}/summary`);
  }

  // Template Management
  async getNotificationTemplates(): Promise<Array<{
    id: string;
    name: string;
    type: NotificationType;
    titleTemplate: string;
    messageTemplate: string;
    variables: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>> {
    return api.get(`${this.basePath}/templates`);
  }

  async createNotificationTemplate(template: {
    name: string;
    type: NotificationType;
    titleTemplate: string;
    messageTemplate: string;
    variables: string[];
  }): Promise<{
    id: string;
    name: string;
    type: NotificationType;
  }> {
    return api.post(`${this.basePath}/templates`, template);
  }

  async updateNotificationTemplate(templateId: string, template: {
    name?: string;
    titleTemplate?: string;
    messageTemplate?: string;
    variables?: string[];
    isActive?: boolean;
  }): Promise<void> {
    return api.put(`${this.basePath}/templates/${templateId}`, template);
  }

  async deleteNotificationTemplate(templateId: string): Promise<void> {
    return api.delete(`${this.basePath}/templates/${templateId}`);
  }

  // Test Notifications
  async sendTestNotification(type: NotificationType, channels: ('email' | 'push' | 'inApp')[]): Promise<void> {
    return api.post(`${this.basePath}/test`, { type, channels });
  }

  // Bulk Operations
  async bulkMarkAsRead(notificationIds: string[]): Promise<{ updatedCount: number }> {
    return api.put(`${this.basePath}/bulk/read`, { notificationIds });
  }

  async bulkArchive(notificationIds: string[]): Promise<{ archivedCount: number }> {
    return api.put(`${this.basePath}/bulk/archive`, { notificationIds });
  }

  async bulkDelete(notificationIds: string[]): Promise<{ deletedCount: number }> {
    return api.delete(`${this.basePath}/bulk/delete`, { notificationIds });
  }

  // Export/Import
  async exportNotifications(params?: {
    startDate?: string;
    endDate?: string;
    type?: NotificationType;
    category?: NotificationCategory;
    format?: 'json' | 'csv';
  }): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    return api.post(`${this.basePath}/export`, params);
  }

  // Device Management
  async registerDevice(deviceData: {
    token: string;
    platform: 'ios' | 'android' | 'web';
    deviceId: string;
    deviceName?: string;
    appVersion?: string;
  }): Promise<void> {
    return api.post(`${this.basePath}/devices`, deviceData);
  }

  async unregisterDevice(deviceId: string): Promise<void> {
    return api.delete(`${this.basePath}/devices/${deviceId}`);
  }

  async getRegisteredDevices(): Promise<Array<{
    id: string;
    platform: string;
    deviceName?: string;
    isActive: boolean;
    lastUsed: string;
  }>> {
    return api.get(`${this.basePath}/devices`);
  }
}

export const notificationService = new NotificationService();