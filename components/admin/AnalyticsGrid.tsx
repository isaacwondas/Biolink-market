import React from "react";

// Robust TypeScript interfaces matching your custom tracking architecture
interface AnalyticMetrics {
  totalViews: number;
  uniqueVisitors: number;
  socialClicks: {
    instagram: number;
    facebook: number;
    tiktok: number;
    whatsapp: number;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

interface AnalyticsGridProps {
  metrics: AnalyticMetrics;
  businessName: string;
}

export default function AnalyticsGrid({
  metrics,
  businessName,
}: AnalyticsGridProps) {
  // Simple layout calculation helper to find total click conversions
  const totalClicks =
    metrics.socialClicks.instagram +
    metrics.socialClicks.facebook +
    metrics.socialClicks.tiktok +
    metrics.socialClicks.whatsapp;

  // Conversion rate formula safely handling division by zero cases
  const conversionRate =
    metrics.totalViews > 0
      ? ((totalClicks / metrics.totalViews) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 text-neutral-100 p-1 antialiased selection:bg-[#044766] selection:text-white">
      {/* Header Profile Summary Segment */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800/60 pb-5">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
            {businessName} Analytics
          </h1>
          <p className="text-xs text-neutral-400">
            Real-time telemetry performance monitor for your link storefront.
          </p>
        </div>
        <div className="text-[10px] self-start sm:self-center font-mono font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 mt-2 sm:mt-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Stream Connected
        </div>
      </div>

      {/* Module 1: High Level Totals & Performance Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Views Panel */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Views
            </span>
            <span className="text-lg">👁️</span>
          </div>
          <p className="text-3xl font-black tracking-tight text-white mt-2">
            {metrics.totalViews.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block mt-2">
            Gross impressions
          </span>
        </div>

        {/* Unique Visitors Panel */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Unique Visitors
            </span>
            <span className="text-lg">👤</span>
          </div>
          <p className="text-3xl font-black tracking-tight text-white mt-2">
            {metrics.uniqueVisitors.toLocaleString()}
          </p>
          <span className="text-[10px] text-[#044766] font-semibold bg-[#044766]/10 border border-[#044766]/20 px-2 py-0.5 rounded-md inline-block mt-2">
            Individual profiles
          </span>
        </div>

        {/* Aggregate Link Clicks Panel */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Action Clicks
            </span>
            <span className="text-lg">⚡</span>
          </div>
          <p className="text-3xl font-black tracking-tight text-white mt-2">
            {totalClicks.toLocaleString()}
          </p>
          <span className="text-[10px] text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md inline-block mt-2">
            Outbound interactions
          </span>
        </div>

        {/* Conversion Calculation Panel */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Conversion CTR
            </span>
            <span className="text-lg">📈</span>
          </div>
          <p className="text-3xl font-black tracking-tight text-emerald-400 mt-2">
            {conversionRate}%
          </p>
          <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block mt-2">
            Clicks vs Total Views
          </span>
        </div>
      </div>

      {/* Module 2: Secondary Insights Matrix (Platform Splits & User Agents) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Platform Matrix Routing Share Panel */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Social Matrix Activity Split
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Breakdown of total click traffic distributed across individual
              profile assets.
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* WhatsApp Tracker Layer */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-200">💬 WhatsApp Inquiries</span>
                <span className="font-mono text-neutral-400">
                  {metrics.socialClicks.whatsapp} clicks
                </span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2 border border-neutral-800/80 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalClicks > 0 ? (metrics.socialClicks.whatsapp / totalClicks) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Instagram Tracker Layer */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-200">📸 Instagram Handles</span>
                <span className="font-mono text-neutral-400">
                  {metrics.socialClicks.instagram} clicks
                </span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2 border border-neutral-800/80 overflow-hidden">
                <div
                  className="bg-[#044766] h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalClicks > 0 ? (metrics.socialClicks.instagram / totalClicks) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Facebook Tracker Layer */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-200">📘 Facebook Core page</span>
                <span className="font-mono text-neutral-400">
                  {metrics.socialClicks.facebook} clicks
                </span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2 border border-neutral-800/80 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalClicks > 0 ? (metrics.socialClicks.facebook / totalClicks) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* TikTok Tracker Layer */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-200">🎵 TikTok Channels</span>
                <span className="font-mono text-neutral-400">
                  {metrics.socialClicks.tiktok} clicks
                </span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2 border border-neutral-800/80 overflow-hidden">
                <div
                  className="bg-fuchsia-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalClicks > 0 ? (metrics.socialClicks.tiktok / totalClicks) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Device Breakdown Environment Panel */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Hardware Engine Access Splits
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Client platform agent profiles accessing your mobile digital
              showcase.
            </p>
          </div>

          <div className="flex flex-col justify-center h-full space-y-4 pb-2">
            {[
              {
                type: "Mobile Handsets",
                count: metrics.deviceBreakdown.mobile,
                icon: "📱",
                color: "bg-[#044766]",
              },
              {
                type: "Desktop Workstations",
                count: metrics.deviceBreakdown.desktop,
                icon: "💻",
                color: "bg-neutral-600",
              },
              {
                type: "Tablet Environments",
                count: metrics.deviceBreakdown.tablet,
                icon: "📟",
                color: "bg-neutral-800 border border-neutral-700",
              },
            ].map((device) => {
              const totalDevices =
                metrics.deviceBreakdown.mobile +
                metrics.deviceBreakdown.desktop +
                metrics.deviceBreakdown.tablet;
              const devicePct =
                totalDevices > 0
                  ? ((device.count / totalDevices) * 100).toFixed(0)
                  : "0";

              return (
                <div
                  key={device.type}
                  className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{device.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-neutral-200">
                        {device.type}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {device.count.toLocaleString()} instances detected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-neutral-300">
                      {devicePct}%
                    </span>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${device.color}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
