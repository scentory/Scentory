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
  assert(Number(profile?.schemaVersion) >= 1 && Number(profile?.schemaVersion) <= 2, `Missing or unsupported profile schema: ${product.id}`);
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
assert(mainScript.includes("const DATA_VERSION = '3053'"), 'Catalogue cache version is not 3053');
assert(mainScript.includes('renderIntelligenceDetails'), 'Verified perfume detail renderer is missing');
assert(mainScript.includes('Profile review in progress'), 'Unverified note claims are not safely withheld');
assert(mainScript.includes('activateAccessibleModal'), 'Missing modal focus activation');
assert(mainScript.includes("event.key === 'Tab'"), 'Missing modal Tab focus trap');
assert(mainScript.includes("setAttribute('aria-invalid'"), 'Missing accessible field invalid state');
const intelligenceScript = fs.readFileSync(path.join(root, 'scentory-intelligence-v3048.js'), 'utf8');
const districtSource = intelligenceScript.match(/const BANGLADESH_DISTRICTS = Object\.freeze\((\[[\s\S]*?\])\.map\(Object\.freeze\)\);/);
assert(districtSource, 'Bangladesh district dataset is missing');
if (districtSource) {
  const districts = Function(`"use strict"; return ${districtSource[1]};`)();
  assert(districts.length === 64, `Expected 64 Bangladesh districts; found ${districts.length}`);
  assert(new Set(districts.map(district => district.name)).size === 64, 'Duplicate Bangladesh district names detected');
  assert(districts.every(district => district.name && district.bangla && district.division && Array.isArray(district.aliases)), 'Incomplete Bangladesh district entry');
}
for (const feature of ['role="combobox"','role="listbox"','handleWeatherDistrictKeydown','initWeatherDistrictAutocomplete']) {
  assert(intelligenceScript.includes(feature), `Missing weather district autocomplete feature: ${feature}`);
}
for (const feature of ['Number(structured?.schemaVersion) >= 1','styleProfiles','findStyle','findPricePreference','selectDiverseMatches','topPickEligible']) {
  assert(intelligenceScript.includes(feature), `Missing recommendation maturity/diversity safeguard: ${feature}`);
}
assert(intelligenceScript.includes('Results are diversified by scent family and brand'), 'Recommendation transparency text is missing');
const sourceChecked = current.filter(product => product.details?.verification === 'source-checked');
assert(sourceChecked.length === 13, `Expected 13 source-checked priority profiles; found ${sourceChecked.length}`);
for (const product of sourceChecked) {
  assert(product.profile?.schemaVersion === 2, `Source-checked profile is not schema v2: ${product.id}`);
  assert(product.profile?.evidence === 'web-verified', `Source-checked profile is missing web evidence status: ${product.id}`);
  assert(Array.isArray(product.details?.notes?.top) && product.details.notes.top.length, `Missing source-checked top notes: ${product.id}`);
  assert(Array.isArray(product.details?.notes?.heart) && product.details.notes.heart.length, `Missing source-checked heart notes: ${product.id}`);
  assert(Array.isArray(product.details?.notes?.base) && product.details.notes.base.length, `Missing source-checked base notes: ${product.id}`);
  assert(Array.isArray(product.details?.sources) && product.details.sources.length, `Missing profile sources: ${product.id}`);
}
const oudAlLayl = current.find(product => product.id === 'oud-al-layl-midnight-edp');
assert(oudAlLayl?.profile?.topPickEligible === false, 'Oud Al Layl Midnight must not be eligible as a first recommendation');
assert((oudAlLayl?.profile?.character || []).includes('aquatic') && !(oudAlLayl?.profile?.character || []).includes('oud'), 'Oud Al Layl Midnight profile still conflicts with the marine-citrus product');
assert(html.includes('120+ PERFUME CHOICES') && html.includes('108 Perfumes'), '120+ expanding-selection message or exact online count is missing');
assert(html.includes('v=3053'), 'Asset cache version is not 3053');
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
console.log('v3053 validation passed: 108 online products, 120+ expanding-selection messaging, 13 source-checked profiles, diversified mature recommendations, Oud Al Layl first-pick restriction, 64 districts, prices, stock, assets and 109 SEO URLs verified.');
