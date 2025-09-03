import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { prisma } from 'db';
import type { AccountState, IAMPolicy } from 'db/generated/prisma';
import { logger } from '../utils/logger.js';

export const seedAccounts = async (): Promise<void> => {
  logger.info('Seeding Accounts...');

  try {
    // Get IAM policies for assignment
    const policies = await prisma.iAMPolicy.findMany();
    const superAdminPolicy = policies.find((p: IAMPolicy) => p.name === 'SUPER_ADMIN');
    const readAccountsPolicy = policies.find((p: IAMPolicy) => p.name === 'READ_ACCOUNTS');
    const readAttendeesPolicy = policies.find((p: IAMPolicy) => p.name === 'READ_ATTENDEES');

    const hashedPassword = await bcrypt.hash('password123', 12);

    const accounts = [
      // Super Admin Account
      {
        email: 'admin@puconvocation.com',
        displayName: 'System Administrator',
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: superAdminPolicy ? [superAdminPolicy.id] : [],
        accountState: 'ACTIVE' as AccountState
      },
      // Faculty Accounts
      {
        email: 'dean.engineering@puconvocation.com',
        displayName: 'Dr. Rajesh Kumar',
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [readAccountsPolicy?.id, readAttendeesPolicy?.id].filter(Boolean) as string[],
        accountState: 'ACTIVE' as AccountState
      },
      {
        email: 'dean.medical@puconvocation.com',
        displayName: 'Dr. Priya Sharma',
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [readAttendeesPolicy?.id].filter(Boolean) as string[],
        accountState: 'ACTIVE' as AccountState
      },
      {
        email: 'registrar@puconvocation.com',
        displayName: 'Prof. Anil Patel',
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [readAccountsPolicy?.id, readAttendeesPolicy?.id].filter(Boolean) as string[],
        accountState: 'ACTIVE' as AccountState
      },
      // Staff Accounts
      {
        email: 'convocation.coordinator@puconvocation.com',
        displayName: 'Ms. Neha Gupta',
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: [readAttendeesPolicy?.id].filter(Boolean) as string[],
        accountState: 'ACTIVE' as AccountState
      }
    ];

    // Generate additional random accounts
    for (let i = 0; i < 15; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const accountStates: AccountState[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];
      accounts.push({
        email: faker.internet.email({ firstName, lastName, provider: 'puconvocation.com' }),
        displayName: `${firstName} ${lastName}`,
        profileImageURL: faker.image.avatar(),
        assignedIAMPolicies: faker.helpers.arrayElements(
          policies.filter((p: IAMPolicy) => p.name !== 'SUPER_ADMIN').map((p: IAMPolicy) => p.id),
          { min: 0, max: 3 }
        ),
        accountState: faker.helpers.arrayElement(accountStates)
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
