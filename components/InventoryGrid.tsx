"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { MARQUES, type Marque } from "@/lib/brands";
import { inventory, type Vehicle } from "@/lib/inventory";
import { luxuryEase } from "@/lib/motion";

type FilterValue = "All" | Marque;

function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: luxuryEase }}
      className="group relative overflow-hidden rounded-sm border border-gold-light/15 bg-charcoal-velvet transition-shadow duration-500 hover:border-gold-light/40 hover:shadow-gold"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-charcoal-soft via-charcoal-velvet to-pitch">
        <Image
          src={vehicle.imageSrc}
          alt={vehicle.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-velvet via-pitch/25 to-pitch/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(212,175,55,0.12),transparent_55%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-8 rotate-6 bg-gradient-to-br from-gold-light/20 via-transparent to-transparent" />
        </div>
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold-light/30 bg-pitch/70 px-2.5 py-1 font-sans text-[9px] font-light uppercase tracking-luxury text-gold-light backdrop-blur-sm">
            <ShieldCheck size={12} strokeWidth={1.5} aria-hidden />
            WCFG Managed
          </span>
        </div>
        <div className="absolute inset-0 flex items-end p-5">
          <p className="font-display text-2xl font-medium tracking-wide text-ivory/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:translate-y-[-2px]">
            {vehicle.brand}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="font-sans text-[10px] font-light uppercase tracking-luxury text-mist">
            {vehicle.year}
          </p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-wide text-ivory">
            {vehicle.model}
          </h3>
          <p className="mt-2 font-sans text-xs font-light text-mist">
            {vehicle.highlight}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-sm border border-gold-light/20 bg-pitch/40 px-3 py-2">
          <BadgeCheck size={14} className="shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden />
          <span className="font-sans text-[10px] font-light uppercase tracking-wide text-gold-light/90">
            WCFG Certified History &amp; Inspection
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gold-light/10 pt-4">
          <p className="font-sans text-xs font-light text-mist">{vehicle.priceLabel}</p>
          <a
            href="#consultation"
            className="inline-flex items-center justify-center bg-gold-gradient px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-pitch transition-shadow duration-300 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-velvet"
          >
            Secure this Vehicle
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function InventoryGrid() {
  const [filter, setFilter] = useState<FilterValue>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return inventory;
    return inventory.filter((vehicle) => vehicle.brand === filter);
  }, [filter]);

  const filters: FilterValue[] = ["All", ...MARQUES];

  return (
    <section id="inventory" className="relative scroll-mt-28 px-6 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Curated Inventory"
          title="Premium Units, Personally Vetted"
          description="Each vehicle is presented as a WCFG-managed premium unit — sourced, inspected, and prepared for a seamless white-glove acquisition."
        />

        <LayoutGroup>
          <div
            className="mb-10 flex flex-wrap justify-center gap-2"
            role="group"
            aria-label="Filter by marque"
          >
            {filters.map((marque) => {
              const active = filter === marque;
              return (
                <button
                  key={marque}
                  type="button"
                  onClick={() => setFilter(marque)}
                  aria-pressed={active}
                  className={`rounded-sm border px-4 py-2 font-sans text-[10px] font-light uppercase tracking-luxury transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch ${
                    active
                      ? "border-gold-light/50 bg-gold-gradient text-pitch shadow-gold-sm"
                      : "border-gold-light/20 bg-charcoal-velvet/60 text-mist hover:border-gold-light/40 hover:text-gold-light"
                  }`}
                >
                  {marque}
                </button>
              );
            })}
          </div>

          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  priority={index < 3}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center font-sans text-sm font-light text-mist">
            No vehicles currently listed for this marque. Request custom sourcing below.
          </p>
        ) : null}
      </div>
    </section>
  );
}
