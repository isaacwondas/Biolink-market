"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I receive payments from my customers?",
    a: "Your store displays your direct bank details (OPay, GTB, Zenith, etc.) and a dynamic QR code. Customers transfer directly to your bank account with zero platform middleman delays.",
  },
  {
    q: "Do I need a laptop or coding knowledge?",
    a: "Not at all! You can set up and manage your entire BioLink Market storefront directly from your mobile phone in under 2 minutes.",
  },
  {
    q: "Can I connect my WhatsApp number?",
    a: "Yes! Every store includes a prominent 'Chat Now' button that routes buyers directly into your WhatsApp chat with product inquiries.",
  },
  {
    q: "Are there any hidden transaction charges?",
    a: "No. BioLink Market charges ₦0 monthly subscription and 0% commission on direct bank transfer orders.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between text-sm font-bold text-slate-900"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
