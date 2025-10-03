import { z } from 'zod';

const attendeeRowSchema = z.object({
  enrollmentId: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('').transform(() => undefined)),
  phone: z.string().min(10).max(15).optional().or(z.literal('').transform(() => undefined)),
  school: z.string().min(1).max(100),
  course: z.string().min(1).max(100),
  degree: z.string().min(1).max(50),
  crr: z.string().length(24), // MongoDB ObjectId length
  enclosure: z.string().min(1),
  convocationEligible: z.boolean().optional(),
  convocationRegistered: z.boolean().optional()
});

export interface ValidationError {
  row: number;
  field: string;
  value: any;
  error: string;
}

export class ExcelValidator {
  static validate(data: any[]): {
    valid: boolean;
    errors: ValidationError[];
  } {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 for header row and 0-indexing
      
      try {
        attendeeRowSchema.parse(row);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.issues.forEach((err: z.ZodIssue) => {
            const fieldName = err.path[0] as string;
            errors.push({
              row: rowNumber,
              field: err.path.join('.'),
              value: fieldName ? row[fieldName] : undefined,
              error: err.message
            });
          });
        }
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  static checkDuplicates(data: any[]): {
    duplicates: number[];
  } {
    const enrollmentIds = new Set();
    const duplicates: number[] = [];
    
    data.forEach((row, index) => {
      if (enrollmentIds.has(row.enrollmentId)) {
        duplicates.push(index + 2);
      } else {
        enrollmentIds.add(row.enrollmentId);
      }
    });
    
    return { duplicates };
  }
}
