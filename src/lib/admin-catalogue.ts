import { categories, products, type Product } from '@/lib/catalogue';

export type AdminProduct = Product & { status: 'Published' | 'Draft'; updated: string };
export const demoProducts: AdminProduct[] = products.map((p, i) => ({ ...p, status: i === 10 || i === 17 ? 'Draft' : 'Published', updated: '18 Nov 2026' }));
export function saveDemoProduct(items: AdminProduct[], product: AdminProduct, originalSlug?: string) {
  if (!categories.includes(product.category)) throw new Error('Choose a supported product category.');
  if (!product.name.trim() || !product.slug.trim()) throw new Error('Product name and URL are required.');
  if (items.some(p => p.slug === product.slug && p.slug !== originalSlug)) throw new Error('This product URL is already in use.');
  return originalSlug ? items.map(p => p.slug === originalSlug ? product : p) : [product, ...items];
}
export function deleteDemoProducts(items: AdminProduct[], slugs: string[]) {
  return items.filter(p => !slugs.includes(p.slug));
}