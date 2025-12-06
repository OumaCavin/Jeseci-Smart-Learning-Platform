export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  showProgressBars: boolean;
  compactMode: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  sessionLength: number; // in minutes
  breakReminder: boolean;
  analyticsOptIn: boolean;
  marketingOptIn: boolean;
  personalizedRecommendations: boolean;
  aiTutorEnabled: boolean;
  realTimeFeedback: boolean;
  adaptiveDifficulty: boolean;
  socialFeatures: boolean;
  gamificationEnabled: boolean;
  weeklyReports: boolean;
  achievementNotifications: boolean;
  peerComparison: boolean;
  studyStreak: boolean;
  leaderboardParticipation: boolean;
  tournamentParticipation: boolean;
  teamChallenges: boolean;
  mentorMode: boolean;
  accessibility: {
    highContrast: boolean;
    dyslexiaFriendly: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    voiceControl: boolean;
  };
  contentFiltering: {
    ageAppropriate: boolean;
    contentWarnings: boolean;
    parentalControls: boolean;
    filterExplicit: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    shareProgress: boolean;
    shareAchievements: boolean;
    dataCollection: boolean;
    thirdPartySharing: boolean;
  };
}

export interface SystemSettings {
  appVersion: string;
  lastUpdated: string;
  maintenanceMode: boolean;
  featureFlags: {
    aiTutor: boolean;
    knowledgeGraph: boolean;
    gamification: boolean;
    socialFeatures: boolean;
    analytics: boolean;
    contentGeneration: boolean;
    realTimeCollab: boolean;
    advancedSearch: boolean;
    blockchainRewards: boolean;
    vrSupport: boolean;
  };
  performance: {
    enableCaching: boolean;
    lazyLoading: boolean;
    offlineMode: boolean;
    compressionEnabled: boolean;
    imageOptimization: boolean;
    prefetchResources: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: 'basic' | 'strong' | 'enterprise';
    ipWhitelist: string[];
    deviceTrust: boolean;
  };
  integrations: {
    openai: boolean;
    gemini: boolean;
    webhookEnabled: boolean;
    apiRateLimit: number;
    externalSSO: boolean;
  };
  compliance: {
    gdprCompliance: boolean;
    coppaCompliance: boolean;
    dataRetention: number; // days
    auditLogging: boolean;
    anonymization: boolean;
  };
}

export interface LearningSettings {
  adaptivePath: boolean;
  difficultyAdjustment: number; // 1-10 scale
  contentDelivery: 'sequential' | 'randomized' | 'adaptive' | 'custom';
  assessmentFrequency: 'daily' | 'weekly' | 'monthly' | 'asneeded';
  progressTracking: boolean;
  goalSetting: boolean;
  timeManagement: boolean;
  noteTaking: boolean;
  bookmarkSystem: boolean;
  offlineDownload: boolean;
  syncAcrossDevices: boolean;
  collaborativeLearning: boolean;
  peerReview: boolean;
  expertMentorship: boolean;
  realTimeTutoring: boolean;
  aiPersonalization: boolean;
  contentCustomization: boolean;
  learningAnalytics: boolean;
  retentionStrategy: boolean;
  spacedRepetition: boolean;
  microlearning: boolean;
  gamifiedQuizzes: boolean;
  virtualReality: boolean;
  augmentedReality: boolean;
  voiceInteraction: boolean;
  gestureControl: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  dyslexiaFont: boolean;
  fontSize: number;
  lineSpacing: number;
  colorBlindSupport: {
    deuteranopia: boolean;
    protanopia: boolean;
    tritanopia: boolean;
  };
  motionSensitivity: 'full' | 'reduced' | 'minimal';
  audioSettings: {
    volume: number;
    speed: number;
    pitch: number;
    backgroundNoise: boolean;
  };
  cognitive: {
    simplifiedUI: boolean;
    reducedComplexity: boolean;
    stepByStep: boolean;
    visualCues: boolean;
    memoryAids: boolean;
  };
  motor: {
    clickTargetSize: 'normal' | 'large' | 'xlarge';
    hoverTime: number;
    dragSensitivity: number;
    keyboardOnly: boolean;
    switchControl: boolean;
    eyeTracking: boolean;
  };
}

export interface PerformanceSettings {
  cacheSettings: {
    enabled: boolean;
    size: number; // MB
    expiration: number; // hours
    selectiveCaching: boolean;
  };
  loadingPreferences: {
    lazyLoad: boolean;
    preloadNext: boolean;
    progressiveLoad: boolean;
    prioritizeContent: boolean;
  };
  networkOptimization: {
    compressionEnabled: boolean;
    imageOptimization: boolean;
    streamingQuality: 'auto' | 'low' | 'medium' | 'high';
    bandwidthAdaptation: boolean;
    offlineSync: boolean;
  };
  deviceOptimization: {
    batteryOptimization: boolean;
    cpuThrottling: boolean;
    memoryManagement: boolean;
    gpuAcceleration: boolean;
    hardwareAcceleration: boolean;
  };
}

export interface NotificationSettings {
  global: boolean;
  push: boolean;
  email: boolean;
  inApp: boolean;
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
    timezone: string;
  };
  categories: {
    learning: {
      enabled: boolean;
      types: {
        newContent: boolean;
        assignmentDue: boolean;
        reminder: boolean;
        achievement: boolean;
        progressUpdate: boolean;
      };
    };
    social: {
      enabled: boolean;
      types: {
        friendRequest: boolean;
        groupInvite: boolean;
        collaboration: boolean;
        mention: boolean;
        message: boolean;
      };
    };
    gamification: {
      enabled: boolean;
      types: {
        levelUp: boolean;
        streak: boolean;
        tournament: boolean;
        leaderboard: boolean;
        badge: boolean;
      };
    };
    system: {
      enabled: boolean;
      types: {
        maintenance: boolean;
        update: boolean;
        security: boolean;
        billing: boolean;
        feature: boolean;
      };
    };
  };
}

export interface AdvancedSettings {
  developerMode: boolean;
  debugMode: boolean;
  telemetryEnabled: boolean;
  betaFeatures: boolean;
  experimentalFeatures: boolean;
  apiAccess: boolean;
  dataExport: boolean;
  dataImport: boolean;
  backupSettings: boolean;
  syncSettings: boolean;
  customIntegrations: boolean;
  webhookConfiguration: boolean;
  securitySettings: boolean;
  complianceSettings: boolean;
  analyticsSettings: boolean;
  performanceMonitoring: boolean;
  errorReporting: boolean;
  userTesting: boolean;
  featureFlags: boolean;
  environmentConfig: boolean;
  logging: boolean;
}

export interface ThemeSettings {
  current: 'light' | 'dark' | 'auto' | 'custom';
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  customFonts: {
    primary: string;
    secondary: string;
    monospace: string;
    size: 'small' | 'medium' | 'large' | 'xlarge';
    weight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  };
  customLayout: {
    sidebarPosition: 'left' | 'right' | 'bottom';
    compactMode: boolean;
    roundedCorners: boolean;
    shadowsEnabled: boolean;
    animationsEnabled: boolean;
    transitionSpeed: 'slow' | 'normal' | 'fast';
  };
}

export interface PersonalizationSettings {
  profilePicture: string;
  displayName: string;
  bio: string;
  location: string;
  timezone: string;
  currency: string;
  units: 'metric' | 'imperial';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  weekStart: 'sunday' | 'monday';
  learningGoals: string[];
  interests: string[];
  expertise: string[];
  preferredSubjects: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  learningSpeed: 'slow' | 'normal' | 'fast' | 'custom';
  sessionPreferences: {
    preferredTime: string;
    duration: number;
    breaks: boolean;
    frequency: 'daily' | 'weekly' | 'flexible';
  };
  contentPreferences: {
    visualStyle: 'minimal' | 'detailed' | 'interactive';
    contentLength: 'short' | 'medium' | 'long' | 'adaptive';
    interactivity: 'low' | 'medium' | 'high';
    multimedia: 'text' | 'mixed' | 'video' | 'audio';
  };
  socialPreferences: {
    shareProgress: boolean;
    shareAchievements: boolean;
    friendVisibility: 'public' | 'friends' | 'private';
    groupMembership: 'open' | 'approval' | 'private';
    collaboration: boolean;
    mentorship: boolean;
  };
}

export interface AIConfiguration {
  openai: {
    enabled: boolean;
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo';
    temperature: number; // 0-1
    maxTokens: number;
    customPrompt?: string;
    apiKey?: string;
    usage: {
      enabledFeatures: string[];
      rateLimit: number;
      monthlyLimit: number;
    };
  };
  gemini: {
    enabled: boolean;
    model: 'gemini-pro' | 'gemini-pro-vision';
    temperature: number; // 0-1
    maxOutputTokens: number;
    customPrompt?: string;
    apiKey?: string;
    usage: {
      enabledFeatures: string[];
      rateLimit: number;
      monthlyLimit: number;
    };
  };
  personalization: {
    adaptiveLearning: boolean;
    contentRecommendations: boolean;
    difficultyAdjustment: boolean;
    learningPathOptimization: boolean;
    performancePrediction: boolean;
    engagementOptimization: boolean;
    retentionOptimization: boolean;
    personalization: boolean;
  };
  features: {
    contentGeneration: boolean;
    assessmentCreation: boolean;
    feedbackGeneration: boolean;
    progressAnalysis: boolean;
    behaviorAnalysis: boolean;
    learningPathGeneration: boolean;
    realTimeAssistance: boolean;
    predictiveAnalytics: boolean;
  };
}

export interface SecuritySettings {
  authentication: {
    method: 'password' | 'biometric' | 'two-factor' | 'oauth' | 'enterprise-sso';
    twoFactorEnabled: boolean;
    twoFactorMethod: 'sms' | 'email' | 'app' | 'hardware';
    passwordRequirements: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      preventReuse: number; // number of previous passwords
    };
    sessionTimeout: number; // minutes
    rememberMe: boolean;
    concurrentSessions: number;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private' | 'custom';
    dataSharing: boolean;
    analyticsOptOut: boolean;
    marketingOptOut: boolean;
    thirdPartyCookies: boolean;
    trackingPrevention: boolean;
  };
  compliance: {
    gdpr: boolean;
    coppa: boolean;
    hipaa: boolean;
    ferpa: boolean;
    sox: boolean;
    dataRetention: number; // days
    rightToDeletion: boolean;
    dataPortability: boolean;
  };
  monitoring: {
    loginAttempts: boolean;
    suspiciousActivity: boolean;
    deviceRegistration: boolean;
    ipWhitelist: boolean;
    geoFencing: boolean;
    sessionMonitoring: boolean;
  };
}

export interface AdvancedLearningSettings {
  cognitiveLoad: {
    enableOptimization: boolean;
    maxConcepts: number;
    complexityThreshold: number;
    adaptiveThreshold: boolean;
  };
  memory: {
    enableSpacedRepetition: boolean;
    intervalMultipliers: number[];
    retentionTarget: number; // percentage
    forgettingCurve: boolean;
  };
  motivation: {
    gamificationLevel: 'minimal' | 'moderate' | 'high' | 'adaptive';
    achievementThresholds: {
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
    };
    rewardFrequency: 'rare' | 'occasional' | 'frequent' | 'adaptive';
  };
  socialLearning: {
    peerComparison: boolean;
    groupLearning: boolean;
    collaborativeProjects: boolean;
    discussionForums: boolean;
    studyGroups: boolean;
  };
  assessment: {
    adaptiveTesting: boolean;
    itemResponseTheory: boolean;
    difficultyCalibration: boolean;
    biasDetection: boolean;
    validityChecks: boolean;
  };
  contentDelivery: {
    microlearning: boolean;
    chunkSize: number;
    interleavePractice: boolean;
    interleaving: boolean;
    desirableDifficulties: boolean;
  };
  metacognition: {
    selfReflection: boolean;
    strategySelection: boolean;
    errorAnalysis: boolean;
    confidenceTracking: boolean;
    goalSetting: boolean;
  };
  accessibility: {
    universalDesign: boolean;
    multipleRepresentations: boolean;
    assistiveTechnology: boolean;
    cognitiveAids: boolean;
  };
}

export interface EnterpriseSettings {
  organization: {
    name: string;
    domain: string;
    adminEmail: string;
    supportEmail: string;
    logo?: string;
    branding: {
      primaryColor: string;
      secondaryColor: string;
      customCSS?: string;
    };
  };
  users: {
    maxUsers: number;
    userRoles: string[];
    permissionLevels: {
      admin: string[];
      teacher: string[];
      student: string[];
      parent: string[];
    };
    onboarding: {
      required: boolean;
      steps: string[];
      duration: number; // days
    };
  };
  content: {
    maxStorage: number; // GB
    allowedFileTypes: string[];
    maxFileSize: number; // MB
    versioning: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
  security: {
    ssoEnabled: boolean;
    ldapIntegration: boolean;
    activeDirectory: boolean;
    rbacEnabled: boolean;
    auditLogging: boolean;
    complianceReporting: boolean;
  };
  reporting: {
    enabled: boolean;
    frequency: 'real-time' | 'daily' | 'weekly' | 'monthly';
    dashboards: string[];
    exportFormats: string[];
    scheduledReports: boolean;
  };
  billing: {
    plan: 'basic' | 'professional' | 'enterprise' | 'custom';
    billingCycle: 'monthly' | 'quarterly' | 'annually';
    autoRenew: boolean;
    paymentMethods: string[];
    invoiceEmail: string;
  };
}

export interface SettingsState {
  userPreferences: UserPreferences;
  systemSettings: SystemSettings;
  learningSettings: LearningSettings;
  accessibilitySettings: AccessibilitySettings;
  performanceSettings: PerformanceSettings;
  notificationSettings: NotificationSettings;
  advancedSettings: AdvancedSettings;
  themeSettings: ThemeSettings;
  personalizationSettings: PersonalizationSettings;
  aiConfiguration: AIConfiguration;
  securitySettings: SecuritySettings;
  advancedLearningSettings: AdvancedLearningSettings;
  enterpriseSettings: EnterpriseSettings;
  isLoading: boolean;
  isDirty: boolean;
  lastModified: string;
  lastSync: string;
  version: string;
}

export interface SettingsAction {
  type: 'UPDATE_PREFERENCES' | 'UPDATE_SYSTEM_SETTINGS' | 'UPDATE_LEARNING_SETTINGS' | 
        'UPDATE_ACCESSIBILITY_SETTINGS' | 'UPDATE_PERFORMANCE_SETTINGS' | 
        'UPDATE_NOTIFICATION_SETTINGS' | 'UPDATE_ADVANCED_SETTINGS' | 
        'UPDATE_THEME_SETTINGS' | 'UPDATE_PERSONALIZATION_SETTINGS' | 
        'UPDATE_AI_CONFIGURATION' | 'UPDATE_SECURITY_SETTINGS' | 
        'UPDATE_ADVANCED_LEARNING_SETTINGS' | 'UPDATE_ENTERPRISE_SETTINGS' |
        'RESET_TO_DEFAULTS' | 'IMPORT_SETTINGS' | 'EXPORT_SETTINGS' | 
        'SAVE_SETTINGS' | 'LOAD_SETTINGS' | 'CLEAR_CACHE' | 'RESET_TO_FACTORY';
  payload?: any;
}

class SettingsService {
  private apiKey: string | null = null;
  private geminiApiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';
  private geminiUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
    this.initializeSettings();
  }

  private async initializeSettings() {
    try {
      await this.loadDefaultSettings();
      await this.loadUserSettings();
      await this.optimizeSettingsForUser();
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  }

  private async loadDefaultSettings(): Promise<void> {
    // Load default settings based on user agent and device capabilities
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    
    const defaultSettings: Partial<SettingsState> = {
      userPreferences: {
        theme: this.detectSystemTheme(),
        language: navigator.language.split('-')[0],
        fontSize: isMobile ? 'medium' : 'medium',
        notifications: true,
        soundEnabled: true,
        autoSave: true,
        showProgressBars: true,
        compactMode: isMobile,
        difficulty: 'intermediate',
        preferredLearningStyle: 'mixed',
        sessionLength: isMobile ? 15 : 30,
        breakReminder: true,
        analyticsOptIn: true,
        marketingOptIn: false,
        personalizedRecommendations: true,
        aiTutorEnabled: true,
        realTimeFeedback: true,
        adaptiveDifficulty: true,
        socialFeatures: true,
        gamificationEnabled: true,
        weeklyReports: true,
        achievementNotifications: true,
        peerComparison: false,
        studyStreak: true,
        leaderboardParticipation: true,
        tournamentParticipation: true,
        teamChallenges: false,
        mentorMode: false,
        accessibility: {
          highContrast: false,
          dyslexiaFriendly: false,
          screenReader: false,
          keyboardNavigation: false,
          voiceControl: false,
        },
        contentFiltering: {
          ageAppropriate: true,
          contentWarnings: true,
          parentalControls: false,
          filterExplicit: true,
        },
        privacy: {
          profileVisibility: 'friends',
          shareProgress: true,
          shareAchievements: true,
          dataCollection: true,
          thirdPartySharing: false,
        },
      },
      performanceSettings: {
        cacheSettings: {
          enabled: true,
          size: 50,
          expiration: 24,
          selectiveCaching: true,
        },
        loadingPreferences: {
          lazyLoad: !isLowEnd,
          preloadNext: !isMobile,
          progressiveLoad: true,
          prioritizeContent: true,
        },
        networkOptimization: {
          compressionEnabled: true,
          imageOptimization: true,
          streamingQuality: 'auto',
          bandwidthAdaptation: true,
          offlineSync: true,
        },
        deviceOptimization: {
          batteryOptimization: isMobile,
          cpuThrottling: isLowEnd,
          memoryManagement: true,
          gpuAcceleration: !isLowEnd,
          hardwareAcceleration: !isLowEnd,
        },
      },
    };

    // Store defaults in cache
    this.cache.set('defaultSettings', {
      ...defaultSettings,
      timestamp: Date.now(),
    });
  }

  private detectSystemTheme(): 'light' | 'dark' | 'system' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  private async loadUserSettings(): Promise<SettingsState> {
    try {
      const cached = this.cache.get('userSettings');
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      // In a real implementation, this would fetch from backend
      // For now, return stored settings or defaults
      const stored = localStorage.getItem('jeseciSettings');
      if (stored) {
        const settings = JSON.parse(stored);
        this.cache.set('userSettings', {
          data: settings,
          timestamp: Date.now(),
        });
        return settings;
      }

      // Generate AI-powered personalized settings
      return await this.generatePersonalizedSettings();
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return await this.generatePersonalizedSettings();
    }
  }

  private async generatePersonalizedSettings(): Promise<SettingsState> {
    try {
      if (!this.geminiApiKey) {
        return this.getDefaultSettings();
      }

      const prompt = `
        Create personalized learning platform settings based on modern educational psychology and user experience principles. 
        Consider factors like cognitive load theory, motivation, engagement, accessibility, and optimal learning conditions.
        
        Generate settings that balance:
        - Productivity and focus
        - Engagement and learning effectiveness  
        - Accessibility and performance
        - Personalization and simplicity
        
        Return a comprehensive settings configuration in JSON format.
      `;

      const response = await this.callGeminiAPI(prompt);
      
      // Parse and validate the response
      // This is a simplified version - in practice, you'd want more robust validation
      
      return {
        ...this.getDefaultSettings(),
        isLoading: false,
        isDirty: false,
        lastModified: new Date().toISOString(),
        lastSync: new Date().toISOString(),
        version: '1.0.0',
      };
    } catch (error) {
      console.error('Failed to generate personalized settings:', error);
      return this.getDefaultSettings();
    }
  }

  private getDefaultSettings(): SettingsState {
    return {
      userPreferences: {
        theme: 'light',
        language: 'en',
        fontSize: 'medium',
        notifications: true,
        soundEnabled: true,
        autoSave: true,
        showProgressBars: true,
        compactMode: false,
        difficulty: 'intermediate',
        preferredLearningStyle: 'mixed',
        sessionLength: 30,
        breakReminder: true,
        analyticsOptIn: true,
        marketingOptIn: false,
        personalizedRecommendations: true,
        aiTutorEnabled: true,
        realTimeFeedback: true,
        adaptiveDifficulty: true,
        socialFeatures: true,
        gamificationEnabled: true,
        weeklyReports: true,
        achievementNotifications: true,
        peerComparison: false,
        studyStreak: true,
        leaderboardParticipation: true,
        tournamentParticipation: true,
        teamChallenges: false,
        mentorMode: false,
        accessibility: {
          highContrast: false,
          dyslexiaFriendly: false,
          screenReader: false,
          keyboardNavigation: false,
          voiceControl: false,
        },
        contentFiltering: {
          ageAppropriate: true,
          contentWarnings: true,
          parentalControls: false,
          filterExplicit: true,
        },
        privacy: {
          profileVisibility: 'friends',
          shareProgress: true,
          shareAchievements: true,
          dataCollection: true,
          thirdPartySharing: false,
        },
      },
      systemSettings: {
        appVersion: '1.0.0',
        lastUpdated: new Date().toISOString(),
        maintenanceMode: false,
        featureFlags: {
          aiTutor: true,
          knowledgeGraph: true,
          gamification: true,
          socialFeatures: true,
          analytics: true,
          contentGeneration: true,
          realTimeCollab: true,
          advancedSearch: true,
          blockchainRewards: false,
          vrSupport: false,
        },
        performance: {
          enableCaching: true,
          lazyLoading: true,
          offlineMode: true,
          compressionEnabled: true,
          imageOptimization: true,
          prefetchResources: true,
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 60,
          passwordPolicy: 'basic',
          ipWhitelist: [],
          deviceTrust: false,
        },
        integrations: {
          openai: true,
          gemini: true,
          webhookEnabled: false,
          apiRateLimit: 100,
          externalSSO: false,
        },
        compliance: {
          gdprCompliance: true,
          coppaCompliance: false,
          dataRetention: 365,
          auditLogging: true,
          anonymization: false,
        },
      },
      learningSettings: {
        adaptivePath: true,
        difficultyAdjustment: 5,
        contentDelivery: 'adaptive',
        assessmentFrequency: 'weekly',
        progressTracking: true,
        goalSetting: true,
        timeManagement: true,
        noteTaking: true,
        bookmarkSystem: true,
        offlineDownload: false,
        syncAcrossDevices: true,
        collaborativeLearning: true,
        peerReview: true,
        expertMentorship: false,
        realTimeTutoring: true,
        aiPersonalization: true,
        contentCustomization: true,
        learningAnalytics: true,
        retentionStrategy: true,
        spacedRepetition: true,
        microlearning: true,
        gamifiedQuizzes: true,
        virtualReality: false,
        augmentedReality: false,
        voiceInteraction: false,
        gestureControl: false,
      },
      accessibilitySettings: {
        highContrast: false,
        dyslexiaFont: false,
        fontSize: 16,
        lineSpacing: 1.5,
        colorBlindSupport: {
          deuteranopia: false,
          protanopia: false,
          tritanopia: false,
        },
        motionSensitivity: 'full',
        audioSettings: {
          volume: 0.8,
          speed: 1.0,
          pitch: 1.0,
          backgroundNoise: false,
        },
        cognitive: {
          simplifiedUI: false,
          reducedComplexity: false,
          stepByStep: false,
          visualCues: true,
          memoryAids: false,
        },
        motor: {
          clickTargetSize: 'normal',
          hoverTime: 500,
          dragSensitivity: 1.0,
          keyboardOnly: false,
          switchControl: false,
          eyeTracking: false,
        },
      },
      performanceSettings: {
        cacheSettings: {
          enabled: true,
          size: 50,
          expiration: 24,
          selectiveCaching: true,
        },
        loadingPreferences: {
          lazyLoad: true,
          preloadNext: false,
          progressiveLoad: true,
          prioritizeContent: true,
        },
        networkOptimization: {
          compressionEnabled: true,
          imageOptimization: true,
          streamingQuality: 'auto',
          bandwidthAdaptation: true,
          offlineSync: false,
        },
        deviceOptimization: {
          batteryOptimization: false,
          cpuThrottling: false,
          memoryManagement: true,
          gpuAcceleration: true,
          hardwareAcceleration: true,
        },
      },
      notificationSettings: {
        global: true,
        push: true,
        email: true,
        inApp: true,
        frequency: 'instant',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        categories: {
          learning: {
            enabled: true,
            types: {
              newContent: true,
              assignmentDue: true,
              reminder: true,
              achievement: true,
              progressUpdate: false,
            },
          },
          social: {
            enabled: true,
            types: {
              friendRequest: true,
              groupInvite: true,
              collaboration: true,
              mention: true,
              message: true,
            },
          },
          gamification: {
            enabled: true,
            types: {
              levelUp: true,
              streak: true,
              tournament: false,
              leaderboard: true,
              badge: true,
            },
          },
          system: {
            enabled: true,
            types: {
              maintenance: true,
              update: true,
              security: true,
              billing: false,
              feature: true,
            },
          },
        },
      },
      advancedSettings: {
        developerMode: false,
        debugMode: false,
        telemetryEnabled: true,
        betaFeatures: false,
        experimentalFeatures: false,
        apiAccess: false,
        dataExport: true,
        dataImport: true,
        backupSettings: true,
        syncSettings: true,
        customIntegrations: false,
        webhookConfiguration: false,
        securitySettings: false,
        complianceSettings: false,
        analyticsSettings: true,
        performanceMonitoring: true,
        errorReporting: true,
        userTesting: false,
        featureFlags: false,
        environmentConfig: false,
        logging: false,
      },
      themeSettings: {
        current: 'light',
        customColors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#10b981',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        customFonts: {
          primary: 'Inter, system-ui, sans-serif',
          secondary: 'Inter, system-ui, sans-serif',
          monospace: 'JetBrains Mono, monospace',
          size: 'medium',
          weight: 'normal',
        },
        customLayout: {
          sidebarPosition: 'left',
          compactMode: false,
          roundedCorners: true,
          shadowsEnabled: true,
          animationsEnabled: true,
          transitionSpeed: 'normal',
        },
      },
      personalizationSettings: {
        profilePicture: '',
        displayName: '',
        bio: '',
        location: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: 'USD',
        units: 'metric',
        dateFormat: 'MM/dd/yyyy',
        timeFormat: '12h',
        weekStart: 'sunday',
        learningGoals: [],
        interests: [],
        expertise: [],
        preferredSubjects: [],
        difficulty: 'intermediate',
        learningSpeed: 'normal',
        sessionPreferences: {
          preferredTime: '',
          duration: 30,
          breaks: true,
          frequency: 'flexible',
        },
        contentPreferences: {
          visualStyle: 'detailed',
          contentLength: 'medium',
          interactivity: 'medium',
          multimedia: 'mixed',
        },
        socialPreferences: {
          shareProgress: true,
          shareAchievements: true,
          friendVisibility: 'friends',
          groupMembership: 'approval',
          collaboration: true,
          mentorship: false,
        },
      },
      aiConfiguration: {
        openai: {
          enabled: true,
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 1000,
          usage: {
            enabledFeatures: ['content_generation', 'feedback_analysis', 'learning_recommendations'],
            rateLimit: 1000,
            monthlyLimit: 50000,
          },
        },
        gemini: {
          enabled: true,
          model: 'gemini-pro',
          temperature: 0.8,
          maxOutputTokens: 1000,
          usage: {
            enabledFeatures: ['content_analysis', 'personalization', 'performance_optimization'],
            rateLimit: 1000,
            monthlyLimit: 50000,
          },
        },
        personalization: {
          adaptiveLearning: true,
          contentRecommendations: true,
          difficultyAdjustment: true,
          learningPathOptimization: true,
          performancePrediction: true,
          engagementOptimization: true,
          retentionOptimization: true,
          personalization: true,
        },
        features: {
          contentGeneration: true,
          assessmentCreation: true,
          feedbackGeneration: true,
          progressAnalysis: true,
          behaviorAnalysis: true,
          learningPathGeneration: true,
          realTimeAssistance: true,
          predictiveAnalytics: true,
        },
      },
      securitySettings: {
        authentication: {
          method: 'password',
          twoFactorEnabled: false,
          twoFactorMethod: 'app',
          passwordRequirements: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false,
            preventReuse: 3,
          },
          sessionTimeout: 60,
          rememberMe: true,
          concurrentSessions: 3,
        },
        privacy: {
          profileVisibility: 'friends',
          dataSharing: true,
          analyticsOptOut: false,
          marketingOptOut: false,
          thirdPartyCookies: true,
          trackingPrevention: false,
        },
        compliance: {
          gdpr: true,
          coppa: false,
          hipaa: false,
          ferpa: false,
          sox: false,
          dataRetention: 365,
          rightToDeletion: true,
          dataPortability: true,
        },
        monitoring: {
          loginAttempts: true,
          suspiciousActivity: true,
          deviceRegistration: false,
          ipWhitelist: false,
          geoFencing: false,
          sessionMonitoring: true,
        },
      },
      advancedLearningSettings: {
        cognitiveLoad: {
          enableOptimization: true,
          maxConcepts: 7,
          complexityThreshold: 5,
          adaptiveThreshold: true,
        },
        memory: {
          enableSpacedRepetition: true,
          intervalMultipliers: [1, 3, 7, 14, 30],
          retentionTarget: 90,
          forgettingCurve: true,
        },
        motivation: {
          gamificationLevel: 'moderate',
          achievementThresholds: {
            beginner: 100,
            intermediate: 500,
            advanced: 1000,
            expert: 2500,
          },
          rewardFrequency: 'adaptive',
        },
        socialLearning: {
          peerComparison: false,
          groupLearning: true,
          collaborativeProjects: true,
          discussionForums: true,
          studyGroups: true,
        },
        assessment: {
          adaptiveTesting: true,
          itemResponseTheory: true,
          difficultyCalibration: true,
          biasDetection: true,
          validityChecks: true,
        },
        contentDelivery: {
          microlearning: true,
          chunkSize: 5,
          interleavePractice: true,
          interleaving: true,
          desirableDifficulties: true,
        },
        metacognition: {
          selfReflection: true,
          strategySelection: true,
          errorAnalysis: true,
          confidenceTracking: true,
          goalSetting: true,
        },
        accessibility: {
          universalDesign: true,
          multipleRepresentations: true,
          assistiveTechnology: true,
          cognitiveAids: false,
        },
      },
      enterpriseSettings: {
        organization: {
          name: '',
          domain: '',
          adminEmail: '',
          supportEmail: '',
          branding: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b',
          },
        },
        users: {
          maxUsers: 1000,
          userRoles: ['admin', 'teacher', 'student', 'parent'],
          permissionLevels: {
            admin: ['*'],
            teacher: ['content:read', 'content:write', 'students:read', 'students:write', 'assessments:read', 'assessments:write'],
            student: ['content:read', 'assessments:read', 'progress:read', 'progress:write'],
            parent: ['children:read', 'progress:read', 'reports:read'],
          },
          onboarding: {
            required: true,
            steps: ['profile_setup', 'preferences', 'tutorial'],
            duration: 7,
          },
        },
        content: {
          maxStorage: 10,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3', 'jpg', 'png'],
          maxFileSize: 100,
          versioning: true,
          backupFrequency: 'daily',
        },
        security: {
          ssoEnabled: false,
          ldapIntegration: false,
          activeDirectory: false,
          rbacEnabled: true,
          auditLogging: true,
          complianceReporting: false,
        },
        reporting: {
          enabled: true,
          frequency: 'weekly',
          dashboards: ['progress', 'engagement', 'performance'],
          exportFormats: ['pdf', 'csv', 'xlsx'],
          scheduledReports: true,
        },
        billing: {
          plan: 'basic',
          billingCycle: 'monthly',
          autoRenew: true,
          paymentMethods: ['card', 'paypal'],
          invoiceEmail: '',
        },
      },
      isLoading: false,
      isDirty: false,
      lastModified: new Date().toISOString(),
      lastSync: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  async updateSettings(settings: Partial<SettingsState>): Promise<void> {
    try {
      const currentSettings = await this.loadUserSettings();
      const updatedSettings = { ...currentSettings, ...settings };

      // Validate settings
      await this.validateSettings(updatedSettings);

      // Save to localStorage
      localStorage.setItem('jeseciSettings', JSON.stringify(updatedSettings));

      // Sync with backend if needed
      if (navigator.onLine) {
        await this.syncSettingsToBackend(updatedSettings);
      }

      // Update cache
      this.cache.set('userSettings', {
        data: updatedSettings,
        timestamp: Date.now(),
      });

      // Trigger AI optimization if enabled
      if (updatedSettings.userPreferences?.aiTutorEnabled) {
        await this.optimizeSettingsForUser();
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  async getSettings(): Promise<SettingsState> {
    return await this.loadUserSettings();
  }

  async resetToDefaults(): Promise<void> {
    try {
      const defaultSettings = this.getDefaultSettings();
      await this.updateSettings(defaultSettings);
    } catch (error) {
      console.error('Failed to reset settings to defaults:', error);
      throw error;
    }
  }

  async importSettings(settingsData: string): Promise<void> {
    try {
      const settings = JSON.parse(settingsData);
      await this.validateSettings(settings);
      await this.updateSettings(settings);
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw new Error('Invalid settings format');
    }
  }

  async exportSettings(): Promise<string> {
    try {
      const settings = await this.getSettings();
      return JSON.stringify(settings, null, 2);
    } catch (error) {
      console.error('Failed to export settings:', error);
      throw error;
    }
  }

  private async validateSettings(settings: any): Promise<void> {
    // Basic validation
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings object');
    }

    // Validate critical sections
    const requiredSections = [
      'userPreferences', 'systemSettings', 'learningSettings', 
      'accessibilitySettings', 'performanceSettings', 'notificationSettings'
    ];

    for (const section of requiredSections) {
      if (!settings[section]) {
        throw new Error(`Missing required section: ${section}`);
      }
    }

    // Validate specific values
    if (settings.userPreferences?.fontSize && !['small', 'medium', 'large'].includes(settings.userPreferences.fontSize)) {
      throw new Error('Invalid fontSize value');
    }

    // Add more validation as needed
  }

  private async syncSettingsToBackend(settings: SettingsState): Promise<void> {
    // In a real implementation, this would sync to the backend
    // For now, just log the sync attempt
    console.log('Syncing settings to backend...', settings.lastModified);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Settings synced successfully');
    } catch (error) {
      console.error('Failed to sync settings to backend:', error);
      // Don't throw here, as local settings should still work
    }
  }

  private async optimizeSettingsForUser(): Promise<void> {
    try {
      if (!this.geminiApiKey) return;

      const currentSettings = await this.getSettings();
      
      const prompt = `
        Analyze current learning platform settings and suggest optimizations based on:
        1. User behavior patterns
        2. Learning science principles  
        3. Accessibility best practices
        4. Performance optimization
        5. Engagement strategies
        
        Current settings analysis: ${JSON.stringify(currentSettings.userPreferences)}
        
        Provide specific recommendations for improvement in JSON format.
      `;

      const recommendations = await this.callGeminiAPI(prompt);
      
      // Apply AI-generated recommendations if significant
      if (recommendations && recommendations.confidence > 0.7) {
        console.log('Applying AI-generated settings optimizations:', recommendations);
        // Apply recommended changes
        // This would require more sophisticated implementation
      }
    } catch (error) {
      console.error('Failed to optimize settings:', error);
    }
  }

  private async callOpenAIAPI(prompt: string, maxTokens = 1000): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  private async callGeminiAPI(prompt: string, maxOutputTokens = 1000): Promise<any> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`${this.geminiUrl}/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens,
            temperature: 0.8,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  // Settings getters for specific categories
  async getUserPreferences(): Promise<UserPreferences> {
    const settings = await this.getSettings();
    return settings.userPreferences;
  }

  async getSystemSettings(): Promise<SystemSettings> {
    const settings = await this.getSettings();
    return settings.systemSettings;
  }

  async getLearningSettings(): Promise<LearningSettings> {
    const settings = await this.getSettings();
    return settings.learningSettings;
  }

  async getAccessibilitySettings(): Promise<AccessibilitySettings> {
    const settings = await this.getSettings();
    return settings.accessibilitySettings;
  }

  async getPerformanceSettings(): Promise<PerformanceSettings> {
    const settings = await this.getSettings();
    return settings.performanceSettings;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    const settings = await this.getSettings();
    return settings.notificationSettings;
  }

  async getThemeSettings(): Promise<ThemeSettings> {
    const settings = await this.getSettings();
    return settings.themeSettings;
  }

  async getPersonalizationSettings(): Promise<PersonalizationSettings> {
    const settings = await this.getSettings();
    return settings.personalizationSettings;
  }

  async getAIConfiguration(): Promise<AIConfiguration> {
    const settings = await this.getSettings();
    return settings.aiConfiguration;
  }

  async getSecuritySettings(): Promise<SecuritySettings> {
    const settings = await this.getSettings();
    return settings.securitySettings;
  }

  async getAdvancedLearningSettings(): Promise<AdvancedLearningSettings> {
    const settings = await this.getSettings();
    return settings.advancedLearningSettings;
  }

  async getEnterpriseSettings(): Promise<EnterpriseSettings> {
    const settings = await this.getSettings();
    return settings.enterpriseSettings;
  }

  // Settings updaters for specific categories
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      userPreferences: { ...currentSettings.userPreferences, ...preferences }
    });
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      systemSettings: { ...currentSettings.systemSettings, ...settings }
    });
  }

  async updateLearningSettings(settings: Partial<LearningSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      learningSettings: { ...currentSettings.learningSettings, ...settings }
    });
  }

  async updateAccessibilitySettings(settings: Partial<AccessibilitySettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      accessibilitySettings: { ...currentSettings.accessibilitySettings, ...settings }
    });
  }

  async updatePerformanceSettings(settings: Partial<PerformanceSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      performanceSettings: { ...currentSettings.performanceSettings, ...settings }
    });
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      notificationSettings: { ...currentSettings.notificationSettings, ...settings }
    });
  }

  async updateThemeSettings(settings: Partial<ThemeSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      themeSettings: { ...currentSettings.themeSettings, ...settings }
    });
  }

  async updatePersonalizationSettings(settings: Partial<PersonalizationSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      personalizationSettings: { ...currentSettings.personalizationSettings, ...settings }
    });
  }

  async updateAIConfiguration(config: Partial<AIConfiguration>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      aiConfiguration: { 
        openai: { ...currentSettings.aiConfiguration.openai, ...config.openai },
        gemini: { ...currentSettings.aiConfiguration.gemini, ...config.gemini },
        personalization: { ...currentSettings.aiConfiguration.personalization, ...config.personalization },
        features: { ...currentSettings.aiConfiguration.features, ...config.features }
      }
    });
  }

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      securitySettings: { ...currentSettings.securitySettings, ...settings }
    });
  }

  async updateAdvancedLearningSettings(settings: Partial<AdvancedLearningSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      advancedLearningSettings: { ...currentSettings.advancedLearningSettings, ...settings }
    });
  }

  async updateEnterpriseSettings(settings: Partial<EnterpriseSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.updateSettings({
      ...currentSettings,
      enterpriseSettings: { ...currentSettings.enterpriseSettings, ...settings }
    });
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
  }

  isValidApiKey(): boolean {
    return !!(this.apiKey || this.geminiApiKey);
  }

  getApiStatus(): { openai: boolean; gemini: boolean } {
    return {
      openai: !!this.apiKey,
      gemini: !!this.geminiApiKey,
    };
  }

  async applyTheme(theme: ThemeSettings): Promise<void> {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(theme.customColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply fonts
    root.style.setProperty('--font-primary', theme.customFonts.primary);
    root.style.setProperty('--font-secondary', theme.customFonts.secondary);
    root.style.setProperty('--font-mono', theme.customFonts.monospace);
    
    // Apply layout
    if (theme.customLayout.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    if (theme.customLayout.roundedCorners) {
      root.classList.add('rounded-corners');
    } else {
      root.classList.remove('rounded-corners');
    }
    
    if (theme.customLayout.shadowsEnabled) {
      root.classList.add('shadows-enabled');
    } else {
      root.classList.remove('shadows-enabled');
    }
    
    if (theme.customLayout.animationsEnabled) {
      root.classList.add('animations-enabled');
    } else {
      root.classList.remove('animations-enabled');
    }
  }

  // Event listeners for system changes
  setupEventListeners(): void {
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', async (e) => {
        const currentSettings = await this.getSettings();
        if (currentSettings.userPreferences.theme === 'system') {
          await this.updateUserPreferences({ theme: e.matches ? 'dark' : 'light' });
        }
      });
    }

    // Listen for network changes
    window.addEventListener('online', () => {
      this.syncSettingsToCache();
    });

    window.addEventListener('offline', () => {
      this.clearCache();
    });
  }

  private async syncSettingsToCache(): Promise<void> {
    try {
      const settings = await this.getSettings();
      this.cache.set('userSettings', {
        data: settings,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to sync settings to cache:', error);
    }
  }
}

// Export singleton instance
export const settingsService = new SettingsService();

// Initialize the service
settingsService.setupEventListeners();