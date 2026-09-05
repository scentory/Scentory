#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const output = path.join(root, 'perfume');
const products = JSON.parse(fs.readFileSync(path.join(root, 'perfumes.json'), 'utf8'));
fs.mkdirSync(output, { recursive: true });

const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const absolute = file => `https://scentoryfragrance.com/${String(file).replace(/^\//, '')}`;
const sizeLabel = size => size.replace('ml', ' ML');
const titleCase = value => String(value || '').replace(/\b\w/g, letter => letter.toUpperCase());
const occasionLabels = { daily: 'Daily wear', office: 'Office / university', active: 'Gym / active use', date: 'Date night', party: 'Party / social event', formal: 'Formal occasion' };
const climateLabels = { hot: 'Hot weather', monsoon: 'Monsoon / humid weather', winter: 'Cool weather', ac: 'Air-conditioned indoor setting', outdoor: 'Outdoor wear' };
const longevityLabels = ['', 'Light', 'Moderate', 'Moderate to long', 'Long-lasting', 'Very long-lasting'];

for (const product of products) {
  const available = product.status !== 'out' && product.status !== 'upcoming';
  const offers = Object.entries(product.sizes || {}).filter(([, item]) => Number.isFinite(Number(item.price))).map(([size, item]) => ({
    '@type': 'Offer',
    name: `${product.name} — ${sizeLabel(size)}`,
    price: Number(item.price),
    priceCurrency: 'BDT',
    availability: available && item.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    url: absolute(`perfume/${product.id}.html`)
  }));
  const description = product.recommendation || `${product.name} perfume decants from Scentory Bangladesh.`;
  const profile = product.profile || {};
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product', '@id': `${absolute(`perfume/${product.id}.html`)}#product`,
        name: product.name, image: absolute(product.image), description,
        category: 'Perfume decant', sku: product.id, offers
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Scentory', item: absolute('') },
          { '@type': 'ListItem', position: 2, name: 'Perfume Collection', item: absolute('#collection') },
          { '@type': 'ListItem', position: 3, name: product.name }
        ]
      }
    ]
  };
  const priceRows = Object.entries(product.sizes || {}).map(([size, item]) => {
    const canBuy = available && item.available && Number.isFinite(Number(item.price));
    return `<li><b>${esc(sizeLabel(size))}${item.premium ? ' Premium' : ''}</b><span>${Number.isFinite(Number(item.price)) ? `৳${Number(item.price).toLocaleString('en-BD')}` : 'N/A'} · ${canBuy ? 'Available' : 'Out of stock'}</span></li>`;
  }).join('');
  const chips = [...(profile.character || []), ...(profile.occasions || [])].slice(0, 8).map(value => `<span>${esc(value.replace(/\b\w/g, letter => letter.toUpperCase()))}</span>`).join('');
  const details = product.details || {};
  const sourceChecked = details.verification === 'source-checked';
  const scentorySupplied = details.verification === 'scentory-supplied';
  const hasDetailedProfile = sourceChecked || scentorySupplied;
  const notes = details.notes || {};
  const factRow = (label, values) => Array.isArray(values) && values.length ? `<div><dt>${esc(label)}</dt><dd>${values.map(esc).join(' · ')}</dd></div>` : '';
  const intelligence = hasDetailedProfile ? `<section class="intel" aria-label="${sourceChecked ? 'Source-checked perfume profile' : 'Scentory supplied perfume profile'}"><span class="verified">${sourceChecked ? 'Source-checked profile' : 'Scentory supplied profile'}</span><h2>Perfume profile</h2><dl>${factRow('Scent character', (profile.character || []).map(titleCase))}${factRow('Notes', notes.listed)}${factRow('Opening notes', notes.top)}${factRow('Heart notes', notes.heart)}${factRow('Base notes', notes.base)}${factRow('Expected longevity', [`${longevityLabels[Number(profile.longevity || 0)] || 'Varies by wearer'}. ${details.performance || 'Skin, weather, batch and atomizer can change real-world performance.'}`])}${factRow('Best places to wear', (profile.occasions || []).map(value => occasionLabels[value] || titleCase(value)))}${factRow('Best conditions', (profile.climates || []).map(value => climateLabels[value] || titleCase(value)))}${details.comparison ? factRow('Compared with', [details.comparison]) : ''}</dl>${details.sourceNote ? `<p>${esc(details.sourceNote)}</p>` : ''}<p>Performance is guidance, not a guarantee. Skin chemistry, heat, humidity and spray count can change the result.</p></section>` : `<section class="intel pending"><span class="reviewing">Profile review in progress</span><h2>Detailed profile</h2><p>Scentory is rechecking the exact note pyramid and performance sources for this perfume. Until that review is complete, detailed note claims are intentionally not shown. Please sample 5 ML first.</p></section>`;
  let html = `<!doctype html>
<html lang="en-BD"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(product.name)} Decant Price in Bangladesh | Scentory</title>
<meta name="description" content="${esc(`${description} View current ${product.name} decant sizes and prices in Bangladesh.`)}">
<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${absolute(`perfume/${product.id}.html`)}">
<meta property="og:type" content="product"><meta property="og:title" content="${esc(product.name)} Decant | Scentory"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${absolute(product.image)}"><meta property="og:url" content="${absolute(`perfume/${product.id}.html`)}">
<link rel="icon" href="../favicon.svg" type="image/svg+xml"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<style>*{box-sizing:border-box}body{margin:0;background:#050505;color:#f5f5f5;font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}a{color:inherit}.top{padding:18px;max-width:1040px;margin:auto}.top img{width:190px;max-height:52px;object-fit:contain}.wrap{max-width:1040px;margin:auto;padding:26px 18px 60px;display:grid;grid-template-columns:minmax(260px,420px) 1fr;gap:34px}.photo{background:#111;border:1px solid #292929;border-radius:24px;padding:18px;align-self:start}.photo img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:16px}h1{font-size:clamp(1.9rem,5vw,3.4rem);line-height:1.03;margin:10px 0 16px}.status,.verified,.reviewing{display:inline-block;padding:7px 11px;border:1px solid #444;border-radius:99px;color:#ddd}.verified{border-color:#386b4c;color:#9cffc5}.reviewing{border-color:#6b5838;color:#ffd58b}.chips{display:flex;flex-wrap:wrap;gap:7px;margin:18px 0}.chips span{padding:6px 9px;background:#171717;border:1px solid #333;border-radius:99px;font-size:.78rem}.intel{margin:22px 0;padding:17px;border:1px solid #284d36;border-radius:18px;background:#0a110d}.intel.pending{border-color:#4d4128;background:#100e09}.intel h2{margin:12px 0}.intel dl{display:grid;gap:10px;margin:0}.intel dl div{display:grid;grid-template-columns:145px 1fr;gap:12px;padding-top:9px;border-top:1px solid #252525}.intel dt{font-weight:750}.intel dd{margin:0;color:#bbb}.intel p{color:#aaa;font-size:.88rem}.prices{padding:0;list-style:none;border-top:1px solid #292929}.prices li{display:flex;justify-content:space-between;gap:20px;padding:12px 0;border-bottom:1px solid #292929}.cta{display:inline-flex;margin-top:22px;padding:12px 18px;background:#eee;color:#050505;border-radius:99px;text-decoration:none;font-weight:750}.small{color:#aaa;font-size:.88rem;margin-top:22px}@media(max-width:720px){.wrap{grid-template-columns:1fr}.photo{max-width:480px}.prices li{align-items:start;flex-direction:column;gap:2px}.intel dl div{grid-template-columns:1fr;gap:3px}}</style></head>
<body><header class="top"><a href="../"><img src="../logo-horizontal-white.png" alt="Scentory"></a></header><main class="wrap"><div class="photo"><img src="../${esc(product.image)}" alt="${esc(product.name)} perfume decant" width="800" height="800" fetchpriority="high"></div><article><span class="status">${available ? 'Available at Scentory' : product.status === 'upcoming' ? 'Upcoming' : 'Currently out of stock'}</span><h1>${esc(product.name)} Decant</h1><p>${esc(description)}</p><div class="chips">${chips}</div>${intelligence}<h2>Available sizes and prices</h2><ul class="prices">${priceRows}</ul><a class="cta" href="../#perfume-${encodeURIComponent(product.id)}">View in Scentory collection</a><p class="small">Prices are in BDT and may change. Scentory prepares decants from original full-size perfume bottles and is not affiliated with the perfume brand shown.</p></article></main></body></html>`;
  if (product.image.endsWith('-poster-v3059.jpg')) {
    html = html.replace('aspect-ratio:1/1;object-fit:cover', 'aspect-ratio:auto;object-fit:contain');
    html = html.replace('width="800" height="800" fetchpriority', 'width="1214" height="1536" fetchpriority');
  }
  fs.writeFileSync(path.join(output, `${product.id}.html`), html);
}

const sitemapUrls = [
  '  <url><loc>https://scentoryfragrance.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>',
  ...products.map(product => `  <url><loc>${absolute(`perfume/${product.id}.html`)}</loc><lastmod>2026-09-05</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
];
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`);
console.log(`Generated ${products.length} lightweight product pages and sitemap.xml.`);
