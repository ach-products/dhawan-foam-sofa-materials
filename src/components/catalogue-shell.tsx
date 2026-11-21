import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowDownToLine, ArrowUpRight, Layers3, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { products, buildBill, formatINR } from '@/lib/catalogue';
import { getDemoPhone } from '@/lib/mock-auth';
import { AccountLink } from '@/components/account-link';
type Selection = { slug: string; quantity: number; options?: string };
const CatalogueContext = createContext<{items: Selection[]; add: (slug: string, quantity?: number, options?: string) => void; open: () => void}>({items:[], add:()=>{},open:()=>{}});
export const useCatalogue = () => useContext(CatalogueContext);
export function CatalogueShell({children}: {children: ReactNode}) {
 const [items,setItems] = useState<Selection[]>([]);
 const [isOpen,setOpen] = useState(false);
 const same=(i:Selection,slug:string,options?:string)=>i.slug===slug&&(i.options??'')===(options??'');
 function add(slug:string,quantity=1,options?:string) {setItems(prev => {const existing=prev.find(i=>same(i,slug,options));return existing ? prev.map(i=>same(i,slug,options)?{...i,quantity:i.quantity+quantity}:i):[...prev,{slug,quantity,...(options?{options}:{})}];});}
 const bill=buildBill(items);
 function download() {const phone=getDemoPhone();const text='DHAWAN FOAM & SOFA MATERIALS — ESTIMATE\n'+`Date: ${new Date().toLocaleDateString('en-IN')}\nCustomer mobile: ${phone?'+91 '+phone:'Not logged in'}\n\n`+bill.lines.map((l,n)=>`${n+1}. ${l.name}${l.options?` (${l.options})`:''}\n   ${l.quantity} ${l.unit} x ${formatINR(l.rate)} = ${formatINR(l.total)}`).join('\n')+`\n\nGRAND TOTAL: ${formatINR(bill.grandTotal)}\n`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='dhawan-estimate.txt';a.click();URL.revokeObjectURL(url);}
 return <CatalogueContext.Provider value={{items,add,open:()=>setOpen(true)}}>
 <header className="site-header page-width"><Link to="/" className="brand" aria-label="Dhawan Foam & Sofa Materials home"><Layers3 strokeWidth={1.5}/><span>dhawan<span className="brand-small">FOAM & SOFA MATERIALS</span></span></Link><nav><Link to="/" className="nav-active">Catalogue</Link><AccountLink/><Button variant="ghost" onClick={()=>setOpen(true)}>Bulk enquiries <ArrowUpRight/></Button></nav><Button variant="ghost" size="icon" className="bag-button" aria-label={`Enquiry list, ${items.length} products`} onClick={()=>setOpen(true)}><ShoppingBag strokeWidth={1.5}/>{items.length>0 && <span className="bag-count">{items.length}</span>}</Button></header>
 <main>{children}</main>
  <footer className="page-width"><div className="footer-bottom"><span>© {new Date().getFullYear()} Dhawan Foam & Sofa Materials.</span><Link to="/admin">Admin panel <ArrowUpRight size={11} className="inline"/></Link></div></footer>
 <Dialog open={isOpen} onOpenChange={setOpen}><DialogContent className="enquiry-dialog"><DialogTitle className="text-2xl">Your bulk enquiry</DialogTitle><DialogDescription>Selected products and estimated quantities. Final specifications and pricing are subject to confirmation.</DialogDescription>{items.length===0?<div className="empty-enquiry"><ShoppingBag size={36} strokeWidth={1}/><p>Your enquiry list is empty.</p><Button variant="outline" onClick={()=>setOpen(false)}>Explore the catalogue <ArrowUpRight/></Button></div>:<><div className="enquiry-items">{items.map(i=>{const p=products.find(p=>p.slug===i.slug);if(!p)return null;return <div key={i.slug+(i.options??'')} className="enquiry-item"><img src={p.image} alt={p.name}/><div><strong>{p.name}</strong>{i.options&&<small className="enquiry-options">{i.options}</small>}<small className="enquiry-options">{p.price} → <b>{formatINR(i.quantity*(Number(p.price.replace(/[^\d.\/]/g,'').split('/')[0])||0))}</b></small><div className="quantity-control"><Button variant="ghost" size="icon" aria-label={`Decrease ${p.name}`} disabled={i.quantity<=1} onClick={()=>setItems(prev=>prev.map(s=>same(s,i.slug,i.options)?{...s,quantity:s.quantity-1}:s))}><Minus/></Button><span>{i.quantity}</span><Button variant="ghost" size="icon" aria-label={`Increase ${p.name}`} onClick={()=>add(i.slug,1,i.options)}><Plus/></Button></div></div><Button variant="ghost" size="icon" aria-label={`Remove ${p.name}`} onClick={()=>setItems(prev=>prev.filter(s=>!same(s,i.slug,i.options)))}><Trash2/></Button></div>})}</div><div className="flex justify-between border-t pt-3 text-lg font-semibold"><span>Grand total</span><span>{formatINR(bill.grandTotal)}</span></div><Button onClick={download}><ArrowDownToLine/> Download bill</Button><p className="text-xs text-muted-foreground">Download your list to share with your supplier. No enquiry has been sent.</p></>}</DialogContent></Dialog>
 </CatalogueContext.Provider>;
}
