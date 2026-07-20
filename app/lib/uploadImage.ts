import { supabase } from "./supabase";
import { validateImage } from "./validateImage";
import { compressImage } from "./compressImage";

export async function uploadImage(file: File, folder: string, prefix: string) {
  validateImage(file);

  const compressed = await compressImage(file);
  const ext = file.name.split(".").pop();

  const path = `${folder}/${prefix}-${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, compressed, {
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
