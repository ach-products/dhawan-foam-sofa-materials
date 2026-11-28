import pu from '@/assets/pu-foam.asset.json';
import hr from '@/assets/hr-foam.asset.json';
import memory from '@/assets/memory-foam.asset.json';
import acoustic from '@/assets/acoustic-foam.asset.json';
import legs from '@/assets/sofa-legs.asset.json';
import fabric from '@/assets/upholstery-fabrics.asset.json';
import pins from '@/assets/staple-pins.asset.json';
import rebonded from '@/assets/rebonded-foam.asset.json';
import glue from '@/assets/foam-glue.asset.json';
import spray from '@/assets/spray-glue.asset.json';
import drums from '@/assets/adhesive-drums.asset.json';
import bucket from '@/assets/adhesive-bucket.asset.json';
// Categories are admin-managed data now (src/lib/categories.functions.ts, backed by the
// `categories` table) — this is seed data only, used by scripts/migrate-categories.mjs and
// the unit tests, not the live source of category names/labels.
export type ProductCategory = string;
export type Product = { slug: string; name: string; category: ProductCategory; type: string; images: string[]; price: string; density: string; sizes: string; description: string; tag?: string };
export const products: Product[] = [
 {slug:'pu-foam-sheets',name:'PU Foam Sheets',category:'Foams',type:'Polyurethane foam',images:[pu.url],price:'₹280 / sheet',density:'18–40 kg/m³',sizes:'25–150 mm',description:'Versatile, lightweight polyurethane sheets for upholstery, cushioning and everyday comfort.',tag:'BULK FAVOURITE'},
 {slug:'high-resilience-foam',name:'High Resilience Foam',category:'Foams',type:'HR foam',images:[hr.url],price:'₹520 / sheet',density:'32–50 kg/m³',sizes:'25–150 mm',description:'Responsive, durable foam with excellent bounce-back for furniture and premium seating.'},
 {slug:'memory-foam',name:'Memory Foam',category:'Foams',type:'Viscoelastic foam',images:[memory.url],price:'₹750 / sheet',density:'40–60 kg/m³',sizes:'25–100 mm',description:'Slow-recovery foam that contours to the body, ideal for comfort layers and mattress toppers.',tag:'POPULAR'},
 {slug:'acoustic-foam',name:'Acoustic Foam',category:'Foams',type:'Convoluted foam',images:[acoustic.url],price:'₹340 / sheet',density:'23–32 kg/m³',sizes:'25–50 mm',description:'Profiled open-cell foam for sound absorption in studios, offices and commercial spaces.'},
 {slug:'rebonded-foam',name:'Rebonded Foam',category:'Foams',type:'High-density support',images:[rebonded.url],price:'₹610 / sheet',density:'80–120 kg/m³',sizes:'25–100 mm',description:'Firm recycled foam for support layers, commercial seating and heavy-duty cushioning.'},
 {slug:'soft-upholstery-foam',name:'Soft Upholstery Foam',category:'Foams',type:'Flexible cushioning',images:[pu.url],price:'₹260 / sheet',density:'18–28 kg/m³',sizes:'25–150 mm',description:'Soft cushioning for backrests, cushions and upholstered furniture.'},
 {slug:'firm-support-foam',name:'Firm Support Foam',category:'Foams',type:'Structural support',images:[hr.url],price:'₹480 / sheet',density:'40–50 kg/m³',sizes:'50–150 mm',description:'Firm, resilient support for seating bases and mattress construction.'},
 {slug:'memory-foam-topper',name:'Memory Foam Topper',category:'Foams',type:'Comfort layer',images:[memory.url],price:'₹690 / sheet',density:'40–50 kg/m³',sizes:'25–75 mm',description:'A flexible comfort layer for refreshing existing mattresses.'},
 {slug:'economy-23-density-foam',name:'23 Density Economy Foam',category:'Foams',type:'Economy PU foam',images:[pu.url],price:'₹230 / sheet',density:'23 kg/m³',sizes:'25–100 mm',description:'An economical foam quality for lightly used cushioning, backrests and general upholstery projects.'},
 {slug:'premium-32-density-foam',name:'32 Density Seating Foam',category:'Foams',type:'Standard seating foam',images:[hr.url],price:'₹420 / sheet',density:'32 kg/m³',sizes:'25–150 mm',description:'A balanced medium-firm foam quality for sofa seats, chair cushions and everyday furniture upholstery.',tag:'BULK FAVOURITE'},
 {slug:'premium-40-density-foam',name:'40 Density Premium Foam',category:'Foams',type:'Premium seating foam',images:[hr.url],price:'₹560 / sheet',density:'40 kg/m³',sizes:'50–150 mm',description:'A higher-density foam quality for supportive sofa cushions and regularly used seating.',tag:'PREMIUM'},
 {slug:'chrome-sofa-legs',name:'Chrome Sofa Legs',category:'Sofa Legs',type:'Tapered metal legs',images:[legs.url],price:'₹45 / piece',density:'Metal · polished chrome',sizes:'100 · 150 · 200 mm',description:'Polished tapered metal legs for upholstered sofas and chairs. Confirm mounting thread, height and finish before ordering.'},
 {slug:'upholstery-fabrics',name:'Sofa Upholstery Fabrics',category:'Fabrics',type:'Velvet & woven fabrics',images:[fabric.url],price:'₹320 / metre',density:'Velvet · textured weave',sizes:'Approx. 140 cm wide · by metre / roll',description:'A sample range of velvet and woven upholstery fabrics for sofa covers, cushions and furniture projects. Confirm colour, composition and roll length with the supplier.',tag:'POPULAR'},
 {slug:'80-series-staple-pins',name:'80 Series Staple Pins',category:'Staple Pins',type:'Fine-wire upholstery staples',images:[pins.url],price:'₹110 / box',density:'80 series · galvanised steel',sizes:'6 · 8 · 10 · 12 · 14 · 16 mm',description:'Fine-wire staple strips for fixing upholstery fabric to furniture frames. Match the staple series and leg length to your stapler before ordering.'},
 {slug:'71-series-staple-pins',name:'71 Series Staple Pins',category:'Staple Pins',type:'Fine-wire upholstery staples',images:[pins.url],price:'₹95 / box',density:'71 series · galvanised steel',sizes:'6 · 8 · 10 · 12 · 14 mm',description:'Upholstery staple pins for fabric and lining work on sofa and chair frames. Confirm tool compatibility and pack quantity with the supplier.'},
 {slug:'foam-contact-adhesive',name:'Foam Contact Adhesive',category:'Adhesives',type:'Solvent-based contact glue',images:[glue.url],price:'₹240 / litre',density:'Solvent-based · fast tack',sizes:'1 L · 4 L · 20 L tins',description:'A strong, fast-tacking contact glue for bonding foam to foam, foam to wood and foam to furniture frames. Apply to both surfaces, allow to flash off, then press together.',tag:'BULK FAVOURITE'},
 {slug:'fevicol-type-adhesive',name:'Fevicol-Type Synthetic Adhesive',category:'Adhesives',type:'Synthetic resin adhesive',images:[bucket.url],price:'₹210 / litre',density:'Synthetic resin · thick paste',sizes:'1 L · 5 L · 20 L buckets',description:'A Fevicol-type synthetic resin adhesive for wood, plywood, laminate and furniture frame joints. Spread evenly, clamp and allow to set.',tag:'BULK FAVOURITE'},
 {slug:'bulk-adhesive-drum-pack',name:'Bulk Adhesive Drum Pack',category:'Adhesives',type:'Industrial bulk pack',images:[drums.url],price:'₹3,800 / drum',density:'Contact adhesive · bulk grade',sizes:'20 L · 50 L drums · 200 L barrels',description:'Bulk drums and barrels of foam adhesive for workshops and upholstery units that glue all day. Packed in sealed metal drums and plastic buckets.'},
 {slug:'sofa-repair-adhesive',name:'Sofa Repair Adhesive',category:'Adhesives',type:'Furniture repair glue',images:[glue.url],price:'₹190 / can',density:'Neoprene · high grip',sizes:'500 ml · 1 L · 5 L cans',description:'A high-grip repair glue for re-sticking loose foam patches, seat cushions, webbing, jute and edging fabrics on sofa frames and seat decks.'},
 {slug:'spray-adhesive',name:'Spray Adhesive',category:'Adhesives',type:'Aerosol spray glue',images:[spray.url],price:'₹260 / can',density:'Aerosol · even mist',sizes:'400 ml · 750 ml cans',description:'A fine-mist spray glue for laying fabric, felt and thin foam liners without wrinkles or soak-through. Shake well and spray in light, even coats.'},
 {slug:'water-based-foam-glue',name:'Water-Based Foam Glue',category:'Adhesives',type:'Water-based adhesive',images:[bucket.url],price:'₹180 / litre',density:'Water-based · low odour',sizes:'1 L · 5 L · 20 L cans',description:'A low-odour, solvent-free glue for foam lamination and light upholstery work where ventilation is limited. Needs longer open time and pressing.'},
];
export const PLACEHOLDER_IMAGE = '/placeholder-product.svg';
export function primaryImage(p: { images: string[] }) { return p.images[0] ?? PLACEHOLDER_IMAGE; }
export function categorySlug(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
// Treats ×, x/X and * as the same separator, so "72×35×20mm" matches a search for "72*35*20mm"
// or "72x35x20mm" just as well.
export function normalizeForSearch(s: string) { return s.toLowerCase().replace(/[×x*]/g, 'x'); }
export function filterProducts(list: Product[], category: string, query: string, type = 'All types') {
 const needle = normalizeForSearch(query);
 return list.filter(p => (category === 'All products' || p.category === category) && (type === 'All types' || p.type === type) && normalizeForSearch(`${p.name} ${p.type} ${p.density} ${p.sizes}`).includes(needle));
}
export function priceInfo(price: string) { const amount = Number(price.replace(/[^\d.\/]/g, '').split('/')[0]) || 0; const unit = price.split('/')[1]?.trim() ?? 'unit'; return { amount, unit }; }
export const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');
export type BillLine = { name: string; quantity: number; rate: number; unit: string; total: number };
export function buildBill(list: Product[], items: { slug: string; quantity: number }[]) {
 const lines: BillLine[] = items.flatMap(i => { const p = list.find(x => x.slug === i.slug); if (!p) return []; const { amount, unit } = priceInfo(p.price); return [{ name: p.name, quantity: i.quantity, rate: amount, unit, total: amount * i.quantity }]; });
 return { lines, grandTotal: lines.reduce((s, l) => s + l.total, 0) };
}
