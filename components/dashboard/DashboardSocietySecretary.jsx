import Link from "next/link";
import Section from "../section";

export default function DashboardSocietySecretary() {
  return (
    <>
      <Link href="/visitors">
        <Section
          title="Visitor Management"
          description="Manage visitor entries and approvals."
        />
      </Link>
      <Link href="/billing">
        <Section
          title="Payment Reports"
          description="Access and export billing details."
        />
      </Link>
      <Link href="/notice-board">
        <Section
          title="Noticeboard Management"
          description="Post and manage society notices."
        />
      </Link>
      <Link href="/accounting">
        <Section
          title="Accounting"
          description="Track expenses and society transactions."
        />
      </Link>
      <Link href="/polls">
        <Section
          title="Polls & Voting"
          description="Manage society polls and feedback."
        />
      </Link>
    </>
  );
}
