"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QrCodeDisplay from "@/components/QrCodeDisplay";
import { toast } from "react-hot-toast";

export default function VendorRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    service: "",
    contact: "",
    email: "",
    gender: "",
    imageUrl: "", // Optional
  });

  const [contactError, setContactError] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    console.log("Selected file:", file);
    setUploading(true);
    const toastId = toast.loading("Uploading image...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Apartment"); // ✅ Make sure this preset exists in your Cloudinary settings

    try {

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dayrre5om/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok && data.secure_url) {
        setForm((prev) => ({ ...prev, imageUrl: data.secure_url }));
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Upload failed!", { id: toastId });
      }
    } catch (err) {
      toast.error("Image upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };
  

  const handleSubmit = async () => {
    // Validate contact number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.contact)) {
      setContactError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    const res = await fetch("/api/vendor/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setQrCode(data.qrCodeUrl);
      toast.success("Vendor registered and QR generated!");
    } else {
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <h1 className="text-xl sm:text-2xl mb-4 font-bold text-center">📝 Register Vendor</h1>
      <div className="space-y-4">
        {Object.keys(form).map(
          (field) =>
            field !== "imageUrl" && (
              <div key={field}>
                <Input
                  type={field === 'contact' ? 'tel' : field === 'email' ? 'email' : 'text'}
                  placeholder={field === 'contact' ? 'Enter 10-digit mobile number' : field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (field === 'contact') {
                      const phoneValue = value.replace(/\D/g, ''); // Remove non-digits
                      if (phoneValue.length <= 10) {
                        setForm({ ...form, [field]: phoneValue });
                        setContactError('');
                        if (phoneValue.length === 10 && !/^[6-9]/.test(phoneValue)) {
                          setContactError('Mobile number must start with 6, 7, 8, or 9');
                        }
                      }
                    } else if (field === 'name') {
                      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, ""); // Letters + space
                      setForm({ ...form, [field]: onlyLetters });
                    }
                    else {
                      setForm({ ...form, [field]: value });
                    }
                  }}
                  maxLength={field === 'contact' ? 10 : undefined}
                  className={field === 'contact' && contactError ? 'border-red-500' : ''}
                />
                {field === 'contact' && contactError && <p className="text-red-500 text-sm mt-1">{contactError}</p>}
              </div>
            )
        )}

        {/* 📷 Image Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {/* ✅ Submit Button */}
        <Button onClick={handleSubmit} disabled={uploading} className="w-full">
          {uploading ? "Uploading..." : "Register & Generate QR"}
        </Button>

        {/* ✅ QR Code */}
        {qrCode && (
          <QrCodeDisplay qrCodeUrl={qrCode} task="vendor" name={form.name} />
        )}
      </div>
    </div>
  );
}
