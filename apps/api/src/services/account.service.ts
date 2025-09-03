import type { Account, AccountState, Prisma, UserRole } from '../../../../packages/db/generated/prisma/index.js';
import { prisma } from '../../../../packages/db/index.js';
import { logger } from '../utils/logger.js';

// Input types for Account operations
export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  displayName: string;
  profileImageURL?: string;
  accountState?: AccountState;
  assignedIAMPolicies?: string[];
}

export interface UpdateAccountInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profileImageURL?: string;
  accountState?: AccountState;
  role?: UserRole;
  assignedIAMPolicies?: string[];
  isActive?: boolean;
}

export interface AccountFilters {
  role?: UserRole;
  accountState?: AccountState;
  isActive?: boolean;
  search?: string; // Search in firstName, lastName, email, displayName
}

export interface AccountPagination {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
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
  recentRegistrations: number; // Last 30 days
}

export interface BulkCreateResult {
  created: number;
  errors: Array<{
    index: number;
    email: string;
    error: string;
  }>;
}

export class AccountService {
  /**
   * Create a new account
   */
  static async create(data: CreateAccountInput): Promise<Omit<Account, 'password'>> {
    try {
      // Check if account with email already exists
      const existingAccount = await prisma.account.findUnique({
        where: { email: data.email }
      });

      if (existingAccount) {
        throw new Error(`Account with email ${data.email} already exists`);
      }

      const account = await prisma.account.create({
        data: {
          email: data.email,
          password: data.password, // Should be hashed before calling this service
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          profileImageURL: data.profileImageURL,
          accountState: data.accountState || 'ACTIVE',
          assignedIAMPolicies: data.assignedIAMPolicies || []
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          displayName: true,
          profileImageURL: true,
          accountState: true,
          isActive: true,
          assignedIAMPolicies: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      logger.info(`Account created: ${account.email} (${account.role})`);
      return account;
    } catch (error) {
      logger.error('Error in AccountService.create:', error);
      throw error;
    }
  }

  /**
   * Get account by ID
   */
  static async getById(id: string): Promise<Omit<Account, 'password'> | null> {
    try {
      const account = await prisma.account.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          displayName: true,
          profileImageURL: true,
          accountState: true,
          isActive: true,
          assignedIAMPolicies: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return account;
    } catch (error) {
      logger.error('Error in AccountService.getById:', error);
      throw error;
    }
  }

  /**
   * Get account by email
   */
  static async getByEmail(email: string): Promise<Account | null> {
    try {
      const account = await prisma.account.findUnique({
        where: { email }
      });

      return account;
    } catch (error) {
      logger.error('Error in AccountService.getByEmail:', error);
      throw error;
    }
  }

  /**
   * Get account by email (without password for public use)
   */
  static async getByEmailPublic(email: string): Promise<Omit<Account, 'password'> | null> {
    try {
      const account = await prisma.account.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          displayName: true,
          profileImageURL: true,
          accountState: true,
          isActive: true,
          assignedIAMPolicies: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return account;
    } catch (error) {
      logger.error('Error in AccountService.getByEmailPublic:', error);
      throw error;
    }
  }

  /**
   * Get all accounts with filtering and pagination
   */
  static async getAll(
    filters: AccountFilters = {},
    pagination: AccountPagination = { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' }
  ) {
    try {
      const { page, limit, sortBy, sortOrder } = pagination;
      const offset = (page - 1) * limit;

      // Build where clause
      const where: Prisma.AccountWhereInput = {};

      if (filters.role) {
        where.role = filters.role;
      }

      if (filters.accountState) {
        where.accountState = filters.accountState;
      }

      if (typeof filters.isActive === 'boolean') {
        where.isActive = filters.isActive;
      }

      if (filters.search) {
        where.OR = [
          {
            firstName: {
              contains: filters.search,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: filters.search,
              mode: 'insensitive'
            }
          },
          {
            displayName: {
              contains: filters.search,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: filters.search,
              mode: 'insensitive'
            }
          }
        ];
      }

      // Build orderBy clause
      let orderBy: Prisma.AccountOrderByWithRelationInput = {};
      if (sortBy === 'name') {
        orderBy = { firstName: sortOrder };
      } else if (sortBy === 'email') {
        orderBy = { email: sortOrder };
      } else if (sortBy === 'role') {
        orderBy = { role: sortOrder };
      } else if (sortBy === 'displayName') {
        orderBy = { displayName: sortOrder };
      } else if (sortBy === 'accountState') {
        orderBy = { accountState: sortOrder };
      } else if (sortBy === 'isActive') {
        orderBy = { isActive: sortOrder };
      } else if (sortBy === 'createdAt') {
        orderBy = { createdAt: sortOrder };
      } else if (sortBy === 'updatedAt') {
        orderBy = { updatedAt: sortOrder };
      } else {
        orderBy = { createdAt: 'desc' };
      }

      const [accounts, total] = await Promise.all([
        prisma.account.findMany({
          where,
          select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            displayName: true,
            profileImageURL: true,
            accountState: true,
            isActive: true,
            assignedIAMPolicies: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy,
          skip: offset,
          take: limit
        }),
        prisma.account.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        accounts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error in AccountService.getAll:', error);
      throw error;
    }
  }

  /**
   * Update an account
   */
  static async update(id: string, data: UpdateAccountInput): Promise<Omit<Account, 'password'>> {
    try {
      // Check if account exists
      const existingAccount = await prisma.account.findUnique({
        where: { id }
      });

      if (!existingAccount) {
        throw new Error(`Account with ID ${id} not found`);
      }

      // Check if email is being changed and if new email already exists
      if (data.email && data.email !== existingAccount.email) {
        const emailExists = await prisma.account.findUnique({
          where: { email: data.email }
        });

        if (emailExists) {
          throw new Error(`Account with email ${data.email} already exists`);
        }
      }

      const account = await prisma.account.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          displayName: true,
          profileImageURL: true,
          accountState: true,
          isActive: true,
          assignedIAMPolicies: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      logger.info(`Account updated: ${account.email} (${account.role})`);
      return account;
    } catch (error) {
      logger.error('Error in AccountService.update:', error);
      throw error;
    }
  }

  /**
   * Update account password
   */
  static async updatePassword(id: string, hashedPassword: string): Promise<void> {
    try {
      await prisma.account.update({
        where: { id },
        data: { password: hashedPassword }
      });

      logger.info(`Password updated for account ID: ${id}`);
    } catch (error) {
      logger.error('Error in AccountService.updatePassword:', error);
      throw error;
    }
  }

  /**
   * Delete an account
   */
  static async delete(id: string): Promise<void> {
    try {
      const existingAccount = await prisma.account.findUnique({
        where: { id }
      });

      if (!existingAccount) {
        throw new Error(`Account with ID ${id} not found`);
      }

      await prisma.account.delete({
        where: { id }
      });

      logger.info(`Account deleted: ${existingAccount.email}`);
    } catch (error) {
      logger.error('Error in AccountService.delete:', error);
      throw error;
    }
  }

    /**
   * Bulk create accounts
   */
  static async bulkCreate(accounts: CreateAccountInput[]): Promise<BulkCreateResult> {
    const result: BulkCreateResult = {
      created: 0,
      errors: []
    };

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      if (!account) continue;
      
      try {
        await this.create(account);
        result.created++;
      } catch (error) {
        result.errors.push({
          index: i,
          email: account.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    logger.info(`Bulk account creation completed: ${result.created} created, ${result.errors.length} errors`);
    return result;
  }

  /**
   * Get account statistics
   */
  static async getStatistics(): Promise<AccountStatistics> {
    try {
      const [
        total,
        roleStats,
        accountStateStats,
        activeStats,
        recentCount
      ] = await Promise.all([
        // Total count
        prisma.account.count(),
        
        // Role statistics
        prisma.account.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        
        // Account state statistics
        prisma.account.groupBy({
          by: ['accountState'],
          _count: { accountState: true }
        }),
        
        // Active status statistics
        prisma.account.groupBy({
          by: ['isActive'],
          _count: { isActive: true }
        }),
        
        // Recent registrations (last 30 days)
        prisma.account.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      // Process role statistics
      const byRole = { ADMIN: 0, STAFF: 0, STUDENT: 0 };
      roleStats.forEach((stat: any) => {
        byRole[stat.role as keyof typeof byRole] = stat._count.role;
      });

      // Process account state statistics
      const byAccountState = { ACTIVE: 0, INACTIVE: 0, SUSPENDED: 0, PENDING_VERIFICATION: 0 };
      accountStateStats.forEach((stat: any) => {
        byAccountState[stat.accountState as keyof typeof byAccountState] = stat._count.accountState;
      });

      // Process active status statistics
      const byActiveStatus = { active: 0, inactive: 0 };
      activeStats.forEach((stat: any) => {
        if (stat.isActive) {
          byActiveStatus.active = stat._count.isActive;
        } else {
          byActiveStatus.inactive = stat._count.isActive;
        }
      });

      return {
        total,
        byRole,
        byAccountState,
        byActiveStatus,
        recentRegistrations: recentCount
      };
    } catch (error) {
      logger.error('Error in AccountService.getStatistics:', error);
      throw error;
    }
  }
}
