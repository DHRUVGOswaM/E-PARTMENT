'use client';
import { useState } from 'react';

export default function LeavePage() {
  const [name, setName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/staff/leave', {
        method: 'POST',
        body: JSON.stringify({ name, fromDate, toDate, reason }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log('Leave submitted successfully');
        setMessage('Leave submitted successfully!');
        setName('');
        setFromDate('');
        setToDate('');
        setReason('');
      } else {
        console.log('Failed to submit leave');
        setMessage('Failed to submit leave');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong!');
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`/api/staff/leave`);
      const data = await res.json();
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leave history:', error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Apply for Leave Block */}
      <div className="border p-6 rounded-xl shadow-md bg-white max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Apply for Leave</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Reason for Leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={() => handleSubmit()}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Leave Request
          </button>

          {message && (
            <p className="text-green-700 text-sm mt-2 text-center">{message}</p>
          )}
        </div>
      </div>

      {/* View Leave History Block */}
      <div className="border p-6 rounded-xl shadow-md bg-white max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">View Leave History</h2>

        <div className="space-y-4">
          <button
            onClick={() => fetchLeaves()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Fetch Leave History
          </button>

          {leaves.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              {leaves.map((l, i) => (
                <p key={i} className="text-sm text-gray-700">
                  <strong>{l.fromDate} → {l.toDate}</strong>: {l.reason}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
