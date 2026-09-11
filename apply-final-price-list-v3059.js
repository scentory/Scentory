#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const file = path.join(root, 'perfumes.json');
const products = JSON.parse(fs.readFileSync(file, 'utf8'));
const byId = new Map(products.map(p => [p.id, p]));
const sunId = 'khadlaj-island-sun-edp';
if (!byId.has(sunId)) {
  const sun = {id:sunId,name:'Khadlaj Island Sun EDP',status:'available',sizes:{},prices:{}};
  const position = products.findIndex(p => p.id === 'khadlaj-island-edp');
  if (position < 0) throw new Error('Khadlaj insertion anchor missing');
  products.splice(position, 0, sun);
  byId.set(sunId, sun);
}
const rows = fs.readFileSync(path.join(__dirname,'supplied-prices-v3059.txt'),'utf8').split(/\r?\n/).filter(s => s && !s.startsWith('#'));
const seen = new Set();
for (const row of rows) {
  const [id, amounts, flag] = row.split('|');
  if (seen.has(id)) throw new Error(`Duplicate source ID ${id}`);
  seen.add(id);
  const p = byId.get(id);
  if (!p) throw new Error(`Missing product ${id}`);
  const keys = flag?.startsWith('3ml') ? flag.split(',') : ['5ml','6ml','10ml','15ml','30ml'];
  const values = amounts.split(',');
  if (values.length !== keys.length) throw new Error(`Invalid row ${id}`);
  p.status = flag === 'OUT' ? 'out' : 'available';
  p.sizes = {}; p.prices = {};
  keys.forEach((size, i) => {
    if (size === '30ml') return; // Protected storefront rule; source retained above.
    const price = Number(values[i].replace('!',''));
    if (!Number.isFinite(price) || price <= 0) throw new Error(`Invalid price ${id}`);
    p.sizes[size] = {price, available:p.status === 'available' && !values[i].endsWith('!'), premium:size === '6ml'};
    p.prices[size.replace('ml',' ML')] = price;
  });
}
if (seen.size !== products.length) throw new Error('Source list does not cover the whole catalogue');

const profiles = [
  {
    id:'mykonos-inception-edp', image:'mykonos-inception-edp-poster-v3059.jpg',
    tags:['Fresh','Citrus','Aromatic','Office'], character:['fresh','citrus','aromatic','woody'],
    occasions:['daily','office','date'], climates:['hot','ac','outdoor'],
    recommendation:'A citrus, ginger and tea scent for office, university, daytime dates, casual outings and travel.',
    notes:['Lemon','Bergamot','Ginger','Orange','Black tea','Neroli','Cinnamon','Musk','Cedarwood','Guaiac wood'],
    performance:'Around 7–9 hours on clothes, according to Scentory’s supplied poster; results vary with skin chemistry, environment and spray count.',
    comparison:'Louis Vuitton Imagination'
  },
  {
    id:'mykonos-dreamscape-edp', image:'mykonos-dreamscape-edp-poster-v3059.jpg',
    tags:['Fruity','Citrus','Summer','Woody'], character:['fruity','citrus','spicy','woody'],
    occasions:['daily','date','party'], climates:['hot','outdoor'],
    recommendation:'A mango, citrus and warm spice scent for summer outings, beaches, vacations, daytime dates and casual hangouts.',
    notes:['Mango','Italian lemon','Rhubarb','Ginger','Pink pepper','Violet','Jasmine','Praline','Cedar','Amber','Tonka bean','Moss'],
    performance:'Around 8–9+ hours on clothes, according to Scentory’s supplied poster; results vary with skin chemistry, environment and spray count.',
    comparison:'Stéphane Humbert Lucas – God of Fire'
  },
  {
    id:sunId, image:'khadlaj-island-sun-edp-poster-v3059.jpg',
    tags:['Fruity','Citrus','Summer','Woody'], character:['fruity','citrus','sweet','woody'],
    occasions:['daily','date','party'], climates:['hot','outdoor'],
    recommendation:'A mango, coconut and citrus scent with smooth woods and tonka for summer outings, beaches, vacations, brunches and daytime dates.',
    notes:['Mango','Coconut','Lime','Lemon','Pink pepper','Jasmine','Orange blossom','Musk','Tonka bean','Precious woods'],
    performance:'Around 8–9+ hours on clothes, according to Scentory’s supplied poster; results vary with skin chemistry, environment and spray count.',
    comparison:'Creed Virgin Island Water + God of Fire'
  }
];
for (const data of profiles) {
  const p = byId.get(data.id);
  p.image = data.image;
  p.tags = data.tags;
  p.recommendation = data.recommendation;
  p.profile = {
    schemaVersion:2, character:data.character, occasions:data.occasions, climates:data.climates,
    strength:3, projection:3, longevity:4, sweetness:data.id.includes('inception') ? 2 : 4,
    freshness:4, warmth:3, officeSafety:3, heatSafety:3, versatility:3,
    evidence:'scentory-supplied', reviewedAt:'2026-09-05', topPickEligible:false
  };
  p.details = {
    verification:'scentory-supplied', notes:{listed:data.notes}, performance:data.performance,
    comparison:data.comparison,
    sourceNote:'Notes, use guidance, performance and comparison supplied by Scentory in the product poster. Notes are listed without an unconfirmed top/heart/base split. Recommendation scores are approximate catalogue guidance.',
    sources:[]
  };
}
fs.writeFileSync(file, JSON.stringify(products,null,2)+'\n');
console.log(`Applied complete supplied list: ${products.length} products; three posters and supplied profiles.`);
