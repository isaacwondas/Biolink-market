"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { supabase } from "@/app/lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  image_url?: string | null;
};

type OrderItem = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
};

export default function OrderProducts({
  products,
  vendorId,
  vendorEmail,
}: {
  products: Product[];
  vendorId: number;
  vendorEmail: string;
}) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderReview, setShowOrderReview] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const totalItems = orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const orderTotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const addToOrder = (product: Product) => {
    setOrderItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image_url || product.image || null,
          quantity: 1,
        },
      ];
    });
  };
  const createOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setOrderError("Please enter your name and WhatsApp number.");
      return;
    }

    if (orderItems.length === 0) {
      setOrderError("Your order is empty.");
      return;
    }

    setSavingOrder(true);
    setOrderError("");

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            vendor_id: vendorId,
            vendor_email: vendorEmail,
            buyer_name: customerName.trim(),
            buyer_phone: customerPhone.trim(),
            buyer_note: null,
            subtotal: orderTotal,
            delivery_fee: 0,
            total_amount: orderTotal,
            status: "pending",
          },
        ])
        .select("id")
        .single();

      if (orderError) {
        throw orderError;
      }

      const orderItemsPayload = orderItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsError) {
        throw itemsError;
      }

      console.log("ORDER CREATED:", order.id);

      setShowCustomerDetails(false);

      // Payment screen comes next
    } catch (error: any) {
      console.error("CREATE ORDER ERROR:", error);

      setOrderError(
        error?.message || "We could not create your order. Please try again.",
      );
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-32">
        {products.map((product) => {
          const productImage = product.image_url || product.image;

          return (
            <div
              key={product.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4"
            >
              {productImage && (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={productImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <h3 className="mt-3 font-semibold text-[#111827]">
                {product.name}
              </h3>

              <p className="mt-1 font-bold text-[#111827]">
                ₦{Number(product.price).toLocaleString()}
              </p>

              <button
                type="button"
                onClick={() => addToOrder(product)}
                className="mt-4 w-full h-10 border border-[#22C55E] rounded-2xl text-[#15803D] font-medium text-sm hover:bg-[#22C55E] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Order</span>
              </button>
            </div>
          );
        })}
      </div>

      {orderItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:w-full md:max-w-md md:-translate-x-1/2">
          <div className="bg-[#111827] text-white rounded-2xl p-3 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>

                <p className="text-base font-bold">
                  ₦{orderTotal.toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowOrderReview(true)}
                className="h-11 px-5 bg-[#22C55E] hover:bg-[#15803D] rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                Review Items
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          {showOrderReview &&
            createPortal(
              <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
                <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b border-[#E5E7EB] flex items-start justify-between gap-4 shrink-0">
                    <div>
                      <h2 className="text-lg font-bold text-[#111827]">
                        Review Order
                      </h2>

                      <p className="text-xs text-[#6B7280] mt-1">
                        {totalItems} {totalItems === 1 ? "item" : "items"}{" "}
                        selected
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowOrderReview(false)}
                      className="text-sm text-[#6B7280] hover:text-[#111827]"
                    >
                      Close
                    </button>
                  </div>

                  {/* Scrollable Items */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 border border-[#E5E7EB] rounded-2xl p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#111827] truncate">
                            {item.name}
                          </p>

                          <p className="text-sm text-[#15803D] font-bold mt-1">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setOrderItems((current) =>
                                current
                                  .map((product) =>
                                    product.id === item.id
                                      ? {
                                          ...product,
                                          quantity: product.quantity - 1,
                                        }
                                      : product,
                                  )
                                  .filter((product) => product.quantity > 0),
                              )
                            }
                            className="w-9 h-9 border border-[#E5E7EB] rounded-xl"
                          >
                            −
                          </button>

                          <span className="text-sm font-bold min-w-4 text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setOrderItems((current) =>
                                current.map((product) =>
                                  product.id === item.id
                                    ? {
                                        ...product,
                                        quantity: product.quantity + 1,
                                      }
                                    : product,
                                ),
                              )
                            }
                            className="w-9 h-9 border border-[#E5E7EB] rounded-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fixed Footer */}
                  <div className="p-5 border-t border-[#E5E7EB] bg-white shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">
                        Order Total
                      </span>

                      <span className="text-xl font-bold text-[#111827]">
                        ₦{orderTotal.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowOrderReview(false);
                        setShowCustomerDetails(true);
                      }}
                      className="w-full h-12 mt-5 bg-[#22C55E] hover:bg-[#15803D] text-white rounded-xl font-semibold transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>,
              document.body,
            )}
          {showCustomerDetails &&
            createPortal(
              <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
                <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b border-[#E5E7EB] flex items-start justify-between gap-4 shrink-0">
                    <div>
                      <h2 className="text-lg font-bold text-[#111827]">
                        Your Details
                      </h2>

                      <p className="text-xs text-[#6B7280] mt-1">
                        We'll use this to identify your order.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCustomerDetails(false)}
                      className="text-sm text-[#6B7280] hover:text-[#111827]"
                    >
                      Close
                    </button>
                  </div>

                  {/* Scrollable Form */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Chidi Adebayo"
                        className="w-full h-12 px-4 border border-[#D1D5DB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-2">
                        WhatsApp Number
                      </label>

                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="08012345678"
                        className="w-full h-12 px-4 border border-[#D1D5DB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>

                  {/* Fixed Footer */}
                  <div className="p-5 border-t border-[#E5E7EB] bg-white shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">
                        Order Total
                      </span>

                      <span className="text-xl font-bold text-[#111827]">
                        ₦{orderTotal.toLocaleString()}
                      </span>
                    </div>
                    {orderError && (
                      <p className="mt-3 text-xs text-red-600">{orderError}</p>
                    )}
                    <button
                      type="button"
                      disabled={
                        savingOrder ||
                        !customerName.trim() ||
                        !customerPhone.trim()
                      }
                      onClick={createOrder}
                      className="w-full h-12 mt-5 bg-[#22C55E] hover:bg-[#15803D] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                    >
                      {savingOrder
                        ? "Creating Order..."
                        : "Continue to Payment"}
                    </button>
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </div>
      )}
    </>
  );
}
