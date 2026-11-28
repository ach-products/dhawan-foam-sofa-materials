import { createServerFn } from "@tanstack/react-start";

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((data: { phone: string | null; items: { slug: string; quantity: number }[]; grandTotal: number }) => data)
  .handler(async ({ data }) => {
    const { sql } = await import("@/lib/db.server");
    const rows = (await sql`
      insert into enquiries (phone, items, grand_total)
      values (${data.phone ?? "Not logged in"}, ${JSON.stringify(data.items)}, ${data.grandTotal})
      returning id
    `) as unknown as { id: string }[];
    return { id: rows[0]!.id };
  });
