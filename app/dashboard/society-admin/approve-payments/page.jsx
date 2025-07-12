"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const paymentModes = ["ALL", "CASH", "UPI", "BANK_TRANSFER", "CHEQUE"];

export default function ApprovePayments() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMode, setSelectedMode] = useState("ALL");

  const {
    data: pendingPayments,
    mutate: refreshPending,
  } = useSWR("/api/accounting/pending-transactions", fetcher);

  const {
    data: approvedPayments,
    mutate: refreshApproved,
    isLoading: loadingApproved,
  } = useSWR(
    `/api/accounting/approve-transactions?month=${selectedMonth}&year=${selectedYear}`,
    fetcher
  );

  const approve = async (id) => {
    try {
      const res = await fetch("/api/accounting/approve-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id }),
      });

      if (!res.ok) throw new Error("Failed to approve");

      toast.success("Payment approved");
      refreshPending();
      refreshApproved();
    } catch (err) {
      toast.error("Error approving payment");
    }
  };

  const filteredApproved =
    selectedMode === "ALL"
      ? approvedPayments
      : approvedPayments?.filter((t) => t.paymentMethod === selectedMode);

  return (
    <div className="p-6 space-y-6">
      {/* 🔸 Pending Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Pending Payment Approvals</h2>
        {!pendingPayments ? (
          <p>Loading…</p>
        ) : pendingPayments.length === 0 ? (
          <p className="text-gray-500">No pending payments.</p>
        ) : (
          <ul className="space-y-4">
            {pendingPayments.map((t) => (
              <li
                key={t.id}
                className="border rounded-md p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    ₹{t.amount} - {t.forMonth}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Payer: {t.payerName || "—"} | Flat: {t.flatNumber || "—"} | Mode: {t.paymentMethod || "—"}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600"
                  onClick={() => approve(t.id)}
                >
                  Approve
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 Approved Payments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">✅ Approved Payments</h2>

        {/* Filter Dropdowns */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {paymentModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode === "ALL" ? "All Payment Modes" : mode.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {loadingApproved ? (
          <p>Loading approved payments…</p>
        ) : filteredApproved?.length === 0 ? (
          <p className="text-gray-500">No approved payments found for the selected filters.</p>
        ) : (
          <ul className="space-y-4">
            {filteredApproved.map((t) => (
              <li
                key={t.id}
                className="border rounded-md p-4 shadow-sm bg-green-50"
              >
                <p className="font-medium">
                  ₹{t.amount} - {t.forMonth}
                </p>
                <p className="text-sm text-muted-foreground">
                  Payer: {t.payerName || "—"} | Flat: {t.flatNumber || "—"} | Mode: {t.paymentMethod || "—"}
                </p>
                <p className="text-xs text-gray-500">
                  Approved on: {new Date(t.approvedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
