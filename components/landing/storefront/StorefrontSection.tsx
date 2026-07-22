"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  colors,
  radius,
  shadows,
  typography,
  spacing,
  components,
  fadeUp,
} from "@/app/lib/design-tokens";

import {
  ExternalLink,
  Heart,
  MessageCircle,
  ShoppingBag,
  Star,
} from "lucide-react";

const products = [
  {
    name: "Luxury Ankara Gown",
    price: "₦18,500",
    image: "/landing/products/fashion1.jpg",
  },
  {
    name: "Premium Leather Bag",
    price: "₦27,000",
    image: "/landing/products/bag.jpg",
  },
  {
    name: "Classic Heels",
    price: "₦15,000",
    image: "/landing/products/shoe.jpg",
  },
];

export default function StorefrontSection() {
  return (
    <section
      className={`relative overflow-hidden ${colors.backgroundAlt} ${spacing.section}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/10 via-transparent to-[#0A2E1C]/5" />

      <div className={`relative ${spacing.container}`}>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className={`${components.badge} bg-[#22C55E]/10 text-[#1A9F49]`}
            >
              Your Digital Store
            </div>

            <h2 className={`${typography.title} ${colors.text} mt-6`}>
              A beautiful storefront your customers will love.
            </h2>

            <p className={`${typography.body} mt-5`}>
              Every merchant gets a fast, mobile-first storefront with product
              listings, WhatsApp checkout, payment verification and a shareable
              bio link that works everywhere.
            </p>

            <div className="mt-10 space-y-6">
              {[
                "Unlimited product listings",
                "Optimized for Instagram & TikTok traffic",
                "Share one link everywhere",
                "Lightning-fast mobile experience",
              ].map((item) => (
                <div
                  key={item}
                  className={`${components.card} ${radius.lg} ${shadows.card} flex items-center gap-4 p-4`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
                    ✓
                  </div>

                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Floating Notification */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              className="absolute -left-8 top-8 z-20 rounded-2xl border bg-white px-5 py-4 shadow-xl"
            >
              <div className="text-sm font-bold text-[#0A2E1C]">
                🎉 New Order
              </div>
              <div className="text-xs text-slate-500">₦18,500 received</div>
            </motion.div>

            {/* Store Card */}
            <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-2xl">
              {/* Cover */}
              <div className="h-44 bg-gradient-to-tr from-[#1A9F49] to-[#22C55E]" />

              {/* Profile */}
              <div className="-mt-12 px-8 pb-8">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-200">
                    <Image
                      src="/landing/merchants/fashion.JPG"
                      alt="Merchant"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#0A2E1C]">
                      Ada Fashion Hub
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.9 Rating
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-8 grid gap-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.name}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-4 ${radius.lg} border ${colors.borderLight} p-3 transition-transform`}
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-[#0A2E1C]">
                          {product.name}
                        </div>

                        <div className="text-sm text-[#22C55E] font-bold">
                          {product.price}
                        </div>
                      </div>

                      <ShoppingBag className="h-5 w-5 text-slate-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-3">
                  <button className="flex-1 rounded-xl bg-[#22C55E] py-3 text-sm font-bold text-white hover:bg-[#1A9F49] transition">
                    Shop Now
                  </button>

                  <button className="flex h-12 w-12 items-center justify-center rounded-xl border">
                    <MessageCircle className="h-5 w-5" />
                  </button>

                  <button className="flex h-12 w-12 items-center justify-center rounded-xl border">
                    <Heart className="h-5 w-5" />
                  </button>

                  <button className="flex h-12 w-12 items-center justify-center rounded-xl border">
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="absolute -right-8 bottom-10 rounded-2xl bg-[#0A2E1C] px-5 py-4 text-white shadow-xl"
            >
              <div className="text-lg font-bold">328</div>
              <div className="text-xs opacity-90">Visitors Today</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
