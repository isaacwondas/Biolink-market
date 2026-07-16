"use client";
import Toast from "@/components/admin/ui/Toast";
import Field from "@/components/admin/ui/Field";

import { supabase } from "@/app/lib/supabase";
import { useState, type ChangeEvent } from "react";

function SocialTab({ vendor }: { vendor: any }) {
  const [form, setForm] = useState({
    whatsapp: vendor.whatsapp || "",
    instagram_handle: vendor.instagram_handle || "",
    tiktok_handle: vendor.tiktok_handle || "",
    facebook_handle: vendor.facebook_handle || "",
    website: vendor.website || "",
  });

  // Extra custom links — loaded from jsonb column
  const [extraLinks, setExtraLinks] = useState<
    { platform: string; url: string }[]
  >(vendor.social_links || []);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleExtraChange = (
    idx: number,
    field: "platform" | "url",
    value: string,
  ) => {
    const updated = [...extraLinks];
    updated[idx] = { ...updated[idx], [field]: value };
    setExtraLinks(updated);
  };

  const addExtraLink = () =>
    setExtraLinks((prev) => [...prev, { platform: "", url: "" }]);

  const removeExtraLink = (idx: number) =>
    setExtraLinks((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({
          ...form,
          social_links: extraLinks.filter((l) => l.url.trim() !== ""),
        })
        .eq("id", vendor.id);
      if (error) throw error;
      setMsg({ type: "success", text: "Social links updated!" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const PLATFORM_SUGGESTIONS = [
    "YouTube",
    "Twitter / X",
    "LinkedIn",
    "Snapchat",
    "Telegram",
    "Pinterest",
    "Threads",
    "Website",
    "Other",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-[#111827]">Social & Contact</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          All links appear as buttons on your public storefront.
        </p>
      </div>

      <Toast msg={msg} />

      {/* Core platforms */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
        <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
          Core Platforms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="WhatsApp Number"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="2348030000000"
          />
          <Field
            label="Website URL"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://mystore.com"
            type="url"
          />
          <Field
            label="Instagram URL"
            name="instagram_handle"
            value={form.instagram_handle}
            onChange={handleChange}
            placeholder="https://instagram.com/ada_hub"
            type="url"
          />
          <Field
            label="TikTok URL"
            name="tiktok_handle"
            value={form.tiktok_handle}
            onChange={handleChange}
            placeholder="https://tiktok.com/@ada_hub"
            type="url"
          />
          <Field
            label="Facebook URL"
            name="facebook_handle"
            value={form.facebook_handle}
            onChange={handleChange}
            placeholder="https://facebook.com/adahub"
            type="url"
          />
        </div>
      </div>

      {/* Extra / custom links */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
              Additional Links
            </h3>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">
              YouTube, LinkedIn, Telegram, custom URLs — unlimited.
            </p>
          </div>
          <button
            onClick={addExtraLink}
            className="text-xs text-[#15803D] border border-[#22C55E]/50 px-3 py-1.5 rounded-lg hover:bg-[#22C55E]/30 transition-colors"
          >
            + Add Link
          </button>
        </div>

        {extraLinks.length === 0 && (
          <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center">
            <p className="text-[11px] text-[#9CA3AF]">
              No extra links yet. Click "+ Add Link" to add YouTube, LinkedIn,
              Telegram, etc.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {extraLinks.map((link, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end"
            >
              {/* Platform label — datalist gives suggestions but allows freeform */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] font-medium uppercase">
                  Platform
                </label>
                <input
                  type="text"
                  list="platform-suggestions"
                  value={link.platform}
                  onChange={(e) =>
                    handleExtraChange(idx, "platform", e.target.value)
                  }
                  placeholder="YouTube"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                />
                <datalist id="platform-suggestions">
                  {PLATFORM_SUGGESTIONS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] font-medium uppercase">
                  URL
                </label>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) =>
                    handleExtraChange(idx, "url", e.target.value)
                  }
                  placeholder="https://youtube.com/@ada_hub"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              {/* Remove */}
              <button
                onClick={() => removeExtraLink(idx)}
                className="mb-0.5 text-red-500 hover:text-red-400 text-xs px-2 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
      >
        {loading ? "Saving..." : "Save Social Links"}
      </button>
    </div>
  );
}
export default SocialTab;
