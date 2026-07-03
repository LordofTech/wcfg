import { isBrandSlug, type BrandSlug } from "@/lib/brands";
import {
  getLocalInventory,
  getLocalVehicleById,
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
  };
}

async function fetchFromSupabase(brandSlug?: BrandSlug): Promise<Vehicle[] | null> {
  if (!isSupabasePublicConfigured()) return null;

  try {
    const supabase = getSupabasePublic();
    let query = supabase
      .from("vehicles")
      .select(
        "id, brand, brand_slug, model, year, highlight, price_label, image_src, image_alt, status, source, source_url, mileage, vin"
      )
      .eq("status", "available")
      .order("brand")
      .order("year", { ascending: false });

    if (brandSlug) {
      query = query.eq("brand_slug", brandSlug);
    }

    const { data, error } = await query;
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
    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "id, brand, brand_slug, model, year, highlight, price_label, image_src, image_alt, status, source, source_url, mileage, vin"
      )
      .eq("id", id)
      .eq("status", "available")
      .maybeSingle();

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

export async function listVehicles(brandSlug?: string): Promise<Vehicle[]> {
  const slug = brandSlug && isBrandSlug(brandSlug) ? brandSlug : undefined;
  const remote = await fetchFromSupabase(slug);
  if (remote !== null) return remote;
  return getLocalInventory(slug);
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const remote = await fetchOneFromSupabase(id);
  if (remote !== undefined) return remote;
  return getLocalVehicleById(id);
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
  };
}
