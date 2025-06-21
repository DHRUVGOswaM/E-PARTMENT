"use client";
import { useState } from "react";

export default function AssignShift() {
  const [formData, setFormData] = useState({ staffId: "", date: "", startTime: "", endTime: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/staff/assign-shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) alert("Shift assigned!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Assign Shift</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="staffId" placeholder="Staff ID" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="date" name="date" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="time" name="startTime" placeholder="Start Time" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="time" name="endTime" placeholder="End Time" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-700 text-white p-2 rounded">Assign</button>
      </form>
    </div>
  );
}

