'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { AccountService, type Account } from '@/services/account.service';
import { Edit, MoreVertical, Search, Trash2, UserCheck, UserX, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [searchQuery, roleFilter, statusFilter, currentPage]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      };

      if (searchQuery) filters.search = searchQuery;
      if (roleFilter !== 'ALL') filters.role = roleFilter;
      if (statusFilter !== 'ALL') filters.isActive = statusFilter === 'ACTIVE';

      const result = await AccountService.getAll(filters);
      setAccounts(result.accounts);
      setTotalPages(result.pagination.totalPages);
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      toast.error(error.response?.data?.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (account: Account) => {
    try {
      await AccountService.toggleActive(account.id);
      toast.success(`Account ${account.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchAccounts();
    } catch (error: any) {
      console.error('Error toggling account status:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle account status');
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
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
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
              {totalPages > 1 && (
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
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
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
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
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

      {/* Edit Dialog - To be implemented */}
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

      {/* Delete Confirmation Dialog - To be implemented */}
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

// Edit User Dialog Component
function EditUserDialog({ account, onClose, onSuccess }: { account: Account; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    role: account.role,
    accountState: account.accountState,
    isActive: account.isActive
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await AccountService.update(account.id, formData);
      toast.success('User updated successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              aria-label="User role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            >
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account State</label>
            <select
              aria-label="Account state"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.accountState}
              onChange={(e) => setFormData({ ...formData, accountState: e.target.value as any })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium">Account is Active</label>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Dialog Component
function DeleteConfirmDialog({ account, onClose, onConfirm }: { account: Account; onClose: () => void; onConfirm: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold">Delete User Account</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Are you sure you want to delete the account for <strong>{account.displayName}</strong> ({account.email})?
        </p>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Warning:</strong> This action cannot be undone. All data associated with this account will be permanently deleted.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}
