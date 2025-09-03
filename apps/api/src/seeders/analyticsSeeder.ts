import { faker } from '@faker-js/faker';
import { prisma } from 'db';
import { logger } from '../utils/logger.js';

// Helper function to ensure min is always less than max
const safeRandomInt = (min: number, max: number): number => {
  const safeMin = Math.max(0, min);
  const safeMax = Math.max(safeMin + 1, max);
  return faker.number.int({ min: safeMin, max: safeMax });
};

export const seedAnalytics = async (): Promise<void> => {
  logger.info('Seeding Analytics...');

  try {
    const analytics = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    
    // Generate daily analytics data
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Simulate realistic traffic patterns
      const baseVisitors = isWeekend ? 50 : 150;
      const visitors = faker.number.int({ 
        min: Math.floor(baseVisitors * 0.7), 
        max: Math.floor(baseVisitors * 1.5) 
      });
      
      const pageViews = visitors * faker.number.int({ min: 2, max: 8 });
      const uniqueVisitors = Math.floor(visitors * 0.7);

      // Generate realistic country distribution
      const countries = {
        'India': safeRandomInt(Math.floor(visitors * 0.7), Math.floor(visitors * 0.9)),
        'United States': safeRandomInt(1, Math.floor(visitors * 0.1)),
        'United Kingdom': safeRandomInt(1, Math.floor(visitors * 0.05)),
        'Canada': safeRandomInt(1, Math.floor(visitors * 0.03)),
        'Australia': safeRandomInt(1, Math.floor(visitors * 0.02)),
        'Germany': safeRandomInt(0, Math.floor(visitors * 0.02)),
        'Singapore': safeRandomInt(0, Math.floor(visitors * 0.02)),
        'UAE': safeRandomInt(0, Math.floor(visitors * 0.02))
      };

      // Generate language distribution
      const languages = {
        'English': safeRandomInt(Math.floor(visitors * 0.6), Math.floor(visitors * 0.8)),
        'Hindi': safeRandomInt(Math.floor(visitors * 0.1), Math.floor(visitors * 0.3)),
        'Gujarati': safeRandomInt(Math.floor(visitors * 0.05), Math.floor(visitors * 0.2)),
        'Marathi': safeRandomInt(0, Math.floor(visitors * 0.1)),
        'Bengali': safeRandomInt(0, Math.floor(visitors * 0.05)),
        'Tamil': safeRandomInt(0, Math.floor(visitors * 0.05))
      };

      // Generate device distribution
      const devices = {
        'Mobile': safeRandomInt(Math.floor(visitors * 0.5), Math.floor(visitors * 0.7)),
        'Desktop': safeRandomInt(Math.floor(visitors * 0.2), Math.floor(visitors * 0.4)),
        'Tablet': safeRandomInt(Math.floor(visitors * 0.05), Math.floor(visitors * 0.15))
      };

      analytics.push({
        date: new Date(date),
        visitors,
        pageViews,
        uniqueVisitors,
        countries: countries,
        languages: languages,
        devices: devices
      });
    }

    // Clear existing analytics
    await prisma.analytics.deleteMany({});
    
    logger.info(`About to create ${analytics.length} analytics records`);
    
    // Create new analytics data one by one (MongoDB limitation)
    const createdAnalytics = [];
    for (let i = 0; i < analytics.length; i++) {
      const analytic = analytics[i];
      if (!analytic) continue;
      
      logger.info(`Creating analytics record ${i + 1}/${analytics.length} for date: ${analytic.date}`);
      const created = await prisma.analytics.create({
        data: analytic
      });
      createdAnalytics.push(created);
    }

    logger.info(`✅ Created ${createdAnalytics.length} analytics records`);
  } catch (error) {
    logger.error('Error seeding analytics:', error);
    logger.error('Error message:', (error as Error)?.message);
    logger.error('Error stack:', (error as Error)?.stack);
    throw error;
  }
};
