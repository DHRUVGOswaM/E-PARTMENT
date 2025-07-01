"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react'
import Section from '../section';

const DashboardHouseOwner = () => {
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
        <Link href="/Facilities">
          <Section
            title="Facility Booking"
            description="Book amenities like the gym or hall."
          />
        </Link>
        <Link href="/complaints">
          <Section
            title="File a Complaint"
            description="Raise society-related issues or requests."
          />
        </Link>
        <Link href="/dashboard/visitor/new">
          <Section
            title="Add Visitor"
            description="Add a new visitor and Share the QR code with your visitor."
          />
        </Link>
        <Link href="/pay-with-qr">
        <Section
          title="Pay with UPI QR for Dues"
          description="Scan the UPI QR code to pay your dues and maintainence fees."
        />
      </Link>
    </>
  );
}

export default DashboardHouseOwner
