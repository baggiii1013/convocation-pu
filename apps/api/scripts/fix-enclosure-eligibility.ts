/**
 * Script to fix students with assignedEnclosure but missing convocationEligible/convocationRegistered flags
 * 
 * Run with: bunx ts-node scripts/fix-enclosure-eligibility.ts
 */

import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking for students with eligibility issues...\n');

  // Count students in enclosure A with different flag combinations
  const enclosureA_total = await prisma.attendee.count({
    where: { assignedEnclosure: 'A' }
  });

  const enclosureA_bothTrue = await prisma.attendee.count({
    where: {
      assignedEnclosure: 'A',
      convocationEligible: true,
      convocationRegistered: true
    }
  });

  const enclosureA_notEligible = await prisma.attendee.count({
    where: {
      assignedEnclosure: 'A',
      convocationEligible: false
    }
  });

  const enclosureA_notRegistered = await prisma.attendee.count({
    where: {
      assignedEnclosure: 'A',
      convocationRegistered: false
    }
  });

  console.log('=== Enclosure A Statistics ===');
  console.log(`Total students in enclosure A: ${enclosureA_total}`);
  console.log(`With both eligible AND registered: ${enclosureA_bothTrue}`);
  console.log(`Not eligible (convocationEligible=false): ${enclosureA_notEligible}`);
  console.log(`Not registered (convocationRegistered=false): ${enclosureA_notRegistered}`);
  console.log(`\nMissing from display: ${enclosureA_total - enclosureA_bothTrue}\n`);

  // Ask for confirmation before fixing
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question('Do you want to fix these students by setting both flags to true? (yes/no): ', resolve);
  });
  rl.close();

  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    // Fix students with assignedEnclosure but missing eligibility flags
    const result = await prisma.attendee.updateMany({
      where: {
        assignedEnclosure: { not: null },
        OR: [
          { convocationEligible: false },
          { convocationRegistered: false }
        ]
      },
      data: {
        convocationEligible: true,
        convocationRegistered: true
      }
    });

    console.log(`\n✅ Fixed ${result.count} students!`);

    // Verify the fix
    const afterFix = await prisma.attendee.count({
      where: {
        assignedEnclosure: 'A',
        convocationEligible: true,
        convocationRegistered: true
      }
    });

    console.log(`\nVerification: Enclosure A now shows ${afterFix} students (was ${enclosureA_bothTrue})`);
  } else {
    console.log('\nNo changes made.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
