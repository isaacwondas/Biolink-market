"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { radius, shadows, spacing, typography } from "@/app/lib/design-tokens";

const faqs = [
  {
    q: "How do I receive payments from my customers?",
    a: "Your storefront displays your preferred bank accounts (OPay, GTBank, Zenith, PalmPay and others) alongside a QR code. Customers pay you directly, so there are no platform delays or middlemen.",
  },
  {
    q: "Do I need a laptop or coding knowledge?",
    a: "No. BioLink Market is designed for mobile-first entrepreneurs. You can create, manage and update your storefront entirely from your phone.",
  },
  {
    q: "Can I connect my WhatsApp number?",
    a: "Yes. Every storefront includes a WhatsApp chat button so customers can contact you instantly before placing an order.",
  },
  {
    q: "Are there any hidden transaction charges?",
    a: "No. Creating a storefront is free, and BioLink Market does not charge commission on payments sent directly to your bank account.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className={`${spacing.section} bg-[#FAFAFA]`}>
      <div className={`${spacing.container} max-w-4xl`}>
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-4 py-2 text-xs font-semibold text-[#1A9F49]">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </div>

          <h2 className={`${typography.title} mt-6 text-[#0A2E1C]`}>
            Everything you need to know
          </h2>

          <p
            className={`${typography.body} mx-auto mt-4 max-w-2xl text-slate-600`}
          >
            Here are answers to the questions merchants ask before launching
            their BioLink Market storefront.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;

            return (
              <div
                key={index}
                className={`${radius.xl} ${shadows.card} overflow-hidden border border-gray-100 bg-white transition-all duration-300`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span
                    className={`font-semibold transition-colors ${
                      isOpen ? "text-[#22C55E]" : "text-[#0A2E1C]"
                    }`}
                  >
                    {faq.q}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-6 py-5">
                    <p
                      className={`${typography.body} leading-7 text-slate-600`}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
