import { useState, type FormEvent } from 'react';
import { ImagePlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PLACEHOLDER_IMAGE } from '@/lib/catalogue';
import type { Category } from '@/lib/categories.functions';

export function AdminCategoryEditor({ category, onSave, onClose }: { category?: Category | undefined; onSave: (c: Category) => Promise<string | undefined>; onClose: () => void }) {
  const [form, setForm] = useState<Category>(category ?? { name: '', description: '', specification: '', size: '', image: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function field<K extends keyof Category>(key: K, value: Category[K]) { setForm(c => ({ ...c, [key]: value })); }
  function choosePhoto(file: File) {
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { setError('Choose an image smaller than 10 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') field('image', reader.result); };
    reader.readAsDataURL(file);
  }
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); const result = await onSave(form); setBusy(false); if (result) setError(result); }
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="admin-editor"><DialogTitle>{category ? 'Edit category' : 'Add category'}</DialogTitle><DialogDescription>Changes save to the catalogue's categories.</DialogDescription>
    <form onSubmit={submit} className="admin-product-form">
      <div className="admin-photos-field">
        <span className="admin-photos-label">Category photo</span>
        <div className="admin-photos-grid">
          <div className="admin-photo"><img src={form.image || PLACEHOLDER_IMAGE} alt="Category preview" /></div>
          <label className="admin-photo admin-photo-add"><ImagePlus size={18} /><span>{form.image ? 'Replace' : 'Add photo'}</span><input type="file" accept="image/*" aria-label="Upload category photo" onChange={e => { const file = e.target.files?.[0]; if (file) choosePhoto(file); e.target.value = ''; }} /></label>
        </div>
        <span className="text-xs text-muted-foreground">JPG, PNG or WebP · shown on the category card</span>
      </div>
      <label>Category name<Input required value={form.name} onChange={e => field('name', e.target.value)} /></label>
      <label>Description<Textarea required rows={2} value={form.description} onChange={e => field('description', e.target.value)} /></label>
      <div className="admin-form-columns"><label>Specification label (e.g. Density)<Input required value={form.specification} onChange={e => field('specification', e.target.value)} /></label><label>Size label (e.g. Available thickness)<Input required value={form.size} onChange={e => field('size', e.target.value)} /></label></div>
      {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
      <div className="admin-form-actions"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}><Save /> {busy ? 'Saving…' : 'Save category'}</Button></div>
    </form>
  </DialogContent></Dialog>;
}
