import React, { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import StoreTrackerTrigger from "../../components/StoreTrackerTrigger";
import SocialButton from "../../components/SocialButton";
import { Plus, Globe, ArrowRight, Landmark, ExternalLink } from "lucide-react";
import { useOrder } from "@/app/context/OrderContext";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type OrderItem = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
};

const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

const totalItems = orderItems.reduce(
  (total: number, item: OrderItem) => total + item.quantity,
  0,
);

const orderTotal = orderItems.reduce(
  (total: number, item: OrderItem) => total + item.price * item.quantity,
  0,
);

const addToOrder = (product: any) => {
  console.log("ADD TO ORDER CLICKED:", product);

  setOrderItems((current: OrderItem[]) => {
    console.log("CURRENT ORDER:", current);

    const existing = current.find((item: OrderItem) => item.id === product.id);

    if (existing) {
      return current.map((item: OrderItem) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    }

    return [
      ...current,
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
      },
    ];
  });
};

export default async function Storefront({ params }: PageProps) {
  const resolvedParams = await params;
  const username = resolvedParams?.username;

  if (!username) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#111827] flex items-center justify-center p-4">
        <p className="text-sm text-[#374151] font-medium">
          Invalid Profile Request.
        </p>
      </div>
    );
  }

  // 1. INITIALIZE SECURE SERVER-SIDE SUPABASE CLIENT WITH COOKIE CONTEXT
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {},
        remove(name, options) {},
      },
    },
  );

  // 2. FETCH COMPLETE RELATION DATA VIA SECURE BACKEND CLIENT
  const { data: vendor, error } = await supabase
    .from("vendors")
    .select(
      `
      *,
      vendor_products (*),
      vendor_banks (*)
    `,
    )
    .eq("username", username.toLowerCase().trim())
    .maybeSingle();

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#111827] flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-[#15803D]">Store Not Found</h1>
          <p className="text-sm text-[#374151]">
            The store "{username}" does not exist yet.
          </p>
        </div>
      </div>
    );
  }

  // 3. ATOMIC BACKGROUND TELEMETRY ACTIONS (FIXED RACE CONDITION)
  await supabase.rpc("increment_views", { vendor_id: vendor.id });

  const merchantDisplayName = vendor.business_name || vendor.name;
  const locationText = vendor.location || "Lagos";
  const bioText = vendor.bio_tagline || "Quality Products & Services";

  const bannerImage =
    vendor.banner_image ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=60";
  const avatarImage =
    vendor.avatar_image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80";

  // 4. COMPILE BANKS LIST WITH FALLBACK
  let displayBanks = vendor.vendor_banks || [];
  if (displayBanks.length === 0 && vendor.bank_name && vendor.account_number) {
    displayBanks = [
      {
        id: "legacy-primary",
        bank_name: vendor.bank_name,
        account_number: vendor.account_number,
        account_name: vendor.account_name || merchantDisplayName,
      },
    ];
  }

  // 5. PRE-GENERATE INTERACTIVE QR CODES
  const banksWithQrs = await Promise.all(
    displayBanks.slice(0, 3).map(async (bank: any) => {
      let qrCodeUrl = "";
      try {
        const qrPayload = `Bank: ${bank.bank_name} | Acc: ${bank.account_number} | Name: ${bank.account_name}`;
        qrCodeUrl = await QRCode.toDataURL(qrPayload, {
          margin: 1,
          width: 160,
          color: { dark: "#111827", light: "#FFFFFF" },
        });
      } catch (err) {
        console.error("QR Generation Failure:", err);
      }
      return { ...bank, qrCodeUrl };
    }),
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111827] flex justify-center antialiased selection:bg-[#22C55E] selection:text-[#FFFFFF] font-sans">
      <StoreTrackerTrigger vendorId={vendor.id} />

      <div className="w-full max-w-md bg-[#FFFFFF] min-h-screen shadow-2xl relative flex flex-col pb-6">
        {/* Profile Header Banner */}
        <div className="relative w-full h-24 bg-[#E5E7EB] overflow-hidden">
          <Image
            src={bannerImage}
            alt="Merchant Banner"
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Profile Details Matrix */}
        <div className="px-4 text-center -mt-8 relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-4 border-[#FFFFFF] shadow-sm bg-[#FFFFFF] relative overflow-hidden">
            <Image
              src={avatarImage}
              alt={merchantDisplayName}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#15803D] mt-1.5">
            {merchantDisplayName}
          </h1>
          <p className="text-xs font-medium text-[#374151] px-4 mt-0.5 leading-tight">
            {bioText} |{" "}
            <span className="text-[#374151] font-normal">{locationText}</span>
          </p>

          {/* WhatsApp Action Link Button */}
          <a
            href={`https://wa.me/${vendor.whatsapp || vendor.phone}?text=Hello%20${encodeURIComponent(vendor.name)},%20I%20am%20viewing%20your%20storefront%20and%20would%20like%20to%20make%20an%20enquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2.5 bg-[#22C55E] hover:bg-[#15803D] text-white font-bold py-2.5 px-4 rounded-2xl text-center shadow-sm transition-all flex items-center justify-center gap-2.5 tracking-wide text-sm active:scale-[0.99]"
          >
            {/* Official WhatsApp Icon */}
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.031 0C5.397 0 0 5.397 0 12.031c0 2.128.553 4.197 1.604 6.012L.03 23.97l6.096-1.597c1.867 1.018 4.015 1.554 6.184 1.554 6.634 0 12.031-5.397 12.031-12.031S18.665 0 12.031 0zm5.666 14.654c-.266.758-1.536 1.488-2.115 1.583-.537.089-1.025.138-3.004-.666-2.529-1.03-4.137-3.766-4.259-3.931-.122-.165-1.004-1.332-1.004-2.539 0-1.207.534-1.791.764-2.019.23-.228.502-.284.673-.284.171 0 .341.006.491.006.143 0 .338-.052.532.428.199.486.677 1.652.735 1.772.059.12.096.26.02.417-.077.157-.115.253-.23.388-.115.135-.244.303-.357.417-.119.121-.247.253-.105.497.142.244.631 1.034 1.353 1.674.928.825 1.711 1.082 1.95 1.223.238.141.378.121.517-.038.139-.159.602-.701.764-.942.162-.241.325-.205.542-.123.217.082 1.373.648 1.607.766.234.118.39.176.448.273.059.097.059.563-.207 1.321z" />
            </svg>
            <span>Chat Now</span>
          </a>

          {/* Social Presence Space */}
          {((vendor.instagram_handle &&
            vendor.instagram_handle.trim() !== "") ||
            (vendor.facebook_handle && vendor.facebook_handle.trim() !== "") ||
            (vendor.tiktok_handle && vendor.tiktok_handle.trim() !== "")) && (
            <div className="flex items-center justify-center gap-5 mt-2.5 mb-0.5">
              {vendor.instagram_handle &&
                vendor.instagram_handle.trim() !== "" && (
                  <SocialButton
                    platform="Instagram"
                    handle={vendor.instagram_handle.trim()}
                    vendorId={Number(vendor.id)}
                  />
                )}
              {vendor.tiktok_handle && vendor.tiktok_handle.trim() !== "" && (
                <SocialButton
                  platform="TikTok"
                  handle={vendor.tiktok_handle.trim()}
                  vendorId={Number(vendor.id)}
                />
              )}
              {vendor.facebook_handle &&
                vendor.facebook_handle.trim() !== "" && (
                  <SocialButton
                    platform="Facebook"
                    handle={vendor.facebook_handle.trim()}
                    vendorId={Number(vendor.id)}
                  />
                )}
            </div>
          )}

          {/* Extra custom social links */}
          {/* EXTRA CUSTOM LINKS */}
          {vendor.social_links && vendor.social_links.length > 0 && (
            <div className="w-full mt-4 space-y-2">
              {vendor.social_links
                .filter((link: any) => link.url?.trim())
                .map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white border border-[#E5E7EB] hover:border-[#22C55E] hover:bg-green-50 text-[#111827] font-semibold px-3 py-2 rounded-2xl transition-all flex items-center justify-between gap-2 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-[#22C55E]/10 flex items-center justify-center text-xs">
                        <ExternalLink className="w-4 h-4" />
                      </div>

                      <span className="text-xs md:text-sm truncate">
                        {link.platform || "Business Link"}
                      </span>
                    </div>

                    <span className="text-[#15803D] text-lg shrink-0">→</span>
                  </a>
                ))}
            </div>
          )}

          {/* WEBSITE LINK */}
          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[50px] mt-3 bg-[#111827] hover:bg-black text-white font-bold px-4 py-3 rounded-2xl transition-all flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />

                <span className="text-sm">Visit Official Website</span>
              </div>

              <span className="text-lg">→</span>
            </a>
          )}

          {/* Close Profile Details Matrix */}
        </div>

        <hr className="border-[#E5E7EB] my-4 mx-4" />

        {/* BANK DETAILS */}
        <div className="px-4 mt-3 space-y-3">
          {/* Section Header */}
          <div>
            <h3 className="text-base font-bold text-[#111827]">
              <Landmark className="w-5 h-5" />
              <span>Bank Details</span>
            </h3>

            <p className="text-xs text-[#6B7280] mt-1">
              Use any of the accounts below to make a bank transfer.
            </p>
          </div>

          {banksWithQrs.length > 0 ? (
            <div className="space-y-3">
              {banksWithQrs.map((bank: any, idx: number) => (
                <div
                  key={bank.id || idx}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {/* Bank Information */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <p className="text-xs text-[#6B7280]">Bank</p>

                        <p className="text-sm font-bold text-[#111827]">
                          {bank.bank_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#6B7280]">Account Name</p>

                        <p className="text-sm font-semibold text-[#374151] break-words">
                          {bank.account_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#6B7280]">Account Number</p>

                        <p className="text-xl font-black font-mono tracking-wider text-[#15803D] select-all">
                          {bank.account_number}
                        </p>
                      </div>
                    </div>

                    {/* QR Code */}
                    {bank.qrCodeUrl && (
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2">
                          {/* eslint-disable-next-img-element */}
                          <img
                            src={bank.qrCodeUrl}
                            alt={`${bank.bank_name} payment QR code`}
                            className="w-20 h-20 sm:w-24 sm:h-24"
                          />
                        </div>

                        <span className="text-[10px] text-[#6B7280]">
                          Scan details
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Copy Account Number */}
                  <div className="mt-4 bg-green-50 border border-green-100 rounded-2xl px-3 py-2.5 text-center">
                    <p className="text-xs font-medium text-[#15803D]">
                      Tap and hold the account number above to copy
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-[#E5E7EB] rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">🏦</div>

              <p className="text-sm text-[#374151] font-medium">
                Direct bank transfer details are available upon request.
              </p>
            </div>
          )}
        </div>

        {/* Items Grid Layout Showcase */}
        <div className="px-4 mt-3 space-y-2">
          <h3 className="text-sm font-bold text-[#15803D] tracking-tight">
            My Items
          </h3>

          {vendor.vendor_products && vendor.vendor_products.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {vendor.vendor_products.map((product: any, idx: number) => (
                <div
                  key={product.id || idx}
                  className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col group"
                >
                  <div className="relative aspect-[4/3] w-full bg-[#FFFFFF] overflow-hidden">
                    <Image
                      src={
                        product.image_url ||
                        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=60"
                      }
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h4 className="text-sm font-semibold text-[#111827] line-clamp-2">
                      {product.name}
                    </h4>

                    {product.price && Number(product.price) > 0 && (
                      <p className="mt-2 text-lg font-bold text-[#111827]">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => addToOrder(product)}
                      className="mt-4 w-full h-10 border border-[#22C55E] rounded-2xl text-[#15803D] font-medium text-sm hover:bg-[#22C55E] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : vendor.product_name ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="relative aspect-[4/3] w-full bg-[#FFFFFF] overflow-hidden">
                  <Image
                    src={
                      vendor.product_image ||
                      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=60"
                    }
                    alt={vendor.product_name}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-2 flex flex-col justify-between flex-grow gap-0.5">
                  <h4 className="text-[11px] font-bold text-[#111827] line-clamp-1 leading-tight">
                    {vendor.product_name}
                  </h4>
                  {vendor.product_price && Number(vendor.product_price) > 0 && (
                    <span className="text-xs font-black text-[#22C55E] tracking-tight">
                      ₦{Number(vendor.product_price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-dashed border-[#E5E7EB] rounded-2xl p-4 text-center">
              <p className="text-xs text-[#374151] font-medium">
                No items uploaded yet.
              </p>
            </div>
          )}
        </div>
      </div>
      {orderItems.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white border border-gray-200 shadow-lg rounded-2xl px-5 py-4 flex items-center justify-between z-50">
          <div>
            <p className="text-xs text-gray-500">
              {orderItems.reduce((a, b) => a + b.quantity, 0)} items
            </p>

            <p className="font-bold text-[#111827]">
              ₦
              {orderItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString()}
            </p>
          </div>

          {orderItems.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:w-full md:max-w-md md:-translate-x-1/2">
              <div className="bg-[#111827] text-white rounded-2xl p-3 shadow-xl border border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>

                    <p className="text-base font-bold mt-0.5">
                      ₦{orderTotal.toLocaleString()}
                      console.log("ORDER ITEMS STATE:", orderItems);
                      console.log("TOTAL ITEMS:", totalItems);
                      console.log("ORDER TOTAL:", orderTotal);
                    </p>
                  </div>

                  <button
                    type="button"
                    className="h-11 px-5 bg-[#22C55E] hover:bg-[#15803D] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    Review Items
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <button className="bg-[#22C55E] text-white px-5 py-2 rounded-xl font-medium">
            Review Items
          </button>
        </div>
      )}
    </div>
  );
}
