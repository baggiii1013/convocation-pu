import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

/**
 * Validation middleware factory using Zod schemas
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create validation object with available request parts
      const validationData: any = {};
      
      // Add body if it exists and is not empty
      if (req.body && Object.keys(req.body).length > 0) {
        validationData.body = req.body;
      }
      
      // Add params if they exist
      if (req.params && Object.keys(req.params).length > 0) {
        validationData.params = req.params;
      }
      
      // Add query if it exists
      if (req.query && Object.keys(req.query).length > 0) {
        validationData.query = req.query;
      }
      
      // Add cookies if they exist
      if (req.cookies && Object.keys(req.cookies).length > 0) {
        validationData.cookies = req.cookies;
      }

      // Validate the data
      const result = schema.parse(validationData) as any;
      
      // Update request with validated and transformed data
      // Note: We only update body and params since query is readonly
      if (result.body) {
        req.body = result.body;
      }
      
      if (result.params) {
        req.params = result.params;
      }
      
      // Skip updating req.query as it's readonly in Express
      // Query parameters should be parsed in controllers instead of transformed in validation
      
      if (result.cookies) {
        req.cookies = result.cookies;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Validation failed', {
          url: req.url,
          method: req.method,
          errors: validationErrors,
          body: req.body,
          params: req.params,
          query: req.query
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      // Handle unexpected validation errors
      logger.error('Unexpected validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        url: req.url,
        method: req.method
      });

      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
};

/**
 * Partial validation middleware - allows partial validation where some fields are optional
 * Useful for PATCH operations where not all fields need to be provided
 */
export const validatePartial = (schema: any) => {
  return validate(schema.partial());
};

/**
 * Validation middleware specifically for query parameters
 * Ensures query parameters are properly typed and validated
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.query);
      req.query = result as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Query validation failed', {
          url: req.url,
          method: req.method,
          errors: validationErrors,
          query: req.query
        });

        return res.status(400).json({
          success: false,
          message: 'Query parameter validation failed',
          errors: validationErrors
        });
      }

      logger.error('Unexpected query validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        url: req.url,
        method: req.method
      });

      return res.status(500).json({
        success: false,
        message: 'Internal server error during query validation'
      });
    }
  };
};

/**
 * Validation middleware specifically for request body
 * Ensures request body is properly typed and validated
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Body validation failed', {
          url: req.url,
          method: req.method,
          errors: validationErrors,
          body: req.body
        });

        return res.status(400).json({
          success: false,
          message: 'Request body validation failed',
          errors: validationErrors
        });
      }

      logger.error('Unexpected body validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        url: req.url,
        method: req.method
      });

      return res.status(500).json({
        success: false,
        message: 'Internal server error during body validation'
      });
    }
  };
};

/**
 * Validation middleware specifically for route parameters
 * Ensures route parameters are properly typed and validated
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.params);
      req.params = result as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Params validation failed', {
          url: req.url,
          method: req.method,
          errors: validationErrors,
          params: req.params
        });

        return res.status(400).json({
          success: false,
          message: 'Route parameter validation failed',
          errors: validationErrors
        });
      }

      logger.error('Unexpected params validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        url: req.url,
        method: req.method
      });

      return res.status(500).json({
        success: false,
        message: 'Internal server error during parameter validation'
      });
    }
  };
};
