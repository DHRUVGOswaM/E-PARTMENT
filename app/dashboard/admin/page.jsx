// // File: app/dashboard/admin/page.jsx

// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { headers } from "next/headers";

// export default async function AdminDashboardPage() {
//   try {
//     const user = await currentUser();
    
//     if (!user) {
//       console.warn("⚠️ No Clerk user found, redirecting to sign-in");
//       redirect("/sign-in");
//     }

//     // Log complete user metadata for debugging
//     console.log("✅ Clerk user details:", {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       metadata: user.publicMetadata,
//       originalRole: user.publicMetadata?.role
//     });

//     // Check Clerk role first with case-insensitive comparison
//     const clerkRole = (user.publicMetadata?.role || "").toUpperCase();
//     console.log("✅ Normalized Clerk role:", clerkRole);
    
//     if (clerkRole !== "ADMIN") {
//       console.warn("⚠️ Unauthorized: Clerk role is not ADMIN", {
//         providedRole: clerkRole,
//         requiredRole: "ADMIN"
//       });
//       redirect("/dashboard");
//     }
//     // Get the host from headers - properly awaited
//     const headersList = await headers();
//     const host = headersList.get("host");
//     const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    
//     // Construct the API URL using the current host
//     const apiUrl = `${protocol}://${host}/api/me`;
//     console.log("✅ Making API request to:", apiUrl);

//     const res = await fetch(apiUrl, {
//       headers: {
//         Cookie: `__session=${user?.sessionId}`,
//       },
//       cache: "no-store",
//     });

//     console.log("✅ API response status:", res.status);

//     if (!res.ok) {
//       throw new Error(`API request failed with status ${res.status}`);
//     }

//     const data = await res.json();
//     console.log("✅ API response:", data);
//     if (!data?.user) {
//       console.error("❌ API response missing user data");
//       throw new Error("Invalid API response format");
//     }

//     // Check API role with case-insensitive comparison
//     const apiRole = (data.user.role || "").toUpperCase();
//     console.log("✅ Normalized API role:", apiRole);
    
//     if (apiRole !== "ADMIN") {
//       console.warn("⚠️ Unauthorized: API role is not ADMIN", {
//         providedRole: apiRole,
//         requiredRole: "ADMIN"
//       });
//       redirect("/dashboard");
//     }

//     // If we get here, both role checks passed
//     console.log("✅ Authorization successful: User is admin");

//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold text-blue-800 mb-4">
//         Admin Control Panel
//       </h1>
//       <p className="text-gray-700">
//         Welcome, Admin. Here you can manage everything.
//       </p>

//       {/* Add your management sections below */}
//       <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-2">User Management</h2>
//           <p className="text-sm text-gray-600">Add, remove or update users.</p>
//         </div>
//         <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Society Settings</h2>
//           <p className="text-sm text-gray-600">
//             Configure rules, timings and more.
//           </p>
//         </div>
//         <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Visitor Logs</h2>
//           <p className="text-sm text-gray-600">
//             View or export visitor history.
//           </p>
//         </div>
//         <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-2">Maintenance Requests</h2>
//           <p className="text-sm text-gray-600">
//             Track and assign maintenance tasks.
//           </p>
//         </div>
//       </div>
//     </main>
//   );
//   } catch (error) {
//     console.error("❌ Error in admin page:", error);
//     console.error("Error details:", {
//       message: error.message,
//       stack: error.stack
//     });

//     return (
//       <div className="p-6">
//         <h1 className="text-2xl text-red-600">Error</h1>
//         <p className="text-gray-700">
//           Failed to load admin dashboard. Please try again later.
//         </p>
//         <p className="text-sm text-gray-500 mt-2">
//           Error: {error.message}
//         </p>
//       </div>
//     );
//   }
// }



// File: app/dashboard/admin/page.jsx







//*********************************************************************************************************** */
// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/prisma";
// import { redirect } from "next/navigation";

// export default async function AdminDashboardPage() {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       console.warn("⚠️ No Clerk user found, redirecting to sign-in");
//       redirect("/sign-in");
//     }

//     // Get user details from your own DB
//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) {
//       console.warn("⚠️ No matching user in DB");
//       redirect("/dashboard");
//     }

//     const userRole = (user.role || "").toUpperCase();
//     console.log("✅ DB Role:", userRole);

//     if (userRole !== "ADMIN") {
//       console.warn("⚠️ Unauthorized: Role is not ADMIN", {
//         role: userRole,
//       });
//       redirect("/dashboard");
//     }

//     console.log("✅ Admin access granted");

//     return (
//       <main className="p-6">
//         <h1 className="text-3xl font-bold text-blue-800 mb-4">
//           Admin Control Panel
//         </h1>
//         <p className="text-gray-700">
//           Welcome, Admin. Here you can manage everything.
//         </p>

//         {/* Management Cards */}
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold mb-2">User Management</h2>
//             <p className="text-sm text-gray-600">
//               Add, remove or update users.
//             </p>
//           </div>
//           <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold mb-2">Society Settings</h2>
//             <p className="text-sm text-gray-600">
//               Configure rules, timings and more.
//             </p>
//           </div>
//           <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold mb-2">Visitor Logs</h2>
//             <p className="text-sm text-gray-600">
//               View or export visitor history.
//             </p>
//           </div>
//           <div className="p-6 border border-gray-200 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold mb-2">Maintenance Requests</h2>
//             <p className="text-sm text-gray-600">
//               Track and assign maintenance tasks.
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   } catch (error) {
//     console.error("❌ Error loading admin page:", error.message);
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl text-red-600">Error</h1>
//         <p className="text-gray-700">
//           Failed to load admin dashboard. Please try again later.
//         </p>
//         <p className="text-sm text-gray-500 mt-2">
//           Error: {error.message}
//         </p>
//       </div>
//     );
//   }
// }

"use client"

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const roles = [
    "SUPER_ADMIN",
    "SOCIETY_ADMIN",
    "SOCIETY_SECRETARY",
    "STAFF",
    "TECHNICIAN",
    "WATCHMAN",
    "HOUSE_OWNER",
    "SOCIETY_MEMBER",
    "VISITOR",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users/all");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      await axios.put("/api/users/role", { userId, newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Error updating role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin Panel - Manage User Roles
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Current Role</th>
              <th className="px-4 py-2 border">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center border-t">
                <td className="px-4 py-2 border">{user.name || "-"}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td className="px-4 py-2 border">
                  <select
                    className="border p-1"
                    value={user.role || "VISITOR"}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    disabled={updatingUserId === user.id}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
