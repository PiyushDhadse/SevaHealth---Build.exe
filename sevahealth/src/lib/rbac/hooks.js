'use client';
import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { filterDataByRole, hasPermission, ROLES } from './permissions';

/**
 * Hook to filter data based on user role
 * @param {Array} data - Data to filter
 * @param {string} ownerField - Field name containing owner ID
 * @returns {Array} Filtered data
 */
export function useFilteredData(data, ownerField = 'created_by') {
  const { user } = useAuth();
  
  return useMemo(() => {
    if (!user || !data) return [];
    return filterDataByRole(data, user.user_type, user.id, ownerField);
  }, [data, user, ownerField]);
}

/**
 * Hook to check role-based permissions
 * @returns {Object} Permission checking functions
 */
export function useRolePermissions() {
  const { user } = useAuth();
  
  return useMemo(() => ({
    hasPermission: (permission) => hasPermission(user?.user_type, permission),
    isDoctor: user?.user_type === ROLES.DOCTOR,
    isAshaWorker: user?.user_type === ROLES.ASHA_WORKER,
    isSupervisor: user?.user_type === ROLES.SUPERVISOR,
    role: user?.user_type || null,
    canViewAll: user?.user_type === ROLES.DOCTOR || user?.user_type === ROLES.SUPERVISOR,
    canManageWorkers: user?.user_type === ROLES.DOCTOR || user?.user_type === ROLES.SUPERVISOR
  }), [user]);
}
