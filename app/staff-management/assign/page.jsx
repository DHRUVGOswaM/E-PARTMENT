'use client';
import { useState } from 'react';

export default function AssignShiftTaskPage() {
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Create a combined assignment object
  const assignmentData = {
    staffName: staffId, // assuming staffId is the name or unique ID
    shiftTime: `${date} | ${time} | ${location}`, // join all shift info
    task: `${title} - ${description} (Due: ${dueDate})`,
  };

  const res = await fetch('/api/staff-management/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignmentData),
  });

  const result = await res.json();
  if (result.success) {
    alert('Shift and Task Assigned Successfully');
  } else {
    alert('Error assigning task.');
    console.log(result.error);
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Assign Shift & Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Staff ID/Staff Name"
          className="border p-2 w-full rounded"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        />

        {/* Shift Section */}
        <h2 className="text-lg font-semibold mt-4">Shift Details</h2>
        <input
          type="date"
          className="border p-2 w-full rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Time (e.g., 9AM - 5PM)"
          className="border p-2 w-full rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 w-full rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {/* Task Section */}
        <h2 className="text-lg font-semibold mt-4">Task Details</h2>
        <input
          type="text"
          placeholder="Task Title"
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          className="border p-2 w-full rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          className="border p-2 w-full rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Assign
        </button>
      </form>
    </div>
  );
}
