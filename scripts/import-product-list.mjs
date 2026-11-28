// One-off import: replaces all rows in `products` with the real rate list from
// Product List.xlsx (scripts/raw-product-list.json, exported via pandas).
// Run: POSTGRES_URL_NON_POOLING="..." node scripts/import-product-list.mjs
import postgres from "postgres";
import { readFile } from "node:fs/promises";

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL, { prepare: false });

const pu = "/__l5e/assets-v1/8b199622-6022-4179-a5c9-bdc77671d88f/pu-foam.webp";
const legs = "/__l5e/assets-v1/c56f6d52-7b0d-42fb-9061-3e87fa38d8e5/sofa-legs.png";
const fabric = "/__l5e/assets-v1/f5fe9860-38fa-49ec-b5d0-ef6e3d84674f/upholstery-fabrics.png";
const pins = "/__l5e/assets-v1/4b8dd7e6-c6e2-405e-a81b-61723eba3025/staple-pins.png";
const glue = "/__l5e/assets-v1/8400e7b2-8aaa-4602-9983-5775adf969f2/foam-glue.png";
const spray = "/__l5e/assets-v1/de98e8d7-6bfb-4a91-987e-5fc1ab97fb3a/spray-glue.png";
const bucket = "/__l5e/assets-v1/a2480c89-ef3d-40ba-972e-63908bc34ed1/adhesive-bucket.png";

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

  let name, density, sizes, img, productPrice, productType = type;

  switch (category) {
    case "Foams": {
      const size = formatSize(sizeRaw.split("/")[0]);
      name = `${type} ${densityRaw} ${size}`;
      density = densityRaw;
      sizes = formatSize(sizeRaw);
      img = pu;
      productPrice = price(raw.Rate, "sheet");
      break;
    }
    case "Protectors": {
      const size = formatSize(sizeRaw);
      name = `Mattress Protector ${size}`;
      productType = "Protector";
      density = "Protector";
      sizes = `${size} in`;
      img = fabric;
      productPrice = price(raw.Rate, "piece");
      break;
    }
    case "Fasteners": {
      const sizeFmt = sizeRaw.replace(/MM/gi, "mm");
      name = hasSize ? `${type} ${sizeFmt}` : type;
      density = hasSize ? sizeFmt : "Standard";
      const { unit } = parseRate(raw.Rate);
      sizes = unit ? `Per ${unitWord(unit, "unit")}` : "Per unit";
      img = pins;
      productPrice = price(raw.Rate, "unit");
      break;
    }
    case "Fabrics": {
      name = hasSize ? `${type} ${sizeRaw}` : `${type} Fabric`;
      density = type;
      sizes = hasSize ? sizeRaw : "Standard width";
      img = fabric;
      productPrice = price(raw.Rate, "metre");
      break;
    }
    case "Niwar": {
      density = /JOOT/i.test(item) ? "Jute" : /ELASTIK/i.test(item) ? "Elastic" : type;
      name = hasSize ? `${type} ${sizeRaw}` : type;
      sizes = hasSize ? sizeRaw : "Standard";
      img = fabric;
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
      img = pins;
      productPrice = price(raw.Rate, "piece");
      break;
    }
    case "Sofa Legs": {
      const finish = titleCase(item.replace(/SOFA LEG/i, "").trim());
      productType = titleCase(sizeRaw);
      name = `${finish} Sofa Leg ${sizeRaw}`;
      density = finish;
      sizes = sizeRaw;
      img = legs;
      productPrice = price(raw.Rate, "piece");
      break;
    }
    case "Adhesives": {
      const sizeFormatted = sizeRaw.replace(/LTR/gi, "litre").replace(/ML/gi, "ml");
      name = `${type} ${sizeFormatted}`;
      density = type;
      sizes = sizeFormatted;
      img = /SPRAY/i.test(sizeRaw) || /SPRAY/i.test(item) ? spray : /FEVICOL/i.test(item) ? bucket : glue;
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
    image: img,
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
      insert into products (slug, name, category, type, image, price, density, sizes, description, status)
      values (${p.slug}, ${p.name}, ${p.category}, ${p.type}, ${p.image}, ${p.price}, ${p.density}, ${p.sizes}, ${p.description}, 'Published')
    `;
  }
  console.log(`Imported ${mapped.length} products, replacing previous catalogue.`);
} catch (e) {
  console.error("ERROR", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
