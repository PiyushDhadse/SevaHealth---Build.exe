'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { canAccessRoute } from './permissions';

/**
 * ProtectedRoute component that checks if user has access to the route
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} props.redirectTo - Where to redirect if access denied (default: '/dashboard')
 */
export function ProtectedRoute({ children, allowedRoles = [], redirectTo = '/dashboard' }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check if user is authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has access to this route
    const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(user.user_type);
    
    if (!hasAccess) {
      console.warn(`Access denied for user role: ${user.user_type} to route: ${pathname}`);
      router.push(redirectTo);
      return;
    }

    setIsAuthorized(true);
  }, [user, loading, allowedRoles, pathname, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message briefly before redirect
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⛔</div>
          <p className="text-gray-600">Access Denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook to check if user has permission
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function usePermission(permission) {
  const { user } = useAuth();
  
  if (!user || !user.user_type) return false;
  
  const { hasPermission } = require('./permissions');
  return hasPermission(user.user_type, permission);
}

/**
 * Component that conditionally renders children based on permission
 */
export function RequirePermission({ permission, children, fallback = null }) {
  const hasAccess = usePermission(permission);
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
