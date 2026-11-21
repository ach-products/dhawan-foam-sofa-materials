// Server-only: shared Postgres connection to the production Supabase database.
// Load via `await import(...)` inside a server function handler, never at a route's top level.
import postgres from "postgres";

function getConnectionString(): string {
  const url = process.env["POSTGRES_URL_NON_POOLING"] ?? process.env["POSTGRES_URL"];
  if (!url) throw new Error("Missing POSTGRES_URL(_NON_POOLING) environment variable.");
  return url;
}

let _sql: ReturnType<typeof postgres> | undefined;

export const sql = new Proxy((() => {}) as unknown as ReturnType<typeof postgres>, {
  apply(_target, _thisArg, args) {
    if (!_sql) _sql = postgres(getConnectionString(), { prepare: false });
    return Reflect.apply(_sql as unknown as (...a: unknown[]) => unknown, _sql, args);
  },
  get(_target, prop, receiver) {
    if (!_sql) _sql = postgres(getConnectionString(), { prepare: false });
    return Reflect.get(_sql, prop, receiver);
  },
});
