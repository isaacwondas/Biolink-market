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
  await supabase.from("product_images").insert(
    uploadedImages.map((imageUrl, index) => ({
      product_id: product.id,
      image_url: imageUrl,
      position: index,
    })),
  );
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
  image: File | null;
}

export async function updateProduct({
  productId,
  vendorUsername,
  values,
  image,
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

  if (image) {
    const imageUrl = await uploadProductImage(image, vendorUsername);

    await supabase.from("vendor_products");
    await supabase
      .from("vendor_products")
      .update({
        image_url: imageUrl,
      })
      .eq("id", productId);

    data.image_url = imageUrl;
  }

  return data;
}
