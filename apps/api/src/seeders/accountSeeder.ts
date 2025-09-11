import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import type { AccountState, UserRole } from '../lib/prisma.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export const seedAccounts = async (): Promise<void> => {
  logger.info('Seeding Accounts...');

  try {
    // Hash password for all test accounts
    const hashedPassword = await bcrypt.hash('Password123', 12);

    const accounts = [
      // Admin Account
      {
        email: 'admin@puconvocation.com',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        displayName: 'System Administrator',
        role: 'ADMIN' as UserRole,
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [], // Simplified for now
        accountState: 'ACTIVE' as AccountState,
        isActive: true
      },
      // Staff Accounts
      {
        email: 'dean.engineering@puconvocation.com',
        password: hashedPassword,
        firstName: 'Rajesh',
        lastName: 'Kumar',
        displayName: 'Dr. Rajesh Kumar',
        role: 'STAFF' as UserRole,
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [],
        accountState: 'ACTIVE' as AccountState,
        isActive: true
      },
      {
        email: 'dean.medical@puconvocation.com',
        password: hashedPassword,
        firstName: 'Priya',
        lastName: 'Sharma',
        displayName: 'Dr. Priya Sharma',
        role: 'STAFF' as UserRole,
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [],
        accountState: 'ACTIVE' as AccountState,
        isActive: true
      },
      {
        email: 'registrar@puconvocation.com',
        password: hashedPassword,
        firstName: 'Anil',
        lastName: 'Patel',
        displayName: 'Prof. Anil Patel',
        role: 'STAFF' as UserRole,
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [],
        accountState: 'ACTIVE' as AccountState,
        isActive: true
      },
      // Staff Account
      {
        email: 'convocation.coordinator@puconvocation.com',
        password: hashedPassword,
        firstName: 'Neha',
        lastName: 'Gupta',
        displayName: 'Ms. Neha Gupta',
        role: 'STAFF' as UserRole,
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [],
        accountState: 'ACTIVE' as AccountState,
        isActive: true
      }
    ];

    // Generate additional random student accounts
    for (let i = 0; i < 15; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const accountStates: AccountState[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];
      
      accounts.push({
        email: faker.internet.email({ firstName, lastName, provider: 'puconvocation.com' }),
        password: hashedPassword,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        role: 'STUDENT' as UserRole,
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [],
        accountState: faker.helpers.arrayElement(accountStates),
        isActive: faker.datatype.boolean({ probability: 0.8 }) // 80% chance of being active
      });
    }

    // Clear existing accounts
    await prisma.account.deleteMany({});
    
    // Create new accounts one by one (MongoDB limitation)
    const createdAccounts = [];
    for (const account of accounts) {
      const created = await prisma.account.create({
        data: account
      });
      createdAccounts.push(created);
    }

    logger.info(`✅ Created ${createdAccounts.length} accounts`);
  } catch (error) {
    logger.error('Error seeding accounts:', error);
    throw error;
  }
};
