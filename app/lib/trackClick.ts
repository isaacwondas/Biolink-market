import { supabase } from "./supabase";

type SocialPlatform =
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "website"
  | "x"
  | "linkedin"
  | "youtube"
  | "telegram";

function getDeviceType() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    ? "mobile"
    : "desktop";
}

export async function trackSocialClick(
  vendorId: number,
  platform: SocialPlatform,
) {
  try {
    await supabase.from("traffic_logs").insert({
      vendor_id: vendorId,

      event_type: "social_click",

      platform,

      device_type: getDeviceType(),

      referrer: document.referrer || null,

      page: window.location.pathname,

      viewed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Social Click Tracking Error:", error);
  }
}

export async function trackProductView(vendorId: number, productId: number) {
  try {
    await supabase.from("traffic_logs").insert({
      vendor_id: vendorId,

      event_type: "product_view",

      product_id: productId,

      device_type: getDeviceType(),

      referrer: document.referrer || null,

      page: window.location.pathname,

      viewed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function trackProductClick(vendorId: number, productId: number) {
  try {
    await supabase.from("traffic_logs").insert({
      vendor_id: vendorId,

      event_type: "product_click",

      product_id: productId,

      device_type: getDeviceType(),

      referrer: document.referrer || null,

      page: window.location.pathname,

      viewed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function trackBankCopy(vendorId: number) {
  try {
    await supabase.from("traffic_logs").insert({
      vendor_id: vendorId,

      event_type: "bank_copy",

      device_type: getDeviceType(),

      referrer: document.referrer || null,

      page: window.location.pathname,

      viewed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function trackQRScan(vendorId: number) {
  try {
    await supabase.from("traffic_logs").insert({
      vendor_id: vendorId,

      event_type: "qr_scan",

      device_type: getDeviceType(),

      referrer: document.referrer || null,

      page: window.location.pathname,

      viewed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
  }
}
