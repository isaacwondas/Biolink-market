"use client";

import SummaryCards from "./SummaryCards";
import VisitorChart from "./VisitorChart";
import TopLinksCard from "./TopLinksCard";
import TopProductsCard from "./TopProductsCard";
import RecentActivityCard from "./RecentActivityCard";

import type { AnalyticsMetrics } from "./types";

interface Props {
  vendor: any;
  structuralMetrics: any;
}

export default function AnalyticsTab({ vendor, structuralMetrics }: Props) {
  const metrics: AnalyticsMetrics = {
    totalViews: structuralMetrics.totalViews ?? 0,

    uniqueVisitors: structuralMetrics.uniqueVisitors ?? 0,

    totalProducts: structuralMetrics.totalProducts ?? 0,

    productViews: structuralMetrics.productViews ?? 0,

    totalSocialClicks: structuralMetrics.totalSocialClicks ?? 0,

    totalShares: structuralMetrics.totalShares ?? 0,

    bankCopies: structuralMetrics.bankCopies ?? 0,

    qrScans: structuralMetrics.qrScans ?? 0,

    socialClicks: structuralMetrics.socialClicks ?? {
      whatsapp: 0,
      instagram: 0,
      facebook: 0,
      tiktok: 0,
      website: 0,
    },

    topProducts: structuralMetrics.topProducts ?? [],

    funnel: {
      storeViews: structuralMetrics.totalViews ?? 0,
      productViews: structuralMetrics.productViews ?? 0,
      cartAdds: 0,
      checkoutStarts: 0,
      receiptUploads: 0,
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

          <p className="mt-2 text-gray-500">
            Monitor your storefront performance in real time.
          </p>
        </div>

        <button className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50">
          Last 30 Days
        </button>
      </div>
      {/* KPI Cards */}
      <SummaryCards metrics={metrics} />
      {/* Charts */}
      /*
      <VisitorChart />
      */
      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopLinksCard metrics={metrics} />

        <TopProductsCard
          metrics={metrics}
          businessName={vendor.business_name || vendor.name}
        />
      </div>
      {/* Activity */}
      <RecentActivityCard activities={[]} />
    </div>
  );
}
