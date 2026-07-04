"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import InventoryFilters from "@/components/InventoryFilters";
import VehicleCard from "@/components/VehicleCard";
import SectionHeading from "@/components/SectionHeading";
import { BRANDS, type Brand } from "@/lib/brands";
import {
  filterInventory,
  sortInventory,
  type Vehicle,
} from "@/lib/inventory";
import { luxuryEase } from "@/lib/motion";

interface InventoryListingProps {
  vehicles: Vehicle[];
  activeBrand?: Brand | null;
  title?: string;
  description?: string;
  eyebrow?: string;
  showBrandFilters?: boolean;
  backHref?: string;
  backLabel?: string;
}

function InventoryListingContent({
  vehicles,
  activeBrand = null,
  title = "Premium Units, Personally Vetted",
  description = "Each vehicle is presented as a WCFG-managed premium unit, sourced, inspected, and prepared for a seamless white-glove acquisition.",
  eyebrow = "Curated Inventory",
  showBrandFilters = true,
  backHref,
  backLabel = "Back to all inventory",
}: InventoryListingProps) {
  const searchParams = useSearchParams();

  const manufacturer = activeBrand
    ? activeBrand.slug
    : (searchParams.get("manufacturer")?.trim() ?? "");
  const model = searchParams.get("model")?.trim() ?? "";
  const year = searchParams.get("year")?.trim() ?? "";

  const filteredVehicles = useMemo(
    () =>
      sortInventory(
        filterInventory(vehicles, {
          manufacturer,
          model,
          year,
        })
      ),
    [vehicles, manufacturer, model, year]
  );

  return (
    <section className="relative scroll-mt-28 px-6 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        {backHref ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: luxuryEase }}
            className="mb-8"
          >
            <Link
              href={backHref}
              className="font-sans text-[11px] font-light uppercase tracking-luxury text-mist transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
            >
              ← {backLabel}
            </Link>
          </motion.div>
        ) : null}

        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        {showBrandFilters ? (
          <LayoutGroup>
            <div
              className="mb-6 flex flex-wrap justify-center gap-2"
              role="navigation"
              aria-label="Browse by marque"
            >
              <Link
                href="/inventory"
                className={`rounded-sm border px-4 py-2 font-sans text-[10px] font-light uppercase tracking-luxury transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch ${
                  !activeBrand
                    ? "border-gold-light/50 bg-gold-gradient text-pitch shadow-gold-sm"
                    : "border-gold-light/20 bg-charcoal-velvet/60 text-mist hover:border-gold-light/40 hover:text-gold-light"
                }`}
              >
                All
              </Link>
              {BRANDS.map((brand) => {
                const active = activeBrand?.slug === brand.slug;
                return (
                  <Link
                    key={brand.slug}
                    href={brand.href}
                    className={`rounded-sm border px-4 py-2 font-sans text-[10px] font-light uppercase tracking-luxury transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch ${
                      active
                        ? "border-gold-light/50 bg-gold-gradient text-pitch shadow-gold-sm"
                        : "border-gold-light/20 bg-charcoal-velvet/60 text-mist hover:border-gold-light/40 hover:text-gold-light"
                    }`}
                  >
                    {brand.name}
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>
        ) : null}

        <InventoryFilters
          vehicles={vehicles}
          lockedManufacturer={activeBrand?.slug ?? null}
          resultCount={filteredVehicles.length}
        />

        {filteredVehicles.length > 0 ? (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredVehicles.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  priority={index < 3}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="glass-strong mx-auto mt-4 max-w-xl rounded-sm border border-gold-light/15 px-8 py-14 text-center">
            <p className="font-display text-2xl font-medium tracking-wide text-ivory">
              {vehicles.length === 0
                ? `No vehicles currently listed${activeBrand ? ` for ${activeBrand.name}` : ""}.`
                : "No vehicles match these filters."}
            </p>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-mist">
              {vehicles.length === 0
                ? "Request custom sourcing and our advisors will locate the right allocation for you."
                : "Try adjusting or clearing your filters to see more inventory."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {vehicles.length > 0 ? (
                <Link
                  href={activeBrand ? activeBrand.href : "/inventory"}
                  className="inline-flex items-center justify-center bg-gold-gradient px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
                >
                  Clear filters
                </Link>
              ) : (
                <Link
                  href="/#consultation"
                  className="inline-flex items-center justify-center bg-gold-gradient px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
                >
                  Schedule a Consultation
                </Link>
              )}
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center border border-gold-light/40 px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
              >
                Browse all inventory
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function InventoryListing(props: InventoryListingProps) {
  return (
    <Suspense
      fallback={
        <section className="relative scroll-mt-28 px-6 py-24 md:px-8 md:py-32">
          <div className="relative mx-auto max-w-6xl">
            <div className="h-40 animate-pulse rounded-sm bg-charcoal-velvet/40" />
          </div>
        </section>
      }
    >
      <InventoryListingContent {...props} />
    </Suspense>
  );
}
