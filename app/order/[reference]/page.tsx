import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, CircleDollarSign } from "lucide-react";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const { data: transaction, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("reference_code", reference)
    .single();

  if (error || !transaction) {
    notFound();
  }

  const orderTotal = Number(transaction.total_order_amount || 0);
  const amountPaid = Number(transaction.amount_paid || 0);
  const balanceDue = Number(transaction.balance_due || 0);

  const isFullyPaid = transaction.payment_status === "fully_paid";
  const isPartiallyPaid = transaction.payment_status === "partially_paid";

  const StatusIcon = isFullyPaid
    ? CheckCircle2
    : isPartiallyPaid
      ? CircleDollarSign
      : Clock3;

  const statusTitle = isFullyPaid
    ? "Payment verified"
    : isPartiallyPaid
      ? "Partially paid"
      : "Awaiting merchant review";

  const statusDescription = isFullyPaid
    ? "The merchant has verified your payment."
    : isPartiallyPaid
      ? "The merchant has verified part of your payment."
      : "Your receipt has been submitted and is waiting for merchant review.";

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
            <StatusIcon className="w-6 h-6 text-[#15803D]" />
          </div>

          <p className="text-xs uppercase tracking-wider text-[#6B7280] mt-5">
            Order Status
          </p>

          <h1 className="text-2xl font-bold text-[#111827] mt-1">
            {statusTitle}
          </h1>

          <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
            {statusDescription}
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 mt-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#6B7280]">Reference</span>

            <span className="text-sm font-bold text-[#111827]">
              {transaction.reference_code}
            </span>
          </div>

          <div className="border-t border-[#E5E7EB] mt-4 pt-4 flex items-center justify-between gap-4">
            <span className="text-sm text-[#6B7280]">Order total</span>

            <span className="font-bold text-[#111827]">
              ₦{orderTotal.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-[#E5E7EB] mt-4 pt-4 flex items-center justify-between gap-4">
            <span className="text-sm text-[#6B7280]">Verified payment</span>

            <span className="font-bold text-[#15803D]">
              ₦{amountPaid.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-[#E5E7EB] mt-4 pt-4 flex items-center justify-between gap-4">
            <span className="text-sm text-[#6B7280]">Balance</span>

            <span className="font-bold text-[#111827]">
              ₦{balanceDue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mt-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />

            <div>
              <p className="text-sm font-semibold text-[#111827]">
                Receipt submitted
              </p>

              <p className="text-xs text-[#6B7280] mt-1">
                Your payment receipt is attached to this order.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-[#6B7280] mt-6">
          Keep this reference for payment and order enquiries.
        </p>
      </div>
    </main>
  );
}
