// One-off import: replaces all rows in `products` with the real rate list from
// Product List.xlsx (scripts/raw-product-list.json, exported via pandas).
// Run: POSTGRES_URL_NON_POOLING="..." node scripts/import-product-list.mjs
import postgres from "postgres";
import { readFile } from "node:fs/promises";

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL, { prepare: false });

// No stock photos are assigned here — every row starts with images: [] (an honest
// "No photo yet" placeholder in the UI) until a real photo is uploaded via /admin.

const CATEGORY_MAP = {
  Foam: "Foams",
  "Sofa Legs": "Sofa Legs",
  Adhesive: "Adhesives",
  "Stapler Pin": "Staple Pins",
  Protector: "Protectors",
  Fasteners: "Fasteners",
  Fabric: "Fabrics",
  Niwar: "Niwar",
};

function titleCase(s) {
  const t = String(s).toLowerCase().replace(/(^|[\s(/])([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
  return t.replace(/\b(Pvc|Ss)\b/g, (m) => m.toUpperCase());
}
function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function formatSize(s) {
  return String(s).replace(/MM/gi, "mm").replace(/X/g, "×");
}
// "745 / sheet" -> {amount:745, unit:"sheet"}; "60/PKT" -> {amount:60, unit:"PKT"}; "800" -> {amount:800, unit:null}
function parseRate(rate) {
  const str = String(rate);
  const m = str.match(/^([\d,.]+)\s*\/\s*(.+)$/);
  if (m) return { amount: m[1].replace(/,/g, ""), unit: m[2].trim() };
  return { amount: str.trim(), unit: null };
}
const UNIT_WORDS = { PC: "piece", PKT: "packet", KG: "kg", MTR: "metre", PETI: "box", sheet: "sheet" };
function unitWord(raw, fallback) {
  if (!raw) return fallback;
  return UNIT_WORDS[raw] ?? UNIT_WORDS[raw.toUpperCase()] ?? raw.toLowerCase();
}
function price(rate, fallbackUnit) {
  const { amount, unit } = parseRate(rate);
  return `₹${amount} / ${unitWord(unit, fallbackUnit)}`;
}

function mapRow(raw) {
  const category = CATEGORY_MAP[raw.Category];
  if (!category) throw new Error(`Unknown category: ${raw.Category}`);
  const item = String(raw["Item / Quality"]).trim();
  const sizeRaw = String(raw.Size).trim();
  const densityRaw = String(raw.Density).trim();
  const hasSize = sizeRaw && sizeRaw !== "-";
  const hasDensity = densityRaw && densityRaw !== "-";
  const type = titleCase(item);

  let name, density, sizes, productPrice, productType = type;

  switch (category) {
    case "Foams": {
      const size = formatSize(sizeRaw.split("/")[0]);
      name = `${type} ${densityRaw} ${size}`;
      density = densityRaw;
      sizes = formatSize(sizeRaw);
      productPrice = price(raw.Rate, "sheet");
      break;
    }
    case "Protectors": {
      const size = formatSize(sizeRaw);
      name = `Mattress Protector ${size}`;
      productType = "Protector";
      density = "Protector";
      sizes = `${size} in`;
      productPrice = price(raw.Rate, "piece");
      break;
    }
    case "Fasteners": {
      const sizeFmt = sizeRaw.replace(/MM/gi, "mm");
      name = hasSize ? `${type} ${sizeFmt}` : type;
      density = hasSize ? sizeFmt : "Standard";
      const { unit } = parseRate(raw.Rate);
      sizes = unit ? `Per ${unitWord(unit, "unit")}` : "Per unit";
      productPrice = price(raw.Rate, "unit");
      break;
    }
    case "Fabrics": {
      name = hasSize ? `${type} ${sizeRaw}` : `${type} Fabric`;
      density = type;
      sizes = hasSize ? sizeRaw : "Standard width";
      productPrice = price(raw.Rate, "metre");
      break;
    }
    case "Niwar": {
      density = /JOOT/i.test(item) ? "Jute" : /ELASTIK/i.test(item) ? "Elastic" : type;
      name = hasSize ? `${type} ${sizeRaw}` : type;
      sizes = hasSize ? sizeRaw : "Standard";
      productPrice = price(raw.Rate, "metre");
      break;
    }
    case "Staple Pins": {
      productType = "Staple Pin";
      const { unit } = parseRate(raw.Rate);
      const boxed = unit === "PETI";
      name = `Staple Pin ${titleCase(sizeRaw)} (${boxed ? "Box" : "Piece"})`;
      density = titleCase(sizeRaw);
      sizes = boxed ? "Per box" : "Per piece";
      productPrice = price(raw.Rate, "piece");
      break;
    }
    case "Sofa Legs": {
      const finish = titleCase(item.replace(/SOFA LEG/i, "").trim());
      productType = titleCase(sizeRaw);
      name = `${finish} Sofa Leg ${sizeRaw}`;
      density = finish;
      sizes = sizeRaw;
      productPrice = price(raw.Rate, "piece");
      break;
    }
    case "Adhesives": {
      const sizeFormatted = sizeRaw.replace(/LTR/gi, "litre").replace(/ML/gi, "ml");
      name = `${type} ${sizeFormatted}`;
      density = type;
      sizes = sizeFormatted;
      productPrice = price(raw.Rate, sizeFormatted || "pack");
      break;
    }
    default:
      throw new Error(`Unhandled category: ${category}`);
  }

  const slugBase = slugify(`${category}-${item}-${densityRaw}-${sizeRaw}`);
  return {
    slug: slugBase,
    name: name.replace(/\s+/g, " ").trim(),
    category,
    type: productType,
    images: [],
    price: productPrice,
    density,
    sizes,
    description: `${name.replace(/\s+/g, " ").trim()} — ${category.toLowerCase()} for bulk supply. Confirm availability and pricing with your supplier.`,
  };
}

const raw = JSON.parse(await readFile(new URL("./raw-product-list.json", import.meta.url), "utf8"));
const mapped = raw.map(mapRow);

// de-duplicate slugs
const seen = new Map();
for (const p of mapped) {
  const count = seen.get(p.slug) ?? 0;
  seen.set(p.slug, count + 1);
  if (count > 0) p.slug = `${p.slug}-${count + 1}`;
}

if (process.env.DRY_RUN) {
  console.log(`${mapped.length} rows mapped, ${seen.size} unique slugs.`);
  const byCategory = {};
  for (const p of mapped) (byCategory[p.category] ??= []).push(p);
  for (const [cat, items] of Object.entries(byCategory)) {
    console.log(`\n=== ${cat} (${items.length}) ===`);
    for (const p of items.slice(0, 4)) console.log(JSON.stringify(p, null, 1));
  }
  const dupes = [...seen.entries()].filter(([, n]) => n > 1);
  console.log(`\nDuplicate slug bases: ${dupes.length}`);
  await sql.end();
  process.exit(0);
}

try {
  await sql`delete from products`;
  for (const p of mapped) {
    await sql`
      insert into products (slug, name, category, type, images, price, density, sizes, description, status)
      values (${p.slug}, ${p.name}, ${p.category}, ${p.type}, ${sql.json(p.images)}, ${p.price}, ${p.density}, ${p.sizes}, ${p.description}, 'Published')
    `;
  }
  console.log(`Imported ${mapped.length} products, replacing previous catalogue.`);
} catch (e) {
  console.error("ERROR", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
