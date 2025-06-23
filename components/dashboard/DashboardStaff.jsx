// app/dashboard/components/DashboardStaff.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Section from "../section";      // adjust path if Section lives elsewhere
import RoleGuard from "../RoleGuard";  // adjust path if needed

export default function DashboardStaff() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get role from /api/users/me (keeps logic in one place)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        } else {
          console.error("Failed role fetch: ", res.status);
        }
      } catch (err) {
        console.error("Role fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full py-8 text-blue-800">
        <Loader2 className="mr-2 animate-spin text-blue-500" />
        Loading…
      </div>
    );
  }

  return (
    <>
      {/* ─────── STAFF SELF-SERVICE PANEL ─────── */}
      <RoleGuard roles={["STAFF"]} userRole={userRole}>
        <Link href="/staff/attendance">
          <Section
            title="Mark Attendance"
            description="Clock in / out for your shift."
          />
        </Link>
        <Link href="/staff/leave">
          <Section
            title="Apply Leave"
            description="Submit leave applications."
          />
        </Link>
        <Link href="/staff/salary">
          <Section
            title="View Salary"
            description="Download your salary slip."
          />
        </Link>
        <Link href="/staff/emergency-salary">
          <Section
            title="Emergency Salary Request"
            description="Request an advance payout."
          />
        </Link>
        <Link href="/staff/view-shift-task">
          <Section
            title="View Shift / Task"
            description="See today’s shift & tasks."
          />
        </Link>
        <Link href="/complaints">
          <Section
            title="Complaints"
            description="View resident maintenance complaints."
          />
        </Link>
      </RoleGuard>

      {/* ─────── STAFF-MANAGEMENT PANEL (ADMIN-ONLY) ─────── */}
      <RoleGuard
        roles={[ "SUPER_ADMIN", "SOCIETY_ADMIN"]}
        userRole={userRole}
      >
        <Link href="/staff-management/add-staff">
          <Section
            title="Add New Staff"
            description="On-board new team members."
          />
        </Link>
        <Link href="/staff-management/leave-requests">
          <Section
            title="Manage Leave Requests"
            description="Approve or reject leave."
          />
        </Link>
        <Link href="/staff-management/assign-shift">
          <Section
            title="Assign Shift"
            description="Create or modify shift schedule."
          />
        </Link>
        <Link href="/staff-management/assign-task">
          <Section
            title="Assign Task"
            description="Allocate daily tasks."
          />
        </Link>
        <Link href="/staff-management/upload-salary-slip">
          <Section
            title="Upload Salary Slip"
            description="Publish salary slips for staff."
          />
        </Link>
      </RoleGuard>
    </>
  );
}
