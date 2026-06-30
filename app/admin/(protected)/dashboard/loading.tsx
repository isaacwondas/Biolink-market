import React from "react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 space-y-6 animate-pulse">
      {/* Top Admin Header Navbar Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-neutral-200 rounded" />
          <div className="h-3 w-32 bg-neutral-200 rounded" />
        </div>
        <div className="h-10 w-24 bg-neutral-200 rounded-lg" />
      </div>

      {/* Analytics Matrix Performance Track Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-24 bg-white border border-neutral-200 rounded-xl" />
        <div className="h-24 bg-white border border-neutral-200 rounded-xl" />
        <div className="h-24 bg-white border border-neutral-200 rounded-xl" />
      </div>

      {/* Content Feed Layout Block */}
      <div className="h-64 bg-white border border-neutral-200 rounded-xl w-full" />
    </div>
  );
}
