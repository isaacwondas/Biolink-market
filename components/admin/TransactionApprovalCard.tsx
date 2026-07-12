"use client";

import { useState } from "react";

interface Transaction {
  id: string;
  total_order_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  buyer_name?: string;
  buyer_phone?: string;
  receipt_url?: string;
  reference_code?: string;
  status?: string;
}

export function TransactionApprovalCard({
  transaction,
  onConfirm,
  onDecline,
}: {
  transaction: Transaction;
  onConfirm: (
    id: string,
    updates: { amount_paid: number; payment_status: string },
  ) => void;
  onDecline: (id: string) => void;
}) {
  const [isPartialMode, setIsPartialMode] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const handleFullApproval = () => {
    onConfirm(transaction.id, {
      amount_paid: transaction.total_order_amount,
      payment_status: "fully_paid",
    });
  };

  const handlePartialApproval = () => {
    const numericDeposit = parseFloat(depositAmount);

    if (
      isNaN(numericDeposit) ||
      numericDeposit <= 0 ||
      transaction.amount_paid + numericDeposit > transaction.total_order_amount
    ) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    const newAmountPaid = transaction.amount_paid + numericDeposit;

    onConfirm(transaction.id, {
      amount_paid: newAmountPaid,
      payment_status:
        newAmountPaid >= transaction.total_order_amount
          ? "fully_paid"
          : "partially_paid",
    });

    setIsPartialMode(false);
    setDepositAmount("");
  };

  const handleWhatsAppFollowUp = () => {
    const phone = transaction.buyer_phone?.replace(/\D/g, "");

    if (!phone) {
      alert("No phone number available for this customer.");
      return;
    }

    const name = transaction.buyer_name || "there";

    const message = encodeURIComponent(
      `Hi ${name}, we noticed there's an issue with the receipt you uploaded on our store link. Could you please re-upload a clearer copy or confirm your payment details? Thank you! 🙏`,
    );

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
      {/* TRANSACTION SUMMARY */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
            Total Order Value
          </span>

          <p className="text-2xl font-black text-[#111827] mt-1">
            ₦{transaction.total_order_amount.toLocaleString()}
          </p>
        </div>

        <span
          className={`self-start px-3 py-1.5 rounded-full text-xs font-semibold ${
            transaction.payment_status === "partially_paid"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-green-50 text-[#15803D] border border-green-200"
          }`}
        >
          {transaction.payment_status === "partially_paid"
            ? "Partially Paid"
            : "Awaiting Review"}
        </span>
      </div>

      {/* PAYMENT INFORMATION */}
      {transaction.amount_paid > 0 && (
        <div className="bg-green-50 border border-green-100 p-3 rounded-xl">
          <p className="text-xs text-gray-600">Already Paid</p>

          <p className="text-base font-bold text-[#15803D] mt-1">
            ₦{transaction.amount_paid.toLocaleString()}
          </p>
        </div>
      )}

      {!isPartialMode ? (
        <div className="space-y-3">
          {/* PRIMARY ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onDecline(transaction.id)}
              className="w-full min-h-[48px] text-sm font-semibold px-4 py-3 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all active:scale-[0.98]"
            >
              🚩 Decline / Flag
            </button>

            <button
              type="button"
              onClick={handleFullApproval}
              className="w-full min-h-[48px] text-sm font-bold px-4 py-3 text-white bg-[#22C55E] rounded-xl hover:bg-[#15803D] shadow-sm transition-all active:scale-[0.98]"
            >
              ✓ Approve Payment
            </button>
          </div>

          {/* SECONDARY ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsPartialMode(true)}
              className="w-full min-h-[44px] text-sm font-semibold px-4 py-2.5 text-[#15803D] bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all"
            >
              💰 Log Partial Deposit
            </button>

            <button
              type="button"
              onClick={handleWhatsAppFollowUp}
              className="w-full min-h-[44px] text-sm font-semibold px-4 py-2.5 text-[#15803D] bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-base">💬</span>
              WhatsApp Follow-up
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 bg-green-50 p-4 rounded-xl border border-green-200">
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-2">
              Amount Received in this Installment
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">
                ₦
              </span>

              <input
                type="number"
                min="1"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full text-base pl-8 pr-4 py-3 bg-white text-[#111827] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setIsPartialMode(false);
                setDepositAmount("");
              }}
              className="w-full min-h-[44px] text-sm font-semibold px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePartialApproval}
              className="w-full min-h-[44px] text-sm font-bold px-4 py-2.5 text-white bg-[#22C55E] rounded-xl hover:bg-[#15803D] transition-all"
            >
              Confirm Partial Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
