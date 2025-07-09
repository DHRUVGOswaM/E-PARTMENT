"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SUBSCRIPTION_FEE = 999;

export default function AdminRequestForm() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    apartmentName: "",
    totalFlats: "",
    address: "",
    registrationNumber: "",
    phoneNumber: "",
  });

  const [phoneError, setPhoneError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      const phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      if (phoneValue.length <= 10) {
        setForm({ ...form, [name]: phoneValue });
        setPhoneError('');
        if (phoneValue.length === 10 && !/^[6-9]/.test(phoneValue)) {
          setPhoneError('Mobile number must start with 6, 7, 8, or 9');
        }
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const isFormValid = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return form.apartmentName && form.address && form.phoneNumber && phoneRegex.test(form.phoneNumber);
  };

  // const payAndSubmit = async () => {
  //   if (!isFormValid()) {
  //     toast.error("Fill all required fields");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const orderRes = await fetch("/api/payments/order", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ amount: SUBSCRIPTION_FEE }),
  //     });
  //     if (!orderRes.ok) throw new Error("Order create failed");
  //     const order = await orderRes.json();

  //     // @ts-ignore
  //     const razorpay = new window.Razorpay({
  //       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //       order_id: order.id,
  //       amount: order.amount,
  //       currency: order.currency,
  //       name: "E-Partment",
  //       description: "Society subscription",
  //       prefill: { contact: form.phoneNumber, email: user?.email },
  //       handler: async (resp) => {
  //         const verify = await fetch("/api/payments/verify", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             ...resp,
  //             formData: form,
  //           }),
  //         });
  //         if (verify.ok) {
  //           toast.success("Payment successful – request submitted!");
  //           router.push("/dashboard");
  //         } else {
  //           toast.error("Verification failed – contact support");
  //         }
  //         setLoading(false);
  //       },
  //       modal: { ondismiss: () => setLoading(false) },
  //       theme: { color: "#0d9488" },
  //     });

  //     razorpay.open();
  //   } catch (err) {
  //     toast.error(err.message || "Error starting payment");
  //     setLoading(false);
  //   }
  // };

  // const handleQrFlow = async () => {
  //   if (!isFormValid()) {
  //     toast.error("Fill all required fields");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/society-admin/request", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(form),
  //     });

  //     if (!res.ok) throw new Error("Could not initiate manual payment");


  //     toast.success("Request submitted — scan QR to pay");
  //     router.push("/pay-with-qr-for-admin");
  //   } catch (err) {
  //     toast.error(err.message || "Failed to initiate manual payment");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRequestCallback = async () => {
    if (!isFormValid()) {
      toast.error("Fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/society-admin/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: "CALLBACK" }),
      });

      if (!res.ok) throw new Error("Could not submit request");
      toast.success("Request submitted! We'll contact you shortly.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          🏢 Request Admin Access
        </h1>

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

          {/* Phone Number with validation */}
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={form.phoneNumber}
              onChange={handleChange}
              maxLength={10}
              className={phoneError ? "border-red-500" : ""}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
        </div>

        {/* <Button onClick={payAndSubmit} disabled={loading} className="w-full">
          {loading ? "Redirecting…" : `Pay ₹${SUBSCRIPTION_FEE} via Razorpay`}
        </Button>

        <p className="text-center text-sm text-red-500 font-semibold">or</p>

        <Button onClick={handleQrFlow} variant="outline" className="w-full">
          Scan QR to Pay with UPI
        </Button> */}

        <Button
          onClick={handleRequestCallback}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Submitting..." : `Request a Callback`}
        </Button>
      </div>
    </>
  );
}
