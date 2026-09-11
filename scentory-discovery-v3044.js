(() => {
  'use strict';

  const toolNames = {
    find: 'Find My Perfume',
    weather: 'Scentory Weather Match',
    box: 'Build My Decant Box',
    similar: 'Similar Perfumes',
    cost: 'Cost Per Spray'
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
    hot: { preferred: ['fresh', 'aquatic', 'summer', 'gym', 'blue', 'citrus'], avoid: ['winter', 'oud', 'tobacco', 'heavy'] },
    monsoon: { preferred: ['fresh', 'aquatic', 'woody', 'versatile', 'office', 'green'], avoid: ['heavy', 'tobacco'] },
    winter: { preferred: ['sweet', 'winter', 'date night', 'oud', 'spicy', 'bold', 'amber'], avoid: ['gym'] },
    ac: { preferred: ['office', 'formal', 'versatile', 'daily wear', 'fresh', 'elegant'], avoid: ['beast mode', 'heavy'] },
    outdoor: { preferred: ['fresh', 'summer', 'aquatic', 'beast mode', 'bold', 'citrus'], avoid: ['powdery'] }
  };

  const characterPatterns = {
    fresh: /fresh|cool|ice|chill|aqua|aquatic|blue|azul|pacific|aloha|voyage|chrome|after swim|daring|zenith|fattan|summer/,
    aquatic: /aqua|aquatic|ocean|marine|sea|voyage|cool water|pacific|aloha|after swim|blue/,
    citrus: /citrus|lemon|bergamot|orange|italia|maahir legacy/,
    green: /green|zeleny|fattan|jungle|terra|wulong/,
    sweet: /sweet|yara|khamrah|qahwa|bourbon|9 pm|9pm|honor|glory|mango|tropical|vanilla|plato/,
    fruity: /fruit|mango|tropical|yara|honor|glory|plato|now by lattafa/,
    woody: /wood|woody|oud|cedrus|terra|fattan|bois|leather|ambre|dunescape/,
    oud: /oud|layl|shuhrah|glory|pharaoh/,
    spicy: /spicy|spice|qahwa|bourbon|kobra|elixir|teriaq|asad|wanted/,
    amber: /amber|ambre|gold|bourbon|khamrah|asad|liquid brun/,
    aromatic: /aromatic|fattan|modest|fakhar|kaaf|212 men|maahir|voyage/,
    leather: /leather|ambre leather|tuscan/,
    powdery: /powder|yara|touch|plato/,
    gourmand: /gourmand|khamrah|qahwa|vanilla|bourbon|liquid brun/,
    smoky: /smoky|smoke|oud for glory|intense man|club de nuit/,
    clean: /clean|fresh|office|cool water|voyage|blue|kaaf|after swim|daring/,
    elegant: /elegant|formal|collector|precieux|plato|gold|majestic|touch/
  };

  const usePatterns = {
    office: /office|formal|professional|daily wear|daily use|versatile|fattan|212 men|touch/,
    daily: /daily|casual|versatile|office|gym|daytime/,
    active: /gym|active|sport|outdoor|summer|fresh|aquatic/,
    date: /date night|date|romantic|evening|sweet|winter/,
    party: /party|beast mode|bold|night out|club|projection/,
    formal: /formal|elegant|special occasion|collector|precieux|majestic/
  };

  const boxProfiles = {
    balanced: ['fresh', 'office', 'date', 'sweet', 'aquatic', 'versatile'],
    fresh: ['fresh', 'aquatic', 'citrus', 'clean', 'active'],
    office: ['office', 'formal', 'daily', 'versatile', 'clean'],
    evening: ['date', 'party', 'winter', 'sweet', 'bold', 'oud'],
    summer: ['fresh', 'aquatic', 'citrus', 'summer', 'active'],
    sweet: ['sweet', 'fruity', 'gourmand', 'date', 'party'],
    bold: ['bold', 'party', 'spicy', 'oud', 'strong'],
    versatile: ['versatile', 'daily', 'office', 'fresh', 'clean']
  };

  const sprayGuide = {
    '5ml': { min: 70, max: 80, title: '5 ML', copy: 'Perfect for testing new perfumes and discovering your favourites.' },
    '6ml': { min: 100, max: 110, title: '6 ML Premium', copy: 'A premium choice for gifting, carrying, and daily use.' },
    '10ml': { min: 140, max: 150, title: '10 ML', copy: 'The balanced size for regular wear and frequent use.' },
    '15ml': { min: 200, max: 220, title: '15 ML', copy: 'Best for your signature perfumes that you love wearing often.' }
  };

  let lastBuiltBox = [];
  let boxVariation = 0;
  let currentBoxSettings = '';
  const seenBoxOptions = new Map();
  let lastFocusedElement = null;

  const modal = document.getElementById('discoveryModal');
  const modalContent = document.getElementById('discoveryModalContent');
  const modalClose = document.getElementById('discoveryModalClose');

  function esc(value) {
    if (typeof escapeHtml === 'function') return escapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function money(value) {
    return `৳${Number(value || 0).toLocaleString('en-BD')}`;
  }

  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  function getCatalogue() {
    return Array.isArray(perfumes) ? perfumes : [];
  }

  function getAvailablePerfumes() {
    return getCatalogue().filter(product => productHasAvailableSize(product) && !isUpcoming(product));
  }

  function traitLabel(value) {
    const labels = { active: 'Active Wear', date: 'Date Night', daily: 'Daily Wear', hot: 'Hot Weather', ac: 'AC Office' };
    return labels[value] || String(value || '').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function profileText(product) {
    return `${product.name || ''} ${product.id || ''} ${product.recommendation || ''} ${(product.tags || []).join(' ')}`.toLowerCase();
  }

  function getTraits(product) {
    const traits = new Set((product.tags || []).map(tag => String(tag).toLowerCase()));
    const profile = buildPerfumeProfile(product);
    profile.character.forEach(item => traits.add(item));
    profile.uses.forEach(item => traits.add(item));
    profile.weather.forEach(item => traits.add(item));
    if (profile.strength >= 3) traits.add('bold');
    if (profile.strength === 1) traits.add('light');
    if (traits.has('office') || traits.has('daily') || traits.has('daily wear')) traits.add('versatile');
    return traits;
  }

  function buildPerfumeProfile(product) {
    const text = profileText(product);
    const rawTags = new Set((product.tags || []).map(tag => String(tag).toLowerCase()));
    const character = new Set();
    const uses = new Set();

    Object.entries(characterPatterns).forEach(([name, pattern]) => {
      if (pattern.test(text) || rawTags.has(name)) character.add(name);
    });
    Object.entries(usePatterns).forEach(([name, pattern]) => {
      if (pattern.test(text) || rawTags.has(name) || rawTags.has(name === 'daily' ? 'daily wear' : name)) uses.add(name);
    });

    if (rawTags.has('beast mode')) uses.add('party');
    if (rawTags.has('date night')) uses.add('date');
    if (rawTags.has('gym')) uses.add('active');
    if (rawTags.has('formal')) uses.add('formal');
    if (!character.size) character.add('aromatic');
    if (!uses.size) uses.add('daily');

    const weather = new Set();
    if ([...character].some(item => ['fresh', 'aquatic', 'citrus', 'green', 'clean'].includes(item)) || rawTags.has('summer')) weather.add('hot');
    if ([...character].some(item => ['woody', 'green', 'aquatic', 'fresh'].includes(item))) weather.add('monsoon');
    if ([...character].some(item => ['sweet', 'oud', 'spicy', 'amber', 'gourmand', 'smoky', 'leather'].includes(item)) || rawTags.has('winter')) weather.add('winter');
    if (uses.has('office') || uses.has('formal') || uses.has('daily')) weather.add('ac');
    if (uses.has('active') || character.has('fresh') || rawTags.has('beast mode')) weather.add('outdoor');

    let strength = 2;
    if (/beast mode|intense|overdose|elixir|fire|black|stronger|wanted|pure parfum|extrait|bold|projection/.test(text)) strength = 3;
    if (/light|soft|airy|after swim|cool water|voyage|daily use/.test(text) && !/intense|beast mode|extrait/.test(text)) strength = 1;

    return { character, uses, weather, strength };
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
    const recommendation = getScentProfile(product).recommendation;
    return `
      <article class="discovery-result-card ${options.wide ? 'similarity-result-card' : ''}">
        <img src="${esc(imagePath(product))}" alt="${esc(product.name)}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'">
        <div class="discovery-result-copy">
          ${options.badge ? `<span class="discovery-score">${esc(options.badge)}</span>` : ''}
          <h4>${esc(product.name)}</h4>
          <p>${esc(options.reason || recommendation)}</p>
          ${options.breakdown || ''}
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
        <form class="discovery-form" onsubmit="runFindMyPerfume(event)">
          <div class="discovery-field"><label for="findOccasion">Where will you wear it?</label>
            <select id="findOccasion"><option value="daily">Daily wear</option><option value="office">Office / university</option><option value="date">Date night</option><option value="party">Party</option><option value="gym">Gym / active</option><option value="formal">Formal event</option></select>
          </div>
          <div class="discovery-field"><label for="findMood">Which character attracts you?</label>
            <select id="findMood"><option value="fresh">Fresh & clean</option><option value="sweet">Sweet & inviting</option><option value="aquatic">Aquatic & airy</option><option value="bold">Bold & powerful</option><option value="woody">Woody & refined</option><option value="versatile">Versatile & easy</option></select>
          </div>
          <div class="discovery-field"><label for="findWeather">Weather or environment</label>
            <select id="findWeather">${Object.entries(weatherNames).map(([key, label]) => `<option value="${key}" ${key === weather ? 'selected' : ''}>${label}</option>`).join('')}</select>
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

  function runFindMyPerfume(event) {
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
      <div class="discovery-result-grid">${matches.map(({ product, score, selected }) => renderResultCard(product, {
        size: selected.size, badge: `${score}% match`, reason: `Made for ${occasionNames[occasion].toLowerCase()} with a ${traitLabel(mood)} character in ${weatherNames[weather].toLowerCase()} conditions.`
      })).join('')}</div>
      <p class="discovery-disclaimer">Match percentages are Scentory guidance based on catalogue profiles, stock, selected size and budget.</p>
    `;
  }

  function renderWeatherTool() {
    const weather = defaultWeather();
    return renderToolShell('weather',
      'Choose a Bangladesh weather situation and the strength you prefer. Scentory will rank suitable available perfumes.',
      `
        <form class="discovery-form" onsubmit="runWeatherMatch(event)">
          <div class="discovery-field"><label for="weatherMode">Weather or environment</label><select id="weatherMode">${Object.entries(weatherNames).map(([key, label]) => `<option value="${key}" ${key === weather ? 'selected' : ''}>${label}</option>`).join('')}</select></div>
          <div class="discovery-field"><label for="weatherStrength">Preferred presence</label><select id="weatherStrength"><option value="balanced">Balanced</option><option value="light">Light & fresh</option><option value="strong">Strong projection</option></select></div>
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
      if (strength === 'strong' && traits.has('bold')) score += 8;
      if (strength === 'balanced' && traits.has('versatile')) score += 6;
      return { product, score: Math.min(99, score) };
    }).sort((a, b) => b.score - a.score).slice(0, 4);

    resultsBox.innerHTML = `
      <div class="discovery-results-head"><h3>Best for ${esc(weatherNames[weather])}</h3><span>Guidance score</span></div>
      <div class="discovery-result-grid">${matches.map(({ product, score }) => {
        const traits = [...getTraits(product)].filter(trait => weatherProfiles[weather].preferred.includes(trait)).slice(0, 3);
        return renderResultCard(product, { badge: `${score}/100 weather fit`, reason: traits.length ? `Why it fits: ${traits.map(traitLabel).join(', ')}.` : 'A versatile available option for this setting.' });
      }).join('')}</div>
      <p class="discovery-disclaimer">Weather scores are shopping guidance, not laboratory performance claims. Longevity and projection vary by skin, temperature and spraying style.</p>
    `;
  }

  function renderBoxTool() {
    return renderToolShell('box',
      'Choose your budget, size, number of perfumes and box personality. Generate another valid combination anytime with Next Option.',
      `
        <form class="discovery-form" onsubmit="runDecantBox(event)">
          <div class="discovery-field"><label for="boxBudget">Perfume budget</label><select id="boxBudget"><option value="800">৳800</option><option value="1200" selected>৳1,200</option><option value="1600">৳1,600</option><option value="2200">৳2,200</option><option value="3000">৳3,000</option><option value="4000">৳4,000</option><option value="5000">৳5,000</option></select></div>
          <div class="discovery-field"><label for="boxSize">One size for every decant</label><select id="boxSize"><option value="5ml">5 ML</option><option value="6ml">6 ML Premium</option><option value="10ml">10 ML</option><option value="15ml">15 ML</option></select></div>
          <div class="discovery-field"><label for="boxCount">Number of perfumes</label><select id="boxCount"><option value="3">3 perfumes</option><option value="4" selected>4 perfumes</option><option value="5">5 perfumes</option><option value="6">6 perfumes</option></select></div>
          <div class="discovery-field"><label for="boxStyle">Box personality</label><select id="boxStyle"><option value="balanced">Balanced wardrobe</option><option value="fresh">Fresh & clean</option><option value="office">Office-ready</option><option value="evening">Evening & date</option><option value="summer">Bangladesh summer</option><option value="sweet">Sweet collection</option><option value="bold">Bold performers</option><option value="versatile">Everyday versatile</option></select></div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Build My Box</button></div>
        </form>
        <div id="boxResults" class="discovery-results"></div>
      `
    );
  }

  function stableHash(value) {
    let hash = 2166136261;
    for (const character of String(value)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function selectBoxItems(budget, size, count, style, variation) {
    const desired = boxProfiles[style] || boxProfiles.balanced;
    const pool = getAvailablePerfumes().map(product => {
      const chosen = availableSize(product, size);
      if (!chosen || chosen.size !== size || chosen.item.price > budget) return null;
      const profile = buildPerfumeProfile(product);
      const traits = new Set([...getTraits(product), ...profile.character, ...profile.uses, ...profile.weather]);
      return { product, size, item: chosen.item, traits };
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
        const varietyBonus = (stableHash(`${candidate.product.id}:${variation}:${selected.length}`) % 1000) / 55;
        const valueBonus = Math.max(0, 6 - candidate.item.price / Math.max(1, budget) * 8);
        candidate.rank = styleHits * 16 + newHits * 10 + varietyBonus + valueBonus + (candidate.traits.has('versatile') ? 3 : 0);
      });
      feasible.sort((a, b) => b.rank - a.rank || a.item.price - b.item.price);
      selected.push(feasible[0]);
      remaining -= feasible[0].item.price;
    }
    return selected;
  }

  function readBoxSettings() {
    return {
      budget: Number(document.getElementById('boxBudget')?.value || 1200),
      size: document.getElementById('boxSize')?.value || '5ml',
      count: Number(document.getElementById('boxCount')?.value || 4),
      style: document.getElementById('boxStyle')?.value || 'balanced'
    };
  }

  function renderBoxVariation(isNext = false) {
    const settings = readBoxSettings();
    const settingsKey = `${settings.budget}:${settings.size}:${settings.count}:${settings.style}`;
    if (settingsKey !== currentBoxSettings) {
      currentBoxSettings = settingsKey;
      boxVariation = 0;
      seenBoxOptions.set(settingsKey, new Set());
    } else if (isNext) {
      boxVariation += 1;
    }

    const seen = seenBoxOptions.get(settingsKey) || new Set();
    let items = [];
    let signature = '';
    let attempts = 0;
    do {
      items = selectBoxItems(settings.budget, settings.size, settings.count, settings.style, boxVariation + attempts);
      signature = items.map(item => item.product.id).sort().join('|');
      attempts += 1;
    } while (signature && seen.has(signature) && attempts < 40);

    if (signature) seen.add(signature);
    seenBoxOptions.set(settingsKey, seen);
    boxVariation += attempts - 1;
    lastBuiltBox = items.map(item => ({ id: item.product.id, size: item.size }));
    const resultsBox = document.getElementById('boxResults');
    if (!resultsBox) return;

    if (!items.length) {
      resultsBox.innerHTML = '<div class="discovery-empty">That budget cannot build a box with the selected size. Try 5 ML or increase the budget.</div>';
      return;
    }

    const total = items.reduce((sum, item) => sum + item.item.price, 0);
    resultsBox.innerHTML = `
      <div class="discovery-box-summary">
        <div><span class="box-option-label">Option ${seen.size}</span><strong>${items.length}-Perfume ${esc(traitLabel(settings.style))} Box</strong><br><span>${esc(displayMl(settings.size))} each · ${money(settings.budget - total)} budget remaining</span></div>
        <strong>${money(total)}</strong>
      </div>
      <div class="discovery-box-list">${items.map(item => `
        <div class="discovery-box-item" data-perfume-id="${esc(item.product.id)}">
          <img src="${esc(imagePath(item.product))}" alt="" loading="lazy" decoding="async">
          <span><b>${esc(item.product.name)}</b><small>${esc([...item.traits].filter(trait => boxProfiles[settings.style].includes(trait)).slice(0, 3).map(traitLabel).join(' · ') || 'Scentory selection')}</small></span>
          <strong>${money(item.item.price)}</strong>
        </div>`).join('')}</div>
      <div class="box-option-actions">
        <button type="button" class="discovery-action secondary" onclick="showNextBoxOption()">Next Option</button>
        <button type="button" class="discovery-action" onclick="addDiscoveryBox()">Add This Box to Order</button>
      </div>
      ${items.length < settings.count ? '<p class="discovery-disclaimer">The selected budget could not fit the full requested count, so the builder created the closest available box.</p>' : ''}
      <p class="discovery-disclaimer">Every option uses currently available perfumes, the selected decant size and the perfume subtotal shown above. Delivery charge is calculated separately in your order.</p>
    `;
  }

  function runDecantBox(event) {
    event?.preventDefault();
    currentBoxSettings = '';
    renderBoxVariation(false);
  }

  function showNextBoxOption() {
    renderBoxVariation(true);
  }

  function weightedJaccard(first, second) {
    const union = new Set([...first, ...second]);
    if (!union.size) return 0;
    const intersection = [...first].filter(item => second.has(item)).length;
    return intersection / union.size;
  }

  function priceSimilarity(source, target) {
    if (!source || !target) return 0.5;
    return clamp(1 - Math.abs(Math.log(target / source)) / Math.log(3));
  }

  function strengthLabel(value) {
    return value === 3 ? 'Strong' : value === 1 ? 'Light' : 'Balanced';
  }

  function similarityBreakdown(source, candidate) {
    const sourceProfile = buildPerfumeProfile(source);
    const candidateProfile = buildPerfumeProfile(candidate);
    const sourcePrice = firstPricedSize(source)?.item.price || 0;
    const targetPrice = availableSize(candidate)?.item.price || 0;
    const factors = {
      character: weightedJaccard(sourceProfile.character, candidateProfile.character),
      occasion: weightedJaccard(sourceProfile.uses, candidateProfile.uses),
      weather: weightedJaccard(sourceProfile.weather, candidateProfile.weather),
      strength: 1 - Math.abs(sourceProfile.strength - candidateProfile.strength) / 2,
      price: priceSimilarity(sourcePrice, targetPrice)
    };
    const weighted = factors.character * .45 + factors.occasion * .20 + factors.weather * .15 + factors.strength * .10 + factors.price * .10;
    const sharedCharacter = [...sourceProfile.character].filter(item => candidateProfile.character.has(item));
    const sharedUses = [...sourceProfile.uses].filter(item => candidateProfile.uses.has(item));
    const sharedWeather = [...sourceProfile.weather].filter(item => candidateProfile.weather.has(item));
    const evidenceCount = sharedCharacter.length + sharedUses.length + sharedWeather.length;
    const score = Math.round(clamp(weighted + Math.min(.05, evidenceCount * .008), .25, .97) * 100);
    return { factors, score, sharedCharacter, sharedUses, sharedWeather, sourceProfile, candidateProfile };
  }

  function factorRow(label, value, weight) {
    const percent = Math.round(value * 100);
    return `<div class="similarity-factor"><span>${esc(label)} <small>${esc(weight)}</small></span><div><i style="width:${percent}%"></i></div><b>${percent}%</b></div>`;
  }

  function renderSimilarTool(seedId = '') {
    const initial = getCatalogue().some(product => product.id === seedId) ? seedId : (getAvailablePerfumes()[0]?.id || '');
    return renderToolShell('similar',
      'Scentory compares five weighted factors and explains every result, so customers can understand the match instead of trusting a hidden score.',
      `
        <div class="similarity-method"><strong>Scentory 5-Factor Similarity Engine</strong><span>Perfume character 45%</span><span>Occasion 20%</span><span>Weather 15%</span><span>Strength 10%</span><span>Price 10%</span></div>
        <form class="discovery-form" onsubmit="runSimilarPerfumes(event)">
          <div class="discovery-field full"><label for="similarProduct">Choose a perfume</label><select id="similarProduct" onchange="runSimilarPerfumes()">${productOptions(initial, true)}</select></div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Find Similar Perfumes</button></div>
        </form>
        <div id="similarResults" class="discovery-results"></div>
      `
    );
  }

  function runSimilarPerfumes(event) {
    event?.preventDefault();
    const id = document.getElementById('similarProduct')?.value;
    const source = getCatalogue().find(product => product.id === id);
    const resultsBox = document.getElementById('similarResults');
    if (!source || !resultsBox) return;

    const sourceProfile = buildPerfumeProfile(source);
    const matches = getAvailablePerfumes().filter(product => product.id !== source.id).map(product => ({
      product,
      match: similarityBreakdown(source, product)
    })).sort((a, b) => b.match.score - a.match.score || a.product.name.localeCompare(b.product.name)).slice(0, 4);

    const sourceTags = [...sourceProfile.character].slice(0, 5).map(item => `<span>${esc(traitLabel(item))}</span>`).join('');
    resultsBox.innerHTML = `
      <div class="similarity-source"><span>Reference perfume</span><strong>${esc(source.name)}</strong><div>${sourceTags}<span>${esc(strengthLabel(sourceProfile.strength))} presence</span></div></div>
      <div class="discovery-results-head"><h3>Closest available perfumes</h3><span>Scentory Similarity Score</span></div>
      <div class="discovery-result-grid similarity-grid">${matches.map(({ product, match }) => {
        const character = match.sharedCharacter.slice(0, 4).map(traitLabel);
        const uses = match.sharedUses.slice(0, 3).map(traitLabel);
        const reasonParts = [];
        if (character.length) reasonParts.push(`Shared character: ${character.join(', ')}`);
        if (uses.length) reasonParts.push(`Similar use: ${uses.join(', ')}`);
        if (!reasonParts.length) reasonParts.push('Closest overall balance across the five measured factors');
        const breakdown = `<div class="similarity-breakdown">
          ${factorRow('Character', match.factors.character, '45% weight')}
          ${factorRow('Occasion', match.factors.occasion, '20% weight')}
          ${factorRow('Weather', match.factors.weather, '15% weight')}
          ${factorRow('Strength', match.factors.strength, '10% weight')}
          ${factorRow('Price', match.factors.price, '10% weight')}
        </div>`;
        return renderResultCard(product, { wide: true, badge: `${match.score}% similar`, reason: `${reasonParts.join('. ')}.`, breakdown });
      }).join('')}</div>
      <p class="discovery-disclaimer"><strong>How to read this:</strong> results compare Scentory’s catalogue character, recommended occasions, weather suitability, strength profile and entry price. Similarity does not mean an exact clone, identical notes or identical performance; always sample before choosing a larger size.</p>
    `;
  }

  function renderCostTool(seedId = '') {
    const initial = getAvailablePerfumes().some(product => product.id === seedId) ? seedId : (getAvailablePerfumes()[0]?.id || '');
    const guideCards = Object.values(sprayGuide).map(item => `
      <article class="spray-guide-card"><strong>${esc(item.title)} — Approx. ${item.min}–${item.max} sprays</strong><p>${esc(item.copy)}</p></article>
    `).join('');
    return renderToolShell('cost',
      'Choose the size that fits your fragrance journey!',
      `
        <div class="spray-guide-grid">${guideCards}</div>
        <form class="discovery-form" onsubmit="calculateCostPerSpray(event)">
          <div class="discovery-field full"><label for="costProduct">Choose a perfume</label><select id="costProduct" onchange="syncCostSpraySizes(); calculateCostPerSpray()">${productOptions(initial, false)}</select></div>
          <div class="discovery-field"><label for="costSize">Decant size</label><select id="costSize" onchange="calculateCostPerSpray()"></select></div>
          <div class="discovery-field"><label for="costSprays">Sprays per wearing</label><select id="costSprays" onchange="calculateCostPerSpray()"><option value="8">8 sprays</option><option value="10" selected>10 sprays</option><option value="12">12 sprays</option></select></div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Calculate My Value</button></div>
        </form>
        <div id="costResults"></div>
      `
    );
  }

  function syncCostSpraySizes() {
    const product = getCatalogue().find(item => item.id === document.getElementById('costProduct')?.value);
    const sizeSelect = document.getElementById('costSize');
    if (!product || !sizeSelect) return;
    sizeSelect.innerHTML = Object.entries(product.sizes || {}).filter(([size, item]) => sprayGuide[size] && item.available && item.price !== null && product.status !== 'out').map(([size, item]) =>
      `<option value="${esc(size)}">${esc(displayMl(size))} · ${esc(money(item.price))}${item.premium ? ' · Premium' : ''}</option>`
    ).join('');
  }

  function calculateCostPerSpray(event) {
    event?.preventDefault();
    const product = getCatalogue().find(item => item.id === document.getElementById('costProduct')?.value);
    const size = document.getElementById('costSize')?.value;
    const spraysPerWear = Number(document.getElementById('costSprays')?.value || 10);
    const results = document.getElementById('costResults');
    const item = product?.sizes?.[size];
    const guide = sprayGuide[size];
    if (!product || !item || !guide || !results) return;

    const averageSprays = (guide.min + guide.max) / 2;
    const minimumWears = Math.max(1, Math.floor(guide.min / spraysPerWear));
    const maximumWears = Math.max(1, Math.floor(guide.max / spraysPerWear));
    const averageWears = (minimumWears + maximumWears) / 2;
    const costPerSpray = item.price / averageSprays;
    const costPerWear = item.price / averageWears;
    results.innerHTML = `
      <article class="cost-wear-card">
        <div class="discovery-results-head"><h3>${esc(product.name)}</h3><span>${esc(sprayGuide[size].title)} value estimate</span></div>
        <div class="cost-wear-grid five-stats">
          <div class="cost-wear-stat"><span>Decant price</span><strong>${money(item.price)}</strong></div>
          <div class="cost-wear-stat"><span>Approx. sprays</span><strong>${guide.min}–${guide.max}</strong></div>
          <div class="cost-wear-stat"><span>Sprays per wearing</span><strong>${spraysPerWear}</strong></div>
          <div class="cost-wear-stat"><span>Approx. wears</span><strong>${minimumWears}${maximumWears !== minimumWears ? `–${maximumWears}` : ''}</strong></div>
          <div class="cost-wear-stat"><span>Average cost per spray</span><strong>~৳${costPerSpray.toFixed(2)}</strong></div>
          <div class="cost-wear-stat featured"><span>Average cost per wearing</span><strong>~৳${costPerWear.toFixed(1)}</strong></div>
        </div>
        <p class="cost-size-message"><strong>${esc(guide.title)}</strong><span>${esc(guide.copy)}</span></p>
        <div class="discovery-result-actions"><button type="button" class="discovery-mini-action primary" onclick="addDiscoveryItem('${esc(product.id)}','${esc(size)}')">Add ${esc(displayMl(size))} to order</button></div>
        <p class="discovery-disclaimer">Calculations use Scentory’s approximate ${guide.min}–${guide.max} spray range for this size. Actual output varies by atomizer, spray pressure and personal use.</p>
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
      if (key === 'similar') runSimilarPerfumes();
      if (key === 'cost') { syncCostSpraySizes(); calculateCostPerSpray(); }
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
    if (typeof showToast === 'function') showToast(added ? `${product?.name || 'Item'} was added to your order.` : 'That size is already in your order or unavailable.', added ? 'success' : 'info');
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

  function enhanceProductDetails(id) {
    const copy = document.querySelector('#productModalContent .product-modal-copy');
    if (!copy || copy.querySelector('.discovery-product-actions')) return;
    copy.insertAdjacentHTML('beforeend', `
      <div class="discovery-product-actions">
        <button type="button" class="discovery-mini-action" onclick="openDiscoveryFromProduct('similar','${esc(id)}')">Similar Perfumes</button>
        <button type="button" class="discovery-mini-action" onclick="openDiscoveryFromProduct('cost','${esc(id)}')">Cost Per Spray</button>
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
  window.runFindMyPerfume = runFindMyPerfume;
  window.runWeatherMatch = runWeatherMatch;
  window.runDecantBox = runDecantBox;
  window.showNextBoxOption = showNextBoxOption;
  window.runSimilarPerfumes = runSimilarPerfumes;
  window.syncCostSpraySizes = syncCostSpraySizes;
  window.calculateCostPerSpray = calculateCostPerSpray;
  window.addDiscoveryItem = addDiscoveryItem;
  window.addDiscoveryBox = addDiscoveryBox;
  window.openDiscoveryProduct = openDiscoveryProduct;
  window.openDiscoveryFromProduct = openDiscoveryFromProduct;

  modalClose?.addEventListener('click', closeDiscoveryTool);
  modal?.addEventListener('click', event => { if (event.target === modal) closeDiscoveryTool(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('show')) closeDiscoveryTool(); });
})();
