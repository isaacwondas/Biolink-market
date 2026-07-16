"use client";

import { type ChangeEvent } from "react";

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export default function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-[#6B7280] font-medium uppercase">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
      />
    </div>
  );
}
