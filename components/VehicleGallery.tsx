"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

interface VehicleGalleryProps {
  images: string[];
  alt: string;
  featured?: boolean;
  badge: ReactNode;
}

export default function VehicleGallery({
  images,
  alt,
  badge,
}: VehicleGalleryProps) {
  const gallery = images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = gallery[activeIndex] ?? gallery[0];

  if (!activeSrc) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/11] overflow-hidden rounded-sm border border-gold-light/15 bg-charcoal-velvet">
        <Image
          src={activeSrc}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-velvet/80 via-transparent to-pitch/20" />
        <div className="absolute left-4 top-4">{badge}</div>
      </div>

      {gallery.length > 1 ? (
        <div
          className="grid grid-cols-4 gap-2"
          role="tablist"
          aria-label="Vehicle photos"
        >
          {gallery.map((src, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Photo ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-[16/11] overflow-hidden rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 ${
                  selected
                    ? "border-gold-light/60"
                    : "border-gold-light/15 hover:border-gold-light/35"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
