'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import type { Account, PaginationInfo } from '@/services/account.service';
import { AccountService } from '@/services/account.service';
import { Edit, Search, Trash2, UserCheck, UserX, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DeleteConfirmDialog } from './delete-confirm-dialog.client';
import { EditUserDialog } from './edit-user-dialog.client';

interface ManageUsersClientProps {
  initialAccounts: Account[];
  initialPagination: PaginationInfo;
}

/**
 * Client Component: Manage Users
 * 
 * Displays and manages the user accounts table with:
 * - Search functionality
 * - Role and status filters
 * - Pagination
 * - Edit user action
 * - Toggle active/inactive status
 * - Delete user action
 * 
 * Handles all interactive state management and API calls.
 * 
 * @component
 */
export function ManageUsersClient({ initialAccounts, initialPagination }: ManageUsersClientProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const filters: {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        search?: string;
        role?: 'ADMIN' | 'STAFF' | 'STUDENT';
        isActive?: boolean;
      } = {
        page: currentPage,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      };

      if (searchQuery) filters.search = searchQuery;
      if (roleFilter !== 'ALL') filters.role = roleFilter as 'ADMIN' | 'STAFF' | 'STUDENT';
      if (statusFilter !== 'ALL') filters.isActive = statusFilter === 'ACTIVE';

      const result = await AccountService.getAll(filters);
      setAccounts(result.accounts);
      setPagination(result.pagination);
    } catch (error: unknown) {
      console.error('Error fetching accounts:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleToggleActive = async (account: Account) => {
    try {
      await AccountService.toggleActive(account.id);
      toast.success(`Account ${account.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchAccounts();
    } catch (error: unknown) {
      console.error('Error toggling account status:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to toggle account status');
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    
    try {
      await AccountService.delete(selectedAccount.id);
      toast.success('Account deleted successfully');
      setShowDeleteDialog(false);
      setSelectedAccount(null);
      fetchAccounts();
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'STAFF': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'STUDENT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-gold to-gold-dark rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Manage Users
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          View and manage all user accounts in the system
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Role Filter */}
            <select
              aria-label="Filter by role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
              <option value="STUDENT">Student</option>
            </select>

            {/* Status Filter */}
            <select
              aria-label="Filter by status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts ({accounts.length})</CardTitle>
          <CardDescription>
            List of all registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2 text-slate-600 dark:text-slate-400">Loading accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-slate-600 dark:text-slate-400">No accounts found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                    {accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gold to-gold-dark flex items-center justify-center text-white font-semibold">
                                {account.firstName.charAt(0)}{account.lastName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                                {account.displayName}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {account.firstName} {account.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900 dark:text-slate-50">{account.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(account.role)}`}>
                            {account.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(account.isActive)}`}>
                            {account.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {account.lastLoginAt 
                            ? new Date(account.lastLoginAt).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAccount(account);
                                setShowEditDialog(true);
                              }}
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(account)}
                              title={account.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {account.isActive ? (
                                <UserX className="h-4 w-4 text-orange-600" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAccount(account);
                                setShowDeleteDialog(true);
                              }}
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{pagination.totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <Button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          variant="outline"
                          className="rounded-r-none"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                          disabled={currentPage === pagination.totalPages}
                          variant="outline"
                          className="rounded-l-none"
                        >
                          Next
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {showEditDialog && selectedAccount && (
        <EditUserDialog
          account={selectedAccount}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedAccount(null);
          }}
          onSuccess={() => {
            setShowEditDialog(false);
            setSelectedAccount(null);
            fetchAccounts();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedAccount && (
        <DeleteConfirmDialog
          account={selectedAccount}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedAccount(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
