import Link from 'next/link';
import React from 'react'
import Section from '../section';

const DashboardHouseOwner = () => {
  return (
    <>
      <Link href="/facilities">
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
      <Link href="/polls">
        <Section
          title="Polls & Voting"
          description="Participate in ongoing polls."
        />
      </Link>
    </>
  );
}

export default DashboardHouseOwner