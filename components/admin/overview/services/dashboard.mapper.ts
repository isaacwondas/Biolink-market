export function buildDashboardMetrics(data: {
  traffic: any[];
  products: any[];
  receipts: any[];
  orders: any[];
}) {
  const totalViews = data.traffic.filter(
    (t) => t.event_type === "store_view",
  ).length;

  const totalSocialClicks = data.traffic.filter(
    (t) => t.event_type === "social_click",
  ).length;

  const totalShares = data.traffic.filter(
    (t) => t.event_type === "profile_share",
  ).length;

  return {
    totalViews,

    totalProducts: data.products.length,

    totalSocialClicks,

    totalShares,

    receipts: data.receipts,

    orders: data.orders,

    traffic: data.traffic,
  };
}
