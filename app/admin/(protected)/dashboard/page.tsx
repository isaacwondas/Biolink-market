import React from "react";
import Image from "next/image";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AnalyticsGrid from "@/components/admin/AnalyticsGrid";
import { TransactionApprovalCard } from "@/components/admin/TransactionApprovalCard";

interface DatabaseTimelineRow {
  period_start: string;
  total_clicks: number;
  whatsapp_count: number;
  instagram_count: number;
  facebook_count: number;
  tiktok_count: number;
}

interface ReceiptRow {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  order_reference: string;
  amount_paid: number;
  total_order_amount?: number; // Added for tracking full order value
  balance_due?: number; // Added for tracking remaining debt
  payment_status?: string; // Added for state management
  status: "pending" | "approved" | "declined";
}

async function getDashboardTelemetry(supabaseClient: any, vendorId: number) {
  const { data, error } = await supabaseClient.rpc(
    "get_vendor_click_analytics",
    {
      target_vendor_id: vendorId,
      grouping_interval: "day",
      limit_count: 7,
    },
  );
  if (error) return [];
  return (data as DatabaseTimelineRow[]).reverse();
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
  return data as ReceiptRow[];
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
        set(name, value, options) {},
        remove(name, options) {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select("id, business_name, name, views, email")
    .eq("email", user.email)
    .single();

  if (vendorError || !vendor) {
    redirect("/admin/onboard");
  }

  const currentVendorId = vendor.id;
  const vendorEmail = vendor.email || "";
  const merchantDisplayName =
    vendor.business_name || vendor.name || "Merchant Store";

  const [timelineData, receiptsQueue] = await Promise.all([
    getDashboardTelemetry(supabase, currentVendorId),
    getVendorReceipts(supabase, vendorEmail),
  ]);

  const totalClicksCalculated = timelineData.reduce(
    (acc, current) => acc + Number(current.total_clicks),
    0,
  );
  const maxClickDayValue =
    timelineData.length > 0
      ? Math.max(...timelineData.map((d) => Number(d.total_clicks)))
      : 10;

  const structuralMetrics = {
    totalViews: vendor.views || 0,
    uniqueVisitors: Math.ceil((vendor.views || 0) * 0.72),
    socialClicks: {
      instagram: timelineData.reduce(
        (acc, current) => acc + Number(current.instagram_count),
        0,
      ),
      facebook: timelineData.reduce(
        (acc, current) => acc + Number(current.facebook_count),
        0,
      ),
      tiktok: timelineData.reduce(
        (acc, current) => acc + Number(current.tiktok_count),
        0,
      ),
      whatsapp: timelineData.reduce(
        (acc, current) => acc + Number(current.whatsapp_count),
        0,
      ),
    },
    deviceBreakdown: {
      mobile: Math.ceil(totalClicksCalculated * 0.85),
      desktop: Math.ceil(totalClicksCalculated * 0.12),
      tablet: Math.ceil(totalClicksCalculated * 0.03),
    },
  };

  // Server Action inline to clear database metrics inside the server runtime environment
  // Server Action inline inside AdminDashboardPage
  async function handleTransactionUpdate(
    id: string,
    updates: { amount_paid: number; payment_status: string },
  ) {
    "use server";

    // This helper tells Next.js to instantly reload server data on the page
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

    // Update your transaction record row
    await serverSupabase
      .from("transactions")
      .update({
        amount_paid: updates.amount_paid,
        payment_status: updates.payment_status,
        status:
          updates.payment_status === "fully_paid" ? "approved" : "pending",
      })
      .eq("id", id);

    // Trigger immediate UI update for the vendor
    revalidatePath("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8 antialiased selection:bg-[#044766]">
      <div className="max-w-5xl mx-auto space-y-6">
        <AnalyticsGrid
          metrics={structuralMetrics}
          businessName={merchantDisplayName}
        />

        {/* PROMINENT ROW 1: RECEIPT AUDIT LEDGER */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-800/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200">
                  Receipt Verification Engine
                </h3>
                <span className="text-[10px] bg-[#044766]/20 text-sky-400 font-bold px-2 py-0.5 rounded border border-[#044766]/30 uppercase tracking-wide">
                  Core Operations
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Audit incoming customer transfers to instantly authorize order
                processing.
              </p>
            </div>

            <div className="flex gap-2 text-[11px] font-mono">
              <span className="text-amber-400 bg-amber-500/5 px-2 py-1 rounded-md border border-amber-500/10">
                Awaiting{" "}
                {
                  receiptsQueue.filter(
                    (r) =>
                      r.status === "pending" &&
                      r.payment_status !== "fully_paid",
                  ).length
                }{" "}
                Receipts
              </span>
              <span className="text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                ✓{" "}
                {
                  receiptsQueue.filter(
                    (r) =>
                      r.status === "approved" ||
                      r.payment_status === "fully_paid",
                  ).length
                }{" "}
                Cleared
              </span>
            </div>
          </div>

          {/* HIGH CAPACITY CONTAINER WITH ISOLATED INTERNAL SCROLL */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-800">
            {receiptsQueue.map((receipt) => (
              <div
                key={receipt.id}
                className={`bg-neutral-950 border p-4 rounded-xl flex flex-col gap-4 transition-all duration-200 hover:border-neutral-700 ${
                  receipt.status === "pending"
                    ? "border-amber-500/20 bg-amber-500/[0.01]"
                    : "border-neutral-800/70"
                }`}
              >
                {/* TOP LAYER: Meta information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 shadow-inner">
                      <Image
                        src={receipt.receipt_image_url}
                        alt="Customer proof of payment upload"
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-neutral-200 truncate">
                          {receipt.customer_name || "Unknown Customer"}
                        </p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
                          #{receipt.order_reference || "NO-REF"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate font-mono">
                        {receipt.customer_email || "no-email@provided.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between sm:items-end items-center shrink-0 border-t sm:border-t-0 border-neutral-800/40 pt-2 sm:pt-0">
                    <p className="text-sm font-black text-emerald-400 tracking-wide">
                      ₦{Number(receipt.amount_paid).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono text-neutral-500">
                        {new Date(receipt.created_at).toLocaleDateString(
                          "en-NG",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          receipt.payment_status === "fully_paid" ||
                          receipt.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : receipt.payment_status === "partially_paid"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-neutral-500/10 text-neutral-400 border border-neutral-800"
                        }`}
                      >
                        {receipt.payment_status === "fully_paid"
                          ? "Fully Paid"
                          : receipt.payment_status === "partially_paid"
                            ? "Partial"
                            : receipt.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM LAYER: Dynamic Verification Form System Embedded Per Row */}
                {receipt.payment_status !== "fully_paid" &&
                  receipt.status !== "approved" && (
                    <div className="border-t border-neutral-800/60 pt-3 mt-1 text-neutral-900">
                      <TransactionApprovalCard
                        transaction={{
                          id: receipt.id,
                          total_order_amount:
                            receipt.total_order_amount ||
                            receipt.amount_paid ||
                            0,
                          amount_paid: receipt.amount_paid || 0,
                          balance_due: receipt.balance_due || 0,
                          payment_status: receipt.payment_status || "unpaid",
                        }}
                        onConfirm={handleTransactionUpdate}
                      />
                    </div>
                  )}
              </div>
            ))}

            {receiptsQueue.length === 0 && (
              <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
                <span className="text-2xl block mb-2">🧾</span>
                <p className="text-xs text-neutral-500">
                  No payment receipts uploaded to this account yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECONDARY ROW 2: VISUAL TRAFFIC HISTOGRAM */}
        <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 shadow-xl">
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Secondary Metric: Outbound Traffic Trend
            </h3>
          </div>
          <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2 border-b border-neutral-800/60 px-2">
            {timelineData.map((day) => {
              const totalClicks = Number(day.total_clicks);
              const percentageHeight =
                maxClickDayValue > 0
                  ? (totalClicks / maxClickDayValue) * 100
                  : 0;
              return (
                <div
                  key={day.period_start}
                  className="flex flex-col items-center h-full justify-end group space-y-1"
                >
                  <div
                    className="w-full bg-neutral-800/40 rounded-t relative h-full"
                    style={{ maxHeight: `${Math.max(percentageHeight, 4)}%` }}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 bg-[#044766]/60 rounded-t-sm"
                      style={{ height: "100%" }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-neutral-600 block truncate">
                    {new Date(day.period_start).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
