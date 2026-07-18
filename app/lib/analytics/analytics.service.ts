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

export async function getVisitorTrend(
  supabase: SupabaseClient,
  vendorId: number,
  days = 7,
) {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));

  const { data, error } = await supabase
    .from("traffic_logs")
    .select("viewed_at")
    .eq("vendor_id", vendorId)
    .eq("event_type", "store_view")
    .gte("viewed_at", start.toISOString());

  if (error) throw error;

  const grouped: Record<string, number> = {};

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    grouped[d.toISOString().split("T")[0]] = 0;
  }

  data?.forEach((row) => {
    if (!row.viewed_at) return;

    const key = row.viewed_at.split("T")[0];

    if (grouped[key] !== undefined) {
      grouped[key]++;
    }
  });

  return Object.entries(grouped).map(([date, visitors]) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    visitors,
  }));
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
