#!/usr/bin/env node
'use strict';

/*
  Creates Scentory's structured recommendation profile without changing prices,
  stock, sizes, product order, product IDs or images. The fields use controlled
  vocabularies so every customer tool reads the same product facts.
*/

const fs = require('fs');
const path = require('path');

const cataloguePath = path.join(__dirname, '..', 'perfumes.json');
const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));

const CHARACTER_RULES = {
  fresh: /fresh|clean|cool|ice|chill|aqua|aquatic|blue|azul|pacific|aloha|voyage|chrome|after swim|summer/,
  aquatic: /aqua|aquatic|ocean|marine|sea|voyage|cool water|pacific|aloha|after swim/,
  citrus: /citrus|bergamot|lemon|grapefruit|mandarin|tangerine|orange|maahir legacy|turathi/,
  green: /green|tea|zeleny|fattan|jungle|terra|wulong/,
  aromatic: /aromatic|lavender|fattan|modest|fakhar|kaaf|212 men|maahir|voyage|office/,
  fruity: /fruit|mango|pineapple|tropical|yara|honor|glory|plato|rave now|qaed/,
  sweet: /sweet|yara|khamrah|qahwa|bourbon|9 pm|9pm|honor|glory|mango|tropical|vanilla|plato|gold edition/,
  gourmand: /gourmand|khamrah|qahwa|vanilla|bourbon|liquid brun|honor.*glory/,
  spicy: /spicy|spice|cinnamon|ginger|qahwa|bourbon|kobra|elixir|teriaq|asad|wanted/,
  amber: /amber|ambre|gold|bourbon|khamrah|asad|liquid brun|kobra/,
  woody: /wood|woody|oud|cedrus|terra|fattan|bois|leather|ambre|dunescape|intense man/,
  oud: /\boud\b|oud for glory|layl|shuhrah|pharaoh/,
  leather: /leather|ambre leather|tuscan/,
  smoky: /smoky|smoke|oud for glory|intense man|club de nuit/,
  powdery: /powder|yara|touch|plato/,
  musky: /musk|clean|kaaf|touch/,
  elegant: /elegant|formal|collector|precieux|plato|gold|majestic|touch/
};

const OCCASION_RULES = {
  daily: /daily|casual|errands|university|regular use|everyday|travel|hangout/,
  office: /office|university|meeting|professional|library|formal daytime/,
  active: /gym|active|sport|beach|outdoor|summer day/,
  date: /date|romantic|dinner|evening/,
  party: /party|club|night out|night-out|wedding|event/,
  formal: /formal|wedding|gala|business|meeting|special occasion/
};

const CLIMATE_RULES = {
  hot: /summer|hot|heat|warm weather|tropical|beach/,
  monsoon: /monsoon|rain|all-season|year-round|versatile/,
  winter: /winter|cold|cooler|autumn|fall/,
  ac: /office|formal|meeting|indoor|ac room|university/,
  outdoor: /outdoor|beach|travel|gym|party|day out|daytime/
};

const OVERRIDES = {
  'dolce-gabbana-the-one-edp': {
    character: ['spicy', 'amber', 'woody', 'sweet', 'elegant'],
    occasions: ['date', 'formal'], climates: ['winter', 'ac'],
    strength: 3, projection: 3, longevity: 3, freshness: 1, sweetness: 3,
    warmth: 5, officeSafety: 2, heatSafety: 1, versatility: 3
  },
  'hawas-rouge-edp': {
    character: ['aromatic'], occasions: ['daily'], climates: ['monsoon', 'ac'],
    strength: 3, projection: 3, longevity: 3, freshness: 3, sweetness: 3,
    warmth: 3, officeSafety: 3, heatSafety: 3, versatility: 3
  },
  'yusuf-bhai-bois-imperial': {
    character: ['woody', 'green', 'aromatic', 'fresh', 'spicy'],
    occasions: ['daily', 'office', 'formal'], climates: ['hot', 'monsoon', 'ac', 'outdoor'],
    strength: 4, projection: 4, longevity: 4, freshness: 4, sweetness: 1,
    warmth: 3, officeSafety: 4, heatSafety: 4, versatility: 5
  },
  'yusuf-bhai-men-212': {
    character: ['fresh', 'green', 'aromatic', 'citrus', 'woody'],
    occasions: ['daily', 'office'], climates: ['hot', 'monsoon', 'ac', 'outdoor'],
    strength: 3, projection: 3, longevity: 3, freshness: 5, sweetness: 1,
    warmth: 2, officeSafety: 5, heatSafety: 4, versatility: 4
  },
  'yusuf-bhai-allure-homme-sport': {
    character: ['fresh', 'citrus', 'aromatic', 'woody', 'musky'],
    occasions: ['daily', 'office', 'active'], climates: ['hot', 'monsoon', 'ac', 'outdoor'],
    strength: 3, projection: 3, longevity: 3, freshness: 5, sweetness: 2,
    warmth: 2, officeSafety: 5, heatSafety: 5, versatility: 5
  },
  'oud-al-layl-midnight-edp': {
    character: ['oud', 'woody', 'amber', 'spicy', 'smoky'],
    occasions: ['date', 'party', 'formal'], climates: ['winter', 'ac'],
    strength: 4, projection: 4, longevity: 4, freshness: 1, sweetness: 3,
    warmth: 5, officeSafety: 1, heatSafety: 1, versatility: 2
  },
  'hawas-kobra-edp': {
    character: ['citrus', 'spicy', 'green', 'woody', 'amber', 'fresh'],
    occasions: ['daily', 'office', 'date'], climates: ['hot', 'monsoon', 'ac', 'outdoor'],
    strength: 3, projection: 3, longevity: 3, freshness: 4, sweetness: 2,
    warmth: 3, officeSafety: 3, heatSafety: 3, versatility: 4
  },
  'hawas-for-him-edp': { character: ['fresh', 'aquatic', 'fruity', 'sweet', 'musky'] },
  'hawas-ice-edp': { character: ['fresh', 'aquatic', 'fruity', 'citrus', 'musky'] },
  'rasasi-fattan-edp': { character: ['green', 'citrus', 'woody', 'aromatic', 'fresh'] },
  'afnan-turathi-blue-edp': { character: ['citrus', 'fresh', 'woody', 'aromatic', 'musky'] },
  'afnan-9-pm-edp': { character: ['sweet', 'fruity', 'amber', 'spicy', 'gourmand'] },
  'nautica-voyage-edt': { character: ['fresh', 'aquatic', 'green', 'fruity', 'musky'] },
  'davidoff-cool-water-edt': { character: ['fresh', 'aquatic', 'green', 'aromatic', 'musky'] },
  'burberry-touch-edt': { character: ['fresh', 'powdery', 'musky', 'woody', 'aromatic'] },
  'bade-e-al-oud-oud-for-glory': { character: ['oud', 'woody', 'spicy', 'amber', 'smoky'] },
  'bade-e-al-oud-honor-glory': { character: ['sweet', 'fruity', 'gourmand', 'spicy', 'woody'] },
  'club-de-nuit-intense-man-pure-parfum': { character: ['citrus', 'fruity', 'smoky', 'woody', 'leather'] },
  'club-de-nuit-intesne-man-edp': { character: ['citrus', 'fruity', 'smoky', 'woody', 'leather'] },
  'club-de-nuit-intesne-man-edt': { character: ['citrus', 'fruity', 'smoky', 'woody', 'leather'] },
  'liquid-brun-by-french-avenue-edp': { character: ['sweet', 'gourmand', 'spicy', 'amber', 'woody'] },
  'lattafa-khamrah-qahwa-edp': { character: ['sweet', 'gourmand', 'spicy', 'amber', 'woody'] },
  'lattafa-asad-edp': { character: ['spicy', 'amber', 'woody', 'sweet', 'smoky'] },
  'lattafa-yara-edp': { character: ['sweet', 'fruity', 'powdery', 'gourmand', 'musky'] },
  'lattafa-fakhar-black-edp': { character: ['fresh', 'aromatic', 'citrus', 'woody', 'amber'] },
  'qaed-al-fursan-edp': { character: ['fruity', 'sweet', 'woody', 'amber', 'smoky'] }
};

function valuesFromRules(text, rules) {
  return Object.entries(rules).filter(([, pattern]) => pattern.test(text)).map(([value]) => value);
}

function unique(values) {
  return [...new Set(values)];
}

function clamp(value) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function buildProfile(product) {
  const text = `${product.name} ${(product.tags || []).join(' ')} ${product.recommendation || ''}`.toLowerCase();
  const override = OVERRIDES[product.id] || {};
  let character = override.character || valuesFromRules(text, CHARACTER_RULES);
  let occasions = override.occasions || valuesFromRules(text, OCCASION_RULES);
  let climates = override.climates || valuesFromRules(text, CLIMATE_RULES);

  if (!character.length) character = ['aromatic'];
  if (!occasions.length) occasions = ['daily'];
  if (!climates.length) climates = ['monsoon', 'ac'];

  const strongText = /beast mode|intense|overdose|elixir|extrait|pure parfum|stronger|most wanted/.test(text);
  const lightText = /edt|light|soft|airy|cool water|voyage|after swim/.test(text) && !strongText;
  const fresh = character.some(item => ['fresh', 'aquatic', 'citrus', 'green', 'aromatic'].includes(item));
  const warm = character.some(item => ['sweet', 'gourmand', 'spicy', 'amber', 'oud', 'smoky', 'leather'].includes(item));
  const strength = override.strength || (strongText ? 4 : lightText ? 2 : 3);
  const sweetness = override.sweetness || clamp(character.includes('gourmand') ? 5 : character.includes('sweet') ? 4 : character.includes('fruity') ? 3 : 2);
  const freshness = override.freshness || clamp(fresh ? (character.includes('aquatic') ? 5 : 4) : 2);
  const warmth = override.warmth || clamp(warm ? (character.includes('oud') || character.includes('gourmand') ? 5 : 4) : 2);
  const officeSafety = override.officeSafety || clamp(occasions.includes('office') ? 4 - Math.max(0, strength - 3) : fresh ? 3 : 2);
  const heatSafety = override.heatSafety || clamp(climates.includes('hot') ? 4 : warm ? 2 : 3);
  const versatility = override.versatility || clamp((occasions.length + climates.length) / 2 + (fresh ? 1 : 0));

  return {
    schemaVersion: 1,
    character: unique(character).slice(0, 6),
    occasions: unique(occasions),
    climates: unique(climates),
    strength,
    projection: override.projection || clamp(strength),
    longevity: override.longevity || clamp(strength + (strongText ? 1 : 0)),
    sweetness,
    freshness,
    warmth,
    officeSafety,
    heatSafety,
    versatility,
    evidence: OVERRIDES[product.id] ? 'curated' : 'catalogue-derived',
    reviewedAt: '2026-08-26'
  };
}

const protectedBefore = catalogue.map(({ id, status, sizes, prices, image }) => ({ id, status, sizes, prices, image }));
catalogue.forEach(product => { product.profile = buildProfile(product); });
const protectedAfter = catalogue.map(({ id, status, sizes, prices, image }) => ({ id, status, sizes, prices, image }));

if (JSON.stringify(protectedBefore) !== JSON.stringify(protectedAfter)) {
  throw new Error('Protected catalogue fields changed while building profiles.');
}

fs.writeFileSync(cataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`);
console.log(`Structured profiles written for ${catalogue.length} perfumes.`);
