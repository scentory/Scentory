#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const main = fs.readFileSync(path.join(root, 'script-scentory-v3048.js'), 'utf8');
const intelligence = fs.readFileSync(path.join(root, 'scentory-intelligence-v3048.js'), 'utf8');
const products = JSON.parse(fs.readFileSync(path.join(root, 'perfumes.json'), 'utf8'));
const theOne = products.find(product => product.id === 'dolce-gabbana-the-one-edp');

assert(main.includes("const DATA_VERSION = '3056'"), 'Catalogue cache version is not 3056');
assert(html.includes('style-scentory-v3048.css?v=3056'), 'CSS cache version is not 3056');
assert(html.includes('script-scentory-v3048.js?v=3056'), 'Main script cache version is not 3056');
assert(html.includes('scentory-intelligence-v3048.js?v=3056'), 'Intelligence cache version is not 3056');
assert(!html.toLowerCase().includes('humidity'), 'Humidity remains in the main interface');
assert(!intelligence.toLowerCase().includes('humidity'), 'Humidity remains in the weather tool');
for (const required of ['runManualWeatherMatch(event)', 'manualTemperature', 'manualCondition', 'weatherArea', 'Show Weather Matches']) {
  assert(intelligence.includes(required), `Manual weather feature missing: ${required}`);
}
assert(!intelligence.includes('manualHumidity'), 'Manual humidity control still exists');
const districtStart = intelligence.indexOf('const BANGLADESH_DISTRICTS');
const districtEnd = intelligence.indexOf(']);', districtStart);
const districtBlock = intelligence.slice(districtStart, districtEnd);
assert((districtBlock.match(/\{\s*name:\s*['"]/g) || []).length === 64, 'Bangladesh district data must contain exactly 64 districts');
assert(Boolean(theOne), 'Dolce & Gabbana The One EDP is missing');
assert(theOne?.status === 'upcoming', 'Dolce & Gabbana The One EDP must remain Upcoming');
assert(theOne?.image === 'dolce-gabbana-the-one-edp-poster.jpg', 'D&G poster is not assigned to the product');
assert(fs.existsSync(path.join(root, 'dolce-gabbana-the-one-edp-poster.jpg')), 'D&G poster file is missing');
assert(products.length === 108, `Expected 108 products; found ${products.length}`);
assert(products.filter(product => product.status === 'available').length === 97, 'Available product count changed');
assert(products.filter(product => product.status === 'out').length === 10, 'Out-of-stock product count changed');
assert(products.filter(product => product.status === 'upcoming').length === 1, 'Upcoming product count changed');
assert(products.every(product => !Object.hasOwn(product.sizes || {}, '30ml')), '30 ML found in storefront data');

if (failures.length) {
  console.error(`v3056 validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log('v3056 validation passed: humidity removed, D&G poster added, Upcoming status preserved, and catalogue safeguards verified.');
