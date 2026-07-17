import { supabase } from "../supabase";

export async function getOverviewMetrics(vendorId: number) {
  const { data, error } = await supabase
    .from("traffic_logs")
    .select(
      `
      event_type,
      platform,
      is_unique,
      viewed_at,
      product_id
      `,
    )
    .eq("vendor_id", vendorId);

  if (error) throw error;

  const rows = data ?? [];

  return {
    totalViews: rows.filter((r) => r.event_type === "store_view").length,

    uniqueVisitors: rows.filter(
      (r) => r.event_type === "store_view" && r.is_unique,
    ).length,

    productViews: rows.filter((r) => r.event_type === "product_view").length,

    totalLinkClicks: rows.filter((r) => r.event_type === "social_click").length,

    bankCopies: rows.filter((r) => r.event_type === "bank_copy").length,

    qrScans: rows.filter((r) => r.event_type === "qr_scan").length,
  };
}
