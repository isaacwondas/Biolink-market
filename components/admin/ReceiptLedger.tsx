"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { TransactionApprovalCard } from "./TransactionApprovalCard";

type FilterTab = "pending" | "approved" | "declined";

interface Receipt {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_reference: string;
  amount_paid: number;
  total_order_amount?: number;
  balance_due?: number;
  payment_status?: string;
  status: "pending" | "approved" | "declined";
  receipt_image_url: string;
}

export default function ReceiptLedger({
  initialReceipts,
  onTransactionUpdate,
}: {
  initialReceipts: Receipt[];
  onTransactionUpdate: (
    id: string,
    updates: { amount_paid: number; payment_status: string },
  ) => void;
}) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // ── Notification helper ───────────────────────────────────────────────────
  const notify = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Tab counts ────────────────────────────────────────────────────────────
  const counts = useMemo(
    () => ({
      pending: receipts.filter((r) => r.status === "pending").length,
      approved: receipts.filter(
        (r) => r.status === "approved" || r.payment_status === "fully_paid",
      ).length,
      declined: receipts.filter((r) => r.status === "declined").length,
    }),
    [receipts],
  );

  // ── Filter + search logic ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return receipts.filter((r) => {
      // Tab filter
      if (activeTab === "pending" && !(r.status === "pending")) return false;
      if (
        activeTab === "approved" &&
        !(r.status === "approved" || r.payment_status === "fully_paid")
      )
        return false;
      if (activeTab === "declined" && r.status !== "declined") return false;

      // Search filter — name, email, or reference
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          r.customer_name?.toLowerCase().includes(q) ||
          r.customer_email?.toLowerCase().includes(q) ||
          r.order_reference?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Date filter
      if (dateFilter) {
        const receiptDate = new Date(r.created_at).toISOString().split("T")[0];
        if (receiptDate !== dateFilter) return false;
      }

      // Amount range filter
      if (amountMin && Number(r.amount_paid) < Number(amountMin)) return false;
      if (amountMax && Number(r.amount_paid) > Number(amountMax)) return false;

      return true;
    });
  }, [receipts, activeTab, searchQuery, dateFilter, amountMin, amountMax]);

  // ── One-click verify ──────────────────────────────────────────────────────
  const handleOneClickVerify = async (receipt: Receipt) => {
    setLoadingId(receipt.id);
    try {
      const { error } = await supabase
        .from("receipt_submissions")
        .update({ status: "approved", payment_status: "fully_paid" })
        .eq("id", receipt.id);

      if (error) throw error;

      setReceipts((prev) =>
        prev.map((r) =>
          r.id === receipt.id
            ? { ...r, status: "approved", payment_status: "fully_paid" }
            : r,
        ),
      );

      onTransactionUpdate(receipt.id, {
        amount_paid: receipt.total_order_amount || receipt.amount_paid,
        payment_status: "fully_paid",
      });

      notify(
        `✓ Payment from ${receipt.customer_name || "customer"} verified and approved!`,
      );
    } catch (err: any) {
      notify(err.message, "error");
    } finally {
      setLoadingId(null);
    }
  };

  // ── Decline ───────────────────────────────────────────────────────────────
  const handleDecline = async (id: string) => {
    setLoadingId(id);
    try {
      const { error } = await supabase
        .from("receipt_submissions")
        .update({ status: "declined" })
        .eq("id", id);

      if (error) throw error;

      setReceipts((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "declined" } : r)),
      );
      notify("Receipt declined and flagged.", "error");
    } catch (err: any) {
      notify(err.message, "error");
    } finally {
      setLoadingId(null);
    }
  };

  // ── Partial / full approval from card ─────────────────────────────────────
  const handleCardApprove = (
    id: string,
    updates: { amount_paid: number; payment_status: string },
  ) => {
    onTransactionUpdate(id, updates);
    setReceipts((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              amount_paid: updates.amount_paid,
              payment_status: updates.payment_status,
              status:
                updates.payment_status === "fully_paid" ? "approved" : r.status,
            }
          : r,
      ),
    );
    notify(
      updates.payment_status === "fully_paid"
        ? "Payment fully approved! ✓"
        : "Partial deposit logged.",
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter("");
    setAmountMin("");
    setAmountMax("");
  };

  const hasActiveFilters = searchQuery || dateFilter || amountMin || amountMax;

  return (
    <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-5">
      {/* ── In-app notification ── */}
      {notification && (
        <div
          className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
            notification.type === "success"
              ? "bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          <span>{notification.type === "success" ? "🔔" : "⚠️"}</span>
          {notification.text}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-800/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200">
              Receipt Verification
            </h3>
            <span className="text-[10px] bg-[#044766]/20 text-sky-400 font-bold px-2 py-0.5 rounded border border-[#044766]/30 uppercase">
              Core Ops
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Verify, approve, or decline incoming customer payment receipts.
          </p>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-all ${
            showFilters || hasActiveFilters
              ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
              : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M7 8h10M11 12h2M11 16h2"
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          )}
        </button>
      </div>

      {/* ── Search & Filters panel ── */}
      {showFilters && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or reference..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date filter */}
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-medium uppercase">
                Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E] transition-all"
              />
            </div>

            {/* Amount min */}
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-medium uppercase">
                Min Amount (₦)
              </label>
              <input
                type="number"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                placeholder="0"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E] transition-all"
              />
            </div>

            {/* Amount max */}
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-medium uppercase">
                Max Amount (₦)
              </label>
              <input
                type="number"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                placeholder="999999"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E] transition-all"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
            >
              ✕ Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ── Status Tabs ── */}
      <div className="flex gap-2">
        {(
          [
            { key: "pending", label: "Pending", color: "amber" },
            { key: "approved", label: "Approved", color: "emerald" },
            { key: "declined", label: "Declined", color: "red" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
              activeTab === tab.key
                ? tab.color === "amber"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : tab.color === "emerald"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-transparent border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
            }`}
          >
            <span>
              {tab.key === "pending"
                ? "⏳"
                : tab.key === "approved"
                  ? "✓"
                  : "🚩"}
            </span>
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                activeTab === tab.key ? "bg-white/10" : "bg-neutral-800"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}

        {/* Result count if filtering */}
        {hasActiveFilters && (
          <span className="ml-auto text-[10px] text-neutral-500 self-center">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Receipt Rows ── */}
      <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
            <span className="text-3xl block mb-2">
              {activeTab === "pending"
                ? "🧾"
                : activeTab === "approved"
                  ? "✅"
                  : "🚩"}
            </span>
            <p className="text-xs text-neutral-500 font-medium">
              {hasActiveFilters
                ? "No receipts match your filters."
                : `No ${activeTab} receipts yet.`}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#22C55E] mt-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {filtered.map((receipt) => (
          <div
            key={receipt.id}
            className={`bg-neutral-950 border rounded-2xl overflow-hidden transition-all ${
              receipt.status === "pending"
                ? "border-amber-500/20"
                : receipt.status === "declined"
                  ? "border-red-500/20"
                  : "border-neutral-800/60"
            }`}
          >
            {/* Receipt row top */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Receipt image */}
              <div className="relative w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                <Image
                  src={receipt.receipt_image_url}
                  alt="Receipt"
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform"
                  unoptimized
                />
              </div>

              {/* Customer info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-neutral-200 truncate">
                    {receipt.customer_name || "Unknown Customer"}
                  </p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
                    #{receipt.order_reference || "NO-REF"}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      receipt.status === "approved" ||
                      receipt.payment_status === "fully_paid"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : receipt.status === "declined"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : receipt.payment_status === "partially_paid"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-neutral-500/10 text-neutral-400 border border-neutral-800"
                    }`}
                  >
                    {receipt.status === "declined"
                      ? "Declined"
                      : receipt.payment_status === "fully_paid"
                        ? "Fully Paid"
                        : receipt.payment_status === "partially_paid"
                          ? "Partial"
                          : "Pending"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate">
                  {receipt.customer_email}
                </p>
                <p className="text-[10px] text-neutral-600 mt-0.5">
                  {new Date(receipt.created_at).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Amount + actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-lg font-black text-emerald-400">
                  ₦{Number(receipt.amount_paid).toLocaleString()}
                </p>

                {/* ── ONE-CLICK VERIFY (only for pending) ── */}
                {receipt.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecline(receipt.id)}
                      disabled={loadingId === receipt.id}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      🚩 Decline
                    </button>
                    <button
                      onClick={() => handleOneClickVerify(receipt)}
                      disabled={loadingId === receipt.id}
                      className="text-[11px] font-bold px-4 py-1.5 rounded-lg bg-[#22C55E] text-white hover:bg-[#15803D] transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {loadingId === receipt.id ? (
                        <>
                          <svg
                            className="w-3 h-3 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>✓ Verify</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Expandable approval card for partial/advanced actions ── */}
            {receipt.status === "pending" && (
              <div className="border-t border-neutral-800/60 px-4 pb-4 pt-3 text-neutral-900">
                <details className="group">
                  <summary className="text-[11px] text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors list-none flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 transition-transform group-open:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Advanced options (partial payment, WhatsApp follow-up)
                  </summary>
                  <div className="mt-3">
                    <TransactionApprovalCard
                      transaction={{
                        id: receipt.id,
                        total_order_amount:
                          receipt.total_order_amount ||
                          receipt.amount_paid ||
                          0,
                        amount_paid: receipt.amount_paid || 0,
                        balance_due: receipt.balance_due || 0,
                        payment_status: receipt.payment_status || "unpaid",
                        customer_name: receipt.customer_name,
                        customer_phone: receipt.customer_phone,
                        customer_email: receipt.customer_email,
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
