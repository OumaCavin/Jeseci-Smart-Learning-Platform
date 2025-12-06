import { api } from './api';

export interface FileMetadata {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number; // in bytes
  checksum: string;
  path: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  description?: string;
  tags: string[];
  folderId?: string;
  ownerId: string;
  uploadedAt: string;
  updatedAt: string;
  isPublic: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  downloadCount: number;
  lastAccessedAt?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number; // for videos/audio
    pages?: number; // for PDFs
    resolution?: string;
    bitrate?: number;
    format?: string;
    colorSpace?: string;
    [key: string]: any;
  };
  permissions: FilePermissions;
  sharing: FileSharing;
}

export interface FilePermissions {
  owner: string;
  viewers: string[];
  editors: string[];
  public: boolean;
  domain?: string; // for organization-wide sharing
  expiryDate?: string;
}

export interface FileSharing {
  isShared: boolean;
  sharedWith: Array<{
    userId: string;
    permission: 'view' | 'edit' | 'download';
    sharedAt: string;
    expiresAt?: string;
  }>;
  shareUrl?: {
    url: string;
    token: string;
    expiresAt?: string;
    password?: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  path: string;
  ownerId: string;
  isPublic: boolean;
  permissions: {
    viewers: string[];
    editors: string[];
  };
  createdAt: string;
  updatedAt: string;
  childrenCount: number;
  filesCount: number;
}

export interface UploadProgress {
  id: string;
  filename: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  speed?: number; // bytes per second
  remainingTime?: number; // in seconds
}

export interface UploadOptions {
  folderId?: string;
  isPublic?: boolean;
  tags?: string[];
  description?: string;
  alt?: string;
  generateThumbnail?: boolean;
  compressImages?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-100 for image compression
}

export interface StorageStats {
  used: number; // in bytes
  limit: number; // in bytes
  percentage: number; // 0-100
  breakdown: {
    documents: number;
    images: number;
    videos: number;
    audio: number;
    other: number;
  };
  filesCount: number;
  foldersCount: number;
}

export interface FileSearchParams {
  query?: string;
  mimetype?: string;
  tags?: string[];
  folderId?: string;
  ownerId?: string;
  dateFrom?: string;
  dateTo?: string;
  sizeMin?: number;
  sizeMax?: number;
  isPublic?: boolean;
  sortBy?: 'name' | 'size' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

class FileService {
  private readonly basePath = '/files';

  // File Upload
  async uploadFile(file: File, options: UploadOptions = {}): Promise<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));
    
    return api.post(`${this.basePath}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async uploadMultiple(files: File[], options: UploadOptions = {}): Promise<{
    successful: FileMetadata[];
    failed: Array<{ file: File; error: string }>;
    progress: UploadProgress[];
  }> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('options', JSON.stringify(options));
    
    return api.post(`${this.basePath}/upload-multiple`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async getUploadProgress(uploadId: string): Promise<UploadProgress> {
    return api.get(`${this.basePath}/upload/${uploadId}/progress`);
  }

  async cancelUpload(uploadId: string): Promise<void> {
    return api.delete(`${this.basePath}/upload/${uploadId}`);
  }

  // File Management
  async getFile(fileId: string): Promise<FileMetadata> {
    return api.get(`${this.basePath}/${fileId}`);
  }

  async updateFile(fileId: string, updates: {
    name?: string;
    description?: string;
    alt?: string;
    tags?: string[];
    folderId?: string;
    isPublic?: boolean;
  }): Promise<FileMetadata> {
    return api.put(`${this.basePath}/${fileId}`, updates);
  }

  async deleteFile(fileId: string, permanent = false): Promise<void> {
    if (permanent) {
      return api.delete(`${this.basePath}/${fileId}/permanent`);
    } else {
      return api.delete(`${this.basePath}/${fileId}`);
    }
  }

  async restoreFile(fileId: string): Promise<FileMetadata> {
    return api.post(`${this.basePath}/${fileId}/restore`);
  }

  async downloadFile(fileId: string, asAttachment = true): Promise<Blob> {
    const params = asAttachment ? '?download=true' : '';
    return api.get(`${this.basePath}/${fileId}/download${params}`, { responseType: 'blob' });
  }

  async getFileUrl(fileId: string, expiresIn?: number): Promise<{
    url: string;
    expiresAt?: string;
    downloadUrl: string;
  }> {
    const params = expiresIn ? `?expiresIn=${expiresIn}` : '';
    return api.get(`${this.basePath}/${fileId}/url${params}`);
  }

  async generateThumbnail(fileId: string, options?: {
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'webp';
    quality?: number;
  }): Promise<string> {
    return api.post(`${this.basePath}/${fileId}/thumbnail`, options);
  }

  // File Sharing
  async shareFile(fileId: string, sharing: {
    users?: Array<{ userId: string; permission: 'view' | 'edit' | 'download' }>;
    public?: boolean;
    expiresAt?: string;
    password?: string;
  }): Promise<FileSharing> {
    return api.post(`${this.basePath}/${fileId}/share`, sharing);
  }

  async updateSharing(fileId: string, sharing: Partial<FileSharing>): Promise<FileSharing> {
    return api.put(`${this.basePath}/${fileId}/share`, sharing);
  }

  async unshareFile(fileId: string): Promise<void> {
    return api.delete(`${this.basePath}/${fileId}/share`);
  }

  async createShareLink(fileId: string, options?: {
    expiresAt?: string;
    password?: string;
    allowDownload?: boolean;
  }): Promise<{ url: string; token: string }> {
    return api.post(`${this.basePath}/${fileId}/share-link`, options);
  }

  async revokeShareLink(fileId: string, token: string): Promise<void> {
    return api.delete(`${this.basePath}/${fileId}/share-link/${token}`);
  }

  // File Search and Listing
  async searchFiles(params: FileSearchParams): Promise<{
    files: FileMetadata[];
    folders: Folder[];
    total: number;
    hasMore: boolean;
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    return api.get(`${this.basePath}/search?${searchParams.toString()}`);
  }

  async getFiles(params?: {
    folderId?: string;
    isPublic?: boolean;
    ownerId?: string;
    mimetype?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    files: FileMetadata[];
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
    
    return api.get(`${this.basePath}?${searchParams.toString()}`);
  }

  async getRecentFiles(limit = 10): Promise<FileMetadata[]> {
    return api.get(`${this.basePath}/recent?limit=${limit}`);
  }

  async getSharedFiles(): Promise<FileMetadata[]> {
    return api.get(`${this.basePath}/shared`);
  }

  async getFavoriteFiles(): Promise<FileMetadata[]> {
    return api.get(`${this.basePath}/favorites`);
  }

  async addToFavorites(fileId: string): Promise<void> {
    return api.post(`${this.basePath}/${fileId}/favorite`);
  }

  async removeFromFavorites(fileId: string): Promise<void> {
    return api.delete(`${this.basePath}/${fileId}/favorite`);
  }

  // Folder Management
  async getFolders(params?: {
    parentId?: string;
    isPublic?: boolean;
    ownerId?: string;
  }): Promise<Folder[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`/folders?${searchParams.toString()}`);
  }

  async createFolder(folderData: {
    name: string;
    description?: string;
    parentId?: string;
    isPublic?: boolean;
  }): Promise<Folder> {
    return api.post('/folders', folderData);
  }

  async updateFolder(folderId: string, updates: {
    name?: string;
    description?: string;
    isPublic?: boolean;
  }): Promise<Folder> {
    return api.put(`/folders/${folderId}`, updates);
  }

  async deleteFolder(folderId: string, force = false): Promise<void> {
    return api.delete(`/folders/${folderId}?force=${force}`);
  }

  async getFolderContents(folderId: string): Promise<{
    files: FileMetadata[];
    folders: Folder[];
    path: string[];
  }> {
    return api.get(`/folders/${folderId}/contents`);
  }

  async moveFilesToFolder(fileIds: string[], targetFolderId: string): Promise<void> {
    return api.post('/files/move', { fileIds, targetFolderId });
  }

  async copyFiles(fileIds: string[], targetFolderId: string): Promise<FileMetadata[]> {
    return api.post('/files/copy', { fileIds, targetFolderId });
  }

  // File Operations
  async renameFile(fileId: string, newName: string): Promise<FileMetadata> {
    return api.put(`${this.basePath}/${fileId}/rename`, { name: newName });
  }

  async duplicateFile(fileId: string, targetFolderId?: string): Promise<FileMetadata> {
    return api.post(`${this.basePath}/${fileId}/duplicate`, { targetFolderId });
  }

  async compressFile(fileId: string, options?: {
    quality?: number;
    format?: string;
  }): Promise<FileMetadata> {
    return api.post(`${this.basePath}/${fileId}/compress`, options);
  }

  async convertFile(fileId: string, targetFormat: string): Promise<FileMetadata> {
    return api.post(`${this.basePath}/${fileId}/convert`, { targetFormat });
  }

  async extractText(fileId: string): Promise<{
    text: string;
    pages?: number;
    language?: string;
  }> {
    return api.post(`${this.basePath}/${fileId}/extract-text`);
  }

  async generateFileInfo(fileId: string): Promise<{
    basic: FileMetadata;
    analysis: {
      duplicateOf?: string;
      safety: {
        isSafe: boolean;
        issues: string[];
      };
      classification: {
        category: string;
        confidence: number;
      };
      suggestions: string[];
    };
  }> {
    return api.get(`${this.basePath}/${fileId}/info`);
  }

  // Storage Management
  async getStorageStats(): Promise<StorageStats> {
    return api.get('/storage/stats');
  }

  async getStorageUsage(period: 'day' | 'week' | 'month' | 'year'): Promise<Array<{
    date: string;
    used: number;
    files: number;
  }>> {
    return api.get(`/storage/usage?period=${period}`);
  }

  async cleanupStorage(): Promise<{
    deletedFiles: number;
    freedSpace: number;
  }> {
    return api.post('/storage/cleanup');
  }

  async emptyTrash(): Promise<{ deletedFiles: number; freedSpace: number }> {
    return api.delete('/storage/trash');
  }

  // Batch Operations
  async batchDelete(fileIds: string[]): Promise<{
    successful: string[];
    failed: Array<{ id: string; error: string }>;
    deletedCount: number;
  }> {
    return api.post(`${this.basePath}/batch-delete`, { fileIds });
  }

  async batchMove(fileIds: string[], targetFolderId: string): Promise<{
    successful: string[];
    failed: Array<{ id: string; error: string }>;
  }> {
    return api.post(`${this.basePath}/batch-move`, { fileIds, targetFolderId });
  }

  async batchUpdateTags(fileIds: string[], tags: string[]): Promise<{
    updated: string[];
    failed: Array<{ id: string; error: string }>;
  }> {
    return api.put(`${this.basePath}/batch-tags`, { fileIds, tags });
  }

  // Version Control
  async getFileVersions(fileId: string): Promise<Array<{
    version: number;
    size: number;
    uploadedAt: string;
    uploadedBy: string;
    changes?: string;
  }>> {
    return api.get(`${this.basePath}/${fileId}/versions`);
  }

  async createFileVersion(fileId: string, file: File, changes?: string): Promise<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);
    if (changes) {
      formData.append('changes', changes);
    }
    
    return api.post(`${this.basePath}/${fileId}/versions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async restoreFileVersion(fileId: string, version: number): Promise<FileMetadata> {
    return api.post(`${this.basePath}/${fileId}/versions/${version}/restore`);
  }

  // Integration and Third-party Services
  async importFromUrl(url: string, options: UploadOptions = {}): Promise<FileMetadata> {
    return api.post(`${this.basePath}/import/url`, { url, options });
  }

  async importFromGoogleDrive(fileId: string, options?: UploadOptions): Promise<FileMetadata> {
    return api.post(`${this.basePath}/import/google-drive`, { fileId, options });
  }

  async importFromDropbox(fileId: string, options?: UploadOptions): Promise<FileMetadata> {
    return api.post(`${this.basePath}/import/dropbox`, { fileId, options });
  }

  async importFromOneDrive(fileId: string, options?: UploadOptions): Promise<FileMetadata> {
    return api.post(`${this.basePath}/import/onedrive`, { fileId, options });
  }

  async exportToCloud(fileId: string, service: 'google-drive' | 'dropbox' | 'onedrive' | 'box', folderId?: string): Promise<{
    success: boolean;
    externalId?: string;
    url?: string;
    error?: string;
  }> {
    return api.post(`${this.basePath}/${fileId}/export`, { service, folderId });
  }

  // Permissions and Security
  async updatePermissions(fileId: string, permissions: Partial<FilePermissions>): Promise<FilePermissions> {
    return api.put(`${this.basePath}/${fileId}/permissions`, permissions);
  }

  async getPermissions(fileId: string): Promise<FilePermissions> {
    return api.get(`${this.basePath}/${fileId}/permissions`);
  }

  async auditFileAccess(fileId: string): Promise<Array<{
    userId: string;
    action: 'view' | 'download' | 'edit' | 'delete' | 'share';
    timestamp: string;
    ipAddress: string;
    userAgent: string;
  }>> {
    return api.get(`${this.basePath}/${fileId}/audit`);
  }

  async generateAccessReport(fileIds: string[], startDate: string, endDate: string): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    return api.post(`${this.basePath}/access-report`, { fileIds, startDate, endDate });
  }
}

export const fileService = new FileService();