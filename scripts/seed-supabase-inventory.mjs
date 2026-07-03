/**
 * Seed vehicles table from data/inventory.json using the service role key.
 * Inventory aggregated from public dealer listings for demo/curation display.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvLocal() {
  try {
    const env = readFileSync(path.join(root, ".env.local"), "utf8");
    for (const line of env.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const inventory = JSON.parse(
  readFileSync(path.join(root, "data", "inventory.json"), "utf8")
);

const rows = inventory.map((v) => ({
  id: v.id,
  brand: v.brand,
  brand_slug: v.brandSlug,
  model: v.model,
  year: v.year,
  highlight: v.highlight,
  price_label: v.priceLabel,
  image_src: v.imageSrc,
  image_alt: v.imageAlt,
  status: v.status || "available",
  source: v.source || "wcfg",
  source_url: v.sourceUrl || null,
  mileage: v.mileage || null,
  vin: v.vin || null,
}));

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Ensure columns exist (best-effort; migration may already have run)
const alterSql = `
alter table public.vehicles
  add column if not exists source text not null default 'wcfg',
  add column if not exists source_url text,
  add column if not exists mileage text,
  add column if not exists vin text;
`;

const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const projectRef =
  process.env.SUPABASE_PROJECT_REF?.trim() || "tzbdmrbpxvqhplpuquts";

if (token) {
  const alterRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: alterSql }),
    }
  );
  console.log("alter", alterRes.status);
} else {
  console.log("Skipping alter (SUPABASE_ACCESS_TOKEN not set); upserting rows only.");
}

const batchSize = 50;
for (let i = 0; i < rows.length; i += batchSize) {
  const batch = rows.slice(i, i + batchSize);
  const { error } = await supabase.from("vehicles").upsert(batch, {
    onConflict: "id",
  });
  if (error) {
    console.error("Upsert failed", error);
    process.exit(1);
  }
  console.log(`Upserted ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
}

const { count, error: countError } = await supabase
  .from("vehicles")
  .select("id", { count: "exact", head: true })
  .eq("status", "available");

if (countError) {
  console.error(countError);
  process.exit(1);
}

console.log("Available vehicles in Supabase:", count);
