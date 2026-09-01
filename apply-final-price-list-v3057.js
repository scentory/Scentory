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

// August 2026 final applied price/stock changes supplied by Scentory.
setSize('hawas-chrome', '15ml', { available: false });
setSize('yusuf-bhai-wulong-cha', '10ml', { available: false });

const fareed = requireProduct('riiffs-fareed-edp');
fareed.status = 'available';
setSize('riiffs-fareed-edp', '5ml', { price: 240, available: true });
setSize('riiffs-fareed-edp', '6ml', { price: 299, available: true, premium: true });
setSize('riiffs-fareed-edp', '10ml', { price: 430, available: true });
setSize('riiffs-fareed-edp', '15ml', { price: 580, available: true });

requireProduct('supremacy-not-only-intense-edp').name = 'Afnan Supremacy Not Only Intense';

const theOne = requireProduct('dolce-gabbana-the-one-edp');
theOne.status = 'upcoming';
setSize('dolce-gabbana-the-one-edp', '6ml', { premium: true, available: false });
setSize('dolce-gabbana-the-one-edp', '15ml', { available: false });

setSize('azzaro-the-most-wanted-edp-intense', '10ml', { available: false });
setSize('rayhaan-cedrus-blanc-edp', '15ml', { available: false });

if (!byId.has('ajmal-kuro-edp')) {
  const afterId = 'rayhaan-elixir-edp';
  const insertAt = products.findIndex(product => product.id === afterId);
  if (insertAt < 0) throw new Error(`Insertion anchor missing: ${afterId}`);
  products.splice(insertAt + 1, 0, {
    id: 'ajmal-kuro-edp',
    name: 'Ajmal Kuro EDP',
    status: 'upcoming',
    sizes: {
      '5ml': { price: 280, available: false, premium: false },
      '6ml': { price: 340, available: false, premium: true },
      '10ml': { price: 499, available: false, premium: false },
      '15ml': { price: 690, available: false, premium: false }
    },
    image: 'ajmal-kuro-edp-poster.jpg',
    tags: ['Fresh', 'Warm Spicy', 'Aromatic', 'Woody', 'Office', 'Versatile'],
    recommendation: 'Coming soon. A fresh spicy aromatic and woody scent for office, university, casual outings, and evening dates.',
    prices: {
      '5 ML': 280,
      '6 ML': 340,
      '10 ML': 499,
      '15 ML': 690
    },
    profile: {
      schemaVersion: 2,
      character: ['fresh', 'spicy', 'aromatic', 'woody', 'amber'],
      occasions: ['daily', 'office', 'date'],
      climates: ['hot', 'monsoon', 'ac', 'outdoor'],
      strength: 4,
      projection: 4,
      longevity: 4,
      sweetness: 2,
      freshness: 4,
      warmth: 3,
      officeSafety: 4,
      heatSafety: 3,
      versatility: 5,
      evidence: 'scentory-supplied',
      reviewedAt: '2026-08-31',
      topPickEligible: false
    },
    details: {
      verification: 'scentory-supplied',
      notes: {
        top: ['Bergamot', 'Geranium', 'Lavender', 'Pepper'],
        heart: ['Elemi', 'Patchouli', 'Vetiver'],
        base: ['Ambergris']
      },
      performance: 'Around 7–9 hours on clothes, based on Scentory guidance; performance varies by wearer and conditions.',
      comparison: 'Dior Sauvage EDT',
      sourceNote: 'Scentory supplied the poster profile and comparison for this upcoming release.',
      sources: []
    }
  });
}

for (const product of products) {
  if (Object.hasOwn(product.sizes || {}, '30ml')) {
    throw new Error(`30 ML must remain excluded from storefront data: ${product.id}`);
  }
}

fs.writeFileSync(cataloguePath, `${JSON.stringify(products, null, 2)}\n`);
console.log(`Applied v3057 catalogue update to ${products.length} products.`);
