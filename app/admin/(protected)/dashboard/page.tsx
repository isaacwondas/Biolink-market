import React from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/admin/DashboardShell";

async function getDashboardTelemetry(supabaseClient: any, vendorId: number) {
  const { data, error } = await supabaseClient.rpc(
    "get_vendor_click_analytics",
    { target_vendor_id: vendorId, grouping_interval: "day", limit_count: 7 },
  );
  if (error) return [];
  return data.reverse();
}

async function getVendorReceipts(supabaseClient: any, vendorEmail: string) {
  const { data, error } = await supabaseClient
    .from("receipt_submissions")
    .select("*")
    .eq("vendor_email", vendorEmail)
    .order("status", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return data;
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Fetch full vendor data including banks and products
  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select(`*, vendor_banks(*), vendor_products(*)`)
    .eq("email", user.email)
    .single();

  if (vendorError || !vendor) redirect("/admin/onboard");

  const [timelineData, receiptsQueue] = await Promise.all([
    getDashboardTelemetry(supabase, vendor.id),
    getVendorReceipts(supabase, vendor.email || ""),
  ]);

  const totalClicks = timelineData.reduce(
    (acc: number, d: any) => acc + Number(d.total_clicks),
    0,
  );

  const structuralMetrics = {
    totalViews: vendor.views || 0,
    uniqueVisitors: Math.ceil((vendor.views || 0) * 0.72),
    socialClicks: {
      instagram: timelineData.reduce(
        (a: number, d: any) => a + Number(d.instagram_count),
        0,
      ),
      facebook: timelineData.reduce(
        (a: number, d: any) => a + Number(d.facebook_count),
        0,
      ),
      tiktok: timelineData.reduce(
        (a: number, d: any) => a + Number(d.tiktok_count),
        0,
      ),
      whatsapp: timelineData.reduce(
        (a: number, d: any) => a + Number(d.whatsapp_count),
        0,
      ),
    },
    deviceBreakdown: {
      mobile: Math.ceil(totalClicks * 0.85),
      desktop: Math.ceil(totalClicks * 0.12),
      tablet: Math.ceil(totalClicks * 0.03),
    },
  };

  async function handleTransactionUpdate(
    id: string,
    updates: { amount_paid: number; payment_status: string },
  ) {
    "use server";
    const { revalidatePath } = await import("next/cache");
    const cookieStore = await cookies();
    const serverSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );
    await serverSupabase
      .from("transactions")
      .update({
        amount_paid: updates.amount_paid,
        payment_status: updates.payment_status,
        status:
          updates.payment_status === "fully_paid" ? "approved" : "pending",
      })
      .eq("id", id);
    revalidatePath("/admin/dashboard");
  }

  return (
    <DashboardShell
      vendor={vendor}
      timelineData={timelineData}
      receiptsQueue={receiptsQueue}
      structuralMetrics={structuralMetrics}
      onTransactionUpdate={handleTransactionUpdate}
    />
  );
}
