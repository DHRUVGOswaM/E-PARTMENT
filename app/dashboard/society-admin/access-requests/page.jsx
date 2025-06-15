"use client";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AccessRequests() {
  const { data, mutate } = useSWR(
    "/api/society-admin/access-requests",
    fetcher
  );

  const act = async (id, action) => {
    try {
      await fetch("/api/society-admin/access-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      toast.success(`Request ${action.toLowerCase()}d`);
      mutate();
    } catch (e) {
      toast.error("Error");
    }
  };

  if (!data) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Pending Access Requests</h1>
      {data.requests.length === 0 && <p>No pending requests.</p>}
      {data.requests.map((r) => (
        <div
          key={r.id}
          className="border rounded-md p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{r.user.name}</p>
            <p className="text-sm text-muted-foreground">
              Wants <b>{r.requestedRole}</b> role
            </p>
          </div>
          <div className="space-x-2">
            <Button size="sm" className="bg-green-600" onClick={() => act(r.id, "APPROVE")}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => act(r.id, "REJECT")}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
