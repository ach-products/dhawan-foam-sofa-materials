import { describe, expect, it } from 'vitest';
import { products, filterProducts } from '@/lib/catalogue';

describe('Catalogue scope', () => {
  it('includes the expanded sofa materials categories', () => {
    expect(products.length).toBeGreaterThan(0);
    expect([...new Set(products.map(p => p.category))].sort()).toEqual(['Adhesives', 'Fabrics', 'Foams', 'Sofa Legs', 'Staple Pins']);
  });
  it('does not include mattresses', () => {
    expect(products.some(p => /mattress/i.test(p.name))).toBe(false);
  });
  it('shows a rupee price tag on every product', () => {
    expect(products.every(p => /^₹\d/.test(p.price))).toBe(true);
  });
  it('searches product names without case sensitivity', () => {
    expect(filterProducts(products, 'All products', 'HIGH RESILIENCE').map(p => p.slug)).toEqual(['high-resilience-foam']);
  });
  it('filters sofa legs independently', () => {
    expect(filterProducts(products, 'Sofa Legs', '').map(p => p.slug)).toEqual(['chrome-sofa-legs']);
  });
  it('filters upholstery fabrics independently', () => {
    expect(filterProducts(products, 'Fabrics', '').map(p => p.slug)).toEqual(['upholstery-fabrics']);
  });
  it('filters staple pin series independently', () => {
    expect(filterProducts(products, 'Staple Pins', '').map(p => p.slug)).toEqual(['80-series-staple-pins', '71-series-staple-pins']);
  });
  it('filters adhesive products independently', () => {
    expect(filterProducts(products, 'Adhesives', '').map(p => p.slug)).toEqual(['foam-contact-adhesive', 'fevicol-type-adhesive', 'bulk-adhesive-drum-pack', 'sofa-repair-adhesive', 'spray-adhesive', 'water-based-foam-glue']);
  });
  it('supplies adhesives in bulk cans, buckets and drums', () => {
    expect(filterProducts(products, 'Adhesives', 'drum').map(p => p.slug)).toEqual(['bulk-adhesive-drum-pack']);
    expect(products.filter(p => p.category === 'Adhesives').every(p => /\d+\s?(L|ml)/.test(p.sizes))).toBe(true);
  });
  it('includes additional foam qualities', () => {
    expect(filterProducts(products, 'Foams', '').filter(p => p.name.includes('Density')).map(p => p.density)).toEqual(['23 kg/m³', '32 kg/m³', '40 kg/m³']);
  });
});
import { foamOptions } from '@/lib/catalogue';
describe('foam size and density options', () => {
  it('offers densities inside the product range only', () => {
    const p = products.find(p => p.slug === 'pu-foam-sheets')!;
    expect(foamOptions(p)?.densities).toEqual(['18 kg/m³', '23 kg/m³', '28 kg/m³', '32 kg/m³', '40 kg/m³']);
    expect(foamOptions(p)?.thicknesses).toEqual(['25 mm', '50 mm', '75 mm', '100 mm', '125 mm', '150 mm']);
  });
  it('gives no foam options for non-foam products', () => {
    expect(foamOptions(products.find(p => p.category === 'Adhesives')!)).toBeNull();
  });
});
import { buildBill as _bb } from '@/lib/catalogue';
describe('bill', () => { it('multiplies fixed rate by quantity', () => { const b = _bb(products, [{ slug: 'pu-foam-sheets', quantity: 10 }, { slug: 'bulk-adhesive-drum-pack', quantity: 2 }]); expect(b.lines[0]!.total).toBe(2800); expect(b.grandTotal).toBe(2800 + 7600); }); });
