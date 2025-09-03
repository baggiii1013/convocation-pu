import jwt from 'jsonwebtoken';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'; // 7 days

// Account interface for typing (matches Prisma Account model)
interface Account {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// JWT Payload interfaces
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  email: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

/**
 * Generate access token for authenticated user
 * @param user - User account data
 * @returns JWT access token
 */
export const generateAccessToken = (user: Account): string => {
  const payload: AccessTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  } as jwt.SignOptions);
};

/**
 * Generate refresh token for user session
 * @param user - User account data
 * @returns JWT refresh token
 */
export const generateRefreshToken = (user: Account): string => {
  const payload: RefreshTokenPayload = {
    userId: user.id,
    email: user.email,
    // tokenVersion can be used to invalidate all refresh tokens
    tokenVersion: 1
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  } as jwt.SignOptions);
};

/**
 * Verify and decode access token
 * @param token - JWT access token
 * @returns Decoded token payload
 * @throws Error if token is invalid
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Access token not active yet');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Verify and decode refresh token
 * @param token - JWT refresh token
 * @returns Decoded token payload
 * @throws Error if token is invalid
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'pu-convocation-api',
      audience: 'pu-convocation-client'
    }) as RefreshTokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Refresh token not active yet');
    } else {
      throw new Error('Refresh token verification failed');
    }
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns JWT token or null
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  // Check for Bearer token format
  const bearerPrefix = 'Bearer ';
  if (!authHeader.startsWith(bearerPrefix)) {
    return null;
  }

  const token = authHeader.substring(bearerPrefix.length).trim();
  return token || null;
};

/**
 * Extract Bearer token from Authorization header (alias for extractTokenFromHeader)
 * @param authHeader - Authorization header value
 * @returns JWT token or null
 */
export const extractBearerToken = extractTokenFromHeader;

/**
 * Extract token from cookie
 * @param cookies - Request cookies object
 * @param cookieName - Name of the cookie containing the token
 * @returns JWT token or null
 */
export const extractTokenFromCookie = (cookies: Record<string, string>, cookieName: string): string | null => {
  return cookies[cookieName] || null;
};

/**
 * Generate token pair (access + refresh)
 * @param user - User account data
 * @returns Object containing both tokens
 */
export const generateTokenPair = (user: Account) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
};

/**
 * Get cookie options for refresh token
 * @param secure - Whether to use secure cookies (HTTPS only)
 * @returns Cookie options object
 */
export const getRefreshTokenCookieOptions = (secure: boolean = process.env.NODE_ENV === 'production') => {
  return {
    httpOnly: true, // Prevent XSS attacks
    secure: secure, // HTTPS only in production
    sameSite: 'strict' as const, // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/', // Available for all routes
    domain: process.env.COOKIE_DOMAIN || undefined // Set domain if needed for subdomains
  };
};

/**
 * Validate token format (basic check)
 * @param token - Token string to validate
 * @returns boolean indicating if format is valid
 */
export const isValidTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

/**
 * Get token expiration time from decoded payload
 * @param payload - Decoded JWT payload
 * @returns Date object of expiration time or null
 */
export const getTokenExpiration = (payload: AccessTokenPayload | RefreshTokenPayload): Date | null => {
  if (!payload.exp) {
    return null;
  }

  // JWT exp is in seconds, Date expects milliseconds
  return new Date(payload.exp * 1000);
};

/**
 * Check if token is expired
 * @param payload - Decoded JWT payload
 * @returns boolean indicating if token is expired
 */
export const isTokenExpired = (payload: AccessTokenPayload | RefreshTokenPayload): boolean => {
  const expiration = getTokenExpiration(payload);
  if (!expiration) {
    return false; // No expiration set
  }

  return new Date() >= expiration;
};

/**
 * Calculate time until token expires
 * @param payload - Decoded JWT payload
 * @returns Milliseconds until expiration or null
 */
export const getTimeUntilExpiration = (payload: AccessTokenPayload | RefreshTokenPayload): number | null => {
  const expiration = getTokenExpiration(payload);
  if (!expiration) {
    return null;
  }

  const now = new Date();
  const timeLeft = expiration.getTime() - now.getTime();
  return Math.max(0, timeLeft);
};
