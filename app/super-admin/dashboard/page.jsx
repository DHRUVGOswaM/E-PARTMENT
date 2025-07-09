"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function SuperAdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/society-admin/pending");

      // This is the most important change. We first get the JSON body.
      const responseData = await res.json();

      // Check if the HTTP response status is OK (e.g., 200)
      if (!res.ok) {
        // If not OK, we know the responseData contains our error message.
        // We throw an error to be caught by the catch block.
        throw new Error(responseData.error || "Failed to load requests.");
      }

      // If the response was OK, responseData is the array of requests.
      setRequests(responseData);
    } catch (error) {
      console.error("Failed to fetch requests:", error.message);
      // The catch block now displays the specific error message from the API.
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, action, amount = null) => {
    try {
      const res = await fetch("/api/society-admin/approve", {
        method: "POST",
        body: JSON.stringify({ id, action, amount }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchRequests();
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📋 Pending Admin Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-4 space-y-2">
                <p>
                  <strong>Name:</strong> {req.name}
                </p>
                <p>
                  <strong>Email:</strong> {req.email}
                </p>
                <p>
                  <strong>Phone:</strong> {req.phoneNumber}
                </p>
                <p>
                  <strong>Apartment:</strong> {req.apartmentName}
                </p>
                <p>
                  <strong>Total Flats:</strong> {req.totalFlats}
                </p>
                {!req.finalQuote ? (
                  <div className="flex flex-col gap-2 pt-4">
                    <input
                      type="number"
                      placeholder="Final Quote Amount"
                      className="border rounded px-3 py-2 w-1/2"
                      onChange={(e) => (req.finalQuote = e.target.value)}
                    />
                    <Button
                      onClick={() =>
                        handleApproval(req.id, "QUOTE", req.finalQuote)
                      }
                      className="w-max"
                    >
                      Send Quote 💬
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <p>
                      <strong>Quoted Amount:</strong> ₹{req.finalQuote}
                    </p>
                    <div className="flex gap-4 pt-2">
                      <Button onClick={() => handleApproval(req.id, "APPROVE")}>
                        Approve ✅
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleApproval(req.id, "REJECT")}
                      >
                        Reject ❌
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
