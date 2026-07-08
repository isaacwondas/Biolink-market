"use client";

import React, { useState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Build the FormData object natively from the input values
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    // Run the server action to cleanly sign in and drop HTTP-only cookies
    const result = await loginAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setLoading(false);
    } else {
      setMessage({
        type: "success",
        text: "🔐 Authenticated & Connected to Storefront! Redirecting...",
      });

      // Dynamically routes based on the vendor's profile completeness status
      setTimeout(() => {
        window.location.href = result.redirectTo || "/admin/dashboard";
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-center items-center p-4 antialiased selection:bg-[#22C55E] selection:text-white">
      <div className="w-full max-w-md space-y-8">
        {/* Branding / Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-xl mb-2">
            ✨
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#15803D]">
            Merchant HQ
          </h1>
          <p className="text-xs text-[#374151]">
            Log in to manage your storefront, products, and view live analytics.
          </p>
        </div>

        {/* Card Component */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          {/* Status Message Display */}
          {message && (
            <div
              className={`p-4 rounded-xl text-xs border font-medium ${
                message.type === "success"
                  ? "bg-green-50 border-[#22C55E] text-[#15803D]"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#374151] font-semibold uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@biomarket.com"
                className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-[#111827] focus:outline-none focus:border-[#22C55E] transition-colors placeholder:text-gray-400"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#374151] font-semibold uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-[#111827] focus:outline-none focus:border-[#22C55E] transition-colors placeholder:text-gray-400 tracking-widest"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-xl text-center transition-all shadow-xl font-medium tracking-wide text-sm mt-2 active:scale-[0.99]"
            >
              {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>

        {/* Signup link */}
        <p className="text-center text-xs text-[#374151] mt-4">
          Don't have an account?{" "}
          <Link
            href="/merchant/signup"
            className="text-[#22C55E] font-semibold hover:text-[#15803D] transition-colors"
          >
            Create one free
          </Link>
        </p>

        {/* Footer info link */}

        <p className="text-center text-[11px] text-[#374151]">
          Secured by Supabase Identity Infrastructure
        </p>
      </div>
    </div>
  );
}
