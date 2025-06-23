"use client";
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import Section from '../section';

const DashboardWatchMan = () => {
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
      
        <Link href="/visitor">
          <Section
            title="Visitor Log"
            description="Log and verify visitor entries."
          />
        </Link>
      
      
      
        <Link href="/vendor/register">
          <Section
            title="Register a Vendor"
            description="Register a new vendor for society services."
          />
        </Link>
      
      
        <Link href="/vendor/scan">
          <Section
            title="Scan Vendor QR Code"
            description="Scan vendor QR codes to verify their identity."
          />
        </Link>
      
    </>
  );
}

export default DashboardWatchMan
