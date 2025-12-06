import { api } from './api';

export interface CollaborationSession {
  id: string;
  title: string;
  description?: string;
  type: CollaborationType;
  hostId: string;
  participants: SessionParticipant[];
  courseId?: string;
  lessonId?: string;
  status: 'waiting' | 'active' | 'paused' | 'ended';
  settings: SessionSettings;
  resources: SessionResource[];
  activities: CollaborationActivity[];
  recordings: SessionRecording[];
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number; // in minutes
  maxParticipants?: number;
  isPublic: boolean;
  requiresApproval: boolean;
  tags: string[];
}

export type CollaborationType = 
  | 'whiteboard' 
  | 'document' 
  | 'presentation' 
  | 'code_sharing' 
  | 'study_session' 
  | 'peer_review' 
  | 'group_project'
  | 'workshop'
  | 'mentoring';

export interface SessionParticipant {
  userId: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'host' | 'moderator' | 'participant' | 'viewer';
    status: 'invited' | 'joined' | 'active' | 'left' | 'banned';
    permissions: ParticipantPermissions;
    joinedAt?: string;
    lastActiveAt?: string;
    contributions: {
      messages: number;
      edits: number;
      uploads: number;
      presentations: number;
    };
  };
}

export interface ParticipantPermissions {
  canEdit: boolean;
  canComment: boolean;
  canUpload: boolean;
  canPresent: boolean;
  canModerate: boolean;
  canInvite: boolean;
  canRecord: boolean;
  canShareScreen: boolean;
  canUseMicrophone: boolean;
  canUseCamera: boolean;
}

export interface SessionSettings {
  allowGuests: boolean;
  requireAuth: boolean;
  autoRecord: boolean;
  saveToCloud: boolean;
  maxFileSize: number; // in bytes
  allowedFileTypes: string[];
  chatEnabled: boolean;
  voiceChatEnabled: boolean;
  screenSharingEnabled: boolean;
  whiteboardEnabled: boolean;
  presentationMode: 'none' | 'host_only' | 'all';
  moderationLevel: 'none' | 'light' | 'strict';
  waitingRoomEnabled: boolean;
  timeLimit?: number; // in minutes
}

export interface SessionResource {
  id: string;
  name: string;
  type: 'document' | 'whiteboard' | 'presentation' | 'file';
  url: string;
  size?: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  isShared: boolean;
  permissions: {
    canView: string[];
    canEdit: string[];
    canDownload: string[];
  };
}

export interface CollaborationActivity {
  id: string;
  type: ActivityType;
  actorId: string;
  actor: {
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  target?: {
    type: string;
    id: string;
    name?: string;
  };
  data: Record<string, any>;
  timestamp: string;
  metadata: {
    sessionId: string;
    duration?: number;
    participants?: number;
  };
}

export type ActivityType = 
  | 'joined'
  | 'left'
  | 'message_posted'
  | 'file_uploaded'
  | 'whiteboard_edit'
  | 'document_edit'
  | 'presentation_started'
  | 'screen_shared'
  | 'permission_changed'
  | 'invitation_sent'
  | 'recording_started'
  | 'recording_stopped'
  | 'session_paused'
  | 'session_resumed'
  | 'kicked'
  | 'banned';

export interface SessionRecording {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  size: number; // in bytes
  quality: 'low' | 'medium' | 'high';
  format: string;
  recordedBy: string;
  recordedAt: string;
  isPublic: boolean;
  accessList: string[];
  transcription?: {
    text: string;
    language: string;
    confidence: number;
  };
  transcript?: Array<{
    timestamp: number;
    speaker: string;
    text: string;
  }>;
}

export interface Whiteboard {
  id: string;
  sessionId: string;
  name: string;
  canvas: WhiteboardCanvas;
  elements: WhiteboardElement[];
  layers: WhiteboardLayer[];
  collaborators: Array<{
    userId: string;
    cursor?: {
      x: number;
      y: number;
      color: string;
    };
    selection?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
  version: number;
  isAutosaved: boolean;
  lastSavedAt?: string;
}

export interface WhiteboardCanvas {
  width: number;
  height: number;
  backgroundColor: string;
  gridEnabled: boolean;
  gridSize: number;
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
}

export interface WhiteboardElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  properties: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
  hidden: boolean;
  groupId?: string;
}

export type ElementType = 
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'freehand'
  | 'image'
  | 'shape'
  | 'connector'
  | 'sticky_note'
  | 'equation'
  | 'code'
  | 'chart'
  | 'table';

export interface WhiteboardLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0-100
  blendMode: string;
  elementIds: string[];
  createdBy: string;
  createdAt: string;
}

export interface SharedDocument {
  id: string;
  sessionId: string;
  title: string;
  content: string;
  type: 'rich_text' | 'markdown' | 'code' | 'spreadsheet';
  language?: string;
  collaborators: Array<{
    userId: string;
    permission: 'view' | 'edit' | 'admin';
    cursor?: {
      line: number;
      column: number;
    };
    selection?: {
      start: number;
      end: number;
    };
  }>;
  version: number;
  versions: Array<{
    version: number;
    content: string;
    author: string;
    timestamp: string;
    changeSummary: string;
  }>;
  comments: DocumentComment[];
  trackedChanges: TrackedChange[];
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentComment {
  id: string;
  content: string;
  authorId: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  position?: {
    line?: number;
    column?: number;
    selection?: {
      start: number;
      end: number;
    };
  };
  replies: DocumentComment[];
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackedChange {
  id: string;
  type: 'insert' | 'delete' | 'format';
  authorId: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
  };
  position: {
    start: number;
    end: number;
  };
  content: string;
  previousContent?: string;
  format?: Record<string, any>;
  timestamp: string;
  accepted: boolean;
  rejected: boolean;
}

export interface ScreenShare {
  id: string;
  sessionId: string;
  sharerId: string;
  sharer: {
    username: string;
    firstName: string;
    lastName: string;
  };
  type: 'screen' | 'window' | 'application';
  title: string;
  isActive: boolean;
  quality: 'low' | 'medium' | 'high' | 'auto';
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  bitrate: number;
  viewers: Array<{
    userId: string;
    joinedAt: string;
    quality?: string;
  }>;
  startedAt: string;
  endedAt?: string;
  duration?: number; // in seconds
  recordings: string[];
}

class CollaborationService {
  private readonly basePath = '/collaboration';
  private readonly websocketPath = '/ws/collaboration';

  // Session Management
  async createSession(session: {
    title: string;
    description?: string;
    type: CollaborationType;
    courseId?: string;
    lessonId?: string;
    maxParticipants?: number;
    isPublic?: boolean;
    requiresApproval?: boolean;
    tags?: string[];
    scheduledStart?: string;
    settings?: Partial<SessionSettings>;
  }): Promise<{
    sessionId: string;
    invitationLink: string;
    accessCode?: string;
    hostUrl: string;
    participantUrl: string;
  }> {
    return api.post(`${this.basePath}/sessions`, session);
  }

  async getSession(sessionId: string): Promise<CollaborationSession> {
    return api.get(`${this.basePath}/sessions/${sessionId}`);
  }

  async joinSession(sessionId: string, params?: {
    accessCode?: string;
    guestName?: string;
    guestEmail?: string;
  }): Promise<{
    session: CollaborationSession;
    participant: SessionParticipant;
    role: 'host' | 'moderator' | 'participant' | 'viewer';
  }> {
    return api.post(`${this.basePath}/sessions/${sessionId}/join`, params);
  }

  async leaveSession(sessionId: string): Promise<void> {
    return api.post(`${this.basePath}/sessions/${sessionId}/leave`);
  }

  async updateSession(sessionId: string, updates: Partial<CollaborationSession>): Promise<CollaborationSession> {
    return api.put(`${this.basePath}/sessions/${sessionId}`, updates);
  }

  async endSession(sessionId: string): Promise<{
    session: CollaborationSession;
    recordings: SessionRecording[];
    summary: {
      totalParticipants: number;
      totalMessages: number;
      totalUploads: number;
      duration: number;
      activitiesCount: number;
    };
  }> {
    return api.post(`${this.basePath}/sessions/${sessionId}/end`);
  }

  async getActiveSessions(params?: {
    type?: CollaborationType;
    courseId?: string;
    hostId?: string;
    limit?: number;
  }): Promise<CollaborationSession[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/sessions/active?${searchParams.toString()}`);
  }

  // Participant Management
  async inviteParticipants(sessionId: string, invitation: {
    userIds?: string[];
    emails?: string[];
    message?: string;
    permissions?: Partial<ParticipantPermissions>;
    role?: 'participant' | 'viewer';
    expiresIn?: number; // in hours
  }): Promise<{
    invitationsSent: number;
    invitations: Array<{
      id: string;
      email?: string;
      status: 'pending' | 'accepted' | 'declined' | 'expired';
      token: string;
    }>;
  }> {
    return api.post(`${this.basePath}/sessions/${sessionId}/invite`, invitation);
  }

  async getParticipants(sessionId: string): Promise<SessionParticipant[]> {
    return api.get(`${this.basePath}/sessions/${sessionId}/participants`);
  }

  async updateParticipantRole(sessionId: string, userId: string, role: 'moderator' | 'participant' | 'viewer'): Promise<SessionParticipant> {
    return api.put(`${this.basePath}/sessions/${sessionId}/participants/${userId}/role`, { role });
  }

  async updateParticipantPermissions(sessionId: string, userId: string, permissions: Partial<ParticipantPermissions>): Promise<SessionParticipant> {
    return api.put(`${this.basePath}/sessions/${sessionId}/participants/${userId}/permissions`, permissions);
  }

  async removeParticipant(sessionId: string, userId: string, reason?: string): Promise<void> {
    return api.delete(`${this.basePath}/sessions/${sessionId}/participants/${userId}`, { reason });
  }

  async banParticipant(sessionId: string, userId: string, duration?: number): Promise<void> {
    return api.post(`${this.basePath}/sessions/${sessionId}/participants/${userId}/ban`, { duration });
  }

  // Whiteboard Management
  async getWhiteboard(sessionId: string): Promise<Whiteboard> {
    return api.get(`${this.basePath}/sessions/${sessionId}/whiteboard`);
  }

  async createWhiteboard(sessionId: string, whiteboard: {
    name: string;
    template?: 'blank' | 'grid' | 'mindmap' | 'flowchart' | 'uml';
    canvas?: Partial<WhiteboardCanvas>;
  }): Promise<Whiteboard> {
    return api.post(`${this.basePath}/sessions/${sessionId}/whiteboard`, whiteboard);
  }

  async updateWhiteboardElement(sessionId: string, elementId: string, updates: Partial<WhiteboardElement>): Promise<WhiteboardElement> {
    return api.put(`${this.basePath}/sessions/${sessionId}/whiteboard/elements/${elementId}`, updates);
  }

  async deleteWhiteboardElement(sessionId: string, elementId: string): Promise<void> {
    return api.delete(`${this.basePath}/sessions/${sessionId}/whiteboard/elements/${elementId}`);
  }

  async addWhiteboardElement(sessionId: string, element: Omit<WhiteboardElement, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<WhiteboardElement> {
    return api.post(`${this.basePath}/sessions/${sessionId}/whiteboard/elements`, element);
  }

  async updateWhiteboardCanvas(sessionId: string, canvas: Partial<WhiteboardCanvas>): Promise<WhiteboardCanvas> {
    return api.put(`${this.basePath}/sessions/${sessionId}/whiteboard/canvas`, canvas);
  }

  async getWhiteboardHistory(sessionId: string, params?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    limit?: number;
  }): Promise<Array<{
    id: string;
    action: string;
    element?: WhiteboardElement;
    user: string;
    timestamp: string;
    reverted: boolean;
  }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/sessions/${sessionId}/whiteboard/history?${searchParams.toString()}`);
  }

  async exportWhiteboard(sessionId: string, format: 'png' | 'pdf' | 'svg' | 'json'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    return api.post(`${this.basePath}/sessions/${sessionId}/whiteboard/export`, { format });
  }

  // Document Collaboration
  async getSharedDocument(sessionId: string, documentId: string): Promise<SharedDocument> {
    return api.get(`${this.basePath}/sessions/${sessionId}/documents/${documentId}`);
  }

  async createSharedDocument(sessionId: string, document: {
    title: string;
    type: 'rich_text' | 'markdown' | 'code' | 'spreadsheet';
    language?: string;
    template?: string;
    content?: string;
  }): Promise<SharedDocument> {
    return api.post(`${this.basePath}/sessions/${sessionId}/documents`, document);
  }

  async updateDocument(sessionId: string, documentId: string, updates: {
    content?: string;
    title?: string;
    changeSummary?: string;
  }): Promise<SharedDocument> {
    return api.put(`${this.basePath}/sessions/${sessionId}/documents/${documentId}`, updates);
  }

  async addDocumentComment(sessionId: string, documentId: string, comment: {
    content: string;
    position?: {
      line?: number;
      column?: number;
      selection?: {
        start: number;
        end: number;
      };
    };
    parentCommentId?: string;
  }): Promise<DocumentComment> {
    return api.post(`${this.basePath}/sessions/${sessionId}/documents/${documentId}/comments`, comment);
  }

  async resolveDocumentComment(sessionId: string, documentId: string, commentId: string): Promise<void> {
    return api.put(`${this.basePath}/sessions/${sessionPath}/documents/${documentId}/comments/${commentId}/resolve`);
  }

  async trackChanges(sessionId: string, documentId: string, enabled: boolean): Promise<void> {
    return api.put(`${this.basePath}/sessions/${sessionId}/documents/${documentId}/track-changes`, { enabled });
  }

  async acceptTrackedChange(sessionId: string, documentId: string, changeId: string): Promise<void> {
    return api.post(`${this.basePath}/sessions/${sessionId}/documents/${documentId}/changes/${changeId}/accept`);
  }

  async rejectTrackedChange(sessionId: string, documentId: string, changeId: string): Promise<void> {
    return api.post(`${this.basePath}/sessions/${sessionId}/documents/${documentId}/changes/${changeId}/reject`);
  }

  async exportDocument(sessionId: string, documentId: string, format: 'pdf' | 'docx' | 'html' | 'markdown'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    return api.post(`${this.basePath}/sessions/${sessionId}/documents/${documentId}/export`, { format });
  }

  // Screen Sharing
  async startScreenShare(sessionId: string, share: {
    type: 'screen' | 'window' | 'application';
    title: string;
    quality?: 'low' | 'medium' | 'high' | 'auto';
  }): Promise<ScreenShare> {
    return api.post(`${this.basePath}/sessions/${sessionId}/screen-share`, share);
  }

  async stopScreenShare(sessionId: string, shareId: string): Promise<void> {
    return api.post(`${this.basePath}/sessions/${sessionId}/screen-share/${shareId}/stop`);
  }

  async getActiveScreenShare(sessionId: string): Promise<ScreenShare | null> {
    try {
      return await api.get(`${this.basePath}/sessions/${sessionId}/screen-share/active`);
    } catch (error) {
      return null;
    }
  }

  // Recording and Playback
  async startRecording(sessionId: string, recording: {
    title?: string;
    quality?: 'low' | 'medium' | 'high';
    includeAudio?: boolean;
    includeScreen?: boolean;
    includeChat?: boolean;
  }): Promise<SessionRecording> {
    return api.post(`${this.basePath}/sessions/${sessionId}/recordings`, recording);
  }

  async stopRecording(sessionId: string, recordingId: string): Promise<SessionRecording> {
    return api.post(`${this.basePath}/sessions/${sessionId}/recordings/${recordingId}/stop`);
  }

  async getRecordings(sessionId: string): Promise<SessionRecording[]> {
    return api.get(`${this.basePath}/sessions/${sessionId}/recordings`);
  }

  async getRecording(recordingId: string): Promise<SessionRecording> {
    return api.get(`${this.basePath}/recordings/${recordingId}`);
  }

  async deleteRecording(recordingId: string): Promise<void> {
    return api.delete(`${this.basePath}/recordings/${recordingId}`);
  }

  async shareRecording(recordingId: string, share: {
    userIds?: string[];
    emails?: string[];
    isPublic?: boolean;
    expiresAt?: string;
  }): Promise<{ shareLink: string }> {
    return api.post(`${this.basePath}/recordings/${recordingId}/share`, share);
  }

  // Real-time Features (WebSocket)
  async connectToSession(sessionId: string): Promise<{
    connectionId: string;
    websocketUrl: string;
    token: string;
  }> {
    return api.get(`${this.basePath}/sessions/${sessionId}/connect`);
  }

  async sendSessionMessage(sessionId: string, message: {
    type: 'chat' | 'system' | 'notification';
    content: string;
    recipientId?: string;
    metadata?: Record<string, any>;
  }): Promise<{ messageId: string }> {
    return api.post(`${this.basePath}/sessions/${sessionId}/messages`, message);
  }

  async getSessionMessages(sessionId: string, params?: {
    since?: string;
    limit?: number;
    type?: string;
  }): Promise<Array<{
    id: string;
    type: string;
    content: string;
    author: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
    };
    timestamp: string;
    metadata?: Record<string, any>;
  }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`${this.basePath}/sessions/${sessionId}/messages?${searchParams.toString()}`);
  }

  // File Sharing
  async uploadSessionFile(sessionId: string, file: File, metadata?: {
    description?: string;
    isShared?: boolean;
    allowedUsers?: string[];
  }): Promise<SessionResource> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    
    return api.post(`${this.basePath}/sessions/${sessionId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async getSessionFiles(sessionId: string): Promise<SessionResource[]> {
    return api.get(`${this.basePath}/sessions/${sessionId}/files`);
  }

  async deleteSessionFile(sessionId: string, fileId: string): Promise<void> {
    return api.delete(`${this.basePath}/sessions/${sessionId}/files/${fileId}`);
  }

  // Analytics and Reporting
  async getSessionAnalytics(sessionId: string): Promise<{
    summary: {
      totalParticipants: number;
      averageDuration: number; // in minutes
      peakConcurrentUsers: number;
      totalMessages: number;
      totalFiles: number;
      totalEdits: number;
    };
    participantStats: Array<{
      userId: string;
      name: string;
      joinTime: string;
      leaveTime?: string;
      totalTime: number; // in minutes
      messages: number;
      uploads: number;
      edits: number;
      contributions: number;
    }>;
    activityTimeline: Array<{
      timestamp: string;
      activity: string;
      participantCount: number;
    }>;
    engagement: {
      averageAttentionTime: number; // in minutes
      interactionRate: number; // 0-100
      participationRate: number; // 0-100
    };
    technical: {
      averageLatency: number; // in milliseconds
      connectionIssues: number;
      screenShareQuality: string;
      recordingSuccessRate: number; // 0-100
    };
  }> {
    return api.get(`${this.basePath}/sessions/${sessionId}/analytics`);
  }

  async generateSessionReport(sessionId: string, options: {
    includeParticipants?: boolean;
    includeActivities?: boolean;
    includeRecordings?: boolean;
    format: 'pdf' | 'json' | 'csv';
  }): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    return api.post(`${this.basePath}/sessions/${sessionId}/report`, options);
  }

  // Templates and Presets
  async getSessionTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    type: CollaborationType;
    settings: SessionSettings;
    defaultResources: string[];
    activities: string[];
    thumbnail?: string;
    isPublic: boolean;
    usageCount: number;
  }>> {
    return api.get(`${this.basePath}/templates`);
  }

  async createSessionTemplate(template: {
    name: string;
    description: string;
    type: CollaborationType;
    settings: SessionSettings;
    defaultResources?: string[];
    activities?: string[];
    isPublic?: boolean;
  }): Promise<{
    templateId: string;
  }> {
    return api.post(`${this.basePath}/templates`, template);
  }
}

export const collaborationService = new CollaborationService();