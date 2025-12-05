import { api } from './api';

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'student' | 'instructor' | 'admin';
    reputation: number;
  };
  category: DiscussionCategory;
  tags: string[];
  courseId?: string;
  lessonId?: string;
  isPinned: boolean;
  isLocked: boolean;
  isSolved: boolean;
  isPoll: boolean;
  poll?: Poll;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  replies: number;
  lastActivityAt: string;
  lastReply?: {
    author: string;
    content: string;
    createdAt: string;
  };
  status: 'active' | 'inactive' | 'archived';
  moderation: {
    isReported: boolean;
    reportCount: number;
    isHidden: boolean;
    hiddenBy?: string;
    hiddenReason?: string;
  };
}

export interface DiscussionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isDefault: boolean;
  permissions: {
    canCreate: string[];
    canModerate: string[];
  };
  courseId?: string;
  sortOrder: number;
  postCount: number;
  lastActivity: string;
}

export interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'student' | 'instructor' | 'admin';
    reputation: number;
  };
  discussionId: string;
  parentReplyId?: string;
  isBestAnswer: boolean;
  isInstructorAnswer: boolean;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  replies?: Reply[];
  status: 'active' | 'hidden' | 'deleted';
  moderation: {
    isReported: boolean;
    reportCount: number;
    isHidden: boolean;
    hiddenBy?: string;
    hiddenReason?: string;
  };
}

export interface Poll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    voteCount: number;
    voters: string[];
  }>;
  allowMultiple: boolean;
  allowComments: boolean;
  anonymous: boolean;
  deadline?: string;
  totalVotes: number;
  voters: string[];
  isActive: boolean;
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  category: string;
  privacy: 'public' | 'private' | 'invite-only';
  ownerId: string;
  courseId?: string;
  memberCount: number;
  maxMembers?: number;
  members: StudyGroupMember[];
  tags: string[];
  location?: string;
  isOnline: boolean;
  meetingSchedule?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek?: number;
    time: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  settings: {
    allowMemberPosts: boolean;
    requireApproval: boolean;
    allowFileSharing: boolean;
    allowVoiceChat: boolean;
    allowScreenSharing: boolean;
  };
}

export interface StudyGroupMember {
  userId: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  role: 'owner' | 'moderator' | 'member';
  joinedAt: string;
  lastActiveAt: string;
  contribution: {
    posts: number;
    replies: number;
    helpfulVotes: number;
    eventsAttended: number;
  };
  status: 'active' | 'inactive' | 'banned';
}

export interface StudySession {
  id: string;
  title: string;
  description: string;
  type: 'focus' | 'discussion' | 'review' | 'presentation';
  studyGroupId: string;
  organizerId: string;
  participants: SessionParticipant[];
  maxParticipants?: number;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  tags: string[];
  materials: string[];
  agenda: Array<{
    item: string;
    duration?: number;
    presenter?: string;
  }>;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  recordings?: string[];
  attendance: Array<{
    userId: string;
    joinedAt: string;
    leftAt?: string;
    duration?: number;
  }>;
  createdAt: string;
}

export interface SessionParticipant {
  userId: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  role: 'organizer' | 'moderator' | 'participant';
  status: 'confirmed' | 'pending' | 'declined';
  joinedAt?: string;
  contribution?: {
    timeSpent: number;
    messages: number;
    presentations: number;
  };
}

export interface MentorRelationship {
  id: string;
  mentorId: string;
  menteeId: string;
  mentor: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    expertise: string[];
    experience: number;
    rating: number;
  };
  mentee: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  goals: string[];
  sessionsCompleted: number;
  totalSessions: number;
  rating?: number;
  feedback?: string;
}

export interface PeerReview {
  id: string;
  reviewerId: string;
  revieweeId: string;
  submissionId: string;
  submissionType: 'assignment' | 'project' | 'presentation';
  courseId: string;
  assignmentId?: string;
  review: {
    overallRating: number; // 1-5
    strengths: string[];
    improvements: string[];
    specificFeedback: Record<string, any>;
    rubricScores: Record<string, number>;
  };
  anonymous: boolean;
  isPublic: boolean;
  status: 'pending' | 'submitted' | 'reviewed';
  createdAt: string;
  updatedAt: string;
  helpfulVotes: number;
  responses: PeerReviewResponse[];
}

export interface PeerReviewResponse {
  id: string;
  content: string;
  author: string;
  isInstructor: boolean;
  createdAt: string;
  likes: number;
}

class CommunityService {
  private readonly basePath = '/community';

  // Discussions
  async getDiscussions(params?: {
    categoryId?: string;
    courseId?: string;
    search?: string;
    tags?: string[];
    sortBy?: 'recent' | 'popular' | 'unanswered' | 'solved';
    status?: 'active' | 'inactive' | 'archived';
    page?: number;
    limit?: number;
  }): Promise<{
    discussions: Discussion[];
    total: number;
    categories: DiscussionCategory[];
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return api.get(`${this.basePath}/discussions?${searchParams.toString()}`);
  }

  async getDiscussion(discussionId: string): Promise<Discussion> {
    return api.get(`${this.basePath}/discussions/${discussionId}`);
  }

  async createDiscussion(discussion: {
    title: string;
    content: string;
    categoryId: string;
    tags?: string[];
    courseId?: string;
    lessonId?: string;
    isPoll?: boolean;
    poll?: Poll;
    attachments?: string[];
  }): Promise<Discussion> {
    return api.post(`${this.basePath}/discussions`, discussion);
  }

  async updateDiscussion(discussionId: string, updates: {
    title?: string;
    content?: string;
    tags?: string[];
    isPinned?: boolean;
    isLocked?: boolean;
    isSolved?: boolean;
  }): Promise<Discussion> {
    return api.put(`${this.basePath}/discussions/${discussionId}`, updates);
  }

  async deleteDiscussion(discussionId: string): Promise<void> {
    return api.delete(`${this.basePath}/discussions/${discussionId}`);
  }

  // Replies
  async getReplies(discussionId: string, params?: {
    sortBy?: 'recent' | 'oldest' | 'best' | 'instructor';
    page?: number;
    limit?: number;
  }): Promise<{
    replies: Reply[];
    total: number;
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
    
    return api.get(`${this.basePath}/discussions/${discussionId}/replies?${searchParams.toString()}`);
  }

  async createReply(discussionId: string, reply: {
    content: string;
    parentReplyId?: string;
    attachments?: string[];
  }): Promise<Reply> {
    return api.post(`${this.basePath}/discussions/${discussionId}/replies`, reply);
  }

  async updateReply(replyId: string, updates: {
    content?: string;
    isBestAnswer?: boolean;
    isInstructorAnswer?: boolean;
  }): Promise<Reply> {
    return api.put(`${this.basePath}/replies/${replyId}`, updates);
  }

  async deleteReply(replyId: string): Promise<void> {
    return api.delete(`${this.basePath}/replies/${replyId}`);
  }

  // Reactions and Voting
  async likeDiscussion(discussionId: string): Promise<void> {
    return api.post(`${this.basePath}/discussions/${discussionId}/like`);
  }

  async unlikeDiscussion(discussionId: string): Promise<void> {
    return api.delete(`${this.basePath}/discussions/${discussionId}/like`);
  }

  async voteReply(replyId: string, vote: 'like' | 'dislike'): Promise<void> {
    return api.post(`${this.basePath}/replies/${replyId}/vote`, { vote });
  }

  async unvoteReply(replyId: string): Promise<void> {
    return api.delete(`${this.basePath}/replies/${replyId}/vote`);
  }

  // Poll Management
  async votePoll(pollId: string, optionIds: string[]): Promise<void> {
    return api.post(`${this.basePath}/polls/${pollId}/vote`, { optionIds });
  }

  async createPoll(discussionId: string, poll: {
    question: string;
    options: string[];
    allowMultiple: boolean;
    anonymous: boolean;
    deadline?: string;
  }): Promise<Poll> {
    return api.post(`${this.basePath}/discussions/${discussionId}/poll`, poll);
  }

  // Categories
  async getCategories(params?: {
    courseId?: string;
    includeCounts?: boolean;
  }): Promise<DiscussionCategory[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/categories?${searchParams.toString()}`);
  }

  async createCategory(category: {
    name: string;
    description: string;
    icon: string;
    color: string;
    courseId?: string;
    permissions: {
      canCreate: string[];
      canModerate: string[];
    };
  }): Promise<DiscussionCategory> {
    return api.post(`${this.basePath}/categories`, category);
  }

  // Study Groups
  async getStudyGroups(params?: {
    category?: string;
    privacy?: string;
    courseId?: string;
    search?: string;
    tags?: string[];
    sortBy?: 'recent' | 'popular' | 'active' | 'member-count';
    page?: number;
    limit?: number;
  }): Promise<{
    groups: StudyGroup[];
    total: number;
    myGroups: StudyGroup[];
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return api.get(`${this.basePath}/study-groups?${searchParams.toString()}`);
  }

  async createStudyGroup(group: {
    name: string;
    description: string;
    category: string;
    privacy: 'public' | 'private' | 'invite-only';
    courseId?: string;
    maxMembers?: number;
    tags?: string[];
    location?: string;
    isOnline: boolean;
    meetingSchedule?: StudyGroup['meetingSchedule'];
    settings?: StudyGroup['settings'];
  }): Promise<StudyGroup> {
    return api.post(`${this.basePath}/study-groups`, group);
  }

  async joinStudyGroup(groupId: string): Promise<void> {
    return api.post(`${this.basePath}/study-groups/${groupId}/join`);
  }

  async leaveStudyGroup(groupId: string): Promise<void> {
    return api.delete(`${this.basePath}/study-groups/${groupId}/join`);
  }

  async inviteToStudyGroup(groupId: string, userIds: string[]): Promise<void> {
    return api.post(`${this.basePath}/study-groups/${groupId}/invite`, { userIds });
  }

  async updateStudyGroup(groupId: string, updates: Partial<StudyGroup>): Promise<StudyGroup> {
    return api.put(`${this.basePath}/study-groups/${groupId}`, updates);
  }

  async deleteStudyGroup(groupId: string): Promise<void> {
    return api.delete(`${this.basePath}/study-groups/${groupId}`);
  }

  // Study Sessions
  async getStudySessions(groupId: string, params?: {
    status?: 'upcoming' | 'active' | 'completed';
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    sessions: StudySession[];
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/study-groups/${groupId}/sessions?${searchParams.toString()}`);
  }

  async createStudySession(groupId: string, session: {
    title: string;
    description: string;
    type: StudySession['type'];
    startTime: string;
    duration?: number;
    maxParticipants?: number;
    location?: string;
    isOnline: boolean;
    meetingUrl?: string;
    tags?: string[];
    materials?: string[];
    agenda?: StudySession['agenda'];
  }): Promise<StudySession> {
    return api.post(`${this.basePath}/study-groups/${groupId}/sessions`, session);
  }

  async joinStudySession(sessionId: string): Promise<void> {
    return api.post(`${this.basePath}/sessions/${sessionId}/join`);
  }

  async leaveStudySession(sessionId: string): Promise<void> {
    return api.delete(`${this.basePath}/sessions/${sessionId}/join`);
  }

  async endStudySession(sessionId: string): Promise<void> {
    return api.post(`${this.basePath}/sessions/${sessionId}/end`);
  }

  // Mentorship
  async findMentors(params?: {
    expertise?: string[];
    experience?: number;
    rating?: number;
    availability?: string;
  }): Promise<{
    mentors: Array<{
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      avatar?: string;
      expertise: string[];
      experience: number;
      rating: number;
      totalMentees: number;
      availability: string[];
      bio?: string;
    }>;
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return api.get(`${this.basePath}/mentorship/mentors?${searchParams.toString()}`);
  }

  async requestMentorship(mentorId: string, request: {
    goals: string[];
    preferredSchedule?: string;
    duration?: number; // in weeks
    message?: string;
  }): Promise<{ requestId: string }> {
    return api.post(`${this.basePath}/mentorship/request`, {
      mentorId,
      ...request
    });
  }

  async getMentorshipRequests(): Promise<Array<{
    id: string;
    mentorId: string;
    menteeId: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    goals: string[];
    message?: string;
    createdAt: string;
    mentor?: {
      username: string;
      firstName: string;
      lastName: string;
    };
    mentee?: {
      username: string;
      firstName: string;
      lastName: string;
    };
  }>> {
    return api.get(`${this.basePath}/mentorship/requests`);
  }

  async respondToMentorshipRequest(requestId: string, response: 'accept' | 'decline', message?: string): Promise<void> {
    return api.post(`${this.basePath}/mentorship/requests/${requestId}/respond`, {
      response,
      message
    });
  }

  async getMentorshipRelationship(relationshipId: string): Promise<MentorRelationship> {
    return api.get(`${this.basePath}/mentorship/relationships/${relationshipId}`);
  }

  async updateMentorshipProgress(relationshipId: string, progress: {
    sessionCompleted?: boolean;
    goals?: string[];
    rating?: number;
    feedback?: string;
  }): Promise<MentorRelationship> {
    return api.put(`${this.basePath}/mentorship/relationships/${relationshipId}/progress`, progress);
  }

  // Peer Reviews
  async requestPeerReview(params: {
    submissionId: string;
    submissionType: PeerReview['submissionType'];
    courseId: string;
    assignmentId?: string;
    requiredReviews: number;
    reviewers?: string[];
    criteria?: Record<string, string>;
    anonymous: boolean;
    deadline?: string;
  }): Promise<{ requestId: string }> {
    return api.post(`${this.basePath}/peer-review/request`, params);
  }

  async getPeerReviewRequests(): Promise<Array<{
    id: string;
    requester: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
    };
    submission: {
      id: string;
      type: string;
      title: string;
    };
    requiredReviews: number;
    receivedReviews: number;
    status: 'pending' | 'completed' | 'expired';
    deadline: string;
    criteria: Record<string, string>;
  }>> {
    return api.get(`${this.basePath}/peer-review/requests`);
  }

  async submitPeerReview(params: {
    requestId: string;
    review: PeerReview['review'];
    anonymous: boolean;
  }): Promise<PeerReview> {
    return api.post(`${this.basePath}/peer-review/submit`, params);
  }

  async getPeerReviews(submissionId: string): Promise<PeerReview[]> {
    return api.get(`${this.basePath}/peer-review/${submissionId}/reviews`);
  }

  async ratePeerReview(reviewId: string, rating: number): Promise<void> {
    return api.post(`${this.basePath}/peer-review/${reviewId}/rate`, { rating });
  }

  // Notifications and Moderation
  async reportContent(params: {
    contentType: 'discussion' | 'reply' | 'studyGroup' | 'studySession';
    contentId: string;
    reason: string;
    description?: string;
    evidence?: string[];
  }): Promise<void> {
    return api.post(`${this.basePath}/moderation/report`, params);
  }

  async getModerationQueue(): Promise<Array<{
    id: string;
    contentType: string;
    contentId: string;
    reason: string;
    reporter: string;
    createdAt: string;
    status: 'pending' | 'resolved' | 'dismissed';
  }>> {
    return api.get(`${this.basePath}/moderation/queue`);
  }

  async moderateContent(contentId: string, action: 'approve' | 'reject' | 'hide', reason?: string): Promise<void> {
    return api.post(`${this.basePath}/moderation/moderate`, {
      contentId,
      action,
      reason
    });
  }

  // Analytics and Reports
  async getCommunityAnalytics(params?: {
    timeRange?: string;
    groupBy?: 'day' | 'week' | 'month';
    includeDemographics?: boolean;
  }): Promise<{
    activity: {
      discussions: number;
      replies: number;
      studyGroups: number;
      studySessions: number;
      mentorshipRequests: number;
      peerReviews: number;
    };
    engagement: {
      averageResponseTime: number;
      resolutionRate: number;
      satisfactionScore: number;
      activeUsers: number;
    };
    growth: {
      newMembers: number;
      retentionRate: number;
      participationRate: number;
    };
    popular: {
      categories: Array<{
        name: string;
        postCount: number;
      }>;
      studyGroups: Array<{
        name: string;
        memberCount: number;
      }>;
      tags: Array<{
        tag: string;
        usageCount: number;
      }>;
    };
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
}

export const communityService = new CommunityService();