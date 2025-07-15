"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function VisitorsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* fetch once on mount ------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/society-admin/visitors");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Fetch failed");
        setRows(json.visitors);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-6">Loading visitors…</p>;
  if (!rows.length)
    return <p className="p-6">No visitors found for your society.</p>;

  /* quick formatter helpers -------------------------------- */
  const fmt = (d) => (d ? new Date(d).toLocaleString() : "–");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Society Visitors</h1>

      <Table>
        

        <TableBody>
          <TableRow>
            <TableCell className="font-bold">Name</TableCell>
            <TableCell className="font-bold">Phone</TableCell>
            <TableCell className="font-bold">Purpose</TableCell>
            <TableCell className="font-bold">Flat / Building</TableCell>
            <TableCell className="font-bold">Status</TableCell>
            <TableCell className="font-bold">Check-In</TableCell>
            <TableCell className="font-bold">Check-Out</TableCell>
          </TableRow>
          {rows.map((v) => (
            <TableRow key={v.id}>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.phoneNumber}</TableCell>
              <TableCell>{v.purpose}</TableCell>
              <TableCell>
                {v.visitingFlat.flatNumber} &nbsp;/&nbsp;{" "}
                {v.visitingFlat.building.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    v.status === "CHECKED_OUT"
                      ? "secondary"
                      : v.status === "CHECKED_IN"
                      ? "default"
                      : "outline"
                  }
                >
                  {v.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>{fmt(v.checkInTime)}</TableCell>
              <TableCell>{fmt(v.checkOutTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
