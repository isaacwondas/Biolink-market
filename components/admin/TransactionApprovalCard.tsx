"use client";

import { useState } from "react";

interface Transaction {
  id: string;
  total_order_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
}

export function TransactionApprovalCard({
  transaction,
  onConfirm,
}: {
  transaction: Transaction;
  onConfirm: (
    id: string,
    updates: { amount_paid: number; payment_status: string },
  ) => void;
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
          Already Paid so far:{" "}
          <span className="font-semibold text-neutral-800">
            ₦{transaction.amount_paid.toLocaleString()}
          </span>
        </div>
      )}

      {!isPartialMode ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsPartialMode(true)}
            className="w-full text-sm font-medium py-2.5 text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-all"
          >
            Log Partial Deposit
          </button>
          <button
            type="button"
            onClick={handleFullApproval}
            className="w-full text-sm font-semibold py-2.5 text-white bg-[#044766] rounded-xl hover:bg-[#03364d] shadow-sm transition-all"
          >
            Approve Full Payment
          </button>
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
              className="w-full text-sm pl-7 pr-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#044766] focus:border-[#044766] transition-all"
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
              className="text-xs px-3 py-1.5 font-semibold text-white bg-[#044766] rounded-lg hover:bg-[#03364d]"
            >
              Confirm Partial Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
