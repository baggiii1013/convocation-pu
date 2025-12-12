import { extractTokenFromCookie, hasRequiredRole, verifyAccessToken, verifyRefreshToken } from '@/lib/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// API URL for server-side calls
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/help',
  '/faq',
  '/privacy',
  '/terms',
];

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/verify-ticket',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

/**
 * Attempt to refresh tokens using the refresh token
 * Returns the new cookies to set, or null if refresh failed
 */
async function attemptTokenRefresh(refreshToken: string): Promise<{
  accessToken: string;
  newRefreshToken: string;
  userRole: string;
  userData: Record<string, unknown>;
} | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) {
      console.warn('[Proxy] Token refresh failed with status:', response.status);
      return null;
    }

    // Extract new cookies from the response
    const setCookieHeader = response.headers.get('set-cookie');
    if (!setCookieHeader) {
      console.warn('[Proxy] No cookies in refresh response');
      return null;
    }

    // Parse the cookies from Set-Cookie header
    const cookies = setCookieHeader.split(',').map(c => c.trim());
    let newAccessToken = '';
    let newRefreshToken = '';
    let userRole = '';

    for (const cookie of cookies) {
      if (cookie.startsWith('accessToken=')) {
        newAccessToken = cookie.split(';')[0].split('=')[1];
      } else if (cookie.startsWith('refreshToken=')) {
        newRefreshToken = cookie.split(';')[0].split('=')[1];
      } else if (cookie.startsWith('userRole=')) {
        userRole = cookie.split(';')[0].split('=')[1];
      }
    }

    const data = await response.json();
    
    if (newAccessToken && data.success) {
      console.log('[Proxy] Token refresh successful');
      return {
        accessToken: newAccessToken,
        newRefreshToken: newRefreshToken || refreshToken,
        userRole: userRole || data.data?.user?.role || '',
        userData: data.data?.user || {},
      };
    }

    return null;
  } catch (error) {
    console.error('[Proxy] Token refresh error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Enhanced proxy with proper JWT validation and role-based access control
 * This acts as the first line of defense at the edge
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Extract token from cookies
  const cookieHeader = request.headers.get('cookie') || undefined;
  const accessToken = extractTokenFromCookie(cookieHeader, 'accessToken');

  // If it's a public route
  if (isPublicRoute) {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (accessToken && (pathname === '/login' || pathname === '/register')) {
      try {
        // Verify token is valid before redirecting
        await verifyAccessToken(accessToken);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        // Access token is invalid, check if refresh token is valid
        const refreshToken = extractTokenFromCookie(cookieHeader, 'refreshToken');
        
        if (refreshToken) {
          try {
            await verifyRefreshToken(refreshToken);
            // Refresh token valid - redirect to dashboard (client will refresh access token)
            return NextResponse.redirect(new URL('/dashboard', request.url));
          } catch {
            // Both tokens invalid - allow access to login/register and clear cookies
            const response = NextResponse.next();
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            response.cookies.delete('userRole');
            return response;
          }
        }
        
        // No refresh token - clear access token and allow access
        const response = NextResponse.next();
        response.cookies.delete('accessToken');
        response.cookies.delete('userRole');
        return response;
      }
    }
    return NextResponse.next();
  }

  // For protected routes, verify authentication
  if (isProtectedRoute || isAdminRoute) {
    // No access token found - check if we have a valid refresh token
    if (!accessToken) {
      const refreshToken = extractTokenFromCookie(cookieHeader, 'refreshToken');
      
      if (refreshToken) {
        try {
          // Verify refresh token is still valid
          await verifyRefreshToken(refreshToken);
          
          // Proactively refresh the tokens
          const refreshResult = await attemptTokenRefresh(refreshToken);
          
          if (refreshResult) {
            // For admin routes, verify role from refreshed data
            if (isAdminRoute && !hasRequiredRole(refreshResult.userRole, ['ADMIN'])) {
              console.warn(`Unauthorized access attempt to ${pathname} after token refresh`);
              return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
            }
            
            // Set new cookies and allow request to proceed
            const response = NextResponse.next();
            
            // Set the new tokens as cookies
            response.cookies.set('accessToken', refreshResult.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 15 * 60, // 15 minutes
              path: '/',
            });
            
            response.cookies.set('refreshToken', refreshResult.newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60, // 7 days
              path: '/',
            });
            
            if (refreshResult.userRole) {
              response.cookies.set('userRole', refreshResult.userRole, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60, // 24 hours
                path: '/',
              });
            }
            
            console.log(`[Proxy] Token refreshed proactively for ${pathname}`);
            return response;
          }
        } catch (refreshError) {
          // Refresh token is invalid/expired
          console.warn(`Refresh token invalid for ${pathname}:`, refreshError instanceof Error ? refreshError.message : 'Unknown error');
        }
      }
      
      // No valid tokens - redirect to login
      const response = NextResponse.redirect(new URL(`/login?redirect_url=${pathname}`, request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      response.cookies.delete('userRole');
      return response;
    }

    try {
      // Verify and decode the access token
      const payload = await verifyAccessToken(accessToken);

      // For admin routes, check if user has admin role
      if (isAdminRoute) {
        if (!hasRequiredRole(payload.role, ['ADMIN'])) {
          // User is authenticated but not authorized
          console.warn(`Unauthorized access attempt to ${pathname} by user ${payload.email} with role ${payload.role}`);
          return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
        }
      }

      // Token is valid and user has required permissions
      // Add user info to request headers for downstream consumption (optional)
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-role', payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      // Access token validation failed (expired, invalid, etc.)
      console.warn(`Access token validation failed for ${pathname}:`, error instanceof Error ? error.message : 'Unknown error');
      
      // Check if refresh token exists and try to refresh proactively
      const refreshToken = extractTokenFromCookie(cookieHeader, 'refreshToken');
      
      if (refreshToken) {
        try {
          // Verify refresh token is still valid (not expired)
          await verifyRefreshToken(refreshToken);
          
          // Proactively refresh the tokens
          const refreshResult = await attemptTokenRefresh(refreshToken);
          
          if (refreshResult) {
            // For admin routes, verify role from refreshed data
            if (isAdminRoute && !hasRequiredRole(refreshResult.userRole, ['ADMIN'])) {
              console.warn(`Unauthorized access attempt to ${pathname} after token refresh`);
              return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
            }
            
            // Set new cookies and allow request to proceed
            const response = NextResponse.next();
            
            // Set the new tokens as cookies
            response.cookies.set('accessToken', refreshResult.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 15 * 60, // 15 minutes
              path: '/',
            });
            
            response.cookies.set('refreshToken', refreshResult.newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60, // 7 days
              path: '/',
            });
            
            if (refreshResult.userRole) {
              response.cookies.set('userRole', refreshResult.userRole, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60, // 24 hours
                path: '/',
              });
            }
            
            console.log(`[Proxy] Token refreshed after expiry for ${pathname}`);
            return response;
          }
        } catch (refreshError) {
          // Refresh token is also invalid/expired - user must re-login
          console.warn(`Refresh token also invalid for ${pathname}:`, refreshError instanceof Error ? refreshError.message : 'Unknown error');
        }
      }
      
      // No valid refresh token - clear all tokens and redirect to login
      const response = NextResponse.redirect(new URL(`/login?redirect_url=${pathname}&error=session_expired`, request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      response.cookies.delete('userRole');
      return response;
    }
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.eot$).*)',
  ],
};
