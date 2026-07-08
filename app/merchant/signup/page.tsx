"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signupAction } from "./actions";
import { supabase } from "@/app/lib/supabase";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/merchant/onboard`,
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

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await signupAction(formData);

      if (!result) {
        setMessage({
          type: "error",
          text: "The authentication server failed to return a response. Please check your terminal console.",
        });
        setLoading(false);
        return;
      }

      if (result.error) {
        setMessage({ type: "error", text: result.error });
        setLoading(false);
      } else {
        setMessage({
          type: "success",
          text: "🚀 Account created successfully! Let's set up your storefront...",
        });

        setTimeout(() => {
          window.location.href = "/merchant/onboard";
        }, 1200);
      }
    } catch (clientErr: any) {
      console.error("Client side execution breakdown:", clientErr);
      setMessage({
        type: "error",
        text:
          clientErr?.message ||
          "A browser runtime pipeline error occurred during execution.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-xl mb-2">
            🚀
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#15803D]">
            Create Merchant Account
          </h1>
          <p className="text-xs text-[#374151]">
            Launch your premium payment link storefront in seconds.
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
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

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-7.8l-6.5 5C9.6 39.5 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.8-6.7 7.5l6.2 5.2C39.7 37.2 44 31.2 44 24c0-1.3-.1-2.3-.4-3.5z"
              />
            </svg>

            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* DIVIDER */}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs uppercase text-gray-500">
                OR
              </span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#374151] font-semibold uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="newmerchant@biomarket.com"
                className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-[#111827] focus:outline-none focus:border-[#22C55E] transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#374151] font-semibold uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-[#111827] focus:outline-none focus:border-[#22C55E] transition-colors tracking-widest placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-xl text-center transition-all shadow-xl font-medium tracking-wide text-sm mt-2 active:scale-[0.99]"
            >
              {loading ? "Creating Account..." : "Register & Start Setup"}
            </button>
          </form>
        </div>

        {/* login link */}
        <p className="text-center text-xs text-[#374151] mt-4">
          Already have an account?{" "}
          <Link
            href="/merchant/login"
            className="text-[#22C55E] font-semibold hover:text-[#15803D] transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
