import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Progress } from './Progress';
import { useToast } from './Toast';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  onFilesSelected?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  uploadUrl?: string;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  children?: React.ReactNode;
}

interface FileItem {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  preview?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = '*/*',
  multiple = false,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  onFilesSelected,
  onUpload,
  uploadUrl,
  className = '',
  disabled = false,
  showPreview = true,
  children,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }

    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return mimeType.startsWith(baseType);
        }
        return mimeType === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed types: ${accept}`;
      }
    }

    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: File[] = Array.from(fileList);
    
    // Validate number of files
    if (multiple && files.length + newFiles.length > maxFiles) {
      showToast({
        type: 'error',
        title: 'Too Many Files',
        message: `Maximum ${maxFiles} files allowed`,
      });
      return;
    }

    const validFiles: FileItem[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        const fileItem: FileItem = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          progress: 0,
          status: 'pending',
        };

        // Create preview for images
        if (file.type.startsWith('image/') && showPreview) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles(prev => prev.map(f => 
              f.id === fileItem.id ? { ...f, preview: e.target?.result as string } : f
            ));
          };
          reader.readAsDataURL(file);
        }

        validFiles.push(fileItem);
      }
    });

    if (errors.length > 0) {
      showToast({
        type: 'error',
        title: 'Validation Errors',
        message: errors.join('\n'),
      });
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      onFilesSelected?.(validFiles.map(f => f.file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = async (fileItem: FileItem) => {
    if (!onUpload) return;

    setFiles(prev => prev.map(f => 
      f.id === fileItem.id ? { ...f, status: 'pending', progress: 0, error: undefined } : f
    ));

    await uploadFile(fileItem);
  };

  const uploadFile = async (fileItem: FileItem) => {
    if (!onUpload) return;

    setFiles(prev => prev.map(f => 
      f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    try {
      await onUpload([fileItem.file]);
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'success', progress: 100 } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f
      ));
    }
  };

  const uploadAll = async () => {
    if (!onUpload) return;

    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const fileItem of pendingFiles) {
      await uploadFile(fileItem);
    }
  };

  const getStatusIcon = (status: FileItem['status']) => {
    switch (status) {
      case 'uploading':
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getStatusColor = (status: FileItem['status']) => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : disabled
            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        {children || (
          <div className="space-y-2">
            <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {accept !== '*/*' && `Accepted types: ${accept}`}
                {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                {multiple && ` • Max files: ${maxFiles}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Uploaded Files ({files.length})
            </h3>
            {onUpload && files.some(f => f.status === 'pending') && (
              <Button size="sm" onClick={uploadAll}>
                Upload All
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {files.map(fileItem => (
              <div key={fileItem.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {/* File Preview */}
                {fileItem.preview && (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(fileItem.file.size)}
                  </p>
                  
                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {fileItem.error}
                    </p>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center ${getStatusColor(fileItem.status)}`}>
                    {getStatusIcon(fileItem.status)}
                  </div>
                  
                  {fileItem.status === 'error' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => retryUpload(fileItem)}
                    >
                      Retry
                    </Button>
                  )}
                  
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};