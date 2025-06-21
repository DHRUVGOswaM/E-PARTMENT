"use client";
import { useState } from "react";

export default function AssignTask() {
  const [formData, setFormData] = useState({ staffId: "", task: "", deadline: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/staff/assign-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) alert("Task assigned!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Assign Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="staffId" placeholder="Staff ID" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="task" placeholder="Task Description" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="date" name="deadline" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-700 text-white p-2 rounded">Assign</button>
      </form>
    </div>
  );
}
