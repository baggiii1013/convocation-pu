import { extractTokenFromCookie, hasRequiredRole, verifyAccessToken } from '@/lib/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
 * Enhanced middleware with proper JWT validation and role-based access control
 * This acts as the first line of defense at the edge
 */
export async function middleware(request: NextRequest) {
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
        // Token is invalid, clear it and allow access to login/register
        const response = NextResponse.next();
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        response.cookies.delete('userRole');
        return response;
      }
    }
    return NextResponse.next();
  }

  // For protected routes, verify authentication
  if (isProtectedRoute || isAdminRoute) {
    // No access token found
    if (!accessToken) {
      // Clear any invalid cookies
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
      // Token validation failed (expired, invalid, etc.)
      console.warn(`Token validation failed for ${pathname}:`, error instanceof Error ? error.message : 'Unknown error');
      
      // Clear invalid tokens
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
