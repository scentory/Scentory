#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cataloguePath = path.join(root, 'perfumes.json');
const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));

const verified = {
  'afnan-9-pm-edp': {
    tags: ['Sweet', 'Warm Spicy', 'Date Night', 'Winter'],
    recommendation: 'A sweet, warm-spicy evening scent best suited to dates, parties and cooler or air-conditioned settings.',
    character: ['sweet', 'fruity', 'spicy', 'amber', 'aromatic'], occasions: ['date', 'party'], climates: ['winter', 'ac'],
    scores: { strength: 4, projection: 4, longevity: 4, sweetness: 5, freshness: 2, warmth: 5, officeSafety: 2, heatSafety: 1, versatility: 3 },
    notes: { top: ['Bergamot', 'Lavandin', 'Cinnamon', 'Apple'], heart: ['Muguet', 'Orange Blossom'], base: ['Patchouli', 'Amber', 'Vanilla', 'Tonka Bean'] },
    performance: 'Strong presence; longevity varies by skin, weather and batch.',
    sources: [{ title: 'Afnan 9 PM official product page', url: 'https://afnan.com/products/9-pm', type: 'brand' }]
  },
  'afnan-9-pm-night-out-edp': {
    tags: ['Fruity', 'Woody', 'Party', 'Strong'],
    recommendation: 'A bold fruity, spicy and woody night scent for parties, dates and confident evening wear.',
    character: ['fruity', 'sweet', 'spicy', 'woody', 'amber', 'leather'], occasions: ['date', 'party', 'formal'], climates: ['winter', 'ac', 'outdoor'],
    scores: { strength: 5, projection: 5, longevity: 5, sweetness: 4, freshness: 3, warmth: 4, officeSafety: 1, heatSafety: 1, versatility: 2 },
    notes: { top: ['Dragon Fruit', 'Bergamot', 'Cognac', 'Lavender', 'Apple'], heart: ['Cardamom', 'Mahonial', 'Suede', 'Toffee', 'Cedar'], base: ['Tonka Bean', 'Akigalawood', 'Ambrofix', 'Patchouli'] },
    performance: 'High-impact night profile; begin with fewer sprays indoors.',
    sources: [{ title: 'Afnan 9 PM Night Out official product page', url: 'https://afnan.com/products/9pm-night-out', type: 'brand' }]
  },
  'afnan-9-pm-rebel-edp': {
    tags: ['Fruity', 'Woody', 'Sweet', 'Versatile'],
    recommendation: 'A fruity, woody and ambery scent that can move from daytime casual wear to dates and nights out.',
    character: ['fruity', 'fresh', 'sweet', 'woody', 'amber', 'musky'], occasions: ['daily', 'date', 'party'], climates: ['monsoon', 'winter', 'ac'],
    scores: { strength: 4, projection: 4, longevity: 4, sweetness: 4, freshness: 3, warmth: 4, officeSafety: 3, heatSafety: 2, versatility: 4 },
    notes: { top: ['Mandarin', 'Pineapple', 'Granny Smith Apple'], heart: ['Cedarwood', 'Oakmoss', 'Vanilla'], base: ['Caramel', 'Dry Woods', 'Ambergris', 'Musk'] },
    performance: 'Noticeable presence with a sweet woody dry-down; moderate application is safest indoors.',
    sources: [{ title: 'Afnan 9 PM Rebel official product page', url: 'https://afnan.com/products/9-pm-rebel', type: 'brand' }]
  },
  'supremacy-not-only-intense-edp': {
    tags: ['Fruity', 'Woody', 'Aromatic', 'Strong'],
    recommendation: 'A powerful fruity, mossy and woody signature for smart casual wear, events and outdoor occasions.',
    character: ['fresh', 'fruity', 'aromatic', 'woody', 'amber', 'musky'], occasions: ['daily', 'office', 'party', 'formal'], climates: ['monsoon', 'ac', 'outdoor'],
    scores: { strength: 5, projection: 5, longevity: 5, sweetness: 3, freshness: 4, warmth: 3, officeSafety: 2, heatSafety: 3, versatility: 4 },
    notes: { top: ['Bergamot', 'Apple', 'Blackcurrant'], heart: ['Lavender', 'Patchouli', 'Oakmoss'], base: ['Saffron', 'Musk', 'Ambergris'] },
    performance: 'Powerful profile; use fewer sprays for offices and enclosed rooms.',
    sources: [{ title: 'Afnan Supremacy Not Only Intense official product page', url: 'https://afnan.com/products/supremacy-not-only-intense', type: 'brand' }]
  },
  'lattafa-khamrah-qahwa-edp': {
    tags: ['Gourmand', 'Coffee', 'Warm Spicy', 'Winter'],
    recommendation: 'A rich coffee, spice and vanilla gourmand for cool evenings, dates and festive occasions.',
    character: ['sweet', 'gourmand', 'spicy', 'amber', 'musky'], occasions: ['date', 'party', 'formal'], climates: ['winter', 'ac'],
    scores: { strength: 4, projection: 4, longevity: 5, sweetness: 5, freshness: 1, warmth: 5, officeSafety: 1, heatSafety: 1, versatility: 2 },
    notes: { top: ['Ginger', 'Cinnamon', 'Cardamom'], heart: ['Praline', 'Candied Fruits', 'White Flowers'], base: ['Coffee Arabica', 'Tonka Bean', 'Musk', 'Benzoin', 'Vanilla'] },
    performance: 'Rich and persistent; best tested lightly before wearing in enclosed spaces.',
    sources: [{ title: 'Lattafa Khamrah Qahwa official product page', url: 'https://lattafa.com/product/khamrah-qahwa/', type: 'brand' }]
  },
  'lattafa-yara-edp': {
    tags: ['Sweet', 'Fruity', 'Powdery', 'Daily Wear'],
    recommendation: 'A soft sweet, tropical and powdery fragrance for casual wear, relaxed dates and air-conditioned settings.',
    character: ['sweet', 'fruity', 'gourmand', 'powdery', 'musky'], occasions: ['daily', 'date'], climates: ['monsoon', 'ac'],
    scores: { strength: 3, projection: 3, longevity: 3, sweetness: 5, freshness: 2, warmth: 3, officeSafety: 3, heatSafety: 2, versatility: 3 },
    notes: { top: ['Tangerine', 'Heliotrope', 'Orchid'], heart: ['Tropical Notes', 'Gourmand Accord'], base: ['Vanilla', 'Sandalwood', 'Musk'] },
    performance: 'Soft-to-moderate presence; performance varies considerably by wearer.',
    sources: [{ title: 'Lattafa Yara official product page', url: 'https://lattafa.com/product/yara/', type: 'brand' }]
  },
  'lattafa-asad-edp': {
    tags: ['Warm Spicy', 'Amber', 'Woody', 'Evening'],
    recommendation: 'A warm spicy, amber and woody fragrance for cooler evenings, formal occasions and confident night wear.',
    character: ['spicy', 'amber', 'woody', 'sweet', 'smoky'], occasions: ['date', 'party', 'formal'], climates: ['winter', 'ac'],
    scores: { strength: 4, projection: 4, longevity: 4, sweetness: 3, freshness: 1, warmth: 5, officeSafety: 2, heatSafety: 1, versatility: 3 },
    notes: { top: ['Black Pepper', 'Pineapple', 'Tobacco'], heart: ['Coffee', 'Iris', 'Patchouli'], base: ['Amber', 'Vanilla', 'Dry Woods', 'Benzoin', 'Labdanum'] },
    performance: 'Strong warm profile; conservative spraying is recommended indoors.',
    sources: [{ title: 'Lattafa Asad official product page', url: 'https://lattafa.com/product/asad/', type: 'brand' }]
  },
  'bade-e-al-oud-oud-for-glory': {
    tags: ['Oud', 'Woody', 'Warm Spicy', 'Formal'],
    recommendation: 'A dense oud, patchouli and spice profile for cool evenings, formal events and experienced oud wearers.',
    character: ['oud', 'woody', 'spicy', 'smoky', 'musky'], occasions: ['date', 'party', 'formal'], climates: ['winter', 'ac'],
    scores: { strength: 5, projection: 5, longevity: 5, sweetness: 2, freshness: 1, warmth: 5, officeSafety: 1, heatSafety: 1, versatility: 2 },
    notes: { top: ['Saffron', 'Nutmeg', 'Lavender'], heart: ['Oud', 'Patchouli'], base: ['Oud', 'Patchouli', 'Musk'] },
    performance: 'Dense and powerful; sample first and apply lightly indoors.',
    sources: [{ title: 'Lattafa Oud for Glory official product page', url: 'https://lattafa.com/product/badee-al-oud-oud-for-glory/', type: 'brand' }]
  },
  'liquid-brun-by-french-avenue-edp': {
    tags: ['Amber', 'Vanilla', 'Gourmand', 'Strong'],
    recommendation: 'A strong amber-vanilla gourmand for dates, dinners and cool-weather evening wear.',
    character: ['sweet', 'gourmand', 'amber', 'spicy', 'woody'], occasions: ['date', 'party', 'formal'], climates: ['winter', 'ac'],
    scores: { strength: 5, projection: 4, longevity: 5, sweetness: 5, freshness: 1, warmth: 5, officeSafety: 1, heatSafety: 1, versatility: 2 },
    notes: { top: ['Cinnamon', 'Bergamot', 'Cardamom', 'Orange Blossom'], heart: ['Bourbon Vanilla', 'Elemi'], base: ['Musk', 'Praline', 'Ambroxan', 'Guaiac Wood'] },
    performance: 'Officially described as strong; reduce sprays in warm weather or enclosed rooms.',
    sources: [{ title: 'French Avenue Liquid Brun official product page', url: 'https://frenchavenue.com/products/liquid-brun', type: 'brand' }]
  },
  'kaaf-by-ahmed-edp': {
    tags: ['Fresh', 'Aquatic', 'Musky', 'Summer'],
    recommendation: 'A clean fruity-aquatic and musky scent for hot days, office, university and active casual wear.',
    character: ['fresh', 'aquatic', 'fruity', 'aromatic', 'musky'], occasions: ['daily', 'office', 'active'], climates: ['hot', 'monsoon', 'ac', 'outdoor'],
    scores: { strength: 4, projection: 4, longevity: 4, sweetness: 3, freshness: 5, warmth: 1, officeSafety: 4, heatSafety: 5, versatility: 4 },
    notes: { top: ['Red Fruits', 'Watermelon', 'Lavender', 'Sicilian Orange'], heart: ['Sandalwood', 'Ambroxan', 'White Musk'], base: ['Lotus', 'Jasmine', 'Lily of the Valley', 'Sea Accord'] },
    performance: 'Noticeable fresh-musky trail; begin moderately in close office settings.',
    sources: [{ title: 'Ahmed Al Maghribi Kaaf official product page', url: 'https://admin.ahmedalmaghribi.com/shop/kaaf', type: 'brand' }]
  },
  'blue-by-ahmed-edp': {
    tags: ['Citrus', 'Aromatic', 'Woody', 'Fresh Spicy'],
    recommendation: 'A citrus, aromatic and woody-spicy scent for daily wear, office and polished casual settings.',
    character: ['fresh', 'citrus', 'aromatic', 'spicy', 'woody', 'smoky', 'musky'], occasions: ['daily', 'office', 'formal'], climates: ['monsoon', 'ac', 'outdoor'],
    scores: { strength: 4, projection: 4, longevity: 4, sweetness: 1, freshness: 4, warmth: 3, officeSafety: 3, heatSafety: 3, versatility: 4 },
    notes: { top: ['Grapefruit', 'Pink Pepper', 'Mint', 'Lemon'], heart: ['Ginger', 'Nutmeg', 'Jasmine', 'Iso E Super'], base: ['Incense', 'Vetiver', 'Cedar', 'Sandalwood', 'Patchouli', 'Labdanum', 'White Musk'] },
    performance: 'Long-lasting style with smoky woods; apply moderately for office use.',
    sources: [{ title: 'Ahmed Al Maghribi Blue official product page', url: 'https://ksa.ahmedalmaghribi.com/en/shop/online-exclusive/extrait-de-parfum/blue-by-ahmed', type: 'brand' }]
  },
  'marwa-arabian-prestige-edp': {
    tags: ['Citrus', 'Aromatic', 'Woody', 'Smoky'],
    recommendation: 'A refined citrus, tea, incense and woody scent for signature wear, office and smart-casual occasions.',
    character: ['fresh', 'citrus', 'aromatic', 'spicy', 'woody', 'smoky', 'musky'], occasions: ['daily', 'office', 'formal'], climates: ['monsoon', 'ac', 'outdoor'],
    scores: { strength: 4, projection: 4, longevity: 4, sweetness: 1, freshness: 4, warmth: 3, officeSafety: 4, heatSafety: 3, versatility: 5 },
    notes: { top: ['Bergamot', 'Petitgrain', 'Ginger'], heart: ['Geranium', 'Tea', 'Incense'], base: ['Guaiac Wood', 'Ambroxan', 'Musk'] },
    performance: 'Moderate-to-strong presence; generally versatile with controlled spraying.',
    sources: [{ title: 'Arabiyat Prestige Marwa official product page', url: 'https://arabiyatprestige.com/products/arabiyat-prestige-marwa-edp-100ml-unisex', type: 'brand' }]
  },
  'oud-al-layl-midnight-edp': {
    tags: ['Aquatic', 'Fresh', 'Citrus', 'Strong'],
    recommendation: 'A fresh marine-citrus, sweet-woody scent for hot-weather casual wear, active use and energetic evenings—not a dense traditional oud profile.',
    character: ['fresh', 'aquatic', 'citrus', 'aromatic', 'sweet', 'woody', 'musky'], occasions: ['daily', 'active', 'party'], climates: ['hot', 'monsoon', 'outdoor'],
    scores: { strength: 4, projection: 4, longevity: 4, sweetness: 3, freshness: 5, warmth: 2, officeSafety: 2, heatSafety: 4, versatility: 4 },
    notes: { top: ['Marine Accord', 'Grapefruit', 'Mandarin'], heart: ['Violet', 'Cedarwood', 'Sugar'], base: ['Patchouli', 'Musk', 'Moss'] },
    performance: 'Reported as strong for a fresh profile; start moderately, especially at the gym or indoors.',
    sourceNote: 'Retailer note pyramids differ at the heart; this uses the overlapping and most consistently repeated listing.',
    sources: [
      { title: 'Belvish Oud Al Layl Midnight product page', url: 'https://belvish.com/products/arabiyat-oud-al-layl-midnight-edition-edp-for-men', type: 'specialist-retailer' },
      { title: 'FragsTalk Oud Al Layl Midnight product page', url: 'https://fragstalk.in/products/arabiyat-oud-al-layl-midnight-100ml-edp', type: 'specialist-retailer' },
      { title: 'MOKS Oud Al Layl Midnight product page', url: 'https://moksperfumes.co.za/product/arabiyat-oud-al-layl-midnight-edition-intense-edp-100ml/', type: 'specialist-retailer' }
    ],
    topPickEligible: false
  }
};

for (const product of catalogue) {
  const update = verified[product.id];
  if (!update) {
    product.details = {
      verification: 'needs-source-review',
      performance: 'Performance guidance is under source review; skin, weather and atomizer can change results.',
      sources: []
    };
    continue;
  }
  product.tags = update.tags;
  product.recommendation = update.recommendation;
  product.profile = {
    schemaVersion: 2,
    character: update.character,
    occasions: update.occasions,
    climates: update.climates,
    ...update.scores,
    evidence: 'web-verified',
    reviewedAt: '2026-08-26',
    topPickEligible: update.topPickEligible !== false
  };
  product.details = {
    verification: 'source-checked',
    notes: update.notes,
    performance: update.performance,
    sourceNote: update.sourceNote || '',
    sources: update.sources
  };
}

fs.writeFileSync(cataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`);
console.log(`Applied ${Object.keys(verified).length} web-verified profiles; ${catalogue.length - Object.keys(verified).length} records remain visibly flagged for source review.`);
