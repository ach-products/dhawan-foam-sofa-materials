// Admin products are stored in the production database (src/lib/products.functions.ts);
// this module just re-exports the shared shape for components that still import it by this name.
export type { DbProduct as AdminProduct } from '@/lib/products.functions';
