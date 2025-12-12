import { z } from 'zod';

// Common MongoDB ObjectId validation
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Degree enum validation
export const DegreeEnum = z.enum([
  'BACHELOR', 'MASTER', 'DOCTORATE', 'DIPLOMA', 'CERTIFICATE'
]);

// Create attendee validation
export const createAttendeeSchema = z.object({
  body: z.object({
    enrollmentId: z
      .string()
      .min(1, 'Enrollment ID is required')
      .max(20, 'Enrollment ID must not exceed 20 characters')
      .regex(/^[A-Z]{2,4}\d{4}\d{3,4}$/, 'Invalid enrollment ID format (e.g., CSE20240001)')
      .trim(),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim(),
    course: z
      .string()
      .min(2, 'Course must be at least 2 characters')
      .max(100, 'Course must not exceed 100 characters')
      .trim()
      .optional(),
    school: z
      .string()
      .min(2, 'School must be at least 2 characters')
      .max(150, 'School must not exceed 150 characters')
      .trim(),
    degree: DegreeEnum.optional(),
    email: z
      .string()
      .email('Invalid email format')
      .toLowerCase()
      .trim()
      .optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Invalid phone number format')
      .optional(),
    convocationEligible: z
      .boolean()
      .optional()
      .default(false),
    convocationRegistered: z
      .boolean()
      .optional()
      .default(false),
    accountId: objectIdSchema.optional()
  })
});

// Update attendee validation
export const updateAttendeeSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim()
      .optional(),
    course: z
      .string()
      .min(2, 'Course must be at least 2 characters')
      .max(100, 'Course must not exceed 100 characters')
      .trim()
      .optional(),
    school: z
      .string()
      .min(2, 'School must be at least 2 characters')
      .max(150, 'School must not exceed 150 characters')
      .trim()
      .optional(),
    degree: DegreeEnum.optional(),
    email: z
      .string()
      .email('Invalid email format')
      .toLowerCase()
      .trim()
      .optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Invalid phone number format')
      .optional(),
    convocationEligible: z
      .boolean()
      .optional(),
    convocationRegistered: z
      .boolean()
      .optional(),
    accountId: objectIdSchema.optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Get attendee by ID validation
export const getAttendeeSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Delete attendee validation
export const deleteAttendeeSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Get attendees query validation
export const getAttendeesSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive number')
      .transform(Number)
      .refine(val => val > 0, 'Page must be greater than 0')
      .optional()
      .default(() => 1),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive number')
      .transform(Number)
      .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
      .optional()
      .default(() => 20),
    search: z
      .string()
      .trim()
      .optional(),
    course: z
      .string()
      .trim()
      .optional(),
    school: z
      .string()
      .trim()
      .optional(),
    degree: DegreeEnum.optional(),
    convocationEligible: z
      .string()
      .regex(/^(true|false)$/, 'convocationEligible must be true or false')
      .transform(val => val === 'true')
      .optional(),
    convocationRegistered: z
      .string()
      .regex(/^(true|false)$/, 'convocationRegistered must be true or false')
      .transform(val => val === 'true')
      .optional(),
    sortBy: z
      .enum(['name', 'enrollmentId', 'createdAt', 'updatedAt'])
      .optional()
      .default('createdAt'),
    sortOrder: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc')
  })
});

// Bulk import attendees validation
export const bulkImportAttendeesSchema = z.object({
  body: z.object({
    attendees: z.array(
      z.object({
        enrollmentId: z
          .string()
          .min(1, 'Enrollment ID is required')
          .regex(/^[A-Z]{2,4}\d{4}\d{3,4}$/, 'Invalid enrollment ID format')
          .trim(),
        name: z
          .string()
          .min(2, 'Name must be at least 2 characters')
          .max(100, 'Name must not exceed 100 characters')
          .trim(),
        course: z
          .string()
          .min(2, 'Course must be at least 2 characters')
          .max(100, 'Course must not exceed 100 characters')
          .trim()
          .optional(),
        school: z
          .string()
          .min(2, 'School must be at least 2 characters')
          .max(150, 'School must not exceed 150 characters')
          .trim(),
        degree: DegreeEnum.optional(),
        email: z
          .string()
          .email('Invalid email format')
          .toLowerCase()
          .trim()
          .optional(),
        phone: z
          .string()
          .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Invalid phone number format')
          .optional(),
        convocationEligible: z
          .boolean()
          .optional()
          .default(false)
      })
    ).min(1, 'At least one attendee must be provided').max(100, 'Cannot import more than 100 attendees at once')
  })
});

// Link account to attendee validation
export const linkAccountSchema = z.object({
  params: z.object({
    attendeeId: objectIdSchema
  }),
  body: z.object({
    accountId: objectIdSchema
  })
});

// Export types for TypeScript
export type CreateAttendeeInput = z.infer<typeof createAttendeeSchema>;
export type UpdateAttendeeInput = z.infer<typeof updateAttendeeSchema>;
export type GetAttendeeInput = z.infer<typeof getAttendeeSchema>;
export type DeleteAttendeeInput = z.infer<typeof deleteAttendeeSchema>;
export type GetAttendeesInput = z.infer<typeof getAttendeesSchema>;
export type BulkImportAttendeesInput = z.infer<typeof bulkImportAttendeesSchema>;
export type LinkAccountInput = z.infer<typeof linkAccountSchema>;
