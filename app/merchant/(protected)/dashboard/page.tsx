import React from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DashboardShell from "@/components/admin/DashboardShell";
import { getOverviewMetrics } from "@/app/lib/analytics/analytics.service";
import { getVisitorTrend } from "@/app/lib/analytics/analytics.service";
import { getRecentActivity } from "@/app/lib/analytics/analytics.service";

// =========================================================
// HELPER FUNCTIONS
// =========================================================

async function getDashboardTelemetry(
  supabaseClient: any,
  vendorId: string | number,
) {
  const { data, error } = await supabaseClient.rpc(
    "get_vendor_click_analytics",
    { target_vendor_id: vendorId, grouping_interval: "day", limit_count: 7 },
  );
  if (error) {
    console.error("Analytics fetch error:", error);
    return [];
  }
  return data ? [...data].reverse() : [];
}

async function getVendorTransactions(supabaseClient: any, vendorEmail: string) {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .eq("vendor_email", vendorEmail.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Transaction fetch error:", error);
    return [];
  }

  return data || [];
}

// =========================================================
// MAIN SERVER COMPONENT
// =========================================================

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();

  // Create secure client with updated @supabase/ssr standards
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Safe to ignore on server-side renders if handled by middleware
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch full vendor data including banks and products
  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select(`*, vendor_banks(*), vendor_products(*)`)
    .eq("email", user.email)
    .single();

  if (vendorError || !vendor) redirect("/onboard");

  const [
    timelineData,
    transactionsQueue,
    overviewMetrics,
    visitorTrend,
    recentActivity,
  ] = await Promise.all([
    getDashboardTelemetry(supabase, vendor.id),
    getVendorTransactions(supabase, vendor.email),
    getOverviewMetrics(supabase, vendor.id),
    getVisitorTrend(supabase, vendor.id),
    getRecentActivity(supabase, vendor.id),
  ]);
  const totalClicks = timelineData.reduce(
    (acc: number, d: any) => acc + Number(d.total_clicks || 0),
    0,
  );

  const structuralMetrics = {
    totalViews: overviewMetrics.totalViews,

    uniqueVisitors: overviewMetrics.uniqueVisitors,

    totalProducts: vendor.vendor_products?.length || 0,

    productViews: overviewMetrics.productViews,

    bankCopies: overviewMetrics.bankCopies,

    qrScans: overviewMetrics.qrScans,

    topProducts: overviewMetrics.topProducts ?? [],

    totalSocialClicks: totalClicks,

    totalShares: 0,

    socialClicks: {
      instagram: timelineData.reduce(
        (a: number, d: any) => a + Number(d.instagram_count || 0),
        0,
      ),

      facebook: timelineData.reduce(
        (a: number, d: any) => a + Number(d.facebook_count || 0),
        0,
      ),

      tiktok: timelineData.reduce(
        (a: number, d: any) => a + Number(d.tiktok_count || 0),
        0,
      ),

      whatsapp: timelineData.reduce(
        (a: number, d: any) => a + Number(d.whatsapp_count || 0),
        0,
      ),

      website: overviewMetrics.socialClicks?.website ?? 0,
    },

    deviceBreakdown: {
      mobile: Math.ceil(totalClicks * 0.85),
      desktop: Math.ceil(totalClicks * 0.12),
      tablet: Math.ceil(totalClicks * 0.03),
    },
  };

  // =========================================================
  // SERVER ACTION (DECOUPLED & CORRECTED PATHS)
  // =========================================================

  async function handleTransactionUpdate(
    id: string,
    updates: { amount_paid: number; payment_status: string },
  ) {
    "use server";
    const serverCookies = await cookies();
    const serverSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return serverCookies.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                serverCookies.set(name, value, options),
              );
            } catch {
              // Safe to ignore in Server Actions
            }
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

    // FIXED: Revalidate the actual merchant dashboard path
    revalidatePath("/merchant/dashboard");
  }

  return (
    <DashboardShell
      vendor={vendor}
      timelineData={timelineData}
      initialTransactions={transactionsQueue}
      structuralMetrics={structuralMetrics}
      visitorTrend={visitorTrend}
      recentActivity={recentActivity}
      onTransactionUpdate={handleTransactionUpdate}
    />
  );
}
