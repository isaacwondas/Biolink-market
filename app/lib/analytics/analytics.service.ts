import type { SupabaseClient } from "@supabase/supabase-js";
import type { OverviewMetrics } from "./analytics.types";

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

  const socialClicks = {
    whatsapp: rows.filter(
      (r) => r.event_type === "social_click" && r.platform === "whatsapp",
    ).length,

    instagram: rows.filter(
      (r) => r.event_type === "social_click" && r.platform === "instagram",
    ).length,

    facebook: rows.filter(
      (r) => r.event_type === "social_click" && r.platform === "facebook",
    ).length,

    tiktok: rows.filter(
      (r) => r.event_type === "social_click" && r.platform === "tiktok",
    ).length,

    website: rows.filter(
      (r) => r.event_type === "social_click" && r.platform === "website",
    ).length,
  };

  return {
    totalViews: rows.filter((r) => r.event_type === "store_view").length,

    uniqueVisitors: rows.filter(
      (r) => r.event_type === "store_view" && r.is_unique,
    ).length,

    productViews: rows.filter((r) => r.event_type === "product_view").length,

    bankCopies: rows.filter((r) => r.event_type === "bank_copy").length,

    qrScans: rows.filter((r) => r.event_type === "qr_scan").length,

    socialClicks,

    // Placeholder for now. We'll replace this with real data later.
    topProducts: [],
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

export async function getRecentActivity(
  supabase: SupabaseClient,
  vendorId: number,
  limit = 20,
) {
  const { data, error } = await supabase
    .from("traffic_logs")
    .select(
      `
      id,
      event_type,
      platform,
      product_id,
      viewed_at
    `,
    )
    .eq("vendor_id", vendorId)
    .order("viewed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    event: row.event_type ?? "unknown",
    product: row.product_id ? `Product #${row.product_id}` : undefined,
    platform: row.platform ?? undefined,
    created_at: row.viewed_at,
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
