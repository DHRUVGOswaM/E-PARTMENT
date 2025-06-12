// This is a React-based frontend code using Tailwind CSS and shadcn/ui
// Backend assumed to be managed with Node.js + Prisma or similar
// This file includes components and structure for Staff Directory, Attendance, Leave, Shift, Work, Feedback, and Salary modules
"use client";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";

export default function StaffManagement() {
  const [selectedTab, setSelectedTab] = useState("directory");
  const [date, setDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState("");
const [checkOutTime, setCheckOutTime] = useState("");
const [attendanceData, setAttendanceData] = useState([]);
const [taskName, setTaskName] = useState("");
const [assignedTo, setAssignedTo] = useState("");
const [taskDetails, setTaskDetails] = useState("");
const [taskList, setTaskList] = useState([]);
const [salaryName, setSalaryName] = useState("");
const [salaryAmount, setSalaryAmount] = useState("");
const [salaryStatus, setSalaryStatus] = useState("Paid");
const [salaryList, setSalaryList] = useState([]);
const handleAttendanceSubmit = () => {
  if (!checkInTime || !checkOutTime) return alert("Please fill both times");

  const formattedDate = date.toISOString().split("T")[0]; // e.g. "2025-06-12"

  const newEntry = {
    date: formattedDate,
    checkIn: checkInTime,
    checkOut: checkOutTime,
    status: "Present"
  };

  setAttendanceData((prev) => [...prev, newEntry]);

  // Reset fields
  setCheckInTime("");
  setCheckOutTime("");
};
const handleAssignTask = () => {
  if (!taskName || !assignedTo) {
    alert("Please enter task name and staff name");
    return;
  }

  const newTask = {
    task: taskName,
    assignedTo,
    status: "Pending"
  };

  setTaskList((prev) => [...prev, newTask]);

  // Optional: Reset fields
  setTaskName("");
  setAssignedTo("");
  setTaskDetails("");
};
const handleSalaryRecord = () => {
  if (!salaryName || !salaryAmount) {
    alert("Please fill all fields");
    return;
  }

  const newSalary = {
    month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    name: salaryName,
    amount: `₹${Number(salaryAmount).toLocaleString()}`,
    status: salaryStatus,
  };

  setSalaryList((prev) => [...prev, newSalary]);

  // Reset inputs
  setSalaryName("");
  setSalaryAmount("");
  setSalaryStatus("Paid");
};
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Society Staff Management System</h1>

     <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
    <TabsList className="flex flex-wrap gap-3 mb-4">
<TabsTrigger
  value="directory"
  className={`px-4 py-2 rounded-lg shadow hover:bg-blue-200 ${
    selectedTab === "directory"
      ? "bg-blue-600 text-white"
      : "bg-blue-100 text-blue-900"
  }`}
>
    Staff Directory
  </TabsTrigger>
    <TabsTrigger
      value="attendance"
      className={`px-4 py-2 rounded-lg shadow hover:bg-blue-200 ${
        selectedTab === "attendance"
          ? "bg-blue-600 text-white"
          : "bg-blue-100 text-blue-900"
      }`}
    >
    Attendance
  </TabsTrigger>
    <TabsTrigger
      value="leave"
      className={`px-4 py-2 rounded-lg shadow hover:bg-blue-200 ${
        selectedTab === "leave"
          ? "bg-blue-600 text-white"
          : "bg-blue-100 text-blue-900"
      }`}
    >
    Leave Tracker
   </TabsTrigger>
    <TabsTrigger
      value="shift"
      className={`px-4 py-2 rounded-lg shadow hover:bg-blue-200 ${
        selectedTab === "shift"
          ? "bg-blue-600 text-white"
          : "bg-blue-100 text-blue-900"
      }`}
    >
     Shift Schedule
    </TabsTrigger>
    <TabsTrigger
      value="work"
      className={`px-4 py-2 rounded-lg shadow hover:bg-blue-200 ${
        selectedTab === "work"
          ? "bg-blue-600 text-white"
          : "bg-blue-100 text-blue-900"
      }`}
    >
      Work Allocation
    </TabsTrigger>
    <TabsTrigger
      value="feedback"
      className={`px-4 py-2 rounded-lg shadow hover:bg-blue-200 ${
        selectedTab === "feedback"
          ? "bg-blue-600 text-white"
          : "bg-blue-100 text-blue-900"
      }`}
    >
      Resident Feedback
    </TabsTrigger>
    <TabsTrigger
      value="salary"
      className={`px-4 py-2 rounded-lg shadow hover:bg-blue-200 ${
        selectedTab === "salary"
          ? "bg-blue-600 text-white"
          : "bg-blue-100 text-blue-900"
      }`}
    >
      Salary Tracker
    </TabsTrigger>
  </TabsList>
        {/* Staff Directory */}
        <TabsContent value="directory">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Staff Info</h2>
              <Input type="file" accept="image/*" />
              <Input placeholder="Full Name" />
              <Input placeholder="Contact Number" />
              <Input placeholder="Assigned Block / Area" />
              <Button>Submit</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Daily Attendance</h2>
              <Label>Date:</Label>
              <Calendar mode="single" selected={date} onSelect={setDate} />
             <Input
  placeholder="Check-In Time"
  type="time"
  value={checkInTime}
  onChange={(e) => setCheckInTime(e.target.value)}
/>
<Input
  placeholder="Check-Out Time"
  type="time"
  value={checkOutTime}
  onChange={(e) => setCheckOutTime(e.target.value)}
/>
           <Button onClick={handleAttendanceSubmit}>Mark Attendance</Button>
              <h3 className="text-lg mt-4">Monthly Report</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
               <TableBody>
  {attendanceData.map((entry, index) => (
    <TableRow key={index}>
      <TableCell>{entry.date}</TableCell>
      <TableCell>{entry.checkIn}</TableCell>
      <TableCell>{entry.checkOut}</TableCell>
      <TableCell>{entry.status}</TableCell>
    </TableRow>
  ))}
</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Tracker */}
        <TabsContent value="leave">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Leave Application</h2>
              <Calendar mode="range" selected={date} onSelect={setDate} />
              <Textarea placeholder="Reason for Leave" />
              <Button>Submit Leave</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shift Schedule */}
        <TabsContent value="shift">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Shift Allocation</h2>
              <Input placeholder="Staff Name" />
              <Input placeholder="Shift Time" />
              <Button>Assign Shift</Button>
              <p>Staff will be notified of the new shift timing via notification.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Allocation */}
        <TabsContent value="work">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Task Assignment</h2>
              <Input
  placeholder="Task Name"
  value={taskName}
  onChange={(e) => setTaskName(e.target.value)}
/>

<Input
  placeholder="Assigned To (Staff Name)"
  value={assignedTo}
  onChange={(e) => setAssignedTo(e.target.value)}
/>

<Textarea
  placeholder="Details / Instructions"
  value={taskDetails}
  onChange={(e) => setTaskDetails(e.target.value)}
/>
         <Button onClick={handleAssignTask}>Assign Task</Button>     
              <h3 className="text-lg mt-4">Status Update</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
               <TableBody>
  {taskList.map((task, index) => (
    <TableRow key={index}>
      <TableCell>{task.task}</TableCell>
      <TableCell>{task.assignedTo}</TableCell>
      <TableCell>{task.status}</TableCell>
    </TableRow>
  ))}
</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resident Feedback */}
        <TabsContent value="feedback">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Feedback on Tasks</h2>
              <Input placeholder="Resident Name" />
              <Input placeholder="Task Name" />
              <Textarea placeholder="Feedback Comments" />
              <Button>Submit Feedback</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Tracker */}
        <TabsContent value="salary">
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Salary Management</h2>
             <Input
  placeholder="Staff Name"
  value={salaryName}
  onChange={(e) => setSalaryName(e.target.value)}
/>

<Input
  placeholder="Amount"
  type="number"
  value={salaryAmount}
  onChange={(e) => setSalaryAmount(e.target.value)}
/>
<select
  value={salaryStatus}
  onChange={(e) => setSalaryStatus(e.target.value)}
  className="border p-2 rounded"
>
  <option value="Paid">Paid</option>
  <option value="Unpaid">Unpaid</option>
</select>
              <select className="border p-2 rounded">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
              <Button onClick={handleSalaryRecord}>Record Salary</Button>
              <h3 className="text-lg mt-4">Salary Slips</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
               <TableBody>
  {salaryList.map((entry, index) => (
    <TableRow key={index}>
      <TableCell>{entry.month}</TableCell>
      <TableCell>{entry.amount}</TableCell>
      <TableCell>{entry.status}</TableCell>
    </TableRow>
  ))}
</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
