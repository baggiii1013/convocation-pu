import { faker } from '@faker-js/faker';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export const seedConvocations = async (): Promise<void> => {
  logger.info('Seeding Convocations...');

  try {
    const convocations = [
      {
        title: 'Parul University Annual Convocation 2024',
        description: 'The 15th Annual Convocation of Parul University celebrating the achievements of our graduating students across all faculties.',
        eventDate: new Date('2024-12-15T09:00:00.000Z'),
        registrationStartDate: new Date('2024-10-01T00:00:00.000Z'),
        registrationEndDate: new Date('2024-12-01T23:59:59.000Z'),
        venue: 'Parul University Main Auditorium, Vadodara',
        isActive: true,
        maxAttendees: 2000
      },
      {
        title: 'School of Engineering Special Convocation 2024',
        description: 'Special convocation ceremony for Engineering graduates including PhD and Master\'s degree recipients.',
        eventDate: new Date('2024-11-30T14:00:00.000Z'),
        registrationStartDate: new Date('2024-09-15T00:00:00.000Z'),
        registrationEndDate: new Date('2024-11-15T23:59:59.000Z'),
        venue: 'Engineering Block Auditorium, Parul University',
        isActive: true,
        maxAttendees: 800
      },
      {
        title: 'Medical Sciences Convocation 2024',
        description: 'Convocation ceremony for medical graduates including MBBS, Nursing, and Pharmacy students.',
        eventDate: new Date('2024-12-20T10:00:00.000Z'),
        registrationStartDate: new Date('2024-10-15T00:00:00.000Z'),
        registrationEndDate: new Date('2024-12-10T23:59:59.000Z'),
        venue: 'Medical Campus Auditorium, Parul University',
        isActive: true,
        maxAttendees: 600
      },
      {
        title: 'Parul University Convocation 2023',
        description: 'Previous year\'s convocation ceremony - archived for reference.',
        eventDate: new Date('2023-12-15T09:00:00.000Z'),
        registrationStartDate: new Date('2023-10-01T00:00:00.000Z'),
        registrationEndDate: new Date('2023-12-01T23:59:59.000Z'),
        venue: 'Parul University Main Auditorium, Vadodara',
        isActive: false,
        maxAttendees: 1800
      }
    ];

    // Clear existing convocations
    await prisma.convocation.deleteMany({});
    
    // Create new convocations one by one (MongoDB limitation)
    const createdConvocations = [];
    for (const convocation of convocations) {
      const created = await prisma.convocation.create({
        data: convocation
      });
      createdConvocations.push(created);
    }

    logger.info(`✅ Created ${createdConvocations.length} convocation events`);
  } catch (error) {
    logger.error('Error seeding convocations:', error);
    throw error;
  }
};
