import { MessageCircle, Globe } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { AnalyticsMetrics } from "./types";

interface Props {
  metrics: AnalyticsMetrics;
}

export default function TopLinksCard({ metrics }: Props) {
  const total =
    metrics.socialClicks.whatsapp +
    metrics.socialClicks.instagram +
    metrics.socialClicks.facebook +
    metrics.socialClicks.tiktok +
    metrics.socialClicks.website;

  const links = [
    {
      name: "WhatsApp",
      value: metrics.socialClicks.whatsapp,
      icon: MessageCircle,
      color: "bg-green-500",
    },
    {
      name: "Instagram",
      value: metrics.socialClicks.instagram,
      icon: FaInstagram,
      color: "bg-pink-500",
    },
    {
      name: "Facebook",
      value: metrics.socialClicks.facebook,
      icon: FaFacebook,
      color: "bg-blue-500",
    },
    {
      name: "TikTok",
      value: metrics.socialClicks.tiktok,
      icon: Globe,
      color: "bg-black",
    },
    {
      name: "Website",
      value: metrics.socialClicks.website,
      icon: Globe,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-[#111827]">Top Performing Links</h3>

      <p className="text-sm text-gray-500 mt-1">
        See which links your visitors click the most.
      </p>

      <div className="space-y-5 mt-6">
        {links.map((link) => {
          const Icon = link.icon;

          const percentage =
            total === 0 ? 0 : Math.round((link.value / total) * 100);

          return (
            <div key={link.name}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#22C55E]" />

                  <span className="font-medium text-sm">{link.name}</span>
                </div>

                <span className="text-sm font-bold">{link.value}</span>
              </div>

              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`${link.color} h-full rounded-full transition-all`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
