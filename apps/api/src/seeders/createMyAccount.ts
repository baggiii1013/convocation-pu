import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

async function createMyAccount() {
  logger.info('🔐 Creating account...');

  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    // Check if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: { email: '2203051050776@paruluniversity.ac.in' }
    });

    if (existingAccount) {
      logger.info('⚠️ Account already exists. Updating password...');
      const hashedPassword = await bcrypt.hash('Mokshu@13', 12);
      
      await prisma.account.update({
        where: { email: '2203051050776@paruluniversity.ac.in' },
        data: { password: hashedPassword }
      });
      
      logger.info('✅ Password updated successfully!');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash('Mokshu@13', 12);

      // Create the account
      const account = await prisma.account.create({
        data: {
          email: '2203051050776@paruluniversity.ac.in',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          displayName: 'Admin User',
          role: 'ADMIN',
          profileImageURL: null,
          assignedIAMPolicies: [],
          accountState: 'ACTIVE',
          isActive: true
        }
      });

      logger.info('✅ Account created successfully!');
      logger.info(`   Email: ${account.email}`);
      logger.info(`   Role: ${account.role}`);
      logger.info(`   ID: ${account.id}`);
    }

    logger.info('🔑 Login Credentials:');
    logger.info('   Email: 2203051050776@paruluniversity.ac.in');
    logger.info('   Password: Mokshu@13');

  } catch (error) {
    logger.error('❌ Failed to create account:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    logger.info('✅ Database connection closed');
  }
}

createMyAccount();
