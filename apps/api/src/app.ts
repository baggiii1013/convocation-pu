import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { config, validateConfig } from './config/constants.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';

export const createApp = (): express.Application => {
  // Validate configuration
  try {
    validateConfig();
  } catch (error) {
    logger.error('Configuration validation failed:', error);
    process.exit(1);
  }

  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use(limiter);

  // Auth rate limiting (stricter for auth endpoints)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.NODE_ENV === 'production' ? 5 : 50, // Limit each IP to 5 auth requests per windowMs in production
    message: {
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // NoSQL injection prevention
  // app.use(mongoSanitize({
  //   replaceWith: '_'
  // }));

  // CORS configuration
  app.use(cors({
    origin: [
      config.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  }));

  // Request parsing middleware
  app.use(express.json({ limit: config.MAX_FILE_SIZE }));
  app.use(express.urlencoded({ extended: true, limit: config.MAX_FILE_SIZE }));
  app.use(cookieParser());

  // Compression middleware
  app.use(compression());

  // Logging middleware
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Apply auth rate limiter to auth routes specifically
  app.use('/api/v1/auth', authLimiter);

  // Routes
  app.use('/api/v1', routes);

  // Root endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to PU Convocation API',
      version: '1.0.0',
      documentation: '/api/v1/health',
    });
  });

  // 404 handler - must be after all routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: `Route ${req.originalUrl} not found`,
        statusCode: 404,
      },
    });
  });

  // Error handling middleware - must be last
  app.use(errorHandler);

  return app;
};

export default createApp;
