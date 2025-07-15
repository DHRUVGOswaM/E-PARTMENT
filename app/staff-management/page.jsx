"use client"

// app/(your-app-path)/StaffCenter.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function StaffCenter() {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/staff-management/staff");
        if (res.ok) setStaff(await res.json());
        else toast.error("Failed to load staff list");
      } catch (err) {
        console.error(err);
        toast.error("Error loading staff");
      } finally {
        setLoading(false);
      }
    })();
  }, );

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/staff-management/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        toast.success("Status updated");
        setStaff((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-blue-700">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Staff Center</h1>

      <Card>
        <CardContent className="p-6">
          <p className="font-medium">
            Total Staff: <span className="text-blue-700">{staff.length}</span>
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {staff.map((s) => {
          const latestSalary = s.Salary[0];
          return (
            <Card key={s.id} className="relative">
              <CardContent className="p-6 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{s.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Role:{" "}
                      <span className="font-medium text-black">{s.role}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <select
                        value={s.staffRole}
                        onChange={(e) => updateStatus(s.id, e.target.value)}
                        className="border px-2 py-1 rounded-md text-sm"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="NON_ACTIVE">INACTIVE</option>
                      </select>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Current Salary: ₹
                      {latestSalary ? latestSalary.amount : s.salary}
                    </p>
                    {latestSalary && (
                      <p className="text-sm text-muted-foreground">
                        Last Paid:{" "}
                        {new Date(latestSalary.payDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
