"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PayWithQr() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const router = useRouter();

  useEffect(() => {
    // Fetch QR from API
    fetch("/api/payments/qr-admin")
      .then((r) => r.json())
      .then((d) => {
        if (d.qrImageUrl) setUrl(d.qrImageUrl);
        else toast.error("No QR available");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast("Time expired, redirecting...");
      router.push("/dashboard");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!url) return null;

  // Convert seconds to mm:ss
  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg">Pay with UPI</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          <img
            src={url}
            alt="UPI QR"
            className="w-64 h-64 border rounded-md shadow-md"
          />
          <p className="text-sm text-gray-500 text-center">
            Scan using any UPI app (PhonePe, GPay, Paytm etc.)
          </p>

          <p className="text-xs text-orange-500 font-semibold">
            ⏳ Time left: {formatTime(timeLeft)}
          </p>

          <Button onClick={() => router.push("/dashboard")} className="w-full">
            ✅ Payment done — back to dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
