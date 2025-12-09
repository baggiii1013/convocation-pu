import axios from 'axios';

/**
 * Phase 5: Simplified axios Configuration
 * 
 * This file has been cleaned up as part of Phase 5 (Remove Client-Side Guards).
 * 
 * Key changes:
 * - Removed client-side redirect logic (proxy handles this)
 * - Removed isLoggedOut state tracking (no longer needed)
 * - Simplified interceptor to only handle token refresh
 * - Let server components and proxy handle authentication
 * 
 * Architecture:
 * - Proxy: Redirects unauthenticated users before they reach pages
 * - Server Components: Use requireAuth() and requireRole() for protection
 * - Axios Interceptor: Only handles token refresh attempts, no redirects
 */

// Validate that the API URL is configured
if (!Bun.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required but not set');
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: Bun.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true, // Important: allows cookies to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Simplified Response Interceptor
 * 
 * Handles automatic token refresh for 401 errors.
 * Does NOT redirect users - proxy handles that on next navigation.
 * 
 * Flow:
 * 1. Request fails with 401
 * 2. Try to refresh token (once)
 * 3. If refresh succeeds, retry original request
 * 4. If refresh fails, reject error (let component handle it)
 * 5. Proxy will catch user on next page navigation
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized) - try to refresh token once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Don't try to refresh on these endpoints to prevent infinite loops
      const skipRefreshEndpoints = ['/api/v1/auth/refresh', '/api/v1/auth/logout'];
      const isSkipRefreshEndpoint = skipRefreshEndpoints.some(endpoint => 
        originalRequest.url?.includes(endpoint)
      );
      
      if (isSkipRefreshEndpoint) {
        // For refresh and logout endpoints, just reject
        // Proxy will redirect on next navigation
        return Promise.reject(error);
      }
      
      try {
        // Try to refresh the token using cookie
        await api.post('/api/v1/auth/refresh');
        
        // Token refreshed successfully (cookies updated server-side)
        // Retry the original request with new cookies
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - session is truly expired
        // Just reject the error, don't redirect
        // Proxy will handle redirect on next page navigation
        return Promise.reject(refreshError);
      }
    }
    
    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default api;
