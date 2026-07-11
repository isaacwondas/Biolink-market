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
    "Kuda Bank",
    "Access Bank",
    "Zenith Bank",
    "GTBank",
    "First Bank of Nigeria",
    "UBA",
    "First City Monument Bank (FCMB)",
    "Fidelity Bank",
    "Ecobank Nigeria",
    "Providus Bank",
    "Sterling Bank",
    "Union Bank of Nigeria",
    "Wema Bank",
    "Stanbic IBTC Bank",
    "Polaris Bank",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      // Try getUser first (most reliable)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (user?.email) {
        const email = user.email.toLowerCase();
        setUserEmail(email);
        setFormData((prev) => ({
          ...prev,
          business_name: prev.business_name || email.split("@")[0],
        }));
        return;
      }

      // Fallback to getSession
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        setUserEmail(email);
        setFormData((prev) => ({
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        setUserEmail(email);
        setFormData((prev) => ({
          ...prev,
          business_name: prev.business_name || email.split("@")[0],
        }));
      } else {
        setUserEmail(null);
      }
    });

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
    // =============================================
    // ALLOWED FILE TYPES
    // =============================================

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG and WEBP images are allowed.");
    }

    // =============================================
    // MAX SIZE = 5MB
    // =============================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new Error("Image size must not exceed 5MB.");
    }

    const extension = file.name.split(".").pop();

    const filename = `${prefix}-${Date.now()}.${extension}`;

    const path = `${folder}/${filename}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);

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

    // =============================================
    // VALIDATE WHATSAPP NUMBER
    // =============================================

    const normalizedWhatsapp = formData.whatsapp.replace(/\s+/g, "");

    const whatsappRegex = /^\+?\d{10,15}$/;

    if (!whatsappRegex.test(normalizedWhatsapp)) {
      setMessage({
        type: "error",
        text: "Please enter a valid WhatsApp number (10–15 digits). Example: 2348012345678",
      });

      setLoading(false);
      return;
    }

    try {
      setUploading(true);
      const usernameSlug = formData.username.trim().toLowerCase();

      let finalImageUrl = "";
      if (imageFile instanceof File)
        finalImageUrl = await uploadImage(imageFile, "products", usernameSlug);

      let avatarUrl = "";
      if (avatarFile instanceof File)
        avatarUrl = await uploadImage(avatarFile, "avatars", usernameSlug);

      let bannerUrl = "";
      if (bannerFile instanceof File)
        bannerUrl = await uploadImage(bannerFile, "banners", usernameSlug);

      setUploading(false);

      // =============================================
      // FORMAT PRICE
      // =============================================

      const formattedPrice = formData.product_price.trim()
        ? formData.product_price.replace(/[^0-9]/g, "")
        : null;

      // =============================================
      // CHECK IF USERNAME IS ALREADY TAKEN
      // =============================================

      const { data: existingUsername, error: usernameError } = await supabase
        .from("vendors")
        .select("id, email")
        .eq("username", usernameSlug)
        .maybeSingle();

      if (usernameError) throw usernameError;

      if (
        existingUsername &&
        existingUsername.email?.toLowerCase() !== userEmail.toLowerCase()
      ) {
        setMessage({
          type: "error",
          text: "This store handle is already taken. Please choose another one.",
        });

        setLoading(false);
        setUploading(false);
        return;
      }

      // ── Step 1: Update vendor row ──────────────────────────────────────────
      const { data: updatedVendor, error: vendorError } = await supabase
        .from("vendors")
        .update({
          username: usernameSlug,
          business_name: formData.business_name,
          bio_tagline: formData.bio_tagline,
          location: formData.location,
          whatsapp: normalizedWhatsapp.replace("+", ""),
          instagram_handle: formData.instagram_handle,
          tiktok_handle: formData.tiktok_handle,
          facebook_handle: formData.facebook_handle,
          website: formData.website,
          social_links: extraLinks.filter((l) => l.url.trim() !== ""),
          product_name: formData.product_name,
          product_price: formattedPrice,
          product_image: finalImageUrl || null,
          description: formData.description,
          avatar_image: avatarUrl || null,
          banner_image: bannerUrl || null,
          is_onboarded: true,
        })
        .eq("email", userEmail.toLowerCase())
        .select();

      console.log("Updated Vendor:", updatedVendor);
      console.log("Vendor Error:", vendorError);

      if (vendorError) throw vendorError;

      if (!updatedVendor || updatedVendor.length === 0) {
        throw new Error(`No vendor record was updated for email: ${userEmail}`);
      }

      // Fetch vendor id
      const { data: vendorRow, error: vendorFetchError } = await supabase
        .from("vendors")
        .select("id")
        .eq("email", userEmail.toLowerCase())
        .single();

      if (vendorFetchError) throw vendorFetchError;

      // ── Step 2: Create vendor row if missing (Google OAuth users) ───────────────

      // ── Step 3: Insert banks ───────────────────────────────────────────────────
      if (banks.length > 0) {
        await supabase
          .from("vendor_banks")
          .delete()
          .eq("vendor_id", vendorRow.id);

        const bankRows = banks
          .filter((b) => b.account_number.trim() !== "")
          .map((b) => ({
            vendor_id: vendorRow.id, // ← use vendorRow.id instead of vendorData.id
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

      setTimeout(() => router.push("/merchant/share"), 2000);

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
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] antialiased">
      {/* PAGE CONTAINER */}
      <main className="w-full max-w-5xl mx-auto px-3 sm:px-5 md:px-8 py-6 sm:py-8 md:py-12 pb-28 sm:pb-12">
        {/* PAGE HEADER */}
        <div className="mb-7 md:mb-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#15803D]">
              Set Up Your Storefront
            </h1>

            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed px-2">
              Add your business details, payment accounts and featured product
              to launch your storefront.
            </p>
          </div>
        </div>

        {/* ONBOARDING FORM */}
        <form onSubmit={handleSubmit} className="w-full">
          <fieldset
            disabled={loading || uploading}
            className="space-y-6 md:space-y-8"
          >
            {/* FORM MESSAGE */}
            {message && (
              <div
                role="alert"
                className={`p-4 sm:p-5 rounded-2xl text-sm md:text-base border font-medium shadow-sm ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-[#15803D]"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* SECTION 1: BRAND IDENTITY */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-6 md:p-8 space-y-8">
              {/* Section Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#22C55E]">
                  <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                    Brand Identity
                  </h2>
                </div>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Tell customers who you are and how they'll recognize your
                  store.
                </p>
              </div>

              {/* Store Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* Store Handle */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Store Handle <span className="text-red-500">*</span>
                  </label>

                  <div className="flex min-h-[50px] rounded-xl bg-white border border-[#D1D5DB] focus-within:border-[#22C55E] focus-within:ring-2 focus-within:ring-[#22C55E]/20 transition-all overflow-hidden">
                    <span className="hidden sm:flex items-center bg-[#F9FAFB] border-r border-[#E5E7EB] px-3 text-sm text-[#6B7280] select-none">
                      biolinkmarket.com/
                    </span>

                    <span className="sm:hidden flex items-center bg-[#F9FAFB] border-r border-[#E5E7EB] px-3 text-sm text-[#6B7280] select-none">
                      /
                    </span>

                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      disabled={loading || uploading}
                      placeholder="ada_hub"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="flex-1 min-w-0 bg-transparent text-sm md:text-base px-4 py-3 text-[#111827] placeholder:text-gray-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <p className="text-xs text-[#6B7280]">
                    This becomes your unique storefront link.
                  </p>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Business Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="business_name"
                    required
                    value={formData.business_name}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="Ada Fashion Hub"
                    className="w-full min-h-[50px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Bio / Tagline
                  </label>

                  <textarea
                    rows={4}
                    name="bio_tagline"
                    value={formData.bio_tagline}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="Tell customers briefly what your business offers..."
                    className="w-full min-h-[120px] resize-none bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <p className="text-xs text-[#6B7280]">
                    Keep it short, clear and easy for customers to understand.
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Business Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="Lagos, Nigeria"
                    className="w-full min-h-[50px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <p className="text-xs text-[#6B7280]">
                    Enter the city or area where your business operates.
                  </p>
                </div>
              </div>

              {/* BRANDING */}
              <div className="border-t border-[#E5E7EB] pt-7 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    Store Branding
                  </h3>

                  <p className="text-sm text-[#6B7280]">
                    Upload a logo and banner to make your storefront easy to
                    recognize.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {/* Avatar Upload */}
                  <label className="group flex flex-col items-center justify-center min-h-[220px] border-2 border-dashed border-[#D1D5DB] rounded-2xl bg-[#F9FAFB] hover:bg-green-50/50 hover:border-[#22C55E] transition-all cursor-pointer px-5 py-7 text-center">
                    <p className="text-sm md:text-base font-bold text-[#111827]">
                      Upload Store Logo
                    </p>

                    <p className="text-xs md:text-sm text-[#6B7280] mt-1">
                      JPG, PNG or WEBP • Maximum 5MB
                    </p>

                    <p className="text-xs text-[#9CA3AF] mt-1">
                      A square image works best.
                    </p>

                    {avatarFile && (
                      <div className="mt-4 max-w-full px-4 py-2 bg-green-100 text-[#15803D] rounded-xl text-xs md:text-sm font-medium break-all">
                        ✓ {avatarFile.name}
                      </div>
                    )}

                    <div className="mt-5 bg-white border border-[#D1D5DB] group-hover:border-[#22C55E] rounded-xl px-5 py-3 text-sm font-semibold text-[#374151] group-hover:text-[#15803D] transition-all">
                      Select Logo
                    </div>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      disabled={loading || uploading}
                      onChange={(e) =>
                        e.target.files && setAvatarFile(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </label>

                  {/* Banner Upload */}
                  <label className="group flex flex-col items-center justify-center min-h-[220px] border-2 border-dashed border-[#D1D5DB] rounded-2xl bg-[#F9FAFB] hover:bg-green-50/50 hover:border-[#22C55E] transition-all cursor-pointer px-5 py-7 text-center">
                    <p className="text-sm md:text-base font-bold text-[#111827]">
                      Upload Store Banner
                    </p>

                    <p className="text-xs md:text-sm text-[#6B7280] mt-1">
                      JPG, PNG or WEBP • Maximum 5MB
                    </p>

                    <p className="text-xs text-[#9CA3AF] mt-1">
                      A wide landscape image works best.
                    </p>

                    {bannerFile && (
                      <div className="mt-4 max-w-full px-4 py-2 bg-green-100 text-[#15803D] rounded-xl text-xs md:text-sm font-medium break-all">
                        ✓ {bannerFile.name}
                      </div>
                    )}

                    <div className="mt-5 bg-white border border-[#D1D5DB] group-hover:border-[#22C55E] rounded-xl px-5 py-3 text-sm font-semibold text-[#374151] group-hover:text-[#15803D] transition-all">
                      Select Banner
                    </div>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      disabled={loading || uploading}
                      onChange={(e) =>
                        e.target.files && setBannerFile(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            {/* SECTION 2: BANK DETAILS */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 md:p-8 space-y-6 shadow-sm">
              {/* Section Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                    Bank Accounts
                  </h2>
                </div>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Add the bank accounts where customers can send payments. You
                  can add up to 3 accounts.
                </p>
              </div>

              {/* Bank Account Cards */}
              <div className="space-y-5">
                {banks.map((bank, index) => (
                  <div
                    key={index}
                    className="relative bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 md:p-6 space-y-5"
                  >
                    {/* Bank Card Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#111827]">
                          Bank Account {index + 1}
                        </p>

                        <p className="text-xs text-[#6B7280] mt-1">
                          Enter the correct settlement account details.
                        </p>
                      </div>

                      {banks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBankSlot(index)}
                          disabled={loading || uploading}
                          className="min-h-[44px] px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          🗑 Remove
                        </button>
                      )}
                    </div>

                    {/* Bank Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Bank Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#374151]">
                          Bank Name
                        </label>

                        <select
                          value={bank.bank_name}
                          disabled={loading || uploading}
                          onChange={(e) =>
                            handleBankChange(index, "bank_name", e.target.value)
                          }
                          className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          {popularBanks.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Account Number */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#374151]">
                          Account Number
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          value={bank.account_number}
                          disabled={loading || uploading}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");

                            handleBankChange(index, "account_number", value);
                          }}
                          placeholder="0472567510"
                          className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-mono tracking-wider disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />

                        <p className="text-xs text-[#6B7280]">
                          Enter your 10-digit account number.
                        </p>
                      </div>

                      {/* Account Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#374151]">
                          Account Name
                        </label>

                        <input
                          type="text"
                          value={bank.account_name}
                          disabled={loading || uploading}
                          onChange={(e) =>
                            handleBankChange(
                              index,
                              "account_name",
                              e.target.value,
                            )
                          }
                          placeholder="Ada Fabrics Ltd"
                          className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD BANK BUTTON */}
              {banks.length < 3 && (
                <button
                  type="button"
                  onClick={addBankSlot}
                  disabled={loading || uploading}
                  className="w-full min-h-[54px] flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#15803D] active:scale-[0.99] text-white rounded-2xl px-5 py-4 text-sm md:text-base font-bold transition-all shadow-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <span className="text-xl">＋</span>
                  Add Another Bank Account
                </button>
              )}

              {/* Maximum Account Message */}
              {banks.length === 3 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-[#15803D]">
                    ✓ Maximum of 3 bank accounts added
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 3: Social & Contact */}
            {/* SECTION 3: SOCIAL & CONTACT */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 md:p-8 space-y-7 shadow-sm">
              {/* Section Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                    Social & Contact
                  </h2>
                </div>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Help customers contact you and connect with your business
                  online.
                </p>
              </div>

              {/* Core Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="tel"
                    inputMode="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="2348030000000"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <p className="text-xs text-[#6B7280]">
                    Include your country code. Example: 2348030000000
                  </p>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Website URL
                  </label>

                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="https://mystore.com"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Instagram URL
                  </label>

                  <input
                    type="url"
                    name="instagram_handle"
                    value={formData.instagram_handle}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="https://instagram.com/ada_hub"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* TikTok */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    TikTok URL
                  </label>

                  <input
                    type="url"
                    name="tiktok_handle"
                    value={formData.tiktok_handle}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="https://tiktok.com/@ada_hub"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Facebook URL
                  </label>

                  <input
                    type="url"
                    name="facebook_handle"
                    value={formData.facebook_handle}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="https://facebook.com/adahub"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* ADDITIONAL LINKS */}
              <div className="border-t border-[#E5E7EB] pt-7 space-y-5">
                <div className="space-y-2">
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    Additional Links
                  </h3>

                  <p className="text-sm text-[#6B7280]">
                    Add YouTube, LinkedIn, Telegram, Snapchat, Threads or any
                    other link.
                  </p>
                </div>

                {/* Empty State */}
                {extraLinks.length === 0 && (
                  <div className="border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] rounded-2xl px-5 py-8 text-center">
                    <p className="text-sm font-semibold text-[#374151]">
                      No additional links yet
                    </p>

                    <p className="text-xs text-[#6B7280] mt-1">
                      Add another social platform or custom business link.
                    </p>
                  </div>
                )}

                {/* Custom Links */}
                <div className="space-y-4">
                  {extraLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-[#111827]">
                          Additional Link {idx + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeExtraLink(idx)}
                          disabled={loading || uploading}
                          className="min-h-[44px] px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          🗑 Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Platform */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-[#374151]">
                            Platform
                          </label>

                          <input
                            type="text"
                            list="platform-suggestions"
                            value={link.platform}
                            disabled={loading || uploading}
                            onChange={(e) =>
                              handleExtraLinkChange(
                                idx,
                                "platform",
                                e.target.value,
                              )
                            }
                            placeholder="YouTube"
                            className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                            ].map((platform) => (
                              <option key={platform} value={platform} />
                            ))}
                          </datalist>
                        </div>

                        {/* URL */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-sm font-semibold text-[#374151]">
                            Link URL
                          </label>

                          <input
                            type="url"
                            value={link.url}
                            disabled={loading || uploading}
                            onChange={(e) =>
                              handleExtraLinkChange(idx, "url", e.target.value)
                            }
                            placeholder="https://youtube.com/@ada_hub"
                            className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADD LINK BUTTON */}
                <button
                  type="button"
                  onClick={addExtraLink}
                  disabled={loading || uploading}
                  className="w-full min-h-[54px] flex items-center justify-center gap-2 border-2 border-[#22C55E] bg-green-50 hover:bg-[#22C55E] text-[#15803D] hover:text-white rounded-2xl px-5 py-4 text-sm md:text-base font-bold transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-xl">＋</span>
                  Add Another Social or Custom Link
                </button>
              </div>
            </div>

            {/* SECTION 4: FEATURED PRODUCT */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 md:p-8 space-y-6 shadow-sm">
              {/* Section Header */}
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#111827] flex items-center gap-2">
                  Featured Product
                </h2>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Showcase one of your best products on your storefront.
                </p>
              </div>

              {/* Product Name and Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Product Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    required
                    value={formData.product_name}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="e.g. Ankara Gown Style Alpha"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Price (₦)
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    name="product_price"
                    value={formData.product_price}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="12,500"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Product Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#374151]">
                  Product Image
                </label>

                <label className="group flex flex-col items-center justify-center w-full min-h-[180px] sm:min-h-[210px] border-2 border-dashed border-[#D1D5DB] rounded-2xl bg-gray-50 hover:bg-green-50/50 hover:border-[#22C55E] transition-all cursor-pointer px-5 py-8 text-center">
                  <p className="text-sm md:text-base font-semibold text-[#111827]">
                    Upload Product Image
                  </p>

                  <p className="text-xs md:text-sm text-[#6B7280] mt-1">
                    JPG, PNG or WEBP • Maximum 5MB
                  </p>

                  {imageFile && (
                    <div className="mt-4 px-4 py-2 bg-green-100 text-[#15803D] rounded-lg text-xs md:text-sm font-medium break-all max-w-full">
                      ✓ {imageFile.name}
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    disabled={loading || uploading}
                    onChange={(e) =>
                      e.target.files && setImageFile(e.target.files[0])
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* MOBILE STICKY SAVE AREA */}
            <div className="sticky bottom-0 z-40 -mx-4 sm:mx-0 bg-white/95 backdrop-blur-md border-t border-gray-200 sm:border sm:rounded-2xl p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
              <button
                type="submit"
                disabled={loading || uploading || !userEmail}
                className="w-full min-h-[52px] bg-[#22C55E] hover:bg-[#15803D] active:scale-[0.99] text-white font-bold px-6 rounded-xl text-center transition-all shadow-lg text-sm md:text-base disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {!userEmail
                  ? "Loading session..."
                  : uploading
                    ? "Uploading images..."
                    : loading
                      ? "Saving your storefront..."
                      : "🚀 Save & Launch Storefront"}
              </button>

              <p className="text-center text-[11px] md:text-xs text-gray-500 mt-2">
                Your storefront details will be saved securely.
              </p>
            </div>
          </fieldset>
        </form>
      </main>
    </div>
  );
}
