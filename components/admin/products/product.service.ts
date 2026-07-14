import { supabase } from "@/app/lib/supabase";
import { uploadImage } from "@/app/lib/uploadImage";

export async function addProduct({
  vendor,
  product,
  image,
}: {
  vendor: any;
  product: {
    name: string;
    price: string;
    description: string;
  };
  image: File | null;
}) {
  let imageUrl = "";

  if (image) {
    imageUrl = await uploadImage(image, "products", vendor.username);
  }

  const row = {
    vendor_id: vendor.id,
    name: product.name.trim(),
    price: product.price ? Number(product.price.replace(/[^0-9]/g, "")) : 0,
    description: product.description,
    image_url: imageUrl || undefined,
  };

  const { data, error } = await supabase
    .from("vendor_products")
    .insert([row])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from("vendor_products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateProduct({
  productId,
  vendorUsername,
  values,
  image,
}: {
  productId: number;
  vendorUsername: string;
  values: {
    name: string;
    price: number;
    description: string;
  };
  image: File | null;
}) {
  let updates: any = {
    name: values.name,
    price: values.price,
    description: values.description,
  };

  if (image) {
    const imageUrl = await uploadImage(image, "products", vendorUsername);

    updates.image_url = imageUrl;
  }

  const { data, error } = await supabase
    .from("vendor_products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
