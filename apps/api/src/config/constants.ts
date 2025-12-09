// Using Bun's built-in environment variable support
export const config = {
  // Server Configuration
  NODE_ENV: Bun.env.NODE_ENV || 'development',
  PORT: parseInt(Bun.env.PORT || '3001', 10),
  
  // Database Configuration
  DATABASE_URL: Bun.env.DATABASE_URL,
  
  // JWT Configuration
  JWT_SECRET: Bun.env.JWT_SECRET,
  JWT_EXPIRE: Bun.env.JWT_EXPIRE || '15m',
  JWT_REFRESH_SECRET: Bun.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE: Bun.env.JWT_REFRESH_EXPIRE || '7d',
  
  // CORS Configuration
  FRONTEND_URL: Bun.env.FRONTEND_URL || 'http://localhost:3000',
  
  // File Upload Configuration
  MAX_FILE_SIZE: Bun.env.MAX_FILE_SIZE || '10mb',
  UPLOAD_DIR: Bun.env.UPLOAD_DIR || './uploads',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(Bun.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(Bun.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Security
  BCRYPT_SALT_ROUNDS: parseInt(Bun.env.BCRYPT_SALT_ROUNDS || '12', 10),
  SESSION_SECRET: Bun.env.SESSION_SECRET,
  
  // Logging
  LOG_LEVEL: Bun.env.LOG_LEVEL || 'info',
  LOG_FILE: Bun.env.LOG_FILE || './logs/api.log',
  
  // Analytics
  ANALYTICS_ENABLED: Bun.env.ANALYTICS_ENABLED === 'true',
} as const;

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

export const validateConfig = () => {
  const missingVars = requiredEnvVars.filter(varName => !Bun.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};

export default config;
