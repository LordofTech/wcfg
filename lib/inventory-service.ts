import { isBrandSlug, type BrandSlug } from "@/lib/brands";
import {
  getLocalInventory,
  getLocalVehicleById,
  sortInventory,
  type Vehicle,
} from "@/lib/inventory";
import {
  getSupabasePublic,
  isSupabasePublicConfigured,
} from "@/lib/supabase/public";

interface VehicleRow {
  id: string;
  brand: string;
  brand_slug: string;
  model: string;
  year: number;
  highlight: string;
  price_label: string;
  image_src: string;
  image_alt: string;
  status: string;
  source?: string | null;
  source_url?: string | null;
  mileage?: string | null;
  vin?: string | null;
  featured?: boolean | null;
}

function mapRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    brand: row.brand,
    brandSlug: row.brand_slug,
    model: row.model,
    year: row.year,
    highlight: row.highlight,
    priceLabel: row.price_label,
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    status: row.status as Vehicle["status"],
    source: row.source ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    mileage: row.mileage ?? undefined,
    vin: row.vin ?? undefined,
    featured: row.featured === true,
  };
}

const VEHICLE_SELECT_WITH_FEATURED =
  "id, brand, brand_slug, model, year, highlight, price_label, image_src, image_alt, status, source, source_url, mileage, vin, featured";
const VEHICLE_SELECT_BASE =
  "id, brand, brand_slug, model, year, highlight, price_label, image_src, image_alt, status, source, source_url, mileage, vin";

async function fetchFromSupabase(brandSlug?: BrandSlug): Promise<Vehicle[] | null> {
  if (!isSupabasePublicConfigured()) return null;

  try {
    const supabase = getSupabasePublic();

    const runQuery = async (select: string, orderFeatured: boolean) => {
      let query = supabase
        .from("vehicles")
        .select(select)
        .eq("status", "available");

      if (orderFeatured) {
        query = query.order("featured", { ascending: false });
      }
      query = query.order("year", { ascending: false });

      if (brandSlug) {
        query = query.eq("brand_slug", brandSlug);
      }

      return query;
    };

    let { data, error } = await runQuery(VEHICLE_SELECT_WITH_FEATURED, true);

    if (error?.message?.includes("featured")) {
      ({ data, error } = await runQuery(VEHICLE_SELECT_BASE, false));
    }

    if (error || !data) {
      console.warn("Inventory service: Supabase query failed, using local fallback.", error?.message);
      return null;
    }

    return data.map((row) => mapRow(row as VehicleRow));
  } catch (error) {
    console.warn("Inventory service: Supabase unavailable, using local fallback.", error);
    return null;
  }
}

async function fetchOneFromSupabase(id: string): Promise<Vehicle | null | undefined> {
  if (!isSupabasePublicConfigured()) return undefined;

  try {
    const supabase = getSupabasePublic();

    let { data, error } = await supabase
      .from("vehicles")
      .select(VEHICLE_SELECT_WITH_FEATURED)
      .eq("id", id)
      .eq("status", "available")
      .maybeSingle();

    if (error?.message?.includes("featured")) {
      ({ data, error } = await supabase
        .from("vehicles")
        .select(VEHICLE_SELECT_BASE)
        .eq("id", id)
        .eq("status", "available")
        .maybeSingle());
    }

    if (error) {
      console.warn("Inventory service: Supabase single query failed.", error.message);
      return undefined;
    }

    if (!data) return null;
    return mapRow(data as VehicleRow);
  } catch (error) {
    console.warn("Inventory service: Supabase unavailable for single vehicle.", error);
    return undefined;
  }
}

function overlayLocalFlags(remote: Vehicle[], local: Vehicle[]): Vehicle[] {
  const localById = new Map(local.map((vehicle) => [vehicle.id, vehicle]));
  return remote.map((vehicle) => {
    const localVehicle = localById.get(vehicle.id);
    if (!localVehicle) return vehicle;
    return {
      ...vehicle,
      featured: localVehicle.featured === true || vehicle.featured === true,
      source: vehicle.source ?? localVehicle.source,
    };
  });
}

export async function listVehicles(brandSlug?: string): Promise<Vehicle[]> {
  const slug = brandSlug && isBrandSlug(brandSlug) ? brandSlug : undefined;
  const local = getLocalInventory(slug);
  const remote = await fetchFromSupabase(slug);
  if (remote === null) return local;

  // Keep local featured / curated units even if Supabase seed is behind.
  const remoteIds = new Set(remote.map((vehicle) => vehicle.id));
  const missingLocal = local.filter(
    (vehicle) =>
      !remoteIds.has(vehicle.id) &&
      (vehicle.featured || vehicle.source === "wcfg")
  );
  return sortInventory([
    ...missingLocal,
    ...overlayLocalFlags(remote, local),
  ]);
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const local = getLocalVehicleById(id);
  const remote = await fetchOneFromSupabase(id);
  if (remote) {
    return {
      ...remote,
      featured: local?.featured === true || remote.featured === true,
      source: remote.source ?? local?.source,
    };
  }
  return local;
}

export function vehicleToJson(vehicle: Vehicle) {
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    brandSlug: vehicle.brandSlug,
    model: vehicle.model,
    year: vehicle.year,
    highlight: vehicle.highlight,
    priceLabel: vehicle.priceLabel,
    imageSrc: vehicle.imageSrc,
    imageAlt: vehicle.imageAlt,
    status: vehicle.status ?? "available",
    source: vehicle.source,
    sourceUrl: vehicle.sourceUrl,
    mileage: vehicle.mileage,
    vin: vehicle.vin,
    featured: vehicle.featured === true,
  };
}
