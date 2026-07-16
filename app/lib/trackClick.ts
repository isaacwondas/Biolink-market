import { supabase } from "./supabase";

export async function trackSocialClick(
  vendorId: string,
  platform: "whatsapp" | "instagram" | "facebook" | "tiktok" | "website",
) {
  try {
    await supabase.from("traffic_logs").insert({
      vendor_id: vendorId,

      event_type: "social_click",

      platform,

      device_type: /Mobi|Android/i.test(navigator.userAgent)
        ? "mobile"
        : "desktop",

      referrer: document.referrer || null,

      page: window.location.pathname,

      clicked_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
  }
}
