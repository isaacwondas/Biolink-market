"use client";

import {
  Clock3,
  Package,
  MousePointerClick,
  CreditCard,
  Eye,
} from "lucide-react";

interface RecentActivityCardProps {
  vendor: any;
  transactions: any[];
}

export default function RecentActivityCard({
  vendor,
  transactions,
}: RecentActivityCardProps) {
  const activities = [
    ...(transactions ?? []).slice(0, 3).map((receipt) => ({
      id: receipt.id,
      icon: CreditCard,
      title: "Payment received",
      description: `${receipt.customer_name || "Customer"} uploaded a payment receipt.`,
      time: new Date(receipt.created_at).toLocaleDateString(),
      color: "bg-green-100 text-green-700",
    })),

    ...(vendor.vendor_products ?? []).slice(0, 2).map((product: any) => ({
      id: product.id,
      icon: Package,
      title: "Product published",
      description: `${product.name} is now live on your storefront.`,
      time: "Recently",
      color: "bg-orange-100 text-orange-700",
    })),

    ...(vendor.total_social_clicks
      ? [
          {
            id: "clicks",
            icon: MousePointerClick,
            title: "Social links clicked",
            description: `${vendor.total_social_clicks.toLocaleString()} total social link clicks.`,
            time: "Today",
            color: "bg-blue-100 text-blue-700",
          },
        ]
      : []),

    ...(vendor.views
      ? [
          {
            id: "views",
            icon: Eye,
            title: "Store viewed",
            description: `${vendor.views.toLocaleString()} people have viewed your storefront.`,
            time: "Today",
            color: "bg-purple-100 text-purple-700",
          },
        ]
      : []),
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">Recent Activity</h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest events happening in your business.
          </p>
        </div>

        <Clock3 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="mt-6 space-y-4">
        {activities.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
            <Clock3 className="mx-auto h-8 w-8 text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">
              No recent activity yet.
            </p>
          </div>
        )}

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className={`rounded-xl p-3 ${activity.color}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-[#111827]">
                  {activity.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {activity.description}
                </p>
              </div>

              <span className="text-xs text-gray-400 whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
