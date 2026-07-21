"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Adaora Nwosu",
    role: "Founder, Ada Fashion Hub",
    location: "Lagos",
    comment:
      "BioLink Market changed my Instagram shop! Customers no longer ask 'How much?'—they just click my link, view items, and transfer.",
    rating: 5,
  },
  {
    name: "Emeka Okafor",
    role: "Boutique Tailor",
    location: "Abuja",
    comment:
      "The direct WhatsApp order feature is brilliant. I get clear orders with custom suit measurements right in my chats.",
    rating: 5,
  },
  {
    name: "Aisha Bello",
    role: "Beauty & Studio Artist",
    location: "Kano",
    comment:
      "Receiving payments into my OPay account with instant QR scanning at pop-up events made sales 3x faster.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Loved by Vendors
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Trusted by hundreds of Nigerian business owners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">
                  {t.role} • {t.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
