"use client";

import { motion } from "framer-motion";
import {
  colors,
  fadeUp,
  radius,
  shadows,
  spacing,
  transition,
  typography,
} from "@/app/lib/design-tokens";
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
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}

        <div className={`${components.sectionHeading} mb-16`}>
          <div className={`${components.badge} ${colors.badge}`}>
            Business Insights
          </div>

          <h2 className={`${typography.title} mt-6`}>
            Monitor every sale
            <span className="block text-emerald-600">
              and grow with confidence.
            </span>
          </h2>

          <p className={`${components.sectionBody} ${typography.body}`}>
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
            className="radius.xl border border-slate-200 bg-white p-8 shadow-xl lg:col-span-2"
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
                    className={`${radius.lg} border ${colors.borderLight} ${colors.backgroundAlt} p-5`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {item.change}
                      </div>
                    </div>

                    <div className="mt-5 text-3xl font-extrabold text-slate-900">
                      {item.value}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      {item.title}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sales Chart */}

            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Weekly Sales</h3>

                <span className="text-sm text-emerald-600 font-semibold">
                  +18% this week
                </span>
              </div>

              <div className="flex h-56 items-end gap-4 rounded-3xl bg-slate-50 p-6">
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
                    className="flex-1 rounded-full bg-gradient-to-t from-emerald-600 to-emerald-300"
                    style={{
                      height: value,
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
            className={`${components.card} ${radius.xl} ${shadows.floating} ${spacing.cardPaddingLg}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Live Activity
              </h3>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-500">Live</span>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.customer}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    {activity.customer.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">
                      {activity.customer}
                    </div>

                    <div className="text-xs text-slate-500">
                      Payment received
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-600">
                      {activity.amount}
                    </div>

                    <div className="text-xs text-slate-400">
                      {activity.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl colors.brand p-6 text-white">
              <div className="text-sm opacity-90">Total Revenue This Month</div>

              <div className="mt-2 text-4xl font-extrabold">₦2.48M</div>

              <div className="mt-2 text-sm opacity-80">
                You're performing better than 82% of merchants.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

colors.brand;
export const components = {
  card: "border border-slate-200 bg-white",

  darkCard: "border border-slate-700 bg-slate-800/90",

  dashboardCard: "border border-slate-200 bg-white shadow-xl rounded-3xl",

  statCard: "border border-slate-100 bg-slate-50 rounded-2xl",

  badge:
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider",

  button:
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",

  sectionHeading: "mx-auto max-w-3xl text-center",

  sectionBody: "mx-auto mt-4 max-w-2xl",
};
