// lib/roleAccess.js
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SOCIETY_ADMIN: 'SOCIETY_ADMIN', 
  SOCIETY_SECRETARY: 'SOCIETY_SECRETARY',
  HOUSE_OWNER: 'HOUSE_OWNER',
  SOCIETY_MEMBER: 'SOCIETY_MEMBER',
  TENANT: 'TENANT',
  RESIDENT: 'RESIDENT',
  STAFF: 'STAFF',
  TECHNICIAN: 'TECHNICIAN',
  WATCHMAN: 'WATCHMAN',
  VISITOR: 'VISITOR'
};

// Define which roles can access which routes
export const ROUTE_ACCESS = {
  // Public routes - accessible to all
  '/': 'public',
  '/join-society': 'public',
  '/emergency-contacts': 'public',
  '/notice-board': 'public',

  // Admin only routes
  '/super-admin': [ROLES.SUPER_ADMIN],
  '/role-management': [ROLES.SUPER_ADMIN],
  '/upload-qr-admin': [ROLES.SUPER_ADMIN],
  '/features': [ROLES.SUPER_ADMIN],

  // Society management routes
  '/dashboard/society-admin': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/society-admin': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/staff-management': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],

  // Secretary routes
  '/allVisitor': [ROLES.SOCIETY_SECRETARY, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/Accounting': [ROLES.SOCIETY_SECRETARY, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/accounting': [ROLES.SOCIETY_SECRETARY, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/billing': [ROLES.SOCIETY_SECRETARY, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/polls': [ROLES.SOCIETY_SECRETARY, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],

  // Resident routes
  '/Facilities': [ROLES.HOUSE_OWNER, ROLES.SOCIETY_MEMBER, ROLES.TENANT, ROLES.RESIDENT],
  '/complaints': [ROLES.HOUSE_OWNER, ROLES.SOCIETY_MEMBER, ROLES.TENANT, ROLES.RESIDENT, ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN],
  '/dashboard/visitor': [ROLES.HOUSE_OWNER, ROLES.SOCIETY_MEMBER, ROLES.TENANT, ROLES.RESIDENT],
  '/pay-with-qr': [ROLES.HOUSE_OWNER, ROLES.SOCIETY_MEMBER, ROLES.TENANT, ROLES.RESIDENT],

  // Staff routes
  '/staff': [ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/staff/leave': [ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN],
  '/staff/salary': [ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN],
  '/staff/emergency-salary': [ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN],
  '/staff/view-shift-task': [ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN],

  // Watchman specific routes
  '/watchman': [ROLES.WATCHMAN],
  '/visitor': [ROLES.WATCHMAN, ROLES.SOCIETY_SECRETARY, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/vendor': [ROLES.WATCHMAN],

  // Staff management routes (Admin only)
  '/staff-management/add-staff': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/staff-management/leave-requests': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/staff-management/assign-shift': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/staff-management/assign-task': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
  '/staff-management/upload-salary-slip': [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN],
};

// Role hierarchy for permissions
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 10,
  [ROLES.SOCIETY_ADMIN]: 8,
  [ROLES.SOCIETY_SECRETARY]: 6,
  [ROLES.HOUSE_OWNER]: 4,
  [ROLES.SOCIETY_MEMBER]: 3,
  [ROLES.TENANT]: 3,
  [ROLES.RESIDENT]: 3,
  [ROLES.STAFF]: 2,
  [ROLES.TECHNICIAN]: 2,
  [ROLES.WATCHMAN]: 2,
  [ROLES.VISITOR]: 1
};

// Check if user has access to a route
export function hasRouteAccess(userRole, route) {
  const allowedRoles = ROUTE_ACCESS[route];
  
  if (!allowedRoles) return true; // Route not defined, allow access
  if (allowedRoles === 'public') return true; // Public route
  
  return allowedRoles.includes(userRole);
}

// Check if user has minimum role level
export function hasMinimumRole(userRole, minimumRole) {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const minimumLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= minimumLevel;
}

// Get user capabilities based on role
export function getUserCapabilities(userRole) {
  const capabilities = {
    canManageStaff: [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN].includes(userRole),
    canManageSociety: [ROLES.SOCIETY_ADMIN, ROLES.SOCIETY_SECRETARY, ROLES.SUPER_ADMIN].includes(userRole),
    canAccessBilling: [ROLES.SOCIETY_ADMIN, ROLES.SOCIETY_SECRETARY, ROLES.SUPER_ADMIN].includes(userRole),
    canViewComplaints: [ROLES.HOUSE_OWNER, ROLES.SOCIETY_MEMBER, ROLES.TENANT, ROLES.RESIDENT, ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN].includes(userRole),
    canManageVisitors: [ROLES.WATCHMAN, ROLES.SOCIETY_SECRETARY, ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN].includes(userRole),
    canBookFacilities: [ROLES.HOUSE_OWNER, ROLES.SOCIETY_MEMBER, ROLES.TENANT, ROLES.RESIDENT].includes(userRole),
    isStaff: [ROLES.STAFF, ROLES.TECHNICIAN, ROLES.WATCHMAN].includes(userRole),
    isResident: [ROLES.HOUSE_OWNER, ROLES.SOCIETY_MEMBER, ROLES.TENANT, ROLES.RESIDENT].includes(userRole),
    isAdmin: [ROLES.SOCIETY_ADMIN, ROLES.SUPER_ADMIN].includes(userRole)
  };
  
  return capabilities;
}
