import React from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import StoreTrackerTrigger from "../../components/StoreTrackerTrigger";
import SocialButton from "../../components/SocialButton";
import ReceiptUploadForm from "../../components/ReceiptUploadForm";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Storefront({ params }: PageProps) {
  const resolvedParams = await params;
  const username = resolvedParams?.username;

  if (!username) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-800 flex items-center justify-center p-4">
        <p className="text-sm text-neutral-500 font-medium">
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
      <div className="min-h-screen bg-neutral-50 text-neutral-800 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-emerald-600">
            Store Not Found
          </h1>
          <p className="text-sm text-neutral-500">
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
          color: { dark: "#000000", light: "#ffffff" },
        });
      } catch (err) {
        console.error("QR Generation Failure:", err);
      }
      return { ...bank, qrCodeUrl };
    }),
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex justify-center antialiased selection:bg-[#044766] selection:text-white font-sans">
      <StoreTrackerTrigger vendorId={vendor.id} />

      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col pb-6">
        {/* Profile Header Banner */}
        <div className="relative w-full h-24 bg-neutral-200 overflow-hidden">
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
          {/* FIXED: Swapped invalid w-18 h-18 for standard Tailwind w-20 h-20 metrics */}
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm bg-neutral-100 relative overflow-hidden">
            <Image
              src={avatarImage}
              alt={merchantDisplayName}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-neutral-900 mt-1.5">
            {merchantDisplayName}
          </h1>
          <p className="text-xs font-medium text-neutral-500 px-4 mt-0.5 leading-tight">
            {bioText} |{" "}
            <span className="text-neutral-400 font-normal">{locationText}</span>
          </p>

          {/* WhatsApp Action Link Button */}
          <a
            href={`https://wa.me/${vendor.whatsapp || vendor.phone}?text=Hello%20${encodeURIComponent(vendor.name)},%20I%20am%20viewing%20your%20storefront%20and%20would%20like%20to%20make%20an%20enquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2.5 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold py-2.5 px-4 rounded-xl text-center shadow-sm transition-all flex items-center justify-center gap-2 tracking-wide text-sm active:scale-[0.99]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.02 14.058.993 11.438.993c-5.44 0-9.866 4.372-9.87 9.802 0 1.68.463 3.321 1.34 4.773L1.875 21.75l6.32-1.637l.452.24zM16.9 14.18c-.29-.145-1.716-.848-1.98-.942-.266-.096-.458-.145-.652.146-.194.29-.75.942-.918 1.133-.168.193-.338.217-.628.072-.29-.145-1.226-.452-2.335-1.441-.863-.77-1.446-1.72-1.615-2.012-.17-.29-.018-.447.127-.591.13-.13.29-.338.435-.507.145-.168.193-.29.29-.483.096-.193.048-.361-.024-.506-.072-.145-.652-1.57-.893-2.152-.235-.567-.474-.49-.652-.49-.17 0-.361-.012-.551-.012s-.5.072-.76.361c-.26.29-1 1-.1.144-.06.216.505.748.673.94 1.259 1.369 2.766 1.83 3.129 1.89s.616-.011.832-.26c.217-.24.94-1.085 1.193-1.447.253-.362.506-.29.796-.145z" />
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
        </div>

        <hr className="border-neutral-200 my-2.5 mx-4" />

        {/* Bank Matrix Rows */}
        <div className="px-4 space-y-1">
          <h3 className="text-sm font-bold text-neutral-800 tracking-tight">
            Bank Details
          </h3>
          {banksWithQrs.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
              {banksWithQrs.map((bank: any, idx: number) => (
                <div
                  key={bank.id || idx}
                  className="min-w-[135px] flex-1 bg-white border border-neutral-200/80 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs snap-start"
                >
                  <span className="text-[11px] font-bold text-neutral-700 truncate w-full">
                    {bank.bank_name}
                  </span>

                  <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-tight line-clamp-1 w-full mt-0.5">
                    {bank.account_name}
                  </span>

                  {bank.qrCodeUrl && (
                    <div className="p-0.5 bg-white rounded border border-neutral-100 my-1">
                      {/* eslint-disable-next-img-element */}
                      <img
                        src={bank.qrCodeUrl}
                        alt="Bank QR Code"
                        className="w-11 h-11"
                      />
                    </div>
                  )}

                  <span className="text-[10px] font-mono font-bold text-[#044766] bg-neutral-50 px-1 py-0.5 rounded border border-neutral-200 select-all tracking-tighter w-full block truncate">
                    {bank.account_number}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-xl p-3 text-center">
              <p className="text-[11px] text-neutral-400 font-medium">
                Direct Bank Transfers available upon request.
              </p>
            </div>
          )}
        </div>

        {/* Receipts Container Wrapper */}
        <div className="px-4 mt-1 text-neutral-900">
          <ReceiptUploadForm
            vendorEmail={vendor.email}
            vendorPhone={vendor.whatsapp || vendor.phone || "08000000000"}
            vendorBusinessName={merchantDisplayName}
          />
        </div>

        {/* Items Grid Layout Showcase */}
        <div className="px-4 mt-3 space-y-2">
          <h3 className="text-sm font-bold text-neutral-800 tracking-tight">
            My Items
          </h3>

          {vendor.vendor_products && vendor.vendor_products.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {vendor.vendor_products.map((product: any, idx: number) => (
                <div
                  key={product.id || idx}
                  className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs flex flex-col group"
                >
                  <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden">
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
                  <div className="p-2 flex flex-col justify-between flex-grow gap-0.5">
                    <h4 className="text-[11px] font-bold text-neutral-800 line-clamp-1 leading-tight">
                      {product.name}
                    </h4>
                    {product.price && Number(product.price) > 0 && (
                      <span className="text-xs font-black text-emerald-600 tracking-tight">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : vendor.product_name ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
                <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden">
                  <Image
                    src={
                      vendor.product_image ||
                      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=60"
                    }
                    alt={vendor.product_name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-2 flex flex-col justify-between flex-grow gap-0.5">
                  <h4 className="text-[11px] font-bold text-neutral-800 line-clamp-1 leading-tight">
                    {vendor.product_name}
                  </h4>
                  {vendor.product_price && Number(vendor.product_price) > 0 && (
                    <span className="text-xs font-black text-emerald-600 tracking-tight">
                      ₦{Number(vendor.product_price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-xl p-4 text-center">
              <p className="text-xs text-neutral-400 font-medium">
                No items uploaded yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
