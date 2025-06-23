"use client";
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import Section from '../section';

const DashboardTechnician = () => {
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
      
        <Link href="/maintenance">
          <Section
            title="Maintenance Jobs"
            description="Manage assigned technical jobs."
          />
        </Link>
      
      
      
        <Link href="/complaints">
          <Section
            title="Technical Complaints"
            description="View and resolve relevant issues."
          />
        </Link>
      
    </>
  );
}

export default DashboardTechnician
