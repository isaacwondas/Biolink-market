"use client";

import type { VendorBank } from "./types";

interface PaymentModalProps {
  open: boolean;
  orderId: number | null;
  orderTotal: number;
  banks: VendorBank[];
  onClose: () => void;
  onPaid: () => void;
}

export default function PaymentModal({
  open,
  orderId,
  orderTotal,
  banks,
  onClose,
  onPaid,
}: PaymentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              Complete Payment
            </h2>

            <p className="text-xs text-[#6B7280] mt-1">
              Transfer the exact amount below.
            </p>
          </div>

          <button onClick={onClose} className="text-sm text-[#6B7280]">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="text-xs text-[#6B7280]">Amount To Pay</p>

            <p className="text-3xl font-bold text-[#111827] mt-2">
              ₦{orderTotal.toLocaleString()}
            </p>
          </div>

          {banks.length === 0 ? (
            <div className="text-sm text-red-600">
              Merchant has not added a payment account.
            </div>
          ) : (
            banks.map((bank) => (
              <div key={bank.id} className="border rounded-2xl p-4">
                <p className="text-xs text-[#6B7280]">{bank.bank_name}</p>

                <p className="text-xl font-bold mt-2">{bank.account_number}</p>

                {bank.account_name && (
                  <p className="text-sm mt-1">{bank.account_name}</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t p-5">
          <button
            onClick={onPaid}
            disabled={banks.length === 0}
            className="w-full h-12 rounded-xl bg-[#22C55E] text-white font-semibold disabled:bg-gray-300"
          >
            I Have Paid
          </button>

          <p className="text-xs text-center text-[#6B7280] mt-4">
            Order #{orderId}
          </p>
        </div>
      </div>
    </div>
  );
}
