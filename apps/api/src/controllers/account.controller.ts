import type { Request, Response } from 'express';
import { AccountService } from '../services/account.service.js';
import type { AccessTokenPayload } from '../utils/auth.js';
import { logger } from '../utils/logger.js';

/**
 * Account Controller
 * Handles admin-only user management operations
 */
export class AccountController {
  /**
   * Get all accounts with filtering and pagination
   * GET /api/accounts
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      
      // Extract query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const search = req.query.search as string;
      const role = req.query.role as string;
      const accountState = req.query.accountState as string;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

      const filters: any = {};
      if (search) filters.search = search;
      if (role) filters.role = role;
      if (accountState) filters.accountState = accountState;
      if (typeof isActive === 'boolean') filters.isActive = isActive;

      const result = await AccountService.getAll(filters, {
        page,
        limit,
        sortBy,
        sortOrder
      });

      logger.info(`Accounts list retrieved by admin ${user.email}: ${result.accounts.length} accounts`);

      res.json({
        success: true,
        message: 'Accounts retrieved successfully',
        data: result.accounts,
        pagination: result.pagination
      });

    } catch (error) {
      logger.error('Get all accounts error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving accounts',
        code: 'GET_ACCOUNTS_ERROR'
      });
    }
  }

  /**
   * Get account by ID
   * GET /api/accounts/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Account ID is required',
          code: 'INVALID_ID'
        });
        return;
      }

      const account = await AccountService.getById(id);

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found',
          code: 'ACCOUNT_NOT_FOUND'
        });
        return;
      }

      logger.info(`Account details retrieved by admin ${user.email}: ${account.email}`);

      res.json({
        success: true,
        message: 'Account retrieved successfully',
        data: account
      });

    } catch (error) {
      logger.error('Get account by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving account',
        code: 'GET_ACCOUNT_ERROR'
      });
    }
  }

  /**
   * Update account
   * PUT /api/accounts/:id
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Account ID is required',
          code: 'INVALID_ID'
        });
        return;
      }

      // Don't allow password updates through this endpoint
      if (updateData.password) {
        res.status(400).json({
          success: false,
          message: 'Password cannot be updated through this endpoint. Use change password endpoint.',
          code: 'INVALID_UPDATE'
        });
        return;
      }

      const account = await AccountService.update(id, updateData);

      logger.info(`Account updated by admin ${user.email}: ${account.email}`);

      res.json({
        success: true,
        message: 'Account updated successfully',
        data: account
      });

    } catch (error) {
      logger.error('Update account error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            message: 'Account not found',
            code: 'ACCOUNT_NOT_FOUND'
          });
          return;
        }
        
        if (error.message.includes('already exists')) {
          res.status(409).json({
            success: false,
            message: 'Email already exists',
            code: 'EMAIL_EXISTS'
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error updating account',
        code: 'UPDATE_ACCOUNT_ERROR'
      });
    }
  }

  /**
   * Delete account
   * DELETE /api/accounts/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Account ID is required',
          code: 'INVALID_ID'
        });
        return;
      }

      // Prevent admin from deleting their own account
      if (user.userId === id) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete your own account',
          code: 'CANNOT_DELETE_SELF'
        });
        return;
      }

      await AccountService.delete(id);

      logger.info(`Account deleted by admin ${user.email}: ID ${id}`);

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });

    } catch (error) {
      logger.error('Delete account error:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: 'Account not found',
          code: 'ACCOUNT_NOT_FOUND'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error deleting account',
        code: 'DELETE_ACCOUNT_ERROR'
      });
    }
  }

  /**
   * Get account statistics
   * GET /api/accounts/statistics
   */
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;

      const statistics = await AccountService.getStatistics();

      logger.info(`Account statistics retrieved by admin ${user.email}`);

      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: statistics
      });

    } catch (error) {
      logger.error('Get account statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving statistics',
        code: 'GET_STATISTICS_ERROR'
      });
    }
  }

  /**
   * Toggle account active status
   * PATCH /api/accounts/:id/toggle-active
   */
  static async toggleActive(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Account ID is required',
          code: 'INVALID_ID'
        });
        return;
      }

      // Prevent admin from deactivating their own account
      if (user.userId === id) {
        res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own account',
          code: 'CANNOT_DEACTIVATE_SELF'
        });
        return;
      }

      const account = await AccountService.getById(id);
      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found',
          code: 'ACCOUNT_NOT_FOUND'
        });
        return;
      }

      const updatedAccount = await AccountService.update(id, {
        isActive: !account.isActive
      });

      logger.info(`Account active status toggled by admin ${user.email}: ${updatedAccount.email} (isActive: ${updatedAccount.isActive})`);

      res.json({
        success: true,
        message: `Account ${updatedAccount.isActive ? 'activated' : 'deactivated'} successfully`,
        data: updatedAccount
      });

    } catch (error) {
      logger.error('Toggle account active status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error toggling account status',
        code: 'TOGGLE_ACTIVE_ERROR'
      });
    }
  }
}
