'use client';

interface UploadResultsProps {
  results: {
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
        imported: any[];
        errors: {
          row: number;
          data: any;
          error: string;
        }[];
      };
    };
  };
}

export function UploadResults({ results }: UploadResultsProps) {
  const { summary, results: uploadResults } = results.data;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900 dark:text-green-50">
                Successful
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.successful}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-50">
                Skipped
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {summary.skipped}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-900 dark:text-red-50">
                Failed
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {summary.failed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-50">
                Total Rows
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {summary.totalRows}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Details */}
      {uploadResults.errors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-50 mb-4">
            Validation Errors
          </h3>
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-red-200 dark:divide-red-800">
                <thead className="bg-red-100 dark:bg-red-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 dark:text-red-50 uppercase tracking-wider">
                      Row
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 dark:text-red-50 uppercase tracking-wider">
                      Enrollment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 dark:text-red-50 uppercase tracking-wider">
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-200 dark:divide-red-800">
                  {uploadResults.errors.map((error, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900 dark:text-red-50">
                        {error.row}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900 dark:text-red-50">
                        {error.data?.enrollmentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-900 dark:text-red-50">
                        {error.error}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {summary.successful > 0 && (
        <div className="mt-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-3 text-sm text-green-800 dark:text-green-200">
              Successfully imported {summary.successful} student record{summary.successful !== 1 ? 's' : ''}.
              {summary.skipped > 0 && ` ${summary.skipped} duplicate${summary.skipped !== 1 ? 's' : ''} were skipped.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
