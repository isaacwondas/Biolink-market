export interface AnalyticsMetrics {
  totalViews: number;
  uniqueVisitors: number;

  totalProducts: number;

  totalSocialClicks: number;

  totalShares: number;

  socialClicks: {
    whatsapp: number;
    instagram: number;
    facebook: number;
    tiktok: number;
    website: number;
  };

  topProducts: {
    id: number;
    name: string;
    views: number;
  }[];

  funnel: {
    storeViews: number;
    productViews: number;
    cartAdds: number;
    checkoutStarts: number;
    receiptUploads: number;
  };
}
