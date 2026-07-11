"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Store, Image, Package } from "lucide-react";

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

  // =============================================
  // LOCAL IMAGE PREVIEWS
  // =============================================

  const imagePreviewUrl = useMemo(() => {
    if (!imageFile) return null;

    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const avatarPreviewUrl = useMemo(() => {
    if (!avatarFile) return null;

    return URL.createObjectURL(avatarFile);
  }, [avatarFile]);

  const bannerPreviewUrl = useMemo(() => {
    if (!bannerFile) return null;

    return URL.createObjectURL(bannerFile);
  }, [bannerFile]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  useEffect(() => {
    return () => {
      if (bannerPreviewUrl) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
  }, [bannerPreviewUrl]);

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

    // =============================================
    // HELPER FUNCTIONS
    // =============================================

    const cleanSocialHandle = (value: string) => {
      if (!value) return "";

      return value
        .trim()
        .replace(/^@/, "")
        .replace(/^https?:\/\/(www\.)?/i, "")
        .replace(/^(instagram\.com|tiktok\.com|facebook\.com|fb\.com)\//i, "")
        .replace(/^@/, "")
        .split(/[/?#]/)[0]
        .trim();
    };

    const normalizeWebsite = (value: string) => {
      const website = value.trim();

      if (!website) return "";

      if (/^https?:\/\//i.test(website)) {
        return website;
      }

      return `https://${website}`;
    };

    const normalizeWhatsapp = (value: string) => {
      let phone = value.replace(/\D/g, "");

      // Nigerian local number: 08012345678
      if (phone.startsWith("0") && phone.length === 11) {
        phone = `234${phone.slice(1)}`;
      }

      return phone;
    };

    // =============================================
    // SESSION CHECK
    // =============================================

    if (!userEmail) {
      setMessage({
        type: "error",
        text: "Session expired. Please log out and log back in.",
      });

      setLoading(false);
      return;
    }

    // =============================================
    // REQUIRED FIELD VALIDATION
    // =============================================

    if (
      !formData.username.trim() ||
      !formData.business_name.trim() ||
      !formData.product_name.trim() ||
      !formData.whatsapp.trim()
    ) {
      setMessage({
        type: "error",
        text: "Please fill out all required fields.",
      });

      setLoading(false);
      return;
    }

    // =============================================
    // NORMALIZE WHATSAPP
    // =============================================

    const normalizedWhatsapp = normalizeWhatsapp(formData.whatsapp);

    const whatsappRegex = /^\d{10,15}$/;

    if (!whatsappRegex.test(normalizedWhatsapp)) {
      setMessage({
        type: "error",
        text: "Please enter a valid WhatsApp number. Example: 08030000000",
      });

      setLoading(false);
      return;
    }

    // =============================================
    // NORMALIZE SOCIAL DETAILS
    // =============================================

    const instagramHandle = cleanSocialHandle(formData.instagram_handle);

    const tiktokHandle = cleanSocialHandle(formData.tiktok_handle);

    const facebookHandle = cleanSocialHandle(formData.facebook_handle);

    const websiteUrl = normalizeWebsite(formData.website);

    try {
      setUploading(true);

      // =============================================
      // FORMAT STORE HANDLE
      // =============================================

      const usernameSlug = formData.username
        .trim()
        .toLowerCase()
        .replace(/^@/, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9_-]/g, "");

      if (!usernameSlug) {
        throw new Error("Please enter a valid store handle.");
      }

      // =============================================
      // CHECK USERNAME AVAILABILITY
      // =============================================

      const { data: existingUsername, error: usernameError } = await supabase
        .from("vendors")
        .select("id, email")
        .eq("username", usernameSlug)
        .maybeSingle();

      if (usernameError) {
        throw usernameError;
      }

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

      // =============================================
      // UPLOAD IMAGES
      // =============================================

      let finalImageUrl = "";

      if (imageFile instanceof File) {
        finalImageUrl = await uploadImage(imageFile, "products", usernameSlug);
      }

      let avatarUrl = "";

      if (avatarFile instanceof File) {
        avatarUrl = await uploadImage(avatarFile, "avatars", usernameSlug);
      }

      let bannerUrl = "";

      if (bannerFile instanceof File) {
        bannerUrl = await uploadImage(bannerFile, "banners", usernameSlug);
      }

      setUploading(false);

      // =============================================
      // FORMAT PRODUCT PRICE
      // =============================================

      const formattedPrice = formData.product_price.trim()
        ? formData.product_price.replace(/[^0-9]/g, "")
        : null;

      // =============================================
      // CLEAN ADDITIONAL LINKS
      // =============================================

      const cleanedExtraLinks = extraLinks
        .filter((link) => link.platform.trim() !== "" && link.url.trim() !== "")
        .map((link) => ({
          platform: link.platform.trim(),
          url: normalizeWebsite(link.url),
        }));

      // =============================================
      // UPDATE VENDOR
      // =============================================

      const { data: updatedVendor, error: vendorError } = await supabase
        .from("vendors")
        .update({
          username: usernameSlug,
          business_name: formData.business_name.trim(),
          bio_tagline: formData.bio_tagline.trim(),
          location: formData.location.trim(),

          whatsapp: normalizedWhatsapp,

          instagram_handle: instagramHandle,
          tiktok_handle: tiktokHandle,
          facebook_handle: facebookHandle,

          website: websiteUrl,

          social_links: cleanedExtraLinks,

          product_name: formData.product_name.trim(),
          product_price: formattedPrice,
          product_image: finalImageUrl || null,

          description: formData.description.trim(),

          avatar_image: avatarUrl || null,
          banner_image: bannerUrl || null,

          is_onboarded: true,
        })
        .eq("email", userEmail.toLowerCase())
        .select();

      if (vendorError) {
        throw vendorError;
      }

      if (!updatedVendor || updatedVendor.length === 0) {
        throw new Error(`No vendor record was updated for email: ${userEmail}`);
      }

      // =============================================
      // FETCH VENDOR ID
      // =============================================

      const { data: vendorRow, error: vendorFetchError } = await supabase
        .from("vendors")
        .select("id")
        .eq("email", userEmail.toLowerCase())
        .single();

      if (vendorFetchError) {
        throw vendorFetchError;
      }

      // =============================================
      // SAVE BANK ACCOUNTS
      // =============================================

      const validBanks = banks.filter(
        (bank) => bank.account_number.trim() !== "",
      );

      if (validBanks.length > 0) {
        const { error: deleteBankError } = await supabase
          .from("vendor_banks")
          .delete()
          .eq("vendor_id", vendorRow.id);

        if (deleteBankError) {
          throw deleteBankError;
        }

        const bankRows = validBanks.map((bank) => ({
          vendor_id: vendorRow.id,
          bank_name: bank.bank_name.trim(),
          account_number: bank.account_number.replace(/\D/g, ""),
          account_name: bank.account_name.trim(),
        }));

        const { error: bankError } = await supabase
          .from("vendor_banks")
          .insert(bankRows);

        if (bankError) {
          throw bankError;
        }
      }

      // =============================================
      // SUCCESS
      // =============================================

      setMessage({
        type: "success",
        text: "🎉 Setup Complete! Your storefront is now live. Redirecting to your dashboard...",
      });

      setImageFile(null);
      setAvatarFile(null);
      setBannerFile(null);

      setTimeout(() => {
        router.push("/merchant/share");
      }, 2000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.message ||
          "Something went wrong while setting up your storefront.",
      });
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
                <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                  Brand Identity
                </h2>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Tell customers who you are and how they'll recognize your
                  store.
                </p>
              </div>

              {/* STORE INFORMATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* Store Handle */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Store Handle <span className="text-red-500">*</span>
                  </label>

                  <div className="flex min-h-[50px] rounded-xl bg-white border border-[#D1D5DB] focus-within:border-[#22C55E] focus-within:ring-2 focus-within:ring-[#22C55E]/20 overflow-hidden">
                    <span className="hidden sm:flex items-center bg-[#F9FAFB] border-r border-[#E5E7EB] px-3 text-sm text-[#6B7280]">
                      biolinkmarket.com/
                    </span>

                    <span className="sm:hidden flex items-center bg-[#F9FAFB] border-r border-[#E5E7EB] px-3 text-sm text-[#6B7280]">
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
                      className="flex-1 min-w-0 bg-transparent text-sm md:text-base px-4 py-3 text-[#111827] focus:outline-none"
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
                    className="w-full min-h-[50px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
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
                    className="w-full min-h-[120px] resize-none bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
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
                    className="w-full min-h-[50px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                  />

                  <p className="text-xs text-[#6B7280]">
                    Enter the city or area where your business operates.
                  </p>
                </div>
              </div>

              {/* STORE BRANDING */}
              <div className="border-t border-[#E5E7EB] pt-7 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    Store Branding
                  </h3>

                  <p className="text-sm text-[#6B7280]">
                    Preview your logo and banner before launching your
                    storefront.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {/* AVATAR */}
                  <div className="border-2 border-dashed border-[#D1D5DB] rounded-2xl bg-[#F9FAFB] p-5 sm:p-6 text-center">
                    <p className="text-sm md:text-base font-bold text-[#111827]">
                      Store Logo
                    </p>

                    <p className="text-xs text-[#6B7280] mt-1">
                      Square image recommended • Maximum 5MB
                    </p>

                    <div className="flex justify-center my-5">
                      {avatarFile && avatarPreviewUrl ? (
                        <img
                          src={avatarPreviewUrl || ""}
                          alt="Store logo preview"
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                          <Store
                            className="w-12 h-12 sm:w-14 sm:h-14 text-gray-700"
                            strokeWidth={1.5}
                          />
                        </div>
                      )}
                    </div>

                    {avatarFile && (
                      <p className="text-xs text-[#15803D] font-medium mb-3 truncate">
                        ✓ {avatarFile.name}
                      </p>
                    )}

                    <label className="inline-flex min-h-[46px] items-center justify-center bg-white border border-[#D1D5DB] hover:border-[#22C55E] hover:text-[#15803D] rounded-xl px-5 py-3 text-sm font-semibold text-[#374151] cursor-pointer transition-all">
                      {avatarFile ? "Change Logo" : "Select Logo"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={loading || uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            setAvatarFile(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* BANNER */}
                  <div className="border-2 border-dashed border-[#D1D5DB] rounded-2xl bg-[#F9FAFB] p-5 sm:p-6 text-center">
                    <p className="text-sm md:text-base font-bold text-[#111827]">
                      Store Banner
                    </p>

                    <p className="text-xs text-[#6B7280] mt-1">
                      Wide landscape image recommended • Maximum 5MB
                    </p>

                    <div className="my-5">
                      {bannerFile && bannerPreviewUrl ? (
                        <img
                          src={bannerPreviewUrl || ""}
                          alt="Store banner preview"
                          className="w-full h-32 sm:h-36 rounded-2xl object-cover border border-[#E5E7EB] shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-32 sm:h-36 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                          <Image
                            className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400"
                            strokeWidth={1.5}
                          />
                        </div>
                      )}
                    </div>

                    {bannerFile && (
                      <p className="text-xs text-[#15803D] font-medium mb-3 truncate">
                        ✓ {bannerFile.name}
                      </p>
                    )}

                    <label className="inline-flex min-h-[46px] items-center justify-center bg-white border border-[#D1D5DB] hover:border-[#22C55E] hover:text-[#15803D] rounded-xl px-5 py-3 text-sm font-semibold text-[#374151] cursor-pointer transition-all">
                      {bannerFile ? "Change Banner" : "Select Banner"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={loading || uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            setBannerFile(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
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

            {/* SOCIAL & CONTACT */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 md:p-8 space-y-7 shadow-sm">
              {/* Section Header */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                  🌍 Social & Contact
                </h2>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Help customers contact you and find your business online.
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
                    placeholder="08030000000"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <p className="text-xs text-[#6B7280]">
                    Enter your normal WhatsApp number. We'll format it for you.
                  </p>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Website
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    inputMode="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={loading || uploading}
                    placeholder="mystore.com"
                    className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <p className="text-xs text-[#6B7280]">
                    No need to type https://
                  </p>
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Instagram Username
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <div className="flex min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl overflow-hidden focus-within:border-[#22C55E] focus-within:ring-2 focus-within:ring-[#22C55E]/20 transition-all">
                    <span className="flex items-center justify-center px-4 bg-[#F9FAFB] border-r border-[#E5E7EB] text-[#6B7280] font-bold">
                      @
                    </span>

                    <input
                      type="text"
                      name="instagram_handle"
                      value={formData.instagram_handle}
                      onChange={handleChange}
                      disabled={loading || uploading}
                      placeholder="ada_hub"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>

                  <p className="text-xs text-[#6B7280]">
                    Enter your Instagram username only.
                  </p>
                </div>

                {/* TikTok */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    TikTok Username
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <div className="flex min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl overflow-hidden focus-within:border-[#22C55E] focus-within:ring-2 focus-within:ring-[#22C55E]/20 transition-all">
                    <span className="flex items-center justify-center px-4 bg-[#F9FAFB] border-r border-[#E5E7EB] text-[#6B7280] font-bold">
                      @
                    </span>

                    <input
                      type="text"
                      name="tiktok_handle"
                      value={formData.tiktok_handle}
                      onChange={handleChange}
                      disabled={loading || uploading}
                      placeholder="ada_hub"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>

                  <p className="text-xs text-[#6B7280]">
                    Enter your TikTok username only.
                  </p>
                </div>

                {/* Facebook */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-[#374151]">
                    Facebook Username
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <div className="flex min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl overflow-hidden focus-within:border-[#22C55E] focus-within:ring-2 focus-within:ring-[#22C55E]/20 transition-all">
                    <span className="flex items-center justify-center px-4 bg-[#F9FAFB] border-r border-[#E5E7EB] text-[#6B7280] font-bold">
                      @
                    </span>

                    <input
                      type="text"
                      name="facebook_handle"
                      value={formData.facebook_handle}
                      onChange={handleChange}
                      disabled={loading || uploading}
                      placeholder="adahub"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full px-4 py-3 text-sm md:text-base text-[#111827] placeholder:text-gray-400 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>

                  <p className="text-xs text-[#6B7280]">
                    Enter your Facebook username or page handle only.
                  </p>
                </div>
              </div>

              {/* ADDITIONAL LINKS */}
              <div className="border-t border-[#E5E7EB] pt-7 space-y-5">
                <div className="space-y-2">
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    Additional Links
                  </h3>

                  <p className="text-sm text-[#6B7280]">
                    Add YouTube, LinkedIn, Telegram, Snapchat, Threads or
                    another link.
                  </p>
                </div>

                {extraLinks.length === 0 && (
                  <div className="border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] rounded-2xl px-5 py-6 text-center">
                    <p className="text-sm font-semibold text-[#374151]">
                      Have another social page?
                    </p>

                    <p className="text-xs text-[#6B7280] mt-1">
                      You can add it here. This is optional.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {extraLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-[#111827]">
                          Link {idx + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeExtraLink(idx)}
                          disabled={loading || uploading}
                          className="min-h-[40px] px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                            className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
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

                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-sm font-semibold text-[#374151]">
                            Link
                          </label>

                          <input
                            type="url"
                            inputMode="url"
                            value={link.url}
                            disabled={loading || uploading}
                            onChange={(e) =>
                              handleExtraLinkChange(idx, "url", e.target.value)
                            }
                            placeholder="https://youtube.com/@ada_hub"
                            className="w-full min-h-[48px] bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm md:text-base text-[#111827] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addExtraLink}
                  disabled={loading || uploading}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 border-2 border-[#22C55E] bg-green-50 hover:bg-[#22C55E] text-[#15803D] hover:text-white rounded-xl px-4 py-3 text-sm md:text-base font-bold transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">＋</span>
                  Add Another Link
                </button>
              </div>
            </div>
            {/* SECTION 4: FEATURED PRODUCT */}
            {/* SECTION: FEATURED PRODUCT */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-6 md:p-8 space-y-6 shadow-sm">
              {/* Section Header */}
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
                  Featured Product
                </h2>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Showcase one of your best products on your storefront.
                </p>
              </div>

              {/* Product Information */}
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

              {/* PRODUCT IMAGE PREVIEW */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#374151]">
                    Product Image
                  </label>

                  <p className="text-xs text-[#6B7280] mt-1">
                    Use a clear square or portrait product photo • Maximum 5MB
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch">
                  {/* Image Preview */}
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-3">
                      Product Preview
                    </p>

                    {imageFile && imagePreviewUrl ? (
                      <div className="space-y-3">
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-[#E5E7EB]">
                          <img
                            src={imagePreviewUrl || ""}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#111827] truncate">
                            {formData.product_name || "Your Product Name"}
                          </p>

                          <p className="text-base font-bold text-[#15803D] mt-1">
                            {formData.product_price
                              ? `₦${Number(
                                  formData.product_price.replace(/[^0-9]/g, ""),
                                ).toLocaleString()}`
                              : "Price not added"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center text-center px-5">
                        <Package
                          className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400"
                          strokeWidth={1.5}
                        />

                        <p className="text-sm font-semibold text-[#374151] mt-3">
                          Your product preview will appear here
                        </p>

                        <p className="text-xs text-[#9CA3AF] mt-1">
                          Select a product image to preview it.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upload Area */}
                  <label className="group flex flex-col items-center justify-center min-h-[260px] border-2 border-dashed border-[#D1D5DB] rounded-2xl bg-[#F9FAFB] hover:bg-green-50/50 hover:border-[#22C55E] transition-all cursor-pointer px-5 py-8 text-center">
                    <p className="text-sm md:text-base font-bold text-[#111827]">
                      {imageFile
                        ? "Change Product Image"
                        : "Upload Product Image"}
                    </p>

                    <p className="text-xs md:text-sm text-[#6B7280] mt-1">
                      JPG, PNG or WEBP
                    </p>

                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Maximum file size: 5MB
                    </p>

                    {imageFile && (
                      <div className="mt-5 max-w-full px-4 py-2 bg-green-100 text-[#15803D] rounded-xl text-xs md:text-sm font-medium">
                        <p className="truncate">✓ {imageFile.name}</p>
                      </div>
                    )}

                    <div className="mt-5 min-h-[46px] bg-white border border-[#D1D5DB] group-hover:border-[#22C55E] rounded-xl px-5 py-3 text-sm font-semibold text-[#374151] group-hover:text-[#15803D] transition-all">
                      {imageFile
                        ? "Choose Another Image"
                        : "Select Product Image"}
                    </div>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={loading || uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          setImageFile(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
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
