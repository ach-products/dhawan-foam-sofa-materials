import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowDownToLine, ArrowUpRight, Check, Layers3, Minus, Plus, Send, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { buildBill, formatINR, primaryImage, type Product } from '@/lib/catalogue';
import { getDemoPhone } from '@/lib/mock-auth';
import { submitEnquiry } from '@/lib/enquiries.functions';
import { listPublicProducts } from '@/lib/products.functions';
import { AccountLink } from '@/components/account-link';
type Selection = { slug: string; quantity: number };
const CatalogueContext = createContext<{items: Selection[]; add: (slug: string, quantity?: number) => void; open: () => void; products: Product[]; loading: boolean}>({items:[], add:()=>{},open:()=>{},products:[],loading:true});
export const useCatalogue = () => useContext(CatalogueContext);
export function CatalogueShell({children}: {children: ReactNode}) {
 const [items,setItems] = useState<Selection[]>([]);
 const [products,setProducts] = useState<Product[]>([]);
 const [loading,setLoading] = useState(true);
 const [isOpen,setOpen] = useState(false);
 const [submitting,setSubmitting] = useState(false);
 const [submitted,setSubmitted] = useState(false);
 useEffect(() => { listPublicProducts().then(setProducts).finally(() => setLoading(false)); }, []);
 function add(slug:string,quantity=1) {setSubmitted(false);setItems(prev => {const existing=prev.find(i=>i.slug===slug);return existing ? prev.map(i=>i.slug===slug?{...i,quantity:i.quantity+quantity}:i):[...prev,{slug,quantity}];});}
 const bill=buildBill(products,items);
 function download() {const phone=getDemoPhone();const text='DHAWAN FOAM & SOFA MATERIALS — ESTIMATE\n'+`Date: ${new Date().toLocaleDateString('en-IN')}\nCustomer mobile: ${phone?'+91 '+phone:'Not logged in'}\n\n`+bill.lines.map((l,n)=>`${n+1}. ${l.name}\n   ${l.quantity} ${l.unit} x ${formatINR(l.rate)} = ${formatINR(l.total)}`).join('\n')+`\n\nGRAND TOTAL: ${formatINR(bill.grandTotal)}\n`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='dhawan-estimate.txt';a.click();URL.revokeObjectURL(url);}
 async function submit() {setSubmitting(true);try{await submitEnquiry({data:{phone:getDemoPhone(),items,grandTotal:bill.grandTotal}});setSubmitted(true);}finally{setSubmitting(false);}}
 return <CatalogueContext.Provider value={{items,add,open:()=>setOpen(true),products,loading}}>
 <header className="site-header page-width"><Link to="/" className="brand" aria-label="Dhawan Foam & Sofa Materials home"><Layers3 strokeWidth={1.5}/><span>dhawan<span className="brand-small">FOAM & SOFA MATERIALS</span></span></Link><nav><Link to="/" className="nav-active">Catalogue</Link><AccountLink/><Button variant="ghost" onClick={()=>setOpen(true)}>Bulk enquiries <ArrowUpRight/></Button></nav><Button variant="ghost" size="icon" className="bag-button" aria-label={`Enquiry list, ${items.length} products`} onClick={()=>setOpen(true)}><ShoppingBag strokeWidth={1.5}/>{items.length>0 && <span className="bag-count">{items.length}</span>}</Button></header>
 <main>{children}</main>
  <footer className="page-width"><div className="footer-bottom"><span>© {new Date().getFullYear()} Dhawan Foam & Sofa Materials.</span><Link to="/admin">Admin panel <ArrowUpRight size={11} className="inline"/></Link></div></footer>
 <Dialog open={isOpen} onOpenChange={setOpen}><DialogContent className="enquiry-dialog"><DialogTitle className="text-2xl">Your bulk enquiry</DialogTitle><DialogDescription>Selected products and estimated quantities. Final specifications and pricing are subject to confirmation.</DialogDescription>{items.length===0?<div className="empty-enquiry"><ShoppingBag size={36} strokeWidth={1}/><p>Your enquiry list is empty.</p><Button variant="outline" onClick={()=>setOpen(false)}>Explore the catalogue <ArrowUpRight/></Button></div>:<><div className="enquiry-items">{items.map(i=>{const p=products.find(pr=>pr.slug===i.slug);if(!p)return null;return <div key={i.slug} className="enquiry-item"><img src={primaryImage(p)} alt={p.name}/><div><strong>{p.name}</strong><small className="enquiry-options">{p.price} → <b>{formatINR(i.quantity*(Number(p.price.replace(/[^\d.\/]/g,'').split('/')[0])||0))}</b></small><div className="quantity-control"><Button variant="ghost" size="icon" aria-label={`Decrease ${p.name}`} disabled={i.quantity<=1} onClick={()=>setItems(prev=>prev.map(s=>s.slug===i.slug?{...s,quantity:s.quantity-1}:s))}><Minus/></Button><span>{i.quantity}</span><Button variant="ghost" size="icon" aria-label={`Increase ${p.name}`} onClick={()=>add(i.slug,1)}><Plus/></Button></div></div><Button variant="ghost" size="icon" aria-label={`Remove ${p.name}`} onClick={()=>setItems(prev=>prev.filter(s=>s.slug!==i.slug))}><Trash2/></Button></div>})}</div><div className="flex justify-between border-t pt-3 text-lg font-semibold"><span>Grand total</span><span>{formatINR(bill.grandTotal)}</span></div><div className="enquiry-actions"><Button onClick={submit} disabled={submitting||submitted}>{submitted?<><Check/> Enquiry sent</>:submitting?'Sending…':<><Send/> Submit enquiry</>}</Button><Button variant="outline" onClick={download}><ArrowDownToLine/> Download bill</Button></div><p className="text-xs text-muted-foreground">{submitted?'Your enquiry has been recorded. We will follow up on your bulk order.':'Submit to send this enquiry, or download a copy to share with your supplier.'}</p></>}</DialogContent></Dialog>
 </CatalogueContext.Provider>;
}
