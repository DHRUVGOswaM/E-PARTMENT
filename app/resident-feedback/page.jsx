// app/resident-feedback/page.jsx
"use client";
import { useState } from "react";

export default function ResidentFeedback() {
  const [formData, setFormData] = useState({ name: "", flat: "", staffName: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/resident/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Feedback submitted successfully");
      setFormData({ name: "", flat: "", staffName: "", message: "" });
    } else {
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Feedback for Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="flat"
          value={formData.flat}
          onChange={handleChange}
          placeholder="Flat Number"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="staffName"
          value={formData.staffName}
          onChange={handleChange}
          placeholder="Staff Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Feedback for Staff"
          className="w-full p-2 border rounded h-32"
          required
        ></textarea>
        <button type="submit" className="bg-blue-700 text-white p-2 rounded">Submit Feedback</button>
      </form>
    </div>
  );
}
