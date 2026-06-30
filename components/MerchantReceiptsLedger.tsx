"use client";

import React, { useState } from "react";
import { supabase } from "../app/lib/supabase"; // Adjust relative path based on location

interface Transaction {
  id: number;
  created_at: string;
  buyer_name: string;
  buyer_phone: string;
  receipt_url: string;
  reference_code: string;
  status: string;
}

interface LedgerProps {
  initialTransactions: Transaction[];
}

export default function MerchantReceiptsLedger({
  initialTransactions,
}: LedgerProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const updateStatus = async (
    id: number,
    newStatus: "verified" | "declined",
  ) => {
    const { error } = await supabase
      .from("transactions")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
      );
    }
  };

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl text-neutral-100 antialiased">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-neutral-50 flex items-center gap-2">
          📥 Bank Transfer Receipts
        </h2>
        <p className="text-xs text-neutral-400">
          Verify and cross-reference incoming manual payments submitted via your
          public bio link.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
          <span className="text-2xl">💤</span>
          <p className="text-xs text-neutral-500 mt-2 font-medium">
            No transfer receipts uploaded yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <th className="pb-3 font-medium">Ref Code</th>
                <th className="pb-3 font-medium">Buyer Details</th>
                <th className="pb-3 font-medium">Screenshot</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-sm">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="group hover:bg-neutral-950/20 transition-colors"
                >
                  {/* Ref Code */}
                  <td className="py-4 font-mono font-bold text-amber-500">
                    {tx.reference_code}
                  </td>

                  {/* Buyer Identity Info */}
                  <td className="py-4">
                    <div className="font-semibold text-neutral-200">
                      {tx.buyer_name}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">
                      {tx.buyer_phone}
                    </div>
                  </td>

                  {/* Receipt Image link handoff */}
                  <td className="py-4">
                    <a
                      href={tx.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-neutral-300 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 font-medium px-2.5 py-1.5 rounded-xl transition-colors"
                    >
                      👁️ View Image
                    </a>
                  </td>

                  {/* Operational Status Badges */}
                  <td className="py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                        tx.status === "verified"
                          ? "bg-emerald-950/30 border-emerald-800 text-emerald-400"
                          : tx.status === "declined"
                            ? "bg-rose-950/30 border-rose-800 text-rose-400"
                            : "bg-neutral-950 border-neutral-800 text-neutral-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  {/* Actions Layer */}
                  <td className="py-4 text-right space-x-1">
                    {tx.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(tx.id, "verified")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-md active:scale-95"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(tx.id, "declined")}
                          className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-rose-400 font-semibold text-xs px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {tx.status !== "pending" && (
                      <span className="text-xs text-neutral-600 italic font-normal">
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
