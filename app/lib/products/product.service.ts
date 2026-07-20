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

  const coverImage = uploadedImages[0];
  const { data: product, error } = await supabase
    .from("vendor_products")
    .insert({
      vendor_id: vendor.id,
      name: values.name,
      description: values.description,
      price: values.price,
      image_url: coverImage.publicUrl,
    })

    .select()
    .single();

  if (error) {
    throw error;
  }
  const { error: galleryError } = await supabase.from("product_images").insert(
    uploadedImages.map((image, index) => ({
      product_id: product.id,
      image_url: image.publicUrl,
      storage_path: image.storagePath,
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
  // Update product details
  const { data, error } = await supabase
    .from("vendor_products")
    .update({
      name: values.name,
      price: values.price,
      description: values.description,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  const { data: existingImages, error: existingError } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  if (existingError) {
    throw existingError;
  }

  const paths = existingImages
    .map((img) => img.storage_path)
    .filter(
      (path): path is string => typeof path === "string" && path.length > 0,
    );

  if (paths.length) {
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove(paths);

    if (storageError) {
      throw storageError;
    }
  }
  // Only replace the gallery if new images were selected
  if (images.length > 0) {
    // Delete existing gallery records
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);

    if (deleteError) {
      throw deleteError;
    }

    // Upload the new images
    const uploadedImages = await uploadProductImages(images, vendorUsername);

    // Save the new gallery
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

    // Update the cover image
    const { error: coverError } = await supabase
      .from("vendor_products")
      .update({
        image_url: uploadedImages[0],
      })
      .eq("id", productId);

    if (coverError) {
      throw coverError;
    }

    data.image_url = uploadedImages[0];
  }

  return data;
}
