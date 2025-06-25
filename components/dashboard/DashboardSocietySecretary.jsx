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
      {/* --- Secretary Features --- */}
      <Link href="/visitors">
        <Section
          title="Visitor Management"
          description="Manage visitor entries and approvals."
        />
      </Link>

      <Link href="/billing">
        <Section
          title="Payment Reports"
          description="Access and export billing details."
        />
      </Link>

      <Link href="/notice-board">
        <Section
          title="Noticeboard Management"
          description="Post and manage society notices."
        />
      </Link>

      <Link href="/accounting">
        <Section
          title="Accounting"
          description="Track expenses and society transactions."
        />
      </Link>

      <Link href="/polls">
        <Section
          title="Polls & Voting"
          description="Manage society polls and feedback."
        />
      </Link>

      <Link href="/dashboard/society-admin">
        <Section
          title="Society Admin Panel"
          description="Access society management features."
        />
      </Link>

      <Link href="/dashboard/society-admin/access-requests">
        <Section
          title="Access Requests"
          description="Approve or reject user access requests."
        />
      </Link>

      {/* --- Staff Management Panel --- */}
      <Link href="/staff-management/add-staff">
        <Section
          title="Add New Staff"
          description="Register new staff for society."
        />
      </Link>

      <Link href="/staff-management/leave-requests">
        <Section
          title="Manage Leave Requests"
          description="Review and process staff leave."
        />
      </Link>

      <Link href="/staff-management/assign">
        <Section
          title="Assign Shift"
          description="Allocate shift timings to staff."
        />
      </Link>

      <Link href="/staff-management/assign-task">
        <Section
          title="Assign Task"
          description="Distribute daily staff responsibilities."
        />
      </Link>

      <Link href="/staff-management/upload-salary-slip">
        <Section
          title="Upload Salary Slip"
          description="Upload monthly staff salary slips."
        />
      </Link>
    </>
  );
}
