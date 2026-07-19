import { uploadImage } from "@/app/lib/uploadImage";

/**
 * Upload a single product image and return its public URL.
 */
export async function uploadProductImage(
  image: File,
  vendorUsername: string,
): Promise<string> {
  return uploadImage(image, "products", vendorUsername);
}

/**
 * Upload multiple product images and return their public URLs
 * in the same order they were selected.
 */
export async function uploadProductImages(
  images: File[],
  vendorUsername: string,
): Promise<string[]> {
  if (images.length === 0) {
    throw new Error("Please select at least one product image.");
  }

  return Promise.all(
    images.map((image) => uploadProductImage(image, vendorUsername)),
  );
}
