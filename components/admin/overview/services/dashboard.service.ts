import { supabase } from "@/app/lib/supabase";
export async function getDashboardData(vendorId: number) {
  const [traffic, products, receipts, orders] = await Promise.all([
    supabase.from("traffic_logs").select("*").eq("vendor_id", vendorId),

    supabase.from("vendor_products").select("*").eq("vendor_id", vendorId),

    supabase.from("receipt_submissions").select("*").eq("vendor_id", vendorId),

    supabase.from("orders").select("*").eq("vendor_id", vendorId),
  ]);

  return {
    traffic: traffic.data ?? [],

    products: products.data ?? [],

    receipts: receipts.data ?? [],

    orders: orders.data ?? [],
  };
}
