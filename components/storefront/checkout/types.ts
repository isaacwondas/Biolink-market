export type CheckoutStep =
  | "products"
  | "review"
  | "customer"
  | "payment"
  | "receipt"
  | "success";

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
  image_url?: string | null;
  image?: string | null;

  product_images?: ProductImage[];
}
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
}

export interface VendorBank {
  id: number;
  bank_name: string;
  account_number: string;
  account_name?: string | null;
}
