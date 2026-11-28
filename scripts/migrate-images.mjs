// One-off migration: replaces the single `image` column (which only ever held broken
// Lovable-sandbox-only asset paths — fake placeholders, never real photos) with a proper
// `images jsonb` array, defaulted empty so the UI shows an honest "No photo yet" placeholder
// until real photos are uploaded via /admin.
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL, { prepare: false });

try {
  await sql`alter table products add column if not exists images jsonb not null default '[]'`;
  await sql`update products set images = '[]'::jsonb`;
  await sql`alter table products drop column if exists image`;
  console.log("Migrated: products.image -> products.images (jsonb array), reset to empty.");
} catch (e) {
  console.error("ERROR", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
