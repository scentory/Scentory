(() => {
  'use strict';

  const toolNames = {
    find: 'Find My Scent',
    weather: 'Scentory Weather Match',
    box: 'Build My Decant Box',
    similar: 'Similar Scents',
    passport: 'Scent Passport',
    cost: 'Cost Per Wear'
  };
  const weatherNames = {
    hot: 'Hot & Humid',
    monsoon: 'Monsoon & Rain',
    winter: 'Cool Winter',
    ac: 'AC Office',
    outdoor: 'Outdoor Day'
  };
  const occasionNames = {
    daily: 'Daily Wear',
    office: 'Office / University',
    date: 'Date Night',
    party: 'Party',
    gym: 'Gym / Active',
    formal: 'Formal Event'
  };
  const occasionTraits = {
    daily: ['daily wear', 'versatile', 'fresh', 'summer'],
    office: ['office', 'formal', 'fresh', 'versatile'],
    date: ['date night', 'sweet', 'winter', 'bold'],
    party: ['party', 'beast mode', 'bold', 'sweet'],
    gym: ['gym', 'fresh', 'aquatic', 'summer'],
    formal: ['formal', 'office', 'elegant', 'woody']
  };
  const weatherProfiles = {
    hot: {
      preferred: ['fresh', 'aquatic', 'summer', 'gym', 'blue', 'citrus'],
      avoid: ['winter', 'oud', 'tobacco', 'heavy']
    },
    monsoon: {
      preferred: ['fresh', 'aquatic', 'woody', 'versatile', 'office', 'green'],
      avoid: ['heavy', 'tobacco']
    },
    winter: {
      preferred: ['sweet', 'winter', 'date night', 'oud', 'spicy', 'bold', 'amber'],
      avoid: ['gym']
    },
    ac: {
      preferred: ['office', 'formal', 'versatile', 'daily wear', 'fresh', 'elegant'],
      avoid: ['beast mode', 'heavy']
    },
    outdoor: {
      preferred: ['fresh', 'summer', 'aquatic', 'beast mode', 'bold', 'citrus'],
      avoid: ['powdery']
    }
  };
  const boxProfiles = {
    balanced: ['fresh', 'office', 'date night', 'sweet', 'aquatic', 'versatile'],
    fresh: ['fresh', 'aquatic', 'summer', 'gym', 'blue'],
    office: ['office', 'formal', 'daily wear', 'versatile', 'fresh'],
    evening: ['date night', 'party', 'winter', 'sweet', 'bold', 'oud']
  };
  let lastBuiltBox = [];
  let lastFocusedElement = null;

  const modal = document.getElementById('discoveryModal');
  const modalContent = document.getElementById('discoveryModalContent');
  const modalClose = document.getElementById('discoveryModalClose');

  function esc(value) {
    if (typeof escapeHtml === 'function') return escapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function money(value) {
    return `৳${Number(value || 0).toLocaleString('en-BD')}`;
  }

  function getCatalogue() {
    return Array.isArray(perfumes) ? perfumes : [];
  }

  function getAvailablePerfumes() {
    return getCatalogue().filter(product => productHasAvailableSize(product) && !isUpcoming(product));
  }

  function getTraits(product) {
    const traits = new Set((product.tags || []).map(tag => String(tag).toLowerCase()));
    const text = `${product.name || ''} ${product.id || ''} ${product.recommendation || ''} ${(product.tags || []).join(' ')}`.toLowerCase();
    const patterns = [
      ['fresh', /fresh|cool|ice|chill|aqua|aquatic|blue|azul|pacific|aloha|voyage|chrome|after swim|daring|zenith|fattan/],
      ['aquatic', /aqua|aquatic|ocean|marine|sea|voyage|cool water|pacific|aloha|after swim|blue/],
      ['citrus', /citrus|lemon|bergamot|orange|fresh|italia/],
      ['sweet', /sweet|yara|khamrah|qahwa|bourbon|9pm|honor|glory|mango|tropical|vanilla/],
      ['woody', /wood|woody|oud|cedrus|terra|fattan|bois|leather|ambre/],
      ['oud', /oud|layl|shuhrah|glory|pharaoh/],
      ['spicy', /spicy|spice|qahwa|bourbon|kobra|elixir|teriaq|asad/],
      ['amber', /amber|ambre|gold|bourbon|khamrah|asad/],
      ['green', /green|zeleny|fattan|jungle|terra/],
      ['bold', /beast|intense|elixir|black|overdose|fire|tiger|lion|wolf|vulcan|wanted|stronger/],
      ['heavy', /oud|tobacco|leather|khamrah|qahwa|beast|intense|overdose/],
      ['elegant', /elegant|formal|collector|precieux|plato|gold|majestic/],
      ['versatile', /versatile|daily|office|modest|fakhar|voyage|cool water|kaaf|blue/]
    ];
    patterns.forEach(([trait, pattern]) => { if (pattern.test(text)) traits.add(trait); });
    if (traits.has('office') || traits.has('daily wear') || traits.has('daily use')) traits.add('versatile');
    if (traits.has('beast mode')) traits.add('bold');
    if (traits.has('summer')) traits.add('fresh');
    if (traits.has('winter')) traits.add('heavy');
    return traits;
  }

  function traitLabel(value) {
    return String(value || '').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function availableSize(product, preferredSize = '') {
    const entries = Object.entries(product.sizes || {}).filter(([, item]) =>
      item && item.available && item.price !== null && product.status !== 'out' && product.status !== 'upcoming'
    );
    if (!entries.length) return null;
    const preferred = entries.find(([size]) => size === preferredSize);
    const [size, item] = preferred || entries[0];
    return { size, item };
  }

  function firstPricedSize(product) {
    const entry = Object.entries(product.sizes || {}).find(([, item]) => item && item.price !== null);
    return entry ? { size: entry[0], item: entry[1] } : null;
  }

  function productOptions(selectedId = '', includeUnavailable = false) {
    const list = includeUnavailable ? getCatalogue() : getAvailablePerfumes();
    return list.map(product =>
      `<option value="${esc(product.id)}" ${product.id === selectedId ? 'selected' : ''}>${esc(product.name)}</option>`
    ).join('');
  }

  function defaultWeather() {
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 10) return 'monsoon';
    if (month === 11 || month === 12 || month <= 2) return 'winter';
    return 'hot';
  }

  function weatherScore(product, weather) {
    const traits = getTraits(product);
    const profile = weatherProfiles[weather] || weatherProfiles.hot;
    let score = 52;
    profile.preferred.forEach(trait => { if (traits.has(trait)) score += 8; });
    profile.avoid.forEach(trait => { if (traits.has(trait)) score -= 6; });
    if (traits.has('versatile')) score += 3;
    return Math.max(35, Math.min(96, score));
  }

  function sharedTraits(a, b) {
    const first = getTraits(a);
    const second = getTraits(b);
    return [...first].filter(trait => second.has(trait));
  }

  function renderToolShell(key, lead, body) {
    return `
      <section class="discovery-tool-shell" data-tool="${esc(key)}">
        <span class="discovery-tool-kicker">Scentory Original Tool</span>
        <h2>${esc(toolNames[key])}</h2>
        <p class="discovery-tool-lead">${esc(lead)}</p>
        ${body}
      </section>
    `;
  }

  function renderResultCard(product, options = {}) {
    const chosen = options.size ? { size: options.size, item: product.sizes[options.size] } : availableSize(product);
    const priceText = chosen && chosen.item ? `${displayMl(chosen.size)} · ${money(chosen.item.price)}` : 'View sizes';
    const profile = getScentProfile(product);
    const reason = options.reason || profile.recommendation;
    return `
      <article class="discovery-result-card">
        <img src="${esc(imagePath(product))}" alt="${esc(product.name)}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'">
        <div class="discovery-result-copy">
          ${options.badge ? `<span class="discovery-score">${esc(options.badge)}</span>` : ''}
          <h4>${esc(product.name)}</h4>
          <p>${esc(reason)}</p>
          <span class="discovery-result-price">${esc(priceText)}</span>
          <div class="discovery-result-actions">
            <button type="button" class="discovery-mini-action" onclick="openDiscoveryProduct('${esc(product.id)}')">View details</button>
            ${chosen && chosen.item && chosen.item.available ? `<button type="button" class="discovery-mini-action primary" onclick="addDiscoveryItem('${esc(product.id)}','${esc(chosen.size)}')">Add ${esc(displayMl(chosen.size))}</button>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function renderFindTool() {
    const weather = defaultWeather();
    return renderToolShell('find',
      'Tell us when, how and where you want to wear it. We will match available Scentory decants within your selected budget.',
      `
        <form class="discovery-form" onsubmit="runFindMyScent(event)">
          <div class="discovery-field"><label for="findOccasion">Where will you wear it?</label>
            <select id="findOccasion">
              <option value="daily">Daily wear</option><option value="office">Office / university</option>
              <option value="date">Date night</option><option value="party">Party</option>
              <option value="gym">Gym / active</option><option value="formal">Formal event</option>
            </select>
          </div>
          <div class="discovery-field"><label for="findMood">Which character attracts you?</label>
            <select id="findMood">
              <option value="fresh">Fresh & clean</option><option value="sweet">Sweet & inviting</option>
              <option value="aquatic">Aquatic & airy</option><option value="bold">Bold & powerful</option>
              <option value="woody">Woody & refined</option><option value="versatile">Versatile & easy</option>
            </select>
          </div>
          <div class="discovery-field"><label for="findWeather">Weather or environment</label>
            <select id="findWeather">
              ${Object.entries(weatherNames).map(([key, label]) => `<option value="${key}" ${key === weather ? 'selected' : ''}>${label}</option>`).join('')}
            </select>
          </div>
          <div class="discovery-field"><label for="findSize">Preferred decant size</label>
            <select id="findSize"><option value="5ml">5 ML</option><option value="6ml">6 ML Premium</option><option value="10ml">10 ML</option><option value="15ml">15 ML</option></select>
          </div>
          <div class="discovery-field full"><label for="findBudget">Maximum perfume budget</label>
            <select id="findBudget"><option value="300">Up to ৳300</option><option value="500" selected>Up to ৳500</option><option value="800">Up to ৳800</option><option value="1200">Up to ৳1,200</option><option value="2000">Up to ৳2,000</option></select>
          </div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Show My Matches</button></div>
        </form>
        <div id="findResults" class="discovery-results"></div>
      `
    );
  }

  function runFindMyScent(event) {
    event?.preventDefault();
    const occasion = document.getElementById('findOccasion')?.value || 'daily';
    const mood = document.getElementById('findMood')?.value || 'fresh';
    const weather = document.getElementById('findWeather')?.value || 'hot';
    const size = document.getElementById('findSize')?.value || '5ml';
    const budget = Number(document.getElementById('findBudget')?.value || 500);
    const resultsBox = document.getElementById('findResults');
    if (!resultsBox) return;

    const matches = getAvailablePerfumes().map(product => {
      const selected = availableSize(product, size);
      if (!selected || selected.size !== size || selected.item.price > budget) return null;
      const traits = getTraits(product);
      const occasionHit = occasionTraits[occasion].some(trait => traits.has(trait));
      let score = occasionHit ? 32 : (traits.has('versatile') ? 12 : 4);
      score += traits.has(mood) ? 28 : 4;
      score += Math.round(weatherScore(product, weather) * .25);
      score += 15;
      return { product, score: Math.min(100, score), selected };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.selected.item.price - b.selected.item.price).slice(0, 3);

    if (!matches.length) {
      resultsBox.innerHTML = '<div class="discovery-empty">No available perfume matches that exact size and budget. Try a smaller size or increase the budget.</div>';
      return;
    }
    resultsBox.innerHTML = `
      <div class="discovery-results-head"><h3>Your strongest matches</h3><span>Live stock and prices</span></div>
      <div class="discovery-result-grid">
        ${matches.map(({ product, score, selected }) => renderResultCard(product, {
          size: selected.size,
          badge: `${score}% match`,
          reason: `Made for ${occasionNames[occasion].toLowerCase()} with a ${traitLabel(mood)} character in ${weatherNames[weather].toLowerCase()} conditions.`
        })).join('')}
      </div>
      <p class="discovery-disclaimer">Match percentages are Scentory guidance based on catalogue tags, recommendation profiles, stock, selected size and budget.</p>
    `;
  }

  function renderWeatherTool() {
    const weather = defaultWeather();
    return renderToolShell('weather',
      'Choose a Bangladesh weather situation and the strength you prefer. Scentory will rank suitable available fragrances.',
      `
        <form class="discovery-form" onsubmit="runWeatherMatch(event)">
          <div class="discovery-field"><label for="weatherMode">Weather or environment</label>
            <select id="weatherMode">${Object.entries(weatherNames).map(([key, label]) => `<option value="${key}" ${key === weather ? 'selected' : ''}>${label}</option>`).join('')}</select>
          </div>
          <div class="discovery-field"><label for="weatherStrength">Preferred presence</label>
            <select id="weatherStrength"><option value="balanced">Balanced</option><option value="light">Light & fresh</option><option value="strong">Strong projection</option></select>
          </div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Find Weather Matches</button></div>
        </form>
        <div id="weatherResults" class="discovery-results"></div>
      `
    );
  }

  function runWeatherMatch(event) {
    event?.preventDefault();
    const weather = document.getElementById('weatherMode')?.value || 'hot';
    const strength = document.getElementById('weatherStrength')?.value || 'balanced';
    const resultsBox = document.getElementById('weatherResults');
    if (!resultsBox) return;
    const matches = getAvailablePerfumes().map(product => {
      const traits = getTraits(product);
      let score = weatherScore(product, weather);
      if (strength === 'light' && (traits.has('fresh') || traits.has('aquatic'))) score += 8;
      if (strength === 'strong' && (traits.has('bold') || traits.has('beast mode'))) score += 8;
      if (strength === 'balanced' && traits.has('versatile')) score += 6;
      return { product, score: Math.min(99, score) };
    }).sort((a, b) => b.score - a.score).slice(0, 4);

    resultsBox.innerHTML = `
      <div class="discovery-results-head"><h3>Best for ${esc(weatherNames[weather])}</h3><span>Guidance score</span></div>
      <div class="discovery-result-grid">
        ${matches.map(({ product, score }) => {
          const traits = [...getTraits(product)].filter(trait => weatherProfiles[weather].preferred.includes(trait)).slice(0, 3);
          return renderResultCard(product, {
            badge: `${score}/100 weather fit`,
            reason: traits.length ? `Why it fits: ${traits.map(traitLabel).join(', ')}.` : 'A versatile available option for this setting.'
          });
        }).join('')}
      </div>
      <p class="discovery-disclaimer">Weather scores are shopping guidance, not laboratory performance claims. Longevity and projection vary by skin, temperature and spraying style.</p>
    `;
  }

  function renderBoxTool() {
    return renderToolShell('box',
      'Choose your budget, size, number of fragrances and box personality. The builder keeps the perfume subtotal within budget.',
      `
        <form class="discovery-form" onsubmit="runDecantBox(event)">
          <div class="discovery-field"><label for="boxBudget">Perfume budget</label>
            <select id="boxBudget"><option value="800">৳800</option><option value="1200" selected>৳1,200</option><option value="1600">৳1,600</option><option value="2200">৳2,200</option><option value="3000">৳3,000</option></select>
          </div>
          <div class="discovery-field"><label for="boxSize">One size for every decant</label>
            <select id="boxSize"><option value="5ml">5 ML</option><option value="6ml">6 ML Premium</option><option value="10ml">10 ML</option></select>
          </div>
          <div class="discovery-field"><label for="boxCount">Number of scents</label>
            <select id="boxCount"><option value="3">3 scents</option><option value="4" selected>4 scents</option><option value="5">5 scents</option></select>
          </div>
          <div class="discovery-field"><label for="boxStyle">Box personality</label>
            <select id="boxStyle"><option value="balanced">Balanced wardrobe</option><option value="fresh">Fresh collection</option><option value="office">Office-ready</option><option value="evening">Evening & date</option></select>
          </div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Build My Box</button></div>
        </form>
        <div id="boxResults" class="discovery-results"></div>
      `
    );
  }

  function selectBoxItems(budget, size, count, style) {
    const desired = boxProfiles[style] || boxProfiles.balanced;
    const pool = getAvailablePerfumes().map(product => {
      const chosen = availableSize(product, size);
      if (!chosen || chosen.size !== size || chosen.item.price > budget) return null;
      return { product, size, item: chosen.item, traits: getTraits(product) };
    }).filter(Boolean);
    const selected = [];
    let remaining = budget;
    while (selected.length < count) {
      const slotsAfter = count - selected.length - 1;
      const unused = pool.filter(candidate => !selected.some(item => item.product.id === candidate.product.id));
      const usedTraits = new Set(selected.flatMap(item => [...item.traits]));
      const feasible = unused.filter(candidate => {
        const others = unused.filter(item => item.product.id !== candidate.product.id).sort((a, b) => a.item.price - b.item.price);
        const reserve = others.slice(0, slotsAfter).reduce((sum, item) => sum + item.item.price, 0);
        return candidate.item.price + reserve <= remaining;
      });
      if (!feasible.length) break;
      feasible.forEach(candidate => {
        const styleHits = desired.filter(trait => candidate.traits.has(trait)).length;
        const newHits = desired.filter(trait => candidate.traits.has(trait) && !usedTraits.has(trait)).length;
        candidate.rank = styleHits * 12 + newHits * 9 + (candidate.traits.has('versatile') ? 3 : 0) - candidate.item.price / 1000;
      });
      feasible.sort((a, b) => b.rank - a.rank || a.item.price - b.item.price);
      const choice = feasible[0];
      selected.push(choice);
      remaining -= choice.item.price;
    }
    return selected;
  }

  function runDecantBox(event) {
    event?.preventDefault();
    const budget = Number(document.getElementById('boxBudget')?.value || 1200);
    const size = document.getElementById('boxSize')?.value || '5ml';
    const count = Number(document.getElementById('boxCount')?.value || 4);
    const style = document.getElementById('boxStyle')?.value || 'balanced';
    const resultsBox = document.getElementById('boxResults');
    if (!resultsBox) return;
    const items = selectBoxItems(budget, size, count, style);
    lastBuiltBox = items.map(item => ({ id: item.product.id, size: item.size }));
    if (!items.length) {
      resultsBox.innerHTML = '<div class="discovery-empty">That budget cannot build a box with the selected size. Try 5 ML or increase the budget.</div>';
      return;
    }
    const total = items.reduce((sum, item) => sum + item.item.price, 0);
    resultsBox.innerHTML = `
      <div class="discovery-box-summary">
        <div><strong>${items.length}-scent ${esc(traitLabel(style))} Box</strong><br><span>${esc(displayMl(size))} each · ৳${budget - total} budget remaining</span></div>
        <strong>${money(total)}</strong>
      </div>
      <div class="discovery-box-list">
        ${items.map(item => `
          <div class="discovery-box-item">
            <img src="${esc(imagePath(item.product))}" alt="" loading="lazy" decoding="async">
            <span><b>${esc(item.product.name)}</b><small>${esc([...item.traits].filter(trait => boxProfiles[style].includes(trait)).slice(0, 3).map(traitLabel).join(' · ') || 'Scentory selection')}</small></span>
            <strong>${money(item.item.price)}</strong>
          </div>
        `).join('')}
      </div>
      <div class="discovery-form-actions" style="margin-top:12px">
        <button type="button" class="discovery-action" onclick="addDiscoveryBox()">Add Entire Box to Order</button>
      </div>
      ${items.length < count ? '<p class="discovery-disclaimer">The selected budget could not fit the full requested count, so the builder created the closest available box.</p>' : ''}
    `;
  }

  function brandFamily(product) {
    const text = `${product.name} ${product.id}`.toLowerCase();
    const families = ['hawas', 'rayhaan', 'lattafa', 'afnan', 'club de nuit', 'brandy', 'khadlaj', 'shuhrah', 'supremacy', 'absolute', 'yusuf bhai'];
    return families.find(family => text.includes(family)) || '';
  }

  function renderSimilarTool(seedId = '') {
    const initial = getCatalogue().some(product => product.id === seedId) ? seedId : (getAvailablePerfumes()[0]?.id || '');
    return renderToolShell('similar',
      'Choose any Scentory fragrance. We compare its character, use cases and price range against currently available alternatives.',
      `
        <form class="discovery-form" onsubmit="runSimilarScents(event)">
          <div class="discovery-field full"><label for="similarProduct">Choose a fragrance</label>
            <select id="similarProduct" onchange="runSimilarScents()">${productOptions(initial, true)}</select>
          </div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Find Similar Scents</button></div>
        </form>
        <div id="similarResults" class="discovery-results"></div>
      `
    );
  }

  function runSimilarScents(event) {
    event?.preventDefault();
    const id = document.getElementById('similarProduct')?.value;
    const source = getCatalogue().find(product => product.id === id);
    const resultsBox = document.getElementById('similarResults');
    if (!source || !resultsBox) return;
    const sourceTraits = getTraits(source);
    const sourcePrice = firstPricedSize(source)?.item.price || 0;
    const family = brandFamily(source);
    const matches = getAvailablePerfumes().filter(product => product.id !== source.id).map(product => {
      const traits = getTraits(product);
      const shared = [...sourceTraits].filter(trait => traits.has(trait));
      const union = new Set([...sourceTraits, ...traits]);
      const jaccard = union.size ? shared.length / union.size : 0;
      const price = availableSize(product)?.item.price || 0;
      const priceFit = sourcePrice && price ? Math.max(0, 1 - Math.abs(sourcePrice - price) / Math.max(sourcePrice, price)) : 0;
      let score = Math.round(jaccard * 72 + priceFit * 18);
      if (family && brandFamily(product) === family) score += 8;
      if (traits.has('versatile') && sourceTraits.has('versatile')) score += 3;
      return { product, score: Math.min(98, score), shared };
    }).sort((a, b) => b.score - a.score).slice(0, 4);
    resultsBox.innerHTML = `
      <div class="discovery-results-head"><h3>Closest to ${esc(source.name)}</h3><span>Available alternatives</span></div>
      <div class="discovery-result-grid">
        ${matches.map(({ product, score, shared }) => renderResultCard(product, {
          badge: `${score}% similar`,
          reason: shared.length ? `Shared character: ${shared.slice(0, 4).map(traitLabel).join(', ')}.` : 'Similar price range and versatile wearing style.'
        })).join('')}
      </div>
      <p class="discovery-disclaimer">Similarity is based on Scentory catalogue profiles and price proximity. It does not mean the perfumes are exact clones.</p>
    `;
  }

  function passportCode(product) {
    let hash = 2166136261;
    for (const char of product.id) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return `SC-${(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
  }

  function renderPassportTool(seedId = '') {
    const initial = getCatalogue().some(product => product.id === seedId) ? seedId : (getCatalogue()[0]?.id || '');
    return renderToolShell('passport',
      'Open a product-level identity record with Scentory’s authenticity promise, catalogue ID, stock and atomizer information.',
      `
        <form class="discovery-form" onsubmit="renderScentPassport(document.getElementById('passportProduct').value); return false;">
          <div class="discovery-field full"><label for="passportProduct">Choose a fragrance</label>
            <select id="passportProduct" onchange="renderScentPassport(this.value)">${productOptions(initial, true)}</select>
          </div>
        </form>
        <div id="passportResult"></div>
      `
    );
  }

  function renderScentPassport(id) {
    const product = getCatalogue().find(item => item.id === id);
    const result = document.getElementById('passportResult');
    if (!product || !result) return;
    const productAvailable = productHasAvailableSize(product);
    const sizes = Object.entries(product.sizes || {}).map(([size, item]) => {
      const available = product.status !== 'out' && item.available && item.price !== null;
      const label = item.price === null ? 'N/A' : money(item.price);
      return `<span class="passport-size ${available ? '' : 'out'}">${esc(displayMl(size))} · ${esc(label)}${item.premium ? ' · Premium' : ''}</span>`;
    }).join('');
    result.innerHTML = `
      <article class="passport-card">
        <img src="${esc(imagePath(product))}" alt="${esc(product.name)}" loading="lazy" decoding="async">
        <div class="passport-copy">
          <span class="passport-code">${esc(passportCode(product))}</span>
          <h3>${esc(product.name)}</h3>
          <p>This Scent Passport identifies the fragrance in Scentory’s catalogue and records the product-level authenticity promise.</p>
          <div class="passport-facts">
            <div class="passport-fact"><span>Verification</span><strong>Original bottle-sourced decant</strong></div>
            <div class="passport-fact"><span>Catalogue status</span><strong>${productAvailable ? 'Available' : 'Out of stock'}</strong></div>
            <div class="passport-fact"><span>Catalogue ID</span><strong>${esc(product.id)}</strong></div>
            <div class="passport-fact"><span>Brand relationship</span><strong>Independent decant retailer</strong></div>
          </div>
          <div class="passport-sizes">${sizes}</div>
          <div class="discovery-result-actions">
            <button type="button" class="discovery-mini-action" onclick="openDiscoveryProduct('${esc(product.id)}')">View details</button>
            <button type="button" class="discovery-mini-action primary" onclick="copyScentPassportLink('${esc(product.id)}')">Copy passport link</button>
          </div>
          <p class="discovery-disclaimer">This is a Scentory product record, not a manufacturer certificate or individual bottle batch-code verification. Scentory is not affiliated with the perfume brand.</p>
        </div>
      </article>
    `;
  }

  function renderCostTool(seedId = '') {
    const initial = getAvailablePerfumes().some(product => product.id === seedId) ? seedId : (getAvailablePerfumes()[0]?.id || '');
    return renderToolShell('cost',
      'Estimate how long a decant may last and how much each wearing costs. Adjust the number of sprays to match your routine.',
      `
        <form class="discovery-form" onsubmit="calculateCostPerWear(event)">
          <div class="discovery-field full"><label for="costProduct">Choose a fragrance</label>
            <select id="costProduct" onchange="syncCostWearSizes(); calculateCostPerWear()">${productOptions(initial, false)}</select>
          </div>
          <div class="discovery-field"><label for="costSize">Decant size</label><select id="costSize" onchange="calculateCostPerWear()"></select></div>
          <div class="discovery-field"><label for="costSprays">Sprays per wearing</label>
            <select id="costSprays" onchange="calculateCostPerWear()"><option value="3">3 sprays</option><option value="5" selected>5 sprays</option><option value="7">7 sprays</option><option value="10">10 sprays</option></select>
          </div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Calculate Cost Per Wear</button></div>
        </form>
        <div id="costResults"></div>
      `
    );
  }

  function syncCostWearSizes() {
    const product = getCatalogue().find(item => item.id === document.getElementById('costProduct')?.value);
    const sizeSelect = document.getElementById('costSize');
    if (!product || !sizeSelect) return;
    sizeSelect.innerHTML = Object.entries(product.sizes || {}).filter(([, item]) => item.available && item.price !== null && product.status !== 'out').map(([size, item]) =>
      `<option value="${esc(size)}">${esc(displayMl(size))} · ${esc(money(item.price))}${item.premium ? ' · Premium' : ''}</option>`
    ).join('');
  }

  function calculateCostPerWear(event) {
    event?.preventDefault();
    const product = getCatalogue().find(item => item.id === document.getElementById('costProduct')?.value);
    const size = document.getElementById('costSize')?.value;
    const spraysPerWear = Number(document.getElementById('costSprays')?.value || 5);
    const results = document.getElementById('costResults');
    const item = product?.sizes?.[size];
    if (!product || !item || !results) return;
    const ml = Number(String(size).replace(/[^0-9.]/g, ''));
    const sprays = Math.round(ml * 10);
    const wears = Math.max(1, Math.floor(sprays / spraysPerWear));
    const cost = item.price / wears;
    results.innerHTML = `
      <article class="cost-wear-card">
        <div class="discovery-results-head"><h3>${esc(product.name)}</h3><span>${esc(displayMl(size))} estimate</span></div>
        <div class="cost-wear-grid">
          <div class="cost-wear-stat"><span>Decant price</span><strong>${money(item.price)}</strong></div>
          <div class="cost-wear-stat"><span>Approx. sprays</span><strong>~${sprays}</strong></div>
          <div class="cost-wear-stat"><span>Approx. wears</span><strong>~${wears}</strong></div>
          <div class="cost-wear-stat"><span>Cost per wear</span><strong>~৳${cost.toFixed(1)}</strong></div>
        </div>
        <div class="discovery-result-actions">
          <button type="button" class="discovery-mini-action primary" onclick="addDiscoveryItem('${esc(product.id)}','${esc(size)}')">Add ${esc(displayMl(size))} to order</button>
        </div>
        <p class="discovery-disclaimer">Estimate assumes approximately 10 sprays per ML and one wearing per day. Actual output varies by atomizer, spray pressure and personal use.</p>
      </article>
    `;
  }

  function openDiscoveryTool(key, seedId = '') {
    if (!modal || !modalContent || !toolNames[key]) return;
    if (!getCatalogue().length) {
      modalContent.innerHTML = '<div class="discovery-empty">The catalogue is still loading. Please wait a moment and try again.</div>';
    } else {
      const renderers = {
        find: renderFindTool,
        weather: renderWeatherTool,
        box: renderBoxTool,
        similar: () => renderSimilarTool(seedId),
        passport: () => renderPassportTool(seedId),
        cost: () => renderCostTool(seedId)
      };
      modalContent.innerHTML = renderers[key]();
    }
    lastFocusedElement = document.activeElement;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => {
      modalClose?.focus();
      if (!getCatalogue().length) return;
      if (key === 'similar') runSimilarScents();
      if (key === 'passport') renderScentPassport(document.getElementById('passportProduct')?.value || seedId);
      if (key === 'cost') { syncCostWearSizes(); calculateCostPerWear(); }
    });
  }

  function closeDiscoveryTool() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalContent.innerHTML = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  }

  function addDiscoveryItem(id, size) {
    const product = getCatalogue().find(item => item.id === id);
    const added = typeof addToCart === 'function' ? addToCart(id, size) : false;
    if (typeof showToast === 'function') {
      showToast(added ? `${product?.name || 'Item'} was added to your order.` : 'That size is already in your order or unavailable.', added ? 'success' : 'info');
    }
  }

  function addDiscoveryBox() {
    let added = 0;
    lastBuiltBox.forEach(item => { if (addToCart(item.id, item.size)) added += 1; });
    if (typeof showToast === 'function') showToast(added ? `${added} box items added to your order.` : 'These box items are already in your order.', added ? 'success' : 'info');
    if (added && typeof scrollToOrderCard === 'function') setTimeout(scrollToOrderCard, 350);
  }

  function openDiscoveryProduct(id) {
    closeDiscoveryTool();
    if (typeof window.openProductDetails === 'function') window.openProductDetails(id);
  }

  function openDiscoveryFromProduct(key, id) {
    if (typeof closeProductDetails === 'function') closeProductDetails();
    openDiscoveryTool(key, id);
  }

  async function copyScentPassportLink(id) {
    const url = new URL(window.location.href);
    url.searchParams.set('passport', id);
    url.hash = '';
    try {
      await navigator.clipboard.writeText(url.toString());
      if (typeof showToast === 'function') showToast('Scent Passport link copied.', 'success');
    } catch {
      window.prompt('Copy this Scent Passport link:', url.toString());
    }
  }

  function enhanceProductDetails(id) {
    const copy = document.querySelector('#productModalContent .product-modal-copy');
    if (!copy || copy.querySelector('.discovery-product-actions')) return;
    copy.insertAdjacentHTML('beforeend', `
      <div class="discovery-product-actions">
        <button type="button" class="discovery-mini-action" onclick="openDiscoveryFromProduct('similar','${esc(id)}')">Similar Scents</button>
        <button type="button" class="discovery-mini-action" onclick="openDiscoveryFromProduct('passport','${esc(id)}')">Scent Passport</button>
        <button type="button" class="discovery-mini-action" onclick="openDiscoveryFromProduct('cost','${esc(id)}')">Cost Per Wear</button>
      </div>
    `);
  }

  const originalProductDetails = window.openProductDetails;
  if (typeof originalProductDetails === 'function') {
    window.openProductDetails = function(id) {
      originalProductDetails(id);
      requestAnimationFrame(() => enhanceProductDetails(id));
    };
  }

  window.openDiscoveryTool = openDiscoveryTool;
  window.closeDiscoveryTool = closeDiscoveryTool;
  window.runFindMyScent = runFindMyScent;
  window.runWeatherMatch = runWeatherMatch;
  window.runDecantBox = runDecantBox;
  window.runSimilarScents = runSimilarScents;
  window.renderScentPassport = renderScentPassport;
  window.syncCostWearSizes = syncCostWearSizes;
  window.calculateCostPerWear = calculateCostPerWear;
  window.addDiscoveryItem = addDiscoveryItem;
  window.addDiscoveryBox = addDiscoveryBox;
  window.openDiscoveryProduct = openDiscoveryProduct;
  window.openDiscoveryFromProduct = openDiscoveryFromProduct;
  window.copyScentPassportLink = copyScentPassportLink;

  modalClose?.addEventListener('click', closeDiscoveryTool);
  modal?.addEventListener('click', event => { if (event.target === modal) closeDiscoveryTool(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('show')) closeDiscoveryTool(); });

  function openPassportFromUrl(attempt = 0) {
    const id = new URLSearchParams(window.location.search).get('passport');
    if (!id) return;
    if (getCatalogue().some(product => product.id === id)) {
      openDiscoveryTool('passport', id);
      return;
    }
    if (attempt < 12) setTimeout(() => openPassportFromUrl(attempt + 1), 250);
  }
  setTimeout(openPassportFromUrl, 350);
})();
