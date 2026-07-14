import { supabase } from "@/app/lib/supabase";

export async function createOrder({
  vendorId,
  vendorEmail,
  buyerName,
  buyerPhone,
  total,
  items,
}: {
  vendorId: number;
  vendorEmail: string;
  buyerName: string;
  buyerPhone: string;
  total: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        vendor_id: vendorId,
        vendor_email: vendorEmail,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_note: null,
        subtotal: total,
        delivery_fee: 0,
        total_amount: total,
        status: "pending",
      },
    ])
    .select("id")
    .single();

  if (orderError) throw orderError;

  const payload = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    total_price: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(payload);

  if (itemsError) throw itemsError;

  return order;
}

export async function uploadReceipt({
  createdOrderId,
  vendorEmail,
  customerName,
  customerPhone,
  receiptFile,
  total,
}: {
  createdOrderId: number;
  vendorEmail: string;
  customerName: string;
  customerPhone: string;
  receiptFile: File;
  total: number;
}) {
  const fileExt = receiptFile.name.split(".").pop();

  const filePath = `${vendorEmail}/${createdOrderId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(filePath, receiptFile);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("receipts").getPublicUrl(filePath);

  const referenceCode = `HQ-${Math.floor(1000 + Math.random() * 9000)}`;

  const { error } = await supabase.from("transactions").insert([
    {
      order_id: createdOrderId,
      vendor_email: vendorEmail,
      buyer_name: customerName,
      buyer_phone: customerPhone,
      receipt_url: publicUrl,
      reference_code: referenceCode,
      status: "pending",
      total_order_amount: total,
      amount_paid: 0,
      payment_status: "unpaid",
    },
  ]);

  if (error) throw error;

  return referenceCode;
}
