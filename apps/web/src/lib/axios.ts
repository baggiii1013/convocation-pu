import axios from 'axios';

// Track if user just logged out to prevent unnecessary refresh attempts
let isLoggedOut = false;

// Function to set logout state
export const setLoggedOutState = (state: boolean) => {
  isLoggedOut = state;
};

// Validate that the API URL is configured
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required but not set');
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 seconds default timeout
  withCredentials: true, // Important: allows cookies to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - no longer needed since tokens are in cookies
// api.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage (you might want to use a more secure storage method)
//     const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor to handle token refresh logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Don't try to refresh on these endpoints to prevent infinite loops
      const skipRefreshEndpoints = ['/api/v1/auth/refresh', '/api/v1/auth/logout'];
      const isSkipRefreshEndpoint = skipRefreshEndpoints.some(endpoint => 
        originalRequest.url?.includes(endpoint)
      );
      
      // Don't attempt refresh if user just logged out
      if (isSkipRefreshEndpoint || isLoggedOut) {
        // For refresh and logout endpoints, don't attempt refresh
        if (typeof window !== 'undefined') {
          // Only redirect to login if we're not on public pages
          const currentPath = window.location.pathname;
          const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/about', '/contact', '/help', '/faq', '/privacy', '/terms'];
          const isPublicPath = publicPaths.includes(currentPath);
          
          if (!isPublicPath) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
      
      try {
        // Try to refresh the token using cookie
        await api.post('/api/v1/auth/refresh');
        
        // No need to store tokens - they're automatically set in httpOnly cookies
        
        // Retry original request with new cookies
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, set logged out state and redirect to login
        isLoggedOut = true;
        if (typeof window !== 'undefined') {
          // Only redirect to login if we're not on public pages
          const currentPath = window.location.pathname;
          const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/about', '/contact', '/help', '/faq', '/privacy', '/terms'];
          const isPublicPath = publicPaths.includes(currentPath);
          
          if (!isPublicPath) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
