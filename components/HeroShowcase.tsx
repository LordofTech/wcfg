"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BRANDS } from "@/lib/brands";
import { luxuryEase } from "@/lib/motion";

const SHOWCASE_BRANDS = BRANDS.filter((brand) =>
  [
    "mercedes-benz",
    "ferrari",
    "rolls-royce",
    "lamborghini",
    "corvette",
    "porsche",
    "bentley",
    "aston-martin",
    "mclaren",
  ].includes(brand.slug)
);

const PILLARS = [
  "Exclusive Access",
  "Discreet & Professional",
  "White-Glove Delivery",
] as const;

export default function HeroShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.2, ease: luxuryEase }}
      className="relative mx-auto hidden w-full max-w-lg lg:block"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gold-light/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gold-highlight/10 blur-3xl"
        aria-hidden
      />

      <div className="glass-strong relative overflow-hidden rounded-sm border border-gold-light/25 shadow-gold">
        <div className="relative aspect-[16/10] overflow-hidden bg-pitch">
          <Image
            src="/vehicles/corvette-zr1-coupe-3lz-black.webp"
            alt="Featured 2026 Corvette ZR1 Coupe"
            fill
            priority
            className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
            sizes="(min-width: 1024px) 480px, 0px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(212,175,55,0.18),transparent_50%)]" />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold-light/40 bg-pitch/75 px-3 py-1.5 font-sans text-[9px] font-medium uppercase tracking-luxury text-gold-light backdrop-blur-sm">
              <Sparkles size={12} strokeWidth={1.5} aria-hidden />
              Featured In Stock
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-sans text-[10px] font-light uppercase tracking-luxury text-gold-light">
              2026 Corvette ZR1 Coupe 3LZ
            </p>
            <p className="mt-1 font-display text-2xl font-medium tracking-wide text-ivory">
              Available Now
            </p>
          </div>
        </div>

        <div className="border-t border-gold-light/15 bg-pitch/50 p-6">
          <p className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light">
            Specializing in the World&apos;s Finest Brands
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {SHOWCASE_BRANDS.map((brand, index) => (
              <Link
                key={brand.slug}
                href={brand.href}
                className="group rounded-sm border border-gold-light/15 bg-charcoal-velvet/60 px-2 py-2.5 text-center transition-colors hover:border-gold-light/35 hover:bg-gold-light/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/50"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span className="font-sans text-[9px] font-light uppercase tracking-wide text-mist transition-colors group-hover:text-gold-light">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="divider-gold my-5" />

          <div className="flex flex-wrap gap-2">
            {PILLARS.map((pillar) => (
              <span
                key={pillar}
                className="rounded-sm border border-gold-light/20 bg-pitch/40 px-2.5 py-1 font-sans text-[8px] font-light uppercase tracking-luxury text-gold-light/90"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
