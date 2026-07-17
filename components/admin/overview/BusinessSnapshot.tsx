"use client";

import { Eye, Package, MousePointerClick, Share2 } from "lucide-react";

interface BusinessSnapshotProps {
  totalViews: number;
  totalProducts: number;
  totalClicks: number;
  totalShares: number;
}

export default function BusinessSnapshot({
  totalViews,
  totalProducts,
  totalClicks,
  totalShares,
}: BusinessSnapshotProps) {
  const cards = [
    {
      title: "Store Views",
      value: (totalViews ?? 0).toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Products",
      value: (totalProducts ?? 0).toString(),
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Social Clicks",
      value: (totalClicks ?? 0).toLocaleString(),
      icon: MousePointerClick,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Store Shares",
      value: (totalShares ?? 0).toLocaleString(),
      icon: Share2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#111827]">Business Snapshot</h2>

        <p className="mt-1 text-sm text-gray-500">
          A quick overview of your storefront performance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:shadow-md"
            >
              <div className={`inline-flex rounded-xl p-3 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>

              <p className="mt-4 text-3xl font-bold text-[#111827]">
                {card.value}
              </p>

              <p className="mt-1 text-sm text-gray-500">{card.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
