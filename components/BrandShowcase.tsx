"use client";

import { motion } from "framer-motion";
import { MARQUES, MARQUE_ACCENTS, type Marque } from "@/lib/brands";
import { luxuryEase } from "@/lib/motion";

function BrandBadge({ brand, index }: { brand: Marque; index: number }) {
  const accent = MARQUE_ACCENTS[brand];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: luxuryEase }}
      className="group relative overflow-hidden rounded-sm border border-gold-light/15 bg-charcoal-velvet px-4 py-8 text-center transition-all duration-500 hover:border-gold-light/45 hover:shadow-gold"
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
      <p className="relative font-display text-lg font-medium tracking-wide text-ivory transition-colors duration-300 group-hover:text-gold-light sm:text-xl">
        {brand}
      </p>
      <p className="relative mt-2 font-sans text-[9px] font-light uppercase tracking-luxury text-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        WCFG Network
      </p>
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-4">
          {MARQUES.map((brand, index) => (
            <BrandBadge key={brand} brand={brand} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
