"use client";

import { useState } from "react";
import Image from "next/image";

import { ArrowRight, Check, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { createOrder, uploadReceipt } from "./checkout/service";
import { useRouter } from "next/navigation";
import { StickyCart, ReviewOrderModal } from "@/components/storefront/checkout";
import type { Product, OrderItem, VendorBank } from "./checkout/types";

export default function OrderProducts({
  products,
  vendorId,
  vendorEmail,
  banks,
}: {
  products: Product[];
  vendorId: number;
  vendorEmail: string;
  banks: VendorBank[];
}) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderReview, setShowOrderReview] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrderTotal, setCreatedOrderTotal] = useState(0);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState("");

  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [submittedReference, setSubmittedReference] = useState("");

  // ARCHITECTURE FIX: Stable state to freeze checkout total when order is created

  const router = useRouter();

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

  const createOrderHandler = async () => {
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
      const order = await createOrder({
        vendorId,
        vendorEmail,
        buyerName: customerName,
        buyerPhone: customerPhone,
        total: orderTotal,
        items: orderItems,
      });

      setCreatedOrderId(order.id);
      setCreatedOrderTotal(orderTotal);

      setShowCustomerDetails(false);
      setShowPayment(true);
    } catch (error: any) {
      setOrderError(error?.message || "Unable to create order.");
    } finally {
      setSavingOrder(false);
    }
  };

  const uploadReceiptHandler = async () => {
    if (!receiptFile || !createdOrderId) {
      setReceiptError("Please select a receipt.");
      return;
    }

    setUploadingReceipt(true);

    try {
      const reference = await uploadReceipt({
        createdOrderId,
        vendorEmail,
        customerName,
        customerPhone,
        receiptFile,
        total: createdOrderTotal,
      });

      setSubmittedReference(reference);

      setShowReceiptUpload(false);

      setOrderItems([]);

      setReceiptFile(null);

      setShowOrderSuccess(true);
    } catch (error: any) {
      setReceiptError(error?.message || "Unable to upload receipt.");
    } finally {
      setUploadingReceipt(false);
    }
  };

  return (
    <>
      {/* Products Grid */}
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

      {/* Cart Container (Only mounts when there are products in the cart) */}
      <StickyCart
        totalItems={totalItems}
        orderTotal={orderTotal}
        onReview={() => setShowOrderReview(true)}
      />

      {/* Modal 1: Review Items */}
      <ReviewOrderModal
        open={showOrderReview}
        items={orderItems}
        totalItems={totalItems}
        orderTotal={orderTotal}
        onClose={() => setShowOrderReview(false)}
        onContinue={() => {
          setShowOrderReview(false);
          setShowCustomerDetails(true);
        }}
        onIncrease={(id) =>
          setOrderItems((current) =>
            current.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          )
        }
        onDecrease={(id) =>
          setOrderItems((current) =>
            current
              .map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
              )
              .filter((item) => item.quantity > 0),
          )
        }
      />
      {/* Modal 2: Customer Details */}
      {showCustomerDetails &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden">
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
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full h-12 px-4 border border-[#D1D5DB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-[#E5E7EB] bg-white shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Order Total</span>

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
                    savingOrder || !customerName.trim() || !customerPhone.trim()
                  }
                  onClick={createOrderHandler}
                  className="w-full h-12 mt-5 bg-[#22C55E] hover:bg-[#15803D] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                >
                  {savingOrder ? "Creating Order..." : "Continue to Payment"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Modal 3: Payment Details */}
      {showPayment &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-bold text-[#111827]">
                  Complete Payment
                </h2>

                <p className="text-xs text-[#6B7280] mt-1">
                  Transfer the exact order amount to the account below.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-[#6B7280]">Amount to Pay</p>

                  {/* ARCHITECTURE FIX: Use frozen createdOrderTotal state */}
                  <p className="text-3xl font-bold text-[#111827] mt-1">
                    ₦{createdOrderTotal.toLocaleString()}
                  </p>
                </div>

                {banks.length > 0 ? (
                  banks.map((bank) => (
                    <div
                      key={bank.id}
                      className="border border-[#E5E7EB] rounded-2xl p-4"
                    >
                      <p className="text-xs text-[#6B7280]">{bank.bank_name}</p>

                      <p className="text-xl font-bold text-[#111827] mt-2">
                        {bank.account_number}
                      </p>

                      {bank.account_name && (
                        <p className="text-sm text-[#374151] mt-1">
                          {bank.account_name}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-red-600">
                    This merchant has not added a payment account.
                  </p>
                )}
              </div>

              <div className="p-5 border-t border-[#E5E7EB] bg-white shrink-0">
                <button
                  type="button"
                  disabled={banks.length === 0}
                  onClick={() => {
                    setShowPayment(false);
                    setShowReceiptUpload(true);
                  }}
                  className="w-full h-12 bg-[#22C55E] hover:bg-[#15803D] disabled:bg-[#D1D5DB] text-white rounded-xl font-semibold"
                >
                  I Have Paid
                </button>

                <p className="text-[11px] text-center text-[#6B7280] mt-3">
                  Order #{createdOrderId}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Modal 4: Receipt Upload */}
      {showReceiptUpload &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">
                    Upload Payment Receipt
                  </h2>

                  {/* ARCHITECTURE FIX: Use frozen createdOrderTotal state */}
                  <p className="text-xs text-[#6B7280] mt-1">
                    Upload the receipt for your ₦
                    {createdOrderTotal.toLocaleString()} payment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReceiptUpload(false)}
                  className="text-sm text-[#6B7280]"
                >
                  Close
                </button>
              </div>

              <div className="mt-6">
                <label className="block border border-dashed border-[#22C55E] rounded-2xl p-6 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      setReceiptFile(e.target.files?.[0] || null)
                    }
                  />

                  <span className="text-sm font-medium text-[#374151]">
                    {receiptFile ? receiptFile.name : "Choose payment receipt"}
                  </span>

                  <span className="block text-xs text-[#6B7280] mt-1">
                    PNG, JPG or WEBP
                  </span>
                </label>
              </div>

              {receiptError && (
                <p className="mt-3 text-xs text-red-600">{receiptError}</p>
              )}

              <button
                type="button"
                disabled={!receiptFile || uploadingReceipt}
                onClick={uploadReceiptHandler}
                className="w-full h-12 mt-6 bg-[#22C55E] hover:bg-[#15803D] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white rounded-xl font-semibold"
              >
                {uploadingReceipt ? "Uploading Receipt..." : "Submit Receipt"}
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* PORTAL POSITION FIX: Success Modal sits outside of the orderItems check */}
      {showOrderSuccess &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
            <div className="w-full max-w-md px-6 py-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <Check className="w-7 h-7 text-[#15803D]" />
              </div>

              <h2 className="text-2xl font-bold text-[#111827] mt-6">
                Payment submitted
              </h2>

              <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                Your receipt has been sent to the merchant for review.
              </p>

              <div className="mt-8 border border-[#E5E7EB] rounded-2xl p-5 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#6B7280]">
                    Order reference
                  </span>

                  <span className="text-sm font-bold text-[#111827]">
                    {submittedReference}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-[#E5E7EB]">
                  <span className="text-sm text-[#6B7280]">
                    Amount submitted
                  </span>

                  {/* ARCHITECTURE FIX: Safely reads the frozen createdOrderTotal */}
                  <span className="text-lg font-bold text-[#111827]">
                    ₦{createdOrderTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-[#E5E7EB]">
                  <span className="text-sm text-[#6B7280]">Status</span>

                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                    Awaiting review
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push(`/order/${submittedReference}`)}
                className="w-full h-12 mt-6 bg-[#22C55E] hover:bg-[#15803D] text-white rounded-xl font-semibold transition-colors"
              >
                View Order Status
              </button>

              <button
                type="button"
                onClick={() => setShowOrderSuccess(false)}
                className="w-full h-12 mt-3 border border-[#D1D5DB] text-[#374151] rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Store
              </button>

              <p className="text-xs text-[#6B7280] mt-6 leading-relaxed">
                Keep your order reference. You may need it when contacting the
                merchant.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
