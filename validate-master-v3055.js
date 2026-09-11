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

assert(main.includes("const DATA_VERSION = '3055'"), 'Catalogue cache version is not 3055');
assert(html.includes('style-scentory-v3048.css?v=3055'), 'CSS cache version is not 3055');
assert(html.includes('script-scentory-v3048.js?v=3055'), 'Main script cache version is not 3055');
assert(html.includes('scentory-intelligence-v3048.js?v=3055'), 'Intelligence cache version is not 3055');
assert(!html.includes('weather-config-v3048.js'), 'Live weather configuration is still loaded');
assert(html.includes('Scentory Manual Weather Match'), 'Manual weather card is missing');
for (const required of ['runManualWeatherMatch(event)','manualTemperature','manualHumidity','manualCondition','weatherArea','Show Weather Matches']) {
  assert(intelligence.includes(required), `Manual weather feature missing: ${required}`);
}
for (const removed of ['fetchLiveWeather','runLiveWeatherByArea','useCurrentWeather','SCENTORY_WEATHER_CONFIG','navigator.geolocation','OpenWeather']) {
  assert(!intelligence.includes(removed), `Live weather dependency remains: ${removed}`);
}
const districtStart = intelligence.indexOf('const BANGLADESH_DISTRICTS');
const districtEnd = intelligence.indexOf(']);', districtStart);
const districtBlock = intelligence.slice(districtStart, districtEnd);
assert((districtBlock.match(/\{\s*name:\s*['"]/g) || []).length === 64, 'Bangladesh district data must contain exactly 64 districts');
assert(products.length === 108, `Expected 108 products; found ${products.length}`);
assert(products.filter(product => product.status === 'available').length === 97, 'Available product count changed');
assert(products.filter(product => product.status === 'out').length === 10, 'Out-of-stock product count changed');
assert(products.filter(product => product.status === 'upcoming').length === 1, 'Upcoming product count changed');
assert(products.every(product => !Object.hasOwn(product.sizes || {}, '30ml')), '30 ML found in storefront data');
for (const removedFile of ['weather-config-v3048.js','weather-worker-openweather-v3048.js','wrangler-weather-v3048.toml.example','LIVE_WEATHER_SETUP_v3049.txt']) {
  assert(!fs.existsSync(path.join(root, removedFile)), `Obsolete live-weather file remains: ${removedFile}`);
}

if (failures.length) {
  console.error(`v3055 validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log('v3055 validation passed: fully manual weather matching, 64 districts, no external weather dependency, and catalogue safeguards verified.');
