#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.join(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const products = JSON.parse(read('perfumes.json'));
const get = id => products.find(p => p.id === id);
const sourceRows = read('tools/supplied-prices-v3059.txt').split(/\r?\n/).filter(s => s && !s.startsWith('#'));
assert.equal(products.length,112);
assert.equal(new Set(products.map(p => p.id)).size,112);
assert.deepEqual(products.map(p => p.id),sourceRows.map(row => row.split('|')[0]));
assert.equal(products.filter(p => p.status === 'available').length,103);
assert.equal(products.filter(p => p.status === 'out').length,9);
assert.equal(products.filter(p => p.status === 'upcoming').length,0);
assert.equal(products.reduce((n,p) => n + Object.keys(p.sizes).length,0),448);
assert.equal(products.reduce((n,p) => n + Object.values(p.sizes).filter(s => s.available).length,0),371);
for (const row of sourceRows) {
  const [id, prices, flag] = row.split('|');
  const p = get(id);
  assert.equal(p.status,flag === 'OUT' ? 'out' : 'available',id);
  const sizes = flag?.startsWith('3ml') ? flag.split(',') : ['5ml','6ml','10ml','15ml','30ml'];
  const expected = {};
  prices.split(',').forEach((value,i) => {
    if(sizes[i] === '30ml') return;
    expected[sizes[i]] = {price:parseInt(value,10), available:flag !== 'OUT' && !value.includes('!'), premium:sizes[i] === '6ml'};
  });
  assert.deepEqual(p.sizes,expected,id);
  assert.deepEqual(p.prices,Object.fromEntries(Object.entries(expected).map(([size,item]) => [size.replace('ml',' ML'),item.price])),id);
  assert.ok(fs.existsSync(path.join(root,p.image)),`Missing image ${id}`);
  const page = read(`perfume/${id}.html`);
  const schema = JSON.parse(page.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1]);
  const productSchema = schema['@graph'].find(x => x['@type'] === 'Product');
  assert.equal(productSchema.sku,id);
  assert.ok(productSchema.image.endsWith('/'+p.image));
  assert.equal(productSchema.offers.length,Object.keys(expected).length);
  Object.values(expected).forEach((size,i) => {
    assert.equal(productSchema.offers[i].price,size.price,`${id} SEO price`);
    assert.equal(productSchema.offers[i].availability,'https://schema.org/'+(size.available ? 'InStock' : 'OutOfStock'),`${id} SEO stock`);
  });
  if(p.image.endsWith('-poster-v3059.jpg')) {
    assert.equal(p.details.verification,'scentory-supplied');
    assert.equal(p.profile.topPickEligible,false);
    assert.ok(p.details.notes.listed.length > 0);
    assert.ok(page.includes('aspect-ratio:auto;object-fit:contain'));
    assert.ok(page.includes('<dt>Notes</dt>'));
  }
}
const main = read('script-scentory-v3048.js');
const html = read('index.html');
assert.ok(main.includes("const DATA_VERSION = '3059'"));
for(const file of ['style-scentory-v3048.css','script-scentory-v3048.js','scentory-intelligence-v3048.js']) assert.ok(html.includes(file+'?v=3059'));
assert.ok(html.includes('112 Perfumes'));
assert.ok(html.includes('120+ PERFUME CHOICES'));
assert.ok(html.includes('value="80"') && html.includes('value="130"'));
assert.equal(fs.readdirSync(path.join(root,'perfume')).filter(f => f.endsWith('.html')).length,112);
const sitemap = read('sitemap.xml');
assert.equal((sitemap.match(/<url>/g)||[]).length,113);
assert.equal((sitemap.match(/<lastmod>2026-09-05<\/lastmod>/g)||[]).length,112);
for (const p of products) assert.ok(sitemap.includes(`/perfume/${p.id}.html`));
const intelligence = read('scentory-intelligence-v3048.js');
for(const feature of ['runManualWeatherMatch(event)','manualTemperature','manualCondition','weatherArea','Show Weather Matches']) assert.ok(intelligence.includes(feature));
const districtBlock = intelligence.slice(intelligence.indexOf('const BANGLADESH_DISTRICTS')).split(']);')[0];
assert.equal((districtBlock.match(/\{\s*name:\s*['"]/g)||[]).length,64);
assert.ok(!intelligence.toLowerCase().includes('humidity'));

// Exercise the actual stock gates and saved-cart migration with the new data.
const extract = (name,next) => main.slice(main.indexOf(`function ${name}(`), main.indexOf(`function ${next}(`));
const noOp=()=>{};
const context={perfumes:products,cart:[],imagePath:p=>p.image,saveCart:noOp,showToast:noOp,renderCart:noOp,updatePriceTileStates:noOp};
vm.createContext(context);
vm.runInContext(extract('addToCart','removeFromCart')+extract('normalizeCartAfterLoad','renderProductCard'),context);
for (const size of ['5ml','6ml','10ml','15ml']) context.addToCart('blue-by-ahmed-edp',size);
assert.equal(context.cart.length,0,'Blue must not be orderable');
context.addToCart('mykonos-inception-edp','15ml');
context.addToCart('mykonos-dreamscape-edp','15ml');
assert.equal(context.cart.length,0,'Mykonos 15 ML must stay unavailable');
for (const size of ['5ml','6ml','10ml','15ml','30ml']) context.addToCart('khadlaj-island-sun-edp',size);
assert.equal(context.cart.length,4);
assert.equal(context.cart.find(s=>s.ml==='6ml').premium,true);
assert.equal(context.cart.reduce((sum,s)=>sum+s.price,0),1730);
context.cart.push({id:'blue-by-ahmed-edp',ml:'5ml',qty:1,price:220});
context.cart[1].price=1; context.cart[1].premium=false;
context.normalizeCartAfterLoad();
assert.equal(context.cart.length,4,'Saved Blue cart line must be removed');
assert.equal(context.cart.find(s=>s.ml==='6ml').price,320);
assert.equal(context.cart.find(s=>s.ml==='6ml').premium,true);
console.log('v3059 passed: full supplied list, 112 products, 103 available, 9 out, 371 orderable options, three posters, SEO, saved-cart stock and price revalidation, Premium 6 ML and manual weather.');
