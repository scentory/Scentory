#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cataloguePath = path.join(root, 'perfumes.json');
const products = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
const byId = new Map(products.map(product => [product.id, product]));

const requireProduct = id => {
  const product = byId.get(id);
  if (!product) throw new Error(`Missing product: ${id}`);
  return product;
};

const setSize = (id, size, changes) => {
  const product = requireProduct(id);
  if (!product.sizes?.[size]) throw new Error(`Missing size ${size} for ${id}`);
  Object.assign(product.sizes[size], changes);
  const priceKey = size.replace('ml', ' ML');
  if (Object.hasOwn(changes, 'price')) product.prices[priceKey] = changes.price;
};

const setStatus = (id, status) => {
  const product = requireProduct(id);
  product.status = status;
  if (status !== 'available') {
    for (const item of Object.values(product.sizes || {})) item.available = false;
  }
};

const makeMykonosProduct = (id, name) => ({
  id,
  name,
  status: 'available',
  sizes: {
    '5ml': { price: 320, available: true, premium: false },
    '6ml': { price: 399, available: true, premium: true },
    '10ml': { price: 590, available: true, premium: false },
    '15ml': { price: 840, available: false, premium: false }
  },
  image: 'product-image-coming-soon.svg',
  tags: ['Profile Review'],
  recommendation: 'Profile review in progress. Please sample 5 ML first while Scentory verifies the detailed scent profile.',
  prices: {
    '5 ML': 320,
    '6 ML': 399,
    '10 ML': 590,
    '15 ML': 840
  },
  profile: {
    schemaVersion: 1,
    character: ['aromatic'],
    occasions: ['daily'],
    climates: ['ac'],
    strength: 3,
    projection: 3,
    longevity: 3,
    sweetness: 3,
    freshness: 3,
    warmth: 3,
    officeSafety: 3,
    heatSafety: 3,
    versatility: 3,
    evidence: 'unverified',
    reviewedAt: '2026-09-03',
    topPickEligible: false
  },
  details: {
    verification: 'needs-source-review',
    performance: 'Performance guidance is under source review; skin, weather and atomizer can change results.',
    sources: []
  }
});

const additions = [
  makeMykonosProduct('mykonos-inception-edp', 'Mykonos Inception (EDP)'),
  makeMykonosProduct('mykonos-dreamscape-edp', 'Mykonos Dreamscape EDP')
];

const missingAdditions = additions.filter(product => !byId.has(product.id));
if (missingAdditions.length) {
  products.unshift(...missingAdditions);
  for (const product of missingAdditions) byId.set(product.id, product);
}

// Final applied price and stock list supplied by Scentory in September 2026.
setStatus('shuhrah-elixir-edp', 'out');

setStatus('yusuf-bhai-wulong-cha', 'available');
setSize('yusuf-bhai-wulong-cha', '10ml', { available: true });

setStatus('afnan-turathi-blue-edp', 'available');
setSize('afnan-turathi-blue-edp', '10ml', { available: false });

setStatus('dolce-gabbana-the-one-edp', 'available');
setSize('dolce-gabbana-the-one-edp', '5ml', { available: true });
setSize('dolce-gabbana-the-one-edp', '6ml', { available: true, premium: true });
setSize('dolce-gabbana-the-one-edp', '10ml', { available: true });
setSize('dolce-gabbana-the-one-edp', '15ml', { available: false });
requireProduct('dolce-gabbana-the-one-edp').recommendation = 'A refined warm evening profile suited to dates, dinners, formal occasions, and cooler or air-conditioned settings.';

setStatus('stronger-with-you-intensely-edp', 'available');
setSize('stronger-with-you-intensely-edp', '5ml', { price: 670, available: true });
setSize('stronger-with-you-intensely-edp', '6ml', { price: 799, available: true, premium: true });
setSize('stronger-with-you-intensely-edp', '10ml', { price: 1280, available: true });
setSize('stronger-with-you-intensely-edp', '15ml', { price: 1850, available: false });

setStatus('versace-eros-edt', 'available');
setSize('versace-eros-edt', '5ml', { available: true });
setSize('versace-eros-edt', '6ml', { available: true, premium: true });
setSize('versace-eros-edt', '10ml', { available: true });
setSize('versace-eros-edt', '15ml', { price: 1070, available: true });

setSize('burberry-touch-edt', '15ml', { available: true });
setSize('blue-by-ahmed-edp', '15ml', { available: true });
setSize('brandy-salvage-edp', '15ml', { available: false });

setStatus('ajmal-kuro-edp', 'available');
for (const size of ['5ml', '6ml', '10ml', '15ml']) setSize('ajmal-kuro-edp', size, { available: true });
requireProduct('ajmal-kuro-edp').recommendation = 'A fresh spicy aromatic and woody scent for office, university, casual outings, and evening dates.';
requireProduct('ajmal-kuro-edp').details.sourceNote = 'Scentory supplied the poster profile and comparison.';

for (const product of products) {
  if (Object.hasOwn(product.sizes || {}, '30ml')) {
    throw new Error(`30 ML must remain excluded from storefront data: ${product.id}`);
  }
  if (product.sizes?.['6ml']) product.sizes['6ml'].premium = true;
  if (product.status !== 'available') {
    for (const item of Object.values(product.sizes || {})) item.available = false;
  }
}

fs.writeFileSync(cataloguePath, `${JSON.stringify(products, null, 2)}\n`);
console.log(`Applied v3058 catalogue update to ${products.length} products.`);
