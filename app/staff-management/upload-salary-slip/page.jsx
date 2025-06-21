// app/society-management/upload-salary-slip/page.jsx
"use client";
import { useState } from "react";

export default function UploadSalarySlip() {
  const [formData, setFormData] = useState({ staffId: "", month: "", year: "", slip: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "slip") {
      setFormData({ ...formData, slip: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("staffId", formData.staffId);
    data.append("month", formData.month);
    data.append("year", formData.year);
    data.append("slip", formData.slip);

    const res = await fetch("/api/staff/upload-slip", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert("Salary slip uploaded successfully");
    } else {
      alert("Failed to upload slip");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Upload Salary Slip</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input type="text" name="staffId" placeholder="Staff ID" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="month" name="month" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="year" placeholder="Year (e.g. 2025)" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="file" name="slip" accept="application/pdf" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-700 text-white p-2 rounded">Upload Slip</button>
      </form>
    </div>
  );
}
