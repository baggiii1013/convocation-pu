import api from '@/lib/axios';
import type { AxiosProgressEvent } from 'axios';

export const uploadService = {
  async uploadExcel(
    file: File,
    options: {
      skipDuplicates: boolean;
      updateExisting: boolean;
      validateOnly: boolean;
    },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('skipDuplicates', String(options.skipDuplicates));
    formData.append('updateExisting', String(options.updateExisting));
    formData.append('validateOnly', String(options.validateOnly));
    
    const response = await api.post(
      '/api/v1/attendees/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        }
      }
    );
    
    return response.data;
  },
  
  async downloadTemplate() {
    try {
      const response = await api.get(
        '/api/v1/attendees/upload/template',
        { 
          responseType: 'blob',
          withCredentials: true // Explicitly ensure credentials are sent
        }
      );
      
      // Create download link
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_upload_template.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      throw error;
    }
  }
};
