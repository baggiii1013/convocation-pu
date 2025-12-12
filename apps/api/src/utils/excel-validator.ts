import { z } from 'zod';

// Very lenient schema - only enrollmentId and name are required
const attendeeRowSchema = z.object({
  enrollmentId: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  email: z.string().optional().or(z.literal('')).or(z.undefined()),
  phone: z.string().optional().or(z.literal('')).or(z.undefined()),
  school: z.string().optional().or(z.literal('')).or(z.undefined()),
  course: z.string().optional().or(z.literal('')).or(z.undefined()),
  degree: z.string().optional().or(z.literal('')).or(z.undefined()),
  crr: z.string().optional().or(z.literal('')).or(z.undefined()),
  enclosure: z.string().optional().or(z.literal('')).or(z.undefined()),
  convocationEligible: z.boolean().optional().or(z.undefined()),
  convocationRegistered: z.boolean().optional().or(z.undefined())
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
