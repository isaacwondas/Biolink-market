"use client";

import React from "react";

interface CustomerReceiptProps {
  receipt: {
    order_reference: string;
    customer_name: string;
    total_order_amount: number;
    amount_paid: number;
    balance_due: number;
    payment_status: string;
  };
  onUploadBalanceProof: () => void;
}

export function CustomerReceiptView({
  receipt,
  onUploadBalanceProof,
}: CustomerReceiptProps) {
  const isPartiallyPaid = receipt.payment_status === "partially_paid";
  const isFullyPaid = receipt.payment_status === "fully_paid";

  return (
    <div className="max-w-md mx-auto bg-white text-neutral-800 rounded-3xl border border-neutral-100 shadow-xl overflow-hidden font-sans">
      {/* Visual Status Header */}
      <div
        className={`p-6 text-center text-white ${isFullyPaid ? "bg-emerald-600" : "bg-[#044766]"}`}
      >
        <p className="text-xs uppercase tracking-widest opacity-80">
          Digital Receipt
        </p>
        <p className="text-xl font-mono font-bold mt-1">
          #{receipt.order_reference}
        </p>

        <div className="mt-4 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
          {isFullyPaid
            ? "✓ Fully Cleared"
            : isPartiallyPaid
              ? "⏳ Deposit Verified"
              : "Awaiting Review"}
        </div>
      </div>

      {/* Ledger Breakdown */}
      <div className="p-6 space-y-4">
        <div className="text-center pb-2 border-b border-neutral-100">
          <p className="text-xs text-neutral-400">Total Bill Value</p>
          <p className="text-3xl font-black text-neutral-900 mt-0.5">
            ₦{receipt.total_order_amount.toLocaleString()}
          </p>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center text-neutral-600">
            <span>Amount Deposited:</span>
            <span className="font-semibold text-neutral-900">
              ₦{receipt.amount_paid.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-dashed border-neutral-100 pt-2.5 text-neutral-600">
            <span className="font-medium">Outstanding Balance:</span>
            <span
              className={`text-base font-bold ${receipt.balance_due > 0 ? "text-amber-600" : "text-emerald-600"}`}
            >
              ₦{receipt.balance_due.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Instructive Callout Notice Box */}
        {isPartiallyPaid && (
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 space-y-2 text-xs text-amber-800 leading-relaxed">
            <p className="font-bold">📋 Partial Payment Protocol Enabled</p>
            <p>
              Your deposit has been acknowledged and verified by the merchant.
              The remaining balance must be cleared before dispatch or
              completion.
            </p>
          </div>
        )}

        {/* Contextual Action Button */}
        {receipt.balance_due > 0 && (
          <button
            type="button"
            onClick={onUploadBalanceProof}
            className="w-full mt-2 text-sm font-bold py-3 text-white bg-[#044766] rounded-xl hover:bg-[#03364d] shadow-md transition-all text-center block"
          >
            Upload Receipt for Balance (₦{receipt.balance_due.toLocaleString()})
          </button>
        )}
      </div>
    </div>
  );
}
