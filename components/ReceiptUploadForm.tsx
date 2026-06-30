"use client";

import React, { useState } from "react";
import { supabase } from "../app/lib/supabase"; // Adjust path to match your client-side instance

interface ReceiptUploadFormProps {
  vendorEmail: string;
  vendorPhone: string; // The WhatsApp number stored in the vendor profile
  vendorBusinessName: string;
}

export default function ReceiptUploadForm({
  vendorEmail,
  vendorPhone,
  vendorBusinessName,
}: ReceiptUploadFormProps) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({
        type: "error",
        text: "Please select a screenshot of your bank transfer receipt.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Generate a clean unique reference code
      const uniqueDigits = Math.floor(1000 + Math.random() * 9000);
      const referenceCode = `HQ-${uniqueDigits}`;

      // 2. Prepare file path for storage bucket: receipts/vendor_email/timestamp-filename
      const fileExt = file.name.split(".").pop();
      const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${vendorEmail}/${cleanFileName}`;

      // 3. Upload file directly to Supabase storage receipts bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 4. Extract the public asset URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("receipts").getPublicUrl(filePath);

      // 5. Store the record cleanly in the database transactions table
      const { error: dbError } = await supabase.from("transactions").insert([
        {
          vendor_email: vendorEmail,
          buyer_name: buyerName.trim(),
          buyer_phone: buyerPhone.trim(),
          receipt_url: publicUrl,
          reference_code: referenceCode,
          status: "pending",
        },
      ]);

      if (dbError) throw dbError;

      setMessage({
        type: "success",
        text: `🚀 Receipt recorded! Ref: ${referenceCode}. Redirecting to WhatsApp...`,
      });

      // 6. Build a localized, highly readable WhatsApp message string
      const whatsappText = `Hello ${vendorBusinessName},\n\nI just made a bank transfer payment and uploaded my receipt.\n\n*Transaction Details:*\n• *Name:* ${buyerName.trim()}\n• *Phone:* ${buyerPhone.trim()}\n• *Ref Code:* ${referenceCode}\n\n*View Uploaded Receipt Here:* ${publicUrl}\n\nPlease confirm receipt. Thanks!`;

      // Clean up vendor phone number formatting (ensure country prefix is active)
      let cleanPhone = vendorPhone.replace(/[^0-9]/g, "");
      if (cleanPhone.startsWith("0")) {
        cleanPhone = `234${cleanPhone.slice(1)}`; // Fallback default format to Nigerian code prefix
      }

      const encodedMessage = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

      // 7. Fire the Deep Link handoff after a minor UI pause
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        // Reset states cleanly after completion
        setBuyerName("");
        setBuyerPhone("");
        setFile(null);
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4 text-neutral-800">
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          🧾 Send Receipt
        </h3>
        <p className="text-xs text-neutral-400">
          Paid via bank transfer? Upload your screenshot here to confirm your
          order straight via WhatsApp.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs border font-medium ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
              : "bg-rose-950/40 border-rose-800 text-rose-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Buyer Name Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
            Your Full Name
          </label>
          <input
            type="text"
            required
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Chidi Adebayo"
            className="w-full bg-green-50 border border-green-500 rounded-xl p-3 text-sm focus:outline-none focus:border-green-800 transition-colors placeholder:text-neutral-400"
          />
        </div>

        {/* Buyer Phone Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
            WhatsApp Phone Number
          </label>
          <input
            type="tel"
            required
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="08012345678"
            className="w-full bg-green-50 border border-green-500 rounded-xl p-3 text-sm focus:outline-none focus:border-green-800 transition-colors placeholder:text-neutral-500"
          />
        </div>

        {/* Image File Drop Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
            Upload Receipt Screenshot
          </label>
          <div className="relative border border-dashed border-green-500 hover:border-green-700 bg-green-50 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-colors">
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
              📸
            </span>
            <span className="text-xs text-neutral-400 font-medium truncate max-w-full px-2">
              {file ? file.name : "Tap to choose or snapshot receipt"}
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5">
              Supports PNG, JPG, JPEG
            </span>
          </div>
        </div>

        {/* Submit Action Handler Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#25d366] hover:bg-[#1ebd59] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold py-3 px-4 rounded-xl text-center transition-all shadow-xl tracking-wide text-sm font-semibold active:scale-[0.99] mt-2"
        >
          {loading
            ? "Processing Reference & Uploading..."
            : "Upload & Continue to WhatsApp"}
        </button>
      </form>
    </div>
  );
}
