"use client";

import React, { useState } from "react";
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-4 antialiased selection:bg-amber-500 selection:text-neutral-950">
      <div className="w-full max-w-md space-y-8">
        {/* Branding / Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xl mb-2">
            ✨
          </div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-50">
            Merchant HQ
          </h1>
          <p className="text-xs text-neutral-400">
            Log in to manage your storefront, products, and view live analytics.
          </p>
        </div>

        {/* Card Component */}
        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          {/* Status Message Display */}
          {message && (
            <div
              className={`p-4 rounded-xl text-xs border font-medium ${
                message.type === "success"
                  ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                  : "bg-rose-950/40 border-rose-800 text-rose-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@biomarket.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600 tracking-widest"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold py-3 px-4 rounded-xl text-center transition-all shadow-xl font-medium tracking-wide text-sm mt-2 active:scale-[0.99]"
            >
              {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>

        {/* Footer info link */}
        <p className="text-center text-[11px] text-neutral-600">
          Secured by Supabase Identity Infrastructure
        </p>
      </div>
    </div>
  );
}
