import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export const seedDepartments = async (): Promise<void> => {
  logger.info('Seeding Departments...');

  const departments = [
    // Engineering School
    { name: 'Computer Science and Engineering', code: 'CSE', school: 'School of Engineering and Technology' },
    { name: 'Information Technology', code: 'IT', school: 'School of Engineering and Technology' },
    { name: 'Electronics and Communication Engineering', code: 'ECE', school: 'School of Engineering and Technology' },
    { name: 'Mechanical Engineering', code: 'ME', school: 'School of Engineering and Technology' },
    { name: 'Civil Engineering', code: 'CE', school: 'School of Engineering and Technology' },
    { name: 'Electrical Engineering', code: 'EE', school: 'School of Engineering and Technology' },
    { name: 'Chemical Engineering', code: 'ChE', school: 'School of Engineering and Technology' },
    { name: 'Aerospace Engineering', code: 'AE', school: 'School of Engineering and Technology' },
    
    // Business School
    { name: 'Master of Business Administration', code: 'MBA', school: 'Parul Institute of Management and Research' },
    { name: 'Bachelor of Business Administration', code: 'BBA', school: 'Parul Institute of Management and Research' },
    { name: 'Commerce', code: 'COM', school: 'Parul Institute of Management and Research' },
    { name: 'Economics', code: 'ECO', school: 'Parul Institute of Management and Research' },
    
    // Medical School
    { name: 'Medicine', code: 'MBBS', school: 'Parul Institute of Medical Sciences' },
    { name: 'Nursing', code: 'BSN', school: 'Parul Institute of Medical Sciences' },
    { name: 'Pharmacy', code: 'PHARM', school: 'Parul Institute of Medical Sciences' },
    { name: 'Physiotherapy', code: 'BPT', school: 'Parul Institute of Medical Sciences' },
    
    // Arts and Sciences
    { name: 'Computer Applications', code: 'MCA', school: 'Faculty of Arts and Sciences' },
    { name: 'Mathematics', code: 'MATH', school: 'Faculty of Arts and Sciences' },
    { name: 'Physics', code: 'PHY', school: 'Faculty of Arts and Sciences' },
    { name: 'Chemistry', code: 'CHEM', school: 'Faculty of Arts and Sciences' },
    { name: 'English Literature', code: 'ENG', school: 'Faculty of Arts and Sciences' },
    { name: 'Psychology', code: 'PSY', school: 'Faculty of Arts and Sciences' },
    
    // Architecture and Design
    { name: 'Architecture', code: 'ARCH', school: 'Faculty of Architecture and Planning' },
    { name: 'Interior Design', code: 'ID', school: 'Faculty of Architecture and Planning' },
    { name: 'Urban Planning', code: 'UP', school: 'Faculty of Architecture and Planning' },
    
    // Law
    { name: 'Law', code: 'LLB', school: 'Parul Institute of Law' },
    { name: 'Master of Laws', code: 'LLM', school: 'Parul Institute of Law' },
    
    // Agriculture
    { name: 'Agriculture', code: 'AGR', school: 'Parul Institute of Agriculture' },
    { name: 'Horticulture', code: 'HORT', school: 'Parul Institute of Agriculture' },
    
    // Applied Sciences
    { name: 'Biotechnology', code: 'BT', school: 'Faculty of Applied Sciences' },
    { name: 'Microbiology', code: 'MB', school: 'Faculty of Applied Sciences' },
    { name: 'Environmental Science', code: 'ES', school: 'Faculty of Applied Sciences' }
  ];

  try {
    // Clear existing departments
    await prisma.department.deleteMany({});
    
    // Create new departments one by one (MongoDB limitation)
    const createdDepartments = [];
    for (const department of departments) {
      const created = await prisma.department.create({
        data: department
      });
      createdDepartments.push(created);
    }

    logger.info(`✅ Created ${createdDepartments.length} departments`);
  } catch (error) {
    logger.error('Error seeding departments:', error);
    throw error;
  }
};
