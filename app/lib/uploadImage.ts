import { supabase } from "./supabase";

export async function uploadImage(file: File, folder: string, prefix: string) {
  const ext = file.name.split(".").pop();

  const path = `${folder}/${prefix}-${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, {
      upsert: false,
    });

  if (error) throw error;

  const publicUrl = supabase.storage.from("product-images").getPublicUrl(path)
    .data.publicUrl;

  return {
    publicUrl,
    storagePath: path,
  };
}
