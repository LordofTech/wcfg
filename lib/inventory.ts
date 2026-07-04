import inventoryData from "@/data/inventory.json";
import { marqueToSlug, type BrandSlug } from "./brands";

export interface Vehicle {
  id: string;
  brand: string;
  brandSlug: BrandSlug;
  model: string;
  year: number;
  highlight: string;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional gallery angles (primary is also `imageSrc`) */
  images?: string[];
  status?: "available" | "reserved" | "sold";
  source?: "wcfg" | "adscars" | string;
  sourceUrl?: string;
  mileage?: string;
  vin?: string;
  /** Promoted “Featured In Stock” unit — shown first on homepage and listings */
  featured?: boolean;
}

function normalize(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    brandSlug: vehicle.brandSlug || marqueToSlug(vehicle.brand),
    status: vehicle.status ?? "available",
    source: vehicle.source ?? "wcfg",
    featured: vehicle.featured === true,
  };
}

/** Featured units first, then WCFG curated, then remaining stock. */
export function sortInventory(vehicles: Vehicle[]): Vehicle[] {
  return [...vehicles].sort((a, b) => {
    const featuredDelta = Number(b.featured) - Number(a.featured);
    if (featuredDelta !== 0) return featuredDelta;
    const wcfgDelta =
      Number(b.source === "wcfg") - Number(a.source === "wcfg");
    if (wcfgDelta !== 0) return wcfgDelta;
    return b.year - a.year;
  });
}

export const inventory: Vehicle[] = sortInventory(
  (inventoryData as Vehicle[]).map(normalize)
);

export function getLocalInventory(brandSlug?: string): Vehicle[] {
  if (!brandSlug) return inventory;
  return inventory.filter((vehicle) => vehicle.brandSlug === brandSlug);
}

export function getLocalVehicleById(id: string): Vehicle | null {
  return inventory.find((vehicle) => vehicle.id === id) ?? null;
}

export function getFeaturedVehicle(): Vehicle | null {
  return inventory.find((vehicle) => vehicle.featured) ?? null;
}

export function getFeaturedInventory(limit = 9): Vehicle[] {
  const spotlight = inventory.filter((vehicle) => vehicle.featured);
  const curated = inventory.filter(
    (vehicle) => vehicle.source === "wcfg" && !vehicle.featured
  );
  const rest = inventory.filter(
    (vehicle) => vehicle.source !== "wcfg" && !vehicle.featured
  );
  return [...spotlight, ...curated, ...rest].slice(0, limit);
}
