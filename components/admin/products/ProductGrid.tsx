"use client";

import ProductCard from "./ProductCard";

import type { Product } from "./types";

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
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-[#111827]">
          No products yet
        </h3>

        <p className="mt-2 text-sm text-[#6B7280]">
          Add your first product to start receiving orders.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
