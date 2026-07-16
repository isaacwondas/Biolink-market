"use client";

import { Copy, ExternalLink, MessageCircle, QrCode } from "lucide-react";

interface QuickActionsProps {
  storefrontUrl: string;
  vendor: any;
}

export default function QuickActions({
  storefrontUrl,
  vendor,
}: QuickActionsProps) {
  const copyLink = async () => {
    await navigator.clipboard.writeText(storefrontUrl);
    alert("Store link copied.");
  };

  const shareWhatsapp = () => {
    const message = `Check out my online store:\n${storefrontUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const openStore = () => {
    window.open(storefrontUrl, "_blank");
  };

  const downloadQR = () => {
    alert("QR Download coming soon.");
  };

  const actions = [
    {
      title: "View Store",
      description: "Open your public storefront",
      icon: ExternalLink,
      color: "bg-blue-50 text-blue-600",
      onClick: openStore,
    },
    {
      title: "Copy Store Link",
      description: "Copy link to clipboard",
      icon: Copy,
      color: "bg-green-50 text-green-600",
      onClick: copyLink,
    },
    {
      title: "Share WhatsApp",
      description: "Share with customers",
      icon: MessageCircle,
      color: "bg-[#DCFCE7] text-[#16A34A]",
      onClick: shareWhatsapp,
    },
    {
      title: "Download QR",
      description: "Print for your shop",
      icon: QrCode,
      color: "bg-purple-50 text-purple-600",
      onClick: downloadQR,
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#111827]">Quick Actions</h2>

        <p className="mt-1 text-sm text-gray-500">
          Frequently used tools for managing and sharing your store.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={action.onClick}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left transition-all hover:border-[#22C55E] hover:shadow-md"
            >
              <div className={`inline-flex rounded-xl p-3 ${action.color}`}>
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-semibold text-[#111827]">
                {action.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500">{action.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
