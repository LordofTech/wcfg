import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InventoryListing from "@/components/InventoryListing";
import InventoryShell from "@/components/InventoryShell";
import { BRANDS, getBrandBySlug } from "@/lib/brands";
import { listVehicles } from "@/lib/inventory-service";

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export function generateStaticParams() {
  return BRANDS.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    return { title: "Inventory Not Found" };
  }

  return {
    title: `${brand.name} Inventory`,
    description: `Browse available ${brand.name} vehicles curated by WCFG Luxury Automobile Brokers. Email or call to secure your allocation.`,
  };
}

export default async function BrandInventoryPage({ params }: BrandPageProps) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const vehicles = await listVehicles(brand.slug);

  return (
    <InventoryShell>
      <InventoryListing
        vehicles={vehicles}
        activeBrand={brand}
        eyebrow={`${brand.name} Collection`}
        title={`${brand.name} Inventory`}
        description={`Every ${brand.name} unit is WCFG-managed — sourced, inspected, and prepared for white-glove acquisition. Contact us directly to secure a vehicle.`}
        backHref="/inventory"
        backLabel="Back to all inventory"
      />
    </InventoryShell>
  );
}
