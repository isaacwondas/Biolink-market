export interface AnalyticsOverview {
  totalViews: number;
  uniqueVisitors: number;
  productViews: number;
  totalLinkClicks: number;
  bankCopies: number;
  qrScans: number;
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
