"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

interface BankAccount {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export default function OnboardingForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    business_name: "",
    bio_tagline: "",
    location: "",
    whatsapp: "",
    instagram_handle: "",
    tiktok_handle: "",
    facebook_handle: "",
    website: "",
    product_name: "",
    product_price: "",
    description: "",
  });

  const [extraLinks, setExtraLinks] = useState<
    { platform: string; url: string }[]
  >([]);

  const [banks, setBanks] = useState<BankAccount[]>([
    { bank_name: "OPay", account_number: "", account_name: "" },
  ]);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const popularBanks = [
    "OPay",
    "PalmPay",
    "Moniepoint",
    "Zenith Bank",
    "GTBank",
    "Access Bank",
    "UBA",
    "Kuda Bank",
  ];

 useEffect(() => {
  let isMounted = true;

  const loadUser = async () => {
    // Try getUser first (most reliable)
    const { data: { user } } = await supabase.auth.getUser();
    if (!isMounted) return;

    if (user?.email) {
      const email = user.email.toLowerCase();
      setUserEmail(email);
      setFormData(prev => ({
        ...prev,
        business_name: prev.business_name || email.split("@")[0],
      }));
      return;
    }

    // Fallback to getSession
    const { data: { session } } = await supabase.auth.getSession();
    if (!isMounted) return;

    if (session?.user?.email) {
      const email = session.user.email.toLowerCase();
      setUserEmail(email);
      setFormData(prev => ({
        ...prev,
        business_name: prev.business_name || email.split("@")[0],
      }));
    } else {
      // OPTIONAL: If no user is found at all, redirect them to sign-in or show an error
      setMessage({
        type: "error",
        text: "Please log in to set up your storefront.",
      });
    }
  };

  loadUser();

  // Listen for auth state changes cleanly without checking stale outer variables
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (!isMounted) return;

      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        setUserEmail(email);
        setFormData(prev => ({
          ...prev,
          business_name: prev.business_name || email.split("@")[0],
        }));
      } else {
        setUserEmail(null);
      }
    }
  );

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (
    index: number,
    field: keyof BankAccount,
    value: string,
  ) => {
    const updatedBanks = [...banks];
    updatedBanks[index][field] = value;
    setBanks(updatedBanks);
  };

  const addBankSlot = () => {
    if (banks.length < 3) {
      setBanks([
        ...banks,
        { bank_name: "OPay", account_number: "", account_name: "" },
      ]);
    }
  };

  const removeBankSlot = (index: number) => {
    setBanks(banks.filter((_, i) => i !== index));
  };

  const handleExtraLinkChange = (
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

  const uploadImage = async (file: File, folder: string, prefix: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${prefix}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Guard: email must exist before we can update the vendor row
    if (!userEmail) {
      setMessage({
        type: "error",
        text: "Session expired. Please log out and log back in.",
      });
      setLoading(false);
      return;
    }

    if (
      !formData.username ||
      !formData.business_name ||
      !formData.product_name
    ) {
      setMessage({
        type: "error",
        text: "Please fill out all required fields.",
      });
      setLoading(false);
      return;
    }

    try {
      setUploading(true);
      const usernameSlug = formData.username.trim().toLowerCase();

      let finalImageUrl = "";
      if (imageFile)
        finalImageUrl = await uploadImage(imageFile, "products", usernameSlug);

      let avatarUrl = "";
      if (avatarFile)
        avatarUrl = await uploadImage(avatarFile, "avatars", usernameSlug);

      let bannerUrl = "";
      if (bannerFile)
        bannerUrl = await uploadImage(bannerFile, "banners", usernameSlug);

      setUploading(false);

      const formattedPrice = formData.product_price.trim()
        ? formData.product_price.replace(/[^0-9]/g, "")
        : null;

      // ── Step 1: Update vendor row ──────────────────────────────────────────
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .update({
          username: usernameSlug,
          business_name: formData.business_name,
          bio_tagline: formData.bio_tagline,
          location: formData.location,
          whatsapp: formData.whatsapp,
          instagram_handle: formData.instagram_handle,
          tiktok_handle: formData.tiktok_handle,
          facebook_handle: formData.facebook_handle,
          website: formData.website,
          social_links: extraLinks.filter((l) => l.url.trim() !== ""),
          product_name: formData.product_name,
          product_price: formattedPrice,
          product_image: finalImageUrl || undefined,
          description: formData.description,
          avatar_image: avatarUrl || undefined,
          banner_image: bannerUrl || undefined,
          is_onboarded: true,
        })
        .eq("email", userEmail.toLowerCase())
        .select("id")
        .maybeSingle();

      if (vendorError) throw vendorError;

      // ── Step 2: Guard — if no row was found ───────────────────────────────
      if (!vendorData) {
        throw new Error(
          "Your account record was not found. Please log out and log back in, then try again.",
        );
      }

      // ── Step 3: Insert banks ───────────────────────────────────────────────
      if (banks.length > 0) {
        await supabase
          .from("vendor_banks")
          .delete()
          .eq("vendor_id", vendorData.id);

        const bankRows = banks
          .filter((b) => b.account_number.trim() !== "")
          .map((b) => ({
            vendor_id: vendorData.id,
            bank_name: b.bank_name,
            account_number: b.account_number,
            account_name: b.account_name,
          }));

        if (bankRows.length > 0) {
          const { error: bankError } = await supabase
            .from("vendor_banks")
            .insert(bankRows);
          if (bankError) throw bankError;
        }
      }

      setMessage({
        type: "success",
        text: "🎉 Setup Complete! Your storefront is now live. Redirecting to your dashboard...",
      });

      setTimeout(() => router.push("/admin/dashboard"), 2000);

      setImageFile(null);
      setAvatarFile(null);
      setBannerFile(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex justify-center p-4 md:p-8 antialiased">
      <div className="w-full max-w-2xl my-auto space-y-6 py-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Storefront Setup
          </h1>
          <p className="text-xs text-[#374151]">
            Configure your storefront profile and product listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {message && (
            <div
              className={`p-4 rounded-xl text-xs border font-medium ${
                message.type === "success"
                  ? "bg-green-50 border-[#22C55E] text-[#15803D]"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* SECTION 1: Brand Identity */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
              1. Brand Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Store Handle*
                </label>
                <div className="flex rounded-xl bg-white border border-[#E5E7EB] focus-within:border-[#22C55E] focus-within:ring-1 focus-within:ring-[#22C55E] transition-all overflow-hidden">
                  <span className="text-gray-400 pl-3 py-2.5 text-xs select-none bg-gray-50 pr-2 border-r border-[#E5E7EB] flex items-center">
                    biomarket.com/
                  </span>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="ada_hub"
                    className="bg-transparent text-xs w-full p-2.5 text-[#111827] focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Business Name*
                </label>
                <input
                  type="text"
                  name="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Ada Fashion Hub"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Bio / Tagline
                </label>
                <input
                  type="text"
                  name="bio_tagline"
                  value={formData.bio_tagline}
                  onChange={handleChange}
                  placeholder="Quality Ankara & Ready-to-wear"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Lagos"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Profile / Avatar Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setAvatarFile(e.target.files[0])
                  }
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2 text-xs text-[#374151] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-[#374151]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setBannerFile(e.target.files[0])
                  }
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2 text-xs text-[#374151] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-[#374151]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Bank Details */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
                2. Bank Details (Max 3)
              </h2>
              {banks.length < 3 && (
                <button
                  type="button"
                  onClick={addBankSlot}
                  className="text-[11px] text-[#15803D] hover:underline font-bold"
                >
                  + Add Bank
                </button>
              )}
            </div>
            <div className="space-y-4 divide-y divide-gray-100">
              {banks.map((bank, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${index > 0 ? "pt-4" : ""}`}
                >
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">
                      Bank #{index + 1}
                    </label>
                    <select
                      value={bank.bank_name}
                      onChange={(e) =>
                        handleBankChange(index, "bank_name", e.target.value)
                      }
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                    >
                      {popularBanks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 font-medium">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bank.account_number}
                      onChange={(e) =>
                        handleBankChange(
                          index,
                          "account_number",
                          e.target.value,
                        )
                      }
                      placeholder="0472567510"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] font-mono"
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-[11px] text-gray-400 font-medium">
                      Account Name
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={bank.account_name}
                        onChange={(e) =>
                          handleBankChange(
                            index,
                            "account_name",
                            e.target.value,
                          )
                        }
                        placeholder="Ada Fabrics Ltd"
                        className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                      />
                      {banks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBankSlot(index)}
                          className="text-red-500 text-xs hover:text-red-700 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Social & Contact */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
              3. Social & Contact
            </h2>

            {/* Core platforms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  WhatsApp Number*
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="2348030000000"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://mystore.com"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagram_handle"
                  value={formData.instagram_handle}
                  onChange={handleChange}
                  placeholder="https://instagram.com/ada_hub"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  TikTok URL
                </label>
                <input
                  type="url"
                  name="tiktok_handle"
                  value={formData.tiktok_handle}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/@ada_hub"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebook_handle"
                  value={formData.facebook_handle}
                  onChange={handleChange}
                  placeholder="https://facebook.com/adahub"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                />
              </div>
            </div>

            {/* Extra / custom links */}
            <div className="border-t border-[#E5E7EB] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#374151] uppercase tracking-wider">
                    Additional Links
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    YouTube, LinkedIn, Telegram, Snapchat — unlimited.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addExtraLink}
                  className="text-[11px] text-[#22C55E] border border-[#22C55E]/30 px-3 py-1.5 rounded-lg hover:bg-[#22C55E]/10 transition-colors font-semibold"
                >
                  + Add Link
                </button>
              </div>

              {extraLinks.length === 0 && (
                <div className="border border-dashed border-[#E5E7EB] rounded-xl p-3 text-center">
                  <p className="text-[11px] text-gray-400">
                    Add YouTube, LinkedIn, Telegram, Threads, or any custom
                    link.
                  </p>
                </div>
              )}

              {extraLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end"
                >
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#374151] font-medium uppercase">
                      Platform
                    </label>
                    <input
                      type="text"
                      list="platform-suggestions"
                      value={link.platform}
                      onChange={(e) =>
                        handleExtraLinkChange(idx, "platform", e.target.value)
                      }
                      placeholder="YouTube"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                    />
                    <datalist id="platform-suggestions">
                      {[
                        "YouTube",
                        "Twitter / X",
                        "LinkedIn",
                        "Snapchat",
                        "Telegram",
                        "Pinterest",
                        "Threads",
                        "Other",
                      ].map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#374151] font-medium uppercase">
                      URL
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        handleExtraLinkChange(idx, "url", e.target.value)
                      }
                      placeholder="https://youtube.com/@ada_hub"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                    />
                  </div>
                  <button
                    type="button"                    
                    onClick={() => removeExtraLink(idx)}
                    className="mb-0.5 text-red-500 hover:text-red-700 text-xs px-2 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Product */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
              4. Featured Product
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="product_name"
                  required
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="Ankara Gown Style Alpha"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#374151] font-medium uppercase">
                  Price (₦)
                </label>
                <input
                  type="text"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleChange}
                  placeholder="12500"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#374151] font-medium uppercase">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setImageFile(e.target.files[0])
                }
                className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2 text-xs text-[#374151] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-[#374151]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading || !userEmail}
            className="w-full bg-[#22C55E] hover:bg-[#15803D] text-white font-semibold py-3 px-6 rounded-xl text-center transition-all shadow-md uppercase tracking-wider text-xs disabled:bg-gray-200 disabled:text-gray-500"
          >
            {!userEmail
              ? "Loading session..."
              : uploading
                ? "Uploading images..."
                : loading
                  ? "Saving your storefront..."
                  : "🚀 Save & Launch Storefront"}
          </button>
        </form>
      </div>
    </div>
  );
}
