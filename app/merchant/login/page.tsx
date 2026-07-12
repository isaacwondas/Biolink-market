"use client";

import React, { useState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";
import { supabase } from "@/app/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // =============================================
  // EMAIL + PASSWORD LOGIN
  // =============================================

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    const formData = new FormData();

    formData.append("email", email.trim().toLowerCase());
    formData.append("password", password);

    try {
      const result = await loginAction(formData);

      if (result.error) {
        setMessage({
          type: "error",
          text: result.error,
        });

        setLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: "🔐 Login successful. Redirecting...",
      });

      setTimeout(() => {
        window.location.href = result.redirectTo || "/merchant/dashboard";
      }, 1000);
    } catch {
      setMessage({
        type: "error",
        text: "Unable to sign in right now. Please try again.",
      });

      setLoading(false);
    }
  };

  // =============================================
  // GOOGLE LOGIN
  // =============================================

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/merchant/dashboard`,
      },
    });

    if (error) {
      setGoogleLoading(false);

      setMessage({
        type: "error",
        text: error.message,
      });
    }
  };

  const isBusy = loading || googleLoading;

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-center items-center px-4 py-8 antialiased selection:bg-[#22C55E] selection:text-white">
      <div className="w-full max-w-md space-y-7">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-xl mb-2">
            ✨
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#15803D]">
            Merchant HQ
          </h1>

          <p className="text-sm text-[#6B7280] leading-relaxed px-4">
            Log in to manage your storefront, products and live analytics.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl space-y-6">
          {/* MESSAGE */}
          {message && (
            <div
              role="alert"
              className={`p-4 rounded-xl text-sm border font-medium ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-[#15803D]"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isBusy}
            className="w-full min-h-[50px] bg-white border border-[#D1D5DB] hover:border-[#22C55E] hover:bg-green-50/40 disabled:bg-gray-100 disabled:cursor-not-allowed text-[#111827] font-semibold px-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            {googleLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#22C55E] rounded-full animate-spin" />

                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M21.35 12.2c0-.7-.06-1.2-.2-1.8H12v3.4h5.35c-.1.85-.7 2.15-2 3l-.02.11 2.9 2.25.2.02c1.85-1.7 2.92-4.22 2.92-6.98Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.7c2.65 0 4.87-.87 6.5-2.37l-3.1-2.4c-.82.55-1.92.95-3.4.95-2.55 0-4.72-1.72-5.5-4.1l-.1.01-3.02 2.34-.03.1A9.82 9.82 0 0 0 12 21.7Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.5 13.78A5.9 5.9 0 0 1 6.18 12c0-.62.12-1.22.3-1.78l-.01-.12-3.05-2.38-.1.05A9.72 9.72 0 0 0 2.3 12c0 1.55.37 3.02 1.05 4.23l3.15-2.45Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 6.12c1.85 0 3.1.8 3.82 1.47l2.75-2.68C16.87 3.32 14.65 2.3 12 2.3a9.82 9.82 0 0 0-8.65 5.47l3.13 2.45c.8-2.38 2.97-4.1 5.52-4.1Z"
                  />
                </svg>

                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-4">
            <div className="h-px bg-[#E5E7EB] flex-1" />

            <span className="text-xs font-medium text-[#9CA3AF] uppercase">
              Or sign in with email
            </span>

            <div className="h-px bg-[#E5E7EB] flex-1" />
          </div>

          {/* EMAIL LOGIN */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#374151]">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isBusy}
                placeholder="vendor@example.com"
                autoComplete="email"
                className="w-full min-h-[50px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#374151]">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isBusy}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full min-h-[50px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full min-h-[52px] bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold px-5 rounded-xl text-center transition-all shadow-lg text-sm md:text-base active:scale-[0.99]"
            >
              {loading ? "Verifying credentials..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>

        {/* SIGNUP */}
        <p className="text-center text-sm text-[#374151]">
          Don't have an account?{" "}
          <Link
            href="/merchant/signup"
            className="text-[#15803D] font-bold hover:text-[#22C55E] transition-colors"
          >
            Create one free
          </Link>
        </p>

        <p className="text-center text-[11px] text-[#6B7280]">
          Secured by Supabase Identity Infrastructure
        </p>
      </div>
    </div>
  );
}
