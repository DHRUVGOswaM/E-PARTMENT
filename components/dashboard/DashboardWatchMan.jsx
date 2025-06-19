import React from 'react'
import Link from "next/link";
import Section from '../section';

const DashboardWatchMan = () => {
  return (
    <>
      <Link href="/visitors">
        <Section
          title="Visitor Log"
          description="Log and verify visitor entries."
        />
      </Link>
      <Link href="/alerts">
        <Section
          title="Emergency Alerts"
          description="Notify residents during emergencies."
        />
      </Link>
    </>
  );
}

export default DashboardWatchMan