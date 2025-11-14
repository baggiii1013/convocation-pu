/**
 * Server-Side Account Service
 * 
 * This service provides account management functionality for Server Components.
 * It uses the server-side API client that properly forwards authentication cookies.
 * 
 * ⚠️ SERVER-ONLY: This module MUST NOT be imported in client components.
 */

import { apiServer } from '@/lib/api-server';
import 'server-only';
import type { Account, AccountFilters, AccountStatistics, PaginationInfo, UpdateAccountData } from './account.service';

/**
 * Server-side Account Service
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * import { AccountServiceServer } from '@/services/account.service.server';
 * 
 * const { accounts, pagination } = await AccountServiceServer.getAll({
 *   page: 1,
 *   limit: 20
 * });
 * ```
 */
export class AccountServiceServer {
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

    const response = await apiServer.get<{
      success: boolean;
      data: Account[];
      pagination: PaginationInfo;
    }>(url);

    return {
      accounts: response.data,
      pagination: response.pagination
    };
  }

  /**
   * Get account by ID
   */
  static async getById(id: string): Promise<Account> {
    const response = await apiServer.get<{
      success: boolean;
      data: Account;
    }>(`/api/v1/accounts/${id}`);

    return response.data;
  }

  /**
   * Update account
   */
  static async update(id: string, data: UpdateAccountData): Promise<Account> {
    const response = await apiServer.put<{
      success: boolean;
      data: Account;
    }>(`/api/v1/accounts/${id}`, data);

    return response.data;
  }

  /**
   * Delete account
   */
  static async delete(id: string): Promise<void> {
    await apiServer.delete(`/api/v1/accounts/${id}`);
  }

  /**
   * Toggle account active status
   */
  static async toggleActive(id: string): Promise<Account> {
    const response = await apiServer.patch<{
      success: boolean;
      data: Account;
    }>(`/api/v1/accounts/${id}/toggle-active`);

    return response.data;
  }

  /**
   * Get account statistics
   */
  static async getStatistics(): Promise<AccountStatistics> {
    const response = await apiServer.get<{
      success: boolean;
      data: AccountStatistics;
    }>('/api/v1/accounts/statistics');

    return response.data;
  }
}
