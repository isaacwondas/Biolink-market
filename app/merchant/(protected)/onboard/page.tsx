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

  const [currentStep, setCurrentStep] = useState(1);

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
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");

  const [usernameMessage, setUsernameMessage] = useState("");
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

    // LIVE PRODUCT PRICE FORMATTING
    if (name === "product_price") {
      const numericValue = value.replace(/[^0-9]/g, "");

      const formattedValue = numericValue
        ? Number(numericValue).toLocaleString("en-NG")
        : "";

      setFormData((prev) => ({
        ...prev,
        product_price: formattedValue,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================================
  // ONBOARDING STEP NAVIGATION
  // =============================================

  const handleNextStep = () => {
    setMessage(null);

    // STEP 1: STORE DETAILS
    if (currentStep === 1) {
      if (!formData.username.trim() || !formData.business_name.trim()) {
        setMessage({
          type: "error",
          text: "Please enter your store handle and business name.",
        });
        return;
      }

      if (
        usernameStatus === "checking" ||
        usernameStatus === "taken" ||
        usernameStatus === "invalid"
      ) {
        setMessage({
          type: "error",
          text: "Please choose an available store handle.",
        });
        return;
      }
    }

    // STEP 2: WHATSAPP
    if (currentStep === 2) {
      const phone = formData.whatsapp.replace(/\D/g, "");

      if (phone.length < 10 || phone.length > 15) {
        setMessage({
          type: "error",
          text: "Please enter a valid WhatsApp number.",
        });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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

  // =============================================
  // LIVE STORE HANDLE AVAILABILITY CHECK
  // =============================================

  useEffect(() => {
    const rawUsername = formData.username.trim().toLowerCase();

    if (!rawUsername) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }

    const usernameSlug = rawUsername
      .replace(/^@/, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_-]/g, "");

    if (usernameSlug.length < 3) {
      setUsernameStatus("invalid");
      setUsernameMessage("Store handle must be at least 3 characters.");
      return;
    }

    if (usernameSlug.length > 30) {
      setUsernameStatus("invalid");
      setUsernameMessage("Store handle must not exceed 30 characters.");
      return;
    }

    let cancelled = false;

    setUsernameStatus("checking");
    setUsernameMessage("Checking availability...");

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("vendors")
          .select("id, email")
          .eq("username", usernameSlug)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          setUsernameStatus("idle");
          setUsernameMessage("Unable to check handle right now.");
          return;
        }

        const belongsToCurrentUser =
          data?.email?.toLowerCase() === userEmail?.toLowerCase();

        if (!data || belongsToCurrentUser) {
          setUsernameStatus("available");
          setUsernameMessage("Store handle is available.");
        } else {
          setUsernameStatus("taken");
          setUsernameMessage("Store handle is already taken.");
        }
      } catch {
        if (cancelled) return;

        setUsernameStatus("idle");
        setUsernameMessage("Unable to check handle right now.");
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formData.username, userEmail, supabase]);

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
      <main className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#15803D]">
            Welcome to BioLink Market 👋
          </h1>

          <p className="text-sm text-[#6B7280] mt-2">
            Set up your store in a few quick steps.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      currentStep >= step
                        ? "bg-[#22C55E] text-white"
                        : "bg-white border border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step ? "✓" : step}
                  </div>

                  <span
                    className={`text-[11px] font-semibold ${
                      currentStep >= step ? "text-[#15803D]" : "text-gray-400"
                    }`}
                  >
                    {step === 1 ? "Store" : step === 2 ? "WhatsApp" : "Payment"}
                  </span>
                </div>

                {index < 2 && (
                  <div
                    className={`h-1 flex-1 mx-3 rounded-full ${
                      currentStep > step ? "bg-[#22C55E]" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading || uploading}>
            {message && (
              <div
                role="alert"
                className={`mb-5 p-4 rounded-2xl text-sm border font-medium ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-[#15803D]"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-7 shadow-sm">
              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                      Step 1 of 3
                    </p>

                    <h2 className="text-2xl font-black mt-1">
                      Create your store
                    </h2>

                    <p className="text-sm text-[#6B7280] mt-1">
                      Choose how customers will recognize your business.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151]">
                      Store Handle
                    </label>

                    <div
                      className={`flex min-h-[52px] border rounded-xl overflow-hidden transition-all ${
                        usernameStatus === "available"
                          ? "border-[#22C55E] ring-2 ring-[#22C55E]/20"
                          : usernameStatus === "taken" ||
                              usernameStatus === "invalid"
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-[#D1D5DB]"
                      }`}
                    >
                      <span className="hidden sm:flex items-center px-3 bg-gray-50 border-r border-gray-200 text-xs text-gray-500">
                        biolinkmarket.com/
                      </span>

                      <span className="sm:hidden flex items-center px-3 bg-gray-50 border-r border-gray-200 text-gray-500">
                        /
                      </span>

                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="adahub"
                        autoCapitalize="none"
                        autoCorrect="off"
                        className="flex-1 min-w-0 px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>

                    {usernameMessage && (
                      <p
                        className={`text-xs font-medium ${
                          usernameStatus === "available"
                            ? "text-[#15803D]"
                            : usernameStatus === "checking"
                              ? "text-gray-500"
                              : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151]">
                      Business Name
                    </label>

                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="Ada Fashion Hub"
                      className="w-full min-h-[52px] border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={usernameStatus === "checking"}
                    className="w-full min-h-[52px] bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 text-white font-bold rounded-xl transition-all"
                  >
                    {usernameStatus === "checking"
                      ? "Checking handle..."
                      : "Continue →"}
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                      Step 2 of 3
                    </p>

                    <h2 className="text-2xl font-black mt-1">
                      Connect WhatsApp
                    </h2>

                    <p className="text-sm text-[#6B7280] mt-1">
                      Customers will use this number to contact you.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151]">
                      WhatsApp Number
                    </label>

                    <input
                      type="tel"
                      inputMode="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="08030000000"
                      className="w-full min-h-[52px] border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                    />

                    <p className="text-xs text-[#6B7280]">
                      You can enter your normal Nigerian number.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="min-h-[52px] border border-gray-200 text-gray-600 font-semibold rounded-xl"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="min-h-[52px] bg-[#22C55E] hover:bg-[#15803D] text-white font-bold rounded-xl"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                      Step 3 of 3
                    </p>

                    <h2 className="text-2xl font-black mt-1">
                      Where should customers pay?
                    </h2>

                    <p className="text-sm text-[#6B7280] mt-1">
                      Add one bank account to receive customer transfers.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#374151]">
                        Bank Name
                      </label>

                      <select
                        value={banks[0]?.bank_name || ""}
                        onChange={(e) =>
                          handleBankChange(0, "bank_name", e.target.value)
                        }
                        className="w-full min-h-[52px] border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#22C55E]"
                      >
                        {NIGERIAN_BANKS.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#374151]">
                        Account Number
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={banks[0]?.account_number || ""}
                        onChange={(e) =>
                          handleBankChange(
                            0,
                            "account_number",
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder="0123456789"
                        className="w-full min-h-[52px] border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#374151]">
                        Account Name
                      </label>

                      <input
                        type="text"
                        value={banks[0]?.account_name || ""}
                        onChange={(e) =>
                          handleBankChange(0, "account_name", e.target.value)
                        }
                        placeholder="Ada Fashion Hub"
                        className="w-full min-h-[52px] border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="w-full min-h-[48px] border border-gray-200 text-gray-600 font-semibold rounded-xl"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      uploading ||
                      !userEmail ||
                      !banks[0]?.account_number.trim() ||
                      !banks[0]?.account_name.trim()
                    }
                    className="w-full min-h-[54px] bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.99]"
                  >
                    {!userEmail
                      ? "Loading session..."
                      : loading
                        ? "Launching your store..."
                        : "🚀 Launch My Store"}
                  </button>
                </div>
              )}
            </div>
          </fieldset>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          You can add products, logo, bio and social links later from your
          dashboard.
        </p>
      </main>
    </div>
  );
}
