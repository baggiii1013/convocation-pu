import { z } from 'zod';

// Common MongoDB ObjectId validation
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Attendance status enum validation
export const AttendanceStatusEnum = z.enum([
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED'
]);

// Verification method enum validation
export const VerificationMethodEnum = z.enum([
  'QR_SCAN',
  'MANUAL',
  'BIOMETRIC',
  'NFC',
  'FACIAL'
]);

// Create attendance validation
export const createAttendanceSchema = z.object({
  body: z.object({
    attendeeId: objectIdSchema,
    convocationId: objectIdSchema.optional(),
    status: AttendanceStatusEnum.optional().default('PRESENT'),
    verificationMethod: VerificationMethodEnum,
    checkInTime: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined),
    checkOutTime: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined),
    location: z
      .string()
      .min(1, 'Location must be specified')
      .max(100, 'Location must not exceed 100 characters')
      .optional(),
    confirmedBy: objectIdSchema.optional(),
    confirmedByName: z
      .string()
      .max(100, 'Confirmer name must not exceed 100 characters')
      .optional(),
    notes: z
      .string()
      .max(500, 'Notes must not exceed 500 characters')
      .optional(),
    seatInfo: z.record(z.string(), z.any()).optional()
  })
});

// Update attendance validation
export const updateAttendanceSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: AttendanceStatusEnum.optional(),
    verificationMethod: VerificationMethodEnum.optional(),
    checkInTime: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined),
    checkOutTime: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined),
    location: z
      .string()
      .min(1)
      .max(100)
      .optional(),
    confirmedBy: objectIdSchema.optional(),
    confirmedByName: z
      .string()
      .max(100)
      .optional(),
    notes: z
      .string()
      .max(500)
      .optional(),
    seatInfo: z.record(z.string(), z.any()).optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Get attendance by ID validation
export const getAttendanceSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Delete attendance validation
export const deleteAttendanceSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Get attendances query validation
export const getAttendancesSchema = z.object({
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
      .default(() => 10),
    sortBy: z
      .enum(['markedAt', 'checkInTime', 'status', 'createdAt', 'updatedAt'])
      .optional()
      .default('markedAt'),
    sortOrder: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc'),
    // Filters
    attendeeId: objectIdSchema.optional(),
    convocationId: objectIdSchema.optional(),
    status: AttendanceStatusEnum.optional(),
    verificationMethod: VerificationMethodEnum.optional(),
    confirmedBy: objectIdSchema.optional(),
    location: z.string().optional(),
    fromDate: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined),
    toDate: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined)
  })
});

// Get attendee attendance history validation
export const getAttendeeAttendanceHistorySchema = z.object({
  params: z.object({
    attendeeId: objectIdSchema
  }),
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .optional()
      .default(() => 1),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .optional()
      .default(() => 10),
    convocationId: objectIdSchema.optional()
  })
});

// Mark attendance by QR code validation
export const markAttendanceByQRSchema = z.object({
  body: z.object({
    verificationToken: z.string().min(1, 'Verification token is required'),
    location: z
      .string()
      .min(1, 'Location must be specified')
      .max(100)
      .optional(),
    confirmedBy: objectIdSchema.optional(),
    confirmedByName: z.string().max(100).optional(),
    convocationId: objectIdSchema.optional()
  })
});

// Bulk mark attendance validation
export const bulkMarkAttendanceSchema = z.object({
  body: z.object({
    attendances: z.array(
      z.object({
        attendeeId: objectIdSchema,
        status: AttendanceStatusEnum.optional().default('PRESENT'),
        verificationMethod: VerificationMethodEnum,
        location: z.string().max(100).optional(),
        notes: z.string().max(500).optional()
      })
    ).min(1, 'At least one attendance record must be provided')
      .max(100, 'Cannot mark more than 100 attendances at once'),
    convocationId: objectIdSchema.optional(),
    confirmedBy: objectIdSchema.optional(),
    confirmedByName: z.string().max(100).optional()
  })
});

// Get attendance statistics validation
export const getAttendanceStatsSchema = z.object({
  query: z.object({
    convocationId: objectIdSchema.optional(),
    fromDate: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined),
    toDate: z
      .string()
      .datetime()
      .optional()
      .transform(val => val ? new Date(val) : undefined)
  }).optional()
});

// Export types for TypeScript
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type GetAttendanceInput = z.infer<typeof getAttendanceSchema>;
export type DeleteAttendanceInput = z.infer<typeof deleteAttendanceSchema>;
export type GetAttendancesInput = z.infer<typeof getAttendancesSchema>;
export type GetAttendeeAttendanceHistoryInput = z.infer<typeof getAttendeeAttendanceHistorySchema>;
export type MarkAttendanceByQRInput = z.infer<typeof markAttendanceByQRSchema>;
export type BulkMarkAttendanceInput = z.infer<typeof bulkMarkAttendanceSchema>;
export type GetAttendanceStatsInput = z.infer<typeof getAttendanceStatsSchema>;
