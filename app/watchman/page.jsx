"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn } from "lucide-react";

/* --------------------------------------------- main page */
export default function WatchmanGate() {
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  /* fetch current user role once */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/users/me");
        if (r.ok) {
          const { role } = await r.json();
          setRole(role);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRole(false);
      }
    })();
  }, []);

  /* WATCHMAN view */
  if (!loadingRole && role === "WATCHMAN") return <WatchmanPanel />;

  /* ADMIN view */
  if (!loadingRole && ["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(role))
    return <AdminLiveList />;

  /* still loading or not allowed */
  return (
    <div className="p-6 flex items-center justify-center h-64">
      {loadingRole ? (
        <Loader2 className="animate-spin text-blue-600" />
      ) : (
        <p className="text-red-600 font-medium">Access denied.</p>
      )}
    </div>
  );
}

/* ======================================================== */
/* ----------------------- WATCHMAN ----------------------- */

function WatchmanPanel() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Watchman – Gate Operations</h1>

      <ResidentEntry />
    </div>
  );
}

/* ---- Resident entry component ----------------------- */
function ResidentEntry() {
  const [residentId, setResidentId] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: residents, error } = useSWR("/api/watchman/residents", (url) =>
    fetch(url).then((r) => r.json())
  );

  const addResident = async () => {
    if (!residentId) {
      toast.error("Please select a resident first");
      return;
    }

    setIsLoading(true);

    try {
      // Find the selected resident to get their name
      const selectedResident = residents.find((r) => r.id === residentId);
      const personName =
        selectedResident?.name ||
        selectedResident?.email ||
        `Resident ${residentId}`;

      const payload = {
        personType: "RESIDENT",
        personName: personName, // Backend expects personName, not personId
        vehicleNumber: vehicle.trim() || null, // Send null if empty
      };

      console.log("Sending payload:", payload); // Debug log

      const res = await fetch("/api/watchman/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      console.log("Response:", responseData); // Debug log

      if (res.ok) {
        toast.success("Resident logged IN successfully");
        setResidentId("");
        setVehicle("");
      } else {
        // Handle specific error messages from backend
        const errorMessage =
          responseData.error ||
          responseData.message ||
          "Failed to log resident";
        toast.error(errorMessage);
        console.error("Backend error:", responseData);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-red-600">Failed to load residents data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Resident Entry</h2>

        {!residents ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-blue-600 mr-2" />
            <span>Loading residents...</span>
          </div>
        ) : residents.length === 0 ? (
          <p className="text-muted-foreground py-4">No residents found</p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Resident</label>
              <Select value={residentId} onValueChange={setResidentId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a resident" />
                </SelectTrigger>
                <SelectContent>
                  {residents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.name ||
                        resident.email ||
                        `Resident ${resident.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Vehicle Number (Optional)
              </label>
              <Input
                placeholder="Enter vehicle number"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={addResident}
              className="flex gap-2 w-full"
              disabled={isLoading || !residentId}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Log IN
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
