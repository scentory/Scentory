let perfumes = [];
let cart = [];

const WHATSAPP_NUMBER = '8801410939978';
const FACEBOOK_PAGE_URL = 'https://m.me/Scentorybd';
// Paste your deployed Google Apps Script Web App URL below. Keep it blank until setup.
const GOOGLE_SCRIPT_URL = ''; // Example: https://script.google.com/macros/s/XXXXX/exec
const DATA_VERSION = '3056';
const BEST_SELLING_IDS = [
  'afnan-supremacy-collector-s-edition-edp',
  'hawas-black-edp',
  'khadlaj-karus-gold-absolu-edp',
  'club-de-nuit-urban-man-elixir-edp'
];

const HOT_ARRIVAL_IDS = [
  'club-de-nuit-intense-overdose',
  'khadlaj-karus-gold-absolu-edp',
  'hawas-la-mer-edp',
  'rayhaan-cedrus-blanc-edp'
];


const productGrid = document.getElementById('productGrid');
const bestSellingGrid = document.getElementById('bestSellingGrid');
const hotArrivalsGrid = document.getElementById('hotArrivalsGrid');
const orderItems = document.getElementById('orderItems');
const grandTotal = document.getElementById('grandTotal');
const deliveryLocation = document.getElementById('deliveryLocation');
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const stockFilter = document.getElementById('stockFilter');
const tagFilter = document.getElementById('tagFilter');
const customerName = document.getElementById('customerName');
const customerPhone = document.getElementById('customerPhone');
const customerAddress = document.getElementById('customerAddress');
const cartCount = document.getElementById('cartCount');
const perfumeCount = document.getElementById('perfumeCount');
const floatingCart = document.getElementById('floatingCart');
const floatingCartCount = document.getElementById('floatingCartCount');
const floatingCartTotal = document.getElementById('floatingCartTotal');
const toastBox = document.getElementById('toast');
const imageModal = document.getElementById('imageModal');
const imageModalImg = document.getElementById('imageModalImg');
const imageModalTitle = document.getElementById('imageModalTitle');
const imageModalClose = document.getElementById('imageModalClose');
const productModal = document.getElementById('productModal');
const productModalContent = document.getElementById('productModalContent');
const productModalClose = document.getElementById('productModalClose');
const orderFormError = document.getElementById('orderFormError');

const modalReturnFocus = new WeakMap();
const FOCUSABLE_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

function getTopOpenModal() {
  return [imageModal, document.getElementById('discoveryModal'), productModal]
    .find(modal => modal?.classList.contains('show')) || null;
}

function getFocusableElements(modal) {
  if (!modal) return [];
  return [...modal.querySelectorAll(FOCUSABLE_SELECTOR)].filter(element =>
    element.getAttribute('aria-hidden') !== 'true' && !element.hidden && element.getClientRects().length
  );
}

function activateAccessibleModal(modal, preferredFocus) {
  if (!modal) return;
  modalReturnFocus.set(modal, document.activeElement instanceof HTMLElement ? document.activeElement : null);
  requestAnimationFrame(() => {
    const target = preferredFocus || getFocusableElements(modal)[0] || modal;
    if (target === modal && !modal.hasAttribute('tabindex')) modal.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

function deactivateAccessibleModal(modal) {
  if (!modal) return;
  const returnTarget = modalReturnFocus.get(modal);
  modalReturnFocus.delete(modal);
  requestAnimationFrame(() => {
    if (returnTarget?.isConnected && typeof returnTarget.focus === 'function') returnTarget.focus({ preventScroll: true });
  });
}

function syncModalBodyState() {
  const open = [imageModal, productModal, document.getElementById('discoveryModal')]
    .some(modal => modal?.classList.contains('show'));
  document.body.classList.toggle('modal-open', open);
}

const taka = amount => `৳${Number(amount || 0).toLocaleString('en-BD')}`;
const displayMl = ml => ml.replace('ml', ' ML');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

const shortOrderName = name => {
  const custom = {
    "Club De Nuit Intesne Man EDP": "CDNIM EDP",
    "Club De Nuit Intense Man PURE Parfum": "CDNIM Pure Parfum",
    "Club De Nuit Intesne Man EDT": "CDNIM EDT",
    "Club De Nuit Urban man Elixir EDP": "CDN Urban Man",
    "Club De Nuit Intense Overdose": "CDN Intense Overdose",
    "Club de Nuit Blue Iconic": "CDN Iconic Blue",
    "Club de Nuit Precieux Extrait De Parfum": "CDN Precuix",
    "Al Haramain Amber Oud Gold Edition": "Al Haramain Gold Edition",
    "Al Haramain Amber Oud Aqua Dubai": "Al Haramain Aqua Dubai",
    "Marwa by Arabiyat Prestige": "Marwa by Arabiyat",
    "Liquid Brun by French Avenue (EDP)": "Liquid Brun",
    "Hawas For Him EDP": "Hawas",
    "Hawas Ice EDP": "Hawas Ice",
    "Oud Al Layl Midnight EDP": "Oud Al Layl",
    "Hawas Black EDP": "Hawas Black",
    "Hawas Chrome EDP": "Hawas Chrome",
    "Hawas Kobra (EDP)": "Hawas Kobra",
    "Hawas Elixir EDP": "Hawas Elixir",
    "Hawas Fire EDP": "Hawas Fire",
    "Shuhrah Boisée EDP": "Shuhrah Boisée",
    "Shuhrah Elixir EDP": "Shuhrah Elixir",
    "Rasasi Fattan EDP": "Fattan",
    "Riiffs Fareed EDP": "Riiffs Fareed",
    "Vanguard by Maison Asrar": "Vanguard",
    "Afnan Supremacy Collector's Edition EDP": "Supremacy Collector",
    "Supremacy Not Only Intense EDP": "SNOI",
    "Afnan Turathi Blue (EDP)": "Turathi Blue",
    "Afnan 9 PM Night Out EDP": "9PM Night Out",
    "Afnan 9 PM EDP": "9PM",
    "Afnan 9 PM Rebel EDP": "9PM Rebel",
    "Stronger With You Intensely EDP": "SWY Intensely",
    "Azzaro The Most Wanted EDP Intense": "Azzaro TMW Intense",
    "YSL Y (EDP)": "YSL Y",
    "Nautica Voyage EDT": "Nautica Voyage",
    "212 Men by Carolina Herrera": "212 Men",
    "Versace Eros (EDT)": "Versace Eros",
    "Kenzo Homme EDT Intense": "Kenzo Homme Intense",
    "Davidoff Cool Water (EDT)": "Cool Water",
    "Al Haramain Amber Oud Gold Edition": "Amber Oud Gold",
    "Al Haramain Amber Oud Aqua Dubai": "Amber Oud Aqua",
    "Kaaf By Ahmed EDP": "Kaaf",
    "Blue By Ahmed EDP": "Blue Ahmed",
    "Zeleny By Ahmed EDP": "Zeleny Ahmed",
    "Brandy Salvage EDP": "Brandy Salvage",
    "Brandy After Swim EDP": "Brandy After Swim",
    "Brandy Inspiration EDP": "Brandy Inspiration",
    "Brandy Ambre Leather EDP": "Brandy Ambre Leather",
    "Marwa by Arabiyat Prestige": "Marwa",
    "Absolute Chill Atralia EDP": "Absolute Chill",
    "Kayaan Midnight EDP": "Kayaan Midnight",
    "Rayhaan Azul EDP": "Azul",
    "Rayhaan Pacific Aloha EDP (Upcoming)": "Pacific Aloha",
    "Rayhaan Nocturno Elixir EDP": "Nocturno Elixir",
    "Rayhaan Pharaoh EDP": "Pharaoh",
    "Rayhaan Italia EDP": "Italia",
    "Rayhaan Jungle Vibe EDP": "Jungle Vibe",
    "Rayhaan Lion EDP": "Lion",
    "Rayhaan Tiger EDP": "Tiger",
    "Rayhaan Wolf EDP": "Wolf",
    "Rayhaan Aquatica EDP": "Aquatica",
    "Rayhaan Pacific Aura EDP": "Pacific Aura",
    "Rayhaan Tropical Vibe EDP": "Tropical Vibe",
    "Rayhaan Terra EDP": "Terra",
    "Rayhaan Elixir EDP": "Rayhaan Elixir",
    "Bade'e Al Oud - 'Oud for Glory'": "Oud for Glory",
    "Bade'e Al Oud - 'Honor & Glory'": "Honor & Glory",
    "Armaf Dunescape EDP": "Armaf Dunescape",
    "Club De Nuit Intense Man PURE Parfum": "CDNIM Pure",
    "Club De Nuit Intense Man EDP": "CDNIM EDP",
    "Club de Nuit Precieux Extrait De Parfum": "CDN Precieux",
    "Club De Nuit Intense Man EDT": "CDNIM EDT",
    "Club De Nuit Urban man Elixir EDP": "CDN Urban Elixir",
    "Club de Nuit Blue Iconic": "CDN Blue Iconic",
    "Atlantis Extrait by French Avenue (EDP)": "Atlantis Extrait",
    "Zenith Blue by French Avenue (EDP)": "Zenith Blue",
    "Liquid Brun by French Avenue (EDP)": "Liquid Brun",
    "Vulcan Feu by French Avenue (EDP)": "Vulcan Feu",
    "Naseem by Gulf Orchid": "Naseem",
    "Mango Ice by Gulf Orchid": "Mango Ice",
    "Lattafa Opulent Dubai (EDP)": "Opulent Dubai",
    "Lattafa Art of Universe (EDP)": "Art of Universe",
    "Lattafa Maahir Legacy (EDP)": "Maahir Legacy",
    "Lattafa Yara EDP": "Yara",
    "Rave Now by Lattafa (EDP)": "Rave Now",
    "Dynasty by Lattafa (EDP)": "Dynasty",
    "Teriaq Intense by Lattafa (EDP)": "Teriaq Intense",
    "Lattafa Khamrah Qahwa EDP": "Khamrah Qahwa",
    "Lattafa Asad Bourbon EDP": "Asad Bourbon",
    "Lattafa Asad EDP": "Asad",
    "Lattafa Fakhar Black EDP": "Fakhar Black",
    "Lattafa Najdia (EDP)": "Najdia",
    "Lattafa Haayati (EDP)": "Haayati",
    "Khadlaj Island EDP": "Khadlaj Island",
    "Khadlaj Island Dream EDP": "Island Dream",
    "Titan by Khadlaj (EDP)": "Titan",
    "Qaed Al Fursan EDP": "Qaed Al Fursan",
    "Daring Blue EDP": "Daring Blue"
  };
  if (custom[name]) return custom[name];
  return String(name || '')
    .replace(/\s*\(Upcoming\)\s*/gi, '')
    .replace(/\s*\(EDP\)\s*/gi, '')
    .replace(/\s*\(EDT\)\s*/gi, '')
    .replace(/\s*Extrait De Parfum\s*/gi, '')
    .replace(/\s*PURE Parfum\s*/gi, '')
    .replace(/\s*EDP\s*/gi, ' ')
    .replace(/\s*EDT\s*/gi, ' ')
    .replace(/\s*by French Avenue\s*/gi, ' ')
    .replace(/\s*by Lattafa\s*/gi, ' ')
    .replace(/\s*By Ahmed\s*/gi, ' ')
    .replace(/\s*by Gulf Orchid\s*/gi, ' ')
    .replace(/\s*by Khadlaj\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const imagePath = p => p.image || `images/${p.id}.jpg`;
const hideBrokenImage = img => { img.closest('.product-image-wrap')?.classList.add('image-missing'); };


const SCENT_TAGS = [
  'Fresh','Aquatic','Citrus','Green','Aromatic','Fruity','Sweet','Gourmand',
  'Warm Spicy','Spicy','Amber','Woody','Oud','Leather','Smoky','Powdery','Musky',
  'Elegant','Blue','Office','Daily Wear','Gym','Date Night','Party','Formal',
  'Summer','Winter','Strong','Beast Mode','Versatile','Evening','Coffee'
];
function getScentProfile(p) {
  const safeTags = Array.isArray(p?.tags)
    ? p.tags.filter(tag => SCENT_TAGS.includes(tag)).slice(0, 3)
    : [];

  if (safeTags.length) {
    return {
      tags: safeTags,
      recommendation: p?.recommendation || buildRecommendationFromTags(safeTags)
    };
  }

  const name = `${p?.name || ''} ${p?.id || ''}`.toLowerCase();
  const tags = new Set();
  const add = (...items) => items.forEach(item => { if (SCENT_TAGS.includes(item)) tags.add(item); });

  if (/hawas|aqua|aquatica|voyage|cool water|blue|azul|turathi|pacific|aloha|chrome|daring|zenith|kaaf|maahir|zeleny|after swim|island|mango ice|absolute chill/.test(name)) add('Fresh','Summer','Office');
  if (/oud|amber|khamrah|qahwa|asad|bourbon|opulent|pharaoh|layl|leather|ambre|teriaq|honor|glory|shuhrah|dynasty/.test(name)) add('Sweet','Date Night','Winter');
  if (/9pm|eros|wanted|intensely|rebel|night out|elixir|kobra|tiger|lion|wolf|vulcan|precieux|urban|intense man|club de nuit|snoi|supremacy/.test(name)) add('Date Night','Party','Winter');
  if (/yara|naseem|island dream|tropical|jungle|italia/.test(name)) add('Sweet','Summer','Daily Wear');
  if (/office|fattan|212|cool water|voyage|blue|turathi|kaaf|maahir|zeleny|inspiration/.test(name)) add('Office');
  if (!tags.size) add('Fresh','Office','Daily Wear');

  const tagList = Array.from(tags).slice(0, 3);
  return { tags: tagList, recommendation: buildRecommendationFromTags(tagList) };
}

function buildRecommendationFromTags(tagList = []) {
  if (tagList.includes('Aquatic')) return 'Best for fresh daytime wear, summer heat, gym, beach, and clean casual use.';
  if (tagList.includes('Oud')) return 'Best for richer moments like evening wear, formal settings, dinners, and colder weather.';
  if (tagList.includes('Beast Mode')) return 'Choose this when you want stronger projection, longer wear, and a bold presence.';
  if (tagList.includes('Date Night')) return 'Best for dates, evening plans, parties, and special occasions.';
  if (tagList.includes('Office')) return 'Easy to wear for office, university, meetings, and daily use.';
  if (tagList.includes('Gym')) return 'Great for gym, casual daytime use, and fresh outdoor plans.';
  if (tagList.includes('Summer')) return 'A good choice for warm weather, daytime outings, and casual summer plans.';
  return 'A versatile pick for exploring something new from Scentory.';
}

function renderTagPills(p, limit = 4) {
  const profile = getScentProfile(p);
  return profile.tags.slice(0, limit).map(tag => `<span class="tag scent-tag">${escapeHtml(tag)}</span>`).join('');
}

const DETAIL_OCCASION_LABELS = {
  daily: 'Daily wear', office: 'Office / university', active: 'Gym / active use',
  date: 'Date night', party: 'Party / social event', formal: 'Formal occasion'
};
const DETAIL_CLIMATE_LABELS = {
  hot: 'Hot weather', monsoon: 'Monsoon / humid weather', winter: 'Cool weather',
  ac: 'Air-conditioned indoor setting', outdoor: 'Outdoor wear'
};
const DETAIL_LONGEVITY_LABELS = ['','Light','Moderate','Moderate to long','Long-lasting','Very long-lasting'];

function renderIntelligenceDetails(p) {
  const details = p?.details || {};
  const profile = p?.profile || {};
  const sourceChecked = details.verification === 'source-checked';
  const notes = details.notes || {};
  const noteRows = sourceChecked ? [
    ['Opening notes', notes.top], ['Heart notes', notes.heart], ['Base notes', notes.base]
  ].filter(([, values]) => Array.isArray(values) && values.length) : [];
  const bestPlaces = (profile.occasions || []).map(value => DETAIL_OCCASION_LABELS[value] || value);
  const bestWeather = (profile.climates || []).map(value => DETAIL_CLIMATE_LABELS[value] || value);
  const longevity = DETAIL_LONGEVITY_LABELS[Number(profile.longevity || 0)] || 'Varies by wearer';
  const character = (profile.character || []).map(value => value.replace(/\b\w/g, letter => letter.toUpperCase()));

  if (!sourceChecked) {
    return `
      <section class="verified-perfume-details pending-review" aria-label="Perfume profile review status">
        <span class="profile-review-badge">Profile review in progress</span>
        <p>Scentory is rechecking the exact note pyramid and performance sources for this perfume. Until that review is complete, we do not show detailed note claims here. Please sample 5 ML first.</p>
        ${bestPlaces.length ? `<div class="profile-fact"><b>Catalogue use profile</b><span>${bestPlaces.map(escapeHtml).join(' · ')}</span></div>` : ''}
      </section>
    `;
  }

  return `
    <section class="verified-perfume-details" aria-label="Source-checked perfume profile">
      <span class="profile-review-badge checked">Source-checked profile</span>
      ${character.length ? `<div class="profile-fact"><b>Scent character</b><span>${character.map(escapeHtml).join(' · ')}</span></div>` : ''}
      ${noteRows.map(([label, values]) => `<div class="profile-fact"><b>${escapeHtml(label)}</b><span>${values.map(escapeHtml).join(' · ')}</span></div>`).join('')}
      <div class="profile-fact"><b>Expected longevity</b><span>${escapeHtml(longevity)}. ${escapeHtml(details.performance || 'Skin, weather, batch and atomizer can change real-world performance.')}</span></div>
      ${bestPlaces.length ? `<div class="profile-fact"><b>Best places to wear</b><span>${bestPlaces.map(escapeHtml).join(' · ')}</span></div>` : ''}
      ${bestWeather.length ? `<div class="profile-fact"><b>Best conditions</b><span>${bestWeather.map(escapeHtml).join(' · ')}</span></div>` : ''}
      ${details.sourceNote ? `<p class="profile-source-note">${escapeHtml(details.sourceNote)}</p>` : ''}
      <p class="profile-source-note">Performance is guidance, not a guarantee. Skin chemistry, heat, humidity and spray count can change the result.</p>
    </section>
  `;
}

function renderPriceTiles(p, extraClass = '') {
  const hasAvailable = productHasAvailableSize(p);
  const upcoming = isUpcoming(p);
  return Object.entries(p.sizes || {}).map(([ml, item]) => {
    const disabled = upcoming || !hasAvailable || !item.available || item.price === null;
    const selected = !disabled && !!getCartItem(p.id, ml);
    const label = item.price === null ? 'N/A' : taka(item.price);
    const note = upcoming ? '<em>Soon</em>' : (item.premium ? '<em>Premium</em>' : (disabled ? '<em>Out</em>' : '<em>&nbsp;</em>'));
    const selectedBadge = `<span class="selected-qty ${selected ? '' : 'hide'}">×${getCartQty(p.id, ml)}</span>`;
    return `
      <button type="button" class="price-tile ${extraClass} ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}"
        ${disabled ? 'disabled' : ''}
        data-id="${escapeHtml(p.id)}"
        data-ml="${escapeHtml(ml)}"
        onclick="toggleCartItem('${escapeHtml(p.id)}', '${escapeHtml(ml)}')"
        aria-pressed="${selected ? 'true' : 'false'}">
        <span class="tile-top">
          <span class="ml-label">${displayMl(ml)}</span>
          ${selectedBadge}
        </span>
        <span class="tile-price">${label}</span>
        ${note}
      </button>
    `;
  }).join('');
}

function renderProductCardV3002(p) {
  const hasAvailable = productHasAvailableSize(p);
  const upcoming = isUpcoming(p);
  const profile = getScentProfile(p);
  const statusText = upcoming ? 'Upcoming' : (hasAvailable ? 'Available' : 'Out of stock');
  return `
    <article id="perfume-${escapeHtml(p.id)}" data-perfume-id="${escapeHtml(p.id)}" class="product ${hasAvailable ? '' : 'sold-out'} ${upcoming ? 'upcoming-card' : ''}">
      <button type="button" class="product-image-wrap" data-full-image="${escapeHtml(imagePath(p))}" data-full-title="${escapeHtml(p.name)}" onclick="openImageModal(this.dataset.fullImage, this.dataset.fullTitle)" aria-label="Open ${escapeHtml(p.name)} photo">
        <img class="product-image" src="${escapeHtml(imagePath(p))}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="hideBrokenImage(this)">
      </button>
      <div class="product-main">
        <div class="product-head">
          <h3>${escapeHtml(p.name)}</h3>
          <div class="tags">
            <span class="tag ${upcoming ? 'upcoming' : (hasAvailable ? '' : 'out')}">${statusText}</span>
            ${renderTagPills(p, 3)}
          </div>
        </div>
        <p class="product-reco">${escapeHtml(profile.recommendation)}</p>
        <button type="button" class="details-link" onclick="openProductDetails('${escapeHtml(p.id)}')">View Details</button>
      </div>
      <div class="price-buttons four-row">${renderPriceTiles(p)}</div>
    </article>
  `;
}

function openProductDetails(id) {
  const p = getPerfumeById(id);
  if (!p || !productModal || !productModalContent) return;
  const hasAvailable = productHasAvailableSize(p);
  const upcoming = isUpcoming(p);
  const profile = getScentProfile(p);
  const statusText = upcoming ? 'Upcoming' : (hasAvailable ? 'Available' : 'Out of stock');
  productModalContent.innerHTML = `
    <div class="product-modal-grid">
      <button type="button" class="product-modal-image" data-full-image="${escapeHtml(imagePath(p))}" data-full-title="${escapeHtml(p.name)}" onclick="openImageModal(this.dataset.fullImage, this.dataset.fullTitle)">
        <img src="${escapeHtml(imagePath(p))}" alt="${escapeHtml(p.name)}" loading="eager" decoding="async">
      </button>
      <div class="product-modal-copy">
        <span class="tag ${upcoming ? 'upcoming' : (hasAvailable ? '' : 'out')}">${statusText}</span>
        <h2>${escapeHtml(p.name)}</h2>
        <div class="tags modal-tags">${profile.tags.map(tag => `<span class="tag scent-tag">${escapeHtml(tag)}</span>`).join('')}</div>
        <p>${escapeHtml(profile.recommendation)}</p>
        ${renderIntelligenceDetails(p)}
        <p class="small-note modal-note">Tap a size below to add or remove it from your order.</p>
        <div class="price-buttons four-row modal-price-grid">${renderPriceTiles(p, 'modal-price-tile')}</div>
        <a class="details-link" href="perfume/${encodeURIComponent(p.id)}.html">Open shareable product page</a>
      </div>
    </div>
  `;
  productModal.classList.add('show');
  productModal.setAttribute('aria-hidden', 'false');
  syncModalBodyState();
  activateAccessibleModal(productModal, productModalClose);
}

function closeProductDetails() {
  if (!productModal) return;
  productModal.classList.remove('show');
  productModal.setAttribute('aria-hidden', 'true');
  syncModalBodyState();
  deactivateAccessibleModal(productModal);
}


const getPerfumeById = id => perfumes.find(p => p.id === id) || null;
const getCartImage = item => item.image || imagePath(getPerfumeById(item.id) || { id: item.id, image: '' });
const normalizeText = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function getSearchMatches(term, limit = 10) {
  const query = normalizeText(term);
  if (!query) return [];
  return perfumes
    .map((p, index) => {
      const name = normalizeText(p.name);
      const shortName = normalizeText(shortOrderName(p.name));
      const idText = normalizeText(p.id);
      const haystack = `${name} ${shortName} ${idText}`;
      if (!haystack.includes(query)) return null;
      let score = 50;
      if (name === query || shortName === query) score = 0;
      else if (name.startsWith(query) || shortName.startsWith(query)) score = 5;
      else if (name.includes(query)) score = 12 + name.indexOf(query);
      else if (shortName.includes(query)) score = 18 + shortName.indexOf(query);
      else score = 35 + haystack.indexOf(query);
      if (isUpcoming(p)) score += 8;
      if (!productHasAvailableSize(p) && !isUpcoming(p)) score += 16;
      return { p, score, index };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map(item => item.p);
}

function hideSearchSuggestions() {
  if (!searchSuggestions) return;
  searchSuggestions.classList.remove('show');
  searchSuggestions.innerHTML = '';
  searchInput?.setAttribute('aria-expanded', 'false');
}

function renderSearchSuggestions() {
  if (!searchSuggestions || !searchInput) return;
  const term = searchInput.value.trim();
  if (!term) {
    hideSearchSuggestions();
    return;
  }

  const matches = getSearchMatches(term, 10);
  if (!matches.length) {
    searchSuggestions.innerHTML = '<div class="search-suggestion-empty">No perfume found</div>';
    searchSuggestions.classList.add('show');
    searchInput.setAttribute('aria-expanded', 'true');
    return;
  }

  searchSuggestions.innerHTML = matches.map(p => {
    const available = productHasAvailableSize(p);
    const upcoming = isUpcoming(p);
    const statusText = upcoming ? 'Upcoming' : (available ? 'Available' : 'Out of stock');
    return `
      <button type="button" class="search-suggestion" data-suggest-id="${escapeHtml(p.id)}" role="option">
        <img src="${escapeHtml(imagePath(p))}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none'">
        <span>
          <b>${escapeHtml(p.name)}</b>
          <small>${statusText}</small>
        </span>
        <em>View</em>
      </button>
    `;
  }).join('');

  searchSuggestions.classList.add('show');
  searchInput.setAttribute('aria-expanded', 'true');
  searchSuggestions.querySelectorAll('.search-suggestion[data-suggest-id]').forEach(btn => {
    btn.addEventListener('mousedown', event => event.preventDefault());
    btn.addEventListener('click', () => selectSearchPerfume(btn.dataset.suggestId));
  });
}

function selectSearchPerfume(id) {
  const perfume = getPerfumeById(id);
  if (!perfume) return;

  // Exact selection: keep one dedicated result, close the keyboard, then perform one jump.
  if (searchInput) {
    searchInput.value = perfume.name;
    searchInput.dataset.selectedId = id;
    searchInput.blur();
  }
  if (stockFilter) stockFilter.value = 'all';
  if (tagFilter) tagFilter.value = 'all';
  hideSearchSuggestions();
  renderProducts();

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const card = document.getElementById(`perfume-${id}`);
    if (!card) {
      showToast('Could not open the selected perfume. Please try again.', 'error');
      return;
    }
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    highlightElement(card, 'jump-highlight', 900);
  }));
}

function showToast(message, type = 'info') {
  if (!toastBox) return alert(message);
  toastBox.textContent = message;
  toastBox.className = `toast show ${type}`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastBox.className = 'toast', 2600);
}

function injectCatalogueStructuredData() {
  const oldNode = document.getElementById('catalogueStructuredData');
  oldNode?.remove();
  const availableProducts = perfumes.filter(productHasAvailableSize);
  const itemList = availableProducts.map((product, index) => {
    const offers = Object.entries(product.sizes || {})
      .filter(([, item]) => item?.available && Number.isFinite(Number(item.price)))
      .map(([size, item]) => ({
        '@type': 'Offer',
        name: `${product.name} — ${displayMl(size)}`,
        price: Number(item.price),
        priceCurrency: 'BDT',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: `${location.origin}${location.pathname}#perfume-${encodeURIComponent(product.id)}`
      }));
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${location.origin}${location.pathname}#product-${encodeURIComponent(product.id)}`,
        name: product.name,
        image: new URL(imagePath(product), location.href).href,
        description: product.recommendation || `${product.name} perfume decants from Scentory Bangladesh.`,
        category: 'Perfume decant',
        offers
      }
    };
  });
  const node = document.createElement('script');
  node.id = 'catalogueStructuredData';
  node.type = 'application/ld+json';
  node.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Scentory perfume decants available in Bangladesh',
    numberOfItems: itemList.length,
    itemListElement: itemList
  });
  document.head.appendChild(node);
}

async function loadPerfumes() {
  try {
    productGrid.innerHTML = '<p class="order-items empty">Loading perfumes...</p>';
    const response = await fetch(`perfumes.json?v=${DATA_VERSION}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load perfume database');
    perfumes = await response.json();
    normalizeCartAfterLoad();
    injectCatalogueStructuredData();
    renderProducts();
    renderHotArrivals();
    renderBestSelling();
    renderCart();
  } catch (error) {
    productGrid.innerHTML = '<p class="order-items empty">Could not load the price list. Please refresh the page.</p>';
    console.error(error);
  }
}

function productHasAvailableSize(p) {
  const status = p.status || 'available';
  if (status === 'out' || status === 'upcoming') return false;
  return Object.values(p.sizes || {}).some(s => s.available && s.price !== null);
}

function isUpcoming(p) {
  return (p.status || 'available') === 'upcoming';
}

function getCartItem(id, ml) {
  const key = `${id}-${ml}`;
  return cart.find(item => item.key === key) || null;
}

function getCartQty(id, ml) {
  return getCartItem(id, ml)?.qty || 0;
}

function normalizeCartAfterLoad() {
  if (!Array.isArray(cart)) cart = [];
  let removedCount = 0;
  let updatedCount = 0;
  const normalizedByKey = new Map();
  cart.forEach(item => {
    const perfume = perfumes.find(p => p.id === item.id);
    const size = perfume?.sizes?.[item.ml];
    const price = Number(size?.price);
    if (!perfume || ['out','upcoming'].includes(perfume.status || 'available') || !size || !size.available || !Number.isFinite(price) || price < 0) {
      removedCount += 1;
      return;
    }
    const key = `${perfume.id}-${item.ml}`;
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(item.qty) || 1)));
    const previous = normalizedByKey.get(key);
    const normalized = {
      key: `${perfume.id}-${item.ml}`,
      id: perfume.id,
      ml: item.ml,
      name: perfume.name,
      image: imagePath(perfume),
      price,
      premium: !!size.premium,
      qty: Math.min(20, quantity + (previous?.qty || 0))
    };
    if (Number(item.price) !== price || item.name !== perfume.name || item.premium !== !!size.premium) updatedCount += 1;
    normalizedByKey.set(key, normalized);
  });
  cart = [...normalizedByKey.values()];
  saveCart();
  if (removedCount || updatedCount) {
    const parts = [];
    if (removedCount) parts.push(`${removedCount} unavailable or invalid cart item${removedCount === 1 ? '' : 's'} removed`);
    if (updatedCount) parts.push(`${updatedCount} item${updatedCount === 1 ? '' : 's'} refreshed to current catalogue details`);
    showToast(parts.join(' · '), removedCount ? 'info' : 'success');
  }
}

function renderProductCard(p) {
  const hasAvailable = productHasAvailableSize(p);
  const upcoming = isUpcoming(p);
  const priceButtons = Object.entries(p.sizes || {}).map(([ml, item]) => {
    const disabled = upcoming || !hasAvailable || !item.available || item.price === null;
    const selected = !disabled && !!getCartItem(p.id, ml);
    const label = item.price === null ? 'N/A' : taka(item.price);
    const note = upcoming ? '<em>Soon</em>' : (item.premium ? '<em>Premium</em>' : (disabled ? '<em>Out</em>' : '<em>&nbsp;</em>'));
    const selectedBadge = `<span class="selected-qty ${selected ? '' : 'hide'}">×${getCartQty(p.id, ml)}</span>`;
    return `
      <button type="button" class="price-tile ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}"
        ${disabled ? 'disabled' : ''}
        data-id="${p.id}"
        data-ml="${ml}"
        onclick="toggleCartItem('${p.id}', '${ml}')"
        aria-pressed="${selected ? 'true' : 'false'}">
        <span class="tile-top">
          <span class="ml-label">${displayMl(ml)}</span>
          ${selectedBadge}
        </span>
        <span class="tile-price">${label}</span>
        ${note}
      </button>
    `;
  }).join('');

  return `
    <article id="perfume-${p.id}" data-perfume-id="${p.id}" class="product ${hasAvailable ? '' : 'sold-out'} ${upcoming ? 'upcoming-card' : ''}">
      <button type="button" class="product-image-wrap" data-full-image="${escapeHtml(imagePath(p))}" data-full-title="${escapeHtml(p.name)}" onclick="openImageModal(this.dataset.fullImage, this.dataset.fullTitle)" aria-label="Open ${escapeHtml(p.name)} photo">
        <img class="product-image" src="${escapeHtml(imagePath(p))}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="hideBrokenImage(this)">
      </button>
      <div class="product-main">
        <div class="product-head">
          <h3>${p.name}</h3>
          <div class="tags">
            <span class="tag ${upcoming ? 'upcoming' : (hasAvailable ? '' : 'out')}">${upcoming ? 'Upcoming' : (hasAvailable ? 'Available' : 'Out of stock')}</span>
          </div>
        </div>
      </div>
      <div class="price-buttons four-row">${priceButtons}</div>
    </article>
  `;
}



function renderHotArrivals() {
  if (!hotArrivalsGrid) return;
  const items = HOT_ARRIVAL_IDS
    .map(id => perfumes.find(p => p.id === id))
    .filter(p => p && productHasAvailableSize(p) && !isUpcoming(p));

  if (!items.length) {
    hotArrivalsGrid.innerHTML = '<p class="order-items empty">No hot arrivals found.</p>';
    return;
  }

  hotArrivalsGrid.innerHTML = items.map((p, index) => {
    const availableSizes = Object.entries(p.sizes || {})
      .filter(([, item]) => item.available && item.price !== null)
      .map(([ml, item]) => `${displayMl(ml)} ${taka(item.price)}`)
      .slice(0, 3)
      .join(' · ');
    return `
      <button type="button" class="hot-arrival-card" data-target-id="${escapeHtml(p.id)}" aria-label="View ${escapeHtml(p.name)} in price list">
        <span class="hot-arrival-badge">#${index + 1}</span>
        <span class="hot-arrival-photo-wrap">
          <img src="${escapeHtml(imagePath(p))}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.style.display='none'">
        </span>
        <span class="hot-arrival-copy">
          <b>${escapeHtml(p.name)}</b>
          <small>${availableSizes || 'Tap to view prices'}</small>
        </span>
      </button>
    `;
  }).join('');

  hotArrivalsGrid.querySelectorAll('.hot-arrival-card[data-target-id]').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      scrollToPerfume(btn.dataset.targetId);
    });
  });
}

function renderBestSelling() {
  if (!bestSellingGrid) return;
  const items = BEST_SELLING_IDS
    .map(id => perfumes.find(p => p.id === id))
    .filter(Boolean);

  if (!items.length) {
    bestSellingGrid.innerHTML = '<p class="order-items empty">No best-selling perfume found.</p>';
    return;
  }

  bestSellingGrid.innerHTML = items.map((p, index) => `
    <button type="button" class="best-seller-card" data-target-id="${escapeHtml(p.id)}" aria-label="View ${escapeHtml(p.name)} in price list">
      <span class="best-rank">${index + 1}</span>
      <img src="${escapeHtml(imagePath(p))}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.style.display='none'">
      <span class="best-seller-copy">
        <b>${escapeHtml(p.name)}</b>
        <small>Tap to view & add</small>
      </span>
      <span class="best-arrow">↘</span>
    </button>
  `).join('');

  bestSellingGrid.querySelectorAll('.best-seller-card[data-target-id]').forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      scrollToPerfume(btn.dataset.targetId);
    });
  });
}

function syncTopbarHeight() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return 0;
  const height = Math.ceil(topbar.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--scentory-live-header-h', `${height}px`);
  return height;
}

function scrollElementIntoView(element, extraOffset = 0, behavior = 'smooth') {
  if (!element) return;
  syncTopbarHeight();
  if (extraOffset) element.style.scrollMarginTop = `calc(var(--scentory-live-header-h, 112px) + ${extraOffset}px)`;
  element.scrollIntoView({ behavior, block: 'start' });
}

function smoothScrollToElement(element, extraOffset = 0) {
  scrollElementIntoView(element, extraOffset, 'smooth');
}

function highlightElement(element, className = 'jump-highlight', duration = 900) {
  if (!element) return;
  element.classList.remove(className);
  element.classList.add(className);
  clearTimeout(element._scentoryHighlightTimer);
  element._scentoryHighlightTimer = setTimeout(() => element.classList.remove(className), duration);
}

function scrollToOrderCard() {
  const orderCard = document.getElementById('myOrder');
  if (!orderCard) return;
  requestAnimationFrame(() => scrollElementIntoView(orderCard, 10, 'smooth'));
}

function scrollToPerfume(id, options = {}) {
  if (!id) return;
  const perfume = getPerfumeById(id);
  if (!perfume) {
    showToast('Perfume not found in the price list.', 'error');
    return;
  }

  if (searchInput) {
    searchInput.value = perfume.name;
    searchInput.dataset.selectedId = id;
    searchInput.blur();
  }
  if (stockFilter) stockFilter.value = 'all';
  if (tagFilter) tagFilter.value = 'all';
  hideSearchSuggestions();
  renderProducts();

  // One render, one scroll. Two frames only allow layout/keyboard state to settle.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const card = document.getElementById(`perfume-${id}`);
    if (!card) {
      showToast('Could not open the selected perfume. Please try again.', 'error');
      return;
    }
    syncTopbarHeight();
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    highlightElement(card, 'jump-highlight', 900);
  }));
}

function renderProducts() {
  const term = (searchInput?.value || '').trim().toLowerCase();
  const exactId = searchInput?.dataset.selectedId || '';
  const stock = stockFilter?.value || 'all';
  const selectedTag = tagFilter?.value || 'all';

  const matchesTerm = p => exactId
    ? p.id === exactId
    : (!term || `${p.name} ${p.id} ${shortOrderName(p.name)}`.toLowerCase().includes(term));

  const filtered = perfumes.filter(p => {
    const hasAvailable = productHasAvailableSize(p);
    const upcoming = isUpcoming(p);
    const matchesStock = stock === 'all' ||
      (stock === 'available' && hasAvailable) ||
      (stock === 'out' && !hasAvailable && !upcoming);
    const profile = getScentProfile(p);
    const matchesTag = selectedTag === 'all' || profile.tags.includes(selectedTag);
    return matchesTerm(p) && matchesStock && matchesTag;
  });

  if (perfumeCount) perfumeCount.textContent = `${perfumes.length} Perfumes`;

  if (!filtered.length) {
    productGrid.innerHTML = '<p class="order-items empty">No perfume found. Try a different search or tag.</p>';
  } else {
    productGrid.innerHTML = filtered.map(renderProductCardV3002).join('');
  }
  updatePriceTileStates();
}


function openImageModal(src, title) {
  if (!imageModal || !imageModalImg) return;
  imageModalImg.src = src;
  imageModalImg.alt = title || 'Product photo';
  if (imageModalTitle) imageModalTitle.textContent = title || '';
  imageModal.classList.add('show');
  imageModal.setAttribute('aria-hidden', 'false');
  syncModalBodyState();
  activateAccessibleModal(imageModal, imageModalClose);
}

function closeImageModal() {
  if (!imageModal || !imageModalImg) return;
  imageModal.classList.remove('show');
  imageModal.setAttribute('aria-hidden', 'true');
  syncModalBodyState();
  deactivateAccessibleModal(imageModal);
  imageModalImg.src = '';
}

function updatePriceTileStates() {
  document.querySelectorAll('.price-tile[data-id][data-ml]').forEach(btn => {
    const id = btn.dataset.id;
    const ml = btn.dataset.ml;
    const item = getCartItem(id, ml);
    const selected = !!item;
    btn.classList.toggle('selected', selected);
    btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
    const qtyBadge = btn.querySelector('.selected-qty');
    if (qtyBadge) {
      qtyBadge.textContent = selected ? `×${item.qty}` : '';
      qtyBadge.classList.toggle('hide', !selected);
    }
  });
}

function addToCart(id, ml) {
  const perfume = perfumes.find(p => p.id === id);
  if (!perfume || ['out','upcoming'].includes(perfume.status || 'available') || !perfume.sizes || !perfume.sizes[ml] || !perfume.sizes[ml].available || perfume.sizes[ml].price === null) return;
  const key = `${id}-${ml}`;
  if (cart.find(item => item.key === key)) return;
  cart.push({
    key,
    id,
    ml,
    name: perfume.name,
    image: imagePath(perfume),
    price: perfume.sizes[ml].price,
    premium: perfume.sizes[ml].premium,
    qty: 1
  });
  saveCart();
  renderCart();
  updatePriceTileStates();
  return true;
}

function removeFromCart(id, ml) {
  const key = `${id}-${ml}`;
  cart = cart.filter(item => item.key !== key);
  saveCart();
  renderCart();
  updatePriceTileStates();
}

function toggleCartItem(id, ml) {
  const perfume = perfumes.find(p => p.id === id);
  const existing = getCartItem(id, ml);
  if (existing) {
    removeFromCart(id, ml);
    showToast(`${perfume?.name || 'Item'} was removed.`, 'info');
  } else {
    const added = addToCart(id, ml);
    if (added) {
      showToast(`${perfume?.name || 'Item'} was added. Tap the bottom order bar to review.`, 'success');
    }
  }
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
  updatePriceTileStates();
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getDeliveryCharge() {
  return Number(deliveryLocation.value || 0);
}

function hasDeliverySelected() {
  return deliveryLocation && deliveryLocation.value !== '';
}

function setFieldError(field, message = '') {
  if (!field) return;
  const hasError = Boolean(message);
  field.classList.toggle('field-error', hasError);
  field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  const errorNode = document.getElementById(`${field.id}Error`);
  if (errorNode) {
    errorNode.textContent = hasError ? String(message) : '';
    errorNode.hidden = !hasError;
  }
}

function setOrderFormError(message = '') {
  if (!orderFormError) return;
  orderFormError.textContent = message;
  orderFormError.hidden = !message;
}

function validateOrder({ requireCustomer = true } = {}) {
  [deliveryLocation, customerName, customerPhone, customerAddress].forEach(field => setFieldError(field));
  setOrderFormError();
  const errors = [];
  if (!cart.length) errors.push({ field: null, message: 'Your order is empty. Add at least one perfume before continuing.' });
  if (!hasDeliverySelected()) errors.push({ field: deliveryLocation, message: 'Select Inside Dhaka or Outside Dhaka.' });

  if (requireCustomer) {
    const name = (customerName?.value || '').trim();
    const phone = (customerPhone?.value || '').replace(/[\s-]/g, '');
    const address = (customerAddress?.value || '').trim();
    if (!name) errors.push({ field: customerName, message: 'Enter the customer name.' });
    if (!phone) errors.push({ field: customerPhone, message: 'Enter a phone number.' });
    else if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(phone)) errors.push({ field: customerPhone, message: 'Enter a valid Bangladesh mobile number, such as 01XXXXXXXXX.' });
    if (!address) errors.push({ field: customerAddress, message: 'Enter the complete delivery address.' });
    else if (address.length < 8) errors.push({ field: customerAddress, message: 'Add more address details, including the area or district.' });
  }

  if (errors.length) {
    errors.forEach(error => error.field ? setFieldError(error.field, error.message) : setOrderFormError(error.message));
    const first = errors[0];
    showToast(first.message, 'error');
    (first.field || orderFormError)?.focus();
    return false;
  }
  return true;
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = getSubtotal();
  const delivery = getDeliveryCharge();
  const total = subtotal + delivery;

  if (cartCount) cartCount.textContent = itemCount;
  if (cart.length) setOrderFormError();
  if (!cart.length) {
    orderItems.className = 'order-items empty';
    orderItems.innerHTML = 'No item added yet.';
  } else {
    orderItems.className = 'order-items';
    orderItems.innerHTML = cart.map(item => {
      const unitText = `${displayMl(item.ml)}${item.premium ? ' Premium Atomizer' : ''}`;
      const lineTotal = item.price * item.qty;
      const priceText = item.qty > 1
        ? `${taka(item.price)} × ${item.qty} = ${taka(lineTotal)}`
        : `${taka(item.price)}`;
      const thumbSrc = getCartImage(item);
      return `
        <div class="order-item">
          <button type="button" class="order-item-thumb" data-full-image="${escapeHtml(thumbSrc)}" data-full-title="${escapeHtml(item.name)}" onclick="openImageModal(this.dataset.fullImage, this.dataset.fullTitle)" aria-label="View ${escapeHtml(item.name)} photo">
            <img src="${escapeHtml(thumbSrc)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" onerror="this.closest('.order-item-thumb')?.classList.add('image-missing')">
          </button>
          <div class="order-item-copy">
            <strong>${escapeHtml(item.name)}</strong>
            <small>${unitText}</small>
            <span class="cart-price-line">${priceText}</span>
          </div>
          <div class="order-item-actions">
            <span class="line-total">${taka(lineTotal)}</span>
            <div class="qty-controls">
              <button onclick="changeQty('${item.key}', -1)" aria-label="Decrease quantity">−</button>
              <b>${item.qty}</b>
              <button onclick="changeQty('${item.key}', 1)" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  grandTotal.textContent = taka(total);
  updateFloatingCart(itemCount, total);
}

function updateFloatingCart(itemCount, total) {
  if (!floatingCart) return;
  floatingCart.classList.toggle('show', itemCount > 0);
  if (floatingCartCount) floatingCartCount.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
  if (floatingCartTotal) floatingCartTotal.textContent = taka(total);
}

function buildPrivateOrderPayload() {
  const subtotal = getSubtotal();
  const delivery = getDeliveryCharge();
  const totalDue = subtotal + delivery;
  return {
    orderId: `SC-${Date.now()}`,
    date: new Date().toISOString(),
    customer: {
      name: (customerName?.value || '').trim(),
      phone: (customerPhone?.value || '').trim(),
      address: (customerAddress?.value || '').trim()
    },
    deliveryCharge: delivery,
    subtotal,
    totalDue,
    source: 'Scentory Website',
    items: cart.map(item => ({
      productId: item.id,
      productName: item.name,
      sizeText: displayMl(item.ml),
      ml: Number(String(item.ml).replace(/[^0-9.]/g, '')),
      qty: Number(item.qty || 1),
      sellingPrice: Number(item.price || 0),
      lineSales: Number(item.price || 0) * Number(item.qty || 1)
    }))
  };
}

function saveOrderToPrivateSheet() {
  if (!GOOGLE_SCRIPT_URL || !GOOGLE_SCRIPT_URL.includes('script.google.com')) return;
  const payload = JSON.stringify(buildPrivateOrderPayload());
  try {
    const blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
    if (navigator.sendBeacon && navigator.sendBeacon(GOOGLE_SCRIPT_URL, blob)) return;
  } catch (e) {}
  try {
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: payload,
      keepalive: true
    }).catch(() => {});
  } catch (e) {}
}

function buildOrderText() {
  const subtotal = getSubtotal();
  const delivery = getDeliveryCharge();
  const totalDue = subtotal + delivery;
  const name = (customerName?.value || '').trim();
  const phone = (customerPhone?.value || '').trim();
  const address = (customerAddress?.value || '').trim();
  const productLines = cart.map((item, index) => {
    const qtyText = item.qty > 1 ? ` - ${item.qty} pcs` : '';
    return `${index + 1}. ${shortOrderName(item.name)} - ${displayMl(item.ml)}${qtyText}`;
  });

  return [
    `Name: ${name}`,
    `Delivery Address: ${address}`,
    `Phone Number: ${phone}`,
    '',
    'Products -',
    ...productLines,
    '',
    `Total - ${taka(subtotal)}`,
    `Delivery charge - ${taka(delivery)}`,
    `Total Due - ${taka(totalDue)}`
  ].join('\n');
}

async function copyOrder(showAlert = true) {
  if (!validateOrder({ requireCustomer: true })) return false;
  const text = buildOrderText();
  try {
    await navigator.clipboard.writeText(text);
    if (showAlert) showToast('Order copied successfully.', 'success');
    return true;
  } catch (e) {
    prompt('Copy this order text:', text);
    return true;
  }
}

function sendWhatsAppOrder() {
  if (!validateOrder({ requireCustomer: true })) return;
  saveOrderToPrivateSheet();
  const text = encodeURIComponent(buildOrderText());
  const url = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
}

async function sendFacebookOrder() {
  if (!validateOrder({ requireCustomer: true })) return;
  const orderText = buildOrderText();
  saveOrderToPrivateSheet();
  try {
    await navigator.clipboard.writeText(orderText);
  } catch (e) {}
  const separator = FACEBOOK_PAGE_URL.includes('?') ? '&' : '?';
  const messengerUrl = `${FACEBOOK_PAGE_URL}${separator}text=${encodeURIComponent(orderText)}`;
  window.open(messengerUrl, '_blank');
  showToast('Order copied. Messenger is opening — paste and send to confirm.', 'success');
}

function clearOrder() {
  cart = [];
  saveCart();
  localStorage.removeItem('scentoryCustomer');
  [customerName, customerPhone, customerAddress].forEach(field => {
    if (field) {
      field.value = '';
      setFieldError(field, false);
    }
  });
  if (deliveryLocation) {
    deliveryLocation.value = '';
    setFieldError(deliveryLocation, false);
  }
  setOrderFormError();
  renderCart();
  updatePriceTileStates();
  showToast('Order cleared. Everything is reset.', 'success');
}

function saveCart() { localStorage.setItem('scentoryCart', JSON.stringify(cart)); }
function restoreCart() {
  try { cart = JSON.parse(localStorage.getItem('scentoryCart') || '[]'); }
  catch { cart = []; }
}
function saveCustomerData() {
  const data = {
    name: customerName?.value || '',
    phone: customerPhone?.value || '',
    address: customerAddress?.value || '',
    delivery: deliveryLocation?.value || ''
  };
  localStorage.setItem('scentoryCustomer', JSON.stringify(data));
}
function restoreCustomerData() {
  try {
    const data = JSON.parse(localStorage.getItem('scentoryCustomer') || '{}');
    if (customerName && data.name) customerName.value = data.name;
    if (customerPhone && data.phone) customerPhone.value = data.phone;
    if (customerAddress && data.address) customerAddress.value = data.address;
    if (deliveryLocation && data.delivery) deliveryLocation.value = data.delivery;
  } catch {}
}




searchInput.addEventListener('input', () => {
  delete searchInput.dataset.selectedId;
  renderSearchSuggestions();
  // Clearing the field immediately restores the full catalogue; typing itself stays lightweight.
  if (!searchInput.value.trim()) renderProducts();
});
searchInput.addEventListener('focus', renderSearchSuggestions);
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    hideSearchSuggestions();
    searchInput.blur();
  }
  if (event.key === 'Enter') {
    const first = getSearchMatches(searchInput.value, 1)[0];
    if (first) {
      event.preventDefault();
      selectSearchPerfume(first.id);
    }
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.toolbar') && !event.target.closest('.top-search-wrap')) hideSearchSuggestions();
});
stockFilter.addEventListener('change', () => {
  renderProducts();
  renderSearchSuggestions();
});
tagFilter?.addEventListener('change', () => {
  renderProducts();
  renderSearchSuggestions();
});

deliveryLocation.addEventListener('change', () => { saveCustomerData(); renderCart(); setFieldError(deliveryLocation, false); });
[customerName, customerPhone, customerAddress].forEach(field => {
  field?.addEventListener('input', () => { saveCustomerData(); setFieldError(field, false); });
});
document.getElementById('copyOrder').addEventListener('click', () => copyOrder(true));
document.getElementById('sendWhatsApp').addEventListener('click', sendWhatsAppOrder);
document.getElementById('sendFacebook').addEventListener('click', sendFacebookOrder);
document.getElementById('clearOrder').addEventListener('click', clearOrder);

if (floatingCart) {
  floatingCart.addEventListener('click', event => {
    event.preventDefault();
    scrollToOrderCard();
    if (history && history.replaceState) {
      history.replaceState(null, '', '#myOrder');
    }
  });
}

const topCartButton = document.querySelector('.cart-pill');
const brandHomeButton = document.querySelector('.brand-center');
if (topCartButton) {
  topCartButton.addEventListener('click', event => {
    event.preventDefault();
    scrollToOrderCard();
    if (history && history.replaceState) {
      history.replaceState(null, '', '#myOrder');
    }
  });
}

if (brandHomeButton) {
  brandHomeButton.addEventListener('click', event => {
    event.preventDefault();
    if (searchInput) { searchInput.value = ''; delete searchInput.dataset.selectedId; searchInput.blur(); }
    if (stockFilter) stockFilter.value = 'all';
    if (tagFilter) tagFilter.value = 'all';
    hideSearchSuggestions();
    renderProducts();
    const collection = document.getElementById('collection');
    if (collection) requestAnimationFrame(() => scrollElementIntoView(collection, 8, 'smooth'));
    if (history && history.replaceState) {
      history.replaceState(null, '', '#collection');
    }
  });
}



imageModalClose?.addEventListener('click', closeImageModal);
productModalClose?.addEventListener('click', closeProductDetails);
productModal?.addEventListener('click', event => {
  if (event.target === productModal) closeProductDetails();
});
imageModal?.addEventListener('click', event => {
  if (event.target === imageModal) closeImageModal();
});
document.addEventListener('keydown', event => {
  const modal = getTopOpenModal();
  if (!modal) return;
  if (event.key === 'Tab') {
    const focusable = getFocusableElements(modal);
    if (!focusable.length) {
      event.preventDefault();
      modal.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!modal.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.key === 'Escape') {
    if (modal === imageModal) closeImageModal();
    else if (modal === productModal) closeProductDetails();
    // Discovery modal owns its close routine in the intelligence script.
  }
});
document.addEventListener('focusin', event => {
  const modal = getTopOpenModal();
  if (!modal || modal.contains(event.target)) return;
  (getFocusableElements(modal)[0] || modal).focus({ preventScroll: true });
});

restoreCart();
restoreCustomerData();

// Keep fixed-header spacing accurate across mobile orientation, browser UI and font/layout changes.
window.addEventListener('resize', syncTopbarHeight, { passive: true });
window.addEventListener('orientationchange', syncTopbarHeight, { passive: true });
if ('ResizeObserver' in window) {
  const headerObserver = new ResizeObserver(() => syncTopbarHeight());
  const observedTopbar = document.querySelector('.topbar');
  if (observedTopbar) headerObserver.observe(observedTopbar);
}
requestAnimationFrame(syncTopbarHeight);
loadPerfumes();
