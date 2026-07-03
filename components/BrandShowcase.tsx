"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BRANDS, DEFAULT_MARQUE_ACCENT, MARQUE_ACCENTS } from "@/lib/brands";
import { luxuryEase } from "@/lib/motion";

function BrandBadge({
  name,
  href,
  accent,
  index,
}: {
  name: string;
  href: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 12) * 0.04, ease: luxuryEase }}
    >
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-sm border border-gold-light/15 bg-charcoal-velvet px-3 py-6 text-center transition-all duration-500 hover:border-gold-light/45 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:px-4 sm:py-8"
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        >
          <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
          <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
        </div>
        <p className="relative font-display text-base font-medium tracking-wide text-ivory transition-colors duration-300 group-hover:text-gold-light sm:text-lg">
          {name}
        </p>
        <p className="relative mt-2 font-sans text-[9px] font-light uppercase tracking-luxury text-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View inventory
        </p>
      </Link>
    </motion.div>
  );
}

export default function BrandShowcase() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-28 border-y border-gold-light/10 bg-charcoal px-6 py-20 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: luxuryEase }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div className="divider-gold mb-6 w-24" />
          <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
            Specializing in the World&apos;s Finest Brands
          </p>
          <div className="divider-gold mt-6 w-24" />
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
          {BRANDS.map((brand, index) => (
            <BrandBadge
              key={brand.slug}
              name={brand.name}
              href={brand.href}
              accent={MARQUE_ACCENTS[brand.name] ?? DEFAULT_MARQUE_ACCENT}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
