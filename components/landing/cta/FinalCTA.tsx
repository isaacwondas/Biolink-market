"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-emerald-50/50 to-emerald-100/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Get Started Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ready to turn your followers into paying customers?
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600">
          Join thousands of merchants using BioLink Market to receive direct
          payments and grow their business.
        </p>

        <div className="pt-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl hover:bg-emerald-700 transition"
          >
            Create Storefront Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
