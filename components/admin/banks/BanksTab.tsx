"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

import Toast from "@/components/admin/ui/Toast";
const POPULAR_BANKS = [
  "OPay",
  "PalmPay",
  "Moniepoint",
  "Zenith Bank",
  "GTBank",
  "Access Bank",
  "UBA",
  "Kuda Bank",
];

interface Bank {
  id?: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

function BanksTab({ vendor }: { vendor: any }) {
  const [banks, setBanks] = useState<Bank[]>(
    vendor.vendor_banks?.length > 0
      ? vendor.vendor_banks
      : [{ bank_name: "OPay", account_number: "", account_name: "" }],
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleBankChange = (idx: number, field: keyof Bank, value: string) => {
    const updated = [...banks];
    updated[idx] = { ...updated[idx], [field]: value };
    setBanks(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      // Delete existing and re-insert
      await supabase.from("vendor_banks").delete().eq("vendor_id", vendor.id);
      const rows = banks
        .filter((b) => b.account_number.trim() !== "")
        .map((b) => ({
          vendor_id: vendor.id,
          bank_name: b.bank_name,
          account_number: b.account_number,
          account_name: b.account_name,
        }));
      if (rows.length > 0) {
        const { error } = await supabase.from("vendor_banks").insert(rows);
        if (error) throw error;
      }
      setMsg({ type: "success", text: "Bank details updated!" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#111827]">Bank Details</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Up to 3 payment accounts shown on your storefront.
          </p>
        </div>
        {banks.length < 3 && (
          <button
            onClick={() =>
              setBanks([
                ...banks,
                { bank_name: "OPay", account_number: "", account_name: "" },
              ])
            }
            className="text-xs text-[#15803D] border border-[#22C55E]/50 px-3 py-1.5 rounded-lg hover:bg-[#22C55E]/30 transition-colors"
          >
            + Add Bank
          </button>
        )}
      </div>

      <Toast msg={msg} />

      <div className="space-y-4">
        {banks.map((bank, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280] font-medium uppercase">
                Bank #{idx + 1}
              </span>
              {banks.length > 1 && (
                <button
                  onClick={() => setBanks(banks.filter((_, i) => i !== idx))}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] font-medium uppercase">
                  Bank
                </label>
                <select
                  value={bank.bank_name}
                  onChange={(e) =>
                    handleBankChange(idx, "bank_name", e.target.value)
                  }
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] font-medium uppercase">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bank.account_number}
                  onChange={(e) =>
                    handleBankChange(idx, "account_number", e.target.value)
                  }
                  placeholder="0472567510"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] font-mono focus:outline-none focus:border-[#22C55E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] font-medium uppercase">
                  Account Name
                </label>
                <input
                  type="text"
                  value={bank.account_name}
                  onChange={(e) =>
                    handleBankChange(idx, "account_name", e.target.value)
                  }
                  placeholder="Ada Fabrics Ltd"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
      >
        {loading ? "Saving..." : "Save Bank Details"}
      </button>
    </div>
  );
}
export default BanksTab;
