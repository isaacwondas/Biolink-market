"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import type { Product } from "./types";

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
  const image = product.image_url || product.image;

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
      {image && (
        <div className="relative aspect-square">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-[#111827]">{product.name}</h3>

        <p className="mt-1 text-lg font-bold text-[#15803D]">
          ₦{Number(product.price).toLocaleString()}
        </p>

        {product.description && (
          <p className="mt-2 text-sm text-[#6B7280] line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 h-10 rounded-xl border border-[#22C55E] text-[#15803D] hover:bg-[#22C55E]/10 transition flex items-center justify-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={() => onDelete(product)}
            className="flex-1 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
