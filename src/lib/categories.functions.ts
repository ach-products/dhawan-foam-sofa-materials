import { createServerFn } from "@tanstack/react-start";

export type Category = {
  name: string;
  description: string;
  specification: string;
  size: string;
  image: string;
};

type CategoryRow = Category & { sort_order: number };

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { sql } = await import("@/lib/db.server");
  const rows = (await sql`select * from categories order by sort_order asc, name asc`) as unknown as CategoryRow[];
  return rows.map(({ name, description, specification, size, image }) => ({ name, description, specification, size, image }));
});

export const saveCategory = createServerFn({ method: "POST" })
  .validator((data: { category: Category; originalName?: string; token: string | null }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    requireAdmin(data.token);
    const { sql } = await import("@/lib/db.server");
    const { category, originalName } = data;

    if (!category.name.trim()) throw new Error("Category name is required.");
    if (!category.specification.trim() || !category.size.trim()) throw new Error("Specification and size labels are required.");

    const clash = await sql`select 1 from categories where name = ${category.name} and name != ${originalName ?? ""}`;
    if (clash.length > 0) throw new Error("This category name is already in use.");

    if (originalName) {
      await sql`
        update categories set
          name = ${category.name}, description = ${category.description}, specification = ${category.specification},
          size = ${category.size}, image = ${category.image}, updated_at = now()
        where name = ${originalName}
      `;
      if (category.name !== originalName) {
        await sql`update products set category = ${category.name} where category = ${originalName}`;
      }
    } else {
      const { max } = (await sql`select coalesce(max(sort_order), -1)::int as max from categories`)[0] as { max: number };
      await sql`
        insert into categories (name, description, specification, size, image, sort_order)
        values (${category.name}, ${category.description}, ${category.specification}, ${category.size}, ${category.image}, ${max + 1})
      `;
    }
    return { ok: true as const };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .validator((data: { name: string; token: string | null }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server");
    requireAdmin(data.token);
    const { sql } = await import("@/lib/db.server");
    const inUse = await sql`select count(*)::int as n from products where category = ${data.name}`;
    const n = (inUse[0] as { n: number }).n;
    if (n > 0) throw new Error(`${n} product${n === 1 ? "" : "s"} still use this category. Move or delete them first.`);
    await sql`delete from categories where name = ${data.name}`;
    return { ok: true as const };
  });
