import type { SupabaseClient } from "@supabase/supabase-js";

export interface OverviewMetrics {
  totalViews: number;
  uniqueVisitors: number;
  productViews: number;
  totalLinkClicks: number;
  bankCopies: number;
  qrScans: number;
}

export async function getOverviewMetrics(
  supabase: SupabaseClient,
  vendorId: number,
): Promise<OverviewMetrics> {
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

  if (error) {
    console.error(error);
    throw error;
  }

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

export async function getLinkAnalytics(
  supabase: SupabaseClient,
  vendorId: number,
) {
  const { data, error } = await supabase
    .from("traffic_logs")
    .select("platform")
    .eq("vendor_id", vendorId)
    .eq("event_type", "social_click");

  if (error) throw error;

  const rows = data ?? [];

  return {
    whatsapp: rows.filter((r) => r.platform === "whatsapp").length,
    instagram: rows.filter((r) => r.platform === "instagram").length,
    facebook: rows.filter((r) => r.platform === "facebook").length,
    tiktok: rows.filter((r) => r.platform === "tiktok").length,
    website: rows.filter((r) => r.platform === "website").length,
  };
}
