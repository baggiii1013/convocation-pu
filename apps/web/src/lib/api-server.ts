/**
 * Server-Side API Client
 * 
 * This utility provides a fetch-based API client for Server Components.
 * It properly forwards cookies from the Next.js request to the API backend.
 * 
 * ⚠️ SERVER-ONLY: This module MUST NOT be imported in client components.
 */

import { cookies } from 'next/headers';
import 'server-only';

/**
 * Server-side API client that forwards authentication cookies
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * import { apiServer } from '@/lib/api-server';
 * 
 * const data = await apiServer.get('/api/v1/accounts');
 * ```
 */
export const apiServer = {
  /**
   * Make a GET request to the API
   */
  async get<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  },

  /**
   * Make a POST request to the API
   */
  async post<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Make a PUT request to the API
   */
  async put<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Make a PATCH request to the API
   */
  async patch<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Make a DELETE request to the API
   */
  async delete<T = any>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  },

  /**
   * Internal method to make HTTP requests with proper cookie forwarding
   */
  async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is required but not set');
    }

    // Get cookies from Next.js
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Build cookie header
    const cookieHeader: string[] = [];
    if (accessToken) cookieHeader.push(`accessToken=${accessToken}`);
    if (refreshToken) cookieHeader.push(`refreshToken=${refreshToken}`);

    // Build full URL
    const url = `${apiUrl}${path}`;

    // Make the request with forwarded cookies
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader.length > 0 && { Cookie: cookieHeader.join('; ') }),
        ...options.headers,
      },
      cache: options.cache ?? 'no-store', // Default to no cache for fresh data
    });

    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // If not JSON, use the text
        if (errorText) errorMessage = errorText;
      }

      throw new Error(errorMessage);
    }

    // Parse and return response
    return response.json();
  },
};
