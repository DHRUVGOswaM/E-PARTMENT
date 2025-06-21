'use client';
import { useState } from 'react';

export default function Attendance() {
  const [name, setName] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [date, setDate] = useState('');
  const [report, setReport] = useState([]);

  const handleMark = async () => {
  try {
    const res = await fetch('/api/staff/attendance', {
      method: 'POST',
      body: JSON.stringify({ name, entryTime, exitTime, date }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();

    if (result.success) {
      alert('Attendance marked successfully!');
      setName('');
      setEntryTime('');
      setExitTime('');
      setDate('');
    } else {
      alert('Failed to mark attendance: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong.');
  }
};
  const fetchReport = async () => {
  try {
    const res = await fetch(`/api/attendance?name=${name}`);
    const data = await res.json();
    setReport(data);
  } catch (error) {
    console.error('Failed to fetch report:', error);
    alert('Could not fetch report. Please try again.');
  }
};

  return (
    <div className="p-6 space-y-8">

      {/* Mark Attendance Block */}
      <div className="border p-6 rounded-xl shadow-md bg-white max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Mark Attendance</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="time"
            placeholder="Entry Time"
            onChange={(e) => setEntryTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="time"
            placeholder="Exit Time"
            onChange={(e) => setExitTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleMark}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Attendance
          </button>
        </div>
      </div>

      {/* Monthly Report Block */}
      <div className="border p-6 rounded-xl shadow-md bg-white max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4"> View Monthly Report</h2>

        <div className="space-y-4">
          <button
            onClick={fetchReport}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Fetch Report
          </button>

          {report.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              {report.map((r, i) => (
                <p key={i} className="text-sm text-gray-700">
                  <strong>{r.date}</strong>: {r.entryTime} - {r.exitTime}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
