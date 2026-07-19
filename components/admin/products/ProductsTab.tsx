"use client";
import Toast from "@/components/admin/ui/Toast";
import ProductImageUploader from "./ProductImageUploader";
import { supabase } from "@/app/lib/supabase";
import { useState } from "react";
import { Product } from "./types";

import ProductGrid from "./ProductGrid";
import DeleteProductDialog from "./DeleteProductDialog";
import EditProductModal from "./EditProductModal";
import { Trash2, Plus } from "lucide-react";

import {
  createProduct,
  updateProduct,
} from "@/app/lib/products/product.service";

export default function ProductsTab({ vendor }: { vendor: any }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [savingProduct, setSavingProduct] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const confirmDeleteProduct = async () => {
    if (!deletingProduct?.id) return;

    try {
      setDeleting(true);

      await handleDeleteProduct(deletingProduct.id);

      setDeletingProduct(null);

      setMsg({
        type: "success",
        text: `"${deletingProduct.name}" has been removed from your storefront.`,
      });
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.message,
      });
    } finally {
      setDeleting(false);
    }
  };

  const [products, setProducts] = useState<Product[]>(
    vendor.vendor_products?.length > 0
      ? vendor.vendor_products
      : vendor.product_name
        ? [
            {
              name: vendor.product_name,
              price: Number(vendor.product_price) || 0,
              image_url: vendor.product_image,
            },
          ]
        : [],
  );
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      setMsg({ type: "error", text: "Product name is required." });
      return;
    }
    if (images.length === 0) {
      setMsg({
        type: "error",
        text: "Please add at least one product image.",
      });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const product = await createProduct({
        vendor: {
          id: vendor.id,
          username: vendor.username,
        },
        values: {
          name: newProduct.name.trim(),
          description: newProduct.description,
          price: newProduct.price
            ? Number(newProduct.price.replace(/[^0-9]/g, ""))
            : 0,
        },
        images,
      });

      setProducts((prev) => [...prev, product]);
      setNewProduct({ name: "", price: "", description: "" });
      setImages([]);
      setMsg({
        type: "success",
        text: "Product added! It's now live on your storefront.",
      });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const { error } = await supabase
      .from("vendor_products")
      .delete()
      .eq("id", id);
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateProduct = async (
    values: {
      name: string;
      price: number;
      description: string;
    },
    image: File | null,
  ) => {
    if (!editingProduct?.id) return;

    try {
      setSavingProduct(true);

      const updated = await updateProduct({
        productId: editingProduct.id,
        vendorUsername: vendor.username,
        values,
        image,
      });

      setProducts((current) =>
        current.map((product) =>
          product.id === updated.id ? updated : product,
        ),
      );

      setEditingProduct(null);

      setMsg({
        type: "success",
        text: "Product updated successfully.",
      });
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.message,
      });
    } finally {
      setSavingProduct(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-[#111827]">Product Listings</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Products appear in a grid on your public storefront.
        </p>
      </div>
      <Toast msg={msg} />
      {/* Add new product */}
      <div className="bg-white border border-[#22C55E]/40 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
          Add New Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] text-[#6B7280] font-medium uppercase">
              Product Name*
            </label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Ankara Gown Style Alpha"
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-[#6B7280] font-medium uppercase">
              Price (₦)
            </label>
            <input
              type="text"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="12500"
              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-[#6B7280] font-medium uppercase">
            Description
          </label>
          <input
            type="text"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Short product description"
            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#22C55E]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-[#6B7280] font-medium uppercase">
            Product Image
          </label>
          <ProductImageUploader
            files={images}
            onChange={setImages}
            max={5}
            //className="w-full text-xs text-[#4B5563] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-[#374151]"
          />
        </div>
        <button
          onClick={handleAddProduct}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#15803D] disabled:bg-gray-200 disabled:text-gray-500 text-white font-semibold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" />
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </div>
      {/* Existing products */}
      {products.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
            Live Products ({products.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ProductGrid
              products={products}
              onEdit={(product) => {
                setEditingProduct(product);
              }}
              onDelete={(product) => {
                setDeletingProduct(product);
              }}
            />
          </div>
        </div>
      )}
      {products.length === 0 && (
        <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-xs text-[#6B7280]">
            No products yet. Add one above.
          </p>
        </div>
      )}
      <EditProductModal
        open={!!editingProduct}
        product={editingProduct}
        loading={savingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdateProduct}
      />
      <DeleteProductDialog
        open={!!deletingProduct}
        product={deletingProduct}
        loading={deleting}
        onClose={() => setDeletingProduct(null)}
        onDelete={confirmDeleteProduct}
      />
    </div>
  );
}
