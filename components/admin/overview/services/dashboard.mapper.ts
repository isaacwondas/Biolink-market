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

  const receipts = data.receipts.map((receipt) => ({
    ...receipt,

    customer_name:
      receipt.buyer_name ?? receipt.customer_name ?? "Unknown Customer",

    customer_email: receipt.buyer_email ?? receipt.vendor_email ?? "",

    receipt_image_url: receipt.receipt_url ?? receipt.receipt_image_url ?? "",

    order_reference: receipt.reference_code ?? receipt.order_reference ?? "",

    amount: receipt.total_order_amount ?? receipt.amount ?? 0,

    paid: receipt.amount_paid ?? receipt.paid ?? 0,

    balance: receipt.balance_due ?? receipt.balance ?? 0,
  }));

  return {
    totalViews,

    totalProducts: data.products.length,

    totalSocialClicks,

    totalShares,

    receipts,

    orders: data.orders,

    traffic: data.traffic,
  };
}
