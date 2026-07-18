export interface OverviewMetrics {
  totalViews: number;
  uniqueVisitors: number;
  productViews: number;
  bankCopies: number;
  qrScans: number;
  topProducts: {
    id: number;
    name: string;
    views: number;
  }[];

  socialClicks: {
    whatsapp: number;
    instagram: number;
    facebook: number;
    tiktok: number;
    website: number;
  };
}

export interface ProductAnalytics {
  productId: number;
  productName: string;
  views: number;
  clicks: number;
}

export interface LinkAnalytics {
  platform: string;
  clicks: number;
}

export interface BankAnalytics {
  bankName: string;
  copies: number;
}

export interface VisitorChartPoint {
  label: string;
  views: number;
}
