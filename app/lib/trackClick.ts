import { supabase } from "./supabase";

export async function trackSocialClick(
  vendorId: string,
  platform: "Instagram" | "Facebook" | "TikTok",
) {
  try {
    await supabase.from("traffic_logs").insert({
      vendor_id: vendorId,
      referrer: platform,
      device_type: /Mobi|Android/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop",
      is_unique: false, // Event-driven action click, not a new page visit
    });
  } catch (error) {
    console.error("Failed to log social click telemetry:", error);
  }
}
