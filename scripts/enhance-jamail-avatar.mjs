import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(
  root,
  "assets",
  "ChatGPT Image Jul 10, 2026, 07_23_20 PM.png"
);
const out = path.join(root, "public", "jamail-avatar.webp");

const { width: w, height: h } = await sharp(src).metadata();
if (!w || !h) throw new Error("Could not read flyer source dimensions");

// Largest clean portrait crop from the flyer (portrait only, no adjacent copy).
const crop = { left: 0.285, top: 0.58, width: 0.13, height: 0.33 };

await sharp(src)
  .extract({
    left: Math.round(w * crop.left),
    top: Math.round(h * crop.top),
    width: Math.round(w * crop.width),
    height: Math.round(h * crop.height),
  })
  .resize(2160, 2880, { fit: "cover", kernel: sharp.kernel.lanczos3 })
  .sharpen({ sigma: 1.15, m1: 1.0, m2: 0.45 })
  .modulate({ brightness: 1.02, saturation: 1.04 })
  .webp({ quality: 96, effort: 6, smartSubsample: false })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`Wrote ${out} (${meta.width}x${meta.height})`);
