// One-off migration: creates the `categories` table (admin-managed, replacing the hardcoded
// category list + categorySpecs in src/lib/catalogue.ts) and seeds it from the current 8
// categories so nothing breaks. Safe to re-run (seeds only rows that don't already exist).
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL, { prepare: false });

const seed = [
  { name: "Foams", specification: "Density", size: "Available thickness", description: "Upholstery, support and comfort foam qualities" },
  { name: "Sofa Legs", specification: "Material / finish", size: "Available heights", description: "Furniture legs and sofa supports" },
  { name: "Fabrics", specification: "Texture / finish", size: "Width / supply", description: "Upholstery fabrics for sofas and cushions" },
  { name: "Staple Pins", specification: "Series / material", size: "Leg length", description: "Upholstery fastening pins and staple strips" },
  { name: "Adhesives", specification: "Base / tack type", size: "Pack sizes", description: "Fevicol-type, foam bonding and sofa repair adhesives in bulk cans, buckets and drums" },
  { name: "Protectors", specification: "Type", size: "Dimensions", description: "Mattress and sofa protectors" },
  { name: "Fasteners", specification: "Length / gauge", size: "Pack type", description: "Nails, screws and tingle fasteners for furniture assembly" },
  { name: "Niwar", specification: "Material", size: "Width", description: "Jute and elastic webbing for seat and back support" },
];

try {
  await sql`
    create table if not exists categories (
      name text primary key,
      description text not null default '',
      specification text not null default 'Specification',
      size text not null default 'Size',
      image text not null default '',
      sort_order int not null default 0,
      updated_at timestamptz not null default now()
    )
  `;
  console.log("Table ready.");

  for (let i = 0; i < seed.length; i++) {
    const c = seed[i];
    await sql`
      insert into categories (name, description, specification, size, sort_order)
      values (${c.name}, ${c.description}, ${c.specification}, ${c.size}, ${i})
      on conflict (name) do nothing
    `;
  }
  const { count } = (await sql`select count(*)::int from categories`)[0];
  console.log(`categories table has ${count} rows.`);
} catch (e) {
  console.error("ERROR", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
