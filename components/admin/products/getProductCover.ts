import { Product } from "@/components/admin/products/types";

export function getProductCover(product: Product) {
  if (product.product_images?.length) {
    return [...product.product_images].sort(
      (a, b) => a.position - b.position,
    )[0].image_url;
  }

  return product.image_url ?? null;
}
