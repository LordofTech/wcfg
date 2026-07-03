/**
 * Apply adscars inventory migration to Supabase via Management API.
 * Inventory aggregated from public dealer listings for demo/curation display.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const projectRef =
  process.env.SUPABASE_PROJECT_REF?.trim() || "tzbdmrbpxvqhplpuquts";

if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN to apply this migration.");
  process.exit(1);
}

const sqlPath = path.join(
  root,
  "supabase",
  "migrations",
  "003_adscars_inventory.sql"
);
const fullSql = readFileSync(sqlPath, "utf8");

const alterSql = fullSql
  .split("insert into public.vehicles")[0]
  .trim();

const insertBody = fullSql
  .slice(fullSql.indexOf("insert into public.vehicles"))
  .trim();

// Split value tuples: each starts with "  (" at beginning of vehicle block
const valuesMatch = insertBody.match(
  /values\s*([\s\S]+)\s*on conflict/i
);
if (!valuesMatch) {
  console.error("Could not parse insert values");
  process.exit(1);
}

const valuesBlock = valuesMatch[1].trim();
const tuples = [];
let depth = 0;
let current = "";
for (const char of valuesBlock) {
  current += char;
  if (char === "(") depth += 1;
  if (char === ")") depth -= 1;
  if (depth === 0 && current.trim().endsWith(")")) {
    const tuple = current.trim().replace(/,\s*$/, "");
    if (tuple.startsWith("(")) tuples.push(tuple);
    current = "";
  }
}

console.log(`Parsed ${tuples.length} vehicle rows`);

async function run(query, label) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );
  const text = await res.text();
  console.log(label, res.status, text.slice(0, 200));
  if (!res.ok) throw new Error(`${label} failed`);
}

await run(alterSql, "alter");

const batchSize = 20;
for (let i = 0; i < tuples.length; i += batchSize) {
  const batch = tuples.slice(i, i + batchSize);
  const query = `insert into public.vehicles (
  id, brand, brand_slug, model, year, highlight, price_label,
  image_src, image_alt, status, source, source_url, mileage, vin
) values
${batch.join(",\n")}
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
  vin = excluded.vin;`;
  await run(query, `batch ${i / batchSize + 1}`);
}

console.log("Migration applied.");
