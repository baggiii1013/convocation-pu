'use client';

interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  const getStatusText = () => {
    if (progress < 10) return 'Preparing upload...';
    if (progress < 100) return 'Uploading file...';
    return 'Processing data... This may take a few minutes for large files.';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {getStatusText()}
        </span>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress === 100 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing {'>'}5000 records may take 2-5 minutes. Please wait...
        </p>
      )}
    </div>
  );
}
