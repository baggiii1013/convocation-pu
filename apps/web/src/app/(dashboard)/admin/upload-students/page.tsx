'use client';

import { ExcelUploader } from '@/components/admin/ExcelUploader';
import { TemplateDownloader } from '@/components/admin/TemplateDownloader';
import { UploadResults } from '@/components/admin/UploadResults';
import { useState } from 'react';

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

export default function UploadStudentsPage() {
  const [uploadResults, setUploadResults] = useState<UploadResult | null>(null);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Upload Student Data
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Bulk import student records using an Excel file
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Template Download Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-50">
              Step 1: Download Template
            </h2>
            <TemplateDownloader />
          </div>
          
          {/* Upload Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-50">
              Step 2: Upload Excel File
            </h2>
            <ExcelUploader onUploadComplete={setUploadResults} />
          </div>
          
          {/* Results Section */}
          {uploadResults && (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-50">
                Upload Results
              </h2>
              <UploadResults results={uploadResults} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
