/**
 * Import public dealer listings from adscars.com (Autodynamics) for WCFG
 * curated inventory display. Aggregated from public listings for demo/curation.
 *
 * Usage: node scripts/import-adscars.mjs [--remote-images] [--skip-images]
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const imageDir = path.join(root, "public", "vehicles", "imported");
const MAX_LOCAL_BYTES = 50 * 1024 * 1024;
const USER_AGENT =
  "WCFG-Inventory/1.0 (curation-import; +https://wcfgbizbrokers.com)";

const args = new Set(process.argv.slice(2));
const forceRemote = args.has("--remote-images");
const skipImages = args.has("--skip-images");
const refreshImages = args.has("--refresh-images");

/** Canonical brand display names and slugs */
const BRAND_ALIASES = {
  "mercedes-benz": "Mercedes-Benz",
  "mercedes benz": "Mercedes-Benz",
  mercedes: "Mercedes-Benz",
  "rolls-royce": "Rolls-Royce",
  "rolls royce": "Rolls-Royce",
  ferrari: "Ferrari",
  lamborghini: "Lamborghini",
  porsche: "Porsche",
  bentley: "Bentley",
  corvette: "Corvette",
  chevrolet: "Chevrolet",
  chevy: "Chevrolet",
  "aston martin": "Aston Martin",
  "land rover": "Land Rover",
  "range rover": "Land Rover",
  "am general": "AM General",
  mclaren: "McLaren",
  "mercedes-amg": "Mercedes-Benz",
};

const BRAND_ACCENTS = {
  "Mercedes-Benz": "from-zinc-300/35 via-zinc-500/15 to-transparent",
  Ferrari: "from-red-600/40 via-red-900/20 to-transparent",
  "Rolls-Royce": "from-stone-200/30 via-amber-200/10 to-transparent",
  Lamborghini: "from-yellow-400/35 via-amber-700/20 to-transparent",
  Corvette: "from-red-500/35 via-zinc-800/20 to-transparent",
  Porsche: "from-amber-500/30 via-stone-600/20 to-transparent",
  Bentley: "from-emerald-700/35 via-green-900/20 to-transparent",
  Chevrolet: "from-yellow-500/30 via-zinc-700/20 to-transparent",
  "Aston Martin": "from-green-600/35 via-emerald-900/20 to-transparent",
  "Land Rover": "from-green-500/30 via-stone-700/20 to-transparent",
  McLaren: "from-orange-500/35 via-amber-800/20 to-transparent",
  BMW: "from-blue-500/30 via-zinc-700/20 to-transparent",
  Audi: "from-slate-300/30 via-zinc-600/20 to-transparent",
  Ford: "from-blue-600/30 via-zinc-800/20 to-transparent",
  Jeep: "from-green-700/30 via-stone-800/20 to-transparent",
  Lexus: "from-stone-300/30 via-zinc-600/20 to-transparent",
  Maserati: "from-blue-400/30 via-blue-900/20 to-transparent",
  Cadillac: "from-zinc-200/30 via-zinc-600/20 to-transparent",
  Dodge: "from-red-700/30 via-zinc-800/20 to-transparent",
  Genesis: "from-zinc-400/30 via-zinc-700/20 to-transparent",
};

const DEFAULT_ACCENT = "from-gold-light/25 via-zinc-700/15 to-transparent";

/**
 * WCFG units backed by car listings folder photos (not generic internet placeholders).
 * Adscars stock with listing photo overlays is kept via adscars import + apply-car-listings.
 */
const WCFG_LISTINGS_UNITS = [
  {
    id: "corvette-zr1-coupe-3lz-black",
    brand: "Corvette",
    model: "ZR1 Coupe 3LZ",
    year: 2026,
    highlight: "Available now · Black exterior · Twin-turbo LT7 · 1,064 hp",
    priceLabel: "$315,000",
    imageSrc: "/vehicles/corvette-zr1-coupe-3lz-black.webp",
    imageAlt: "New 2026 Chevrolet Corvette ZR1 Coupe 3LZ in black",
    source: "listings",
    featured: true,
  },
  {
    id: "cadillac-escalade-black",
    brand: "Cadillac",
    model: "Escalade",
    year: 2024,
    highlight: "Black exterior · Light interior · Available now",
    priceLabel: "Call for Price",
    imageSrc: "/vehicles/listings/cadillac-escalade-black.webp",
    imageAlt: "Black Cadillac Escalade with light interior",
    source: "listings",
  },
  {
    id: "ferrari-f8-tributo-yellow",
    brand: "Ferrari",
    model: "F8 Tributo",
    year: 2022,
    highlight: "Yellow exterior · Mid-engine V8 · Available now",
    priceLabel: "Call for Price",
    imageSrc: "/vehicles/listings/ferrari-f8-tributo-yellow.webp",
    imageAlt: "Ferrari F8 Tributo in yellow",
    source: "listings",
  },
  {
    id: "aston-martin-vantage-teal",
    brand: "Aston Martin",
    model: "Vantage",
    year: 2025,
    highlight: "Teal exterior · Carbon accents · Available now",
    priceLabel: "Call for Price",
    imageSrc: "/vehicles/listings/aston-martin-vantage-teal.webp",
    imageAlt: "Aston Martin Vantage coupe in teal",
    source: "listings",
  },
  {
    id: "mb-g63-2024",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    year: 2024,
    highlight: "White exterior · Red interior · Bull bar · Available now",
    priceLabel: "Call for Price",
    imageSrc: "/vehicles/listings/mb-g63-2024.webp",
    imageAlt: "White Mercedes-Benz G 63 AMG with red interior and bull bar",
    source: "listings",
  },
  {
    id: "rr-ghost-2023",
    brand: "Rolls-Royce",
    model: "Ghost Extended",
    year: 2023,
    highlight: "Two-tone silver and black · Starlight headliner",
    priceLabel: "Call for Price",
    imageSrc: "/vehicles/listings/rr-ghost-2023.webp",
    imageAlt: "Rolls-Royce Ghost two-tone silver and black",
    source: "listings",
  },
  {
    id: "rr-cullinan-2024",
    brand: "Rolls-Royce",
    model: "Cullinan Black Badge",
    year: 2024,
    highlight: "Matte black · White interior · Bespoke presence",
    priceLabel: "Call for Price",
    imageSrc: "/vehicles/listings/rr-cullinan-2024.webp",
    imageAlt: "Rolls-Royce Cullinan Black Badge matte black with white interior",
    source: "listings",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeBrand(rawMake, model = "") {
  const make = (rawMake || "").trim().replace(/\s+/g, " ");
  const key = make.toLowerCase();

  // Corvette models under Chevrolet → Corvette category
  if (
    key === "chevrolet" &&
    /\bcorvette\b/i.test(model)
  ) {
    return "Corvette";
  }

  if (BRAND_ALIASES[key]) return BRAND_ALIASES[key];

  // Title-case multi-word makes
  return make
    .split(" ")
    .map((part) => {
      if (part.toUpperCase() === part && part.length <= 3) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatPrice(raw) {
  const text = (raw || "").replace(/\s+/g, " ").trim();
  if (!text || text === "$0" || /^call/i.test(text)) return "Call for Price";
  const digits = text.replace(/[^\d]/g, "");
  if (!digits || Number(digits) === 0) return "Call for Price";
  return `$${Number(digits).toLocaleString("en-US")}`;
}

function formatMileage(raw) {
  const digits = String(raw || "").replace(/[^\d]/g, "");
  if (!digits || Number(digits) === 0) return null;
  return `${Number(digits).toLocaleString("en-US")} mi`;
}

function upgradeImageUrl(url) {
  if (!url) return null;
  // Prefer larger listing image when available
  return url.replace(/\/\d+x\d+\//, "/640x640/");
}

/** Adscars / Autorevo listing id from detail URL or `adscars-{id}` vehicle id. */
function extractListingId(sourceUrl, vehicleId) {
  if (sourceUrl) {
    const fromUrl = sourceUrl.match(/\/(\d{5,})\/?(?:\?|#|$)/);
    if (fromUrl) return fromUrl[1];
  }
  const fromId = vehicleId?.match(/^adscars-(\d+)$/);
  return fromId ? fromId[1] : null;
}

/** Keep only gallery photos that belong to this listing (not similar inventory). */
function imageBelongsToListing(url, listingId) {
  if (!listingId || !url) return false;
  return new RegExp(`-${listingId}(?:/|\\?)`).test(url);
}

/** Extract full-size gallery URLs from a vehicle detail page. */
function parseVehicleGallery(html, listingId) {
  const urls = [...html.matchAll(/https:\/\/cf-img\.autorevo\.com\/[^"'\s)]+/gi)].map(
    (m) => m[0]
  );
  const byPhoto = new Map();
  for (const raw of urls) {
    if (listingId && !imageBelongsToListing(raw, listingId)) continue;
    const idMatch = raw.match(/\/(\d+-\d+-revo\.jpg)/);
    if (!idMatch) continue;
    const photoId = idMatch[1];
    const upgraded = upgradeImageUrl(raw);
    if (!byPhoto.has(photoId)) byPhoto.set(photoId, upgraded);
  }
  return [...byPhoto.entries()]
    .sort((a, b) => {
      const ai = Number(a[0].split("-")[1]);
      const bi = Number(b[0].split("-")[1]);
      return ai - bi;
    })
    .map(([, url]) => url);
}

async function fetchVehicleGallery(sourceUrl, listingId) {
  try {
    const stockId = listingId ?? extractListingId(sourceUrl);
    const html = await fetchHtml(sourceUrl);
    const urls = parseVehicleGallery(html, stockId);
    return urls.length > 0 ? urls : null;
  } catch (error) {
    console.warn(`Gallery fetch failed for ${sourceUrl}:`, error.message);
    return null;
  }
}

function applyBrandOverrides(vehicle) {
  let v = vehicle;
  if (
    v.brand === "Corvette" ||
    v.brandSlug === "corvette" ||
    /corvette/i.test(v.model)
  ) {
    v = { ...v, year: 2026, imageAlt: v.imageAlt?.replace(/\b20\d{2}\b/, "2026") ?? v.imageAlt };
  }
  if (v.id === "corvette-zr1-coupe-3lz-black") {
    v = {
      ...v,
      year: 2026,
      priceLabel: "$315,000",
      imageAlt: "New 2026 Chevrolet Corvette ZR1 Coupe 3LZ in black",
    };
  }
  return v;
}

async function removeStaleGalleryFiles(vehicleId, keepCount) {
  const { readdir, unlink } = await import("node:fs/promises");
  const names = await readdir(imageDir).catch(() => []);
  for (const name of names) {
    if (!name.endsWith(".webp")) continue;
    if (name === `${vehicleId}.webp`) continue;
    if (!name.startsWith(`${vehicleId}-`)) continue;
    const index = Number(name.slice(vehicleId.length + 1, -".webp".length));
    if (Number.isFinite(index) && index > keepCount) {
      await unlink(path.join(imageDir, name)).catch(() => {});
    }
  }
}

async function downloadVehicleGallery(vehicle, useRemoteImages) {
  const listingId = extractListingId(vehicle.sourceUrl, vehicle.id);
  const galleryUrls = vehicle.sourceUrl
    ? await fetchVehicleGallery(vehicle.sourceUrl, listingId)
    : null;
  const urls =
    galleryUrls && galleryUrls.length > 0
      ? galleryUrls
      : vehicle.remoteImageSrc &&
          (!listingId || imageBelongsToListing(vehicle.remoteImageSrc, listingId))
        ? [vehicle.remoteImageSrc]
        : [];

  if (urls.length === 0) {
    vehicle.imageSrc = "";
    vehicle.images = undefined;
    return;
  }

  const localPaths = [];
  for (let i = 0; i < urls.length; i++) {
    const suffix = i === 0 ? "" : `-${i + 1}`;
    const filename = `${vehicle.id}${suffix}.webp`;
    const dest = path.join(imageDir, filename);
    const publicPath = `/vehicles/imported/${filename}`;

    if (useRemoteImages) {
      localPaths.push(upgradeImageUrl(urls[i]));
      continue;
    }

    try {
      if (refreshImages || !existsSync(dest)) {
        await downloadAsWebp(urls[i], dest);
        await sleep(60);
      }
      localPaths.push(publicPath);
    } catch (error) {
      console.warn(`Image ${i + 1} failed for ${vehicle.id}:`, error.message);
      localPaths.push(upgradeImageUrl(urls[i]));
    }
  }

  if (!useRemoteImages) {
    await removeStaleGalleryFiles(vehicle.id, urls.length);
  }

  vehicle.imageSrc = localPaths[0] || "";
  vehicle.images = localPaths.length > 1 ? localPaths : undefined;
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractField(block, className) {
  const re = new RegExp(
    `<span class="${className}">([\\s\\S]*?)<\\/span>`,
    "i"
  );
  const match = block.match(re);
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, "").trim()) : "";
}

function extractDd(block, className) {
  const re = new RegExp(
    `<dd class="${className}">([\\s\\S]*?)<\\/dd>`,
    "i"
  );
  const match = block.match(re);
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, "").trim()) : "";
}

/**
 * Parse "2024 Porsche 911 GT3  | Houston..." listing titles.
 * Year + model from the title are authoritative for Adscars parity.
 */
function parseListingTitle(text) {
  const cleaned = decodeHtml(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;

  const withPipe = cleaned.match(/^(\d{4})\s+(.+?)\s+\|/);
  const bare = cleaned.match(/^(\d{4})\s+(.+)$/);
  const match = withPipe || bare;
  if (!match) return null;

  return {
    year: Number(match[1]),
    vehicle: match[2].replace(/\s+/g, " ").trim(),
  };
}

function modelFromTitleVehicle(titleVehicle, make) {
  const vehicle = (titleVehicle || "").replace(/\s+/g, " ").trim();
  const makeNorm = (make || "").replace(/\s+/g, " ").trim();
  if (!vehicle) return "";
  if (!makeNorm) return vehicle;

  if (vehicle.toLowerCase().startsWith(makeNorm.toLowerCase())) {
    return vehicle.slice(makeNorm.length).replace(/^[-\s]+/, "").trim();
  }
  return vehicle;
}

function parseListings(html) {
  const chunks = html.split(/class="inventory_item[^"]*"/).slice(1);
  const vehicles = [];

  for (const block of chunks) {
    const hrefMatch = block.match(
      /href="(\/(?:19|20)\d{2}-[^"]+\/(\d{5,}))"/i
    );
    if (!hrefMatch) continue;

    const pathPart = hrefMatch[1];
    const stockId = hrefMatch[2];
    const yearField = Number(extractField(block, "year"));
    const makeField = extractField(block, "make").replace(/\s+/g, " ").trim();
    const modelField = extractField(block, "model").replace(/\s+/g, " ").trim();
    const trimField = extractField(block, "trim").replace(/\s+/g, " ").trim();
    const fieldModelLabel = [modelField, trimField]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    const altMatch = block.match(/\balt="([^"]+)"/i);
    const titleMatch = block.match(/\btitle="([^"]+)"/i);
    const h3TextMatch = block.match(
      /<span class="template_title">([\s\S]*?)<\/span>/i
    );
    const h3Text = h3TextMatch
      ? decodeHtml(h3TextMatch[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()
      : "";

    const fromAlt = parseListingTitle(altMatch?.[1] || "");
    const fromTitleAttr = parseListingTitle(titleMatch?.[1] || "");
    const fromH3 = parseListingTitle(h3Text);
    // Prefer alt/title attributes (full "YEAR MAKE MODEL | dealer"), then h3 text.
    const fromTitle = fromAlt || fromTitleAttr || fromH3;

    const year = fromTitle?.year || yearField;
    const make = makeField;
    const titleModel = fromTitle
      ? modelFromTitleVehicle(fromTitle.vehicle, make)
      : "";
    // Prefer the longer/more complete model string for exact Adscars display parity.
    const modelLabel =
      titleModel.length >= fieldModelLabel.length
        ? titleModel
        : fieldModelLabel || titleModel;

    if (!year || !make || !modelLabel) continue;

    const brand = normalizeBrand(make, modelLabel);
    const priceMatch = block.match(
      /class="website_price"[^>]*>[\s\S]*?<span>([^<]*)<\/span>/i
    );
    const priceLabel = formatPrice(priceMatch?.[1]);
    const mileage = formatMileage(extractDd(block, "mileage_value"));
    const vin = extractDd(block, "vin_value") || null;
    const exterior = extractDd(block, "exterior_value");
    const transmission = extractDd(block, "transmission_value");

    const imgMatch = block.match(
      /<img[^>]+src="(https:\/\/cf-img\.autorevo\.com\/[^"]+)"/i
    );
    const remoteImage = upgradeImageUrl(imgMatch?.[1] || null);

    const highlightParts = [
      mileage,
      exterior && exterior !== "Unknown" ? `${exterior} exterior` : null,
      transmission && transmission !== "Unknown" ? transmission : null,
    ].filter(Boolean);

    vehicles.push({
      id: `adscars-${stockId}`,
      brand,
      brandSlug: slugify(brand),
      model: modelLabel,
      year,
      highlight:
        highlightParts.length > 0
          ? highlightParts.join(" · ")
          : "WCFG curated allocation",
      priceLabel,
      imageSrc: remoteImage || "",
      imageAlt: `${year} ${brand} ${modelLabel}`,
      status: "available",
      source: "adscars",
      sourceUrl: `https://adscars.com${pathPart}`,
      mileage: mileage || undefined,
      vin: vin || undefined,
      remoteImageSrc: remoteImage || undefined,
    });
  }

  return vehicles;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function downloadAsWebp(url, destPath) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`Image fetch failed ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(destPath);
}

async function dirSize(dir) {
  if (!existsSync(dir)) return 0;
  const entries = await readdir(dir, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += await dirSize(full);
    else total += (await stat(full)).size;
  }
  return total;
}

function enrichVehicle(vehicle) {
  return {
    ...vehicle,
    brandSlug: vehicle.brandSlug || slugify(vehicle.brand),
    status: vehicle.status || "available",
    source: vehicle.source || "listings",
    featured: vehicle.featured === true,
  };
}

function buildBrandsTs(brands) {
  const names = brands.map((b) => JSON.stringify(b.name));
  const accents = brands
    .map(
      (b) =>
        `  ${JSON.stringify(b.name)}: ${JSON.stringify(b.accent)},`
    )
    .join("\n");

  const brandObjects = brands
    .map(
      (b) =>
        `  { name: ${JSON.stringify(b.name)}, slug: ${JSON.stringify(b.slug)}, href: "/inventory/${b.slug}" },`
    )
    .join("\n");

  return `/** Auto-generated by scripts/import-adscars.mjs — do not edit by hand. */

export const MARQUES = [
${names.map((n) => `  ${n},`).join("\n")}
] as const;

export type Marque = (typeof MARQUES)[number] | string;
export type BrandSlug = string;

export interface Brand {
  name: string;
  slug: string;
  href: \`/inventory/\${string}\`;
}

export const BRANDS: Brand[] = [
${brandObjects}
];

export const BRAND_BY_SLUG: Record<string, Brand> = Object.fromEntries(
  BRANDS.map((brand) => [brand.slug, brand])
);

export const BRAND_BY_NAME: Record<string, Brand> = Object.fromEntries(
  BRANDS.map((brand) => [brand.name, brand])
);

export function isBrandSlug(value: string): boolean {
  return value in BRAND_BY_SLUG;
}

export function getBrandBySlug(slug: string): Brand | null {
  return BRAND_BY_SLUG[slug] ?? null;
}

export function marqueToSlug(marque: string): string {
  return BRAND_BY_NAME[marque]?.slug ?? marque.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function brandHref(marque: string): Brand["href"] {
  const brand = BRAND_BY_NAME[marque];
  return (brand?.href ?? \`/inventory/\${marqueToSlug(marque)}\`) as Brand["href"];
}

/** Tailwind gradient fragments for card / badge accents */
export const MARQUE_ACCENTS: Record<string, string> = {
${accents}
};

export const DEFAULT_MARQUE_ACCENT = ${JSON.stringify(DEFAULT_ACCENT)};
`;
}

function buildInventoryTs() {
  return `import inventoryData from "@/data/inventory.json";
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
  images?: string[];
  status?: "available" | "reserved" | "sold";
  source?: "adscars" | "listings" | string;
  sourceUrl?: string;
  mileage?: string;
  vin?: string;
  featured?: boolean;
}

function normalize(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    brandSlug: vehicle.brandSlug || marqueToSlug(vehicle.brand),
    status: vehicle.status ?? "available",
    source: vehicle.source ?? "adscars",
    featured: vehicle.featured === true,
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
`;
}

async function writeSupabaseSeed(vehicles) {
  const values = vehicles
    .map((v) => {
      const esc = (s) => String(s ?? "").replace(/'/g, "''");
      return `  (
    '${esc(v.id)}',
    '${esc(v.brand)}',
    '${esc(v.brandSlug)}',
    '${esc(v.model)}',
    ${v.year},
    '${esc(v.highlight)}',
    '${esc(v.priceLabel)}',
    '${esc(v.imageSrc)}',
    '${esc(v.imageAlt)}',
    '${esc(v.status || "available")}',
    '${esc(v.source || "adscars")}',
    ${v.sourceUrl ? `'${esc(v.sourceUrl)}'` : "null"},
    ${v.mileage ? `'${esc(v.mileage)}'` : "null"},
    ${v.vin ? `'${esc(v.vin)}'` : "null"},
    ${v.featured === true}
  )`;
    })
    .join(",\n");

  const sql = `-- Generated by scripts/import-adscars.mjs
-- Inventory aggregated from public dealer listings for demo/curation display.

alter table public.vehicles
  add column if not exists source text not null default 'wcfg',
  add column if not exists source_url text,
  add column if not exists mileage text,
  add column if not exists vin text,
  add column if not exists featured boolean not null default false;

insert into public.vehicles (
  id, brand, brand_slug, model, year, highlight, price_label,
  image_src, image_alt, status, source, source_url, mileage, vin, featured
) values
${values}
on conflict (id) do update set
  brand = excluded.brand,
  brand_slug = excluded.brand_slug,
  model = excluded.model,
  year = excluded.year,
  highlight = excluded.highlight,
  price_label = excluded.price_label,
  image_src = excluded.image_src,
  image_alt = excluded.image_alt,
  status = excluded.status,
  source = excluded.source,
  source_url = excluded.source_url,
  mileage = excluded.mileage,
  vin = excluded.vin,
  featured = excluded.featured;
`;

  await writeFile(path.join(root, "supabase", "migrations", "003_adscars_inventory.sql"), sql);
}

async function main() {
  console.log("Fetching adscars.com/vehicles …");
  const html = await fetchHtml("https://adscars.com/vehicles");
  const imported = parseListings(html);
  console.log(`Parsed ${imported.length} listings`);

  await mkdir(imageDir, { recursive: true });
  await mkdir(dataDir, { recursive: true });

  let useRemoteImages = forceRemote || skipImages;
  let imageStrategy = useRemoteImages ? "remote-cdn" : "local-webp";

  if (!useRemoteImages) {
    console.log("Downloading vehicle galleries as WebP …");
    for (let i = 0; i < imported.length; i++) {
      const vehicle = imported[i];
      if (!vehicle.remoteImageSrc && !vehicle.sourceUrl) {
        vehicle.imageSrc = "";
        continue;
      }

      try {
        await downloadVehicleGallery(vehicle, false);
        const localBytes = await dirSize(imageDir);
        if (localBytes > MAX_LOCAL_BYTES) {
          console.warn(
            `Local images exceeded 50MB at ${vehicle.id}; switching remaining to remote CDN URLs.`
          );
          imageStrategy = "mixed-local-then-remote";
          useRemoteImages = true;
          for (let j = i; j < imported.length; j++) {
            await downloadVehicleGallery(imported[j], true);
          }
          break;
        }
      } catch (error) {
        console.warn(`Gallery failed for ${vehicle.id}:`, error.message);
        vehicle.imageSrc = vehicle.remoteImageSrc || "";
      }

      if ((i + 1) % 10 === 0) {
        console.log(`  galleries ${i + 1}/${imported.length}`);
      }
      await sleep(100);
    }
  } else {
    for (const vehicle of imported) {
      vehicle.imageSrc = vehicle.remoteImageSrc || "";
    }
  }

  const originals = WCFG_LISTINGS_UNITS.map(enrichVehicle).map(applyBrandOverrides);
  const adscars = imported.map((v) => {
    const { remoteImageSrc, ...rest } = v;
    return applyBrandOverrides(enrichVehicle(rest));
  });

  // Prefer originals first, then adscars (skip adscars that collide on id — none should)
  const byId = new Map();
  for (const v of [...originals, ...adscars]) {
    byId.set(v.id, v);
  }
  const inventory = [...byId.values()].sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
    return b.year - a.year;
  });

  const brandNames = [...new Set(inventory.map((v) => v.brand))].sort((a, b) =>
    a.localeCompare(b)
  );

  // Keep signature luxury brands first in showcase order when present
  const priority = [
    "Mercedes-Benz",
    "Ferrari",
    "Rolls-Royce",
    "Lamborghini",
    "Corvette",
    "Porsche",
    "Bentley",
    "Aston Martin",
    "McLaren",
    "Land Rover",
  ];
  brandNames.sort((a, b) => {
    const ai = priority.indexOf(a);
    const bi = priority.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const brands = brandNames.map((name) => ({
    name,
    slug: slugify(name),
    accent: BRAND_ACCENTS[name] || DEFAULT_ACCENT,
  }));

  await writeFile(
    path.join(dataDir, "inventory.json"),
    JSON.stringify(inventory, null, 2)
  );
  await writeFile(path.join(root, "lib", "brands.ts"), buildBrandsTs(brands));
  await writeFile(path.join(root, "lib", "inventory.ts"), buildInventoryTs());
  await writeSupabaseSeed(inventory);

  const summary = {
    totalVehicles: inventory.length,
    adscarsImported: adscars.length,
    listingsUnits: originals.length,
    brands: brands.map((b) => b.name),
    brandCount: brands.length,
    imageStrategy,
    localImageBytes: await dirSize(imageDir),
  };

  await writeFile(
    path.join(dataDir, "import-summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log("\nImport complete:");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
