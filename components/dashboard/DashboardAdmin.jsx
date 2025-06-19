// DashboardAdmin.jsx
import Link from "next/link";
import Section from "../section";

export default function DashboardAdmin() {
  return (
    <>
      <Link href="/role-management">
        <Section title="Role & Society Management" description="Assign and manage roles across societies." />
      </Link>
      <Link href="/billing">
        <Section title="Payment Reports" description="View & export payment data." />
      </Link>
      <Link href="/accounting">
        <Section title="End-to-End Accounting" description="Track income & expenses, manage financials." />
      </Link>
      <Link href="/alerts">
        <Section title="Emergency Alerts" description="Send alerts to society members." />
      </Link>
      <Link href="/features">
        <Section title="Features" description="Explore all tools and capabilities of the app." />
      </Link>
    </>
  );
}
