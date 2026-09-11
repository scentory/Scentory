#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(root, 'perfumes.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script-scentory-v3048.js'), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(products.length === 108, `Expected 108 products; found ${products.length}`);
assert(products.filter(product => product.status === 'available').length === 97, 'Available product count changed');
assert(products.filter(product => product.status === 'out').length === 10, 'Out-of-stock product count changed');
assert(products.filter(product => product.status === 'upcoming').length === 1, 'Upcoming product count changed');
assert(products.every(product => !Object.hasOwn(product.sizes || {}, '30ml')), '30 ML found in storefront data');

const signature = products.map(product => `${product.id}|${product.status}|${Object.entries(product.sizes).map(([size,item]) => `${size}:${item.price}:${Number(item.available)}:${Number(item.premium)}`).join(',')}`).join('\n');
assert(crypto.createHash('sha256').update(signature).digest('hex') === '749c33308f0b9d0d0d114bf0f120c5794eb4e77305b22bff46b014ae9bd57e2a', 'Applied August 2026 price/order/stock signature changed');
assert(script.includes("const DATA_VERSION = '3054'"), 'Catalogue cache version is not 3054');
assert(html.includes('style-scentory-v3048.css?v=3054'), 'CSS cache version is not 3054');
assert(html.includes('script-scentory-v3048.js?v=3054'), 'Main script cache version is not 3054');
assert(html.includes('weather-config-v3048.js?v=3054'), 'Weather configuration cache version is not 3054');
assert(html.includes('scentory-intelligence-v3048.js?v=3054'), 'Intelligence cache version is not 3054');
assert(products.find(product => product.id === 'dolce-gabbana-the-one-edp')?.status === 'upcoming', 'The One is not Upcoming');
assert(products.find(product => product.id === 'oud-al-layl-midnight-edp')?.profile?.topPickEligible === false, 'Oud Al Layl first-pick safeguard was lost');
assert(products.filter(product => product.details?.verification === 'source-checked').length === 13, 'Source-checked profile count changed');

if (failures.length) {
  console.error(`v3054 validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log('v3054 validation passed: supplied August price list exactly matches v3053; cache refresh and all catalogue safeguards verified.');
