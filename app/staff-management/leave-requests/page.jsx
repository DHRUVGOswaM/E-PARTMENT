'use client'
import { useEffect, useState } from 'react';

export default function ManageLeave() {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetch('/api/staff/leave')
      .then(res => res.json())
      .then(data => setLeaveRequests(data));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const res = await fetch(`/api/staff/leave/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setLeaveRequests(prev =>
        prev.map(leave =>
          leave.id === id ? { ...leave, status: newStatus } : leave
        )
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Manage Leave Requests</h2>
      {leaveRequests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.id}>
                <td className="p-2 border">{leave.staff.name}</td>
                <td className="p-2 border">{leave.reason}</td>
                <td className="p-2 border">{leave.status}</td>
                <td className="p-2 border space-x-2">
                  <button onClick={() => handleStatusChange(leave.id, 'Approved')} className="bg-green-500 text-white px-3 py-1 rounded">
                    Approve
                  </button>
                  <button onClick={() => handleStatusChange(leave.id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
