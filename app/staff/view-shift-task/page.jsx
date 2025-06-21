"use client";
import { useEffect, useState } from "react";

export default function ViewShiftTask() {
  const [data, setData] = useState([]);

  const fetchShiftTask = async () => {
    try {
      const res = await fetch("/api/staff/view-shift-task"); // Your API to fetch data
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch shift & task data:", err);
    }
  };

  useEffect(() => {
    fetchShiftTask();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-8 border border-blue-200">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Your Assigned Shift & Tasks</h1>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">No shift or task assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-300">
              <p><span className="font-semibold">Date:</span> {item.date}</p>
              <p><span className="font-semibold">Shift:</span> {item.shift}</p>
              <p><span className="font-semibold">Task:</span> {item.task}</p>
              <p><span className="font-semibold">Time:</span> {item.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
