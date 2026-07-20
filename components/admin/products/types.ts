export interface ProductImage {
  id: number;
  image_url: string;
  position: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string | null;

  // Cover image
  image_url?: string | null;

  // Gallery
  product_images?: ProductImage[];
}
