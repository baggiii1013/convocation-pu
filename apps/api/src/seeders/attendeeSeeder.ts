import { faker } from '@faker-js/faker';
import { prisma } from '../lib/prisma.js';
import type { Account, Department } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export const seedAttendees = async (): Promise<void> => {
  logger.info('Seeding Attendees...');

  try {
    // Get departments for course assignment
    const departments = await prisma.department.findMany();
    const accounts = await prisma.account.findMany();
    
    if (departments.length === 0) {
      throw new Error('No departments found. Please seed departments first.');
    }

    const attendees = [];
    const enrollmentIds = new Set<string>();

    // Generate unique enrollment IDs
    const generateEnrollmentId = (dept: Department, year: number): string => {
      let enrollmentId: string;
      do {
        const randomNum = faker.number.int({ min: 1000, max: 9999 });
        enrollmentId = `${year}${dept.code}${randomNum}`;
      } while (enrollmentIds.has(enrollmentId));
      
      enrollmentIds.add(enrollmentId);
      return enrollmentId;
    };

    // Graduate students (final year - eligible for convocation)
    for (let i = 0; i < 150; i++) {
      const department = faker.helpers.arrayElement(departments) as Department;
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const graduationYear = 2024;
      
      // Some attendees have linked accounts
      const hasAccount = faker.datatype.boolean({ probability: 0.3 });
      const linkedAccount = hasAccount ? (faker.helpers.arrayElement(accounts) as Account) : null;
      
      attendees.push({
        enrollmentId: generateEnrollmentId(department, graduationYear),
        name: `${firstName} ${lastName}`,
        course: department.name,
        school: department.school,
        degree: getDegreeByDepartment(department.code),
        email: linkedAccount ? linkedAccount.email : faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        convocationEligible: true,
        convocationRegistered: faker.datatype.boolean({ probability: 0.8 }),
        accountId: linkedAccount ? linkedAccount.id : null
      });
    }

    // Current students (not eligible for convocation yet)
    for (let i = 0; i < 100; i++) {
      const department = faker.helpers.arrayElement(departments) as Department;
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const currentYear = faker.helpers.arrayElement([2021, 2022, 2023]);
      
      attendees.push({
        enrollmentId: generateEnrollmentId(department, currentYear),
        name: `${firstName} ${lastName}`,
        course: department.name,
        school: department.school,
        degree: getDegreeByDepartment(department.code),
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        convocationEligible: false,
        convocationRegistered: false,
        accountId: null
      });
    }

    // Clear existing attendees
    await prisma.attendee.deleteMany({});
    
    // Create new attendees one by one (MongoDB limitation)
    const createdAttendees = [];
    for (const attendee of attendees) {
      const created = await prisma.attendee.create({
        data: attendee
      });
      createdAttendees.push(created);
    }

    logger.info(`✅ Created ${createdAttendees.length} attendees`);
  } catch (error) {
    logger.error('Error seeding attendees:', error);
    throw error;
  }
};

// Helper function to determine degree based on department code
const getDegreeByDepartment = (deptCode: string): string => {
  const degreeMap: Record<string, string> = {
    // Engineering
    'CSE': 'Bachelor of Technology',
    'IT': 'Bachelor of Technology',
    'ECE': 'Bachelor of Technology',
    'ME': 'Bachelor of Technology',
    'CE': 'Bachelor of Technology',
    'EE': 'Bachelor of Technology',
    'ChE': 'Bachelor of Technology',
    'AE': 'Bachelor of Technology',
    
    // Business
    'MBA': 'Master of Business Administration',
    'BBA': 'Bachelor of Business Administration',
    'COM': 'Bachelor of Commerce',
    'ECO': 'Bachelor of Arts',
    
    // Medical
    'MBBS': 'Bachelor of Medicine and Bachelor of Surgery',
    'BSN': 'Bachelor of Science in Nursing',
    'PHARM': 'Bachelor of Pharmacy',
    'BPT': 'Bachelor of Physiotherapy',
    
    // Arts and Sciences
    'MCA': 'Master of Computer Applications',
    'MATH': 'Master of Science',
    'PHY': 'Master of Science',
    'CHEM': 'Master of Science',
    'ENG': 'Master of Arts',
    'PSY': 'Master of Arts',
    
    // Architecture
    'ARCH': 'Bachelor of Architecture',
    'ID': 'Bachelor of Design',
    'UP': 'Master of Planning',
    
    // Law
    'LLB': 'Bachelor of Laws',
    'LLM': 'Master of Laws',
    
    // Agriculture
    'AGR': 'Bachelor of Science in Agriculture',
    'HORT': 'Bachelor of Science in Horticulture',
    
    // Applied Sciences
    'BT': 'Master of Science',
    'MB': 'Master of Science',
    'ES': 'Master of Science'
  };

  return degreeMap[deptCode] || 'Bachelor of Science';
};
