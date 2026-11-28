import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useCatalogue } from '@/components/catalogue-shell';
import { CollectionTabs } from '@/components/collection-tabs';
import { ProductBrowser } from '@/components/product-browser';

export const Route = createFileRoute('/products/')({
  head: () => ({ meta: [{ title: 'All products | Dhawan Foam & Sofa Materials' }, { name: 'description', content: 'Browse the full Dhawan Foam & Sofa Materials catalogue.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: AllProducts,
});

function AllProducts() {
  const { products, categories, loading, items, add } = useCatalogue();
  if (loading) return <div className="page-width auth-gate">Loading catalogue…</div>;
  return <>
    <CollectionTabs categories={categories} products={products} active="all" />
    <Link className="back-link page-width" to="/"><ArrowLeft size={15} /> Back to categories</Link>
    <ProductBrowser heading="Foam & sofa materials" eyebrow="THE COLLECTION" products={products} items={items} add={add} />
  </>;
}
