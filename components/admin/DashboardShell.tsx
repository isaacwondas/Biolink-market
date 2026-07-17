"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import OverviewTab from "@/components/admin/overview/OverviewTab";
import ProfileTab from "@/components/admin/profile/ProfileTab";
import BanksTab from "@/components/admin/banks/BanksTab";
import ProductsTab from "./products/ProductsTab";
import SocialTab from "@/components/admin/social/SocialTab";
import AnalyticsTab from "@/components/admin/analytics/AnalyticsTab";

import { LogOut, ExternalLink, Menu, Icon } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

import { NAV, type DashboardTab } from "@/components/admin/navigation";

export default function DashboardShell({
  vendor,
  timelineData,
  initialTransactions,
  structuralMetrics,
  onTransactionUpdate,
}: {
  vendor: any;
  timelineData: any[];
  initialTransactions: any[];
  structuralMetrics: any;
  onTransactionUpdate: any;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const merchantName = vendor.business_name || vendor.name || "Merchant";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/merchant/login");
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex antialiased">
      {/* ── Sidebar ── */}
      <aside
        className={`
    fixed left-0 top-0 z-50
    h-screen
    w-64
    bg-white
    border-r border-gray-200
    flex flex-col
    transform transition-transform duration-200
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:sticky
    lg:top-0
    lg:translate-x-0
    lg:h-screen
    lg:flex
  `}
      >
        {/* Logo / store identity */}
        <div className="p-5 border-b border-gray-200 space-y-1">
          <div className="flex items-center gap-2">
            {vendor.avatar_image && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 shrink-0">
                <Image
                  src={vendor.avatar_image}
                  alt="avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#111827] truncate">
                {merchantName}
              </p>
              <p className="text-[10px] text-[#22C55E] font-mono truncate">
                /{vendor.username}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/20"
                    : "text-[#4B5563] hover:text-[#111827] hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-gray-200 space-y-2">
          <a
            href={`/${vendor.username}`}
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 transition-all"
          >
            <ExternalLink className="w-4 h-4 ml-2 stroke-[2.25]" />
            <span>View Storefront</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 text-red-500/80 group-hover:text-red-600 transition-colors stroke-[2.25]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#4B5563] hover:text-[#111827]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-[#374151]">
            {NAV.find((n) => n.id === activeTab)?.label}
          </span>
          <span className="text-[10px] text-[#22C55E] font-mono">
            /{vendor.username}
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === "overview" && (
              <OverviewTab
                vendor={vendor}
                structuralMetrics={structuralMetrics}
                timelineData={timelineData}
                initialTransactions={initialTransactions ?? []}
                onTransactionUpdate={onTransactionUpdate}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab
                vendor={vendor}
                structuralMetrics={structuralMetrics}
              />
            )}

            {activeTab === "profile" && <ProfileTab vendor={vendor} />}

            {activeTab === "banks" && <BanksTab vendor={vendor} />}

            {activeTab === "products" && <ProductsTab vendor={vendor} />}

            {activeTab === "social" && <SocialTab vendor={vendor} />}
          </div>
        </main>
      </div>
    </div>
  );
}
