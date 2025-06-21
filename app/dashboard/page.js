"use client";

import {  Loader2, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardAdmin from "../../components/dashboard/DashboardAdmin";
import DashboardSocietySecretary from "../../components/dashboard/DashboardSocietySecretary";
import DashboardWatchMan from "../../components/dashboard/DashboardWatchMan";
import DashboardHouseOwner from "../../components/dashboard/DashboardHouseOwner";
import DashboardStaff from "../../components/dashboard/DashboardStaff";
import DashboardTechnician from "../../components/dashboard/DashboardTechnician";
import DashboardDefault from "../../components/dashboard/DashboardDefault";

const sampleNotices = [
  "Water supply will be off from 2 PM to 5 PM.",
  "Maintenance charges due by 30th May.",
  "Annual General Meeting on 15th June at 5 PM.",
  "New security staff onboarding tomorrow.",
];


export default function Dashboard() {
  const [role, setRole] = useState("VISITOR");
  const [userFirstName, setUserFirstName] = useState("");
  const [loading, setLoading] = useState(true);

  //fetch user details from api/users/me
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await res.json();
        setRole(data.role);
        setUserFirstName(data.firstName || data.name || "User");
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800 text-xl">
        Loading dashboard...
        <Loader2 className="animate-spin ml-2 text-blue-500" />
      </div>
    );
  }

  // Helper to pick the right chunk ⬇
  const renderRoleDashboard = () => {
    switch (role) {
      case "SUPER_ADMIN":
        return <DashboardAdmin />;

      case "SOCIETY_SECRETARY":
      case "SOCIETY_ADMIN":
        return <DashboardSocietySecretary />;

      case "WATCHMAN":
        return <DashboardWatchMan />;
        
      case "STAFF":
        return <DashboardStaff />;

      case "TECHNICIAN":
        return <DashboardTechnician />;

      case "HOUSE_OWNER":
      case "SOCIETY_MEMBER":
        return <DashboardHouseOwner />;

      default:
        return <DashboardDefault />;
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-900 text-center">
        Welcome, <span className="text-blue-700">{userFirstName}</span>!
      </h1>

      <div className="bg-blue-200 rounded-md text-blue-900 p-3 mb-6 text-sm font-medium shadow-sm">
        <marquee behavior="scroll" direction="left" scrollamount="4">
          {sampleNotices.join(" ❘ ")} {/* vertical bar separator */}
        </marquee>
      </div>

      {/* Quick Access Section */}
      <div className="flex justify-between mx-auto max-w-6xl mb-8">
        <Link
          href="/emergency-contacts"
          className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-100 transition-all"
        >
          <PhoneCall className="text-red-500" />
          <span className="text-blue-800 font-semibold">
            Emergency Contacts
          </span>
        </Link>

        <Link
          href="/notice-board"
          className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-100 transition-all"
        >
          <span className="text-yellow-600 text-lg">📌</span>
          <span className="text-blue-800 font-semibold">Notice Board</span>
        </Link>
      </div>

      {/* Role-Based Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderRoleDashboard()}
      </div>
    </div>
  );
}

function Section(props) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">
        {props.title}
      </h2>
      <p className="text-gray-600">{props.description}</p>
    </div>
  );
}
