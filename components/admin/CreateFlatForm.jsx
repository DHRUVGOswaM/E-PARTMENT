'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from '../ui/button';
import { Label } from '../ui/label';
;         // adjust the import paths to your shadcn barrel‑exports



export default function CreateFlatPage() {
  // form state
  const [flatNumber, setFlatNumber] = useState('');
  const [areaSqFt,   setAreaSqFt]   = useState(500);
  const [bedrooms,   setBedrooms]   = useState(1);
  const [buildingId, setBuildingId] = useState('');
  const [residentId, setResidentId] = useState('');
  const [loading,    setLoading]    = useState(false);

  // dropdown data
  const [buildings, setBuildings] = useState([]);
  const [residents, setResidents] = useState([]);

  /* ───────────────────────────── */

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const b = await axios.get('/api/society-admin/building');
        setBuildings(b.data.buildings);

        const r = await axios.get('/api/society-admin/get-user-flats');   // we already created this earlier
        setResidents(r.data.users);
      } catch {
        toast.error('Failed to load data');
      }
    };
    fetchInitial();
  }, []);

  /* ───────────────────────────── */

  const handleCreate = async () => {
    if (!buildingId) return toast.error('Choose a building first');
    setLoading(true);
    try {
      await axios.post('/api/society-admin/flats', {
        flatNumber,
        areaSqFt: Number(areaSqFt),
        bedrooms: Number(bedrooms),
        buildingId,
        residentId: residentId || undefined,
      });
      toast.success('Flat created!');
      // reset
      setFlatNumber('');
      setAreaSqFt(500);
      setBedrooms(1);
      setBuildingId('');
      setResidentId('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error creating flat');
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────────── */

  return (
    <div className="p-6 space-y-6 max-w-lg">
      <h2 className="text-xl font-semibold">Add New Flat</h2>

      {/* Flat Number */}
      <div className="space-y-1">
        <Label>Flat Number</Label>
        <Input
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          placeholder="E.g. A‑101"
        />
      </div>

      {/* Area */}
      <div className="space-y-1">
        <Label>Area (sq.ft.)</Label>
        <Input
          type="number"
          min={100}
          value={areaSqFt}
          onChange={(e) => setAreaSqFt(parseInt(e.target.value || "0", 10))}
        />
      </div>

      {/* Bedrooms */}
      <div className="space-y-1">
        <Label>Bedrooms</Label>
        <Input
          type="number"
          min={1}
          max={10}
          value={bedrooms}
          onChange={(e) => setBedrooms(parseInt(e.target.value || "1", 10))}
        />
      </div>

      {/* Building dropdown */}
      <div className="space-y-1">
        <Label>Select Building</Label>
        <Select value={buildingId} onValueChange={setBuildingId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose building" />
          </SelectTrigger>

          <SelectContent>
            {buildings.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Optional resident dropdown */}
      <div className="space-y-1">
        <Label>Assign Resident (optional)</Label>
        <Select value={residentId} onValueChange={setResidentId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="-- none --" />
          </SelectTrigger>

          <SelectContent>
            {residents.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.firstName} {u.lastName} ({u.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating…" : "Create Flat"}
      </Button>
    </div>
  );
}
