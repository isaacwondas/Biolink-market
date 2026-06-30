"use client";

import React from "react";

interface AnalyticsCardsProps {
  totalViews: number;
  uniqueViews: number;
  totalClicks: number;
}

export default function AnalyticsCards({
  totalViews = 0,
  uniqueViews = 0,
  totalClicks = 0,
}: AnalyticsCardsProps) {
  // Calculate the Click-Through Rate (CTR) safely to avoid division by zero
  const ctr = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Profile Views */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Total Views
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-black text-neutral-50">
            {totalViews}
          </span>
          <span className="text-[10px] text-emerald-500 font-medium">
            Page Hits
          </span>
        </div>
      </div>

      {/* Unique Visitors */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Unique Visitors
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-black text-neutral-50">
            {uniqueViews}
          </span>
          <span className="text-[10px] text-amber-500 font-medium">
            Distinct Users
          </span>
        </div>
      </div>

      {/* Total Link Clicks */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Link Clicks
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-black text-neutral-50">
            {totalClicks}
          </span>
          <span className="text-[10px] text-sky-500 font-medium">
            Total Taps
          </span>
        </div>
      </div>

      {/* Click-Through Rate (CTR) Card */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-sm border-l-4 border-l-[#044766]">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Click-Through Rate
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-black text-neutral-50">{ctr}%</span>
          <span className="text-[10px] text-[#044766] font-bold tracking-wider uppercase">
            Conversion Rate
          </span>
        </div>
      </div>
    </div>
  );
}
