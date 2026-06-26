let perfumes = [];
let cart = [];

const WHATSAPP_NUMBER = '8801410939978';
const FACEBOOK_PAGE_URL = 'https://m.me/Scentorybd';
// Paste your deployed Google Apps Script Web App URL below. Keep it blank until setup.
const GOOGLE_SCRIPT_URL = ''; // Example: https://script.google.com/macros/s/XXXXX/exec
const DATA_VERSION = '3002';
const BEST_SELLING_IDS = [
  '212-men-by-carolina-herrera',
  'club-de-nuit-intesne-man-edp',
  'kenzo-homme-edt-intense',
  'marwa-arabian-prestige-edp'
];

const HOT_ARRIVAL_IDS = [
  'azzaro-the-most-wanted-edp-intense',
  'rayhaan-pacific-aloha-edp',
  'ysl-y-edp',
  'rayhaan-azul-edp'
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


const SCENT_TAGS = ['Fresh','Sweet','Oud','Blue','Aquatic','Office','Date Night','Summer','Winter','Budget Pick','Beast Mode'];
function getScentProfile(p) {
  const name = `${p?.name || ''} ${p?.id || ''}`.toLowerCase();
  const tags = new Set();
  const add = (...items) => items.forEach(item => tags.add(item));
  const priceValues = Object.values(p?.sizes || {}).filter(s => s && s.available && s.price !== null).map(s => Number(s.price));
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;

  if (/hawas|aqua|aquatica|voyage|cool water|blue|azul|iconic|turathi|pacific|aloha|chrome|daring|zenith|kaaf|maahir|universe|zeleny|after swim|island|mango ice|absolute chill/.test(name)) add('Fresh','Blue','Aquatic','Summer','Office');
  if (/oud|amber|khamrah|qahwa|asad|bourbon|opulent|pharaoh|layl|leather|ambre|teriaq|liquid brun|honor|glory|fursan|shuhrah|dynasty/.test(name)) add('Sweet','Oud','Winter','Date Night');
  if (/9pm|eros|wanted|intensely|rebel|night out|elixir|kobra|tiger|lion|wolf|vulcan|fakhar|najdia|haayati|rave|vanguard|dunescape|precieux|urban|intense man|club de nuit|snoi|supremacy/.test(name)) add('Date Night','Beast Mode','Winter');
  if (/yara|naseem|island dream|tropical|jungle|y\b|italia/.test(name)) add('Sweet','Summer','Date Night');
  if (/212|cool water|fattan|fareed|salvage|inspiration|brandy|najdia|haayati|voyage|blue/.test(name)) add('Budget Pick','Office');
  if (/office|fattan|212|cool water|voyage|blue|turathi|y\b|kaaf|maahir|zeleny/.test(name)) add('Office');
  if (minPrice && minPrice <= 220) add('Budget Pick');
  if (maxPrice >= 650) add('Beast Mode');
  if (!tags.size) add('Fresh','Office');

  const tagList = Array.from(tags).filter(t => SCENT_TAGS.includes(t)).slice(0, 5);
  let recommendation = 'A versatile pick for exploring something new from Scentory.';
  if (tagList.includes('Fresh') && tagList.includes('Office')) recommendation = 'Easy to wear for daily use, office, classes, and clean casual outings.';
  if (tagList.includes('Aquatic')) recommendation = 'A fresh choice for warm weather, daytime use, and clean shower-like vibes.';
  if (tagList.includes('Sweet') && tagList.includes('Date Night')) recommendation = 'Best for evening plans, date night, gifting, and people who enjoy sweeter scents.';
  if (tagList.includes('Oud')) recommendation = 'A deeper style for people who like rich, warm, and bold perfume profiles.';
  if (tagList.includes('Beast Mode')) recommendation = 'Choose this when you want a stronger scent with more presence.';
  if (tagList.includes('Budget Pick')) recommendation = 'Good value pick if you want to explore more scents without spending too much.';

  return { tags: tagList, recommendation };
}

function renderTagPills(p, limit = 4) {
  const profile = getScentProfile(p);
  return profile.tags.slice(0, limit).map(tag => `<span class="tag scent-tag">${escapeHtml(tag)}</span>`).join('');
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
        <p class="small-note modal-note">Tap a size below to add or remove it from your order.</p>
        <div class="price-buttons four-row modal-price-grid">${renderPriceTiles(p, 'modal-price-tile')}</div>
      </div>
    </div>
  `;
  productModal.classList.add('show');
  productModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeProductDetails() {
  if (!productModal) return;
  productModal.classList.remove('show');
  productModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
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
  if (searchInput) searchInput.value = perfume.name;
  if (stockFilter) stockFilter.value = 'all';
  hideSearchSuggestions();
  renderProducts();
  scrollToPerfume(id, { preserveSearch: true });
}

function showToast(message, type = 'info') {
  if (!toastBox) return alert(message);
  toastBox.textContent = message;
  toastBox.className = `toast show ${type}`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastBox.className = 'toast', 2600);
}

async function loadPerfumes() {
  try {
    productGrid.innerHTML = '<p class="order-items empty">Loading perfumes...</p>';
    const response = await fetch(`perfumes.json?v=${DATA_VERSION}`, { cache: 'force-cache' });
    if (!response.ok) throw new Error('Could not load perfume database');
    perfumes = await response.json();
    normalizeCartAfterLoad();
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
  cart = cart.map(item => {
    const perfume = perfumes.find(p => p.id === item.id);
    const size = perfume?.sizes?.[item.ml];
    if (!perfume || ['out','upcoming'].includes(perfume.status || 'available') || !size || !size.available || size.price === null) return null;
    return {
      key: `${perfume.id}-${item.ml}`,
      id: perfume.id,
      ml: item.ml,
      name: perfume.name,
      image: imagePath(perfume),
      price: size.price,
      premium: !!size.premium,
      qty: Math.max(1, Number(item.qty || 1))
    };
  }).filter(Boolean);
  saveCart();
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

function getFixedSearchOffset() {
  const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;
  const toolbarHeight = document.querySelector('.toolbar')?.offsetHeight || 0;
  return topbarHeight + toolbarHeight + 18;
}

function smoothScrollToElement(element, extraOffset = 0) {
  if (!element) return;
  const targetTop = element.getBoundingClientRect().top + window.pageYOffset - getFixedSearchOffset() - extraOffset;
  window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
}

function highlightElement(element, className = 'jump-highlight', duration = 1800) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  clearTimeout(element._scentoryHighlightTimer);
  element._scentoryHighlightTimer = setTimeout(() => element.classList.remove(className), duration);
}

function scrollToOrderCard() {
  const orderCard = document.getElementById('myOrder');
  if (!orderCard) return;
  requestAnimationFrame(() => {
    smoothScrollToElement(orderCard, 4);
    highlightElement(orderCard, 'order-jump-highlight', 1600);
  });
}

function scrollToPerfume(id, options = {}) {
  const { preserveSearch = false } = options;
  if (!id) return;
  const perfume = getPerfumeById(id);
  if (!perfume) {
    showToast('Perfume not found in the price list.', 'error');
    return;
  }

  if (searchInput && !preserveSearch) searchInput.value = '';
  if (stockFilter) stockFilter.value = 'all';
  hideSearchSuggestions();
  renderProducts();

  const revealTarget = () => {
    let card = document.getElementById(`perfume-${id}`) ||
      Array.from(document.querySelectorAll('[data-perfume-id]')).find(el => el.dataset.perfumeId === id);

    if (!card && searchInput) {
      searchInput.value = '';
      renderProducts();
      card = document.getElementById(`perfume-${id}`) ||
        Array.from(document.querySelectorAll('[data-perfume-id]')).find(el => el.dataset.perfumeId === id);
    }

    if (!card) {
      showToast('Could not open the selected perfume. Please clear search and try again.', 'error');
      return;
    }

    const img = card.querySelector('.product-image');
    if (img) img.setAttribute('fetchpriority', 'high');
    smoothScrollToElement(card, 8);
    highlightElement(card, 'jump-highlight', 1900);
  };

  requestAnimationFrame(() => requestAnimationFrame(revealTarget));
  setTimeout(revealTarget, 90);
}

function renderProducts() {
  const term = (searchInput?.value || '').trim().toLowerCase();
  const stock = stockFilter?.value || 'all';
  const selectedTag = tagFilter?.value || 'all';

  const matchesTerm = p => !term || `${p.name} ${p.id} ${shortOrderName(p.name)}`.toLowerCase().includes(term);

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

  if (perfumeCount) perfumeCount.textContent = '90+ Premium Decants';

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
  document.body.classList.add('modal-open');
}

function closeImageModal() {
  if (!imageModal || !imageModalImg) return;
  imageModal.classList.remove('show');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
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

function setFieldError(field, hasError) {
  if (!field) return;
  field.classList.toggle('field-error', !!hasError);
}

function validateOrder({ requireCustomer = true } = {}) {
  const errors = [];
  if (!cart.length) errors.push({ field: null, message: 'Please add at least one item.' });
  if (!hasDeliverySelected()) errors.push({ field: deliveryLocation, message: 'Please select delivery area: Inside Dhaka or Outside Dhaka.' });

  if (requireCustomer) {
    const name = (customerName?.value || '').trim();
    const phone = (customerPhone?.value || '').trim();
    const address = (customerAddress?.value || '').trim();
    if (!name) errors.push({ field: customerName, message: 'Please enter customer name.' });
    if (!phone) errors.push({ field: customerPhone, message: 'Please enter phone number.' });
    if (!address) errors.push({ field: customerAddress, message: 'Please enter delivery address.' });
  }

  [deliveryLocation, customerName, customerPhone, customerAddress].forEach(field => setFieldError(field, false));
  if (errors.length) {
    errors.forEach(e => setFieldError(e.field, true));
    const first = errors[0];
    showToast(first.message, 'error');
    first.field?.focus();
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




let renderProductsFrame = 0;
function scheduleRenderProducts() {
  cancelAnimationFrame(renderProductsFrame);
  renderProductsFrame = requestAnimationFrame(renderProducts);
}
searchInput.addEventListener('input', () => {
  scheduleRenderProducts();
  renderSearchSuggestions();
});
searchInput.addEventListener('focus', renderSearchSuggestions);
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Escape') hideSearchSuggestions();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    hideSearchSuggestions();
    if (history && history.replaceState) {
      history.replaceState(null, '', '#pageTop');
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
  if (event.key === 'Escape') { closeImageModal(); closeProductDetails(); }
});

restoreCart();
restoreCustomerData();
loadPerfumes();
