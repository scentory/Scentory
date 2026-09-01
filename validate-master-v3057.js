#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const products = JSON.parse(fs.readFileSync(path.join(root, 'perfumes.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const main = fs.readFileSync(path.join(root, 'script-scentory-v3048.js'), 'utf8');
const intelligence = fs.readFileSync(path.join(root, 'scentory-intelligence-v3048.js'), 'utf8');
const get = id => products.find(product => product.id === id);

assert(products.length === 109, `Expected 109 products; found ${products.length}`);
assert(products.filter(product => product.status === 'available').length === 98, 'Expected 98 available products');
assert(products.filter(product => product.status === 'out').length === 9, 'Expected 9 out-of-stock products');
assert(products.filter(product => product.status === 'upcoming').length === 2, 'Expected 2 upcoming products');
assert(products.every(product => !Object.hasOwn(product.sizes || {}, '30ml')), '30 ML found in storefront data');

assert(main.includes("const DATA_VERSION = '3057'"), 'Catalogue cache version is not 3057');
for (const asset of ['style-scentory-v3048.css?v=3057', 'script-scentory-v3048.js?v=3057', 'scentory-intelligence-v3048.js?v=3057']) {
  assert(html.includes(asset), `Cache version missing: ${asset}`);
}
assert(html.includes('109 Perfumes'), 'Exact storefront count is not 109');

const fareed = get('riiffs-fareed-edp');
assert(fareed?.status === 'available', 'Riiffs Fareed is not restocked');
for (const [size, price] of Object.entries({ '5ml': 240, '6ml': 299, '10ml': 430, '15ml': 580 })) {
  assert(fareed?.sizes?.[size]?.price === price && fareed?.sizes?.[size]?.available === true, `Riiffs Fareed ${size} is incorrect`);
}
assert(fareed?.sizes?.['6ml']?.premium === true, 'Riiffs Fareed 6 ML is not Premium');

for (const [id, size] of [
  ['hawas-chrome', '15ml'],
  ['yusuf-bhai-wulong-cha', '10ml'],
  ['azzaro-the-most-wanted-edp-intense', '10ml'],
  ['rayhaan-cedrus-blanc-edp', '15ml']
]) {
  assert(get(id)?.sizes?.[size]?.available === false, `${id} ${size} must be out of stock`);
}

assert(get('supremacy-not-only-intense-edp')?.name === 'Afnan Supremacy Not Only Intense', 'Afnan SNOI name is incorrect');
const theOne = get('dolce-gabbana-the-one-edp');
assert(theOne?.status === 'upcoming', 'D&G The One must remain Upcoming');
assert(theOne?.sizes?.['6ml']?.premium === true, 'D&G The One 6 ML must be Premium');
assert(theOne?.sizes?.['15ml']?.available === false, 'D&G The One 15 ML must be unavailable');

const kuro = get('ajmal-kuro-edp');
assert(kuro?.status === 'upcoming', 'Ajmal Kuro must be Upcoming');
assert(kuro?.image === 'ajmal-kuro-edp-poster.jpg', 'Ajmal Kuro poster assignment is incorrect');
assert(fs.existsSync(path.join(root, 'ajmal-kuro-edp-poster.jpg')), 'Ajmal Kuro poster file is missing');
for (const [size, price] of Object.entries({ '5ml': 280, '6ml': 340, '10ml': 499, '15ml': 690 })) {
  assert(kuro?.sizes?.[size]?.price === price && kuro?.sizes?.[size]?.available === false, `Ajmal Kuro ${size} is incorrect`);
}
assert(kuro?.sizes?.['6ml']?.premium === true, 'Ajmal Kuro 6 ML is not Premium');
assert(kuro?.details?.comparison === 'Dior Sauvage EDT', 'Ajmal Kuro comparison is missing');

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
assert(pageCount === 109, `Expected 109 SEO product pages; found ${pageCount}`);
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
assert((sitemap.match(/<url>/g) || []).length === 110, 'Sitemap must contain 110 URLs');
assert(fs.existsSync(path.join(root, 'perfume', 'ajmal-kuro-edp.html')), 'Ajmal Kuro SEO page is missing');

if (failures.length) {
  console.error(`v3057 validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('v3057 validation passed: 109 products, final August prices and stock, Ajmal Kuro Upcoming poster, manual weather, SEO and storefront safeguards verified.');
