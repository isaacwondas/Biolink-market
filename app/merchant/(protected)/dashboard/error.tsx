"use client";

import React, { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard Boundary Crash:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 antialiased font-sans">
      <div className="w-full max-w-md text-center bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold mx-auto text-lg">
          ⚠
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">
            Failed to Load Dashboard
          </h2>
          <p className="text-xs text-neutral-500 leading-normal">
            There was an issue processing administrative configuration records.
            This could be due to an expired session or network timeout.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => (window.location.href = "/admin/login")}
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs py-2.5 px-4 rounded-xl transition-all"
          >
            Back to Login
          </button>
          <button
            onClick={() => reset()}
            className="flex-1 bg-[#044766] hover:bg-[#033850] text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs"
          >
            Retry Session
          </button>
        </div>
      </div>
    </div>
  );
}
