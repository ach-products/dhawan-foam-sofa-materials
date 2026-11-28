import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { categorySlug, type Product } from '@/lib/catalogue';
import type { Category } from '@/lib/categories.functions';

// Real links (not tab buttons that swap client state) so each category is its own page in
// browser history — the back button returns to the previous category/home instead of exiting
// the app, and jumping straight from one category to another (e.g. sofa legs to foam) is a
// single click here rather than having to go back to the grid first.
export function CollectionTabs({ categories, products, active }: { categories: Category[]; products: Product[]; active: 'home' | 'all' | string }) {
  return <div className="collection-tabs page-width" role="tablist" aria-label="Product categories">
    <Button asChild role="tab" aria-selected={active === 'home'} variant="ghost" className={active === 'home' ? 'category-tab selected' : 'category-tab'}>
      <Link to="/">Categories<span>{categories.length}</span></Link>
    </Button>
    {categories.map(c => <Button asChild key={c.name} role="tab" aria-selected={active === c.name} variant="ghost" className={active === c.name ? 'category-tab selected' : 'category-tab'}>
      <Link to="/category/$slug" params={{ slug: categorySlug(c.name) }}>{c.name}<span>{products.filter(p => p.category === c.name).length}</span></Link>
    </Button>)}
    <Button asChild role="tab" aria-selected={active === 'all'} variant="ghost" className={active === 'all' ? 'category-tab selected' : 'category-tab'}>
      <Link to="/products">All products<span>{products.length}</span></Link>
    </Button>
    <span className="collection-caption">THE MATERIALS COLLECTION</span>
  </div>;
}
