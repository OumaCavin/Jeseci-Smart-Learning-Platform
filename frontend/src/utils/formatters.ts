// Format utility functions for displaying various data types

export const formatNumber = (
  num: number,
  options: {
    decimals?: number;
    thousands?: string;
    decimal?: string;
    compact?: boolean;
  } = {}
): string => {
  const { decimals = 0, thousands = ',', decimal = '.', compact = false } = options;
  
  if (compact) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true
  });
};

export const formatPercentage = (value: number, total: number, decimals: number = 1): string => {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(decimals) + '%';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatScore = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return `${score}/${maxScore} (A)`;
  if (percentage >= 80) return `${score}/${maxScore} (B)`;
  if (percentage >= 70) return `${score}/${maxScore} (C)`;
  if (percentage >= 60) return `${score}/${maxScore} (D)`;
  return `${score}/${maxScore} (F)`;
};

export const formatDifficulty = (difficulty: 1 | 2 | 3 | 4 | 5): string => {
  const levels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
  return levels[difficulty - 1];
};

export const formatReadingTime = (text: string): string => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatCountdown = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(price);
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
};

export const formatGrade = (percentage: number): string => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

export const formatProgress = (current: number, total: number): string => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  return `${current}/${total} (${percentage}%)`;
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatCodeLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'cs': 'C#',
    'php': 'PHP',
    'rb': 'Ruby',
    'go': 'Go',
    'rs': 'Rust',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'sql': 'SQL',
    'html': 'HTML',
    'css': 'CSS',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'md': 'Markdown'
  };
  
  return languageMap[language.toLowerCase()] || language.toUpperCase();
};

export const formatCase = (text: string, caseType: 'title' | 'camel' | 'snake' | 'kebab'): string => {
  switch (caseType) {
    case 'title':
      return text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    
    case 'camel':
      return text.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
                 .replace(/^[a-z]/, (letter) => letter.toLowerCase());
    
    case 'snake':
      return text.replace(/([a-z])([A-Z])/g, '$1_$2')
                 .replace(/[-\s]+/g, '_')
                 .toLowerCase();
    
    case 'kebab':
      return text.replace(/([a-z])([A-Z])/g, '$1-$2')
                 .replace(/[_\s]+/g, '-')
                 .toLowerCase();
    
    default:
      return text;
  }
};

export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};