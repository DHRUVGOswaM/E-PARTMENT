"use client";

import { useRouter } from "next/navigation";
import QrScanner from "@/components/QrScanner";
import { Button } from "@/components/ui/button";

export default function QrScanPage() {
  const router = useRouter();

  const handleScan = (decodedText) => {
   try {
    //   const url = new URL(decodedText);
    //   console.log(url);
    //   const token = url.searchParams.get("token");
    //   console.log("Token from QR Code:", token);

      if (decodedText) {
        router.push(`/dashboard/visitor/checkin?token=${decodedText}`);
      } else {
        alert("Invalid QR Code: Token not found.");
      }
    } catch (e) {
      alert("Invalid QR Code format.");
      console.error(e);
    }
  };

  return (
    <>
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Scan QR to update the Visitor log</h1>
      <QrScanner
        onScan={handleScan}
      />
    </div>

    <div className="p-4 items-center justify-center flex">
        <Button onClick={() => router.push("/watchman")} className="cursor-pointer">Go Back</Button>
    </div>
    </>
  );
}
