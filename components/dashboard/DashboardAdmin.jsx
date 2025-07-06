"use client";
// DashboardAdmin.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";
import RoleGuard from "../RoleGuard";

export default function DashboardAdmin() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
    fetchUserRole();
  }, []);

  return (
    <>
      <RoleGuard
        roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]}
        userRole={userRole}
      >
        <Link href="/super-admin/dashboard">
          <Section
            title="Access Requests to Society Admin"
            description="Manage access requests to the society admin."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/role-management">
          <Section
            title="Role & Society Management"
            description="Assign and manage roles across societies."
          />
        </Link>
      </RoleGuard>

      <RoleGuard
        roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]}
        userRole={userRole}
      >
        <Link href="/billing">
          <Section
            title="Payment Reports"
            description="View & export payment data."
          />
        </Link>
      </RoleGuard>

      <RoleGuard
        roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]}
        userRole={userRole}
      >
        <Link href="/accounting">
          <Section
            title="End-to-End Accounting"
            description="Track income & expenses, manage financials."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/upload-qr-admin">
          <Section
            title="Upload QR Code"
            description="Upload QR codes for society subscriptions."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/features">
          <Section
            title="Features"
            description="Explore all tools and capabilities of the app."
          />
        </Link>
      </RoleGuard>

      {/* Additional Features for Super Admin */}
      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/Facilities">
          <Section
            title="Facility Booking"
            description="Book and manage society facilities."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/allVisitor">
          <Section
            title="Visitor Management"
            description="Manage visitor entries and approvals."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/complaints">
          <Section
            title="Complaints Management"
            description="View and manage society complaints."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/polls">
          <Section
            title="Polls & Voting"
            description="Create and manage society polls."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/staff-management">
          <Section
            title="Staff Management"
            description="Manage society staff and their tasks."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/watchman-logs">
          <Section
            title="Watchman Activity Logs"
            description="View logs of all people entering and exiting the society."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/emergency-contacts">
          <Section
            title="Emergency Contacts"
            description="Manage emergency contact information."
          />
        </Link>
      </RoleGuard>

      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/notice-board">
          <Section
            title="Notice Board"
            description="Manage society notices and announcements."
          />
        </Link>
      </RoleGuard>
    </>
  );
}
