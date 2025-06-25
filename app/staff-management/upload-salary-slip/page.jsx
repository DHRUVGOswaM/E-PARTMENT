"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function UploadSalarySlip() {
  const [staffName, setStaffName] = useState("");
  const [role, setRole] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [overtimePay, setOvertimePay] = useState("");
  const [leaveDeduction, setLeaveDeduction] = useState("");
  const [tdaCut, setTdaCut] = useState(false);
  const [tdaAmount, setTdaAmount] = useState("");
  const [festivalAdvance, setFestivalAdvance] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentMode, setPaymentMode] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");

  const calculateFinalAmount = () => {
    const base = parseFloat(baseSalary) || 0;
    const ot = parseFloat(overtimePay) || 0;
    const leave = parseFloat(leaveDeduction) || 0;
    const tda = tdaCut ? parseFloat(tdaAmount) || 0 : 0;
    const advance = parseFloat(festivalAdvance) || 0;

    return base + ot - leave - tda - advance;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("staffName", staffName);
    formData.append("role", role);
    formData.append("baseSalary", baseSalary);
    formData.append("paymentDate", paymentDate.toISOString());

    // Optional fields
    if (overtimePay) formData.append("overtimePay", overtimePay);
    if (leaveDeduction) formData.append("leaveDeduction", leaveDeduction);
    if (tdaCut) {
      formData.append("tdaCut", true);
      if (tdaAmount) formData.append("tdaAmount", tdaAmount);
    }
    if (festivalAdvance) formData.append("festivalAdvance", festivalAdvance);
    if (paymentMode) formData.append("paymentMode", paymentMode);
    if (notes) formData.append("notes", notes);
    if (file) formData.append("file", file);

    formData.append("finalAmount", calculateFinalAmount());

    const res = await fetch("/api/staff-management/salary", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Salary uploaded successfully.");
      // Reset fields
      setStaffName("");
      setRole("");
      setBaseSalary("");
      setOvertimePay("");
      setLeaveDeduction("");
      setTdaCut(false);
      setTdaAmount("");
      setFestivalAdvance("");
      setPaymentDate(new Date());
      setPaymentMode("");
      setNotes("");
      setFile(null);
    } else {
      alert("Upload failed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upload Staff Salary
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Staff Name</Label>
            <Input
              required
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Role</option>
              <option value="watchman">Watchman</option>
              <option value="maid">Maid</option>
              <option value="hr">HR</option>
              <option value="secretary">Secretary</option>
            </select>
          </div>
        </div>

        <div>
          <Label>Base Salary ₹</Label>
          <Input
            required
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
          />
        </div>

        {/* Optional Salary Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Overtime Pay ₹ (optional)</Label>
            <Input
              type="number"
              value={overtimePay}
              onChange={(e) => setOvertimePay(e.target.value)}
            />
          </div>
          <div>
            <Label>Leave Deduction ₹ (optional)</Label>
            <Input
              type="number"
              value={leaveDeduction}
              onChange={(e) => setLeaveDeduction(e.target.value)}
            />
          </div>
          <div>
            <Label>Festival Advance ₹ (optional)</Label>
            <Input
              type="number"
              value={festivalAdvance}
              onChange={(e) => setFestivalAdvance(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tdaCut}
                  onChange={() => setTdaCut(!tdaCut)}
                />
                TDA Cut (optional)
              </div>
            </Label>
            <Input
              type="number"
              disabled={!tdaCut}
              value={tdaAmount}
              onChange={(e) => setTdaAmount(e.target.value)}
              placeholder="TDA Amount"
            />
          </div>
          <div>
            <Label>Payment Mode (optional)</Label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Mode</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Date & Notes */}
        <div>
          <Label>Payment Date</Label>
          <Calendar
            mode="single"
            selected={paymentDate}
            onSelect={setPaymentDate}
            className="rounded-md border"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Selected: {format(paymentDate, "PPP")}
          </p>
        </div>

        <div>
          <Label>Additional Notes (optional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. Paid advance for Diwali, bonus included"
          />
        </div>

        <div>
          <Label>Upload Salary Slip (PDF/Image) (optional)</Label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Final Amount Preview */}
        <div className="mt-4 bg-gray-50 p-4 rounded-md text-center font-semibold">
          Final Calculated Salary: ₹ {calculateFinalAmount()}
        </div>

        <Button type="submit" className="w-full mt-4">
          Submit Salary
        </Button>
      </form>
    </div>
  );
}
