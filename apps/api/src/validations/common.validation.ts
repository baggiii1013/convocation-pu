import { z } from 'zod';

/**
 * Common validation schemas and utilities
 */

/**
 * MongoDB ObjectId validation
 * Validates a 24-character hexadecimal string
 */
export const mongoObjectId = () =>
  z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format: must be a 24-character hexadecimal string');

/**
 * Pagination query parameters validation
 */
export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

/**
 * Common ID parameter validation for MongoDB
 */
export const idParamSchema = z.object({
  params: z.object({
    id: mongoObjectId()
  })
});

/**
 * Email validation
 */
export const emailSchema = z.string().email('Invalid email format');

/**
 * Phone number validation (10-15 digits)
 */
export const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format');

/**
 * Academic year validation (YYYY-YYYY format)
 */
export const academicYearSchema = z.string().regex(/^\d{4}-\d{4}$/, 'Invalid academic year format (must be YYYY-YYYY)');

/**
 * URL validation (optional/nullable)
 */
export const urlSchema = z.string().url('Invalid URL format');

/**
 * Boolean string validation (for query parameters)
 */
export const booleanStringSchema = z.enum(['true', 'false']);
