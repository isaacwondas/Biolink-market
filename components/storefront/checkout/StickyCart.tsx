"use client";

import { ArrowRight } from "lucide-react";

interface StickyCartProps {
  totalItems: number;
  orderTotal: number;
  onReview: () => void;
}

export default function StickyCart({
  totalItems,
  orderTotal,
  onReview,
}: StickyCartProps) {
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:w-full md:max-w-md md:-translate-x-1/2">
      <div className="bg-[#111827] text-white rounded-2xl p-3 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>

            <p className="text-base font-bold">
              ₦{orderTotal.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={onReview}
            className="h-11 px-5 bg-[#22C55E] hover:bg-[#15803D] rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            Review Items
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
