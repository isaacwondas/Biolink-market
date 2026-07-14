"use client";

import { TriangleAlert, Trash2, X } from "lucide-react";

interface Product {
  id?: number;
  name: string;
}

interface DeleteProductDialogProps {
  open: boolean;
  product: Product | null;
  loading?: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteProductDialog({
  open,
  product,
  loading = false,
  onClose,
  onDelete,
}: DeleteProductDialogProps) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <TriangleAlert className="w-7 h-7 text-red-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#111827]">
            Delete Product
          </h2>

          <p className="mt-3 text-sm text-[#6B7280] leading-6">
            Are you sure you want to permanently delete
          </p>

          <p className="mt-1 font-bold text-[#111827]">"{product.name}"</p>

          <p className="mt-4 text-xs text-red-500">
            This action cannot be undone.
          </p>
        </div>

        <div className="border-t p-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onDelete}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 disabled:bg-red-300"
          >
            <Trash2 className="w-4 h-4" />

            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
