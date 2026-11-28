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
export const categories = ['Foams', 'Sofa Legs', 'Fabrics', 'Staple Pins', 'Adhesives', 'Protectors', 'Fasteners', 'Niwar'] as const;
export type ProductCategory = typeof categories[number];
export const categorySpecs = {
 Foams: { specification: 'Density', size: 'Available thickness', description: 'Upholstery, support and comfort foam qualities' },
 'Sofa Legs': { specification: 'Material / finish', size: 'Available heights', description: 'Furniture legs and sofa supports' },
 Fabrics: { specification: 'Texture / finish', size: 'Width / supply', description: 'Upholstery fabrics for sofas and cushions' },
 'Staple Pins': { specification: 'Series / material', size: 'Leg length', description: 'Upholstery fastening pins and staple strips' },
 Adhesives: { specification: 'Base / tack type', size: 'Pack sizes', description: 'Fevicol-type, foam bonding and sofa repair adhesives in bulk cans, buckets and drums' },
 Protectors: { specification: 'Type', size: 'Dimensions', description: 'Mattress and sofa protectors' },
 Fasteners: { specification: 'Length / gauge', size: 'Pack type', description: 'Nails, screws and tingle fasteners for furniture assembly' },
 Niwar: { specification: 'Material', size: 'Width', description: 'Jute and elastic webbing for seat and back support' },
};
export type Product = { slug: string; name: string; category: ProductCategory; type: string; image: string; price: string; density: string; sizes: string; description: string; tag?: string };
export const products: Product[] = [
 {slug:'pu-foam-sheets',name:'PU Foam Sheets',category:'Foams',type:'Polyurethane foam',image:pu.url,price:'₹280 / sheet',density:'18–40 kg/m³',sizes:'25–150 mm',description:'Versatile, lightweight polyurethane sheets for upholstery, cushioning and everyday comfort.',tag:'BULK FAVOURITE'},
 {slug:'high-resilience-foam',name:'High Resilience Foam',category:'Foams',type:'HR foam',image:hr.url,price:'₹520 / sheet',density:'32–50 kg/m³',sizes:'25–150 mm',description:'Responsive, durable foam with excellent bounce-back for furniture and premium seating.'},
 {slug:'memory-foam',name:'Memory Foam',category:'Foams',type:'Viscoelastic foam',image:memory.url,price:'₹750 / sheet',density:'40–60 kg/m³',sizes:'25–100 mm',description:'Slow-recovery foam that contours to the body, ideal for comfort layers and mattress toppers.',tag:'POPULAR'},
 {slug:'acoustic-foam',name:'Acoustic Foam',category:'Foams',type:'Convoluted foam',image:acoustic.url,price:'₹340 / sheet',density:'23–32 kg/m³',sizes:'25–50 mm',description:'Profiled open-cell foam for sound absorption in studios, offices and commercial spaces.'},
 {slug:'rebonded-foam',name:'Rebonded Foam',category:'Foams',type:'High-density support',image:rebonded.url,price:'₹610 / sheet',density:'80–120 kg/m³',sizes:'25–100 mm',description:'Firm recycled foam for support layers, commercial seating and heavy-duty cushioning.'},
 {slug:'soft-upholstery-foam',name:'Soft Upholstery Foam',category:'Foams',type:'Flexible cushioning',image:pu.url,price:'₹260 / sheet',density:'18–28 kg/m³',sizes:'25–150 mm',description:'Soft cushioning for backrests, cushions and upholstered furniture.'},
 {slug:'firm-support-foam',name:'Firm Support Foam',category:'Foams',type:'Structural support',image:hr.url,price:'₹480 / sheet',density:'40–50 kg/m³',sizes:'50–150 mm',description:'Firm, resilient support for seating bases and mattress construction.'},
 {slug:'memory-foam-topper',name:'Memory Foam Topper',category:'Foams',type:'Comfort layer',image:memory.url,price:'₹690 / sheet',density:'40–50 kg/m³',sizes:'25–75 mm',description:'A flexible comfort layer for refreshing existing mattresses.'},
 {slug:'economy-23-density-foam',name:'23 Density Economy Foam',category:'Foams',type:'Economy PU foam',image:pu.url,price:'₹230 / sheet',density:'23 kg/m³',sizes:'25–100 mm',description:'An economical foam quality for lightly used cushioning, backrests and general upholstery projects.'},
 {slug:'premium-32-density-foam',name:'32 Density Seating Foam',category:'Foams',type:'Standard seating foam',image:hr.url,price:'₹420 / sheet',density:'32 kg/m³',sizes:'25–150 mm',description:'A balanced medium-firm foam quality for sofa seats, chair cushions and everyday furniture upholstery.',tag:'BULK FAVOURITE'},
 {slug:'premium-40-density-foam',name:'40 Density Premium Foam',category:'Foams',type:'Premium seating foam',image:hr.url,price:'₹560 / sheet',density:'40 kg/m³',sizes:'50–150 mm',description:'A higher-density foam quality for supportive sofa cushions and regularly used seating.',tag:'PREMIUM'},
 {slug:'chrome-sofa-legs',name:'Chrome Sofa Legs',category:'Sofa Legs',type:'Tapered metal legs',image:legs.url,price:'₹45 / piece',density:'Metal · polished chrome',sizes:'100 · 150 · 200 mm',description:'Polished tapered metal legs for upholstered sofas and chairs. Confirm mounting thread, height and finish before ordering.'},
 {slug:'upholstery-fabrics',name:'Sofa Upholstery Fabrics',category:'Fabrics',type:'Velvet & woven fabrics',image:fabric.url,price:'₹320 / metre',density:'Velvet · textured weave',sizes:'Approx. 140 cm wide · by metre / roll',description:'A sample range of velvet and woven upholstery fabrics for sofa covers, cushions and furniture projects. Confirm colour, composition and roll length with the supplier.',tag:'POPULAR'},
 {slug:'80-series-staple-pins',name:'80 Series Staple Pins',category:'Staple Pins',type:'Fine-wire upholstery staples',image:pins.url,price:'₹110 / box',density:'80 series · galvanised steel',sizes:'6 · 8 · 10 · 12 · 14 · 16 mm',description:'Fine-wire staple strips for fixing upholstery fabric to furniture frames. Match the staple series and leg length to your stapler before ordering.'},
 {slug:'71-series-staple-pins',name:'71 Series Staple Pins',category:'Staple Pins',type:'Fine-wire upholstery staples',image:pins.url,price:'₹95 / box',density:'71 series · galvanised steel',sizes:'6 · 8 · 10 · 12 · 14 mm',description:'Upholstery staple pins for fabric and lining work on sofa and chair frames. Confirm tool compatibility and pack quantity with the supplier.'},
 {slug:'foam-contact-adhesive',name:'Foam Contact Adhesive',category:'Adhesives',type:'Solvent-based contact glue',image:glue.url,price:'₹240 / litre',density:'Solvent-based · fast tack',sizes:'1 L · 4 L · 20 L tins',description:'A strong, fast-tacking contact glue for bonding foam to foam, foam to wood and foam to furniture frames. Apply to both surfaces, allow to flash off, then press together.',tag:'BULK FAVOURITE'},
 {slug:'fevicol-type-adhesive',name:'Fevicol-Type Synthetic Adhesive',category:'Adhesives',type:'Synthetic resin adhesive',image:bucket.url,price:'₹210 / litre',density:'Synthetic resin · thick paste',sizes:'1 L · 5 L · 20 L buckets',description:'A Fevicol-type synthetic resin adhesive for wood, plywood, laminate and furniture frame joints. Spread evenly, clamp and allow to set.',tag:'BULK FAVOURITE'},
 {slug:'bulk-adhesive-drum-pack',name:'Bulk Adhesive Drum Pack',category:'Adhesives',type:'Industrial bulk pack',image:drums.url,price:'₹3,800 / drum',density:'Contact adhesive · bulk grade',sizes:'20 L · 50 L drums · 200 L barrels',description:'Bulk drums and barrels of foam adhesive for workshops and upholstery units that glue all day. Packed in sealed metal drums and plastic buckets.'},
 {slug:'sofa-repair-adhesive',name:'Sofa Repair Adhesive',category:'Adhesives',type:'Furniture repair glue',image:glue.url,price:'₹190 / can',density:'Neoprene · high grip',sizes:'500 ml · 1 L · 5 L cans',description:'A high-grip repair glue for re-sticking loose foam patches, seat cushions, webbing, jute and edging fabrics on sofa frames and seat decks.'},
 {slug:'spray-adhesive',name:'Spray Adhesive',category:'Adhesives',type:'Aerosol spray glue',image:spray.url,price:'₹260 / can',density:'Aerosol · even mist',sizes:'400 ml · 750 ml cans',description:'A fine-mist spray glue for laying fabric, felt and thin foam liners without wrinkles or soak-through. Shake well and spray in light, even coats.'},
 {slug:'water-based-foam-glue',name:'Water-Based Foam Glue',category:'Adhesives',type:'Water-based adhesive',image:bucket.url,price:'₹180 / litre',density:'Water-based · low odour',sizes:'1 L · 5 L · 20 L cans',description:'A low-odour, solvent-free glue for foam lamination and light upholstery work where ventilation is limited. Needs longer open time and pressing.'},
];
export function filterProducts(list: Product[], category: string, query: string, type = 'All types') {
 return list.filter(p => (category === 'All products' || p.category === category) && (type === 'All types' || p.type === type) && `${p.name} ${p.type}`.toLowerCase().includes(query.toLowerCase()));
}
const densityGrades = [18, 23, 28, 32, 40, 50, 60, 80, 100, 120];
const thicknessGrades = [25, 50, 75, 100, 125, 150];
function rangeOf(text: string): [number, number] | null { const n = text.match(/\d+/g)?.map(Number); if (!n?.length) return null; return [n[0]!, n[n.length - 1]!]; }
export function foamOptions(p: Product) {
 if (p.category !== 'Foams') return null;
 const d = rangeOf(p.density), s = rangeOf(p.sizes);
 return {
  densities: d ? densityGrades.filter(v => v >= d[0] && v <= d[1]).map(v => `${v} kg/m³`) : [],
  thicknesses: s ? thicknessGrades.filter(v => v >= s[0] && v <= s[1]).map(v => `${v} mm`) : [],
  sheetSizes: ['72 × 36 in', '72 × 48 in', '78 × 60 in', '78 × 72 in', 'Custom cut'],
 };
}
export function foamRate(p: Product, options?: string) {
 const base = priceInfo(p.price).amount; const fo = foamOptions(p); if (!fo || !options) return base;
 const [d, t, sz] = options.split(' · '); const num = (v?: string) => Number(v?.match(/[\d.]+/)?.[0]) || 0;
 const area = (v?: string) => { const m = v?.match(/(\d+) × (\d+)/); return m ? Number(m[1]) * Number(m[2]) : 0; };
 const bd = num(fo.densities[0]), bt = num(fo.thicknesses[0]), ba = area(fo.sheetSizes[0]);
 const k = (bd && num(d) ? num(d) / bd : 1) * (bt && num(t) ? num(t) / bt : 1) * (ba && area(sz) ? area(sz) / ba : 1);
 return Math.round(base * k);
}
export function priceInfo(price: string) { const amount = Number(price.replace(/[^\d.\/]/g, '').split('/')[0]) || 0; const unit = price.split('/')[1]?.trim() ?? 'unit'; return { amount, unit }; }
export const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');
export type BillLine = { name: string; options?: string; quantity: number; rate: number; unit: string; total: number };
export function buildBill(list: Product[], items: { slug: string; quantity: number; options?: string }[]) {
 const lines: BillLine[] = items.flatMap(i => { const p = list.find(x => x.slug === i.slug); if (!p) return []; const { unit } = priceInfo(p.price); const amount = foamRate(p, i.options); return [{ name: p.name, ...(i.options ? { options: i.options } : {}), quantity: i.quantity, rate: amount, unit, total: amount * i.quantity }]; });
 return { lines, grandTotal: lines.reduce((s, l) => s + l.total, 0) };
}
