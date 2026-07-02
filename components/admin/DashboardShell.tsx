"use client";

import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import AnalyticsGrid from "@/components/admin/AnalyticsGrid";
import { TransactionApprovalCard } from "@/components/admin/TransactionApprovalCard";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "overview" | "profile" | "banks" | "products" | "social";

interface Bank {
  id?: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

interface Product {
  id?: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
}

// ─── Sidebar Nav Items ────────────────────────────────────────────────────────

const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "banks", label: "Banks", icon: "🏦" },
  { id: "products", label: "Products", icon: "📦" },
  { id: "social", label: "Social", icon: "🔗" },
] as const;

const POPULAR_BANKS = [
  "OPay",
  "PalmPay",
  "Moniepoint",
  "Zenith Bank",
  "GTBank",
  "Access Bank",
  "UBA",
  "Kuda Bank",
];

// ─── Upload helper ────────────────────────────────────────────────────────────

async function uploadImage(file: File, folder: string, prefix: string) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${prefix}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);
  if (error) throw error;
  return supabase.storage.from("product-images").getPublicUrl(path).data
    .publicUrl;
}

// ─── Feedback pill ────────────────────────────────────────────────────────────

function Toast({
  msg,
}: {
  msg: { type: "success" | "error"; text: string } | null;
}) {
  if (!msg) return null;
  return (
    <div
      className={`px-4 py-3 rounded-xl text-xs font-medium border ${
        msg.type === "success"
          ? "bg-green-500/10 border-green-500/20 text-green-400"
          : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}
    >
      {msg.text}
    </div>
  );
}

// ─── Input primitive ─────────────────────────────────────────────────────────

function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-neutral-500 font-medium uppercase">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const updates: any = { ...form };
      if (avatarFile)
        updates.avatar_image = await uploadImage(
          avatarFile,
          "avatars",
          form.username,
        );
      if (bannerFile)
        updates.banner_image = await uploadImage(
          bannerFile,
          "banners",
          form.username,
        );

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
        <h2 className="text-base font-bold text-neutral-200">
          Profile Settings
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Changes reflect instantly on your storefront.
        </p>
      </div>

      <Toast msg={msg} />

      {/* Avatar & Banner previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] text-neutral-500 font-medium uppercase">
            Profile Avatar
          </p>
          {vendor.avatar_image && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-neutral-700">
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
            className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-300"
          />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] text-neutral-500 font-medium uppercase">
            Banner Image
          </p>
          {vendor.banner_image && (
            <div className="relative w-full h-16 rounded-xl overflow-hidden border border-neutral-700">
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
            className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-300"
          />
        </div>
      </div>

      {/* Store URL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
        <p className="text-[11px] text-neutral-500 font-medium uppercase">
          Your Store URL
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#22C55E] font-mono font-bold">
            biomarket.com/{vendor.username}
          </span>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `https://biomarket.com/${vendor.username}`,
              )
            }
            className="text-[10px] text-neutral-500 hover:text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded-lg transition-colors"
          >
            Copy
          </button>
          <a
            href={`/${vendor.username}`}
            target="_blank"
            className="text-[10px] text-neutral-500 hover:text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded-lg transition-colors"
          >
            Preview {"↗"}
          </a>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
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
        className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: BANKS
// ═══════════════════════════════════════════════════════════════════════════════

function BanksTab({ vendor }: { vendor: any }) {
  const [banks, setBanks] = useState<Bank[]>(
    vendor.vendor_banks?.length > 0
      ? vendor.vendor_banks
      : [{ bank_name: "OPay", account_number: "", account_name: "" }],
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleBankChange = (idx: number, field: keyof Bank, value: string) => {
    const updated = [...banks];
    updated[idx] = { ...updated[idx], [field]: value };
    setBanks(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      // Delete existing and re-insert
      await supabase.from("vendor_banks").delete().eq("vendor_id", vendor.id);
      const rows = banks
        .filter((b) => b.account_number.trim() !== "")
        .map((b) => ({
          vendor_id: vendor.id,
          bank_name: b.bank_name,
          account_number: b.account_number,
          account_name: b.account_name,
        }));
      if (rows.length > 0) {
        const { error } = await supabase.from("vendor_banks").insert(rows);
        if (error) throw error;
      }
      setMsg({ type: "success", text: "Bank details updated!" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-200">Bank Details</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Up to 3 payment accounts shown on your storefront.
          </p>
        </div>
        {banks.length < 3 && (
          <button
            onClick={() =>
              setBanks([
                ...banks,
                { bank_name: "OPay", account_number: "", account_name: "" },
              ])
            }
            className="text-xs text-[#22C55E] border border-[#22C55E]/30 px-3 py-1.5 rounded-lg hover:bg-[#22C55E]/10 transition-colors"
          >
            + Add Bank
          </button>
        )}
      </div>

      <Toast msg={msg} />

      <div className="space-y-4">
        {banks.map((bank, idx) => (
          <div
            key={idx}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-medium uppercase">
                Bank #{idx + 1}
              </span>
              {banks.length > 1 && (
                <button
                  onClick={() => setBanks(banks.filter((_, i) => i !== idx))}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Bank
                </label>
                <select
                  value={bank.bank_name}
                  onChange={(e) =>
                    handleBankChange(idx, "bank_name", e.target.value)
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E]"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bank.account_number}
                  onChange={(e) =>
                    handleBankChange(idx, "account_number", e.target.value)
                  }
                  placeholder="0472567510"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-[#22C55E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-500 font-medium uppercase">
                  Account Name
                </label>
                <input
                  type="text"
                  value={bank.account_name}
                  onChange={(e) =>
                    handleBankChange(idx, "account_name", e.target.value)
                  }
                  placeholder="Ada Fabrics Ltd"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
      >
        {loading ? "Saving..." : "Save Bank Details"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

function ProductsTab({ vendor }: { vendor: any }) {
  const [products, setProducts] = useState<Product[]>(
    vendor.vendor_products?.length > 0
      ? vendor.vendor_products
      : vendor.product_name
        ? [
            {
              name: vendor.product_name,
              price: vendor.product_price || 0,
              image_url: vendor.product_image,
            },
          ]
        : [],
  );
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      setMsg({ type: "error", text: "Product name is required." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "products", vendor.username);
      }
      const row = {
        vendor_id: vendor.id,
        name: newProduct.name.trim(),
        price: newProduct.price
          ? Number(newProduct.price.replace(/[^0-9]/g, ""))
          : 0,
        description: newProduct.description,
        image_url: imageUrl || undefined,
      };
      const { data, error } = await supabase
        .from("vendor_products")
        .insert([row])
        .select()
        .single();
      if (error) throw error;
      setProducts((prev) => [...prev, data]);
      setNewProduct({ name: "", price: "", description: "" });
      setImageFile(null);
      setMsg({
        type: "success",
        text: "Product added! It's now live on your storefront.",
      });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase
      .from("vendor_products")
      .delete()
      .eq("id", id);
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-neutral-200">
          Product Listings
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Products appear in a grid on your public storefront.
        </p>
      </div>

      <Toast msg={msg} />

      {/* Add new product */}
      <div className="bg-neutral-900 border border-[#22C55E]/20 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
          Add New Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] text-neutral-500 font-medium uppercase">
              Product Name*
            </label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Ankara Gown Style Alpha"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-neutral-500 font-medium uppercase">
              Price (₦)
            </label>
            <input
              type="text"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="12500"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E]"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-neutral-500 font-medium uppercase">
            Description
          </label>
          <input
            type="text"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Short product description"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#22C55E]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-neutral-500 font-medium uppercase">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
            className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-300"
          />
        </div>
        <button
          onClick={handleAddProduct}
          disabled={loading}
          className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
        >
          {loading ? "Uploading..." : "+ Add Product"}
        </button>
      </div>

      {/* Existing products */}
      {products.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Live Products ({products.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((product, idx) => (
              <div
                key={product.id || idx}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex gap-3 p-3"
              >
                {product.image_url && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-neutral-200 truncate">
                    {product.name}
                  </p>
                  {product.price > 0 && (
                    <p className="text-xs font-black text-[#22C55E]">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                  )}
                  {product.description && (
                    <p className="text-[10px] text-neutral-500 line-clamp-1">
                      {product.description}
                    </p>
                  )}
                </div>
                {product.id && (
                  <button
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="text-red-500 hover:text-red-400 text-xs shrink-0 self-start"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="border border-dashed border-neutral-800 rounded-2xl p-8 text-center">
          <p className="text-xs text-neutral-500">
            No products yet. Add one above.
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SOCIAL
// ═══════════════════════════════════════════════════════════════════════════════

function SocialTab({ vendor }: { vendor: any }) {
  const [form, setForm] = useState({
    whatsapp: vendor.whatsapp || "",
    instagram_handle: vendor.instagram_handle || "",
    tiktok_handle: vendor.tiktok_handle || "",
    facebook_handle: vendor.facebook_handle || "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase
        .from("vendors")
        .update(form)
        .eq("id", vendor.id);
      if (error) throw error;
      setMsg({ type: "success", text: "Social links updated!" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-neutral-200">
          Social & Contact
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Links appear as buttons on your public storefront.
        </p>
      </div>

      <Toast msg={msg} />

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="WhatsApp Number"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="2348030000000"
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

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
      >
        {loading ? "Saving..." : "Save Social Links"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: OVERVIEW (existing analytics + receipts)
// ═══════════════════════════════════════════════════════════════════════════════

function OverviewTab({
  vendor,
  structuralMetrics,
  timelineData,
  receiptsQueue,
  onTransactionUpdate,
}: {
  vendor: any;
  structuralMetrics: any;
  timelineData: any[];
  receiptsQueue: any[];
  onTransactionUpdate: any;
}) {
  const maxClickDayValue =
    timelineData.length > 0
      ? Math.max(...timelineData.map((d: any) => Number(d.total_clicks)))
      : 10;

  const merchantDisplayName = vendor.business_name || vendor.name || "Merchant";

  return (
    <div className="space-y-6">
      <AnalyticsGrid
        metrics={structuralMetrics}
        businessName={merchantDisplayName}
      />

      {/* Receipt Ledger */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-800/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200">
                Receipt Verification
              </h3>
              <span className="text-[10px] bg-[#044766]/20 text-sky-400 font-bold px-2 py-0.5 rounded border border-[#044766]/30 uppercase">
                Core Ops
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Audit incoming customer transfers to authorise orders.
            </p>
          </div>
          <div className="flex gap-2 text-[11px] font-mono">
            <span className="text-amber-400 bg-amber-500/5 px-2 py-1 rounded-md border border-amber-500/10">
              Awaiting{" "}
              {
                receiptsQueue.filter(
                  (r) =>
                    r.status === "pending" && r.payment_status !== "fully_paid",
                ).length
              }{" "}
              Receipts
            </span>
            <span className="text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
              ✓{" "}
              {
                receiptsQueue.filter(
                  (r) =>
                    r.status === "approved" ||
                    r.payment_status === "fully_paid",
                ).length
              }{" "}
              Cleared
            </span>
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {receiptsQueue.map((receipt) => (
            <div
              key={receipt.id}
              className={`bg-neutral-950 border p-4 rounded-xl flex flex-col gap-4 transition-all hover:border-neutral-700 ${
                receipt.status === "pending"
                  ? "border-amber-500/20"
                  : "border-neutral-800/70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                    <Image
                      src={receipt.receipt_image_url}
                      alt="Receipt"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-neutral-200 truncate">
                        {receipt.customer_name || "Unknown"}
                      </p>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
                        #{receipt.order_reference || "NO-REF"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 truncate font-mono">
                      {receipt.customer_email}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col justify-between sm:items-end items-center shrink-0">
                  <p className="text-sm font-black text-emerald-400">
                    ₦{Number(receipt.amount_paid).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-neutral-500">
                      {new Date(receipt.created_at).toLocaleDateString(
                        "en-NG",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        receipt.payment_status === "fully_paid" ||
                        receipt.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : receipt.payment_status === "partially_paid"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-neutral-500/10 text-neutral-400 border border-neutral-800"
                      }`}
                    >
                      {receipt.payment_status === "fully_paid"
                        ? "Fully Paid"
                        : receipt.payment_status === "partially_paid"
                          ? "Partial"
                          : receipt.status}
                    </span>
                  </div>
                </div>
              </div>
              {receipt.payment_status !== "fully_paid" &&
                receipt.status !== "approved" && (
                  <div className="border-t border-neutral-800/60 pt-3 text-neutral-900">
                    <TransactionApprovalCard
                      transaction={{
                        id: receipt.id,
                        total_order_amount:
                          receipt.total_order_amount ||
                          receipt.amount_paid ||
                          0,
                        amount_paid: receipt.amount_paid || 0,
                        balance_due: receipt.balance_due || 0,
                        payment_status: receipt.payment_status || "unpaid",
                      }}
                      onConfirm={onTransactionUpdate}
                    />
                  </div>
                )}
            </div>
          ))}
          {receiptsQueue.length === 0 && (
            <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
              <span className="text-2xl block mb-2">🧾</span>
              <p className="text-xs text-neutral-500">
                No payment receipts yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
          Outbound Traffic — Last 7 Days
        </h3>
        <div className="grid grid-cols-7 gap-2 items-end h-28 border-b border-neutral-800/60 px-2">
          {timelineData.map((day: any) => {
            const pct =
              maxClickDayValue > 0
                ? (Number(day.total_clicks) / maxClickDayValue) * 100
                : 0;
            return (
              <div
                key={day.period_start}
                className="flex flex-col items-center h-full justify-end space-y-1"
              >
                <div
                  className="w-full rounded-t relative h-full"
                  style={{ maxHeight: `${Math.max(pct, 4)}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-[#22C55E]/40 rounded-t-sm h-full" />
                </div>
                <span className="text-[9px] text-neutral-600 truncate">
                  {new Date(day.period_start).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SHELL
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardShell({
  vendor,
  timelineData,
  receiptsQueue,
  structuralMetrics,
  onTransactionUpdate,
}: {
  vendor: any;
  timelineData: any[];
  receiptsQueue: any[];
  structuralMetrics: any;
  onTransactionUpdate: any;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const merchantName = vendor.business_name || vendor.name || "Merchant";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex antialiased">
      {/* ── Sidebar ── */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}
      >
        {/* Logo / store identity */}
        <div className="p-5 border-b border-neutral-800 space-y-1">
          <div className="flex items-center gap-2">
            {vendor.avatar_image && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-700 shrink-0">
                <Image
                  src={vendor.avatar_image}
                  alt="avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-200 truncate">
                {merchantName}
              </p>
              <p className="text-[10px] text-[#22C55E] font-mono truncate">
                /{vendor.username}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === item.id
                  ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/20"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-neutral-800 space-y-2">
          <a
            href={`/${vendor.username}`}
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-all"
          >
            <span>↗</span>
            <span>View Storefront</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>⎋</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-neutral-400 hover:text-neutral-200"
          >
            ☰
          </button>
          <span className="text-xs font-bold text-neutral-300">
            {NAV.find((n) => n.id === activeTab)?.label}
          </span>
          <span className="text-[10px] text-[#22C55E] font-mono">
            /{vendor.username}
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {activeTab === "overview" && (
              <OverviewTab
                vendor={vendor}
                structuralMetrics={structuralMetrics}
                timelineData={timelineData}
                receiptsQueue={receiptsQueue}
                onTransactionUpdate={onTransactionUpdate}
              />
            )}
            {activeTab === "profile" && <ProfileTab vendor={vendor} />}
            {activeTab === "banks" && <BanksTab vendor={vendor} />}
            {activeTab === "products" && <ProductsTab vendor={vendor} />}
            {activeTab === "social" && <SocialTab vendor={vendor} />}
          </div>
        </main>
      </div>
    </div>
  );
}
