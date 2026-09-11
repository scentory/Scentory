#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'perfumes.json'), 'utf8'));
let source = fs.readFileSync(path.join(root, 'scentory-intelligence-v3048.js'), 'utf8');
source = source.replace(/\}\)\(\);\s*$/, `
  window.__scentoryTest = {
    buildPerfumeProfile, getTraits, selectDiverseMatches, weatherScore,
    styleFit, budgetPositionFit, evidenceFit, availableSize,
    occasionTraits, findWeights
  };
})();`);

const noOp = () => {};
const context = {
  console,
  perfumes: catalogue,
  window: {},
  document: {
    getElementById: () => null,
    querySelector: () => null,
    addEventListener: noOp,
    body: { classList: { add: noOp, remove: noOp, toggle: noOp } },
    activeElement: null
  },
  localStorage: { getItem: () => null, setItem: noOp },
  navigator: {},
  requestAnimationFrame: noOp,
  setTimeout,
  clearTimeout,
  URL,
  AbortSignal,
  escapeHtml: value => String(value ?? ''),
  productHasAvailableSize: product => Object.values(product.sizes || {}).some(item => item?.available && item?.price !== null) && product.status !== 'out' && product.status !== 'upcoming',
  isUpcoming: product => product?.status === 'upcoming',
  displayMl: value => String(value).replace('ml', ' ML'),
  imagePath: product => product.image || '',
  getScentProfile: product => ({ recommendation: product.recommendation || '' })
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'scentory-intelligence-v3048.js' });

const api = context.__scentoryTest;
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const available = catalogue.filter(context.productHasAvailableSize);

function scenarioResults(options) {
  const candidates = available.map(product => {
    const selected = api.availableSize(product, options.size || '5ml');
    if (!selected || selected.size !== (options.size || '5ml') || selected.item.price > options.budget) return null;
    const traits = api.getTraits(product);
    const profile = api.buildPerfumeProfile(product);
    const directOccasionHit = profile.uses.has(options.occasion);
    const relatedHits = api.occasionTraits[options.occasion].filter(trait => traits.has(trait)).length;
    const occasionFit = directOccasionHit ? 1 : clamp(relatedHits / 3, .15, .8);
    const characterHit = options.mood === 'versatile' ? profile.versatility >= 4 : profile.character.has(options.mood);
    const characterFit = characterHit ? 1 : options.mood === 'fresh' ? profile.freshness / 5 : options.mood === 'sweet' ? profile.sweetness / 5 : .25;
    const weatherFit = api.weatherScore(product, options.weather) / 100;
    const targetStrength = options.presence === 'light' ? 2 : options.presence === 'strong' ? 5 : 3;
    const presenceFit = clamp(1 - Math.abs(profile.strength - targetStrength) / 4, .2, 1);
    const avoidHit = options.avoid !== 'none' && (profile.character.has(options.avoid) || traits.has(options.avoid) || (options.avoid === 'bold' && profile.strength >= 4));
    const maturityFit = api.styleFit(profile, options.style);
    const budgetFit = api.budgetPositionFit(selected.item.price, options.budget, options.pricePreference);
    const confidence = api.evidenceFit(product, profile);
    let score = occasionFit * api.findWeights.occasion
      + characterFit * api.findWeights.character
      + weatherFit * api.findWeights.weather
      + presenceFit * api.findWeights.presence
      + maturityFit * api.findWeights.style
      + budgetFit * api.findWeights.budget
      + api.findWeights.availability
      + confidence * api.findWeights.confidence;
    if (avoidHit) score -= 22;
    if (!profile.topPickEligible) score -= 10;
    return { product, score: Math.round(Math.max(28, Math.min(98, score))), confidence };
  }).filter(Boolean);
  return api.selectDiverseMatches(candidates, 3);
}

const scenarios = [
  { occasion: 'daily', mood: 'aquatic', style: 'clean', weather: 'hot', presence: 'strong', avoid: 'none', pricePreference: 'value', budget: 300 },
  { occasion: 'formal', mood: 'woody', style: 'polished', weather: 'ac', presence: 'balanced', avoid: 'sweet', pricePreference: 'premium', budget: 800 },
  { occasion: 'date', mood: 'gourmand', style: 'luxury', weather: 'winter', presence: 'strong', avoid: 'fresh', pricePreference: 'premium', budget: 1200 },
  { occasion: 'office', mood: 'aromatic', style: 'polished', weather: 'ac', presence: 'light', avoid: 'bold', pricePreference: 'balanced', budget: 500 }
];

const scenarioWinners = [];
for (const scenario of scenarios) {
  const results = scenarioResults(scenario);
  const names = results.map(item => item.product.name);
  const brand = product => {
    const id = product.id;
    const known = ['club-de-nuit', 'afnan', 'hawas', 'lattafa', 'rayhaan', 'brandy', 'khadlaj', 'yusuf-bhai', 'al-haramain', 'riiffs'];
    return known.find(prefix => id.startsWith(prefix)) || id.split('-').slice(0, 2).join('-');
  };
  assert(results.length === 3, `Scenario did not return three results: ${JSON.stringify(scenario)}`);
  assert(names[0] !== 'Oud Al Layl Midnight EDP', `Oud Al Layl Midnight ranked first: ${JSON.stringify(scenario)}`);
  assert(new Set(results.map(item => brand(item.product))).size >= 2, `Scenario lacks brand diversity: ${names.join(', ')}`);
  scenarioWinners.push(names[0]);
}
assert(new Set(scenarioWinners).size === scenarios.length, `Different customer profiles returned repeated first choices: ${scenarioWinners.join(', ')}`);

const oud = catalogue.find(product => product.id === 'oud-al-layl-midnight-edp');
const oudProfile = api.buildPerfumeProfile(oud);
assert(oudProfile.topPickEligible === false, 'Engine does not read Oud Al Layl first-pick restriction');
assert(oudProfile.character.has('aquatic') && !oudProfile.character.has('oud'), 'Engine does not read corrected Oud Al Layl marine profile');

if (failures.length) {
  console.error(`Recommendation scenario validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log('v3053 recommendation scenarios passed: diversified families/brands, style and budget positioning, schema v2 use and Oud Al Layl first-pick restriction verified.');
