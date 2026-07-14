"use client";

import { OrderItem } from "./types";

interface ReviewOrderModalProps {
  open: boolean;
  items: OrderItem[];
  totalItems: number;
  orderTotal: number;
  onClose: () => void;
  onContinue: () => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}

export default function ReviewOrderModal({
  open,
  items,
  totalItems,
  orderTotal,
  onClose,
  onContinue,
  onIncrease,
  onDecrease,
}: ReviewOrderModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Review Order</h2>

            <p className="text-xs text-[#6B7280] mt-1">
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </p>
          </div>

          <button onClick={onClose} className="text-sm text-[#6B7280]">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border rounded-2xl p-3"
            >
              <div>
                <p className="font-semibold">{item.name}</p>

                <p className="font-bold text-[#15803D]">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onDecrease(item.id)}
                  className="w-9 h-9 border rounded-xl"
                >
                  −
                </button>

                <span className="font-bold">{item.quantity}</span>

                <button
                  onClick={() => onIncrease(item.id)}
                  className="w-9 h-9 border rounded-xl"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-5">
          <div className="flex justify-between">
            <span>Order Total</span>

            <span className="font-bold text-xl">
              ₦{orderTotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={onContinue}
            className="mt-5 w-full h-12 rounded-xl bg-[#22C55E] text-white font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
