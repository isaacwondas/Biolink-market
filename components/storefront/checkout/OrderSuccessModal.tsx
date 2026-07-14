"use client";

import { Check } from "lucide-react";

interface OrderSuccessModalProps {
  open: boolean;
  reference: string;
  amount: number;
  onViewStatus: () => void;
  onBack: () => void;
}

export default function OrderSuccessModal({
  open,
  reference,
  amount,
  onViewStatus,
  onBack,
}: OrderSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="max-w-md w-full px-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
          <Check className="w-7 h-7 text-[#15803D]" />
        </div>

        <h2 className="mt-6 text-2xl font-bold">Payment Submitted</h2>

        <p className="text-[#6B7280] mt-2">
          Your receipt has been sent to the merchant.
        </p>

        <div className="border rounded-2xl p-5 mt-8 text-left">
          <div className="flex justify-between">
            <span>Reference</span>
            <strong>{reference}</strong>
          </div>

          <div className="flex justify-between mt-4">
            <span>Amount</span>
            <strong>₦{amount.toLocaleString()}</strong>
          </div>
        </div>

        <button
          onClick={onViewStatus}
          className="w-full h-12 mt-6 rounded-xl bg-[#22C55E] text-white font-semibold"
        >
          View Order Status
        </button>

        <button onClick={onBack} className="w-full h-12 mt-3 rounded-xl border">
          Back to Store
        </button>
      </div>
    </div>
  );
}
