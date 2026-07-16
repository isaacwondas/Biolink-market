import { Eye, Package, MousePointerClick, Share2 } from "lucide-react";

import { AnalyticsMetrics } from "./types";

interface Props {
  metrics: AnalyticsMetrics;
}

export default function SummaryCards({ metrics }: Props) {
  const cards = [
    {
      title: "Store Views",
      value: metrics.totalViews,
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Products",
      value: metrics.totalProducts,
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Social Clicks",
      value: metrics.totalSocialClicks,
      icon: MousePointerClick,
      color: "text-orange-600",
    },
    {
      title: "Profile Shares",
      value: metrics.totalShares,
      icon: Share2,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-gray-500">
                {card.title}
              </span>

              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>

            <p className="text-3xl font-black mt-5">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
