import { useState, type FormEvent } from 'react';
import { ImagePlus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { categories, categorySpecs, PLACEHOLDER_IMAGE } from '@/lib/catalogue';
import type { AdminProduct } from '@/lib/admin-catalogue';

export function AdminProductEditor({ product, onSave, onClose }: { product?: AdminProduct | undefined; onSave: (p: AdminProduct) => Promise<string | undefined>; onClose: () => void }) {
  const [form, setForm] = useState<AdminProduct>(product ?? { slug: '', name: '', category: 'Foams', type: '', price: '', density: '', sizes: '', description: '', images: [], tag: '', status: 'Draft', updated: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function field<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) { setForm(p => ({ ...p, [key]: value })); }
  function addPhoto(file: File) {
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { setError('Choose an image smaller than 10 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') setForm(p => ({ ...p, images: [...p.images, reader.result as string] })); };
    reader.readAsDataURL(file);
  }
  function removePhoto(index: number) { setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== index) })); }
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); const result = await onSave(form); setBusy(false); if (result) setError(result); }
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="admin-editor"><DialogTitle>{product ? 'Edit product' : 'Add product'}</DialogTitle><DialogDescription>Changes save to the product catalogue.</DialogDescription>
    <form onSubmit={submit} className="admin-product-form">
      <div className="admin-photos-field">
        <span className="admin-photos-label">Photos</span>
        <div className="admin-photos-grid">
          {form.images.map((src, i) => <div className="admin-photo" key={i}><img src={src} alt={`${form.name || 'Product'} photo ${i + 1}`} /><Button type="button" variant="ghost" size="icon" aria-label={`Remove photo ${i + 1}`} onClick={() => removePhoto(i)}><X size={14} /></Button>{i === 0 && <span className="admin-photo-primary">Primary</span>}</div>)}
          {form.images.length === 0 && <div className="admin-photo admin-photo-empty"><img src={PLACEHOLDER_IMAGE} alt="No photo yet" /></div>}
          <label className="admin-photo admin-photo-add"><ImagePlus size={18} /><span>Add photo</span><input type="file" accept="image/*" aria-label="Add product photo" onChange={e => { const file = e.target.files?.[0]; if (file) addPhoto(file); e.target.value = ''; }} /></label>
        </div>
        <span className="text-xs text-muted-foreground">JPG, PNG or WebP · first photo is used as the primary thumbnail</span>
      </div>
      <label>Product name<Input required value={form.name} onChange={e => { const name = e.target.value; setForm(p => ({ ...p, name, ...(!product ? { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') } : {}) })); }} /></label>
      <div className="admin-form-columns"><label>Category<select value={form.category} onChange={e => { const category = categories.find(c => c === e.target.value); if (category) field('category', category); }}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Material / type<Input required value={form.type} onChange={e => field('type', e.target.value)} /></label></div>
      <label>Price (e.g. ₹280 / sheet)<Input required value={form.price} onChange={e => field('price', e.target.value)} placeholder="₹280 / sheet" /></label>
      <div className="admin-form-columns"><label>{categorySpecs[form.category].specification}<Input required value={form.density} onChange={e => field('density', e.target.value)}  /></label><label>{categorySpecs[form.category].size}<Input required value={form.sizes} onChange={e => field('sizes', e.target.value)}  /></label></div>
      <label>Description<Textarea required rows={3} value={form.description} onChange={e => field('description', e.target.value)} /></label>
      <div className="admin-form-columns"><label>Product URL<Input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={e => field('slug', e.target.value)} /></label><label>Product badge<select value={form.tag ?? ''} onChange={e => field('tag', e.target.value)}><option value="">None</option><option>BULK FAVOURITE</option><option>POPULAR</option><option>PREMIUM</option></select></label></div>
      <div className="admin-publish-row"><div><strong>Published</strong><span>{form.status === 'Published' ? 'Visible in the catalogue' : 'Keep as a draft'}</span></div><Switch aria-label="Published" checked={form.status === 'Published'} onCheckedChange={checked => field('status', checked ? 'Published' : 'Draft')} /></div>
      {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
      <div className="admin-form-actions"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}><Save /> {busy ? 'Saving…' : 'Save product'}</Button></div>
    </form>
  </DialogContent></Dialog>;
}
