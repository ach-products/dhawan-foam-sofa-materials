import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useCatalogue } from '@/components/catalogue-shell';
import { CollectionTabs } from '@/components/collection-tabs';
import { ProductBrowser } from '@/components/product-browser';
import { categorySlug } from '@/lib/catalogue';

export const Route = createFileRoute('/category/$slug')({
  head: () => ({ meta: [{ title: 'Dhawan Foam & Sofa Materials' }, { name: 'description', content: 'Explore the Dhawan Foam & Sofa Materials catalogue.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { products, categories, loading, items, add } = useCatalogue();
  if (loading) return <div className="page-width auth-gate">Loading catalogue…</div>;
  const category = categories.find(c => categorySlug(c.name) === slug);
  if (!category) return <div className="page-width detail-page"><Link className="back-link" to="/"><ArrowLeft size={15} /> Back to categories</Link><div className="auth-gate">Category not found.</div></div>;
  const scoped = products.filter(p => p.category === category.name);
  return <>
    <CollectionTabs categories={categories} products={products} active={category.name} />
    <Link className="back-link page-width" to="/"><ArrowLeft size={15} /> Back to categories</Link>
    <ProductBrowser heading={category.name} eyebrow="THE COLLECTION" products={scoped} items={items} add={add} />
  </>;
}
