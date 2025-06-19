import Link from 'next/link';
import React from 'react'
import Section from '../section';

const DashboardStaff = () => {
  return (
    <>
      <Link href="/staff">
        <Section
          title="Assigned Tasks"
          description="Check and update your current tasks."
        />
      </Link>
      <Link href="/complaints">
        <Section
          title="Complaints"
          description="View maintenance or staff-related complaints."
        />
      </Link>
    </>
  );
}

export default DashboardStaff