import inventoryData from "@/data/inventory.json";
import { marqueToSlug, type BrandSlug } from "./brands";
import vehicleSpecsData from "@/data/vehicle-specs.json";
import type { VehicleSpecs, VehicleSpecsById } from "./vehicle-specs";

const vehicleSpecsById = vehicleSpecsData as VehicleSpecsById;

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
  images?: string[];
  status?: "available" | "reserved" | "sold";
  source?: "adscars" | "listings" | string;
  sourceUrl?: string;
  mileage?: string;
  vin?: string;
  featured?: boolean;
  specs?: VehicleSpecs;
}

function normalize(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    brandSlug: vehicle.brandSlug || marqueToSlug(vehicle.brand),
    status: vehicle.status ?? "available",
    source: vehicle.source ?? "adscars",
    featured: vehicle.featured === true,
    specs: vehicle.specs ?? vehicleSpecsById[vehicle.id],
  };
}

export function sortInventory(vehicles: Vehicle[]): Vehicle[] {
  return [...vehicles].sort((a, b) => {
    const featuredDelta = Number(b.featured) - Number(a.featured);
    if (featuredDelta !== 0) return featuredDelta;
    if (b.year !== a.year) return b.year - a.year;
    const brandDelta = a.brand.localeCompare(b.brand, undefined, {
      sensitivity: "base",
    });
    if (brandDelta !== 0) return brandDelta;
    return a.model.localeCompare(b.model, undefined, { sensitivity: "base" });
  });
}

export interface InventoryFilterState {
  manufacturer: string;
  model: string;
  year: string;
}

export function filterInventory(
  vehicles: Vehicle[],
  filters: InventoryFilterState
): Vehicle[] {
  return vehicles.filter((vehicle) => {
    if (filters.manufacturer && vehicle.brandSlug !== filters.manufacturer) {
      return false;
    }
    if (
      filters.model &&
      vehicle.model.toLowerCase() !== filters.model.toLowerCase()
    ) {
      return false;
    }
    if (filters.year && String(vehicle.year) !== filters.year) {
      return false;
    }
    return true;
  });
}

export function getManufacturerOptions(
  vehicles: Vehicle[]
): { slug: string; name: string }[] {
  const bySlug = new Map<string, string>();
  for (const vehicle of vehicles) {
    if (!bySlug.has(vehicle.brandSlug)) {
      bySlug.set(vehicle.brandSlug, vehicle.brand);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
}

export function getModelOptions(
  vehicles: Vehicle[],
  manufacturerSlug?: string
): string[] {
  const pool = manufacturerSlug
    ? vehicles.filter((vehicle) => vehicle.brandSlug === manufacturerSlug)
    : vehicles;
  return [...new Set(pool.map((vehicle) => vehicle.model))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export function getYearOptions(
  vehicles: Vehicle[],
  manufacturerSlug?: string,
  model?: string
): number[] {
  let pool = vehicles;
  if (manufacturerSlug) {
    pool = pool.filter((vehicle) => vehicle.brandSlug === manufacturerSlug);
  }
  if (model) {
    pool = pool.filter(
      (vehicle) => vehicle.model.toLowerCase() === model.toLowerCase()
    );
  }
  return [...new Set(pool.map((vehicle) => vehicle.year))].sort((a, b) => b - a);
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
  const listings = inventory.filter(
    (vehicle) => vehicle.source === "listings" && !vehicle.featured
  );
  const rest = inventory.filter(
    (vehicle) => vehicle.source !== "listings" && !vehicle.featured
  );
  return [...spotlight, ...listings, ...rest].slice(0, limit);
}
