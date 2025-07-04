"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useRouter } from "next/navigation";
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

const PERSON_TYPES = [
  { label: "Resident", value: "RESIDENT" },
  { label: "Visitor", value: "VISITOR" },
  { label: "Vendor", value: "VENDOR" },
];

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

      <ScanRedirect
        label="Scan Visitor QR"
        href="/visitor"
        note="Use QR to log visitor IN / OUT"
      />

      <ScanRedirect
        label="Scan Vendor QR"
        href="/vendor/scan"
        note="Use QR to log vendor IN / OUT"
      />
    </div>
  );
}

/* ---- 1) Resident entry component ----------------------- */
function ResidentEntry() {
  const [residentId, setResidentId] = useState("");
  const [vehicle, setVehicle] = useState("");
  const { data: residents } = useSWR("/api/watchman/residents", (url) =>
    fetch(url).then((r) => r.json())
  );

  const addResident = async () => {
    if (!residentId) return toast.error("Select resident first");
    try {
      const res = await fetch("/api/watchman/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personType: "RESIDENT",
          personId: residentId,
          vehicleNumber: vehicle,
        }),
      });
      if (res.ok) {
        toast.success("Resident logged IN");
        setResidentId("");
        setVehicle("");
      } else toast.error("Error");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Resident Entry</h2>
        {!residents ? (
          <Loader2 className="animate-spin text-blue-600" />
        ) : (
          <>
            <Select value={residentId} onValueChange={setResidentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select resident" />
              </SelectTrigger>
              <SelectContent>
                {residents.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name ?? u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Vehicle No. (optional)"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            />

            <Button onClick={addResident} className="flex gap-2">
              <LogIn className="h-4 w-4" /> Log IN
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* ---- 2) Visitor / Vendor scan redirect ----------------- */
function ScanRedirect({ label, href, note }) {
  const router = useRouter();
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">{label}</h2>
        <p className="text-sm text-muted-foreground">{note}</p>
        <Button onClick={() => router.push(href)}>Open Scanner</Button>
      </CardContent>
    </Card>
  );
}

/* ======================================================== */
/* ------------------- ADMIN LIVE LIST -------------------- */

function AdminLiveList() {
  const { data, isLoading, error } = useSWR(
    "/api/watchman/logs", // same endpoint—admins can read
    (url) => fetch(url).then((r) => r.json()),
    { refreshInterval: 10_000 } // auto‑refresh every 10 s
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-blue-700">
        <Loader2 className="animate-spin mr-2" /> Loading…
      </div>
    );

  if (error)
    return (
      <p className="p-6 text-red-600 font-medium">
        Failed to load current log list.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gate Activity – Live View</h1>
      <p className="font-medium">
        People currently inside:{" "}
        <span className="text-blue-700">{data.length}</span>
      </p>

      {data.length === 0 ? (
        <p className="text-muted-foreground">No active entries.</p>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-2">
            {data.map((l) => (
              <div
                key={l.id}
                className="border rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {l.personName ?? l.personType} – {l.personType}
                  </p>
                  {l.vehicleNumber && (
                    <p className="text-sm text-muted-foreground">
                      Vehicle: {l.vehicleNumber}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  IN {new Date(l.inTime).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
