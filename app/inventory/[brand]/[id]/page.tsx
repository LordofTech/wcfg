import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Mail, Phone, ShieldCheck } from "lucide-react";
import InventoryShell from "@/components/InventoryShell";
import { getBrandBySlug } from "@/lib/brands";
import {
  CONTACT_PHONE_DISPLAY,
  mailtoVehicleInterest,
  telHref,
} from "@/lib/contact";
import { inventory } from "@/lib/inventory";
import { getVehicleById } from "@/lib/inventory-service";

interface VehicleDetailPageProps {
  params: Promise<{ brand: string; id: string }>;
}

export function generateStaticParams() {
  return inventory.map((vehicle) => ({
    brand: vehicle.brandSlug,
    id: vehicle.id,
  }));
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return { title: "Vehicle Not Found" };
  }

  return {
    title: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    description: `${vehicle.highlight}. Contact WCFG to inquire about this ${vehicle.brand} ${vehicle.model}.`,
  };
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { brand: brandSlug, id } = await params;
  const brand = getBrandBySlug(brandSlug);
  const vehicle = await getVehicleById(id);

  if (!brand || !vehicle || vehicle.brandSlug !== brand.slug) {
    notFound();
  }

  const emailHref = mailtoVehicleInterest(vehicle);

  return (
    <InventoryShell>
      <section className="relative px-6 py-16 md:px-8 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href={brand.href}
            className="font-sans text-[11px] font-light uppercase tracking-luxury text-mist transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
          >
            ← Back to {brand.name}
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-[16/11] overflow-hidden rounded-sm border border-gold-light/15 bg-charcoal-velvet">
              <Image
                src={vehicle.imageSrc}
                alt={vehicle.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-velvet/80 via-transparent to-pitch/20" />
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold-light/30 bg-pitch/70 px-2.5 py-1 font-sans text-[9px] font-light uppercase tracking-luxury text-gold-light backdrop-blur-sm">
                  <ShieldCheck size={12} strokeWidth={1.5} aria-hidden />
                  WCFG Curated
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
                {vehicle.brand} · {vehicle.year}
              </p>
              <h1 className="mt-3 font-display text-4xl font-medium tracking-wide text-ivory md:text-5xl">
                {vehicle.model}
              </h1>
              <div className="divider-gold my-6 w-20" />
              <p className="font-sans text-base font-light leading-relaxed text-mist">
                {vehicle.highlight}
              </p>

              <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-sm border border-gold-light/20 bg-pitch/40 px-3 py-2">
                <BadgeCheck size={14} className="shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden />
                <span className="font-sans text-[10px] font-light uppercase tracking-wide text-gold-light/90">
                  WCFG Curated Selection
                </span>
              </div>

              <p className="mt-8 font-sans text-sm font-light text-mist">
                Pricing:{" "}
                <span className="text-ivory">{vehicle.priceLabel}</span>
              </p>
              <p className="mt-2 font-sans text-xs font-light text-mist/80">
                Reference ID: {vehicle.id}
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <a
                  href={emailHref}
                  className="inline-flex items-center justify-center gap-2 bg-gold-gradient px-5 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
                >
                  <Mail size={15} strokeWidth={1.5} aria-hidden />
                  Email WCFG
                </a>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-2 border border-gold-light/40 px-5 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
                >
                  <Phone size={15} strokeWidth={1.5} aria-hidden />
                  Call {CONTACT_PHONE_DISPLAY}
                </a>
              </div>

              <Link
                href="/#consultation"
                className="mt-4 inline-flex items-center justify-center border border-gold-light/20 px-5 py-3 font-sans text-[11px] font-light uppercase tracking-luxury text-mist transition-colors hover:border-gold-light/40 hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
              >
                Or schedule a consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </InventoryShell>
  );
}
