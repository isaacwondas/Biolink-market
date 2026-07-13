"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { TransactionApprovalCard } from "./TransactionApprovalCard";

type FilterTab = "pending" | "approved" | "declined";

interface Receipt {
  id: string;
  created_at: string;
  buyer_name: string;
  buyer_phone?: string;
  receipt_url: string;
  reference_code: string;
  amount_paid: number;
  total_order_amount?: number;
  balance_due?: number;
  payment_status?: string;
  status: "pending" | "approved" | "declined";
}

export default function ReceiptLedger({
  initialTransactions,
  onTransactionUpdate,
}: {
  initialTransactions: Receipt[];
  onTransactionUpdate: (
    id: string,
    updates: {
      amount_paid: number;
      payment_status: string;
    },
  ) => void;
}) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialTransactions);

  const [activeTab, setActiveTab] = useState<FilterTab>("pending");

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const notify = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const counts = useMemo(
    () => ({
      pending: receipts.filter((receipt) => receipt.status === "pending")
        .length,

      approved: receipts.filter(
        (receipt) =>
          receipt.status === "approved" ||
          receipt.payment_status === "fully_paid",
      ).length,

      declined: receipts.filter((receipt) => receipt.status === "declined")
        .length,
    }),
    [receipts],
  );

  const filtered = useMemo(() => {
    return receipts.filter((receipt) => {
      if (activeTab === "pending" && receipt.status !== "pending") {
        return false;
      }

      if (
        activeTab === "approved" &&
        receipt.status !== "approved" &&
        receipt.payment_status !== "fully_paid"
      ) {
        return false;
      }

      if (activeTab === "declined" && receipt.status !== "declined") {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        const matches =
          receipt.buyer_name?.toLowerCase().includes(query) ||
          receipt.reference_code?.toLowerCase().includes(query) ||
          receipt.buyer_phone?.toLowerCase().includes(query);

        if (!matches) {
          return false;
        }
      }

      if (dateFilter) {
        const receiptDate = new Date(receipt.created_at)
          .toISOString()
          .split("T")[0];

        if (receiptDate !== dateFilter) {
          return false;
        }
      }

      if (amountMin && Number(receipt.amount_paid) < Number(amountMin)) {
        return false;
      }

      if (amountMax && Number(receipt.amount_paid) > Number(amountMax)) {
        return false;
      }

      return true;
    });
  }, [receipts, activeTab, searchQuery, dateFilter, amountMin, amountMax]);

  const handleOneClickVerify = async (receipt: Receipt) => {
    setLoadingId(receipt.id);

    try {
      const approvedAmount =
        Number(receipt.total_order_amount) || Number(receipt.amount_paid) || 0;

      const { error } = await supabase
        .from("transactions")
        .update({
          status: "approved",
          amount_paid: approvedAmount,
          balance_due: 0,
          payment_status: "fully_paid",
        })
        .eq("id", receipt.id);

      if (error) {
        throw error;
      }

      setReceipts((previousReceipts) =>
        previousReceipts.map((item) =>
          item.id === receipt.id
            ? {
                ...item,
                status: "approved",
                amount_paid: approvedAmount,
                balance_due: 0,
                payment_status: "fully_paid",
              }
            : item,
        ),
      );

      onTransactionUpdate(receipt.id, {
        amount_paid: approvedAmount,
        payment_status: "fully_paid",
      });

      notify(
        `✓ Payment from ${
          receipt.buyer_name || "customer"
        } verified and approved!`,
      );
    } catch (error: any) {
      notify(error.message || "Unable to approve receipt.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setLoadingId(id);

    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "declined",
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setReceipts((previousReceipts) =>
        previousReceipts.map((receipt) =>
          receipt.id === id
            ? {
                ...receipt,
                status: "declined",
              }
            : receipt,
        ),
      );

      notify("Receipt declined and flagged.", "error");
    } catch (error: any) {
      notify(error.message || "Unable to decline receipt.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCardApprove = async (
    id: string,
    updates: {
      amount_paid: number;
      payment_status: string;
    },
  ) => {
    try {
      const receipt = receipts.find((item) => item.id === id);

      const totalOrderAmount = Number(receipt?.total_order_amount) || 0;

      const balanceDue = Math.max(totalOrderAmount - updates.amount_paid, 0);

      const nextStatus =
        updates.payment_status === "fully_paid" ? "approved" : "pending";

      const { error } = await supabase
        .from("transactions")
        .update({
          amount_paid: updates.amount_paid,
          balance_due: balanceDue,
          payment_status: updates.payment_status,
          status: nextStatus,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setReceipts((previousReceipts) =>
        previousReceipts.map((item) =>
          item.id === id
            ? {
                ...item,
                amount_paid: updates.amount_paid,
                balance_due: balanceDue,
                payment_status: updates.payment_status,
                status: nextStatus,
              }
            : item,
        ),
      );

      onTransactionUpdate(id, updates);

      notify(
        updates.payment_status === "fully_paid"
          ? "Payment fully approved! ✓"
          : "Partial deposit logged.",
      );
    } catch (error: any) {
      notify(error.message || "Unable to update payment.", "error");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter("");
    setAmountMin("");
    setAmountMax("");
  };

  const hasActiveFilters = Boolean(
    searchQuery || dateFilter || amountMin || amountMax,
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm space-y-5">
      {notification && (
        <div
          className={`px-4 py-3 rounded-xl text-xs font-medium border ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-[#15803D]"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {notification.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold uppercase tracking-wider text-[#111827]">
              Receipt Verification
            </h3>

            <span className="text-[10px] bg-green-50 text-[#15803D] font-bold px-2 py-0.5 rounded border border-green-200 uppercase">
              Core Ops
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Verify, approve, or decline incoming customer payment receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((previous) => !previous)}
          className="text-xs px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-[#22C55E] hover:text-[#15803D] transition-all"
        >
          Filters
          {hasActiveFilters ? " •" : ""}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by buyer, phone, or reference..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-[#22C55E]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />

            <input
              type="number"
              value={amountMin}
              onChange={(event) => setAmountMin(event.target.value)}
              placeholder="Minimum amount"
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />

            <input
              type="number"
              value={amountMax}
              onChange={(event) => setAmountMax(event.target.value)}
              placeholder="Maximum amount"
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-red-600"
            >
              ✕ Clear all filters
            </button>
          )}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto">
        {(
          [
            ["pending", "⏳ Pending"],
            ["approved", "✓ Approved"],
            ["declined", "🚩 Declined"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeTab === key
                ? "bg-green-50 border-green-200 text-[#15803D]"
                : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[620px] overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center py-14 border border-dashed border-gray-200 rounded-2xl">
            <span className="text-3xl block mb-2">🧾</span>

            <p className="text-sm text-gray-500">
              No {activeTab} receipts yet.
            </p>
          </div>
        )}

        {filtered.map((receipt) => (
          <div
            key={receipt.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
          >
            <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={receipt.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0"
              >
                <Image
                  src={receipt.receipt_url}
                  alt="Payment receipt"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </a>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-[#111827]">
                    {receipt.buyer_name || "Unknown Customer"}
                  </p>

                  <span className="text-[10px] font-mono px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-500">
                    #{receipt.reference_code || "NO-REF"}
                  </span>
                </div>

                {receipt.buyer_phone && (
                  <p className="text-xs text-gray-500 mt-1">
                    {receipt.buyer_phone}
                  </p>
                )}

                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(receipt.created_at).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <p className="text-lg font-black text-[#15803D]">
                  ₦{Number(receipt.amount_paid).toLocaleString()}
                </p>

                {receipt.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecline(receipt.id)}
                      disabled={loadingId === receipt.id}
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200"
                    >
                      🚩 Decline
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOneClickVerify(receipt)}
                      disabled={loadingId === receipt.id}
                      className="text-xs font-bold px-4 py-2 rounded-lg bg-[#22C55E] text-white hover:bg-[#15803D]"
                    >
                      {loadingId === receipt.id ? "Verifying..." : "✓ Verify"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {receipt.status === "pending" && (
              <div className="border-t border-gray-200 px-4 pb-4 pt-3">
                <details className="group">
                  <summary className="text-xs text-gray-500 cursor-pointer">
                    Advanced options — partial payment & WhatsApp follow-up
                  </summary>

                  <div className="mt-3">
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
                      onConfirm={handleCardApprove}
                      onDecline={handleDecline}
                    />
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
