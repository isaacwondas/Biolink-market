import { supabase } from "./supabase";

export async function uploadImage(file: File, folder: string, prefix: string) {
  const ext = file.name.split(".").pop();

  const path = `${folder}/${prefix}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (error) throw error;

  return supabase.storage.from("product-images").getPublicUrl(path).data
    .publicUrl;
}
