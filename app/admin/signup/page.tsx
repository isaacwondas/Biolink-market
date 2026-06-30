"use client";

import React, { useState } from "react";
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

      // Inspect if next server threw an unhandled or blank action error object
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xl mb-2">
            🚀
          </div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-50">
            Create Merchant Account
          </h1>
          <p className="text-xs text-neutral-400">
            Launch your premium payment link storefront in seconds.
          </p>
        </div>

        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
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

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="newmerchant@biomarket.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors tracking-widest placeholder:text-neutral-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold py-3 px-4 rounded-xl text-center transition-all shadow-xl font-medium tracking-wide text-sm mt-2 active:scale-[0.99]"
            >
              {loading ? "Creating Account..." : "Register & Start Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
