import { uploadImage } from "@/app/lib/uploadImage";

export interface UploadedProductImage {
  publicUrl: string;
  storagePath: string;
}

/**
 * Upload a single product image.
 */
export async function uploadProductImage(
  image: File,
  vendorUsername: string,
): Promise<UploadedProductImage> {
  return uploadImage(image, "products", vendorUsername);
}

/**
 * Upload multiple product images.
 */
export async function uploadProductImages(
  images: File[],
  vendorUsername: string,
): Promise<UploadedProductImage[]> {
  if (images.length === 0) {
    throw new Error("Please select at least one product image.");
  }

  return Promise.all(
    images.map((image) => uploadProductImage(image, vendorUsername)),
  );
}
