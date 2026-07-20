"use client";

import Image from "next/image";
import { Pencil, Trash2, BadgeCheck } from "lucide-react";
import type { Product } from "./types";
import { getProductCover } from "./getProductCover";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const image = product.product_images?.length
    ? product.product_images.sort((a, b) => a.position - b.position)[0]
        .image_url
    : getProductCover(product);

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Live Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#15803D] shadow">
          <BadgeCheck className="h-4 w-4" />
          Live
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <div>
          <h3 className="truncate text-lg font-bold text-[#111827]">
            {product.name}
          </h3>

          <p className="mt-2 text-2xl font-black text-[#16A34A]">
            ₦{Number(product.price).toLocaleString()}
          </p>

          {product.description && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
              {product.description}
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <button
              onClick={() => onEdit(product)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#22C55E] text-[#15803D] transition hover:bg-[#22C55E] hover:text-white"
            >
              <Pencil className="h-4 w-4" />

              <span className="font-medium">Edit</span>
            </button>

            <button
              onClick={() => onDelete(product)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />

              <span className="font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
