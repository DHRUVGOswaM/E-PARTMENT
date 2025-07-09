"use client";
import React, { useState, useEffect } from 'react'
import Section from '../section';
import Link from 'next/link';

const DashboardDefault = () => {
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
      <Link href="/join-society">
        <Section
          title="Welcome Visitor"
          description="Please join a society to access full features of the dashboard."
        />
      </Link>
      
      <Link href="/society-admin/request">
        <Section
          title="Request Admin Access"
          description="Apply for society admin privileges."
        />
      </Link>

      <Link href="/society-admin/payment">
        <Section
          title="Proceed to Pay the Fee"
          description="If you have been approved as a society admin, please proceed to pay the fee."
        />
      </Link>
    </>
  );
}

export default DashboardDefault
