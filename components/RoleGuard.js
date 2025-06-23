"use client";
import React from "react";

/**
 * Role-based access guard for protected components.
 * @param {string[]} roles - Array of allowed roles (e.g., ['ADMIN', 'SUPER_ADMIN']).
 * @param {string} userRole - Current logged-in user's role.
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
