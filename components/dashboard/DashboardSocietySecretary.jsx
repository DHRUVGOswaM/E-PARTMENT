"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Section from "../section";

export default function DashboardSocietySecretary() {
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
      {/* --- Core Society Management --- */}
      <Link href="/dashboard/society-admin">
        <Section
          title="Society Admin Panel"
          description="Access complete society management features and staff management."
        />
      </Link>

      <Link href="/allVisitor">
        <Section
          title="Visitor Management"
          description="Manage visitor entries and approvals."
        />
      </Link>

      <Link href="/Accounting">
        <Section
          title="Financial Management"
          description="Access accounting, billing, and financial reports."
        />
      </Link>


      <Link href="/polls">
        <Section
          title="Polls & Voting"
          description="Manage society polls and community decisions."
        />
      </Link>

      <Link href="/dashboard/society-admin/upload-qr">
        <Section
          title="Payment Setup"
          description="Upload and manage UPI QR codes for payments."
        />
      </Link>

    </>
  );
}
