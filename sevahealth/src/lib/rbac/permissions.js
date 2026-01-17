// Role definitions
export const ROLES = {
  DOCTOR: 'doctor',
  ASHA_WORKER: 'asha_worker',
  SUPERVISOR: 'supervisor'
};

// Permission definitions
export const PERMISSIONS = {
  // Patient permissions
  VIEW_ALL_PATIENTS: 'view_all_patients',
  VIEW_OWN_PATIENTS: 'view_own_patients',
  CREATE_PATIENT: 'create_patient',
  EDIT_PATIENT: 'edit_patient',
  DELETE_PATIENT: 'delete_patient',
  
  // Visit permissions
  VIEW_ALL_VISITS: 'view_all_visits',
  VIEW_OWN_VISITS: 'view_own_visits',
  CREATE_VISIT: 'create_visit',
  EDIT_VISIT: 'edit_visit',
  
  // Alert permissions
  VIEW_ALL_ALERTS: 'view_all_alerts',
  VIEW_OWN_ALERTS: 'view_own_alerts',
  CREATE_ALERT: 'create_alert',
  RESOLVE_ALERT: 'resolve_alert',
  
  // Report permissions
  VIEW_ALL_REPORTS: 'view_all_reports',
  VIEW_OWN_REPORTS: 'view_own_reports',
  GENERATE_REPORT: 'generate_report',
  
  // Worker management
  VIEW_WORKERS: 'view_workers',
  MANAGE_WORKERS: 'manage_workers',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings'
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_ALL_PATIENTS,
    PERMISSIONS.CREATE_PATIENT,
    PERMISSIONS.EDIT_PATIENT,
    PERMISSIONS.DELETE_PATIENT,
    PERMISSIONS.VIEW_ALL_VISITS,
    PERMISSIONS.CREATE_VISIT,
    PERMISSIONS.EDIT_VISIT,
    PERMISSIONS.VIEW_ALL_ALERTS,
    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.RESOLVE_ALERT,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.VIEW_WORKERS,
    PERMISSIONS.MANAGE_WORKERS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS
  ],
  [ROLES.ASHA_WORKER]: [
    PERMISSIONS.VIEW_OWN_PATIENTS,
    PERMISSIONS.CREATE_PATIENT,
    PERMISSIONS.EDIT_PATIENT,
    PERMISSIONS.VIEW_OWN_VISITS,
    PERMISSIONS.CREATE_VISIT,
    PERMISSIONS.VIEW_OWN_ALERTS,
    PERMISSIONS.CREATE_ALERT,
    PERMISSIONS.VIEW_OWN_REPORTS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_WORKERS  // ASHA workers can view doctors for consultation
  ],
  [ROLES.SUPERVISOR]: Object.values(PERMISSIONS)
};

// Route access configuration
export const ROUTE_ACCESS = {
  '/dashboard': [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  '/dashboard/patients': [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  '/dashboard/alerts': [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  '/dashboard/reports': [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  '/dashboard/profile': [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  '/dashboard/settings': [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  '/dashboard/workers': [ROLES.DOCTOR, ROLES.SUPERVISOR], // Only doctors and supervisors
  '/dashboard/doctor': [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR] // All can consult doctors
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean}
 */
export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if a user can access a specific route
 * @param {string} userRole - The user's role
 * @param {string} route - The route to check
 * @returns {boolean}
 */
export function canAccessRoute(userRole, route) {
  if (!userRole || !route) return false;
  
  const allowedRoles = ROUTE_ACCESS[route];
  if (!allowedRoles) return true; // If route not configured, allow access
  
  return allowedRoles.includes(userRole);
}

/**
 * Get all permissions for a role
 * @param {string} userRole - The user's role
 * @returns {string[]}
 */
export function getRolePermissions(userRole) {
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * Filter data based on user role and ownership
 * @param {Array} data - The data array to filter
 * @param {string} userRole - The user's role
 * @param {string} userId - The user's ID
 * @param {string} ownerField - The field name that contains owner ID (default: 'created_by')
 * @returns {Array}
 */
export function filterDataByRole(data, userRole, userId, ownerField = 'created_by') {
  if (!data || !Array.isArray(data)) return [];
  
  // Doctors and supervisors can see all data
  if (userRole === ROLES.DOCTOR || userRole === ROLES.SUPERVISOR) {
    return data;
  }
  
  // ASHA workers can only see their own data
  if (userRole === ROLES.ASHA_WORKER) {
    return data.filter(item => item[ownerField] === userId);
  }
  
  return [];
}
