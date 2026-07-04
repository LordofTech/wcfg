/**
 * Convert car listings/ photos to WebP and wire them into data/inventory.json.
 * Run: node scripts/apply-car-listings.mjs
 */
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const listingsDir = path.join(root, "car listings");
const vehiclesDir = path.join(root, "public", "vehicles");
const listingsOutDir = path.join(vehiclesDir, "listings");
const inventoryPath = path.join(root, "data", "inventory.json");
const manifestPath = path.join(vehiclesDir, "LISTINGS-MAP.json");

/**
 * Each entry: productId, optional newProduct, sources (first = primary hero).
 * outPrefix defaults to productId under public/vehicles/listings/
 * For ZR1, files land at public/vehicles/ with explicit names.
 */
const PRODUCT_MAP = [
  {
    productId: "corvette-zr1-coupe-3lz-black",
    imageAlt: "New 2025 Chevrolet Corvette ZR1 Coupe 3LZ in black",
    outDir: vehiclesDir,
    publicBase: "/vehicles",
    names: [
      "corvette-zr1-coupe-3lz-black.webp",
      "corvette-zr1-coupe-3lz-black-side.webp",
      "corvette-zr1-coupe-3lz-black-2.webp",
      "corvette-zr1-coupe-3lz-black-3.webp",
    ],
    sources: [
      "WhatsApp Image 2026-07-03 at 10.49.511.jpeg", // front hero
      "WhatsApp Image 2026-07-03 at 10.49.51.jpeg", // rear 3/4
      "WhatsApp Image 2026-07-03 at 10.49.5112.jpeg", // rear
      "WhatsApp Image 2026-07-03 at 10.49.50.jpeg", // interior
    ],
  },
  {
    productId: "adscars-7223175",
    imageAlt: "2018 Mercedes-Benz AMG GT R RENNtech in orange with black stripes",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.46.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.47 (1).jpeg",
    ],
  },
  {
    productId: "cadillac-escalade-black",
    imageAlt: "Black Cadillac Escalade with light interior",
    newProduct: {
      brand: "Cadillac",
      brandSlug: "cadillac",
      model: "Escalade",
      year: 2024,
      highlight: "Black exterior · Light interior · Available now",
      priceLabel: "Call for Price",
      status: "available",
      source: "wcfg",
    },
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.46 (1).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.47.jpeg",
    ],
  },
  {
    productId: "mb-g63-2024",
    imageAlt: "White Mercedes-Benz G 63 AMG with red interior and bull bar",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.49 (2).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.49 (3).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.47 (2).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.47 (3).jpeg",
    ],
  },
  {
    productId: "adscars-7489126",
    imageAlt: "2024 Ineos Grenadier Fieldmaster in black with KC lights",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.49.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.49 (1).jpeg",
    ],
  },
  {
    productId: "rr-ghost-2023",
    imageAlt: "Rolls-Royce Ghost two-tone silver and black",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.50.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.50 (1).jpeg",
    ],
  },
  {
    productId: "adscars-7464615",
    imageAlt: "2023 Aston Martin DBX 707 in matte black",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.51.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.52.jpeg",
    ],
  },
  {
    productId: "adscars-7495625",
    imageAlt: "2019 Lamborghini Urus Mansory Kit red and black two-tone",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.52 (1).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.52 (2).jpeg",
    ],
  },
  {
    productId: "adscars-7428598",
    imageAlt: "2021 Aston Martin DBX in metallic grey",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.53.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.54.jpeg",
    ],
  },
  {
    productId: "rr-cullinan-2024",
    imageAlt: "Rolls-Royce Cullinan Black Badge matte black with white interior",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.53 (1).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.53 (2).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.53 (3).jpeg",
    ],
  },
  {
    productId: "adscars-7380073",
    imageAlt: "2014 Lamborghini Aventador LP 700-4 Roadster in black",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.57.jpeg", // front hero
      "WhatsApp Image 2026-07-03 at 23.47.57 (1).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.54 (1).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.55.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.55 (1).jpeg",
    ],
  },
  {
    productId: "adscars-7480463",
    imageAlt: "2026 Aston Martin Vanquish in metallic blue",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.55 (4).jpeg", // front hero
      "WhatsApp Image 2026-07-03 at 23.47.55 (5).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.55 (2).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.55 (3).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.56 (1).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.58.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.56.jpeg", // interior
    ],
  },
  {
    productId: "adscars-7485952",
    imageAlt: "2023 Aston Martin Vantage F1 Edition Convertible white with blue stripe",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.57 (3).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.57 (2).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.57 (4).jpeg",
    ],
  },
  {
    productId: "ferrari-f8-tributo-yellow",
    imageAlt: "Ferrari F8 Tributo in yellow",
    newProduct: {
      brand: "Ferrari",
      brandSlug: "ferrari",
      model: "F8 Tributo",
      year: 2022,
      highlight: "Yellow exterior · Mid-engine V8 · Available now",
      priceLabel: "Call for Price",
      status: "available",
      source: "wcfg",
    },
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.59.jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.59 (1).jpeg",
    ],
  },
  {
    productId: "aston-martin-vantage-teal",
    imageAlt: "Aston Martin Vantage coupe in teal",
    newProduct: {
      brand: "Aston Martin",
      brandSlug: "aston-martin",
      model: "Vantage",
      year: 2025,
      highlight: "Teal exterior · Carbon accents · Available now",
      priceLabel: "Call for Price",
      status: "available",
      source: "wcfg",
    },
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.59 (2).jpeg",
      "WhatsApp Image 2026-07-03 at 23.47.59 (3).jpeg",
    ],
  },
  {
    productId: "adscars-7310278",
    imageAlt: "2016 Bentley Mulsanne Speed in black",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.47.59 (4).jpeg",
      "WhatsApp Image 2026-07-03 at 23.48.00.jpeg",
    ],
  },
  {
    productId: "adscars-7476947",
    imageAlt: "2026 Cadillac CT5-V Blackwing in metallic green",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.48.00 (1).jpeg",
      "WhatsApp Image 2026-07-03 at 23.48.00 (2).jpeg",
    ],
  },
  {
    productId: "adscars-7474860",
    imageAlt: "2012 Mercedes-Benz SLS AMG Convertible in red",
    sources: [
      "WhatsApp Image 2026-07-03 at 23.48.00 (5).jpeg", // front hero
      "WhatsApp Image 2026-07-03 at 23.48.01.jpeg",
      "WhatsApp Image 2026-07-03 at 23.48.00 (3).jpeg",
      "WhatsApp Image 2026-07-03 at 23.48.00 (4).jpeg", // interior
    ],
  },
];

async function toWebp(inputPath, outputPath) {
  await sharp(inputPath)
    .rotate()
    .resize({
      width: 1600,
      height: 1000,
      fit: "cover",
      position: "centre",
    })
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath);
}

function publicPaths(entry) {
  const outDir = entry.outDir ?? listingsOutDir;
  const publicBase = entry.publicBase ?? "/vehicles/listings";
  const names =
    entry.names ??
    entry.sources.map((_, i) =>
      i === 0 ? `${entry.productId}.webp` : `${entry.productId}-${i + 1}.webp`
    );
  return names.map((name) => ({
    outPath: path.join(outDir, name),
    publicPath: `${publicBase}/${name}`,
  }));
}

async function main() {
  await mkdir(listingsOutDir, { recursive: true });
  await mkdir(vehiclesDir, { recursive: true });

  const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
  const byId = new Map(inventory.map((v) => [v.id, v]));
  const manifest = [];
  const usedSources = new Set();

  for (const entry of PRODUCT_MAP) {
    const paths = publicPaths(entry);
    const imagePaths = [];

    for (let i = 0; i < entry.sources.length; i++) {
      const srcName = entry.sources[i];
      const input = path.join(listingsDir, srcName);
      const { outPath, publicPath } = paths[i];
      usedSources.add(srcName);

      await toWebp(input, outPath);
      const info = await stat(outPath);
      imagePaths.push(publicPath);
      manifest.push({
        source: srcName,
        productId: entry.productId,
        output: publicPath,
        bytes: info.size,
        role: i === 0 ? "primary" : `gallery-${i + 1}`,
      });
      console.log(
        `${entry.productId} [${i === 0 ? "primary" : i + 1}] ← ${srcName} (${Math.round(info.size / 1024)} KB)`
      );
    }

    let vehicle = byId.get(entry.productId);
    if (!vehicle) {
      if (!entry.newProduct) {
        throw new Error(`Missing product ${entry.productId} and no newProduct definition`);
      }
      vehicle = {
        id: entry.productId,
        ...entry.newProduct,
        imageSrc: imagePaths[0],
        imageAlt: entry.imageAlt,
        images: imagePaths,
        featured: false,
      };
      inventory.push(vehicle);
      byId.set(entry.productId, vehicle);
      console.log(`  + added inventory entry ${entry.productId}`);
    } else {
      vehicle.imageSrc = imagePaths[0];
      vehicle.imageAlt = entry.imageAlt;
      vehicle.images = imagePaths;
    }
  }

  await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + "\n");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  // Report unused listing files
  const { readdir } = await import("node:fs/promises");
  const allListingFiles = (await readdir(listingsDir)).filter((f) =>
    /\.(jpe?g|png|webp)$/i.test(f)
  );
  const unused = allListingFiles.filter((f) => !usedSources.has(f));

  console.log("\nManifest:", manifestPath);
  console.log("Updated inventory:", inventoryPath);
  console.log("Sources used:", usedSources.size);
  console.log("Unused listing files:", unused.length ? unused.join(", ") : "(none)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
