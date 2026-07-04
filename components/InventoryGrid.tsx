"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import VehicleCard from "@/components/VehicleCard";
import { BRANDS } from "@/lib/brands";
import { getFeaturedInventory } from "@/lib/inventory";
import { luxuryEase } from "@/lib/motion";

const featured = getFeaturedInventory(9);

export default function InventoryGrid() {
  return (
    <section id="inventory" className="relative scroll-mt-28 px-6 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Curated Inventory"
          title="Premium Units, Personally Vetted"
          description="Each vehicle is presented as a WCFG-managed premium unit, sourced, inspected, and prepared for a seamless white-glove acquisition."
        />

        <LayoutGroup>
          <div
            className="mb-10 flex flex-wrap justify-center gap-2"
            role="navigation"
            aria-label="Browse by marque"
          >
            <Link
              href="/inventory"
              className="rounded-sm border border-gold-light/20 bg-charcoal-velvet/60 px-4 py-2 font-sans text-[10px] font-light uppercase tracking-luxury text-mist transition-all duration-300 hover:border-gold-light/40 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
            >
              All
            </Link>
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={brand.href}
                className="rounded-sm border border-gold-light/20 bg-charcoal-velvet/60 px-4 py-2 font-sans text-[10px] font-light uppercase tracking-luxury text-mist transition-all duration-300 hover:border-gold-light/40 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
              >
                {brand.name}
              </Link>
            ))}
          </div>

          <motion.div
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: luxuryEase }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {featured.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  priority={index < 3}
                  compact
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <div className="mt-12 flex justify-center">
          <Link
            href="/inventory"
            className="inline-flex items-center justify-center border border-gold-light/40 px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
          >
            View full inventory
          </Link>
        </div>
      </div>
    </section>
  );
}
