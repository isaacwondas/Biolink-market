import {
  Eye,
  Users,
  MousePointerClick,
  Package,
  Landmark,
  ScanLine,
  Share2,
} from "lucide-react";

import { AnalyticsMetrics } from "./types";

interface Props {
  metrics: AnalyticsMetrics;
}

export default function SummaryCards({ metrics }: Props) {
  const cards = [
    {
      title: "Store Views",
      subtitle: "Total visits",
      value: metrics.totalViews,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Visitors",
      subtitle: "Unique visitors",
      value: metrics.uniqueVisitors,
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Link Clicks",
      subtitle: "WhatsApp & socials",
      value: metrics.totalSocialClicks,
      icon: MousePointerClick,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Product Views",
      subtitle: "Viewed products",
      value: metrics.productViews,
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Bank Copies",
      subtitle: "Account copied",
      value: metrics.bankCopies,
      icon: Landmark,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "QR Scans",
      subtitle: "QR visits",
      value: metrics.qrScans,
      icon: ScanLine,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>

            <h3 className="mt-5 text-3xl font-bold text-gray-900">
              {card.value.toLocaleString()}
            </h3>

            <p className="mt-2 text-sm font-semibold text-gray-800">
              {card.title}
            </p>

            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </div>
        );
      })}
    </section>
  );
}
