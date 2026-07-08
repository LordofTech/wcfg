"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Mail, Phone, Sparkles } from "lucide-react";
import {
  CONTACT_PHONE_DISPLAY,
  mailtoVehicleInterest,
  telHref,
} from "@/lib/contact";
import { getFeaturedVehicle } from "@/lib/inventory";
import { luxuryEase } from "@/lib/motion";
import { priceLabelClassName } from "@/lib/price-label";
import { yearLabelClassName } from "@/lib/year-label";

const vehicle = getFeaturedVehicle();

export default function FeaturedInStock() {
  if (!vehicle) return null;

  const detailHref = `/inventory/${vehicle.brandSlug}/${vehicle.id}`;
  const emailHref = mailtoVehicleInterest(vehicle);

  return (
    <section
      id="featured"
      className="relative scroll-mt-28 px-6 py-20 md:px-8 md:py-28"
      aria-labelledby="featured-in-stock-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: luxuryEase }}
          className="mb-8 text-center"
        >
          <p className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light sm:text-[11px]">
            Featured In Stock
          </p>
          <h2
            id="featured-in-stock-heading"
            className="mt-3 font-display text-3xl font-medium tracking-wide text-ivory md:text-4xl"
          >
            Available Now
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-mist">
            Our current spotlight allocation, ready for white-glove acquisition.
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: luxuryEase, delay: 0.08 }}
          className="overflow-hidden rounded-sm border border-gold-light/25 bg-charcoal-velvet shadow-gold"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[16/11] min-h-[280px] lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={vehicle.imageSrc}
                alt={vehicle.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-velvet via-pitch/20 to-pitch/10 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-charcoal-velvet/40" />
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold-light/40 bg-pitch/75 px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-luxury text-gold-light backdrop-blur-sm">
                  <Sparkles size={13} strokeWidth={1.5} aria-hidden />
                  Featured In Stock
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-5 p-6 md:p-10">
              <div>
                <p className={`${yearLabelClassName} text-gold-light`}>
                  {vehicle.brand} · {vehicle.year} · New
                </p>
                <h3 className="mt-2 font-display text-3xl font-medium tracking-wide text-ivory md:text-4xl">
                  {vehicle.model}
                </h3>
                <div className="divider-gold my-5 w-16" />
                <p className="font-sans text-sm font-light leading-relaxed text-mist">
                  {vehicle.highlight}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-sm border border-gold-light/20 bg-pitch/40 px-3 py-2">
                <BadgeCheck size={14} className="shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden />
                <span className="font-sans text-[10px] font-light uppercase tracking-wide text-gold-light/90">
                  WCFG Curated · Available Now
                </span>
              </div>

              <p className="font-sans text-sm font-light text-mist">
                Pricing:{" "}
                <span className={priceLabelClassName(vehicle.priceLabel)}>
                  {vehicle.priceLabel}
                </span>
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={emailHref}
                  className="inline-flex items-center justify-center gap-2 bg-gold-gradient px-5 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-velvet"
                >
                  <Mail size={15} strokeWidth={1.5} aria-hidden />
                  Email WCFG
                </a>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-2 border border-gold-light/40 px-5 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-velvet"
                >
                  <Phone size={15} strokeWidth={1.5} aria-hidden />
                  Call {CONTACT_PHONE_DISPLAY}
                </a>
              </div>

              <Link
                href={detailHref}
                className="inline-flex items-center justify-center border border-gold-light/20 px-5 py-3 font-sans text-[11px] font-light uppercase tracking-luxury text-mist transition-colors hover:border-gold-light/40 hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
              >
                View full details
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
