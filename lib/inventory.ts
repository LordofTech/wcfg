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
  status?: "available" | "reserved" | "sold";
  source?: "wcfg" | "adscars" | string;
  sourceUrl?: string;
  mileage?: string;
  vin?: string;
}

function normalize(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    brandSlug: vehicle.brandSlug || marqueToSlug(vehicle.brand),
    status: vehicle.status ?? "available",
    source: vehicle.source ?? "wcfg",
  };
}

export const inventory: Vehicle[] = (inventoryData as Vehicle[]).map(normalize);

export function getLocalInventory(brandSlug?: string): Vehicle[] {
  if (!brandSlug) return inventory;
  return inventory.filter((vehicle) => vehicle.brandSlug === brandSlug);
}

export function getLocalVehicleById(id: string): Vehicle | null {
  return inventory.find((vehicle) => vehicle.id === id) ?? null;
}

export function getFeaturedInventory(limit = 9): Vehicle[] {
  const featured = inventory.filter((vehicle) => vehicle.source === "wcfg");
  if (featured.length >= limit) return featured.slice(0, limit);
  return [...featured, ...inventory.filter((v) => v.source !== "wcfg")].slice(
    0,
    limit
  );
}
