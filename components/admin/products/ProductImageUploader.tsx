"use client";

import Image from "next/image";
import { ImagePlus, X, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";

interface ProductImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
}

const MAX_SIZE = 5 * 1024 * 1024;

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ProductImageUploader({
  files,
  onChange,
  max = 5,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    const incoming = Array.from(selected);

    setError("");

    const valid = incoming.filter((file) => {
      if (!ACCEPTED.includes(file.type)) {
        setError("Only JPG, PNG and WEBP images are allowed.");
        return false;
      }

      if (file.size > MAX_SIZE) {
        setError("Each image must be smaller than 5MB.");
        return false;
      }

      return true;
    });

    const merged = [...files, ...valid];

    if (merged.length > max) {
      setError(`Maximum ${max} images allowed.`);
      return;
    }

    onChange(merged);
  };

  const removeImage = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-medium uppercase text-gray-500">
        Product Images
      </label>

      {/* Upload Area */}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-2xl border-2 border-dashed border-[#22C55E]/40 bg-[#F9FFFB] p-8 transition hover:border-[#22C55E]"
      >
        <div className="flex flex-col items-center">
          <ImagePlus className="w-9 h-9 text-[#22C55E]" />

          <p className="mt-3 text-sm font-semibold text-[#111827]">
            Add Product Images
          </p>

          <p className="mt-1 text-xs text-gray-500">PNG, JPG or WEBP</p>

          <p className="text-xs text-gray-400">Maximum {max} images</p>
        </div>
      </button>

      <input
        ref={inputRef}
        hidden
        multiple
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Error */}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Preview */}

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border bg-white"
            >
              <div className="relative aspect-square">
                <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-[#22C55E] px-2 py-1 text-[10px] font-semibold text-white">
                  Cover
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && files.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-medium text-[#15803D]"
        >
          + Add {max - files.length} More Image
          {max - files.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
