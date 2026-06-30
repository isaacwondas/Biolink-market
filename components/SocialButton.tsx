"use client";

import React from "react";

interface SocialButtonProps {
  platform: "Instagram" | "Facebook" | "TikTok";
  handle: string;
  vendorId: number;
}

export default function SocialButton({
  platform,
  handle,
  vendorId,
}: SocialButtonProps) {
  const handleSocialClick = () => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    const deviceType =
      width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

    let destinationUrl = "";
    const cleanHandle = handle.replace("@", "");

    if (platform === "Instagram") {
      destinationUrl = `https://instagram.com/${cleanHandle}`;
    } else if (platform === "Facebook") {
      destinationUrl = `https://facebook.com/${cleanHandle}`;
    } else if (platform === "TikTok") {
      destinationUrl = `https://tiktok.com/@${cleanHandle}`;
    } else {
      return;
    }

    // High-speed telemetry logging block
    try {
      navigator.sendBeacon(
        "/api/log-click",
        JSON.stringify({
          vendor_id: vendorId,
          platform: platform.toLowerCase(),
          device_type: deviceType,
        }),
      );
    } catch (err) {
      console.error("Telemetry error:", err);
    }

    window.open(destinationUrl, "_blank", "noopener,noreferrer");
  };

  // Sleek, minimal icons to match the high-end dark mode aesthetic
  const getPlatformIcon = () => {
    switch (platform) {
      case "Instagram":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case "Facebook":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"></path>
          </svg>
        );
      case "TikTok":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.6-1.6-1V12c0 1.93-.6 3.82-1.74 5.38-1.57 2.17-4.13 3.51-6.85 3.55-2.92.05-5.83-1.42-7.38-3.9A9.18 9.18 0 0 1 0 12.11c-.1-2.94 1.3-5.86 3.75-7.46 1.7-1.12 3.75-1.7 5.79-1.57V7.2c-.89-.13-1.83.02-2.63.46C5.9 8.2 5.17 9.17 5.04 10.22c-.22 1.74.77 3.49 2.4 4.11 1.2.46 2.59.3 3.66-.41.76-.51 1.25-1.35 1.37-2.27.05-1.51.02-10.07.02-11.63h.04z"></path>
          </svg>
        );
    }
  };

  return (
    <button
      onClick={handleSocialClick}
      title={`Follow on ${platform}`}
      className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:border-neutral-700 hover:bg-neutral-850 transition-all active:scale-95"
    >
      {getPlatformIcon()}
    </button>
  );
}
