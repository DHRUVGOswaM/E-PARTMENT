"use client";
import QrScanner from "@/components/QrScanner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function VendorScanPage() {

  const router = useRouter()
  const handleScan = async (vendorId) => {
    const res = await fetch("/api/vendor/scan", {
      method: "POST",
      body: JSON.stringify({ vendorId }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <>
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">🔍 Vendor QR Scanner</h1>
        <QrScanner onScan={handleScan} />
      </div>

      <div className="p-4 items-center justify-center flex">
        <Button
          onClick={() => router.push("/watchman")}
          className="cursor-pointer"
        >
          Go Back
        </Button>
      </div>
    </>
  );
}
