/**
 * Script to assign seats to students based on JSON data
 * 
 * This script:
 * 1. Reads student seating data from JSON file
 * 2. Clears all existing seat allocations
 * 3. For each student:
 *    - Finds them by CRR (enrollmentId)
 *    - If not found, creates them with fake data
 *    - Assigns them their seat based on JSON data
 * 4. Reports list of missing students that were created
 * 
 * Run with: npx ts-node --esm scripts/assign-seats-from-json.ts
 * Or: bun scripts/assign-seats-from-json.ts
 */

import crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '../prisma/generated/client/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface SeatingData {
  row: string;
  seat: number;
  crr: string;
  enclosure: string;
}

interface MissingStudent {
  crr: string;
  enclosure: string;
  row: string;
  seat: number;
}

function generateVerificationToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

async function main() {
  console.log('=========================================');
  console.log('  SEAT ALLOCATION FROM JSON DATA');
  console.log('=========================================\n');

  // Read the JSON file
  const jsonPath = path.join(__dirname, '../../web/public/student_seating_data.json');
  console.log(`Reading JSON file from: ${jsonPath}`);
  
  let seatingData: SeatingData[];
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    seatingData = JSON.parse(fileContent);
    console.log(`✅ Loaded ${seatingData.length} seating records\n`);
  } catch (error) {
    console.error('❌ Failed to read JSON file:', error);
    process.exit(1);
  }

  // Step 1: Clear all existing seat allocations
  console.log('Step 1: Clearing existing seat allocations...');
  const deleteResult = await prisma.seatAllocation.deleteMany({});
  console.log(`✅ Cleared ${deleteResult.count} existing seat allocations\n`);

  // Get all enclosures for reference
  const enclosures = await prisma.enclosure.findMany({
    select: { id: true, letter: true }
  });
  const enclosureMap = new Map(enclosures.map(e => [e.letter, e.id]));
  console.log(`Found ${enclosures.length} enclosures: ${enclosures.map(e => e.letter).join(', ')}\n`);

  // Step 2: Process each seating record
  console.log('Step 2: Processing seating records...\n');
  
  const missingStudents: MissingStudent[] = [];
  let allocatedCount = 0;
  let createdCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < seatingData.length; i++) {
    const record = seatingData[i]!;
    const { row, seat, crr, enclosure } = record;

    if (i % 500 === 0) {
      console.log(`Processing record ${i + 1}/${seatingData.length}...`);
    }

    try {
      // Check if enclosure exists
      const enclosureId = enclosureMap.get(enclosure);
      if (!enclosureId) {
        errors.push(`Enclosure "${enclosure}" not found for CRR: ${crr}`);
        errorCount++;
        continue;
      }

      // Find or create attendee by CRR
      let attendee = await prisma.attendee.findFirst({
        where: { crr: crr }
      });

      if (!attendee) {
        // Create new attendee with fake data
        // Use CRR as enrollmentId since it should be unique
        attendee = await prisma.attendee.create({
          data: {
            enrollmentId: crr,
            crr: crr,
            name: `Student ${crr}`,
            email: `${crr.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
            phone: '0000000000',
            school: 'Unknown School',
            degree: 'Unknown Degree',
            course: 'Unknown Course',
            convocationEligible: true,
            convocationRegistered: true,
            assignedEnclosure: enclosure,
            verificationToken: generateVerificationToken()
          }
        });
        
        missingStudents.push({ crr, enclosure, row, seat });
        createdCount++;
      } else {
        // Update existing attendee with enclosure assignment and ensure verification token
        const needsUpdate = attendee.assignedEnclosure !== enclosure || 
            !attendee.convocationEligible || 
            !attendee.convocationRegistered ||
            !attendee.verificationToken;
            
        if (needsUpdate) {
          await prisma.attendee.update({
            where: { id: attendee.id },
            data: {
              assignedEnclosure: enclosure,
              convocationEligible: true,
              convocationRegistered: true,
              verificationToken: attendee.verificationToken || generateVerificationToken()
            }
          });
        }
      }

      // Create seat allocation
      await prisma.seatAllocation.create({
        data: {
          enclosureLetter: enclosure,
          rowLetter: row,
          seatNumber: seat,
          enclosureId: enclosureId,
          attendeeId: attendee.id
        }
      });

      allocatedCount++;

    } catch (error: any) {
      // Handle duplicate seat allocation error
      if (error.code === 'P2002') {
        errors.push(`Duplicate seat allocation attempted: Enclosure ${enclosure}, Row ${row}, Seat ${seat} for CRR: ${crr}`);
      } else {
        errors.push(`Error processing CRR ${crr}: ${error.message}`);
      }
      errorCount++;
    }
  }

  // Step 3: Print summary
  console.log('\n=========================================');
  console.log('  ALLOCATION SUMMARY');
  console.log('=========================================\n');
  
  console.log(`Total records processed: ${seatingData.length}`);
  console.log(`✅ Successfully allocated: ${allocatedCount}`);
  console.log(`🆕 New attendees created: ${createdCount}`);
  console.log(`❌ Errors: ${errorCount}\n`);

  // Print missing students
  if (missingStudents.length > 0) {
    console.log('=========================================');
    console.log('  MISSING STUDENTS (NEWLY CREATED)');
    console.log('=========================================\n');
    
    console.log('The following students were not found in the database and were created with fake data:\n');
    console.log('CRR\t\t\tEnclosure\tRow\tSeat');
    console.log('---\t\t\t---------\t---\t----');
    
    missingStudents.forEach(student => {
      console.log(`${student.crr}\t\t${student.enclosure}\t\t${student.row}\t${student.seat}`);
    });
    
    console.log(`\nTotal missing students: ${missingStudents.length}`);
    
    // Save missing students to a file
    const missingStudentsPath = path.join(__dirname, 'missing-students.json');
    fs.writeFileSync(missingStudentsPath, JSON.stringify(missingStudents, null, 2));
    console.log(`\n📄 Missing students list saved to: ${missingStudentsPath}`);
  } else {
    console.log('✅ All students were found in the database - no new attendees created.');
  }

  // Print errors if any
  if (errors.length > 0) {
    console.log('\n=========================================');
    console.log('  ERRORS');
    console.log('=========================================\n');
    
    errors.slice(0, 50).forEach(err => console.log(`  - ${err}`));
    if (errors.length > 50) {
      console.log(`  ... and ${errors.length - 50} more errors`);
    }
    
    // Save errors to a file
    const errorsPath = path.join(__dirname, 'allocation-errors.json');
    fs.writeFileSync(errorsPath, JSON.stringify(errors, null, 2));
    console.log(`\n📄 Full error list saved to: ${errorsPath}`);
  }

  // Final statistics
  console.log('\n=========================================');
  console.log('  FINAL DATABASE STATISTICS');
  console.log('=========================================\n');

  const totalAllocations = await prisma.seatAllocation.count();
  const totalAttendees = await prisma.attendee.count();
  const attendeesWithSeats = await prisma.attendee.count({
    where: { allocation: { isNot: null } }
  });

  console.log(`Total attendees in database: ${totalAttendees}`);
  console.log(`Total seat allocations: ${totalAllocations}`);
  console.log(`Attendees with seats assigned: ${attendeesWithSeats}`);

  // Per-enclosure breakdown
  console.log('\nPer-enclosure breakdown:');
  const enclosureStats = await prisma.seatAllocation.groupBy({
    by: ['enclosureLetter'],
    _count: true,
    orderBy: { enclosureLetter: 'asc' }
  });

  enclosureStats.forEach(stat => {
    console.log(`  Enclosure ${stat.enclosureLetter}: ${stat._count} seats allocated`);
  });
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
