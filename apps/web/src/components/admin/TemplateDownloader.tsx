'use client';

import { uploadService } from '@/services/upload.service';
import { useState } from 'react';

export function TemplateDownloader() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await uploadService.downloadTemplate();
    } catch (error: any) {
      console.error('Failed to download template:', error);
      
      // Provide specific error messages based on status code
      let errorMessage = 'Failed to download template. Please try again.';
      
      if (error?.response?.status === 403) {
        errorMessage = 'Access denied. You need admin or staff privileges to download the template. Please ensure you are logged in with the correct role.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Template endpoint not found. Please contact support.';
      }
      
      alert(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <svg
          className="h-10 w-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
          Download Excel Template
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Download the Excel template with the correct format and sample data
        </p>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {isDownloading ? 'Downloading...' : 'Download Template'}
        </button>
      </div>
    </div>
  );
}
