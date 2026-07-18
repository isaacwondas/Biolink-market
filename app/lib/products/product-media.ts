import { supabase } from "@/app/lib/supabase";
import { uploadImage } from "@/app/lib/uploadImage";

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
  const { data: product, error } = await supabase
    .from("vendor_products")
    .insert({
      vendor_id: vendor.id,
      name: values.name,
      description: values.description,
      price: values.price,
    })
    .select()
    .single();

  if (error) {
    throw error;
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
    const imageUrl = await uploadImage(image, "products", vendorUsername);

    await supabase
      .from("vendor_products")
      .update({
        image_url: imageUrl,
      })
      .eq("id", productId);

    data.image_url = imageUrl;
  }
  // ✓ FIXED: The return statement belongs inside the function right here!
  return data;
}
export async function uploadProductImage(image: File, vendorUsername: string) {
  return uploadImage(image, "products", vendorUsername);
}

export async function uploadProductImages(
  images: File[],
  vendorUsername: string,
) {
  return Promise.all(
    images.map((image) => uploadProductImage(image, vendorUsername)),
  );
}
