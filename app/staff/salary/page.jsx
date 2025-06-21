'use client';
import { useState } from 'react';

export default function SalaryPage() {
  const [name, setName] = useState('');
  const [slip, setSlip] = useState(null);

  const fetchSlip = async () => {
    const res = await fetch(`/api/salary-slip?name=${name}`);
    const data = await res.json();
    setSlip(data);
  };

  const downloadSlip = () => {
    const content = `
====== Salary Slip ======
Name: ${slip.name}
Month: ${slip.month}
Amount: ₹${slip.amount}
Status: ${slip.status}
Generated At: ${slip.generatedAt}
=========================
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slip.name}_salary_slip.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-8">

      {/* Input Section */}
      <div className="border-2 border-blue-300 p-6 rounded-xl shadow-md bg-blue-50 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">💼 View Salary Slip</h2>

        <input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-blue-300 rounded mb-4"
        />

        <button
          onClick={fetchSlip}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          View Slip
        </button>
      </div>

      {/* Slip Display Section */}
      {slip && (
        <div className="border-2 border-blue-400 bg-blue-100 p-6 rounded-xl max-w-xl mx-auto shadow-md">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">🧾 Salary Slip</h3>

          <div className="space-y-2 text-blue-900">
            <p><strong>Name:</strong> {slip.name}</p>
            <p><strong>Month:</strong> {slip.month}</p>
            <p><strong>Amount:</strong> ₹{slip.amount}</p>
            <p><strong>Status:</strong> {slip.status}</p>
            <p><strong>Generated At:</strong> {slip.generatedAt}</p>
          </div>

          <button
            onClick={downloadSlip}
            className="mt-6 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Download Slip
          </button>
        </div>
      )}
    </div>
  );
}
