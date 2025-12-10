import { jwtVerify } from 'jose';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

// Convert string secret to Uint8Array for jose library
const getSecretKey = (secret: string) => new TextEncoder().encode(secret);

// Access Token Payload Interface
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

// Refresh Token Payload Interface
export interface RefreshTokenPayload {
  userId: string;
  email: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

/**
 * Verify and decode access token using jose library
 * Works in Edge Runtime (Next.js middleware)
 * @param token - JWT access token
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey(JWT_SECRET),
      {
        algorithms: ['HS256'], // Specify the expected algorithm
      }
    );

    return payload as unknown as AccessTokenPayload;
  } catch (error) {
    // jose library throws JWTExpired, JWTInvalid, etc.
    if (error instanceof Error) {
      throw new Error(`Access token verification failed: ${error.message}`);
    }
    throw new Error('Access token verification failed');
  }
}

/**
 * Verify and decode refresh token using jose library
 * Works in Edge Runtime (Next.js middleware)
 * @param token - JWT refresh token
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey(JWT_REFRESH_SECRET),
      {
        algorithms: ['HS256'],
        issuer: 'pu-convocation-api',
        audience: 'pu-convocation-client',
      }
    );

    return payload as unknown as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Refresh token verification failed: ${error.message}`);
    }
    throw new Error('Refresh token verification failed');
  }
}

/**
 * Extract token from cookie by name
 * @param cookieString - Cookie header string
 * @param cookieName - Name of the cookie to extract
 * @returns Token value or null if not found
 */
export function extractTokenFromCookie(cookieString: string | undefined, cookieName: string): string | null {
  if (!cookieString) return null;

  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  return cookies[cookieName] || null;
}

/**
 * Check if user has required role(s)
 * @param userRole - User's role from token
 * @param allowedRoles - Array of allowed roles
 * @returns Boolean indicating if user has permission
 */
export function hasRequiredRole(userRole: string, allowedRoles: string[]): boolean {
  const userRoleUpper = userRole.toUpperCase();
  const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());
  return allowedRolesUpper.includes(userRoleUpper);
}
