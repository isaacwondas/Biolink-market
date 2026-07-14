"use client";

interface ReceiptUploadModalProps {
  open: boolean;
  orderTotal: number;
  receiptFile: File | null;
  uploading: boolean;
  error: string;
  onClose: () => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
}

export default function ReceiptUploadModal({
  open,
  orderTotal,
  receiptFile,
  uploading,
  error,
  onClose,
  onFileChange,
  onSubmit,
}: ReceiptUploadModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Upload Receipt</h2>

            <p className="text-xs text-[#6B7280] mt-1">
              Upload your receipt for
              <span className="font-semibold text-[#111827]">
                {" "}
                ₦{orderTotal.toLocaleString()}
              </span>
            </p>
          </div>

          <button onClick={onClose} className="text-sm text-[#6B7280]">
            Close
          </button>
        </div>

        <label className="mt-6 block border-2 border-dashed border-[#22C55E] rounded-2xl p-6 text-center cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          />

          <p className="font-medium">
            {receiptFile ? receiptFile.name : "Choose Receipt"}
          </p>

          <p className="text-xs text-[#6B7280] mt-2">PNG, JPG or WEBP</p>
        </label>

        {error && <p className="text-xs text-red-600 mt-4">{error}</p>}

        <button
          onClick={onSubmit}
          disabled={!receiptFile || uploading}
          className="w-full h-12 mt-6 rounded-xl bg-[#22C55E] text-white font-semibold disabled:bg-gray-300"
        >
          {uploading ? "Uploading..." : "Submit Receipt"}
        </button>
      </div>
    </div>
  );
}
