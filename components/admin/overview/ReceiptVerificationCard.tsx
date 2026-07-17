"use client";

import { useState } from "react";
import Image from "next/image";

import { supabase } from "@/app/lib/supabase";
import { TransactionApprovalCard } from "@/components/admin/TransactionApprovalCard";

interface Receipt {
  id: string;
  customer_name: string;
  vendor_email: string;
  buyer_name?: string;
  buyer_phone?: string;
  reference_code?: string;
  receipt_url: string;
  created_at: string;
  amount_paid: number;
  total_order_amount: number;
  balance_due: number;
  payment_status: string;
  status: string;
}

interface ReceiptVerificationCardProps {
  initialTransactions: Receipt[];
  onTransactionUpdate: (
    id: string,
    updates: {
      amount_paid: number;
      payment_status: string;
    },
  ) => void;
}

export default function ReceiptVerificationCard({
  initialTransactions,
  onTransactionUpdate,
}: ReceiptVerificationCardProps) {
  const [receiptFilter, setReceiptFilter] = useState<
    "pending" | "cleared" | "declined"
  >("pending");

  const [localReceipts, setLocalReceipts] = useState(initialTransactions);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  async function handleDecline(id: string) {
    const { error } = await supabase
      .from("transactions")
      .update({
        status: "declined",
      })
      .eq("id", id);

    if (error) return;

    setLocalReceipts((prev) =>
      prev.map((receipt) =>
        receipt.reference_code === receipt.reference_code
          ? {
              ...receipt,
              status: "declined",
            }
          : receipt,
      ),
    );

    showNotification("Receipt declined.");
  }

  function handleApprove(
    id: string,
    updates: {
      amount_paid: number;
      payment_status: string;
    },
  ) {
    onTransactionUpdate(id, updates);

    setLocalReceipts((prev) =>
      prev.map((receipt) =>
        receipt.reference_code === receipt.reference_code
          ? {
              ...receipt,
              ...updates,
              status:
                updates.payment_status === "fully_paid"
                  ? "approved"
                  : receipt.status,
            }
          : receipt,
      ),
    );

    showNotification("Payment approved successfully.");
  }

  const pendingCount = localReceipts.filter(
    (r) => r.status === "pending" && r.payment_status !== "fully_paid",
  ).length;

  const clearedCount = localReceipts.filter(
    (r) => r.status === "approved" || r.payment_status === "fully_paid",
  ).length;

  const declinedCount = localReceipts.filter(
    (r) => r.status === "declined",
  ).length;

  const filteredReceipts = localReceipts.filter((receipt) => {
    if (receiptFilter === "pending") {
      return (
        receipt.status === "pending" && receipt.payment_status !== "fully_paid"
      );
    }

    if (receiptFilter === "cleared") {
      return (
        receipt.status === "approved" || receipt.payment_status === "fully_paid"
      );
    }

    if (receiptFilter === "declined") {
      return receipt.status === "declined";
    }

    return true;
  });

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
      {/* Notification */}

      {notification && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span className="text-lg">✅</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Receipt Verification
          </h2>

          <p className="text-sm text-[#6B7280]">
            Review customer payment receipts before fulfilling orders.
          </p>
        </div>

        <div className="rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1 text-xs font-semibold text-[#15803D]">
          {pendingCount} Pending
        </div>
      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setReceiptFilter("pending")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
            receiptFilter === "pending"
              ? "bg-amber-100 border-amber-300 text-amber-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Pending ({pendingCount})
        </button>

        <button
          onClick={() => setReceiptFilter("cleared")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
            receiptFilter === "cleared"
              ? "bg-green-100 border-green-300 text-green-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Cleared ({clearedCount})
        </button>

        <button
          onClick={() => setReceiptFilter("declined")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
            receiptFilter === "declined"
              ? "bg-red-100 border-red-300 text-red-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Declined ({declinedCount})
        </button>
      </div>

      {/* Receipt List */}

      <div className="space-y-4">
        {filteredReceipts.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <div className="text-4xl mb-3">📭</div>

            <h3 className="font-semibold text-gray-700">No receipts found</h3>

            <p className="mt-1 text-sm text-gray-500">
              There are currently no {receiptFilter} receipts.
            </p>
          </div>
        )}

        {filteredReceipts.map((receipt) => (
          <div
            key={receipt.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Customer */}

              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src={receipt.receipt_url}
                    alt="Receipt"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[#111827]">
                    {receipt.buyer_name || "Unknown Customer"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {receipt.vendor_email}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    #{receipt.reference_code || "NO-REF"}
                  </p>
                </div>
              </div>

              {/* Amount */}

              <div className="text-left lg:text-right">
                <p className="text-2xl font-bold text-[#22C55E]">
                  ₦{Number(receipt.amount_paid).toLocaleString()}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(receipt.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Status + Approval */}

            <div className="mt-5 border-t border-gray-200 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    receipt.status === "approved" ||
                    receipt.payment_status === "fully_paid"
                      ? "bg-green-100 text-green-700"
                      : receipt.status === "declined"
                        ? "bg-red-100 text-red-700"
                        : receipt.payment_status === "partially_paid"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {receipt.status === "declined"
                    ? "Declined"
                    : receipt.payment_status === "fully_paid"
                      ? "Fully Paid"
                      : receipt.payment_status === "partially_paid"
                        ? "Partially Paid"
                        : "Pending"}
                </span>

                <div className="text-sm text-gray-500">
                  Balance:
                  <span className="ml-2 font-semibold text-[#111827]">
                    ₦{Number(receipt.balance_due ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {receipt.payment_status !== "fully_paid" &&
                receipt.status !== "approved" &&
                receipt.status !== "declined" && (
                  <div className="mt-5">
                    <TransactionApprovalCard
                      transaction={{
                        id: receipt.id,
                        total_order_amount:
                          Number(receipt.total_order_amount) || 0,
                        amount_paid: Number(receipt.amount_paid) || 0,
                        balance_due: Number(receipt.balance_due) || 0,
                        payment_status: receipt.payment_status || "unpaid",
                        buyer_name: receipt.buyer_name,
                        buyer_phone: receipt.buyer_phone,
                      }}
                      onConfirm={handleApprove}
                      onDecline={handleDecline}
                    />
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
