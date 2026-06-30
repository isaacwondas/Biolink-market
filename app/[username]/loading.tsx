import React from "react";

export default function StorefrontLoading() {
  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center antialiased font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col pb-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="w-full h-24 bg-neutral-200" />

        {/* Profile Frame Skeleton */}
        <div className="px-4 text-center -mt-8 relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-neutral-300 border-4 border-white shadow-sm" />

          {/* Title and Tagline */}
          <div className="h-5 w-32 bg-neutral-200 rounded mt-3" />
          <div className="h-3 w-48 bg-neutral-200 rounded mt-2" />

          {/* Button CTA */}
          <div className="w-full h-10 bg-neutral-200 rounded-xl mt-4" />
        </div>

        <hr className="border-neutral-200 my-4 mx-4" />

        {/* Bank Matrix Skeleton */}
        <div className="px-4 space-y-2">
          <div className="h-4 w-20 bg-neutral-200 rounded" />
          <div className="flex gap-2">
            <div className="w-[135px] h-24 bg-neutral-100 rounded-xl border border-neutral-200/50" />
            <div className="w-[135px] h-24 bg-neutral-100 rounded-xl border border-neutral-200/50" />
          </div>
        </div>

        {/* Items Grid Layout Skeleton */}
        <div className="px-4 mt-6 space-y-3">
          <div className="h-4 w-20 bg-neutral-200 rounded" />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
              <div className="aspect-[4/3] w-full bg-neutral-200" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 w-3/4 bg-neutral-200 rounded" />
                <div className="h-3 w-1/2 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
              <div className="aspect-[4/3] w-full bg-neutral-200" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 w-3/4 bg-neutral-200 rounded" />
                <div className="h-3 w-1/2 bg-neutral-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
