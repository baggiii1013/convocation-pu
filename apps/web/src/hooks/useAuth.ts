import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the useAuth hook from AuthContext for convenience
export const useAuth = useAuthContext;

// Additional auth-related hooks can be added here

/**
 * Hook to check if user has specific permissions
 */
export function usePermissions() {
  const { user, hasRole } = useAuthContext();

  return {
    // Role-based permissions
    canManageUsers: hasRole(['ADMIN']),
    canManageAttendees: hasRole(['ADMIN', 'STAFF']),
    canViewReports: hasRole(['ADMIN', 'STAFF']),
    canUpdateProfile: !!user,
    
    // Custom permission checks
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
  const { isAuthenticated, loading } = useAuthContext();

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
    isAuthenticated,
    loading,
    redirectToLogin,
    redirectToDashboard,
  };
}
