import { createServerFn } from "@tanstack/react-start";
import type { ProductCategory } from "@/lib/catalogue";

export type DbProduct = {
  slug: string;
  name: string;
  category: ProductCategory;
  type: string;
  images: string[];
  price: string;
  density: string;
  sizes: string;
  description: string;
  tag?: string;
  status: "Published" | "Draft";
  updated: string;
};

type ProductRow = {
  slug: string;
  name: string;
  category: string;
  type: string;
  images: unknown;
  price: string;
  density: string;
  sizes: string;
  description: string;
  tag: string | null;
  status: string;
  updated_at: string;
};

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, " ");
}

function toDbProduct(row: ProductRow): DbProduct {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    type: row.type,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    price: row.price,
    density: row.density,
    sizes: row.sizes,
    description: row.description,
    ...(row.tag ? { tag: row.tag } : {}),
    status: row.status as "Published" | "Draft",
    updated: formatUpdated(row.updated_at),
  };
}

export const listAllProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { sql } = await import("@/lib/db.server");
  const rows = (await sql`select * from products order by updated_at desc`) as unknown as ProductRow[];
  return rows.map(toDbProduct);
});

// Public: only published products, for the live catalogue and product detail pages.
export const listPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { sql } = await import("@/lib/db.server");
  const rows = (await sql`select * from products where status = 'Published' order by name asc`) as unknown as ProductRow[];
  return rows.map(toDbProduct);
});

export const saveProduct = createServerFn({ method: "POST" })
  .validator((data: { product: DbProduct; originalSlug?: string }) => data)
  .handler(async ({ data }) => {
    const { sql } = await import("@/lib/db.server");
    const { product, originalSlug } = data;

    if (!product.name.trim() || !product.slug.trim()) throw new Error("Product name and URL are required.");
    const categoryExists = await sql`select 1 from categories where name = ${product.category}`;
    if (categoryExists.length === 0) throw new Error("Choose a supported product category.");

    const clash = await sql`select 1 from products where slug = ${product.slug} and slug != ${originalSlug ?? ""}`;
    if (clash.length > 0) throw new Error("This product URL is already in use.");

    if (originalSlug) {
      await sql`
        update products set
          slug = ${product.slug}, name = ${product.name}, category = ${product.category}, type = ${product.type},
          images = ${sql.json(product.images)}, price = ${product.price}, density = ${product.density}, sizes = ${product.sizes},
          description = ${product.description}, tag = ${product.tag ?? null}, status = ${product.status}, updated_at = now()
        where slug = ${originalSlug}
      `;
    } else {
      await sql`
        insert into products (slug, name, category, type, images, price, density, sizes, description, tag, status)
        values (${product.slug}, ${product.name}, ${product.category}, ${product.type}, ${sql.json(product.images)}, ${product.price}, ${product.density}, ${product.sizes}, ${product.description}, ${product.tag ?? null}, ${product.status})
      `;
    }
    return { ok: true as const };
  });

export const deleteProducts = createServerFn({ method: "POST" })
  .validator((data: { slugs: string[] }) => data)
  .handler(async ({ data }) => {
    const { sql } = await import("@/lib/db.server");
    await sql`delete from products where slug = any(${data.slugs})`;
    return { ok: true as const };
  });
