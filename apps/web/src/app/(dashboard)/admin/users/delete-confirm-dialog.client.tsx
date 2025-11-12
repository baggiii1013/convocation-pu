'use client';

import { Button } from '@/components/ui/Button';
import type { Account } from '@/services/account.service';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteConfirmDialogProps {
  account: Account;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Client Component: Delete Confirmation Dialog
 * 
 * Displays a confirmation dialog before deleting a user account.
 * Includes:
 * - Warning message with account details
 * - Destructive action confirmation
 * - Loading state during deletion
 * 
 * @component
 */
export function DeleteConfirmDialog({ account, onClose, onConfirm }: DeleteConfirmDialogProps) {
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
            variant="danger"
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
