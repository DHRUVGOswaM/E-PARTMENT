import React from 'react'
import Section from '../section';
import Link from 'next/link';

const DashboardDefault = () => {
  return (
    <Link href="/join-society">
      <Section
        title="Welcome Visitor"
        description="Please join a society to access full features of thedashboard."
      />
    </Link>
  );
}

export default DashboardDefault