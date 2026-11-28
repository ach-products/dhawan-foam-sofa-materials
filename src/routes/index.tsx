import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCatalogue } from '@/components/catalogue-shell';
import { CollectionTabs } from '@/components/collection-tabs';
import { categorySlug, PLACEHOLDER_IMAGE } from '@/lib/catalogue';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Dhawan Foam & Sofa Materials | Bulk Product Catalogue' }, { name: 'description', content: 'Explore foam qualities, sofa legs, fabrics, staple pins and adhesives for bulk supply at Dhawan Foam & Sofa Materials.' }, { property: 'og:title', content: 'Dhawan Foam & Sofa Materials | Product Catalogue' }, { property: 'og:description', content: 'Foams, sofa legs, fabrics, staple pins and adhesives. Explore the bulk materials collection.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Catalogue,
});

function Catalogue() {
  const { products, categories, loading } = useCatalogue();
  if (loading) return <div className="page-width auth-gate">Loading catalogue…</div>;
  return <>
    <CollectionTabs categories={categories} products={products} active="home" />
    <section className="product-section page-width">
      <div className="section-heading"><div><span className="eyebrow">SHOP BY CATEGORY</span><h1>What are you looking for?<span>{categories.length} categories</span></h1></div></div>
      <div className="product-grid">{categories.map(c => { const list = products.filter(p => p.category === c.name); const slug = categorySlug(c.name); return <article className="product-card category-card" key={c.name}>
        <Link className="product-visual category-visual" to="/category/$slug" params={{ slug }} aria-label={`Browse ${c.name}`}><img src={c.image || PLACEHOLDER_IMAGE} alt={c.name} loading="lazy" /></Link>
        <div className="product-info"><span>{list.length} products</span><Link className="category-name" to="/category/$slug" params={{ slug }}><h3>{c.name}</h3></Link><p>{c.description}</p><Link className="details-link" to="/category/$slug" params={{ slug }}>Browse {c.name.toLowerCase()} <ArrowRight size={13} /></Link></div>
      </article>; })}</div>
      <div className="load-more"><Button variant="outline" asChild><Link to="/products">View all {products.length} products <ArrowRight /></Link></Button></div>
    </section>
  </>;
}
