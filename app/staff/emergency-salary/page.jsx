'use client';
import { useState } from 'react';

export default function EmergencySalaryRequest() {
  const [form, setForm] = useState({
    name: '',
    staffType: '',
    amount: '',
    reason: '',
    needBy: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/emergency-salary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSubmitted(true);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="border-2 border-blue-400 bg-blue-50 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">⚠️ Emergency Salary Request</h2>

        {!submitted ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-300 rounded"
            />

            <input
              type="text"
              name="staffType"
              placeholder="Staff Type (e.g. Maid, Watchman)"
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-300 rounded"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount Needed"
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-300 rounded"
            />

            <textarea
              name="reason"
              placeholder="Reason for Emergency"
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-300 rounded"
            />

            <input
              type="date"
              name="needBy"
              onChange={handleChange}
              required
              className="w-full p-2 border border-blue-300 rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Submit Request
            </button>
          </form>
        ) : (
          <p className="text-green-700 font-medium text-center">✅ Your emergency request has been submitted!</p>
        )}
      </div>
    </div>
  );
}
