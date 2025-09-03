import { faker } from '@faker-js/faker';
import { prisma } from 'db';
import type { Direction, EnclosureType } from 'db/generated/prisma';
import { logger } from '../utils/logger.js';

export const seedRemoteConfig = async (): Promise<void> => {
  logger.info('Seeding Remote Configuration...');

  try {
    // Clear existing config
    await prisma.remoteConfig.deleteMany({});

    // Create the main configuration
    const remoteConfig = await prisma.remoteConfig.create({
      data: {
        active: true,
        bannerImageURL: 'https://assets.puconvocation.com/images/banner-2024.jpg',
        logoImageURL: 'https://assets.puconvocation.com/images/pu-logo.png',
        countdownEnabled: true,
        countdownTargetDate: new Date('2024-12-15T09:00:00.000Z'),
        countdownTitle: 'Parul University Convocation 2024',
        countdownDescription: 'Join us for the annual convocation ceremony celebrating our graduates',
        attendeesLocked: false,
        attendeesCSVFile: null,
        showInstructions: true,
        instructions: `
# Convocation Instructions

## For Graduates
1. Please arrive at the venue by 8:30 AM
2. Academic dress is mandatory
3. Bring your admission ticket and ID card
4. Photography is allowed in designated areas only
5. Follow the seating arrangement as per your allocation

## For Guests
1. Entry is by invitation only
2. Arrive at least 30 minutes before the ceremony
3. Formal attire is recommended
4. Please turn off mobile phones during the ceremony
5. Refreshments will be served after the ceremony

## Important Notes
- The ceremony will begin promptly at 9:00 AM
- Late arrivals may not be accommodated
- Parking is available on campus
- Contact the help desk for any queries
        `.trim()
      }
    });

    // Create enclosures with rows
    const enclosures = [
      {
        letter: 'A',
        allocatedFor: 'STUDENTS' as EnclosureType,
        entryDirection: 'NORTH' as Direction,
        rows: [
          { letter: 'A', startSeat: 1, endSeat: 50, reserved: '' },
          { letter: 'B', startSeat: 1, endSeat: 50, reserved: '' },
          { letter: 'C', startSeat: 1, endSeat: 50, reserved: '' },
          { letter: 'D', startSeat: 1, endSeat: 50, reserved: '' },
          { letter: 'E', startSeat: 1, endSeat: 50, reserved: '' }
        ]
      },
      {
        letter: 'B',
        allocatedFor: 'STUDENTS' as EnclosureType,
        entryDirection: 'SOUTH' as Direction,
        rows: [
          { letter: 'A', startSeat: 1, endSeat: 45, reserved: '' },
          { letter: 'B', startSeat: 1, endSeat: 45, reserved: '' },
          { letter: 'C', startSeat: 1, endSeat: 45, reserved: '' },
          { letter: 'D', startSeat: 1, endSeat: 45, reserved: '' }
        ]
      },
      {
        letter: 'C',
        allocatedFor: 'FACULTY' as EnclosureType,
        entryDirection: 'EAST' as Direction,
        rows: [
          { letter: 'A', startSeat: 1, endSeat: 30, reserved: 'Deans and HODs' },
          { letter: 'B', startSeat: 1, endSeat: 30, reserved: '' },
          { letter: 'C', startSeat: 1, endSeat: 30, reserved: '' }
        ]
      },
      {
        letter: 'D',
        allocatedFor: 'GUESTS' as EnclosureType,
        entryDirection: 'WEST' as Direction,
        rows: [
          { letter: 'A', startSeat: 1, endSeat: 40, reserved: 'Family Members' },
          { letter: 'B', startSeat: 1, endSeat: 40, reserved: 'Family Members' },
          { letter: 'C', startSeat: 1, endSeat: 40, reserved: 'General Guests' }
        ]
      },
      {
        letter: 'E',
        allocatedFor: 'VIP' as EnclosureType,
        entryDirection: 'NORTH' as Direction,
        rows: [
          { letter: 'A', startSeat: 1, endSeat: 20, reserved: 'Chief Guest and Dignitaries' },
          { letter: 'B', startSeat: 1, endSeat: 20, reserved: 'Board Members' }
        ]
      }
    ];

    // Create enclosures and their rows
    for (const enclosureData of enclosures) {
      const enclosure = await prisma.enclosure.create({
        data: {
          letter: enclosureData.letter,
          allocatedFor: enclosureData.allocatedFor,
          entryDirection: enclosureData.entryDirection,
          remoteConfigId: remoteConfig.id
        }
      });

      // Create rows for this enclosure
      const rowsData = enclosureData.rows.map(row => ({
        letter: row.letter,
        startSeat: row.startSeat,
        endSeat: row.endSeat,
        reserved: row.reserved,
        enclosureId: enclosure.id
      }));

      // Create rows one by one (MongoDB limitation)
      for (const rowData of rowsData) {
        await prisma.row.create({
          data: rowData
        });
      }
    }

    logger.info('✅ Created remote configuration with enclosures and rows');
  } catch (error) {
    logger.error('Error seeding remote config:', error);
    throw error;
  }
};
