import { api } from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  price: number;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  modules: CourseModule[];
  enrollments: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  isCompleted?: boolean;
  progress?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'assignment';
  content: string;
  duration: number; // in minutes
  order: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  resources?: Resource[];
  assignments?: Assignment[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'download' | 'code';
  url: string;
  size?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: string;
  maxScore: number;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  content: string;
  attachments: string[];
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  isPublished?: boolean;
}

class CourseService {
  private readonly basePath = '/courses';

  // Course Management
  async getCourses(filters?: {
    category?: string;
    level?: string;
    price?: 'free' | 'paid';
    rating?: number;
    sortBy?: 'popularity' | 'rating' | 'newest' | 'price';
  }): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}?${params.toString()}`);
  }

  async getCourse(courseId: string): Promise<Course> {
    return api.get(`${this.basePath}/${courseId}`);
  }

  async createCourse(courseData: CreateCourseData): Promise<Course> {
    return api.post(this.basePath, courseData);
  }

  async updateCourse(courseId: string, updateData: UpdateCourseData): Promise<Course> {
    return api.put(`${this.basePath}/${courseId}`, updateData);
  }

  async deleteCourse(courseId: string): Promise<void> {
    return api.delete(`${this.basePath}/${courseId}`);
  }

  async publishCourse(courseId: string): Promise<Course> {
    return api.put(`${this.basePath}/${courseId}/publish`);
  }

  async unpublishCourse(courseId: string): Promise<Course> {
    return api.put(`${this.basePath}/${coursePath}/unpublish`);
  }

  // Course Content Management
  async addModule(courseId: string, moduleData: Omit<CourseModule, 'id'>): Promise<CourseModule> {
    return api.post(`${this.basePath}/${courseId}/modules`, moduleData);
  }

  async updateModule(courseId: string, moduleId: string, moduleData: Partial<CourseModule>): Promise<CourseModule> {
    return api.put(`${this.basePath}/${courseId}/modules/${moduleId}`, moduleData);
  }

  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    return api.delete(`${this.basePath}/${courseId}/modules/${moduleId}`);
  }

  async addLesson(courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id'>): Promise<Lesson> {
    return api.post(`${this.basePath}/${courseId}/modules/${moduleId}/lessons`, lessonData);
  }

  async updateLesson(courseId: string, moduleId: string, lessonId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
    return api.put(`${this.basePath}/${courseId}/modules/${moduleId}/lessons/${lessonId}`, lessonData);
  }

  async deleteLesson(courseId: string, moduleId: string, lessonId: string): Promise<void> {
    return api.delete(`${this.basePath}/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  }

  // Enrollment Management
  async enrollInCourse(courseId: string): Promise<void> {
    return api.post(`${this.basePath}/${courseId}/enroll`);
  }

  async unenrollFromCourse(courseId: string): Promise<void> {
    return api.delete(`${this.basePath}/${courseId}/enroll`);
  }

  async getEnrolledCourses(): Promise<Course[]> {
    return api.get('/enrolled-courses');
  }

  async getCourseProgress(courseId: string): Promise<{
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
    timeSpent: number;
    lastAccessedAt: string;
  }> {
    return api.get(`${this.basePath}/${courseId}/progress`);
  }

  // Lesson Completion
  async markLessonComplete(courseId: string, moduleId: string, lessonId: string): Promise<void> {
    return api.post(`${this.basePath}/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`);
  }

  async markLessonIncomplete(courseId: string, moduleId: string, lessonId: string): Promise<void> {
    return api.delete(`${this.basePath}/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`);
  }

  // Search and Discovery
  async searchCourses(query: string, filters?: {
    category?: string;
    level?: string;
    duration?: number;
  }): Promise<Course[]> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    return api.get(`/search/courses?${params.toString()}`);
  }

  async getPopularCourses(category?: string): Promise<Course[]> {
    const params = category ? `?category=${category}` : '';
    return api.get(`${this.basePath}/popular${params}`);
  }

  async getRecommendedCourses(): Promise<Course[]> {
    return api.get(`${this.basePath}/recommended`);
  }

  // Reviews and Ratings
  async rateCourse(courseId: string, rating: number, review?: string): Promise<void> {
    return api.post(`${this.basePath}/${courseId}/reviews`, { rating, review });
  }

  async getCourseReviews(courseId: string, page = 1, limit = 10): Promise<{
    reviews: Array<{
      id: string;
      studentId: string;
      studentName: string;
      studentAvatar?: string;
      rating: number;
      review?: string;
      createdAt: string;
    }>;
    totalReviews: number;
    averageRating: number;
  }> {
    return api.get(`${this.basePath}/${courseId}/reviews?page=${page}&limit=${limit}`);
  }

  // Assignments
  async getAssignments(courseId: string): Promise<Assignment[]> {
    return api.get(`${this.basePath}/${courseId}/assignments`);
  }

  async createAssignment(courseId: string, assignmentData: Omit<Assignment, 'id' | 'submissions'>): Promise<Assignment> {
    return api.post(`${this.basePath}/${courseId}/assignments`, assignmentData);
  }

  async submitAssignment(courseId: string, assignmentId: string, submission: {
    content: string;
    attachments: string[];
  }): Promise<AssignmentSubmission> {
    return api.post(`${this.basePath}/${courseId}/assignments/${assignmentId}/submissions`, submission);
  }

  async gradeAssignment(courseId: string, assignmentId: string, submissionId: string, grade: {
    score: number;
    feedback: string;
  }): Promise<AssignmentSubmission> {
    return api.put(`${this.basePath}/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/grade`, grade);
  }

  // Analytics
  async getCourseAnalytics(courseId: string): Promise<{
    totalEnrollments: number;
    completionRate: number;
    averageRating: number;
    totalRevenue: number;
    engagementMetrics: {
      dailyActiveUsers: number[];
      lessonCompletionRates: number[];
      averageTimeSpent: number;
    };
    demographics: {
      byLevel: Record<string, number>;
      byCategory: Record<string, number>;
    };
  }> {
    return api.get(`${this.basePath}/${courseId}/analytics`);
  }

  async getInstructorAnalytics(): Promise<{
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    averageRating: number;
    coursesPerformance: Array<{
      courseId: string;
      courseTitle: string;
      enrollments: number;
      completionRate: number;
      revenue: number;
      rating: number;
    }>;
  }> {
    return api.get('/instructor/analytics');
  }
}

export const courseService = new CourseService();