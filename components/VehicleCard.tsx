"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Mail, Phone, ShieldCheck } from "lucide-react";
import {
  CONTACT_PHONE_DISPLAY,
  mailtoVehicleInterest,
  telHref,
} from "@/lib/contact";
import type { Vehicle } from "@/lib/inventory";
import { luxuryEase } from "@/lib/motion";

interface VehicleCardProps {
  vehicle: Vehicle;
  priority?: boolean;
  /** Compact CTAs for homepage; full CTAs on inventory pages */
  compact?: boolean;
  showDetailLink?: boolean;
}

export default function VehicleCard({
  vehicle,
  priority = false,
  compact = false,
  showDetailLink = true,
}: VehicleCardProps) {
  const detailHref = `/inventory/${vehicle.brandSlug}/${vehicle.id}`;
  const emailHref = mailtoVehicleInterest(vehicle);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: luxuryEase }}
      id={vehicle.id}
      className="group relative scroll-mt-32 overflow-hidden rounded-sm border border-gold-light/15 bg-charcoal-velvet transition-shadow duration-500 hover:border-gold-light/40 hover:shadow-gold"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-charcoal-soft via-charcoal-velvet to-pitch">
        {showDetailLink ? (
          <Link href={detailHref} className="absolute inset-0 z-10" aria-label={`View ${vehicle.year} ${vehicle.brand} ${vehicle.model}`}>
            <span className="sr-only">View details</span>
          </Link>
        ) : null}
        {vehicle.imageSrc ? (
          <Image
            src={vehicle.imageSrc}
            alt={vehicle.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-velvet via-pitch/25 to-pitch/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(212,175,55,0.12),transparent_55%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-8 rotate-6 bg-gradient-to-br from-gold-light/20 via-transparent to-transparent" />
        </div>
        <div className="absolute left-4 top-4 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold-light/30 bg-pitch/70 px-2.5 py-1 font-sans text-[9px] font-light uppercase tracking-luxury text-gold-light backdrop-blur-sm">
            <ShieldCheck size={12} strokeWidth={1.5} aria-hidden />
            WCFG Curated
          </span>
        </div>
        <div className="absolute inset-0 flex items-end p-5">
          <p className="font-display text-2xl font-medium tracking-wide text-ivory/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:translate-y-[-2px]">
            {vehicle.brand}
          </p>
        </div>
      </div>

      <div className="relative z-20 space-y-4 p-5">
        <div>
          <p className="font-sans text-[10px] font-light uppercase tracking-luxury text-mist">
            {vehicle.year}
          </p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-wide text-ivory">
            {showDetailLink ? (
              <Link
                href={detailHref}
                className="transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
              >
                {vehicle.model}
              </Link>
            ) : (
              vehicle.model
            )}
          </h3>
          <p className="mt-2 font-sans text-xs font-light text-mist">
            {vehicle.highlight}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-sm border border-gold-light/20 bg-pitch/40 px-3 py-2">
          <BadgeCheck size={14} className="shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden />
          <span className="font-sans text-[10px] font-light uppercase tracking-wide text-gold-light/90">
            WCFG Curated Selection
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gold-light/10 pt-4">
          <p className="font-sans text-xs font-light text-mist">{vehicle.priceLabel}</p>
          {showDetailLink ? (
            <Link
              href={detailHref}
              className="font-sans text-[10px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:text-gold-highlight focus-visible:outline-none focus-visible:text-gold-highlight"
            >
              View details
            </Link>
          ) : null}
        </div>

        <div className={`grid gap-2 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}>
          <a
            href={emailHref}
            className="inline-flex items-center justify-center gap-2 bg-gold-gradient px-3 py-2.5 font-sans text-[10px] font-medium uppercase tracking-luxury text-pitch transition-shadow duration-300 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-velvet"
          >
            <Mail size={13} strokeWidth={1.5} aria-hidden />
            {compact ? "Email" : "Email WCFG"}
          </a>
          <a
            href={telHref}
            className="inline-flex items-center justify-center gap-2 border border-gold-light/40 px-3 py-2.5 font-sans text-[10px] font-medium uppercase tracking-luxury text-gold-light transition-colors duration-300 hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-velvet"
          >
            <Phone size={13} strokeWidth={1.5} aria-hidden />
            {compact ? "Call" : CONTACT_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </motion.article>
  );
}
