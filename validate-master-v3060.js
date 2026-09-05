#!/usr/bin/env node
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm'), crypto=require('crypto'), assert=require('assert/strict');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const main=read('script-scentory-v3048.js'), html=read('index.html');
const data=read('perfumes.json'), products=JSON.parse(data);
assert.equal(crypto.createHash('sha256').update(data).digest('hex'),'ab04bb9ff09bc3df5a20cae059217cb432d525ce0a39da03ff86e852153e1a86','Catalogue must remain identical to v3059');
assert.ok(html.includes('120+ Perfumes'));
assert.ok(read('llms.txt').includes('Catalogue: 120+ perfume choices.'));
assert.ok(!html.includes('exact number'));
assert.ok(!main.includes('numberOfItems:'));
assert.ok(!main.includes('`${perfumes.length} Perfumes`'));
for(const name of ['title','og:title','og:description','twitter:title','twitter:description']) {
  const text=name==='title' ? html.match(/<title>(.*?)<\/title>/)[1] : html.match(new RegExp(`(?:name|property)="${name}" content="([^"]+)"`))[1];
  assert.ok(text.includes('120+'),name);
}
const messages=['380+ Orderable Options','Trusted by 2500+ Customers','9000+ Decants Sold','120+ Perfumes'];
const banner=html.match(/<div class="trust-marquee__track">([^]*?)<\/div>/)[1];
const spans=[...banner.matchAll(/<span[^>]*>([^<]+)<\/span>/g)].map(m=>m[1]);
assert.deepEqual(spans,Array(4).fill(messages).flat());
assert.ok(!html.includes('1900+') && !html.includes('7000+'));
for(const file of ['style-scentory-v3048.css','script-scentory-v3048.js','scentory-intelligence-v3048.js']) assert.ok(html.includes(file+'?v=3060'));
assert.ok(main.includes("const DATA_VERSION = '3060'"));
const hot=['mykonos-inception-edp','mykonos-dreamscape-edp','khadlaj-island-sun-edp','club-de-nuit-intense-overdose'];
const best=['versace-eros-edt','afnan-supremacy-collector-s-edition-edp','khadlaj-karus-gold-absolu-edp','hawas-ice-edp'];
const noOp=()=>{};
const grid=()=>({innerHTML:'',querySelectorAll:()=>[]});
const ctx={
  perfumes:products,perfumeCount:{textContent:''},searchInput:{value:'',dataset:{}},stockFilter:{value:'all'},tagFilter:{value:'all'},
  productGrid:grid(),hotArrivalsGrid:grid(),bestSellingGrid:grid(),
  productHasAvailableSize:p=>p.status==='available'&&Object.values(p.sizes).some(s=>s.available),isUpcoming:p=>p.status==='upcoming',
  shortOrderName:s=>s,getScentProfile:p=>({tags:p.tags}),renderProductCardV3002:p=>p.id,updatePriceTileStates:noOp,
  escapeHtml:s=>s,imagePath:p=>p.image,displayMl:s=>s,taka:n=>String(n),
  location:{origin:'https://scentoryfragrance.com',pathname:'/',href:'https://scentoryfragrance.com/'},URL,
  document:{getElementById:()=>null,createElement:()=>({}),head:{appendChild:node=>{ctx.schema=JSON.parse(node.textContent);}}}
};
vm.createContext(ctx);
const extract=(name,next)=>main.slice(main.indexOf(`function ${name}(`),main.indexOf(`function ${next}(`));
const declarations=main.slice(main.indexOf('const BEST_SELLING_IDS'),main.indexOf('const productGrid'));
vm.runInContext(declarations+extract('renderProducts','openImageModal')+extract('renderHotArrivals','syncTopbarHeight')+main.slice(main.indexOf('function injectCatalogueStructuredData('),main.indexOf('async function loadPerfumes(')),ctx);
for(const term of ['', 'mykonos', 'no-such-perfume']) {
  ctx.searchInput.value=term;ctx.renderProducts();assert.equal(ctx.perfumeCount.textContent,'120+ Perfumes');
}
ctx.renderHotArrivals();ctx.renderBestSelling();
for(const [actual,expected] of [[ctx.hotArrivalsGrid.innerHTML,hot],[ctx.bestSellingGrid.innerHTML,best]]) {
  assert.deepEqual([...actual.matchAll(/data-target-id="([^"]+)"/g)].map(m=>m[1]),expected);
  for(const id of expected) assert.ok(fs.existsSync(path.join(root,products.find(p=>p.id===id).image)));
}
ctx.injectCatalogueStructuredData();
assert.ok(!Object.hasOwn(ctx.schema,'numberOfItems'));
assert.ok(ctx.schema.name.includes('120+'));
assert.ok(ctx.schema.itemListElement.length>0);
for(const p of products) {
  const page=read(`perfume/${p.id}.html`);
  assert.ok(page.includes(p.image));
}
console.log('v3060 passed: public 120+ labels, SEO, banner, featured order, search states and unchanged catalogue.');
