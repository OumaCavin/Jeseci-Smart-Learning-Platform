import React, { useState } from 'react';
import { useAuth } from '../../hooks/useLearning';
import { useNotifications } from '../../hooks/useLearning';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Manage your privacy settings and data preferences',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure your notification preferences',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5m7 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    id: 'learning',
    title: 'Learning Preferences',
    description: 'Customize your learning experience',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'account',
    title: 'Account Settings',
    description: 'Manage your account preferences',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const PrivacySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    analytics: true,
    marketingEmails: false,
    thirdPartyCookies: true,
    sessionTimeout: '30',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Profile Visibility
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Control who can see your profile and learning progress
        </p>
        <div className="space-y-3">
          {[
            { value: 'public', label: 'Public - Everyone can see your profile' },
            { value: 'private', label: 'Private - Only you can see your profile' },
            { value: 'connections', label: 'Connections - Only your connections can see your profile' },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="mr-3"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'dataSharing', label: 'Data Sharing', description: 'Allow sharing anonymized learning data for research' },
          { key: 'analytics', label: 'Learning Analytics', description: 'Track your learning progress and performance' },
          { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional and educational content via email' },
          { key: 'thirdPartyCookies', label: 'Third-party Cookies', description: 'Allow third-party cookies for enhanced functionality' },
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {setting.label}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {setting.description}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[setting.key as keyof typeof settings] as boolean}
                onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Session Timeout (minutes)
        </label>
        <Input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
          min="5"
          max="1440"
        />
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Automatically log out after this period of inactivity
        </p>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    studyStreakAlerts: true,
    newCourseNotifications: false,
    progressUpdates: true,
    achievementNotifications: true,
    discussionReplies: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const notificationTypes = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
    { key: 'assignmentReminders', label: 'Assignment Reminders', description: 'Get reminded about upcoming assignments' },
    { key: 'studyStreakAlerts', label: 'Study Streak Alerts', description: 'Notifications about your study streak' },
    { key: 'newCourseNotifications', label: 'New Course Notifications', description: 'Notify about new courses in your areas of interest' },
    { key: 'progressUpdates', label: 'Progress Updates', description: 'Weekly summaries of your learning progress' },
    { key: 'achievementNotifications', label: 'Achievement Notifications', description: 'Notifications when you earn new achievements' },
    { key: 'discussionReplies', label: 'Discussion Replies', description: 'Notifications when someone replies to your discussions' },
  ];

  return (
    <div className="space-y-4">
      {notificationTypes.map((notification) => (
        <div key={notification.key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {notification.label}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {notification.description}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings[notification.key as keyof typeof settings]}
              onChange={(e) => handleSettingChange(notification.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );
};

const LearningSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    preferredStudyTime: 'anytime',
    difficultyPreference: 'adaptive',
    studyReminders: true,
    spacedRepetition: true,
    autoAdvance: false,
    language: 'en',
    codeTheme: 'light',
    soundEffects: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Study Preferences
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Customize your learning experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Study Time
            </label>
            <select
              value={settings.preferredStudyTime}
              onChange={(e) => handleSettingChange('preferredStudyTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="morning">Morning (6AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 6PM)</option>
              <option value="evening">Evening (6PM - 12AM)</option>
              <option value="night">Night (12AM - 6AM)</option>
              <option value="anytime">Anytime</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Preference
            </label>
            <select
              value={settings.difficultyPreference}
              onChange={(e) => handleSettingChange('difficultyPreference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="easy">Easy - Start with simpler concepts</option>
              <option value="moderate">Moderate - Balanced challenge</option>
              <option value="challenging">Challenging - Push my limits</option>
              <option value="adaptive">Adaptive - Let the platform decide</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interface Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code Editor Theme
            </label>
            <select
              value={settings.codeTheme}
              onChange={(e) => handleSettingChange('codeTheme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="auto">Auto (Match system)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'studyReminders', label: 'Study Reminders', description: 'Daily reminders to maintain your study schedule' },
          { key: 'spacedRepetition', label: 'Spaced Repetition', description: 'Use spaced repetition for better retention' },
          { key: 'autoAdvance', label: 'Auto-advance', description: 'Automatically move to the next question when correct' },
          { key: 'soundEffects', label: 'Sound Effects', description: 'Play sounds for correct/incorrect answers' },
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {setting.label}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {setting.description}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[setting.key as keyof typeof settings] as boolean}
                onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const AccountSettings: React.FC = () => {
  const { logout } = useAuth();
  const { addNotification } = useNotifications();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/user/export-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-data-export.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        addNotification({
          type: 'success',
          title: 'Data Export',
          message: 'Your data has been exported successfully.',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export your data. Please try again.',
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Account Deleted',
          message: 'Your account has been deleted successfully.',
        });
        logout();
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: 'Failed to delete account. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Account Management
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Manage your account data and preferences
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Export Your Data
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Download a copy of all your learning data and progress
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
          </div>
        </Card>

        <Card className="p-4 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                Delete Account
              </h4>
              <p className="text-xs text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Account Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. All your learning progress, achievements, and data will be permanently deleted.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Delete My Account
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('privacy');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'privacy':
        return <PrivacySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'learning':
        return <LearningSettings />;
      case 'account':
        return <AccountSettings />;
      default:
        return <PrivacySettings />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account preferences and learning experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-start space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  activeSection === section.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {section.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {settingsSections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {settingsSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            {renderActiveSection()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;