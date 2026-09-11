#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const cataloguePath = path.join(__dirname, '..', 'perfumes.json');
const current = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
const byId = new Map(current.map(product => [product.id, product]));

const newProducts = {
  'hawas-rouge-edp': {
    id: 'hawas-rouge-edp', name: 'Hawas Rouge EDP', image: 'product-image-coming-soon.svg',
    tags: ['Signature', 'Versatile'], recommendation: 'Currently out of stock. Profile details will be expanded when verified product information is available.'
  },
  'yusuf-bhai-bois-imperial': {
    id: 'yusuf-bhai-bois-imperial', name: 'Yusuf Bhai - Bois Imperial', image: 'yusuf-bhai-bois-imperial.webp',
    tags: ['Woody', 'Fresh', 'Office', 'Formal'], recommendation: 'Best for office, smart-casual wear, meetings, and a polished woody everyday signature.'
  },
  'yusuf-bhai-men-212': {
    id: 'yusuf-bhai-men-212', name: 'Yusuf Bhai - Men 212', image: 'yusuf-bhai-men-212.webp',
    tags: ['Fresh', 'Office', 'Daily Wear'], recommendation: 'Best for office, university, clean daytime wear, and an easy everyday rotation.'
  },
  'yusuf-bhai-allure-homme-sport': {
    id: 'yusuf-bhai-allure-homme-sport', name: 'Yusuf Bhai - Allure Homme Sport', image: 'yusuf-bhai-allure-homme-sport.webp',
    tags: ['Fresh', 'Gym', 'Office', 'Summer'], recommendation: 'Best for fresh daytime wear, gym, office, university, travel, and warm-weather use.'
  },
  'dolce-gabbana-the-one-edp': {
    id: 'dolce-gabbana-the-one-edp', name: 'Dolce & Gabbana - The One (EDP)', image: 'product-image-coming-soon.svg',
    tags: ['Warm Spicy', 'Amber', 'Date Night', 'Formal'], recommendation: 'Coming soon. A refined warm evening profile suited to dates, dinners, formal occasions, and cooler or air-conditioned settings.'
  }
};

const e = (id, prices, unavailable = [], out = false, premium6 = true, status = null) => ({ id, prices, unavailable, out, premium6, status });
const final = [
  e('hawas-for-him-edp', { '5ml':240, '6ml':290, '10ml':420, '15ml':580 }),
  e('hawas-ice-edp', { '5ml':260, '6ml':320, '10ml':480, '15ml':660 }),
  e('hawas-black-edp', { '5ml':250, '6ml':299, '10ml':450, '15ml':620 }),
  e('hawas-chrome', { '5ml':290, '6ml':350, '10ml':540, '15ml':750 }),
  e('hawas-la-mer-edp', { '5ml':290, '6ml':360, '10ml':540, '15ml':750 }),
  e('hawas-rouge-edp', { '5ml':290, '6ml':350, '10ml':540, '15ml':750 }, [], true),
  e('hawas-majestic-edp', { '5ml':300, '6ml':370, '10ml':560, '15ml':790 }),
  e('hawas-kobra-edp', { '5ml':250, '6ml':300, '10ml':440, '15ml':600 }),
  e('hawas-elixir-edp', { '5ml':270, '6ml':320, '10ml':470, '15ml':650 }, [], true),
  e('hawas-fire-edp', { '5ml':290, '6ml':350, '10ml':540, '15ml':750 }, ['15ml']),
  e('shuhrah-bois-e-edp', { '5ml':260, '6ml':320, '10ml':470, '15ml':650 }, ['10ml','15ml']),
  e('shuhrah-elixir-edp', { '5ml':250, '6ml':310, '10ml':460, '15ml':630 }, ['10ml','15ml']),
  e('rasasi-fattan-edp', { '5ml':290, '6ml':340, '10ml':500, '15ml':690 }, ['10ml','15ml']),
  e('yusuf-bhai-wulong-cha', { '5ml':390, '6ml':470, '10ml':740, '15ml':1050 }, ['15ml']),
  e('yusuf-bhai-bois-imperial', { '5ml':309, '6ml':380, '10ml':560, '15ml':780 }, ['15ml']),
  e('yusuf-bhai-men-212', { '5ml':260, '6ml':320, '10ml':470, '15ml':640 }, ['15ml']),
  e('yusuf-bhai-allure-homme-sport', { '5ml':260, '6ml':320, '10ml':470, '15ml':640 }, ['15ml']),
  e('riiffs-fareed-edp', { '5ml':270, '6ml':330, '10ml':490, '15ml':680 }, [], true),
  e('riiffs-freeze-edp', { '5ml':299, '6ml':370, '10ml':560, '15ml':790 }),
  e('reef-33-edp', { '5ml':309, '6ml':380, '10ml':560, '15ml':790 }, ['15ml']),
  e('thriller-iii-maison-x-cal-cologne', { '5ml':319, '6ml':390, '10ml':600, '15ml':840 }, ['15ml']),
  e('vanguard-by-maison-asrar', { '5ml':330, '6ml':410, '10ml':620, '15ml':880 }, [], true),
  e('afnan-supremacy-collector-s-edition-edp', { '5ml':450, '6ml':550, '10ml':860, '15ml':1240 }, ['15ml']),
  e('supremacy-not-only-intense-edp', { '5ml':350, '6ml':420, '10ml':640, '15ml':900 }, ['15ml']),
  e('afnan-turathi-blue-edp', { '5ml':320, '6ml':390, '10ml':600, '15ml':840 }, ['15ml']),
  e('afnan-9-pm-night-out-edp', { '5ml':430, '6ml':510, '10ml':799, '15ml':1170 }),
  e('afnan-9-pm-edp', { '5ml':290, '6ml':350, '10ml':540, '15ml':750 }),
  e('afnan-9-pm-rebel-edp', { '5ml':340, '6ml':410, '10ml':640, '15ml':900 }, ['15ml']),
  e('afnan-modest-une-edp', { '5ml':270, '6ml':330, '10ml':499, '15ml':690 }, ['15ml']),
  e('dolce-gabbana-the-one-edp', { '5ml':440, '6ml':530, '10ml':830, '15ml':1180 }, ['5ml','6ml','10ml','15ml'], false, false, 'upcoming'),
  e('stronger-with-you-intensely-edp', { '5ml':670, '6ml':810, '10ml':1310, '15ml':1910 }, [], true),
  e('azzaro-the-most-wanted-edp-intense', { '3ml':310, '5ml':470, '6ml':570, '10ml':900 }),
  e('ysl-y-edp', { '3ml':430, '5ml':670, '6ml':799, '10ml':1299 }),
  e('nautica-voyage-edt', { '5ml':210, '6ml':260, '10ml':360, '15ml':480 }),
  e('212-men-by-carolina-herrera', { '5ml':440, '6ml':530, '10ml':840, '15ml':1200 }),
  e('versace-eros-edt', { '5ml':399, '6ml':490, '10ml':760, '15ml':1090 }, [], true),
  e('kenzo-homme-edt-intense', { '5ml':420, '6ml':510, '10ml':810, '15ml':1150 }, ['10ml','15ml']),
  e('davidoff-cool-water-edt', { '5ml':220, '6ml':270, '10ml':399, '15ml':540 }),
  e('burberry-touch-edt', { '5ml':299, '6ml':360, '10ml':540, '15ml':750 }, ['15ml']),
  e('al-haramain-amber-oud-gold-edition', { '5ml':330, '6ml':399, '10ml':599, '15ml':830 }),
  e('al-haramain-amber-oud-aqua-dubai', { '5ml':330, '6ml':399, '10ml':599, '15ml':830 }),
  e('kaaf-by-ahmed-edp', { '5ml':280, '6ml':340, '10ml':510, '15ml':710 }),
  e('blue-by-ahmed-edp', { '5ml':220, '6ml':270, '10ml':399, '15ml':540 }, ['15ml']),
  e('zeleny-by-ahmed-edp', { '5ml':220, '6ml':270, '10ml':400, '15ml':540 }),
  e('miami-blue-by-ard', { '5ml':209, '6ml':250, '10ml':350, '15ml':470 }, ['15ml']),
  e('brandy-salvage-edp', { '5ml':180, '6ml':230, '10ml':320, '15ml':430 }),
  e('brandy-after-swim-edp', { '5ml':180, '6ml':230, '10ml':320, '15ml':430 }),
  e('brandy-inspiration-edp', { '5ml':180, '6ml':230, '10ml':320, '15ml':430 }),
  e('brandy-ambre-leather-edp', { '5ml':200, '6ml':250, '10ml':360, '15ml':490 }, [], true),
  e('marwa-arabian-prestige-edp', { '5ml':290, '6ml':340, '10ml':520, '15ml':720 }, ['15ml']),
  e('bois-blanc-by-arabiyat-prestige', { '5ml':270, '6ml':330, '10ml':480, '15ml':660 }, [], true),
  e('absolute-chill-atralia-edp', { '5ml':220, '6ml':270, '10ml':400, '15ml':550 }),
  e('absolute-ice-by-atralia-edp', { '5ml':230, '6ml':280, '10ml':409, '15ml':550 }, ['15ml']),
  e('kayaan-midnight-edp', { '5ml':240, '6ml':290, '10ml':420, '15ml':580 }),
  e('rayhaan-azul-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-cedrus-blanc-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-pacific-aloha-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-nocturno-elixir-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-pharaoh-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-italia-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-jungle-vibe-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-lion-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-tiger-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-wolf-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-aquatica-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-pacific-aura-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-tropical-vibe-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-obsidian-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-terra-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('rayhaan-elixir-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':530 }),
  e('bade-e-al-oud-oud-for-glory', { '5ml':240, '6ml':300, '10ml':440, '15ml':600 }, ['15ml']),
  e('bade-e-al-oud-honor-glory', { '5ml':240, '6ml':300, '10ml':440, '15ml':600 }),
  e('armaf-dunescape-edp', { '5ml':299, '6ml':360, '10ml':540, '15ml':760 }),
  e('club-de-nuit-intense-man-pure-parfum', { '5ml':300, '6ml':370, '10ml':570, '15ml':790 }),
  e('club-de-nuit-intense-overdose', { '5ml':420, '6ml':520, '10ml':810, '15ml':1160 }, ['15ml']),
  e('club-de-nuit-intesne-man-edp', { '5ml':270, '6ml':320, '10ml':480, '15ml':650 }),
  e('club-de-nuit-precieux-extrait-de-parfum', { '5ml':690, '6ml':840, '10ml':1360, '15ml':1990 }, [], true),
  e('club-de-nuit-intesne-man-edt', { '5ml':290, '6ml':340, '10ml':510, '15ml':700 }),
  e('club-de-nuit-urban-man-elixir-edp', { '5ml':290, '6ml':340, '10ml':510, '15ml':710 }, ['15ml']),
  e('club-de-nuit-blue-iconic', { '5ml':320, '6ml':390, '10ml':590, '15ml':830 }),
  e('aromatix-platine-blanc-extract', { '5ml':330, '6ml':399, '10ml':610, '15ml':860 }, ['15ml']),
  e('atlantis-extrait-by-french-avenue-edp', { '5ml':299, '6ml':370, '10ml':560, '15ml':780 }, ['15ml']),
  e('zenith-blue-by-french-avenue-edp', { '5ml':290, '6ml':350, '10ml':520, '15ml':730 }, ['15ml']),
  e('liquid-brun-by-french-avenue-edp', { '5ml':299, '6ml':370, '10ml':560, '15ml':780 }),
  e('vulcan-feu-by-french-avenue-edp', { '5ml':299, '6ml':370, '10ml':560, '15ml':780 }),
  e('naseem-by-gulf-orchid', { '5ml':210, '6ml':250, '10ml':360, '15ml':490 }),
  e('mango-ice-by-gulf-orchid', { '5ml':270, '6ml':330, '10ml':490, '15ml':670 }),
  e('lattafa-opulent-dubai-edp', { '5ml':199, '6ml':240, '10ml':350, '15ml':440 }),
  e('lattafa-art-of-universe-edp', { '5ml':360, '6ml':430, '10ml':660, '15ml':940 }),
  e('lattafa-maahir-legacy-edp', { '5ml':260, '6ml':310, '10ml':470, '15ml':640 }),
  e('lattafa-yara-edp', { '5ml':220, '6ml':270, '10ml':390, '15ml':520 }, ['15ml']),
  e('rave-plato-lattafa', { '5ml':210, '6ml':250, '10ml':360, '15ml':490 }, ['15ml']),
  e('rave-now-by-lattafa-edp', { '5ml':210, '6ml':250, '10ml':360, '15ml':490 }),
  e('dynasty-by-lattafa-edp', { '5ml':260, '6ml':320, '10ml':470, '15ml':660 }),
  e('teriaq-intense-by-lattafa-edp', { '5ml':310, '6ml':380, '10ml':570, '15ml':800 }),
  e('lattafa-khamrah-qahwa-edp', { '5ml':280, '6ml':340, '10ml':510, '15ml':700 }),
  e('lattafa-asad-bourbon-edp', { '5ml':220, '6ml':270, '10ml':399, '15ml':550 }),
  e('lattafa-asad-edp', { '5ml':220, '6ml':270, '10ml':399, '15ml':550 }),
  e('lattafa-fakhar-black-edp', { '5ml':230, '6ml':280, '10ml':410, '15ml':560 }),
  e('lattafa-najdia-edp', { '5ml':190, '6ml':230, '10ml':330, '15ml':440 }, ['15ml']),
  e('lattafa-haayati-edp', { '5ml':190, '6ml':230, '10ml':320, '15ml':440 }),
  e('khadlaj-karus-gold-absolu-edp', { '5ml':260, '6ml':320, '10ml':470, '15ml':650 }, ['15ml']),
  e('khadlaj-island-edp', { '5ml':250, '6ml':300, '10ml':450, '15ml':620 }, ['15ml']),
  e('khadlaj-island-dream-edp', { '5ml':250, '6ml':300, '10ml':450, '15ml':620 }),
  e('titan-by-khadlaj-edp', { '5ml':270, '6ml':330, '10ml':490, '15ml':670 }, [], true),
  e('qaed-al-fursan-edp', { '5ml':190, '6ml':230, '10ml':330, '15ml':430 }),
  e('daring-blue-edp', { '5ml':190, '6ml':230, '10ml':320, '15ml':430 }),
  e('oud-al-layl-midnight-edp', { '5ml':160, '6ml':190, '10ml':260, '15ml':350 })
];

for (const product of Object.values(newProducts)) if (!byId.has(product.id)) byId.set(product.id, product);

const desiredIds = new Set(final.map(item => item.id));
if (desiredIds.size !== final.length) throw new Error('Duplicate ID in final price list.');
const missing = final.filter(item => !byId.has(item.id)).map(item => item.id);
if (missing.length) throw new Error(`Products missing from catalogue: ${missing.join(', ')}`);
const omittedExisting = current.filter(product => !desiredIds.has(product.id)).map(product => product.id);
if (omittedExisting.length) throw new Error(`Existing products omitted from supplied list mapping: ${omittedExisting.join(', ')}`);

const updated = final.map(entry => {
  const product = { ...byId.get(entry.id) };
  product.status = entry.status || (entry.out ? 'out' : 'available');
  product.sizes = {};
  product.prices = {};
  for (const [size, price] of Object.entries(entry.prices)) {
    if (size === '30ml') throw new Error(`30 ML must remain excluded: ${entry.id}`);
    const available = product.status === 'available' && !entry.unavailable.includes(size);
    const premium = size === '6ml' ? entry.premium6 : false;
    product.sizes[size] = { price, available, premium };
    product.prices[size.replace('ml', ' ML')] = price;
  }
  return product;
});

fs.writeFileSync(cataloguePath, `${JSON.stringify(updated, null, 2)}\n`);
console.log(`Applied August 2026 price list to ${updated.length} products. Available: ${updated.filter(p => p.status === 'available').length}; out: ${updated.filter(p => p.status === 'out').length}.`);
