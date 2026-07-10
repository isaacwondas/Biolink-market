"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
//import QRCode from "qrcode.react";
import { useRef } from "react"; // Add this
import { supabase } from "@/app/lib/supabase";

export default function ShareStorePage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<any>(null);

  useEffect(() => {
    const loadVendor = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/merchant/login");
        return;
      }

      const { data: vendorData } = await supabase
        .from("vendors")
        .select("username, business_name")
        .eq("email", user.email)
        .single();

      if (vendorData) {
        setVendor(vendorData);
      }

      setLoading(false);
    };

    loadVendor();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#374151]">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Store not found</p>
          <button
            onClick={() => router.push("/merchant/dashboard")}
            className="text-[#22C55E] font-semibold hover:underline"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const storeUrl = `https://biomarket.com/${vendor.username}`;
  const qrValue = storeUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${vendor.username}-qr-code.png`;
      link.click();
    }
  };

  const handlePreviewStore = () => {
    window.open(storeUrl, "_blank");
  };

  const handleGoToDashboard = () => {
    router.push("/merchant/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22C55E]/5 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8 py-12">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#22C55E] rounded-full mx-auto flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#111827]">
            Your store is live! 🎉
          </h1>
          <p className="text-lg text-[#374151]">
            {vendor.business_name} is now online and ready for customers.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl border-2 border-[#22C55E]/20 p-8 md:p-10 space-y-8 shadow-lg">
          {/* Store URL Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#111827]">
              Your Store Link
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
              <p className="text-xs text-[#374151] uppercase font-semibold">
                Share this link with your customers
              </p>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E5E7EB] p-3">
                <svg
                  className="w-5 h-5 text-[#22C55E] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <code className="flex-1 text-sm md:text-base font-mono text-[#111827] break-all">
                  {storeUrl}
                </code>
              </div>
              <button
                onClick={handleCopyLink}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  copied
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-[#22C55E] text-white hover:bg-[#15803D]"
                }`}
              >
                {copied ? "✓ Copied to clipboard!" : "📋 Copy Link"}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#111827]">QR Code</h2>
            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center space-y-4">
              <p className="text-xs text-[#374151] uppercase font-semibold">
                Scan to visit your store
              </p>
              <div
                ref={qrRef}
                className="bg-white p-6 rounded-xl border-2 border-[#E5E7EB]"
              >
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#22C55E"
                  bgColor="#FFFFFF"
                />
              </div>
              <button
                onClick={handleDownloadQR}
                className="w-full py-3 px-6 bg-white border-2 border-[#22C55E] text-[#22C55E] font-semibold rounded-xl hover:bg-[#22C55E]/5 transition-all"
              >
                ⬇️ Download QR Code
              </button>
            </div>
          </div>

          {/* Ways to Share */}
          <div className="space-y-4 border-t border-[#E5E7EB] pt-6">
            <h2 className="text-xl font-bold text-[#111827]">Ways to Share</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: "📱",
                  label: "WhatsApp",
                  action: () => {
                    window.open(
                      `https://wa.me/?text=Check out my store: ${storeUrl}`,
                      "_blank",
                    );
                  },
                },
                {
                  icon: "📷",
                  label: "Instagram",
                  action: () => {
                    window.open(`https://instagram.com`, "_blank");
                  },
                },
                {
                  icon: "🎵",
                  label: "TikTok",
                  action: () => {
                    window.open(`https://tiktok.com`, "_blank");
                  },
                },
                {
                  icon: "📧",
                  label: "Email",
                  action: () => {
                    window.location.href = `mailto:?subject=Check out my store&body=${storeUrl}`;
                  },
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="py-3 px-4 bg-gray-50 hover:bg-[#22C55E]/10 border border-[#E5E7EB] rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePreviewStore}
            className="flex-1 py-4 px-6 border-2 border-[#22C55E] text-[#22C55E] font-bold rounded-xl hover:bg-[#22C55E]/5 transition-all text-sm md:text-base"
          >
            👁️ Preview Store
          </button>
          <button
            onClick={handleGoToDashboard}
            className="flex-1 py-4 px-6 bg-[#22C55E] text-white font-bold rounded-xl hover:bg-[#15803D] transition-all text-sm md:text-base shadow-lg"
          >
            → Go to Dashboard
          </button>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-2">
          <p className="font-bold text-blue-900 text-sm">💡 Pro Tips:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>✓ Save the QR code and print it on packaging</li>
            <li>✓ Add the link to your social media bio</li>
            <li>✓ Share it on WhatsApp status daily</li>
            <li>✓ Include the link in your email signature</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
