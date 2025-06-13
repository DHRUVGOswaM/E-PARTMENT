"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const CreateBuildingForm = () => {
  const [name, setName] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBuilding = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/society-admin/building", {
        method: "POST",
        body: JSON.stringify({ name, numberOfFloors }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create building");
        return;
      }

      toast.success("Building created successfully");
      setName("");
      setNumberOfFloors(1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md">
      <div>
        <Label>Building Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., A-Block"
        />
      </div>
      <div>
        <Label>Number of Floors</Label>
        <Input
          type="number"
          min={1}
          value={numberOfFloors}
          onChange={(e) => setNumberOfFloors(parseInt(e.target.value))}
        />
      </div>
      <Button disabled={isLoading} onClick={handleCreateBuilding}>
        {isLoading ? "Creating..." : "Create Building"}
      </Button>
    </div>
  );
};

export default CreateBuildingForm;
