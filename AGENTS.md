<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Catalogue architecture
- Keep category options, specification labels, and pure pricing/filtering helpers in the shared browser-safe `src/lib/catalogue.ts` module; grid and detail pages must use the same product specifications and helpers.
- Product data is production data, stored in the Supabase Postgres database (`products` table) managed via `src/lib/products.functions.ts` and the `/admin` panel. The static `products` array in `catalogue.ts` is seed/reference data only (used by `scripts/setup-db.mjs`), not the live source for the public catalogue's own admin-managed state.
- Keep enquiry selections in the shared shell's React context. Submitting an enquiry calls `src/lib/enquiries.functions.ts`, which inserts a real row into the `enquiries` table — this is a real submission, not a demo action. "Download bill" remains a separate, secondary action that only exports a local copy.

## Admin panel architecture
- The admin panel at `/admin` manages real, persistent product data via `src/lib/products.functions.ts` (backed by the `products` table in the production Supabase database) — edits, publishing, and deletes are permanent, not in-memory or demo state.
- Server-only secrets (`BLACKSMS_API_KEY`, `BLACKSMS_SENDER_ID`, `OTP_SIGNING_SECRET`, `POSTGRES_*`, `SUPABASE_SERVICE_ROLE_KEY`) live in `.env.local` (gitignored) for local dev and in each deployment platform's own env var store (Vercel, and Lovable Secrets for the Lovable Cloud build) — never in a committed file.
