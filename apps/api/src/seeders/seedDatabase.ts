import { prisma } from 'db';
import { logger } from '../utils/logger.js';
import { seedAccounts } from './accountSeeder.js';
import { seedAnalytics } from './analyticsSeeder.js';
import { seedAttendees } from './attendeeSeeder.js';
import { seedConvocations } from './convocationSeeder.js';
import { seedDepartments } from './departmentSeeder.js';
import { seedIAMPolicies } from './iamPolicySeeder.js';
import { seedRemoteConfig } from './remoteConfigSeeder.js';

const isResetMode = process.argv.includes('--reset');

async function seedDatabase() {
  logger.info('🌱 Starting database seeding process...');
  logger.info(`Reset mode: ${isResetMode ? 'ON' : 'OFF'}`);

  try {
    // Connect to database
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    if (isResetMode) {
      logger.info('🔄 Reset mode enabled - clearing all existing data...');
      
      // Clear all data in correct order (respecting foreign key constraints)
      await prisma.row.deleteMany({});
      await prisma.enclosure.deleteMany({});
      await prisma.remoteConfig.deleteMany({});
      await prisma.seatAllocation.deleteMany({});
      await prisma.transaction.deleteMany({});
      await prisma.attendee.deleteMany({});
      await prisma.account.deleteMany({});
      await prisma.analytics.deleteMany({});
      await prisma.convocation.deleteMany({});
      await prisma.department.deleteMany({});
      await prisma.iAMPolicy.deleteMany({});
      
      logger.info('✅ All existing data cleared');
    }

    // Seed data in dependency order
    logger.info('📋 Seeding IAM Policies...');
    await seedIAMPolicies();

    logger.info('🏫 Seeding Departments...');
    await seedDepartments();

    logger.info('👥 Seeding Accounts...');
    await seedAccounts();

    logger.info('🎓 Seeding Attendees...');
    await seedAttendees();

    logger.info('⚙️ Seeding Remote Configuration...');
    await seedRemoteConfig();

    logger.info('🎪 Seeding Convocation Events...');
    await seedConvocations();

    logger.info('📊 Seeding Analytics Data...');
    await seedAnalytics();

    // Get final counts
    const counts = {
      accounts: await prisma.account.count(),
      attendees: await prisma.attendee.count(),
      departments: await prisma.department.count(),
      iamPolicies: await prisma.iAMPolicy.count(),
      convocations: await prisma.convocation.count(),
      remoteConfigs: await prisma.remoteConfig.count(),
      enclosures: await prisma.enclosure.count(),
      rows: await prisma.row.count(),
      analytics: await prisma.analytics.count()
    };

    logger.info('🎉 Database seeding completed successfully!');
    logger.info('📈 Final Statistics:');
    logger.info(`   • Accounts: ${counts.accounts}`);
    logger.info(`   • Attendees: ${counts.attendees}`);
    logger.info(`   • Departments: ${counts.departments}`);
    logger.info(`   • IAM Policies: ${counts.iamPolicies}`);
    logger.info(`   • Convocations: ${counts.convocations}`);
    logger.info(`   • Remote Configs: ${counts.remoteConfigs}`);
    logger.info(`   • Enclosures: ${counts.enclosures}`);
    logger.info(`   • Rows: ${counts.rows}`);
    logger.info(`   • Analytics Records: ${counts.analytics}`);

    // Sample data for testing
    logger.info('🔑 Sample Login Credentials:');
    logger.info('   • Admin: admin@puconvocation.com (Super Admin)');
    logger.info('   • Dean: dean.engineering@puconvocation.com');
    logger.info('   • Registrar: registrar@puconvocation.com');
    logger.info('   • Default Password: password123');

  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    logger.info('✅ Database connection closed');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Seeding interrupted by user');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Seeding terminated');
  await prisma.$disconnect();
  process.exit(0);
});

// Run the seeder
seedDatabase().catch(async (error) => {
  logger.error('💥 Unhandled error in seeding process:', error);
  await prisma.$disconnect();
  process.exit(1);
});
