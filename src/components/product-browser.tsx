import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { filterProducts, primaryImage, type Product } from '@/lib/catalogue';

const PAGE_SIZE = 50;

export function ProductBrowser({ heading, eyebrow, products, items, add }: {
  heading: string;
  eyebrow: string;
  products: Product[]; // already scoped to the current category, or all products
  items: { slug: string; quantity: number }[];
  add: (slug: string, quantity?: number) => void;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [type, setType] = useState('All types');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const filtered = filterProducts(products, 'All products', query, type);
  const sorted = sort === 'Name: A–Z' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : sort === 'Name: Z–A' ? [...filtered].sort((a, b) => b.name.localeCompare(a.name)) : filtered;

  return <section className="product-section page-width" id="collection">
    <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{heading}<span>{filtered.length} products</span></h1></div></div>
    <div className="catalogue-toolbar">
      <Button variant="ghost" className={filterOpen ? 'filter-toggle active' : 'filter-toggle'} onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal /> Filter by <ChevronDown /></Button>
      <div className="search-box"><Search size={16} /><input aria-label="Search products" placeholder="Search the collection" value={query} onChange={e => setQuery(e.target.value)} />{query && <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQuery('')}><X /></Button>}</div>
      <label className="sort-control">Sort by <select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}><option>Featured</option><option>Name: A–Z</option><option>Name: Z–A</option></select><ChevronDown size={14} /></label>
    </div>
    {filterOpen && <div className="filter-panel"><label>Material type<select value={type} onChange={e => setType(e.target.value)} aria-label="Material type"><option>All types</option>{[...new Set(products.map(p => p.type))].map(t => <option key={t}>{t}</option>)}</select></label><Button variant="link" onClick={() => { setType('All types'); setQuery(''); }}>Reset filters <X /></Button></div>}
    <div className="product-grid">{sorted.slice(0, limit).map(p => { const selected = items.some(i => i.slug === p.slug); return <article className="product-card" key={p.slug}><div className="product-visual"><Link to="/products/$slug" params={{ slug: p.slug }} aria-label={`View ${p.name}`}><img src={primaryImage(p)} alt={p.name} loading="lazy" /></Link>{p.tag && <span className="product-tag">{p.tag}</span>}<Button className={selected ? 'add-product is-added' : 'add-product'} variant="ghost" size="icon" title={selected ? 'Add another to enquiry' : 'Add to bulk enquiry'} aria-label={`Add ${p.name} to enquiry`} onClick={() => add(p.slug)}>{selected ? <Check /> : <Plus />}</Button></div><div className="product-info"><span>{p.type}</span><Link to="/products/$slug" params={{ slug: p.slug }}><h3>{p.name}</h3></Link><strong className="product-price">{p.price}</strong><p>{p.density}<span className="spec-dot">·</span>{p.sizes}</p><Link className="details-link" to="/products/$slug" params={{ slug: p.slug }}>View details <ArrowUpRight size={13} /></Link></div></article>; })}</div>
    {filtered.length === 0 && <div className="no-results"><Search /><h3>No matching products</h3><Button variant="link" onClick={() => { setQuery(''); setType('All types'); }}>Clear filters <X /></Button></div>}
    <div className="load-more"><span>Showing {Math.min(limit, filtered.length)} of {filtered.length} products</span>{limit < filtered.length && <Button variant="outline" onClick={() => setLimit(limit + PAGE_SIZE)}>View more <Plus /></Button>}</div>
  </section>;
}
