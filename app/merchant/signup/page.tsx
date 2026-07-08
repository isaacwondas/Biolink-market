"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signupAction } from "./actions";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
          window.location.href = "/admin/onboard";
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
