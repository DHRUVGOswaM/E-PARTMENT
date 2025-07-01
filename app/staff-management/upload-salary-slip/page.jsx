"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function UploadSalarySlip() {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("paid");
  const [payDate, setPayDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch("/api/staff-management/staff");
        if (res.ok) {
          const data = await res.json();
          setStaffList(data);
        } else {
          toast.error("Failed to fetch staff");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching staff.");
      }
    }
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/staff-management/salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staff_id: selectedStaffId,
          amount: parseInt(amount),
          status,
          payDate,
          notes,
        }),
      });

      if (res.ok) {
        toast.success("Salary uploaded successfully.");
        setSelectedStaffId("");
        setAmount("");
        setStatus("paid");
        setPayDate(new Date());
        setNotes("");
      } else {
        const errorData = await res.json();
        toast.error(errorData?.error || "Failed to upload salary");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during submission.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Upload Staff Salary
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Select Staff</Label>
          <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent>
              {staffList.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name} ({staff.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Salary Amount (₹)</Label>
          <Input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Payment Date</Label>
          <Calendar
            mode="single"
            selected={payDate}
            onSelect={(date) => date && setPayDate(date)}
            className="rounded-md border"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Selected: {format(payDate, "PPP")}
          </p>
        </div>

        <div>
          <Label>Notes (optional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Bonus included or deductions"
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Salary
        </Button>
      </form>
    </div>
  );
}
