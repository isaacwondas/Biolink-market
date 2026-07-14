export type CheckoutStep =
  | "products"
  | "review"
  | "customer"
  | "payment"
  | "receipt"
  | "success";

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  image_url?: string | null;
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
