import { createWriteStream, existsSync } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "vehicles");
const tmpDir = path.join(root, "scripts", "tmp-vehicles");

const USER_AGENT = "WCFG-Inventory/1.0 (local-dev; luxury-car-images)";

/** @type {{ id: string; filename: string; url: string; source: string; note?: string }[]} */
const vehicles = [
  {
    id: "rr-cullinan-2024",
    filename: "rr-cullinan-2024.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Rolls-Royce_Cullinan_005.jpg/1920px-Rolls-Royce_Cullinan_005.jpg",
    source: "Wikimedia Commons — Rolls-Royce Cullinan 005.jpg",
    note: "Cullinan (not Black Badge-specific livery)",
  },
  {
    id: "ferrari-296-gtb",
    filename: "ferrari-296-gtb.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Ferrari_296_GTB_1X7A6377.jpg/1920px-Ferrari_296_GTB_1X7A6377.jpg",
    source: "Wikimedia Commons — Ferrari 296 GTB 1X7A6377.jpg",
  },
  {
    id: "lambo-urus-se",
    filename: "lambo-urus-se.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Lamborghini_Urus_SE_DSC_8521.jpg/1920px-Lamborghini_Urus_SE_DSC_8521.jpg",
    source: "Wikimedia Commons — Lamborghini Urus SE DSC 8521.jpg",
  },
  {
    id: "mb-g63-2024",
    filename: "mb-g63-2024.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Mercedes-AMG_G_63_%282024%E2%80%93%29_DSC_0681.jpg/1920px-Mercedes-AMG_G_63_%282024%E2%80%93%29_DSC_0681.jpg",
    source: "Wikimedia Commons — Mercedes-AMG G 63 (2024–) DSC 0681.jpg",
  },
  {
    id: "porsche-911-turbo-s",
    filename: "porsche-911-turbo-s.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Porsche_992_Turbo_S_1X7A0413.jpg/1920px-Porsche_992_Turbo_S_1X7A0413.jpg",
    source: "Wikimedia Commons — Porsche 992 Turbo S 1X7A0413.jpg",
  },
  {
    id: "bentley-continental-gt",
    filename: "bentley-continental-gt.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Bentley_Continental_GT_Speed_%283rd_gen.%29_IMG_0014.jpg/1920px-Bentley_Continental_GT_Speed_%283rd_gen.%29_IMG_0014.jpg",
    source: "Wikimedia Commons — Bentley Continental GT Speed (3rd gen.) IMG 0014.jpg",
    note: "3rd-gen Speed (inventory lists 2024 4th-gen Speed; same model line)",
  },
  // ZR1 assets are sourced from local `car listings/` (not Wikimedia).
  // Re-run conversion from that folder if primary/side images need refresh.
  {
    id: "corvette-z06",
    filename: "corvette-z06.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Chevrolet_Corvette_Z06_%28C8%29_Miami_Metro_Area%2C_USA.jpg/1920px-Chevrolet_Corvette_Z06_%28C8%29_Miami_Metro_Area%2C_USA.jpg",
    source: "Wikimedia Commons — Chevrolet Corvette Z06 (C8) Miami Metro Area, USA.jpg",
  },
  {
    id: "rr-ghost-2023",
    filename: "rr-ghost-2023.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Rolls-Royce_Ghost_Extended_II_Black_%282%29.jpg/1920px-Rolls-Royce_Ghost_Extended_II_Black_%282%29.jpg",
    source: "Wikimedia Commons — Rolls-Royce Ghost Extended II Black (2).jpg",
  },
  {
    id: "ferrari-roma",
    filename: "ferrari-roma.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Ferrari_Roma_Spider_IMG_9546.jpg/1920px-Ferrari_Roma_Spider_IMG_9546.jpg",
    source: "Wikimedia Commons — Ferrari Roma Spider IMG 9546.jpg",
  },
  {
    id: "mb-s580",
    filename: "mb-s580.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Mercedes-Benz_W223_IAA_2021_1X7A0206.jpg/1920px-Mercedes-Benz_W223_IAA_2021_1X7A0206.jpg",
    source: "Wikimedia Commons — Mercedes-Benz W223 IAA 2021 1X7A0206.jpg",
    note: "W223 S-Class (not S 580 badging-specific)",
  },
  {
    id: "lambo-huracan-sterrato",
    filename: "lambo-huracan-sterrato.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Lamborghini_Huracan_Sterrato.jpg/1920px-Lamborghini_Huracan_Sterrato.jpg",
    source: "Wikimedia Commons — Lamborghini Huracan Sterrato.jpg",
  },
  {
    id: "porsche-cayenne-turbo-gt",
    filename: "porsche-cayenne-turbo-gt.webp",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Porsche_Cayenne_Turbo_GT_DSC_7899.jpg/1920px-Porsche_Cayenne_Turbo_GT_DSC_7899.jpg",
    source: "Wikimedia Commons — Porsche Cayenne Turbo GT DSC 7899.jpg",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function download(url, dest, attempts = 6) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (res.status === 429 || res.status >= 500) {
        const wait = attempt * 4000;
        console.log(`retry ${attempt}/${attempts} after ${wait}ms (${res.status})`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) {
        throw new Error(`Failed ${res.status} for ${url}`);
      }
      if (!res.body) {
        throw new Error(`No body for ${url}`);
      }
      await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
      return;
    } catch (err) {
      lastError = err;
      const wait = attempt * 4000;
      console.log(`retry ${attempt}/${attempts} after ${wait}ms (${err.message})`);
      await sleep(wait);
    }
  }
  throw lastError ?? new Error(`Failed to download ${url}`);
}

async function toWebp(inputPath, outputPath) {
  // Landscape card crop ~16:10, max width 1600
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

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(tmpDir, { recursive: true });

  const manifest = [];

  for (const vehicle of vehicles) {
    const ext = path.extname(new URL(vehicle.url).pathname) || ".jpg";
    const tmpPath = path.join(tmpDir, `${vehicle.id}${ext}`);
    const outPath = path.join(outDir, vehicle.filename);

    process.stdout.write(`Fetching ${vehicle.id}... `);

    if (existsSync(outPath)) {
      const info = await stat(outPath);
      if (info.size >= 10_000) {
        console.log(`skip existing (${Math.round(info.size / 1024)} KB)`);
        manifest.push({
          id: vehicle.id,
          imageSrc: `/vehicles/${vehicle.filename}`,
          bytes: info.size,
          source: vehicle.source,
          note: vehicle.note ?? null,
        });
        continue;
      }
    }

    await download(vehicle.url, tmpPath);
    await toWebp(tmpPath, outPath);
    await sleep(2500);

    const info = await stat(outPath);
    if (info.size < 10_000) {
      throw new Error(`${vehicle.filename} is suspiciously small (${info.size} bytes)`);
    }

    console.log(`ok (${Math.round(info.size / 1024)} KB)`);
    manifest.push({
      id: vehicle.id,
      imageSrc: `/vehicles/${vehicle.filename}`,
      bytes: info.size,
      source: vehicle.source,
      note: vehicle.note ?? null,
    });
  }

  await writeFile(
    path.join(outDir, "SOURCES.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log("\nDone. Wrote public/vehicles/*.webp");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
