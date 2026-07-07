"use client";

import { useState } from "react";

interface Transaction {
  id: string;
  total_order_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
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
      numericDeposit > transaction.total_order_amount
    ) {
      alert(
        "Please enter a valid deposit amount less than the total order value.",
      );
      return;
    }
    onConfirm(transaction.id, {
      amount_paid: transaction.amount_paid + numericDeposit,
      payment_status: "partially_paid",
    });
    setIsPartialMode(false);
    setDepositAmount("");
  };

  // WhatsApp follow-up — opens pre-filled chat with the customer
  const handleWhatsAppFollowUp = () => {
    const phone = transaction.customer_phone?.replace(/\D/g, "");
    if (!phone) {
      alert("No phone number available for this customer.");
      return;
    }
    const name = transaction.customer_name || "there";
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
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
            Total Order Value
          </span>
          <p className="text-xl font-bold text-neutral-800">
            ₦{transaction.total_order_amount.toLocaleString()}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            transaction.payment_status === "partially_paid"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-neutral-50 text-neutral-600 border border-neutral-200"
          }`}
        >
          {transaction.payment_status === "partially_paid"
            ? "Partially Paid"
            : "Awaiting Review"}
        </span>
      </div>

      {transaction.amount_paid > 0 && (
        <div className="text-xs text-neutral-500 bg-neutral-50 p-2.5 rounded-lg">
          Already paid:{" "}
          <span className="font-semibold text-neutral-800">
            ₦{transaction.amount_paid.toLocaleString()}
          </span>
        </div>
      )}

      {!isPartialMode ? (
        <div className="space-y-2 pt-1">
          {/* Primary actions row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDecline(transaction.id)}
              className="w-full text-sm font-medium py-2.5 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all"
            >
              🚩 Decline / Flag
            </button>
            <button
              type="button"
              onClick={handleFullApproval}
              className="w-full text-sm font-semibold py-2.5 text-white bg-[#22C55E] rounded-xl hover:bg-[#15803D] shadow-sm transition-all"
            >
              ✓ Approve Payment
            </button>
          </div>

          {/* Secondary actions row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsPartialMode(true)}
              className="w-full text-xs font-medium py-2 text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-all"
            >
              Log Partial Deposit
            </button>
            <button
              type="button"
              onClick={handleWhatsAppFollowUp}
              className="w-full text-xs font-medium py-2 text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp Follow-up
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
          <label className="text-xs font-semibold text-neutral-600 block">
            Enter Amount Received in this Installment:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-sm text-neutral-400 font-semibold">
              ₦
            </span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full text-sm pl-7 pr-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E] transition-all"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsPartialMode(false)}
              className="text-xs px-3 py-1.5 text-neutral-500 hover:text-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePartialApproval}
              className="text-xs px-3 py-1.5 font-semibold text-white bg-[#22C55E] rounded-lg hover:bg-[#15803D]"
            >
              Confirm Partial Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
