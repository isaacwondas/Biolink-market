"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, X } from "lucide-react";
import ProductImageUploader from "./ProductImageUploader";
import ProductGallery from "./ProductGallery";
interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;

  product_images?: {
    id: number;
    image_url: string;
    position: number;
  }[];
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
    images: File[],
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
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    if (!product) return;

    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || "");
    setNewImages([]);
  }, [product]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <Pencil className="w-5 h-5 text-[#22C55E]" />

            <h2 className="text-lg font-bold">Edit Product</h2>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {product.product_images?.length ? (
            <div>
              <label className="text-xs font-semibold">Current Images</label>

              <div className="mt-3 grid grid-cols-4 gap-2">
                <ProductGallery
                  images={product.product_images}
                  fallback={product.image_url}
                  alt={product.name}
                />
              </div>
            </div>
          ) : (
            product.image_url && (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden mx-auto">
                <ProductGallery
                  images={product.product_images}
                  fallback={product.image_url}
                  alt={product.name}
                />
              </div>
            )
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

            <div>
              <label className="text-xs font-semibold">Add More Images</label>

              <div className="mt-2">
                <ProductImageUploader
                  files={newImages}
                  onChange={setNewImages}
                  max={5}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-5 flex gap-3 shrink-0 bg-white">
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
                newImages,
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
