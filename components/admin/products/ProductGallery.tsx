"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImage {
  id: number;
  image_url: string;
  position: number;
}

interface ProductGalleryProps {
  images?: ProductImage[];
  fallback?: string | null;
  alt: string;
}

export default function ProductGallery({
  images = [],
  fallback,
  alt,
}: ProductGalleryProps) {
  const gallery =
    images.length > 0
      ? [...images].sort((a, b) => a.position - b.position)
      : fallback
        ? [{ id: 0, image_url: fallback, position: 0 }]
        : [];

  const [current, setCurrent] = useState(0);

  if (gallery.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-100 text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
      <Image
        src={gallery[current].image_url}
        alt={alt}
        fill
        className="object-cover"
        unoptimized
      />

      {gallery.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((current - 1 + gallery.length) % gallery.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => setCurrent((current + 1) % gallery.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1 shadow"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 w-2 rounded-full ${
                  current === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
