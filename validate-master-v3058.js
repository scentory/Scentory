#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const products = JSON.parse(fs.readFileSync(path.join(root, 'perfumes.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const main = fs.readFileSync(path.join(root, 'script-scentory-v3048.js'), 'utf8');
const intelligence = fs.readFileSync(path.join(root, 'scentory-intelligence-v3048.js'), 'utf8');
const get = id => products.find(product => product.id === id);

assert(products.length === 111, `Expected 111 products; found ${products.length}`);
assert(new Set(products.map(product => product.id)).size === 111, 'Duplicate product IDs detected');
assert(products.filter(product => product.status === 'available').length === 103, 'Expected 103 available products');
assert(products.filter(product => product.status === 'out').length === 8, 'Expected 8 out-of-stock products');
assert(products.filter(product => product.status === 'upcoming').length === 0, 'Expected no upcoming products');
assert(products.reduce((count, product) => count + Object.keys(product.sizes || {}).length, 0) === 444, 'Expected 444 size records');
assert(products.reduce((count, product) => count + Object.values(product.sizes || {}).filter(item => item.available).length, 0) === 371, 'Expected 371 orderable sizes');
assert(products.every(product => !Object.hasOwn(product.sizes || {}, '30ml')), '30 ML found in storefront data');

const priceSignature = products.map(product => `${product.id}|${product.status}|${Object.entries(product.sizes).map(([size, item]) => `${size}:${item.price}:${Number(item.available)}:${Number(item.premium)}`).join(',')}`).join('\n');
assert(crypto.createHash('sha256').update(priceSignature).digest('hex') === 'e46a073b582b90f1aae9c8cb8cd86aa30798c19c665c24adab5d77810383af4a', 'v3058 price/order/stock signature changed');

const expectedOut = new Set([
  'hawas-rouge-edp',
  'hawas-elixir-edp',
  'shuhrah-elixir-edp',
  'vanguard-by-maison-asrar',
  'brandy-ambre-leather-edp',
  'bois-blanc-by-arabiyat-prestige',
  'club-de-nuit-precieux-extrait-de-parfum',
  'titan-by-khadlaj-edp'
]);
assert(products.filter(product => product.status === 'out').every(product => expectedOut.has(product.id)), 'Unexpected out-of-stock product');
assert([...expectedOut].every(id => get(id)?.status === 'out'), 'An expected out-of-stock product is not out');

for (const product of products) {
  assert(fs.existsSync(path.join(root, product.image)), `Missing image: ${product.image}`);
  assert(fs.existsSync(path.join(root, 'perfume', `${product.id}.html`)), `Missing SEO page: ${product.id}`);
  const orderable = Object.values(product.sizes || {}).filter(item => item.available && Number.isFinite(Number(item.price)));
  assert(product.status === 'available' ? orderable.length > 0 : orderable.length === 0, `Status/size availability mismatch: ${product.id}`);
  if (product.sizes?.['6ml']) assert(product.sizes['6ml'].premium === true, `6 ML is not Premium: ${product.id}`);
  for (const [size, item] of Object.entries(product.sizes || {})) {
    assert(product.prices?.[size.replace('ml', ' ML')] === item.price, `Legacy price mirror mismatch: ${product.id} ${size}`);
  }
}

for (const [id, name] of [
  ['mykonos-inception-edp', 'Mykonos Inception (EDP)'],
  ['mykonos-dreamscape-edp', 'Mykonos Dreamscape EDP']
]) {
  const product = get(id);
  assert(product?.name === name, `Missing or renamed Mykonos product: ${id}`);
  assert(product?.status === 'available', `${id} must be available`);
  assert(product?.image === 'product-image-coming-soon.svg', `${id} must use the approved placeholder`);
  assert(product?.profile?.topPickEligible === false, `${id} must not be a first-choice recommendation before profile review`);
  for (const [size, expected] of Object.entries({ '5ml': [320, true], '6ml': [399, true], '10ml': [590, true], '15ml': [840, false] })) {
    assert(product?.sizes?.[size]?.price === expected[0] && product?.sizes?.[size]?.available === expected[1], `${id} ${size} is incorrect`);
  }
}
assert(products[0]?.id === 'mykonos-inception-edp' && products[1]?.id === 'mykonos-dreamscape-edp', 'Mykonos catalogue insertion order is incorrect');

const exactSizes = [
  ['yusuf-bhai-wulong-cha', '10ml', 740, true],
  ['afnan-turathi-blue-edp', '10ml', 600, false],
  ['burberry-touch-edt', '15ml', 750, true],
  ['blue-by-ahmed-edp', '15ml', 540, true],
  ['brandy-salvage-edp', '15ml', 430, false]
];
for (const [id, size, price, available] of exactSizes) {
  assert(get(id)?.sizes?.[size]?.price === price && get(id)?.sizes?.[size]?.available === available, `${id} ${size} is incorrect`);
}

const theOne = get('dolce-gabbana-the-one-edp');
assert(theOne?.status === 'available', 'D&G The One must be available');
for (const [size, expected] of Object.entries({ '5ml': [440, true], '6ml': [530, true], '10ml': [830, true], '15ml': [1180, false] })) {
  assert(theOne?.sizes?.[size]?.price === expected[0] && theOne?.sizes?.[size]?.available === expected[1], `D&G The One ${size} is incorrect`);
}
assert(!theOne?.recommendation?.includes('Coming soon'), 'D&G The One still has upcoming copy');

const stronger = get('stronger-with-you-intensely-edp');
assert(stronger?.status === 'available', 'Stronger With You Intensely must be available');
for (const [size, expected] of Object.entries({ '5ml': [670, true], '6ml': [799, true], '10ml': [1280, true], '15ml': [1850, false] })) {
  assert(stronger?.sizes?.[size]?.price === expected[0] && stronger?.sizes?.[size]?.available === expected[1], `Stronger With You Intensely ${size} is incorrect`);
}

const eros = get('versace-eros-edt');
assert(eros?.status === 'available', 'Versace Eros EDT must be available');
for (const [size, price] of Object.entries({ '5ml': 399, '6ml': 490, '10ml': 760, '15ml': 1070 })) {
  assert(eros?.sizes?.[size]?.price === price && eros?.sizes?.[size]?.available === true, `Versace Eros EDT ${size} is incorrect`);
}

const kuro = get('ajmal-kuro-edp');
assert(kuro?.status === 'available', 'Ajmal Kuro must be available');
for (const [size, price] of Object.entries({ '5ml': 280, '6ml': 340, '10ml': 499, '15ml': 690 })) {
  assert(kuro?.sizes?.[size]?.price === price && kuro?.sizes?.[size]?.available === true, `Ajmal Kuro ${size} is incorrect`);
}
assert(!kuro?.recommendation?.includes('Coming soon'), 'Ajmal Kuro still has upcoming copy');

assert(main.includes("const DATA_VERSION = '3058'"), 'Catalogue cache version is not 3058');
for (const asset of ['style-scentory-v3048.css?v=3058', 'script-scentory-v3048.js?v=3058', 'scentory-intelligence-v3048.js?v=3058']) {
  assert(html.includes(asset), `Cache version missing: ${asset}`);
}
assert(html.includes('111 Perfumes'), 'Exact storefront count is not 111');
assert(html.includes('120+ PERFUME CHOICES'), '120+ expanding-selection message changed');

assert(!html.toLowerCase().includes('humidity'), 'Humidity remains in the main interface');
assert(!intelligence.toLowerCase().includes('humidity'), 'Humidity remains in the weather tool');
for (const required of ['runManualWeatherMatch(event)', 'manualTemperature', 'manualCondition', 'weatherArea', 'Show Weather Matches']) {
  assert(intelligence.includes(required), `Manual weather feature missing: ${required}`);
}
const districtStart = intelligence.indexOf('const BANGLADESH_DISTRICTS');
const districtEnd = intelligence.indexOf(']);', districtStart);
const districtBlock = intelligence.slice(districtStart, districtEnd);
assert((districtBlock.match(/\{\s*name:\s*['"]/g) || []).length === 64, 'Bangladesh district data must contain exactly 64 districts');

const pageCount = fs.readdirSync(path.join(root, 'perfume')).filter(name => name.endsWith('.html')).length;
assert(pageCount === 111, `Expected 111 SEO product pages; found ${pageCount}`);
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
assert((sitemap.match(/<url>/g) || []).length === 112, 'Sitemap must contain 112 URLs');
assert((sitemap.match(/<lastmod>2026-09-03<\/lastmod>/g) || []).length === 111, 'Sitemap lastmod values are not current');

if (failures.length) {
  console.error(`v3058 validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('v3058 validation passed: 111 products, supplied prices and stock, two Mykonos additions, launches, manual weather, recommendation safeguards, SEO and storefront features verified.');
