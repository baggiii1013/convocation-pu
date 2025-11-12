import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the useAuth hook from AuthContext for convenience
export const useAuth = useAuthContext;

// Additional auth-related hooks can be added here

/**
 * Hook to check if user has specific permissions
 * Note: For secure role checks, use server-side utilities (requireRole, requireAuth)
 * This is only for UI display purposes
 */
export function usePermissions() {
  const { user } = useAuthContext();

  // Helper to check roles (client-side only, for UI display)
  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    // Role-based permissions (for UI display only)
    canManageUsers: hasRole(['ADMIN']),
    canManageAttendees: hasRole(['ADMIN', 'STAFF']),
    canViewReports: hasRole(['ADMIN', 'STAFF']),
    canUpdateProfile: !!user,
    
    // Custom permission checks (for UI display only)
    canEdit: (resourceOwnerId?: string) => {
      if (hasRole(['ADMIN', 'STAFF'])) return true;
      return user?.id === resourceOwnerId;
    },
    
    canDelete: (resourceOwnerId?: string) => {
      if (hasRole(['ADMIN'])) return true;
      if (hasRole(['STAFF']) && user?.id === resourceOwnerId) return true;
      return false;
    },
  };
}

/**
 * Hook for handling authentication redirects
 */
export function useAuthRedirect() {
  const { user } = useAuthContext();

  const redirectToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const redirectToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  return {
    isAuthenticated: !!user,
    redirectToLogin,
    redirectToDashboard,
  };
}
