"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, X } from "lucide-react";

interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
}

interface EditProductModalProps {
  open: boolean;
  product: Product | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (
    values: {
      name: string;
      price: number;
      description: string;
    },
    image: File | null,
  ) => void;
}

export default function EditProductModal({
  open,
  product,
  loading = false,
  onClose,
  onSave,
}: EditProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!product) return;

    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || "");
    setImageFile(null);
  }, [product]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <Pencil className="w-5 h-5 text-[#22C55E]" />

            <h2 className="text-lg font-bold">Edit Product</h2>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {product.image_url && (
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden mx-auto">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold">Product Name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full h-11 border rounded-xl px-4"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Price</label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-2 w-full h-11 border rounded-xl px-4"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full border rounded-xl p-4 h-28"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Replace Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full text-sm"
            />
          </div>
        </div>

        <div className="border-t p-5 flex gap-3">
          <button onClick={onClose} className="flex-1 h-11 border rounded-xl">
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() =>
              onSave(
                {
                  name,
                  price,
                  description,
                },
                imageFile,
              )
            }
            className="flex-1 h-11 bg-[#22C55E] text-white rounded-xl font-semibold disabled:bg-gray-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
