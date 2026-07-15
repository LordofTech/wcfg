import Link from "next/link";
import type { Metadata } from "next";
import InventoryShell from "@/components/InventoryShell";
import VehicleInquiryForm from "@/components/VehicleInquiryForm";

export const metadata: Metadata = {
  title: "Vehicle Inquiry",
  description:
    "Send your vehicle inquiry directly to WCFG sales for fast concierge follow-up.",
};

interface InquiryPageProps {
  searchParams: Promise<{
    vehicle?: string;
  }>;
}

export default async function InquiryPage({ searchParams }: InquiryPageProps) {
  const params = await searchParams;
  const vehicle = typeof params.vehicle === "string" ? params.vehicle : "";

  return (
    <InventoryShell>
      <section className="relative px-6 py-16 md:px-8 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gold-radial opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-3xl">
          <Link
            href="/inventory"
            className="font-sans text-[11px] font-light uppercase tracking-luxury text-mist transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
          >
            ← Back to inventory
          </Link>

          <div className="mt-8 mb-8">
            <p className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light sm:text-[11px]">
              Direct Sales Inquiry
            </p>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-wide text-ivory md:text-4xl">
              Tell Us About Your Selected Vehicle
            </h1>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-mist">
              Submit your details and our team will email you directly from sales@wcfgluxautos.com.
            </p>
          </div>

          <VehicleInquiryForm
            initialVehicleLabel={vehicle}
          />
        </div>
      </section>
    </InventoryShell>
  );
}
