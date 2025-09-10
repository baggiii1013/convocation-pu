import api from '@/lib/axios';

export interface DashboardStats {
  upcomingCeremonies: number;
  myRegistrations: number;
  attendanceRecords: number;
  profileCompletion: number;
}

export interface ConvocationSummary {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  isRegistered: boolean;
  registrationDeadline?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentConvocations: ConvocationSummary[];
  notifications: {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
    createdAt: string;
    read: boolean;
  }[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get('/api/dashboard');
    return response.data.data;
  },

  async getUpcomingConvocations(): Promise<ConvocationSummary[]> {
    const response = await api.get('/api/convocations/upcoming');
    return response.data.data;
  },

  async registerForConvocation(convocationId: string): Promise<void> {
    await api.post(`/api/convocations/${convocationId}/register`);
  },

  async getMyRegistrations(): Promise<ConvocationSummary[]> {
    const response = await api.get('/api/attendees/my-registrations');
    return response.data.data;
  },
};
