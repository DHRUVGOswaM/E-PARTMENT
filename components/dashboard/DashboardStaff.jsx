// app/dashboard/components/DashboardStaff.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Section from "../section";
import RoleGuard from "../RoleGuard";

export default function DashboardStaff() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get role from /api/users/me
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
      {/* ─────── STAFF SELF-SERVICE FEATURES ─────── */}
      <RoleGuard roles={["STAFF", "WATCHMAN", "TECHNICIAN"]} userRole={userRole}>
        <Link href="/staff">
          <Section
            title="Staff Portal"
            description="Access all staff features, salary, leave, and shift information."
          />
        </Link>
        <Link href="/complaints">
          <Section
            title="View Complaints"
            description="View and respond to resident maintenance complaints."
          />
        </Link>
      </RoleGuard>

      {/* ─────── WATCHMAN SPECIFIC FEATURES ─────── */}
      <RoleGuard roles={["WATCHMAN"]} userRole={userRole}>
        <Link href="/watchman">
          <Section
            title="Watchman Dashboard"
            description="Manage entry logs, visitors, and vendor access."
          />
        </Link>
      </RoleGuard>
    </>
  );
}
