"use client";
import { useProductViewTracker } from "@/hooks/useProductViewTracker";
import { useState } from "react";
import Image from "next/image";

import { ArrowRight, Check, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { createOrder, uploadReceipt } from "./checkout/service";
import { useRouter } from "next/navigation";
import { trackProductClick } from "@/app/lib/trackClick";
import {
  StickyCart,
  ReviewOrderModal,
  CustomerDetailsModal,
  PaymentModal,
  ReceiptUploadModal,
  OrderSuccessModal,
} from "@/components/storefront/checkout";
import type { Product, OrderItem, VendorBank } from "./checkout/types";

function ProductCard({
  product,
  vendorId,
  addToOrder,
}: {
  product: any;
  vendorId: number;
  addToOrder: (product: any) => void;
}) {
  const ref = useProductViewTracker(vendorId, product.id);

  const productImage = product.image_url || product.image;

  return (
    <div ref={ref} className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
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

      <h3 className="mt-3 font-semibold text-[#111827]">{product.name}</h3>

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
}

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
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            vendorId={vendorId}
            addToOrder={addToOrder}
          />
        ))}
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
      <CustomerDetailsModal
        open={showCustomerDetails}
        customerName={customerName}
        customerPhone={customerPhone}
        orderTotal={orderTotal}
        loading={savingOrder}
        error={orderError}
        onClose={() => setShowCustomerDetails(false)}
        onNameChange={setCustomerName}
        onPhoneChange={setCustomerPhone}
        onContinue={createOrderHandler}
      />
      {/* Modal 3: Payment Details */}
      <PaymentModal
        open={showPayment}
        orderId={createdOrderId}
        orderTotal={createdOrderTotal}
        banks={banks}
        onClose={() => setShowPayment(false)}
        onPaid={() => {
          setShowPayment(false);
          setShowReceiptUpload(true);
        }}
      />
      {/* Modal 4: Receipt Upload */}
      <ReceiptUploadModal
        open={showReceiptUpload}
        orderTotal={createdOrderTotal}
        receiptFile={receiptFile}
        uploading={uploadingReceipt}
        error={receiptError}
        onClose={() => setShowReceiptUpload(false)}
        onFileChange={setReceiptFile}
        onSubmit={uploadReceiptHandler}
      />
      {/* PORTAL POSITION FIX: Success Modal sits outside of the orderItems check */}
      <OrderSuccessModal
        open={showOrderSuccess}
        reference={submittedReference}
        amount={createdOrderTotal}
        onViewStatus={() => router.push(`/order/${submittedReference}`)}
        onBack={() => setShowOrderSuccess(false)}
      />
    </>
  );
}
