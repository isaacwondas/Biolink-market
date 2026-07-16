"use client";

import { CheckCircle2, Circle, Sparkles } from "lucide-react";

interface WelcomeCardProps {
  vendor: any;
  completionPercentage?: number;
}

export default function WelcomeCard({
  vendor,
  completionPercentage,
}: WelcomeCardProps) {
  const setupTasks = [
    {
      label: "Business Name",
      completed: !!vendor.business_name,
    },
    {
      label: "Profile Photo",
      completed: !!vendor.avatar_image,
    },
    {
      label: "Bank Account",
      completed: vendor.vendor_banks && vendor.vendor_banks.length > 0,
    },
    {
      label: "Social Links",
      completed:
        !!vendor.whatsapp ||
        !!vendor.instagram_handle ||
        !!vendor.tiktok_handle,
    },
    {
      label: "First Product",
      completed: vendor.products && vendor.products.length > 0,
    },
  ];

  const completedTasks = setupTasks.filter((t) => t.completed).length;

  const percentage =
    completionPercentage ??
    Math.round((completedTasks / setupTasks.length) * 100);

  if (percentage >= 100) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-10 w-10 text-green-600" />

          <div>
            <h2 className="text-xl font-bold text-green-700">
              Your store is ready 🎉
            </h2>

            <p className="mt-1 text-sm text-green-600">
              Everything is set up. Start sharing your store link and receiving
              customers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#22C55E]" />

            <p className="text-sm text-gray-500">Welcome back</p>
          </div>

          <h2 className="mt-2 text-2xl font-bold text-[#111827]">
            {vendor.business_name || vendor.name}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Complete your store setup to increase customer trust.
          </p>
        </div>

        <div className="rounded-full bg-[#22C55E]/10 px-4 py-2">
          <span className="text-sm font-bold text-[#15803D]">
            {completionPercentage}%
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#22C55E] transition-all duration-500"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          {completedTasks} of {setupTasks.length} tasks completed
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {setupTasks.map((task) => (
          <div
            key={task.label}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}

            <span
              className={`text-sm ${
                task.completed
                  ? "line-through text-gray-400"
                  : "font-medium text-gray-700"
              }`}
            >
              {task.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
