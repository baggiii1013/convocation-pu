import { prisma } from 'db';
import { logger } from '../utils/logger.js';

export const seedIAMPolicies = async (): Promise<void> => {
  logger.info('Seeding IAM Policies...');

  const policies = [
    {
      name: 'READ_ACCOUNTS',
      description: 'Permission to read account information',
      permissions: ['accounts:read', 'accounts:list']
    },
    {
      name: 'WRITE_ACCOUNTS',
      description: 'Permission to create and update accounts',
      permissions: ['accounts:create', 'accounts:update', 'accounts:read', 'accounts:list']
    },
    {
      name: 'DELETE_ACCOUNTS',
      description: 'Permission to delete accounts',
      permissions: ['accounts:delete', 'accounts:read', 'accounts:list']
    },
    {
      name: 'READ_ATTENDEES',
      description: 'Permission to read attendee information',
      permissions: ['attendees:read', 'attendees:list']
    },
    {
      name: 'WRITE_ATTENDEES',
      description: 'Permission to create and update attendees',
      permissions: ['attendees:create', 'attendees:update', 'attendees:read', 'attendees:list']
    },
    {
      name: 'MANAGE_SEAT_ALLOCATION',
      description: 'Permission to manage seat allocations',
      permissions: ['seats:allocate', 'seats:deallocate', 'seats:read', 'attendees:read']
    },
    {
      name: 'READ_ANALYTICS',
      description: 'Permission to read analytics data',
      permissions: ['analytics:read', 'analytics:export']
    },
    {
      name: 'WRITE_ANALYTICS',
      description: 'Permission to create analytics data',
      permissions: ['analytics:create', 'analytics:read']
    },
    {
      name: 'READ_REMOTE_CONFIG',
      description: 'Permission to read remote configuration',
      permissions: ['config:read']
    },
    {
      name: 'WRITE_REMOTE_CONFIG',
      description: 'Permission to update remote configuration',
      permissions: ['config:update', 'config:read']
    },
    {
      name: 'READ_TRANSACTIONS',
      description: 'Permission to read transaction data',
      permissions: ['transactions:read', 'transactions:list']
    },
    {
      name: 'WRITE_TRANSACTIONS',
      description: 'Permission to create and update transactions',
      permissions: ['transactions:create', 'transactions:update', 'transactions:read']
    },
    {
      name: 'SUPER_ADMIN',
      description: 'Full administrative access to all resources',
      permissions: [
        'accounts:*', 'attendees:*', 'seats:*', 'analytics:*', 
        'config:*', 'transactions:*', 'iam:*', 'departments:*'
      ]
    }
  ];

  try {
    // Clear existing policies
    await prisma.iAMPolicy.deleteMany({});
    
    // Create new policies one by one (MongoDB limitation)
    const createdPolicies = [];
    for (const policy of policies) {
      const created = await prisma.iAMPolicy.create({
        data: policy
      });
      createdPolicies.push(created);
    }

    logger.info(`✅ Created ${createdPolicies.length} IAM policies`);
  } catch (error) {
    logger.error('Error seeding IAM policies:', error);
    throw error;
  }
};
