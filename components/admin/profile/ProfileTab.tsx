"use client";
import Toast from "@/components/admin/ui/Toast";
import Field from "@/components/admin/ui/Field";

import { supabase } from "@/app/lib/supabase";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/lib/uploadImage";

function ProfileTab({ vendor }: { vendor: any }) {
  const [form, setForm] = useState({
    business_name: vendor.business_name || "",
    bio_tagline: vendor.bio_tagline || "",
    location: vendor.location || "",
    username: vendor.username || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      type VendorUpdate = {
        business_name: string;
        bio_tagline: string;
        location: string;
        username: string;
        avatar_image?: string;
        banner_image?: string;
      };

      const updates: VendorUpdate = {
        ...form,
      };

      if (avatarFile) {
        const avatar = await uploadImage(avatarFile, "avatars", form.username);

        updates.avatar_image = avatar.publicUrl;
      }

      if (bannerFile) {
        const banner = await uploadImage(bannerFile, "banners", form.username);

        updates.banner_image = banner.publicUrl;
      }

      const { error } = await supabase
        .from("vendors")
        .update(updates)
        .eq("id", vendor.id);
      if (error) throw error;
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-[#111827]">Profile Settings</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Changes reflect instantly on your storefront.
        </p>
      </div>

      <Toast msg={msg} />

      {/* Avatar & Banner previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] text-[#6B7280] font-medium uppercase">
            Profile Avatar
          </p>
          {vendor.avatar_image && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-300">
              <Image
                src={vendor.avatar_image}
                alt="avatar"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setAvatarFile(e.target.files[0])}
            className="w-full text-xs text-[#4B5563] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-[#374151]"
          />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] text-[#6B7280] font-medium uppercase">
            Banner Image
          </p>
          {vendor.banner_image && (
            <div className="relative w-full h-16 rounded-xl overflow-hidden border border-gray-300">
              <Image
                src={vendor.banner_image}
                alt="banner"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setBannerFile(e.target.files[0])}
            className="w-full text-xs text-[#4B5563] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-[#374151]"
          />
        </div>
      </div>

      {/* Store URL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-1">
        <p className="text-[11px] text-[#6B7280] font-medium uppercase">
          Your Store URL
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#15803D] font-mono font-bold">
            bio-linkmarket.com/{vendor.username}
          </span>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `https://biomarket.com/${vendor.username}`,
              )
            }
            className="text-[10px] text-[#6B7280] hover:text-[#374151] border border-gray-200 px-2 py-0.5 rounded-lg transition-colors"
          >
            Copy
          </button>
          <a
            href={`/${vendor.username}`}
            target="_blank"
            className="text-[10px] text-[#6B7280] hover:text-[#374151] border border-gray-200 px-2 py-0.5 rounded-lg transition-colors"
          >
            Preview {"↗"}
          </a>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Business Name"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            placeholder="Ada Fashion Hub"
          />
          <Field
            label="Username / Handle"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="ada_hub"
          />
          <Field
            label="Bio / Tagline"
            name="bio_tagline"
            value={form.bio_tagline}
            onChange={handleChange}
            placeholder="Quality Ankara & Ready-to-wear"
          />
          <Field
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Lagos"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
export default ProfileTab;
