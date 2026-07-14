"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";

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

export default function OrderProducts({ products }: { products: Product[] }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="h-11 px-5 bg-[#22C55E] hover:bg-[#15803D] rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                Review Items
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
