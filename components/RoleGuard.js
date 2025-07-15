"use client";
import React from "react";

/**
 * Role-based access guard for protected components.
 * @param {Object} props
 * @param {string[]} props.roles - Array of allowed roles (e.g., ['ADMIN', 'SUPER_ADMIN']).
 * @param {string} props.userRole - Current logged-in user's role.
 * @param {React.ReactNode} props.children - The component(s) to render if access is allowed.
 */
export default function RoleGuard({ roles = [], userRole, children }) {
  const hasAccess = roles.includes(userRole);

  if (!hasAccess) {
    return (
      <div className="text-red-600 text-sm font-semibold">  
        You do not have permission to access this section.
      </div>
    );
  }

  return <>{children}</>;
}
