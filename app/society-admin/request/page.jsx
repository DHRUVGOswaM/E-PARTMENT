"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/* ----------------  CONFIG  ---------------- */
const SUBSCRIPTION_FEE = 999; // ₹ 999 -- change anytime

export default function AdminRequestForm() {
  /* user info pre-fill -------------------- */
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    apartmentName: "",
    totalFlats: "",
    address: "",
    registrationNumber: "",
    phoneNumber: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /* fetch logged-in user once -------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("User fetch failed");
        const data = await res.json();
        setUser(data);
        setForm((p) => ({
          ...p,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phoneNumber: data.phoneNumber || "",
        }));
      } catch {
        toast.error("Failed to load user");
      }
    })();
  }, []);

  /* generic change handler ----------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ------------ PAY & SUBMIT -------------- */
  const payAndSubmit = async () => {
    /* naïve validation */
    if (!form.apartmentName || !form.address || !form.phoneNumber) {
      toast.error("Fill all required fields");
      return;
    }
    setLoading(true);

    try {
      /* 1️⃣  create Razorpay order on server */
      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: SUBSCRIPTION_FEE }),
      });
      if (!orderRes.ok) throw new Error("Order create failed");
      const order = await orderRes.json();

      /* 2️⃣  open Razorpay checkout */
      // @ts-ignore (checkout.js injected below)
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "E-Partment",
        description: "Society subscription",
        prefill: { contact: form.phoneNumber, email: user?.email },
        handler: async (resp) => {
          /* 3️⃣  verify & create PendingAdmin */
          const verify = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...resp,
              formData: form, // apartment, flats, etc.
            }),
          });
          if (verify.ok) {
            toast.success("Payment successful – request submitted!");
            router.push("/dashboard");
          } else {
            toast.error("Verification failed – contact support");
          }
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#0d9488" },
      });

      razorpay.open();
    } catch (err) {
      toast.error(err.message || "Error starting payment");
      setLoading(false);
    }
  };

  /* ------------- UI ----------------------- */
  return (
    <>
      {/* Razorpay script (loads once) */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">🏢 Request Admin Access</h1>

        {user && (
          <>
            <p className="text-gray-600 text-center">
              Welcome, {user.firstName}!
            </p>
            <div className="text-center mb-4">
              Current role:&nbsp;<b>{user.role}</b>
            </div>
          </>
        )}

        <div className="grid gap-4">
          {[
            { name: "apartmentName", label: "Society / Apartment Name" },
            { name: "address", label: "Address" },
            { name: "phoneNumber", label: "Phone Number", type: "tel" },
            { name: "registrationNumber", label: "Registration Number" },
            { name: "totalFlats", label: "Total Flats", type: "number" },
          ].map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input
                id={f.name}
                name={f.name}
                type={f.type || "text"}
                value={form[f.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <Button onClick={payAndSubmit} disabled={loading}>
          {loading ? "Redirecting…" : `Pay ₹${SUBSCRIPTION_FEE} & Submit`}
        </Button>
      </div>
    </>
  );
}
