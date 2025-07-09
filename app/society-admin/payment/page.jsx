"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // For loading spinner

export default function PayCallbackPage() {
  const [reqData, setReqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingbar, setLoadingbar] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userRes = await fetch("/api/users/me");
        if (!userRes.ok) throw new Error("User fetch failed");
        const newUser = await userRes.json();
        setUser(newUser);

        const reqRes = await fetch("/api/society-admin/pending");
        if (!reqRes.ok) throw new Error("Request not found");
        const data = await reqRes.json();

        const req = data?.[0];
        if (!req) throw new Error("No pending request found");
        setReqData(req);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const payWithRazorpay = async () => {
    if (!reqData?.quotedAmount) return toast.error("No quote available");
    setLoading(false);
    setLoadingbar(true)
    

    try {
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: reqData.quotedAmount,
          mode: "RAZORPAY",
          requestId: reqData.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.id || order?.order?.id,
        amount: order.amount || order?.order?.amount,
        currency: order.currency || order?.order?.currency,
        name: "E-Partment",
        description: "Society Subscription Payment",
        prefill: {
          email: reqData.email,
          contact: reqData.phoneNumber,
        },
        handler: async (resp) => {
          const verify = await fetch("/api/society-admin/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: reqData.id,
              action: "APPROVE",
              amount: reqData.quotedAmount,
            }),
          });

          if (!verify.ok) {
            toast.error("Verification failed");
          } else {
            toast.success("Payment successful & setup complete!");
            router.push("/dashboard");
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#0d9488" },
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingbar(false);
    }
  };

  const payWithQR = async () => {
    if (!reqData?.quotedAmount) return toast.error("No quote available");
    setLoadingbar(true);
    try {
      await fetch("/api/society-admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reqData.id,
          action: "APPROVE",
          amount: reqData.quotedAmount,
        }),
      });

      toast.success(
        `Setup complete. Proceed to pay ₹${reqData.quotedAmount} via QR`
      );
      router.push("/pay-with-qr-for-admin");
    } catch (error) {
      console.error("Manual payment error:", error);
      toast.error("Failed to initiate manual payment");
    } finally {
      setLoadingbar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!reqData) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-10">
        <AlertTitle>No Request Found</AlertTitle>
        <AlertDescription>
          Please submit a callback request before making a payment.
        </AlertDescription>
      </Alert>
    );
  }

  if (reqData.status === "PENDING") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Alert variant="default" className="max-w-md mx-auto mt-10">
          <AlertTitle>Awaiting Quote</AlertTitle>
          <AlertDescription>
            Your request is being reviewed. We’ll notify you once a quote is
            generated.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (reqData.status === "QUOTED") {
    return (
      <>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <Card className="max-w-md mx-auto mt-10 shadow-md border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">
              Pay & Activate Society
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Please complete the payment to proceed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-medium text-primary text-center">
              ₹{reqData.quotedAmount}
            </div>
            <Button
              onClick={payWithRazorpay}
              className="w-full"
              disabled={loading}
            >
              {loadingbar ? "Processing..." : "Pay with Razorpay"}
            </Button>
            <Button variant="outline" className="w-full" onClick={payWithQR}>
              {loadingbar ? "Processing..." : "Pay via UPI QR"}
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <p className="text-sm text-muted-foreground">Status: {reqData.status}</p>
    </div>
  );
}
