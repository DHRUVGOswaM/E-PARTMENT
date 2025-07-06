"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStaffPage() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [salary, setSalary] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── fetch current user role ────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/users/me");
        if (r.ok) {
          const { role } = await r.json();
          setRole(role);
        }
      } finally {
        setLoadingRole(false);
      }
    })();
  }, []);

  // ── access control ────────────────────────────────────────
  if (loadingRole) return <p className="p-6 text-blue-800">Loading…</p>;
  if (role !== "SOCIETY_ADMIN" && role !== "SUPER_ADMIN") {
    return (
      <p className="p-6 text-red-600 font-medium">
        Access denied – only Society Admins or Super Admins can add staff.
      </p>
    );
  }

  // ── submit handler ────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    
    // Validate phone number before submitting
    if (phoneNumber && !/^[6-9]\d{9}$/.test(phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/staff-management/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role: staffRole, salary, phoneNumber }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed");
      }
      router.push("/staff"); // success redirect
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── form UI ───────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Add New Staff</h1>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role / Title</label>
          <input
            className="w-full border rounded p-2"
            value={staffRole}
            onChange={(e) => setStaffRole(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salary (₹)</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            className={`w-full border rounded p-2 ${phoneError ? 'border-red-500' : ''}`}
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              if (value.length <= 10) {
                setPhoneNumber(value);
                setPhoneError('');
                if (value.length === 10 && !/^[6-9]/.test(value)) {
                  setPhoneError('Mobile number must start with 6, 7, 8, or 9');
                }
              }
            }}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            required
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Add Staff"}
        </button>
      </form>
    </div>
  );
}
