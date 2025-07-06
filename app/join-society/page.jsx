'use client';

import { useEffect, useState } from 'react';
import toast               from 'react-hot-toast';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
}                           from '@/components/ui/select';
import { Input }            from '@/components/ui/input';
import { Label }            from '@/components/ui/label';
import { Button }           from '@/components/ui/button';

/* ──────────────────────────────── */


export default function JoinSociety() {
  /* form state */
  const [societyId , setSocietyId ] = useState('');
  const [role      , setRole      ] = useState('SOCIETY_MEMBER');
  const [phone     , setPhone     ] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // only for member / owner
  const [buildingId, setBuildingId] = useState('');
  const [flatId    , setFlatId    ] = useState('');

  const [loading   , setLoading   ] = useState(false);

  /* dropdown data */
  const [societies , setSocieties ] = useState([]);
  const [buildings , setBuildings ] = useState([]);
  const [flats     , setFlats     ] = useState([]);

  /* ─── load societies once ─── */
  useEffect(() => {
    fetch('/api/public/societies')
      .then(r=>r.json()).then(d=>setSocieties(d.societies))
      .catch(()=>toast.error('Load societies failed'));
  }, []);

  /* ─── load buildings when society changes ─── */
  useEffect(() => {
    if (!societyId) { setBuildings([]); setBuildingId(''); return; }
    fetch(`/api/public/buildings?societyId=${societyId}`)
      .then(r=>r.json()).then(d=>setBuildings(d.buildings))
      .catch(()=>toast.error('Load buildings failed'));
  }, [societyId]);

  /* ─── load flats when building changes ─── */
  useEffect(() => {
    if (!buildingId) { setFlats([]); setFlatId(''); return; }
    fetch(`/api/public/flats?buildingId=${buildingId}`)
      .then(r=>r.json()).then(d=>setFlats(d.flats))
      .catch(()=>toast.error('Load flats failed'));
  }, [buildingId]);

  /* ───────────────────────────── submit */
  const submit = async () => {
    if (!societyId) return toast.error('Choose a society first');
    if (!phone.trim()) return toast.error('Mobile number required');
    
    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error('Please enter a valid 10-digit mobile number starting with 6-9');
    }

    if (['HOUSE_OWNER','SOCIETY_MEMBER','TENANT','RESIDENT'].includes(role) && !flatId)
      return toast.error('Select building and flat');

    setLoading(true);
    try {
      const res = await fetch('/api/users/join-society', {
        method :'POST',
        headers:{ 'Content-Type':'application/json' },
        body   : JSON.stringify({ societyId, role, phoneNumber: phone, buildingId, flatId })
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Request sent – wait for approval.');
      setSocietyId(''); setRole('SOCIETY_MEMBER'); setPhone('');
      setBuildingId(''); setFlatId('');
    } catch(e){ toast.error(e.message||'Error'); }
    finally      { setLoading(false); }
  };

  /* ───────────────────────────── UI */
  return (
    <div className="max-w-lg mx-auto space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-center">Register in a Society</h1>

      {/* society */}
      <Field label="Choose Society">
        <Select value={societyId} onValueChange={setSocietyId}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>
            {societies.map(s=><SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      {/* role */}
      <Field label="Desired role">
        <Select value={role} onValueChange={val=>setRole(val)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="HOUSE_OWNER">House Owner</SelectItem>
            <SelectItem value="SOCIETY_MEMBER">Society Member</SelectItem>
            <SelectItem value="TENANT">Tenant</SelectItem>
            <SelectItem value="RESIDENT">Resident</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="TECHNICIAN">Technician</SelectItem>
            <SelectItem value="WATCHMAN">Watchman</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* phone */}
      <Field label="Mobile number" >
        <Input 
          type="tel"
          value={phone} 
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length <= 10) {
              setPhone(value);
              setPhoneError('');
              if (value.length === 10 && !/^[6-9]/.test(value)) {
                setPhoneError('Mobile number must start with 6, 7, 8, or 9');
              }
            }
          }}
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          className={`w-full ${phoneError ? 'border-red-500' : ''}`}
        />
        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
      </Field>

      {/* building / flat only for owner | member | tenant | resident */}
      {['HOUSE_OWNER','SOCIETY_MEMBER','TENANT','RESIDENT'].includes(role) && (
        <>
          <Field label="Select Building">
            <Select value={buildingId} onValueChange={setBuildingId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Building…" /></SelectTrigger>
              <SelectContent>
                {buildings.map(b=><SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Select Flat">
            <Select value={flatId} onValueChange={setFlatId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Flat…" /></SelectTrigger>
              <SelectContent>
                {flats.map(f=><SelectItem key={f.id} value={f.id}>{f.flatNumber}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </>
      )}

      {/* TODO: extra fields for other roles if you like */}

      <Button onClick={submit} disabled={loading}>
        {loading ? 'Sending…' : 'Submit request'}
      </Button>
    </div>
  );
}

/* helper component */
const Field = ({label,children})=>(
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    {children}
  </div>
);
