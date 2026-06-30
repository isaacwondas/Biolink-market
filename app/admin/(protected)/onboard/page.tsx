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

  // Core Business Metadata
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    tagline: "", // e.g., "Quality Ankara & Ready-to-wear"
    location: "", // e.g., "Lagos"
    whatsapp: "",
    instagram: "",
    tiktok: "",
    facebook: "",
    product_name: "",
    product_price: "",
    description: "",
  });

  // Dynamic Multi-Bank state to fill the side-by-side settlement grid
  const [banks, setBanks] = useState<BankAccount[]>([
    { bank_name: "OPay", account_number: "", account_name: "" },
  ]);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setFormData((prev) => ({
          ...prev,
          name: session.user.email!.split("@")[0],
        }));
      }
    };
    checkSession();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle updates inside the multi-bank nested array matrix
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formData.username || !formData.name || !formData.product_name) {
      setMessage({
        type: "error",
        text: "Please fill out all required fields.",
      });
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = "";
      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${formData.username.trim().toLowerCase()}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
        setUploading(false);
      }

      const formattedPrice = formData.product_price.trim()
        ? formData.product_price.replace(/[^0-9]/g, "")
        : null;
      const targetIdentifier =
        userEmail || formData.username.trim().toLowerCase();

      const { error } = await supabase
        .from("vendors")
        .update({
          username: formData.username.trim().toLowerCase(),
          name: formData.name,
          tagline: formData.tagline,
          location: formData.location,
          whatsapp: formData.whatsapp,
          instagram_handle: formData.instagram,
          tiktok: formData.tiktok,
          facebook: formData.facebook,
          bank_settlement_nodes: banks, // Saved cleanly as jsonb array
          product_name: formData.product_name,
          product_price: formattedPrice,
          product_image: finalImageUrl,
          description: formData.description,
        })
        .eq(userEmail ? "email" : "username", targetIdentifier.toLowerCase());

      if (error) throw error;

      setMessage({
        type: "success",
        text: `🎉 Setup Complete! Your premium storefront "biomarket.com/${formData.username.toLowerCase()}" is now fully configured and live. Redirecting to your dashboard...`,
      });

      // 🔄 Automatically transition the user to their dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

      setImageFile(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex justify-center p-4 md:p-8 antialiased">
      <div className="w-full max-w-2xl my-auto space-y-6 py-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Storefront Control Setup
          </h1>
          <p className="text-xs text-neutral-500">
            Configure the parameters that inject directly into your single-page
            layout templates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {message && (
            <div
              className={`p-4 rounded-xl text-xs border font-medium ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* SECTION 1: Brand & Layout Copy Context */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#044766]">
              1. Brand Identity Header
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Store Path Handle*
                </label>
                <div className="flex rounded-xl bg-neutral-50 border border-neutral-200 focus-within:border-[#044766] focus-within:ring-1 focus-within:ring-[#044766] transition-all overflow-hidden">
                  <span className="text-neutral-400 pl-3 py-2.5 text-xs select-none bg-neutral-100 pr-2 border-r border-neutral-200 flex items-center">
                    biomarket.com/
                  </span>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="ada_hub"
                    className="bg-transparent text-xs w-full p-2.5 text-neutral-800 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Brand Display Title*
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ada Fashion Hub"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766] focus:ring-1 focus:ring-[#044766] transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Tagline / Niche Focus Context
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Quality Ankara & Ready-to-wear"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766] focus:ring-1 focus:ring-[#044766] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Regional Location Tag
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Lagos"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766] focus:ring-1 focus:ring-[#044766] transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Dynamic Multi-Bank Array Matrix */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#044766]">
                2. Layout Settlement Grid Nodes (Max 3)
              </h2>
              {banks.length < 3 && (
                <button
                  type="button"
                  onClick={addBankSlot}
                  className="text-[11px] text-[#044766] hover:underline font-bold"
                >
                  + Add Bank Option
                </button>
              )}
            </div>

            <div className="space-y-4 divide-y divide-neutral-100">
              {banks.map((bank, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${
                    index > 0 ? "pt-4" : ""
                  }`}
                >
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 font-medium">
                      Bank Provider #{index + 1}
                    </label>
                    <select
                      value={bank.bank_name}
                      onChange={(e) =>
                        handleBankChange(index, "bank_name", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
                    >
                      {popularBanks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 font-medium">
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
                      placeholder="04725675101"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766] font-mono"
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-[11px] text-neutral-400 font-medium">
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
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
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

          {/* SECTION 3: Social & Communications Integration */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#044766]">
              3. Connected Social Matrix
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  WhatsApp Hotlink Node*
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="2348030000000"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Instagram Path
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/ada_hub"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  TikTok Profile Link
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/@ada_hub"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Facebook Page Link
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/adahub"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Showcased Items Generation */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#044766]">
              4. Premium Item Showcase Setup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Featured Product Name*
                </label>
                <input
                  type="text"
                  name="product_name"
                  required
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="Ankara Gown Style Alpha"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Listing Price (₦)
                </label>
                <input
                  type="text"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleChange}
                  placeholder="12500"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#044766]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-500 font-medium uppercase">
                Product Display Asset
              </label>
              <input
                id="product_image_file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2 text-xs text-neutral-600 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-200 file:text-neutral-700 hover:file:bg-neutral-300"
              />
            </div>
          </div>

          {/* Primary Submit Action */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-[#044766] hover:bg-[#03354c] text-white font-semibold py-3 px-6 rounded-xl text-center transition-all shadow-md uppercase tracking-wider text-xs disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            {uploading
              ? "Uploading media files..."
              : loading
                ? "Updating configuration profiles..."
                : "🚀 Save Parameters & Launch Live Grid"}
          </button>
        </form>
      </div>
    </div>
  );
}
