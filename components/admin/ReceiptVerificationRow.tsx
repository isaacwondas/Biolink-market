"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";

interface ReceiptRow {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string; // Appended tracking parameters to capture phone lines
  order_reference: string;
  amount_paid: number;
  receipt_image_url: string;
  status: "pending" | "approved" | "declined";
}

interface RowProps {
  receipt: ReceiptRow;
  onStatusUpdate: (
    id: string,
    nextStatus: "approved" | "declined",
  ) => Promise<void>;
}

export default function ReceiptVerificationRow({
  receipt,
  onStatusUpdate,
}: RowProps) {
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(receipt.status);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalizes numbers from 0818... to international 234818... formats safely
  const formattedPhone = receipt.customer_phone
    ? receipt.customer_phone
        .replace(/\s+/g, "")
        .replace(/^0/, "234")
        .replace(/^\+/, "")
    : "";

  const handleAction = (targetAction: "approved" | "declined") => {
    startTransition(async () => {
      try {
        await onStatusUpdate(receipt.id, targetAction);
        setLocalStatus(targetAction);
        setIsModalOpen(false);
      } catch (err) {
        console.error("Action resolution processing failure:", err);
      }
    });
  };

  return (
    <>
      <div
        className={`bg-neutral-950 border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:border-neutral-700 ${
          localStatus === "pending"
            ? "border-amber-500/20 bg-amber-500/[0.01]"
            : "border-neutral-800/70"
        }`}
      >
        {/* Left Module: Visual Proof Trigger Box */}
        <div className="flex items-center gap-4 min-w-0">
          <div
            onClick={() => setIsModalOpen(true)}
            className="relative w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 shadow-inner cursor-zoom-in group/thumb"
          >
            <Image
              src={receipt.receipt_image_url}
              alt="Payment proof snapshot"
              fill
              className="object-cover group-hover/thumb:scale-105 transition-transform"
              loading="eager"
              priority={true}
              unoptimized
            />
            <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[10px] bg-neutral-900 border border-neutral-700 px-1 rounded text-neutral-200">
                View
              </span>
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-neutral-200 truncate">
                {receipt.customer_name || "Unknown Customer"}
              </p>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
                #{receipt.order_reference || "NO-REF"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <p className="text-xs text-neutral-500 truncate font-mono">
                {receipt.customer_email || "no-email@provided.com"}
              </p>

              {/* WhatsApp Action Integration Line */}
              {formattedPhone && (
                <a
                  href={`https://wa.me/${formattedPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <span className="text-[10px]">💬</span> Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Module: Workflow Resolution Callouts */}
        <div className="flex sm:flex-col justify-between sm:items-end items-center shrink-0 border-t sm:border-t-0 border-neutral-800/40 pt-2 sm:pt-0 gap-2">
          <p className="text-sm font-black text-emerald-400 tracking-wide">
            ₦{Number(receipt.amount_paid).toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            {localStatus === "pending" ? (
              <div className="flex gap-1">
                <button
                  disabled={isPending}
                  onClick={() => handleAction("approved")}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-1 rounded transition-colors disabled:opacity-40"
                >
                  {isPending ? "..." : "Approve"}
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleAction("declined")}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-1 rounded transition-colors disabled:opacity-40"
                >
                  Decline
                </button>
              </div>
            ) : (
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  localStatus === "approved"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {localStatus}
              </span>
            )}
            <span className="text-[9px] font-mono text-neutral-500">
              {new Date(receipt.created_at).toLocaleDateString("en-NG", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* FULL EXPANSION MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Modal Header Bar */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Auditing Proof Capture
                </h4>
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  Ref: #{receipt.order_reference}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-100 text-sm font-bold bg-neutral-800 hover:bg-neutral-700 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Document Center Stage */}
            <div className="p-4 overflow-y-auto bg-neutral-950/60 flex justify-center items-center relative min-h-[320px] max-h-[50vh]">
              <img
                src={receipt.receipt_image_url}
                alt="Enlarged transaction proof"
                className="max-w-full max-h-full object-contain rounded-lg border border-neutral-800 shadow-md"
              />
            </div>

            {/* Sticky Execution Toolbar Container */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/40 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] text-neutral-400 font-medium truncate">
                  {receipt.customer_name}
                </p>
                <p className="text-sm font-black text-emerald-400 tracking-wide mt-0.5">
                  ₦{Number(receipt.amount_paid).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                {localStatus === "pending" ? (
                  <>
                    <button
                      disabled={isPending}
                      onClick={() => handleAction("declined")}
                      className="bg-neutral-900 hover:bg-rose-950/30 text-rose-400 border border-rose-900/40 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
                    >
                      Decline Transfer
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleAction("approved")}
                      className="bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-bold px-5 py-2 rounded-xl transition-all active:scale-[0.98]"
                    >
                      {isPending ? "Processing..." : "Approve & Clear"}
                    </button>
                  </>
                ) : (
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                      localStatus === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    Status: {localStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
