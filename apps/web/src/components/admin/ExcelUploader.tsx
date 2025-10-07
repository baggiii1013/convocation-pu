'use client';

import { uploadService } from '@/services/upload.service';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadProgress } from './UploadProgress';

interface UploadResult {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalRows: number;
      successful: number;
      skipped: number;
      failed: number;
    };
    results: {
      imported: Array<Record<string, unknown>>;
      errors: Array<{
        row: number;
        data: Record<string, unknown>;
        error: string;
      }>;
    };
  };
}

interface ExcelUploaderProps {
  onUploadComplete: (results: UploadResult) => void;
}

export function ExcelUploader({ onUploadComplete }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState({
    skipDuplicates: false,
    updateExisting: true,
    validateOnly: false
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 50 * 1024 * 1024, // 50MB - increased to handle large datasets (5000+ students)
    multiple: false
  });
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const result = await uploadService.uploadExcel(file, options, (progress) => {
        setProgress(progress);
      });
      
      onUploadComplete(result);
      setFile(null); // Reset file after successful upload
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg
            className="h-12 w-12 text-slate-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {file ? (
            <div>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                {file.name}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                {isDragActive 
                  ? 'Drop the file here' 
                  : 'Drag and drop Excel file here'
                }
              </p>
              <p className="text-sm text-slate-500 mt-2">
                or click to browse
              </p>
            </>
          )}
          <p className="text-xs text-slate-400 mt-4">
            Supported formats: .xlsx, .xls (Max 10MB)
          </p>
        </div>
      </div>
      
      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.skipDuplicates}
            onChange={(e) => setOptions({...options, skipDuplicates: e.target.checked})}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Skip duplicates (based on enrollment ID)
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.updateExisting}
            onChange={(e) => setOptions({...options, updateExisting: e.target.checked})}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Update existing records
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.validateOnly}
            onChange={(e) => setOptions({...options, validateOnly: e.target.checked})}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Validate only (don&apos;t save)
          </span>
        </label>
      </div>
      
      {/* Progress */}
      {uploading && <UploadProgress progress={progress} />}
      
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors font-medium"
      >
        {uploading ? 'Processing...' : 'Upload and Process'}
      </button>
    </div>
  );
}
