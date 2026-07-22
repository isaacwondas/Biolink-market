"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Wallet,
  Users,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "₦847,250",
    change: "+18%",
    icon: Wallet,
  },
  {
    title: "Orders",
    value: "243",
    change: "+12%",
    icon: ShoppingBag,
  },
  {
    title: "Visitors",
    value: "4,872",
    change: "+21%",
    icon: Users,
  },
  {
    title: "Conversion",
    value: "8.4%",
    change: "+2.3%",
    icon: TrendingUp,
  },
];

const activities = [
  {
    customer: "Mary Johnson",
    amount: "₦18,500",
    time: "2 mins ago",
  },
  {
    customer: "John David",
    amount: "₦42,000",
    time: "9 mins ago",
  },
  {
    customer: "Aisha Bello",
    amount: "₦12,000",
    time: "14 mins ago",
  },
  {
    customer: "Tunde Ade",
    amount: "₦27,500",
    time: "28 mins ago",
  },
];

const chart = [45, 80, 65, 95, 72, 110, 130];

export default function AnalyticsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Gradient background matching brand */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#22C55E]/5 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#22C55E]/10 text-[#0A2E1C]">
            Business Insights
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-[#111827]">
            Monitor every sale
            <span className="block text-[#22C55E]">
              and grow with confidence.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6B7280]">
            Get a clear overview of your revenue, customer activity and business
            performance from one simple dashboard.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-lg lg:col-span-2"
          >
            {/* KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2">
              {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-[#22C55E]/10 p-3 text-[#22C55E]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-bold text-[#15803D]">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {item.change}
                      </div>
                    </div>

                    <div className="mt-5 text-3xl font-black text-[#111827]">
                      {item.value}
                    </div>

                    <div className="mt-1 text-sm text-[#6B7280]">
                      {item.title}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sales Chart */}
            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-bold text-[#111827]">Weekly Sales</h3>

                <span className="text-sm text-[#22C55E] font-semibold">
                  +18% this week
                </span>
              </div>

              <div className="flex h-56 items-end gap-4 rounded-2xl bg-[#F9FAFB] p-6">
                {chart.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    whileInView={{ height: value }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.08,
                    }}
                    className="flex-1 rounded-full bg-gradient-to-t from-[#22C55E] to-[#86EFAC]"
                    style={{
                      height: `${value}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#111827]">
                Live Activity
              </h3>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-xs text-[#6B7280]">Live</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.customer}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] p-4 hover:bg-[#F9FAFB] transition-all duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E]/10 font-bold text-[#15803D]">
                    {activity.customer.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-[#111827]">
                      {activity.customer}
                    </div>

                    <div className="text-xs text-[#6B7280]">
                      Payment received
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-[#22C55E]">
                      {activity.amount}
                    </div>

                    <div className="text-xs text-[#9CA3AF]">
                      {activity.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Revenue Card */}
            <div className="mt-8 rounded-xl bg-[#22C55E] p-6 text-white">
              <div className="text-sm opacity-90">Total Revenue This Month</div>

              <div className="mt-2 text-4xl font-black">₦2.48M</div>

              <div className="mt-3 text-sm opacity-90">
                You're performing better than 82% of merchants.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
