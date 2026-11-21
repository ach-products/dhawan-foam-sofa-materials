import { describe, expect, it } from 'vitest';
import { demoProducts, saveDemoProduct, deleteDemoProducts } from '@/lib/admin-catalogue';
import { products } from '@/lib/catalogue';

describe('Admin demo catalogue', () => {
  it.each(['Sofa Legs', 'Fabrics', 'Staple Pins', 'Adhesives'] as const)('accepts a new %s demo product', category => {
    const source = demoProducts.find(p => p.category === category);
    if (!source) throw new Error('Missing category sample');
    const next = saveDemoProduct(demoProducts, { ...source, slug: `test-${source.slug}` });
    expect(next[0]?.category).toBe(category);
    expect(products.some(p => p.slug === `test-${source.slug}`)).toBe(false);
  });
  it('adds a foam product without changing the public catalogue', () => {
    const source = demoProducts[0];
    if (!source) throw new Error('Missing sample');
    const next = saveDemoProduct(demoProducts, { ...source, slug: 'test-foam', name: 'Test foam' });
    expect(next.length).toBe(demoProducts.length + 1);
    expect(products.some(p => p.slug === 'test-foam')).toBe(false);
  });
  it('updates the existing product rather than creating a duplicate', () => {
    const source = demoProducts[0];
    if (!source) throw new Error('Missing sample');
    const next = saveDemoProduct(demoProducts, { ...source, name: 'Updated foam', status: 'Draft' }, source.slug);
    expect(next.length).toBe(demoProducts.length);
    expect(next.find(p => p.slug === source.slug)?.status).toBe('Draft');
  });
  it('rejects a duplicate product URL', () => {
    const source = demoProducts[0];
    if (!source) throw new Error('Missing sample');
    expect(() => saveDemoProduct(demoProducts, source)).toThrow('already in use');
  });
  it('deletes only the selected demo product', () => {
    const next = deleteDemoProducts(demoProducts, ['pu-foam-sheets']);
    expect(next.some(p => p.slug === 'pu-foam-sheets')).toBe(false);
    expect(next.length).toBe(demoProducts.length - 1);
    expect(products.some(p => p.slug === 'pu-foam-sheets')).toBe(true);
  });
});