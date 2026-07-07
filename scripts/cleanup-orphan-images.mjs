/**
 * Remove generic Wikimedia WebP files and unreferenced imported images.
 */
import { existsSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inventory = JSON.parse(
  readFileSync(path.join(root, "data", "inventory.json"), "utf8")
);

const used = new Set();
for (const vehicle of inventory) {
  if (vehicle.imageSrc) used.add(vehicle.imageSrc);
  for (const image of vehicle.images ?? []) used.add(image);
}

const WIKIMEDIA_ORPHANS = [
  "ferrari-296-gtb.webp",
  "lambo-urus-se.webp",
  "porsche-911-turbo-s.webp",
  "bentley-continental-gt.webp",
  "corvette-z06.webp",
  "ferrari-roma.webp",
  "mb-s580.webp",
  "lambo-huracan-sterrato.webp",
  "porsche-cayenne-turbo-gt.webp",
];

const removed = [];

for (const name of WIKIMEDIA_ORPHANS) {
  const disk = path.join(root, "public", "vehicles", name);
  if (existsSync(disk)) {
    unlinkSync(disk);
    removed.push(`/vehicles/${name}`);
  }
}

const importedDir = path.join(root, "public", "vehicles", "imported");
if (existsSync(importedDir)) {
  for (const name of readdirSync(importedDir)) {
    if (!name.endsWith(".webp")) continue;
    const web = `/vehicles/imported/${name}`;
    if (used.has(web)) continue;
    unlinkSync(path.join(importedDir, name));
    removed.push(web);
  }
}

console.log(`Referenced image paths: ${used.size}`);
console.log(`Removed ${removed.length} orphan file(s)`);
if (removed.length) console.log(removed.join("\n"));
