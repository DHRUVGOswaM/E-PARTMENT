// app/staff/page.jsx
"use client";

import Link from "next/link";

export default function StaffHome() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Welcome to Staff Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Staff Component */}
         <div className="border rounded-xl p-6 shadow bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Staff Panel</h2>
        <ul className="space-y-2">
            <li><Link className="text-blue-600 hover:underline" href="/staff/attendance">Mark Attendance</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff/leave">Apply Leave</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff/salary">View Salary</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff/emergency-salary">Emergency Salary Request</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff/view-shift-task">View Shift/Task</Link></li>
          </ul>
        </div>

        {/* Staff Management Component */}
       <div className="border rounded-xl p-6 shadow bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Staff Management (Admin Only)</h2>
        <ul className="space-y-2">
            <li><Link className="text-blue-600 hover:underline" href="/staff-management/add-staff">Add New Staff</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff-management/leave-requests">Manage Leave Requests</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff-management/assign-shift">Assign Shift</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff-management/assign-task">Assign Task</Link></li>
            <li><Link className="text-blue-600 hover:underline" href="/staff-management/upload-salary-slip">Upload Salary Slip</Link></li>
          </ul>
        </div>

        {/* Resident Feedback Component */}
        <div className="border rounded-xl p-6 shadow bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Resident Feedback</h2>
          <ul className="space-y-2">
            <li><Link className="text-blue-600 hover:underline" href="/resident-feedback">Submit Feedback</Link></li>
          </ul>
        </div>

      </div>
    </div>
  );
}
