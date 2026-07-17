"use client";

import AnalyticsGrid from "./AnalyticsGrid";
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

    topProducts: [],

    funnel: {
      storeViews: structuralMetrics.totalViews ?? 0,
      productViews: structuralMetrics.productViews ?? 0,
      cartAdds: 0,
      checkoutStarts: 0,
      receiptUploads: 0,
    },
  };

  return (
    <AnalyticsGrid
      metrics={metrics}
      businessName={vendor.business_name || vendor.name}
      recentActivity={[]}
    />
  );
}
