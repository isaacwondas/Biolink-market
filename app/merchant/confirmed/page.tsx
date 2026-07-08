"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full mx-auto flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#22C55E]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#111827]">Check your inbox</h1>
          <p className="text-sm text-[#374151] leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="font-semibold text-[#111827]">{email}</span>. Click
            the link in that email to activate your account.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-gray-50 border border-[#E5E7EB] rounded-2xl p-4 text-left space-y-3">
          {[
            { step: "1", text: "Open your email inbox" },
            { step: "2", text: "Find the email from Biolink Market" },
            { step: "3", text: "Click the confirmation link" },
            { step: "4", text: "You'll be taken to set up your storefront" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#22C55E] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {item.step}
              </span>
              <p className="text-xs text-[#374151]">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Spam note */}
        <p className="text-[11px] text-gray-400">
          Can't find it? Check your spam or junk folder.
        </p>

        {/* Back to login */}
        <Link
          href="/merchant/login"
          className="block text-xs text-[#22C55E] font-semibold hover:text-[#15803D] transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense>
      <ConfirmedContent />
    </Suspense>
  );
}
