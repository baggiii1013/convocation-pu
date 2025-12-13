/**
 * Script to clear all attendee data from the database
 * 
 * This script:
 * 1. Clears all seat allocations (due to foreign key constraints)
 * 2. Clears all attendance records
 * 3. Clears all attendees
 * 
 * Run with: bunx ts-node --esm scripts/clear-attendees.ts
 */

import * as readline from 'readline';
import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('=========================================');
  console.log('  CLEAR ALL ATTENDEE DATA');
  console.log('=========================================\n');

  // Show current counts
  const attendeeCount = await prisma.attendee.count();
  const allocationCount = await prisma.seatAllocation.count();
  const attendanceCount = await prisma.attendance.count();

  console.log('Current database state:');
  console.log(`  - Attendees: ${attendeeCount}`);
  console.log(`  - Seat Allocations: ${allocationCount}`);
  console.log(`  - Attendance Records: ${attendanceCount}`);
  console.log('');

  if (attendeeCount === 0 && allocationCount === 0 && attendanceCount === 0) {
    console.log('✅ Database is already empty. Nothing to clear.');
    return;
  }

  // Ask for confirmation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question('⚠️  Are you sure you want to DELETE ALL attendee data? (type "yes" to confirm): ', resolve);
  });
  rl.close();

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Operation cancelled. No data was deleted.');
    return;
  }

  console.log('\nDeleting data...\n');

  // Step 1: Clear seat allocations first (foreign key dependency)
  console.log('Step 1: Clearing seat allocations...');
  const deletedAllocations = await prisma.seatAllocation.deleteMany({});
  console.log(`  ✅ Deleted ${deletedAllocations.count} seat allocations`);

  // Step 2: Clear attendance records (foreign key dependency)
  console.log('Step 2: Clearing attendance records...');
  const deletedAttendance = await prisma.attendance.deleteMany({});
  console.log(`  ✅ Deleted ${deletedAttendance.count} attendance records`);

  // Step 3: Clear all attendees
  console.log('Step 3: Clearing attendees...');
  const deletedAttendees = await prisma.attendee.deleteMany({});
  console.log(`  ✅ Deleted ${deletedAttendees.count} attendees`);

  // Summary
  console.log('\n=========================================');
  console.log('  DELETION COMPLETE');
  console.log('=========================================\n');
  console.log(`Total deleted:`);
  console.log(`  - Seat Allocations: ${deletedAllocations.count}`);
  console.log(`  - Attendance Records: ${deletedAttendance.count}`);
  console.log(`  - Attendees: ${deletedAttendees.count}`);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
