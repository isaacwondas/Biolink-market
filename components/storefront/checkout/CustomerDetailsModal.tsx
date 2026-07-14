"use client";

interface CustomerDetailsModalProps {
  open: boolean;
  customerName: string;
  customerPhone: string;
  orderTotal: number;
  loading: boolean;
  error: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onContinue: () => void;
}

export default function CustomerDetailsModal({
  open,
  customerName,
  customerPhone,
  orderTotal,
  loading,
  error,
  onClose,
  onNameChange,
  onPhoneChange,
  onContinue,
}: CustomerDetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Your Details</h2>

            <p className="text-xs text-[#6B7280] mt-1">
              We'll use this to identify your order.
            </p>
          </div>

          <button onClick={onClose} className="text-sm text-[#6B7280]">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2">
              Full Name
            </label>

            <input
              value={customerName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full h-12 px-4 border rounded-xl"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">
              WhatsApp Number
            </label>

            <input
              value={customerPhone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full h-12 px-4 border rounded-xl"
              placeholder="08012345678"
            />
          </div>
        </div>

        <div className="border-t p-5">
          <div className="flex justify-between">
            <span>Order Total</span>

            <span className="font-bold text-xl">
              ₦{orderTotal.toLocaleString()}
            </span>
          </div>

          {error && <p className="text-xs text-red-600 mt-3">{error}</p>}

          <button
            onClick={onContinue}
            disabled={loading || !customerName.trim() || !customerPhone.trim()}
            className="w-full h-12 mt-5 rounded-xl bg-[#22C55E] text-white font-semibold disabled:bg-gray-300"
          >
            {loading ? "Creating Order..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
