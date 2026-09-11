#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.join(__dirname, '..');
const current = JSON.parse(fs.readFileSync(path.join(root, 'perfumes.json'), 'utf8'));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(current.length === 108, `Expected 108 products; found ${current.length}`);
assert(new Set(current.map(item => item.id)).size === current.length, 'Duplicate product IDs detected');
assert(current.filter(item => item.status === 'available').length === 97, 'Expected 97 available products');
assert(current.filter(item => item.status === 'out').length === 10, 'Expected 10 fully out-of-stock products');
assert(current.filter(item => item.status === 'upcoming').length === 1, 'Expected one coming-soon product');

const expectedOut = new Set([
  'hawas-rouge-edp','hawas-elixir-edp','riiffs-fareed-edp','vanguard-by-maison-asrar',
  'stronger-with-you-intensely-edp','versace-eros-edt','brandy-ambre-leather-edp',
  'bois-blanc-by-arabiyat-prestige','club-de-nuit-precieux-extrait-de-parfum','titan-by-khadlaj-edp'
]);
assert(current.filter(item => item.status === 'out').every(item => expectedOut.has(item.id)), 'Unexpected fully out-of-stock product');

const priceSignature = current.map(product => `${product.id}|${product.status}|${Object.entries(product.sizes).map(([size,item]) => `${size}:${item.price}:${Number(item.available)}:${Number(item.premium)}`).join(',')}`).join('\n');
assert(crypto.createHash('sha256').update(priceSignature).digest('hex') === '749c33308f0b9d0d0d114bf0f120c5794eb4e77305b22bff46b014ae9bd57e2a', 'August 2026 price/order/stock signature changed');

const allowed = {
  character: new Set(['fresh','aquatic','citrus','green','aromatic','fruity','sweet','gourmand','spicy','amber','woody','oud','leather','smoky','powdery','musky','elegant']),
  occasions: new Set(['daily','office','active','date','party','formal']),
  climates: new Set(['hot','monsoon','winter','ac','outdoor'])
};

for (const product of current) {
  assert(fs.existsSync(path.join(root, product.image)), `Missing image: ${product.image}`);
  assert(!Object.hasOwn(product.sizes || {}, '30ml'), `30 ML found: ${product.id}`);
  if (product.status === 'out') assert(Object.values(product.sizes || {}).every(item => !item.available), `Out product has an available size: ${product.id}`);
  for (const [size, item] of Object.entries(product.sizes || {})) {
    const legacy = product.prices?.[size.replace('ml', ' ML')];
    assert(legacy === item.price, `Price mismatch: ${product.id} ${size}`);
  }
  const profile = product.profile;
  assert(profile?.schemaVersion === 1, `Missing profile schema: ${product.id}`);
  for (const field of ['character','occasions','climates']) {
    assert(Array.isArray(profile?.[field]) && profile[field].length > 0, `Invalid ${field}: ${product.id}`);
    for (const value of profile?.[field] || []) assert(allowed[field].has(value), `Unknown ${field} value ${value}: ${product.id}`);
  }
  for (const field of ['strength','projection','longevity','sweetness','freshness','warmth','officeSafety','heatSafety','versatility']) {
    assert(Number.isInteger(profile?.[field]) && profile[field] >= 1 && profile[field] <= 5, `Invalid ${field}: ${product.id}`);
  }
  assert(fs.existsSync(path.join(root, 'perfume', `${product.id}.html`)), `Missing SEO page: ${product.id}`);
}

assert(current.some(product => product.id === 'hawas-rouge-edp' && product.image === 'product-image-coming-soon.svg'), 'Hawas Rouge placeholder missing');
const theOne = current.find(product => product.id === 'dolce-gabbana-the-one-edp');
assert(theOne?.status === 'upcoming' && theOne.image === 'product-image-coming-soon.svg', 'Dolce & Gabbana The One coming-soon record is invalid');
assert(Object.keys(theOne?.sizes || {}).join(',') === '5ml,6ml,10ml,15ml', 'Dolce & Gabbana The One size set is invalid');
assert(Object.values(theOne?.sizes || {}).every(item => !item.available), 'Coming-soon product has an available size');
assert(theOne?.sizes?.['6ml']?.premium === false, 'Dolce & Gabbana The One 6 ML must not be marked premium');
for (const [id, image] of Object.entries({
  'yusuf-bhai-bois-imperial': 'yusuf-bhai-bois-imperial.webp',
  'yusuf-bhai-men-212': 'yusuf-bhai-men-212.webp',
  'yusuf-bhai-allure-homme-sport': 'yusuf-bhai-allure-homme-sport.webp'
})) {
  assert(current.some(product => product.id === id && product.image === image), `Approved Yusuf Bhai image missing: ${id}`);
}
assert(Object.entries(current.find(product => product.id === 'rave-plato-lattafa')?.sizes || {}).find(([size]) => size === '6ml')?.[1]?.premium === true, 'Rave Plato 6 ML must use a premium atomizer');
for (const id of ['azzaro-the-most-wanted-edp-intense','ysl-y-edp']) {
  assert(Object.keys(current.find(product => product.id === id)?.sizes || {}).join(',') === '3ml,5ml,6ml,10ml', `Incorrect size set: ${id}`);
}
assert(current.reduce((count, product) => count + Object.values(product.sizes).filter(item => !item.available).length, 0) === 80, 'Unexpected size-level unavailable count');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const asset of [...html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(match => match[1])) {
  if (/^(?:https?:|mailto:|tel:)/.test(asset) || asset === '/') continue;
  assert(fs.existsSync(path.join(root, asset)), `Missing HTML asset: ${asset}`);
}
for (const file of ['script-scentory-v3048.js','scentory-intelligence-v3048.js','weather-config-v3048.js','weather-worker-openweather-v3048.js','style-scentory-v3048.css']) {
  assert(html.includes(file) || file.startsWith('weather-worker') || file.startsWith('style-'), `index.html does not reference ${file}`);
}

for (const id of ['orderFormError','deliveryLocationError','customerNameError','customerPhoneError','customerAddressError']) {
  assert(html.includes(`id="${id}"`), `Missing accessible error element: ${id}`);
}
assert((html.match(/aria-modal="true"/g) || []).length >= 3, 'All three modal systems must declare aria-modal=true');
const mainScript = fs.readFileSync(path.join(root, 'script-scentory-v3048.js'), 'utf8');
assert(mainScript.includes("const DATA_VERSION = '3051'"), 'Catalogue cache version is not 3051');
assert(mainScript.includes('activateAccessibleModal'), 'Missing modal focus activation');
assert(mainScript.includes("event.key === 'Tab'"), 'Missing modal Tab focus trap');
assert(mainScript.includes("setAttribute('aria-invalid'"), 'Missing accessible field invalid state');
const workerScript = fs.readFileSync(path.join(root, 'weather-worker-openweather-v3048.js'), 'utf8');
for (const safeguard of ['Origin not allowed','RATE_LIMITER','AbortSignal.timeout','X-Content-Type-Options','OPENWEATHER_API_KEY']) {
  assert(workerScript.includes(safeguard), `Missing weather safeguard: ${safeguard}`);
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
assert((sitemap.match(/<url>/g) || []).length === 109, 'Sitemap should contain homepage plus 108 product pages');

if (failures.length) {
  console.error(`Validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log('v3051 validation passed: 108 products, one coming soon, revised August prices and stock, profiles, assets, 109 SEO URLs and all previous features verified.');
