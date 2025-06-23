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
      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/role-management">
          <Section title="Role & Society Management" description="Assign and manage roles across societies." />
        </Link>
      </RoleGuard>
      
      <RoleGuard roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]} userRole={userRole}>
        <Link href="/billing">
          <Section title="Payment Reports" description="View & export payment data." />
        </Link>
      </RoleGuard>
      
      <RoleGuard roles={["SUPER_ADMIN", "SOCIETY_SECRETARY"]} userRole={userRole}>
        <Link href="/accounting">
          <Section title="End-to-End Accounting" description="Track income & expenses, manage financials." />
        </Link>
      </RoleGuard>
      
      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/alerts">
          <Section title="Emergency Alerts" description="Send alerts to society members." />
        </Link>
      </RoleGuard>
      
      <RoleGuard roles={["SUPER_ADMIN"]} userRole={userRole}>
        <Link href="/features">
          <Section title="Features" description="Explore all tools and capabilities of the app." />
        </Link>
      </RoleGuard>
    </>
  );
}
