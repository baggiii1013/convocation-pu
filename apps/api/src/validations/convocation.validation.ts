import { z } from 'zod';

// Common MongoDB ObjectId validation
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Create convocation validation
export const createConvocationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title must not exceed 200 characters')
      .trim(),
    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .trim()
      .optional(),
    dateTime: z
      .string()
      .datetime('Invalid datetime format')
      .refine(date => new Date(date) > new Date(), 'Date must be in the future'),
    venue: z
      .string()
      .min(2, 'Venue must be at least 2 characters')
      .max(200, 'Venue must not exceed 200 characters')
      .trim(),
    dresscode: z
      .string()
      .max(500, 'Dress code must not exceed 500 characters')
      .trim()
      .optional(),
    capacity: z
      .number()
      .int('Capacity must be an integer')
      .min(1, 'Capacity must be at least 1')
      .max(10000, 'Capacity cannot exceed 10,000')
      .optional()
      .default(1000),
    registrationDeadline: z
      .string()
      .datetime('Invalid registration deadline format')
      .refine(date => new Date(date) > new Date(), 'Registration deadline must be in the future'),
    isActive: z
      .boolean()
      .optional()
      .default(true)
  }).refine(data => new Date(data.registrationDeadline) < new Date(data.dateTime), {
    message: 'Registration deadline must be before the convocation date',
    path: ['registrationDeadline']
  })
});

// Update convocation validation
export const updateConvocationSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    title: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title must not exceed 200 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .trim()
      .optional(),
    dateTime: z
      .string()
      .datetime('Invalid datetime format')
      .refine(date => new Date(date) > new Date(), 'Date must be in the future')
      .optional(),
    venue: z
      .string()
      .min(2, 'Venue must be at least 2 characters')
      .max(200, 'Venue must not exceed 200 characters')
      .trim()
      .optional(),
    dresscode: z
      .string()
      .max(500, 'Dress code must not exceed 500 characters')
      .trim()
      .optional(),
    capacity: z
      .number()
      .int('Capacity must be an integer')
      .min(1, 'Capacity must be at least 1')
      .max(10000, 'Capacity cannot exceed 10,000')
      .optional(),
    registrationDeadline: z
      .string()
      .datetime('Invalid registration deadline format')
      .refine(date => new Date(date) > new Date(), 'Registration deadline must be in the future')
      .optional(),
    isActive: z
      .boolean()
      .optional()
  }).refine((data) => {
    if (data.registrationDeadline && data.dateTime) {
      return new Date(data.registrationDeadline) < new Date(data.dateTime);
    }
    return true;
  }, {
    message: 'Registration deadline must be before the convocation date',
    path: ['registrationDeadline']
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Get convocation validation
export const getConvocationSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Delete convocation validation
export const deleteConvocationSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Get convocations query validation
export const getConvocationsSchema = z.object({
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
    venue: z
      .string()
      .trim()
      .optional(),
    isActive: z
      .string()
      .regex(/^(true|false)$/, 'isActive must be true or false')
      .transform(val => val === 'true')
      .optional(),
    upcoming: z
      .string()
      .regex(/^(true|false)$/, 'upcoming must be true or false')
      .transform(val => val === 'true')
      .optional(),
    sortBy: z
      .enum(['title', 'dateTime', 'createdAt', 'updatedAt'])
      .optional()
      .default('dateTime'),
    sortOrder: z
      .enum(['asc', 'desc'])
      .optional()
      .default('asc')
  })
});

// Register for convocation validation
export const registerConvocationSchema = z.object({
  params: z.object({
    convocationId: objectIdSchema
  }),
  body: z.object({
    attendeeId: objectIdSchema
  })
});

// Unregister from convocation validation
export const unregisterConvocationSchema = z.object({
  params: z.object({
    convocationId: objectIdSchema
  }),
  body: z.object({
    attendeeId: objectIdSchema
  })
});

// Get convocation attendees validation
export const getConvocationAttendeesSchema = z.object({
  params: z.object({
    convocationId: objectIdSchema
  }),
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
      .optional()
  })
});

// Bulk register attendees validation
export const bulkRegisterSchema = z.object({
  params: z.object({
    convocationId: objectIdSchema
  }),
  body: z.object({
    attendeeIds: z
      .array(objectIdSchema)
      .min(1, 'At least one attendee ID must be provided')
      .max(100, 'Cannot register more than 100 attendees at once')
  })
});

// Export types for TypeScript
export type CreateConvocationInput = z.infer<typeof createConvocationSchema>;
export type UpdateConvocationInput = z.infer<typeof updateConvocationSchema>;
export type GetConvocationInput = z.infer<typeof getConvocationSchema>;
export type DeleteConvocationInput = z.infer<typeof deleteConvocationSchema>;
export type GetConvocationsInput = z.infer<typeof getConvocationsSchema>;
export type RegisterConvocationInput = z.infer<typeof registerConvocationSchema>;
export type UnregisterConvocationInput = z.infer<typeof unregisterConvocationSchema>;
export type GetConvocationAttendeesInput = z.infer<typeof getConvocationAttendeesSchema>;
export type BulkRegisterInput = z.infer<typeof bulkRegisterSchema>;
