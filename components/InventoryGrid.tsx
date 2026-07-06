"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import VehicleCard from "@/components/VehicleCard";
import { BRANDS } from "@/lib/brands";
import { inventory } from "@/lib/inventory";
import { luxuryEase } from "@/lib/motion";

const HOMEPAGE_LIMIT = 18;
const TOP_MARQUES = BRANDS.slice(0, 8);

function marquePillClass(active: boolean) {
  return [
    "rounded-sm border px-4 py-2 font-sans text-[10px] font-light uppercase tracking-luxury transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch",
    active
      ? "border-gold-light/50 bg-gold-light/10 text-gold-light"
      : "border-gold-light/20 bg-charcoal-velvet/60 text-mist hover:border-gold-light/40 hover:text-gold-light",
  ].join(" ");
}

export default function InventoryGrid() {
  const [activeMarque, setActiveMarque] = useState<string | null>(null);

  const displayed = useMemo(() => {
    const pool = activeMarque
      ? inventory.filter((vehicle) => vehicle.brandSlug === activeMarque)
      : inventory;
    return pool.slice(0, HOMEPAGE_LIMIT);
  }, [activeMarque]);

  const totalAvailable = activeMarque
    ? inventory.filter((vehicle) => vehicle.brandSlug === activeMarque).length
    : inventory.length;

  return (
    <section
      id="inventory"
      className="relative scroll-mt-28 border-y border-gold-light/10 bg-charcoal px-6 py-24 md:px-8 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Specializing in the World's Finest Brands"
          title="Curated Inventory"
          description="Premium units, personally vetted. Each vehicle is presented as a WCFG-managed allocation, sourced, inspected, and prepared for a seamless white-glove acquisition."
        />

        <LayoutGroup>
          <div
            className="mb-10 flex flex-wrap items-center justify-center gap-2"
            role="navigation"
            aria-label="Filter by marque"
          >
            <button
              type="button"
              onClick={() => setActiveMarque(null)}
              className={marquePillClass(activeMarque === null)}
              aria-pressed={activeMarque === null}
            >
              All
            </button>
            {TOP_MARQUES.map((brand) => (
              <button
                key={brand.slug}
                type="button"
                onClick={() => setActiveMarque(brand.slug)}
                className={marquePillClass(activeMarque === brand.slug)}
                aria-pressed={activeMarque === brand.slug}
              >
                {brand.name}
              </button>
            ))}
            <Link
              href="/inventory"
              className="rounded-sm border border-transparent px-3 py-2 font-sans text-[10px] font-light uppercase tracking-luxury text-gold-light/80 underline-offset-4 transition-colors hover:text-gold-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              All marques
            </Link>
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
              {displayed.map((vehicle, index) => (
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

        <div className="mt-12 flex flex-col items-center gap-3">
          {totalAvailable > HOMEPAGE_LIMIT ? (
            <p className="font-sans text-xs font-light text-mist">
              Showing {displayed.length} of {totalAvailable} available units
            </p>
          ) : null}
          <Link
            href={activeMarque ? `/inventory/${activeMarque}` : "/inventory"}
            className="inline-flex items-center justify-center border border-gold-light/40 px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            View full inventory
          </Link>
        </div>
      </div>
    </section>
  );
}
