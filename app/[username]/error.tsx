"use client";

import React, { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StorefrontError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Storefront Layout Crash:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 antialiased selection:bg-[#044766] selection:text-white font-sans">
      <div className="w-full max-w-sm text-center bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/60 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold mx-auto text-lg">
          !
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">
            Connection Interrupted
          </h2>
          <p className="text-xs text-neutral-500 leading-normal px-2">
            We encountered a temporary network issue pulling up this merchant
            profile. Please try reloading.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full bg-[#044766] hover:bg-[#033850] text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs active:scale-[0.99]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
