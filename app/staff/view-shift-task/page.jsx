'use client';
import { useEffect, useState } from 'react';

export default function ViewShiftTask() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await fetch('/api/staff/view-shift-task');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching shift/task:', err);
      }
    }

    fetchAssignments();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Assigned Shift & Task</h1>

      {data.length === 0 ? (
        <p className="text-gray-500">No shift or task assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-xl p-4 border">
              {/* Shift Details */}
<p><strong>Shift Time:</strong> {item.shiftTime}</p>
<p><strong>Assigned To:</strong> {item.staffName}</p>

{/* Task Details */}
<p><strong>Task:</strong> {item.task}</p>

{/* Assigned Date */}
<p><strong>Assigned On:</strong> {new Date(item.createdAt).toLocaleString()}</p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
