"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "./types";
import { getProductCover } from "./getProductCover";

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="relative h-44 bg-gray-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No Image
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-[#111827] truncate">
              {product.name}
            </h3>

            <p className="text-[#22C55E] font-bold">
              ₦{Number(product.price).toLocaleString()}
            </p>

            {product.description && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={() => onDelete(product)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 py-2 text-xs hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
