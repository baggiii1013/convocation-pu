import api from '@/lib/axios';

export interface Account {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  accountState: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  isActive: boolean;
  profileImageURL?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountStatistics {
  total: number;
  byRole: {
    ADMIN: number;
    STAFF: number;
    STUDENT: number;
  };
  byAccountState: {
    ACTIVE: number;
    INACTIVE: number;
    SUSPENDED: number;
    PENDING_VERIFICATION: number;
  };
  byActiveStatus: {
    active: number;
    inactive: number;
  };
  recentRegistrations: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AccountFilters {
  search?: string;
  role?: 'ADMIN' | 'STAFF' | 'STUDENT';
  accountState?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateAccountData {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role?: 'ADMIN' | 'STAFF' | 'STUDENT';
  accountState?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  isActive?: boolean;
  profileImageURL?: string | null;
}

export class AccountService {
  /**
   * Get all accounts with filtering and pagination
   */
  static async getAll(filters?: AccountFilters): Promise<{
    accounts: Account[];
    pagination: PaginationInfo;
  }> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.accountState) params.append('accountState', filters.accountState);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = `/api/v1/accounts${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<{
      success: boolean;
      data: Account[];
      pagination: PaginationInfo;
    }>(url);

    return {
      accounts: response.data.data,
      pagination: response.data.pagination
    };
  }

  /**
   * Get account by ID
   */
  static async getById(id: string): Promise<Account> {
    const response = await api.get<{
      success: boolean;
      data: Account;
    }>(`/api/v1/accounts/${id}`);

    return response.data.data;
  }

  /**
   * Update account
   */
  static async update(id: string, data: UpdateAccountData): Promise<Account> {
    const response = await api.put<{
      success: boolean;
      data: Account;
    }>(`/api/v1/accounts/${id}`, data);

    return response.data.data;
  }

  /**
   * Delete account
   */
  static async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/accounts/${id}`);
  }

  /**
   * Toggle account active status
   */
  static async toggleActive(id: string): Promise<Account> {
    const response = await api.patch<{
      success: boolean;
      data: Account;
    }>(`/api/v1/accounts/${id}/toggle-active`);

    return response.data.data;
  }

  /**
   * Get account statistics
   */
  static async getStatistics(): Promise<AccountStatistics> {
    const response = await api.get<{
      success: boolean;
      data: AccountStatistics;
    }>('/api/v1/accounts/statistics');

    return response.data.data;
  }
}
