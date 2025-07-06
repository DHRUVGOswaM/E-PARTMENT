"use client";

import { Loader2, PhoneCall, XCircle, Settings, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardAdmin from "../../components/dashboard/DashboardAdmin";
import DashboardSocietySecretary from "../../components/dashboard/DashboardSocietySecretary";
import DashboardHouseOwner from "../../components/dashboard/DashboardHouseOwner";
import DashboardStaff from "../../components/dashboard/DashboardStaff";
import DashboardDefault from "../../components/dashboard/DashboardDefault";




export default function Dashboard() {
  const [role, setRole] = useState("VISITOR");
  const [userFirstName, setUserFirstName] = useState("");
  const [societyId, setSocietyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marqueeNotices, setMarqueeNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showManageNotices, setShowManageNotices] = useState(false);

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

        setIsAdmin(["SUPER_ADMIN", "SOCIETY_SECRETARY", "SOCIETY_ADMIN"].includes(data.role));
        setSocietyId(data.societyId);

        if (data.societyId) {
          const noticeRes = await fetch(`/api/marquee?societyId=${data.societyId}`);
          const notices = await noticeRes.json();
          setMarqueeNotices(notices);
        }

      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, []);


  const handleRemoveNotice = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) {
      return;
    }
    
    try {
      const res = await fetch("/api/marquee", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
  
      if (res.ok) {
        setMarqueeNotices((prev) => prev.filter((n) => n.id !== id));
      } else {
        throw new Error("Failed to delete notice");
      }
    } catch (err) {
      console.error("Failed to delete notice:", err);
      alert("Error deleting notice. Please try again.");
    }
  };


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
      case "STAFF":
      case "TECHNICIAN":
        return <DashboardStaff />;

      case "HOUSE_OWNER":
      case "SOCIETY_MEMBER":
      case "TENANT":
      case "RESIDENT":
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

      {/* ✅ Enhanced Marquee Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        {/* Marquee Display */}
        <div className="bg-blue-200 rounded-md text-blue-900 p-3 mb-4 text-sm font-medium">
          {marqueeNotices.length > 0 ? (
            <marquee behavior="scroll" direction="left" scrollamount="4">
              <span className="text-red-700 text-lg md:text-xl font-bold">
                {marqueeNotices.map((n) => n.content).join(" ❘ ")}
              </span>
            </marquee>
          ) : (
            <div className="text-center text-gray-500 py-2">
              No notices to display
            </div>
          )}
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="space-y-4">
            {/* Toggle Manage View */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-800">Notice Management</h3>
              <button
                onClick={() => setShowManageNotices(!showManageNotices)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
              >
                {showManageNotices ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="whitespace-nowrap">{showManageNotices ? 'Hide Management' : 'Manage Notices'}</span>
              </button>
            </div>

            {/* Add New Notice Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newNotice.trim()) return;

                try {
                  const res = await fetch("/api/marquee", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: newNotice, societyId }),
                  });

                  if (res.ok) {
                    const added = await res.json();
                    setMarqueeNotices((prev) => [added, ...prev]);
                    setNewNotice("");
                  } else {
                    throw new Error("Failed to add notice");
                  }
                } catch (err) {
                  console.error("Error adding notice:", err);
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newNotice}
                onChange={(e) => setNewNotice(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Add new marquee notice"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>

            {/* Notice Management List */}
            {showManageNotices && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Current Notices:</h4>
                {marqueeNotices.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {marqueeNotices.map((notice) => (
                      <div
                        key={notice.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-md gap-2"
                      >
                        <span className="flex-1 text-sm text-gray-700 break-words">
                          {notice.content}
                        </span>
                        <button
                          onClick={() => handleRemoveNotice(notice.id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-xs font-medium sm:w-auto w-full"
                          title="Delete notice"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No notices created yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Access Section */}
      <div className="flex justify-center mx-auto max-w-6xl mb-8">
        <Link
          href="/emergency-contacts"
          className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-red-100 transition-all"
        >
          <PhoneCall className="text-red-500" />
          <span className="text-blue-800 font-semibold">
            Emergency Contacts
          </span>
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
