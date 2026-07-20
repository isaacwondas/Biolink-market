import { supabase } from "@/app/lib/supabase";

import {
  uploadProductImage,
  uploadProductImages,
} from "@/app/lib/products/product-media";

export interface CreateProductInput {
  vendor: {
    id: string;
    username: string;
  };

  values: {
    name: string;
    description: string;
    price: number;
  };

  images: File[];
}

export async function createProduct({
  vendor,
  values,
  images,
}: CreateProductInput) {
  if (images.length === 0) {
    throw new Error("Please add at least one product image.");
  }
  const uploadedImages = await uploadProductImages(images, vendor.username);

  const imageUrl = uploadedImages[0];
  const { data: product, error } = await supabase
    .from("vendor_products")
    .insert({
      vendor_id: vendor.id,
      name: values.name,
      description: values.description,
      price: values.price,
      image_url: imageUrl,
    })

    .select()
    .single();

  if (error) {
    throw error;
  }
  const { error: galleryError } = await supabase.from("product_images").insert(
    uploadedImages.map((imageUrl, index) => ({
      product_id: product.id,
      image_url: imageUrl,
      position: index,
    })),
  );

  if (galleryError) {
    await supabase.from("vendor_products").delete().eq("id", product.id);

    throw galleryError;
  }
  return product;
}

export interface UpdateProductInput {
  productId: number;
  vendorUsername: string;
  values: {
    name: string;
    price: number;
    description: string;
  };
  images: File[];
}

export async function updateProduct({
  productId,
  vendorUsername,
  values,
  images,
}: UpdateProductInput) {
  const updates = {
    name: values.name,
    price: values.price,
    description: values.description,
  };

  const { data, error } = await supabase
    .from("vendor_products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (images.length > 0) {
    const uploadedImages = await uploadProductImages(images, vendorUsername);

    // Update the cover image
    await supabase
      .from("vendor_products")
      .update({
        image_url: uploadedImages[0],
      })
      .eq("id", productId);

    // Add new gallery images
    const { error: galleryError } = await supabase
      .from("product_images")
      .insert(
        uploadedImages.map((imageUrl, index) => ({
          product_id: productId,
          image_url: imageUrl,
          position: index,
        })),
      );

    if (galleryError) {
      throw galleryError;
    }

    data.image_url = uploadedImages[0];
  }

  return data;
}
