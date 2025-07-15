"use client";

import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScanner({ onScan }) {
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setScanning(true);

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-image");
      const decoded = await html5QrCode.scanFile(file, true); // ✅ File passed directly
      onScan(decoded);
    } catch (err) {
      console.error("Scan error:", err);
      alert("❌ Failed to scan QR code from the image.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
      >
        📷 Choose QR Image (Camera or Gallery)
      </button>

      {scanning && <p className="text-gray-500">🔍 Scanning image for QR...</p>}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="QR Preview"
          className="max-w-xs border rounded-lg shadow"
        />
      )}

      <div id="qr-reader-image" />
    </div>
  );
}
