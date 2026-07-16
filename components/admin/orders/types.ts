export type OrderStatus =
  | "pending_payment"
  | "receipt_uploaded"
  | "under_review"
  | "payment_confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentType = "full" | "deposit" | "balance";

export interface OrderItem {
  id: number;

  product_id?: number;

  product_name: string;

  quantity: number;

  unit_price: number;

  subtotal: number;

  image_url?: string | null;
}

export interface Payment {
  id: number;

  payment_type: PaymentType;

  amount: number;

  receipt_url?: string | null;

  status: "pending" | "approved" | "rejected";

  paid_at?: string;
}

export interface Order {
  id: number;

  reference: string;

  buyer_name: string;

  buyer_phone: string;

  buyer_email?: string;

  total_amount: number;

  deposit_amount?: number;

  balance_due?: number;

  payment_type: PaymentType;

  status: OrderStatus;

  created_at: string;

  items: OrderItem[];

  payments: Payment[];
}
