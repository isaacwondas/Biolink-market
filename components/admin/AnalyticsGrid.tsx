import React from "react";

import {
  MousePointerClick,
  Eye,
  Percent,
  Users,
  Smartphone,
  Monitor,
  Tablet,
  MessageSquare,
  Music2,
  Camera,
} from "lucide-react";

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
  const totalClicks =
    metrics.socialClicks.instagram +
    metrics.socialClicks.facebook +
    metrics.socialClicks.tiktok +
    metrics.socialClicks.whatsapp;

  const conversionRate =
    metrics.totalViews > 0
      ? ((totalClicks / metrics.totalViews) * 100).toFixed(1)
      : "0.0";

  const totalDevices =
    metrics.deviceBreakdown.mobile +
    metrics.deviceBreakdown.desktop +
    metrics.deviceBreakdown.tablet;

  const socialItems = [
    {
      label: "WhatsApp Inquiries",
      icon: MessageSquare,
      count: metrics.socialClicks.whatsapp,
      bar: "bg-[#22C55E]",
    },
    {
      label: "Instagram Handles",
      icon: Camera,
      count: metrics.socialClicks.instagram,
      bar: "bg-pink-500",
    },
    {
      label: "Facebook Page",
      icon: (props: any) => (
        <svg
          {...props}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      count: metrics.socialClicks.facebook,
      bar: "bg-blue-600",
    },
    {
      label: "TikTok Channels",
      icon: Music2,
      count: metrics.socialClicks.tiktok,
      bar: "bg-purple-500",
    },
  ];

  const devices = [
    {
      type: "Mobile Devices",
      count: metrics.deviceBreakdown.mobile,
      icon: Smartphone,
    },
    {
      type: "Desktop Devices",
      count: metrics.deviceBreakdown.desktop,
      icon: Monitor,
    },
    {
      type: "Tablet Devices",
      count: metrics.deviceBreakdown.tablet,
      icon: Tablet,
    },
  ];

  return (
    <div className="space-y-6 text-[#111827] antialiased">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#111827]">
            {businessName} Analytics
          </h1>

          <p className="text-xs md:text-sm text-[#6B7280] mt-1">
            Real-time performance overview for your storefront.
          </p>
        </div>

        <div className="self-start sm:self-center text-[10px] font-mono font-bold text-[#15803D] bg-green-50 border border-green-200 px-3 py-2 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          Live Analytics
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
              Total Views
            </span>
            <Eye className="w-4 h-4 text-gray-400 stroke-[2.25]" />
          </div>

          <p className="text-2xl md:text-3xl font-black text-[#111827] mt-3">
            {metrics.totalViews.toLocaleString()}
          </p>

          <span className="text-[9px] md:text-[10px] text-[#15803D] font-medium bg-green-50 px-2 py-1 rounded-md inline-block mt-2">
            Gross impressions
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
              Unique Visitors
            </span>
            <Users className="w-4 h-4 text-gray-400 stroke-[2.25]" />
          </div>

          <p className="text-2xl md:text-3xl font-black text-[#111827] mt-3">
            {metrics.uniqueVisitors.toLocaleString()}
          </p>

          <span className="text-[9px] md:text-[10px] text-[#15803D] font-medium bg-green-50 px-2 py-1 rounded-md inline-block mt-2">
            Individual visitors
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
              Action Clicks
            </span>
            <MousePointerClick className="w-4 h-4 text-gray-400 stroke-[2.25]" />
          </div>

          <p className="text-2xl md:text-3xl font-black text-[#111827] mt-3">
            {totalClicks.toLocaleString()}
          </p>

          <span className="text-[9px] md:text-[10px] text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded-md inline-block mt-2">
            Outbound interactions
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#6B7280]">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
              Conversion CTR
            </span>
            <Percent className="w-4 h-4 text-gray-400 stroke-[2.25]" />
          </div>

          <p className="text-2xl md:text-3xl font-black text-[#22C55E] mt-3">
            {conversionRate}%
          </p>

          <span className="text-[9px] md:text-[10px] text-[#15803D] font-medium bg-green-50 px-2 py-1 rounded-md inline-block mt-2">
            Clicks vs total views
          </span>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* SOCIAL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm md:text-base font-bold text-[#111827]">
              Social Activity
            </h3>

            <p className="text-[10px] md:text-xs text-[#6B7280] mt-1">
              See which social platforms customers interact with.
            </p>
          </div>

          <div className="space-y-5">
            {socialItems.map((item) => {
              const percentage =
                totalClicks > 0 ? (item.count / totalClicks) * 100 : 0;

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs md:text-sm font-semibold text-[#374151]">
                      {item.icon} {item.label}
                    </span>

                    <span className="text-[10px] md:text-xs font-mono text-[#6B7280]">
                      {item.count} clicks
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${item.bar} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DEVICES */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm md:text-base font-bold text-[#111827]">
              Visitor Devices
            </h3>

            <p className="text-[10px] md:text-xs text-[#6B7280] mt-1">
              Devices customers use to access your storefront.
            </p>
          </div>

          <div className="space-y-3">
            {devices.map((device) => {
              const percentage =
                totalDevices > 0
                  ? ((device.count / totalDevices) * 100).toFixed(0)
                  : "0";

              return (
                <div
                  key={device.type}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-lg">{device.icon}</span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-bold text-[#111827] truncate">
                        {device.type}
                      </p>

                      <p className="text-[10px] md:text-xs text-[#6B7280]">
                        {device.count.toLocaleString()} visitors
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs md:text-sm font-black text-[#15803D]">
                      {percentage}%
                    </span>

                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
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
