import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inventoryPath = path.join(root, "data", "inventory.json");
const specsPath = path.join(root, "data", "vehicle-specs.json");
const USER_AGENT =
  "WCFG-Inventory/1.0 (vehicle-spec-import; +https://wcfgluxautos.com)";

const MANUAL_SPECS = {
  "aston-martin-vantage-teal": {
    overview: [
      { label: "Year", value: "2025" },
      { label: "Condition", value: "New" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "2-door coupe" },
      { label: "Exterior Color", value: "Teal" },
      { label: "Engine", value: "4.0L twin-turbocharged V8" },
      { label: "Power", value: "656 hp" },
      { label: "Torque", value: "590 lb-ft" },
      { label: "Transmission", value: "8-speed automatic" },
      { label: "Drivetrain", value: "Rear-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Turbocharged gasoline ICE" },
      { label: "Seating", value: "2 passengers" },
    ],
    equipment: [],
  },
  "adscars-7278824": {
    overview: [
      { label: "Year", value: "2020" },
      { label: "Condition", value: "Used" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "2-door fastback coupe" },
      { label: "Mileage", value: "30,500 mi" },
      { label: "Exterior Color", value: "Black" },
      { label: "Engine", value: "4.0L twin-turbocharged V8" },
      { label: "Power", value: "542 hp" },
      { label: "Torque", value: "568 lb-ft" },
      { label: "Transmission", value: "8-speed dual-clutch automatic" },
      { label: "Drivetrain", value: "All-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Turbocharged gasoline ICE" },
      { label: "VIN", value: "SCBCG2ZGXLC081261" },
    ],
    equipment: [],
  },
  "adscars-7444858": {
    overview: [
      { label: "Year", value: "2008" },
      { label: "Condition", value: "Used" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "4-door saloon" },
      { label: "Mileage", value: "218,491 mi" },
      { label: "Exterior Color", value: "Black" },
      { label: "Engine", value: "6.0L twin-turbocharged W12" },
      { label: "Power", value: "552 hp" },
      { label: "Torque", value: "479 lb-ft" },
      { label: "Transmission", value: "6-speed automatic" },
      { label: "Drivetrain", value: "All-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Twin-turbo gasoline ICE" },
      { label: "VIN", value: "SCBBR93W08C057444" },
    ],
    equipment: [],
  },
  "cadillac-escalade-black": {
    overview: [
      { label: "Year", value: "2024" },
      { label: "Condition", value: "New" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "Full-size 3-row SUV" },
      { label: "Exterior Color", value: "Black" },
      { label: "Interior", value: "Light interior" },
      { label: "Engine", value: "6.2L V8 with Dynamic Fuel Management" },
      { label: "Power", value: "420 hp" },
      { label: "Torque", value: "460 lb-ft" },
      { label: "Transmission", value: "10-speed automatic" },
      { label: "Drivetrain", value: "2WD / 4WD" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Naturally aspirated gasoline ICE" },
      { label: "Seating", value: "Up to 8 passengers" },
    ],
    equipment: [],
  },
  "corvette-zr1-coupe-3lz-black": {
    overview: [
      { label: "Year", value: "2026" },
      { label: "Condition", value: "New" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "2-door coupe" },
      { label: "Exterior Color", value: "Black" },
      { label: "Engine", value: "5.5L LT7 twin-turbocharged DOHC V8" },
      { label: "Power", value: "1,064 hp" },
      { label: "Torque", value: "828 lb-ft" },
      { label: "Transmission", value: "8-speed dual-clutch automatic" },
      { label: "Drivetrain", value: "Rear-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Twin-turbo gasoline ICE" },
      { label: "Seating", value: "2 passengers" },
      { label: "Trim", value: "3LZ" },
    ],
    equipment: [],
  },
  "ferrari-f8-tributo-yellow": {
    overview: [
      { label: "Year", value: "2022" },
      { label: "Condition", value: "Used" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "2-door berlinetta" },
      { label: "Exterior Color", value: "Yellow" },
      { label: "Engine", value: "3.9L twin-turbocharged V8" },
      { label: "Power", value: "710 hp" },
      { label: "Torque", value: "568 lb-ft" },
      { label: "Transmission", value: "7-speed dual-clutch automatic" },
      { label: "Drivetrain", value: "Rear-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Twin-turbo gasoline ICE" },
      { label: "Seating", value: "2 passengers" },
    ],
    equipment: [],
  },
  "mb-g63-2024": {
    overview: [
      { label: "Year", value: "2024" },
      { label: "Condition", value: "Used" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "5-door luxury SUV" },
      { label: "Exterior Color", value: "White" },
      { label: "Interior", value: "Red interior" },
      { label: "Engine", value: "4.0L twin-turbocharged V8" },
      { label: "Power", value: "577 hp" },
      { label: "Torque", value: "627 lb-ft" },
      { label: "Transmission", value: "9-speed automatic" },
      { label: "Drivetrain", value: "4MATIC all-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Twin-turbo gasoline ICE" },
      { label: "Seating", value: "5 passengers" },
    ],
    equipment: [],
  },
  "rr-cullinan-2024": {
    overview: [
      { label: "Year", value: "2024" },
      { label: "Condition", value: "Used" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "Full-size luxury SUV" },
      { label: "Exterior Color", value: "Matte black" },
      { label: "Interior", value: "White interior" },
      { label: "Engine", value: "6.75L twin-turbocharged V12" },
      { label: "Power", value: "591 hp" },
      { label: "Torque", value: "664 lb-ft" },
      { label: "Transmission", value: "8-speed automatic" },
      { label: "Drivetrain", value: "All-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Twin-turbo gasoline ICE" },
      { label: "Seating", value: "4 or 5 passengers" },
    ],
    equipment: [],
  },
  "rr-ghost-2023": {
    overview: [
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Used" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "4-door extended-wheelbase saloon" },
      { label: "Exterior Color", value: "Two-tone silver and black" },
      { label: "Engine", value: "6.75L twin-turbocharged V12" },
      { label: "Power", value: "563 hp" },
      { label: "Torque", value: "627 lb-ft" },
      { label: "Transmission", value: "8-speed automatic" },
      { label: "Drivetrain", value: "All-wheel drive" },
      { label: "Fuel Type", value: "Gasoline" },
      { label: "Emissions Type", value: "Twin-turbo gasoline ICE" },
      { label: "Cabin Feature", value: "Starlight headliner" },
    ],
    equipment: [],
  },
  "toyota-land-cruiser-heritage-blue-2026": {
    overview: [
      { label: "Year", value: "2026" },
      { label: "Condition", value: "New" },
      { label: "Spec Source", value: "Equivalent model-year reference" },
      { label: "Body Style", value: "5-door SUV" },
      { label: "Exterior Color", value: "Heritage Blue" },
      { label: "Engine", value: "2.4L i-FORCE MAX turbocharged hybrid inline-4" },
      { label: "Power", value: "326 hp" },
      { label: "Torque", value: "465 lb-ft" },
      { label: "Transmission", value: "8-speed automatic" },
      { label: "Drivetrain", value: "Full-time 4-wheel drive" },
      { label: "Fuel Type", value: "Gasoline-electric hybrid" },
      { label: "Emissions Type", value: "Hybrid gasoline-electric" },
      { label: "Fuel Economy", value: "22 mpg city · 25 mpg highway" },
      { label: "Seating", value: "5 passengers" },
    ],
    equipment: [],
  },
};

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
