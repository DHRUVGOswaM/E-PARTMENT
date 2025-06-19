import React from 'react'
import Link from "next/link";
import Section from '../section';

const DashboardTechnician = () => {
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