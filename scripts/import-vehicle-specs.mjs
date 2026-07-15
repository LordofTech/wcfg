import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inventoryPath = path.join(root, "data", "inventory.json");
const specsPath = path.join(root, "data", "vehicle-specs.json");
const USER_AGENT =
  "WCFG-Inventory/1.0 (vehicle-spec-import; +https://wcfgluxautos.com)";

const MANUAL_SPECS = {};

function decodeHtml(text) {
  return String(text || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(text) {
  return decodeHtml(String(text || "").replace(/<[^>]+>/g, " "));
}

function extractDd(block, className) {
  const re = new RegExp(`<dd class="${className}">([\\s\\S]*?)<\\/dd>`, "i");
  const match = block.match(re);
  return match ? stripTags(match[1]) : "";
}

function parseLdJson(html) {
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, raw] of scripts) {
    try {
      const parsed = JSON.parse(raw.trim());
      const values = Array.isArray(parsed) ? parsed : [parsed];
      for (const value of values) {
        if (!value || typeof value !== "object") continue;
        const candidates = [value, value.itemOffered, value.vehicle];
        for (const candidate of candidates) {
          if (!candidate || typeof candidate !== "object") continue;
          const types = Array.isArray(candidate["@type"])
            ? candidate["@type"]
            : [candidate["@type"]];
          if (types.some((type) => String(type).toLowerCase().includes("vehicle"))) {
            return candidate;
          }
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractJsonValue(html, key) {
  const match = html.match(new RegExp(`"${key}":"([^"]+)"`, "i"));
  return match ? decodeHtml(match[1]) : "";
}

function titleCase(value) {
  return String(value || "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function parseCondition(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("new")) return "New";
  if (text.includes("used")) return "Used";
  return "";
}

function parseMpg(value) {
  const cleaned = stripTags(value);
  const match = cleaned.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { city: "", highway: "" };
  return { city: `${match[1]} mpg city`, highway: `${match[2]} mpg highway` };
}

function addOverviewItem(items, label, value) {
  const cleanLabel = stripTags(label);
  const cleanValue = stripTags(value);
  if (!cleanLabel || !cleanValue) return;
  if (cleanValue === "0" || /^unknown$/i.test(cleanValue)) return;
  if (items.some((item) => item.label === cleanLabel && item.value === cleanValue)) {
    return;
  }
  items.push({ label: cleanLabel, value: cleanValue });
}

function parseInstalledEquipment(html) {
  const sectionMatch = html.match(/<section id="installed_options">([\s\S]*?)<\/section>/i);
  if (!sectionMatch) return [];

  const sectionHtml = sectionMatch[1];
  const categories = [];
  const categoryRegex = /<h4>([^<]+)<\/h4>\s*<div>\s*<ul>([\s\S]*?)<\/ul>\s*<\/div>/gi;
  let categoryMatch;

  while ((categoryMatch = categoryRegex.exec(sectionHtml)) !== null) {
    const [, rawTitle, listHtml] = categoryMatch;
    const category = {
      title: stripTags(rawTitle),
      groups: [],
    };

    let currentGroup = null;
    const itemRegex = /<li(?: class=['"]sub_group_header['"])?>([\s\S]*?)<\/li>/gi;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(listHtml)) !== null) {
      const fullTag = itemMatch[0];
      const text = stripTags(itemMatch[1]);
      if (!text) continue;

      if (/sub_group_header/i.test(fullTag)) {
        currentGroup = { title: text, items: [] };
        category.groups.push(currentGroup);
        continue;
      }

      if (!currentGroup) {
        currentGroup = { title: "Highlights", items: [] };
        category.groups.push(currentGroup);
      }

      currentGroup.items.push(text);
    }

    category.groups = category.groups.filter((group) => group.items.length > 0);
    if (category.title && category.groups.length > 0) {
      categories.push(category);
    }
  }

  return categories;
}

function buildSpecs(vehicle, html) {
  const toplineMatch = html.match(/<section id="topline">([\s\S]*?)<\/section>/i);
  const topline = toplineMatch ? toplineMatch[1] : "";
  const ldVehicle = parseLdJson(html);
  const mpg = parseMpg(extractDd(topline, "mpg_value"));
  const condition = parseCondition(ldVehicle?.itemCondition || extractJsonValue(html, "itemCondition"));
  const bodyType = ldVehicle?.bodyType || extractJsonValue(html, "bodyType");
  const fuelType = ldVehicle?.fuelType || extractJsonValue(html, "fuelType");
  const engineType =
    extractDd(topline, "engine_value") ||
    ldVehicle?.vehicleEngine?.engineType ||
    extractJsonValue(html, "engineType");

  const overview = [];
  addOverviewItem(overview, "Year", String(vehicle.year));
  addOverviewItem(overview, "Condition", condition);
  addOverviewItem(overview, "Body Style", bodyType);
  addOverviewItem(overview, "Mileage", vehicle.mileage || extractDd(topline, "mileage_value"));
  addOverviewItem(overview, "Exterior Color", extractDd(topline, "exterior_value"));
  addOverviewItem(overview, "Interior", extractDd(topline, "interior_value"));
  addOverviewItem(overview, "Engine", engineType);
  addOverviewItem(overview, "Transmission", extractDd(topline, "transmission_value"));
  addOverviewItem(overview, "Drivetrain", titleCase(extractDd(topline, "drivetrain_value")));
  addOverviewItem(overview, "Fuel Type", fuelType);
  addOverviewItem(overview, "Fuel Economy", [mpg.city, mpg.highway].filter(Boolean).join(" · "));
  addOverviewItem(overview, "VIN", vehicle.vin || extractDd(topline, "vin_value"));
  addOverviewItem(overview, "Warranty", extractDd(topline, "warranty_value"));
  addOverviewItem(overview, "Reference ID", vehicle.id);

  const equipment = parseInstalledEquipment(html);
  return { overview, equipment };
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  return res.text();
}

async function main() {
  const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
  const specsById = { ...MANUAL_SPECS };

  for (const vehicle of inventory) {
    if (!vehicle?.id) continue;
    if (specsById[vehicle.id]) continue;
    if (!vehicle.sourceUrl || !/adscars\.com/i.test(vehicle.sourceUrl)) continue;

    try {
      const html = await fetchHtml(vehicle.sourceUrl);
      specsById[vehicle.id] = buildSpecs(vehicle, html);
    } catch (error) {
      console.warn(`Spec import failed for ${vehicle.id}: ${error.message}`);
    }
  }

  await writeFile(specsPath, `${JSON.stringify(specsById, null, 2)}\n`, "utf8");
  console.log(`Wrote ${Object.keys(specsById).length} vehicle spec entries to ${specsPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
