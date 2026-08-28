(() => {
  'use strict';

  const toolNames = {
    find: 'Find My Perfume',
    weather: 'Scentory Manual Weather Match',
    box: 'Build My Decant Box',
    similar: 'Similar Perfumes',
    cost: 'Cost Per Spray',
    collection: 'My Perfume Collection Analyzer',
    layering: 'Scentory Layering Lab',
    meter: 'Compliment vs Comfort Meter'
  };

  const weatherNames = {
    hot: 'Hot & Humid',
    monsoon: 'Monsoon & Rain',
    winter: 'Cool Winter',
    ac: 'AC Office',
    outdoor: 'Outdoor Day'
  };

  const BANGLADESH_DISTRICTS = Object.freeze([
    { name: 'Dhaka', bangla: 'ঢাকা', division: 'Dhaka', aliases: [] },
    { name: 'Faridpur', bangla: 'ফরিদপুর', division: 'Dhaka', aliases: [] },
    { name: 'Gazipur', bangla: 'গাজীপুর', division: 'Dhaka', aliases: [] },
    { name: 'Gopalganj', bangla: 'গোপালগঞ্জ', division: 'Dhaka', aliases: [] },
    { name: 'Kishoreganj', bangla: 'কিশোরগঞ্জ', division: 'Dhaka', aliases: [] },
    { name: 'Madaripur', bangla: 'মাদারীপুর', division: 'Dhaka', aliases: [] },
    { name: 'Manikganj', bangla: 'মানিকগঞ্জ', division: 'Dhaka', aliases: [] },
    { name: 'Munshiganj', bangla: 'মুন্সীগঞ্জ', division: 'Dhaka', aliases: [] },
    { name: 'Narayanganj', bangla: 'নারায়ণগঞ্জ', division: 'Dhaka', aliases: [] },
    { name: 'Narsingdi', bangla: 'নরসিংদী', division: 'Dhaka', aliases: [] },
    { name: 'Rajbari', bangla: 'রাজবাড়ী', division: 'Dhaka', aliases: [] },
    { name: 'Shariatpur', bangla: 'শরীয়তপুর', division: 'Dhaka', aliases: [] },
    { name: 'Tangail', bangla: 'টাঙ্গাইল', division: 'Dhaka', aliases: [] },
    { name: 'Bagerhat', bangla: 'বাগেরহাট', division: 'Khulna', aliases: [] },
    { name: 'Chuadanga', bangla: 'চুয়াডাঙ্গা', division: 'Khulna', aliases: [] },
    { name: 'Jashore', bangla: 'যশোর', division: 'Khulna', aliases: ['Jessore'] },
    { name: 'Jhenaidah', bangla: 'ঝিনাইদহ', division: 'Khulna', aliases: [] },
    { name: 'Khulna', bangla: 'খুলনা', division: 'Khulna', aliases: [] },
    { name: 'Kushtia', bangla: 'কুষ্টিয়া', division: 'Khulna', aliases: [] },
    { name: 'Magura', bangla: 'মাগুরা', division: 'Khulna', aliases: [] },
    { name: 'Meherpur', bangla: 'মেহেরপুর', division: 'Khulna', aliases: [] },
    { name: 'Narail', bangla: 'নড়াইল', division: 'Khulna', aliases: [] },
    { name: 'Satkhira', bangla: 'সাতক্ষীরা', division: 'Khulna', aliases: [] },
    { name: 'Bandarban', bangla: 'বান্দরবান', division: 'Chattogram', aliases: [] },
    { name: 'Brahmanbaria', bangla: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', aliases: [] },
    { name: 'Chandpur', bangla: 'চাঁদপুর', division: 'Chattogram', aliases: [] },
    { name: 'Chattogram', bangla: 'চট্টগ্রাম', division: 'Chattogram', aliases: ['Chittagong'] },
    { name: 'Cumilla', bangla: 'কুমিল্লা', division: 'Chattogram', aliases: ['Comilla'] },
    { name: "Cox's Bazar", bangla: 'কক্সবাজার', division: 'Chattogram', aliases: ['Coxs Bazar'] },
    { name: 'Feni', bangla: 'ফেনী', division: 'Chattogram', aliases: [] },
    { name: 'Khagrachhari', bangla: 'খাগড়াছড়ি', division: 'Chattogram', aliases: ['Khagrachari'] },
    { name: 'Lakshmipur', bangla: 'লক্ষ্মীপুর', division: 'Chattogram', aliases: ['Laxmipur'] },
    { name: 'Noakhali', bangla: 'নোয়াখালী', division: 'Chattogram', aliases: [] },
    { name: 'Rangamati', bangla: 'রাঙ্গামাটি', division: 'Chattogram', aliases: [] },
    { name: 'Bogura', bangla: 'বগুড়া', division: 'Rajshahi', aliases: ['Bogra'] },
    { name: 'Joypurhat', bangla: 'জয়পুরহাট', division: 'Rajshahi', aliases: ['Jaipurhat'] },
    { name: 'Naogaon', bangla: 'নওগাঁ', division: 'Rajshahi', aliases: [] },
    { name: 'Natore', bangla: 'নাটোর', division: 'Rajshahi', aliases: [] },
    { name: 'Chapainawabganj', bangla: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', aliases: ['Chapai Nawabganj'] },
    { name: 'Pabna', bangla: 'পাবনা', division: 'Rajshahi', aliases: [] },
    { name: 'Rajshahi', bangla: 'রাজশাহী', division: 'Rajshahi', aliases: [] },
    { name: 'Sirajganj', bangla: 'সিরাজগঞ্জ', division: 'Rajshahi', aliases: [] },
    { name: 'Habiganj', bangla: 'হবিগঞ্জ', division: 'Sylhet', aliases: [] },
    { name: 'Moulvibazar', bangla: 'মৌলভীবাজার', division: 'Sylhet', aliases: ['Moulvi Bazar', 'Maulvibazar'] },
    { name: 'Sunamganj', bangla: 'সুনামগঞ্জ', division: 'Sylhet', aliases: [] },
    { name: 'Sylhet', bangla: 'সিলেট', division: 'Sylhet', aliases: [] },
    { name: 'Dinajpur', bangla: 'দিনাজপুর', division: 'Rangpur', aliases: [] },
    { name: 'Gaibandha', bangla: 'গাইবান্ধা', division: 'Rangpur', aliases: [] },
    { name: 'Kurigram', bangla: 'কুড়িগ্রাম', division: 'Rangpur', aliases: [] },
    { name: 'Lalmonirhat', bangla: 'লালমনিরহাট', division: 'Rangpur', aliases: [] },
    { name: 'Nilphamari', bangla: 'নীলফামারী', division: 'Rangpur', aliases: [] },
    { name: 'Panchagarh', bangla: 'পঞ্চগড়', division: 'Rangpur', aliases: [] },
    { name: 'Rangpur', bangla: 'রংপুর', division: 'Rangpur', aliases: [] },
    { name: 'Thakurgaon', bangla: 'ঠাকুরগাঁও', division: 'Rangpur', aliases: [] },
    { name: 'Jamalpur', bangla: 'জামালপুর', division: 'Mymensingh', aliases: [] },
    { name: 'Mymensingh', bangla: 'ময়মনসিংহ', division: 'Mymensingh', aliases: [] },
    { name: 'Netrokona', bangla: 'নেত্রকোণা', division: 'Mymensingh', aliases: ['Netrakona'] },
    { name: 'Sherpur', bangla: 'শেরপুর', division: 'Mymensingh', aliases: [] },
    { name: 'Barguna', bangla: 'বরগুনা', division: 'Barishal', aliases: [] },
    { name: 'Barishal', bangla: 'বরিশাল', division: 'Barishal', aliases: ['Barisal'] },
    { name: 'Bhola', bangla: 'ভোলা', division: 'Barishal', aliases: [] },
    { name: 'Jhalokati', bangla: 'ঝালকাঠি', division: 'Barishal', aliases: ['Jhalakathi'] },
    { name: 'Patuakhali', bangla: 'পটুয়াখালী', division: 'Barishal', aliases: [] },
    { name: 'Pirojpur', bangla: 'পিরোজপুর', division: 'Barishal', aliases: [] }
  ].map(Object.freeze));

  let currentWeatherDistrictMatches = [];
  let activeWeatherDistrictIndex = -1;

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

  const styleProfiles = {
    polished: { preferred: ['woody', 'aromatic', 'green', 'spicy', 'leather', 'amber', 'elegant'], avoid: ['gourmand'] },
    clean: { preferred: ['fresh', 'aquatic', 'citrus', 'green', 'aromatic', 'clean'], avoid: ['oud', 'smoky', 'leather'] },
    playful: { preferred: ['fruity', 'sweet', 'gourmand', 'fresh'], avoid: ['smoky', 'leather'] },
    luxury: { preferred: ['oud', 'amber', 'leather', 'woody', 'spicy', 'elegant'], avoid: ['gym'] },
    rugged: { preferred: ['woody', 'smoky', 'leather', 'green', 'spicy', 'aromatic'], avoid: ['powdery', 'gourmand'] }
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

  const findWeights = {
    occasion: 22,
    character: 20,
    weather: 16,
    presence: 12,
    style: 14,
    budget: 8,
    availability: 4,
    confidence: 4
  };

  const layeringRecipes = [
    {
      id: 'cold-blooded-fresh', first: 'hawas-ice-edp', second: 'lattafa-art-of-universe-edp',
      goal: 'fresh', title: 'Cold-Blooded Fresh', order: 'Hawas Ice first, then Art of Universe',
      ratio: '1:1', effect: 'Bright aquatic freshness with a fruitier, more sparkling lift.',
      weather: ['hot', 'monsoon', 'outdoor'], occasions: ['daily', 'active', 'party'], confidence: 'Strong evidence', sources: 2,
      note: 'A repeated creator-tested combination. Start on separate pulse points before overlapping.'
    },
    {
      id: 'grapefruit-aquatic', first: 'afnan-turathi-blue-edp', second: 'hawas-for-him-edp',
      goal: 'fresh', title: 'Grapefruit Aquatic', order: 'Turathi Blue first, then Hawas For Him',
      ratio: '1:1', effect: 'Adds juicy aquatic energy to Turathi Blue’s sharper citrus-woody character.',
      weather: ['hot', 'monsoon', 'outdoor'], occasions: ['daily', 'active'], confidence: 'Community tested', sources: 1,
      note: 'Best sampled lightly because both perfumes can project strongly.'
    },
    {
      id: 'citrus-smoke', first: 'afnan-turathi-blue-edp', second: 'club-de-nuit-intense-man-pure-parfum',
      goal: 'bolder', title: 'Citrus Smoke', order: 'Turathi Blue first, then CDNIM Pure Parfum',
      ratio: '1:1', effect: 'Combines tart citrus with a darker smoky-woody dry-down.',
      weather: ['monsoon', 'outdoor'], occasions: ['formal', 'party'], confidence: 'Community tested', sources: 1,
      note: 'Both are powerful. Begin with one spray of each and avoid enclosed rooms at full strength.'
    },
    {
      id: 'mango-aventus', first: 'club-de-nuit-intesne-man-edp', second: 'mango-ice-by-gulf-orchid',
      goal: 'fruitier', title: 'Fresh Mango Woods', order: 'CDNIM EDP first, wait 30 seconds, then Mango Ice',
      ratio: '1:1', effect: 'Softens the sharp opening with chilled mango while keeping a masculine woody base.',
      weather: ['hot', 'outdoor'], occasions: ['daily', 'party'], confidence: 'Strong evidence', sources: 3,
      note: 'Repeated in community and creator content; apply on separate areas for easier adjustment.'
    },
    {
      id: 'clean-smoke', first: 'club-de-nuit-intense-man-pure-parfum', second: 'kaaf-by-ahmed-edp',
      goal: 'cleaner', title: 'Clean Smoke', order: 'CDNIM Pure Parfum first, then Kaaf',
      ratio: '1:2', effect: 'Uses Kaaf’s clean freshness to make the smoky profile brighter and easier to wear.',
      weather: ['monsoon', 'outdoor', 'ac'], occasions: ['daily', 'office'], confidence: 'Community tested', sources: 1,
      note: 'Keep the stronger CDNIM layer lower for office comfort.'
    },
    {
      id: 'pineapple-smoke', first: 'club-de-nuit-intense-man-pure-parfum', second: 'qaed-al-fursan-edp',
      goal: 'fruitier', title: 'Pineapple Smoke', order: 'CDNIM Pure Parfum first, then Qaed Al Fursan',
      ratio: '5:3', effect: 'Boosts juicy pineapple above a smoky citrus-woody base.',
      weather: ['monsoon', 'outdoor'], occasions: ['daily', 'party'], confidence: 'Strong evidence', sources: 4,
      note: 'A widely discussed pairing. The displayed ratio follows a documented community method.'
    },
    {
      id: 'sweet-aventus', first: 'club-de-nuit-intesne-man-edp', second: 'afnan-9-pm-rebel-edp',
      goal: 'sweeter', title: 'Sweet Modern Woods', order: 'CDNIM EDP first, then 9 PM Rebel',
      ratio: '2:1', effect: 'Adds sweet pineapple warmth to a dry smoky-woody structure.',
      weather: ['monsoon', 'winter', 'outdoor'], occasions: ['party', 'date'], confidence: 'Community tested', sources: 2,
      note: '9 PM Rebel can be very strong, so one top spray is enough for the first test.'
    },
    {
      id: 'smoky-pineapple-creme', first: 'bade-e-al-oud-oud-for-glory', second: 'bade-e-al-oud-honor-glory',
      goal: 'warmer', title: 'Smoky Pineapple Crème', order: 'Oud for Glory first, then Honor & Glory',
      ratio: '1:1', effect: 'Places creamy pineapple sweetness over a smoky oud-and-amber foundation.',
      weather: ['winter'], occasions: ['date', 'formal'], confidence: 'Editorial tested', sources: 1,
      note: 'The application order follows a published Lattafa regional layering guide.'
    },
    {
      id: 'fattan-citrus-woods', first: 'rasasi-fattan-edp', second: 'club-de-nuit-intense-man-pure-parfum',
      goal: 'greener', title: 'Green Citrus Woods', order: 'Rasasi Fattan first, wait 10 minutes, then CDNIM Pure Parfum',
      ratio: '1:1', effect: 'Builds a greener, richer citrus profile with a smoky woody finish.',
      weather: ['monsoon', 'outdoor'], occasions: ['daily', 'formal'], confidence: 'Community tested', sources: 1,
      note: 'The waiting time follows the documented wearer test.'
    },
    {
      id: 'ice-aquatica', first: 'hawas-ice-edp', second: 'rayhaan-aquatica-edp',
      goal: 'fresh', title: 'Double Aquatic Ice', order: 'Hawas Ice first, then Rayhaan Aquatica',
      ratio: '1:1', effect: 'An amplified cooling aquatic profile for very hot outdoor weather.',
      weather: ['hot', 'outdoor'], occasions: ['active', 'daily'], confidence: 'Creator tested', sources: 1,
      note: 'Keep the total within the weather spray guide; do not treat each layer as a full wearing.'
    }
  ];

  let lastBuiltBox = [];
  let boxVariation = 0;
  let currentBoxSettings = '';
  const seenBoxOptions = new Map();
  let lastFocusedElement = null;
  let collectionIds = [];

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
    if (profile.strength >= 4) traits.add('bold');
    if (profile.strength <= 2) traits.add('light');
    if (traits.has('office') || traits.has('daily') || traits.has('daily wear')) traits.add('versatile');
    return traits;
  }

  function buildPerfumeProfile(product) {
    const structured = product?.profile;
    if (Number(structured?.schemaVersion) >= 1) {
      return {
        character: new Set(structured.character || ['aromatic']),
        uses: new Set(structured.occasions || ['daily']),
        weather: new Set(structured.climates || ['monsoon', 'ac']),
        strength: Number(structured.strength || 3),
        projection: Number(structured.projection || structured.strength || 3),
        longevity: Number(structured.longevity || structured.strength || 3),
        sweetness: Number(structured.sweetness || 3),
        freshness: Number(structured.freshness || 3),
        warmth: Number(structured.warmth || 3),
        officeSafety: Number(structured.officeSafety || 3),
        heatSafety: Number(structured.heatSafety || 3),
        versatility: Number(structured.versatility || 3),
        evidence: structured.evidence || 'catalogue-derived',
        verification: product?.details?.verification || 'catalogue-derived',
        topPickEligible: structured.topPickEligible !== false
      };
    }

    // Backward-compatible fallback for catalogues that predate profile schema v1.
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

    return {
      character, uses, weather, strength,
      projection: strength, longevity: strength, sweetness: 3, freshness: 3,
      warmth: 3, officeSafety: uses.has('office') ? 4 : 2,
      heatSafety: weather.has('hot') ? 4 : 2,
      versatility: uses.size >= 3 ? 4 : 2,
      evidence: 'legacy-fallback',
      verification: 'legacy-fallback',
      topPickEligible: true
    };
  }

  function styleFit(profile, style) {
    const rules = styleProfiles[style] || styleProfiles.polished;
    const character = profile.character;
    const preferredHits = rules.preferred.filter(trait => character.has(trait)).length;
    const avoidHits = rules.avoid.filter(trait => character.has(trait)).length;
    return clamp(.42 + preferredHits * .16 - avoidHits * .18, .18, 1);
  }

  function budgetPositionFit(price, budget, preference) {
    const ratio = clamp(Number(price) / Math.max(1, Number(budget)), 0, 1);
    const target = preference === 'value' ? .38 : preference === 'premium' ? .88 : .64;
    return clamp(1 - Math.abs(ratio - target) / .75, .4, 1);
  }

  function evidenceFit(product, profile) {
    if (product?.details?.verification === 'source-checked' || profile.evidence === 'web-verified') return 1;
    if (profile.evidence === 'curated') return .82;
    if (profile.evidence === 'catalogue-derived') return .68;
    return .55;
  }

  function productBrandKey(product) {
    const id = String(product?.id || '');
    const families = ['club-de-nuit', 'afnan', 'hawas', 'lattafa', 'rayhaan', 'brandy', 'khadlaj', 'yusuf-bhai', 'al-haramain', 'riiffs'];
    return families.find(prefix => id.startsWith(prefix)) || id.split('-').slice(0, 2).join('-');
  }

  function primaryFamily(product) {
    const profile = buildPerfumeProfile(product);
    const ordered = ['fresh', 'aquatic', 'citrus', 'green', 'aromatic', 'fruity', 'sweet', 'gourmand', 'spicy', 'amber', 'woody', 'oud', 'leather', 'smoky', 'powdery', 'musky'];
    return ordered.find(trait => profile.character.has(trait)) || 'aromatic';
  }

  function selectDiverseMatches(candidates, limit) {
    const remaining = [...candidates];
    const selected = [];
    while (selected.length < limit && remaining.length) {
      remaining.sort((left, right) => {
        const leftProfile = buildPerfumeProfile(left.product);
        const rightProfile = buildPerfumeProfile(right.product);
        const leftFirstPenalty = selected.length === 0 && !leftProfile.topPickEligible ? 100 : 0;
        const rightFirstPenalty = selected.length === 0 && !rightProfile.topPickEligible ? 100 : 0;
        const leftBrandPenalty = selected.some(item => productBrandKey(item.product) === productBrandKey(left.product)) ? 7 : 0;
        const rightBrandPenalty = selected.some(item => productBrandKey(item.product) === productBrandKey(right.product)) ? 7 : 0;
        const leftFamilyPenalty = selected.some(item => primaryFamily(item.product) === primaryFamily(left.product)) ? 5 : 0;
        const rightFamilyPenalty = selected.some(item => primaryFamily(item.product) === primaryFamily(right.product)) ? 5 : 0;
        const leftAdjusted = left.score - leftFirstPenalty - leftBrandPenalty - leftFamilyPenalty;
        const rightAdjusted = right.score - rightFirstPenalty - rightBrandPenalty - rightFamilyPenalty;
        return rightAdjusted - leftAdjusted || right.confidence - left.confidence || left.product.name.localeCompare(right.product.name);
      });
      selected.push(remaining.shift());
    }
    return selected;
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
    const structured = buildPerfumeProfile(product);
    const profile = weatherProfiles[weather] || weatherProfiles.hot;
    let score = 44;
    profile.preferred.forEach(trait => { if (traits.has(trait)) score += 7; });
    profile.avoid.forEach(trait => { if (traits.has(trait)) score -= 7; });
    if (weather === 'hot') score += (structured.heatSafety - 3) * 8;
    if (weather === 'ac') score += (structured.officeSafety - 3) * 7;
    if (weather === 'winter') score += (structured.warmth - 3) * 6;
    if (weather === 'outdoor') score += (structured.projection - 3) * 4;
    score += (structured.versatility - 3) * 2;
    return Math.max(35, Math.min(96, score));
  }

  function safeStorageGet(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (_) {
      return fallback;
    }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* Storage is optional. */ }
  }

  function saveToolPreference(key, value) {
    const existing = safeStorageGet('scentoryToolPreferencesV3047', {});
    safeStorageSet('scentoryToolPreferencesV3047', { ...existing, [key]: value, updatedAt: new Date().toISOString() });
  }

  function weatherModeFromReading(temperature, condition = '') {
    const text = String(condition).toLowerCase();
    if (/rain|drizzle|thunder|storm/.test(text)) return 'monsoon';
    if (temperature < 24) return 'winter';
    return 'hot';
  }

  function sprayAdvice(product, temperature, environment = 'outdoor') {
    const profile = buildPerfumeProfile(product);
    const fresh = [...profile.character].some(item => ['fresh', 'aquatic', 'citrus', 'green', 'clean'].includes(item));
    const winterBased = [...profile.character].some(item => ['sweet', 'oud', 'spicy', 'amber', 'gourmand', 'smoky', 'leather'].includes(item));
    let min = 6;
    let max = 8;
    let basis = 'balanced perfume guidance';

    if (fresh && temperature >= 30) { min = 10; max = 12; basis = 'fresh perfume at 30°C+'; }
    else if (fresh && temperature >= 25) { min = 8; max = 10; basis = 'fresh perfume at 25–29°C'; }
    else if (fresh) { min = 6; max = 8; basis = 'fresh perfume below 25°C'; }
    else if (winterBased && temperature < 25) { min = 8; max = 10; basis = 'winter-based perfume in suitable cool weather'; }
    else if (winterBased) { min = 4; max = 6; basis = 'winter-based perfume in warm weather'; }

    if (profile.strength >= 4 || environment === 'indoor') {
      min = Math.max(2, min - 2);
      max = Math.max(min + 1, max - 2);
      basis += profile.strength >= 4 ? '; reduced for strong concentration' : '; reduced for an enclosed room';
    }
    return { min, max, basis, fresh, winterBased };
  }

  function weatherSummaryLabel(reading) {
    const hasFeelsLike = reading.feelsLike !== null && reading.feelsLike !== undefined && reading.feelsLike !== '' && Number.isFinite(Number(reading.feelsLike));
    const feelsLike = hasFeelsLike ? ` · feels like ${Math.round(Number(reading.feelsLike))}°C` : '';
    return `${Math.round(Number(reading.temperature))}°C${feelsLike} · ${reading.condition || 'Current conditions'}`;
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
      'Answer a few quick questions. Results balance scent family, maturity, occasion, weather, presence, budget position and profile confidence.',
      `
        <form class="discovery-form" onsubmit="runFindMyPerfume(event)">
          <div class="discovery-field"><label for="findOccasion">Where will you wear it?</label>
            <select id="findOccasion"><option value="daily">Daily wear</option><option value="office">Office / university</option><option value="date">Date night</option><option value="party">Party</option><option value="gym">Gym / active</option><option value="formal">Formal event</option></select>
          </div>
          <div class="discovery-field"><label for="findMood">Which character attracts you?</label>
            <select id="findMood"><option value="fresh">Fresh & clean</option><option value="aquatic">Aquatic & airy</option><option value="citrus">Citrus & bright</option><option value="aromatic">Aromatic / barbershop</option><option value="green">Green & natural</option><option value="fruity">Fruity</option><option value="sweet">Sweet & inviting</option><option value="gourmand">Gourmand / dessert-like</option><option value="woody">Woody & refined</option><option value="spicy">Warm spicy</option><option value="amber">Amber & warm</option><option value="oud">Oud</option><option value="leather">Leather</option><option value="powdery">Powdery & soft</option><option value="bold">Bold & powerful</option><option value="versatile">Versatile & easy</option></select>
          </div>
          <div class="discovery-field"><label for="findStyle">Desired style impression</label>
            <select id="findStyle"><option value="polished">Polished & mature</option><option value="clean">Clean & understated</option><option value="playful">Youthful & playful</option><option value="luxury">Rich & luxurious</option><option value="rugged">Rugged & masculine</option></select>
          </div>
          <div class="discovery-field"><label for="findWeather">Weather or environment</label>
            <select id="findWeather">${Object.entries(weatherNames).map(([key, label]) => `<option value="${key}" ${key === weather ? 'selected' : ''}>${label}</option>`).join('')}</select>
          </div>
          <div class="discovery-field"><label for="findPresence">How noticeable should it feel?</label>
            <select id="findPresence"><option value="balanced">Balanced</option><option value="light">Soft & comfortable</option><option value="strong">Strong & noticeable</option></select>
          </div>
          <div class="discovery-field"><label for="findAvoid">Anything you prefer to avoid?</label>
            <select id="findAvoid"><option value="none">No strong dislike</option><option value="sweet">Too sweet</option><option value="oud">Oud / smoky</option><option value="fresh">Very fresh / aquatic</option><option value="bold">Very strong projection</option><option value="powdery">Powdery character</option></select>
          </div>
          <div class="discovery-field"><label for="findSize">Preferred decant size</label>
            <select id="findSize"><option value="5ml">5 ML</option><option value="6ml">6 ML Premium</option><option value="10ml">10 ML</option><option value="15ml">15 ML</option></select>
          </div>
          <div class="discovery-field"><label for="findBudget">Maximum perfume budget</label>
            <select id="findBudget"><option value="300">Up to ৳300</option><option value="500" selected>Up to ৳500</option><option value="800">Up to ৳800</option><option value="1200">Up to ৳1,200</option><option value="2000">Up to ৳2,000</option></select>
          </div>
          <div class="discovery-field"><label for="findPricePreference">Within that budget, prefer</label>
            <select id="findPricePreference"><option value="balanced">Best overall balance</option><option value="premium">More premium choices</option><option value="value">Best value</option></select>
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
    const style = document.getElementById('findStyle')?.value || 'polished';
    const weather = document.getElementById('findWeather')?.value || 'hot';
    const presence = document.getElementById('findPresence')?.value || 'balanced';
    const avoid = document.getElementById('findAvoid')?.value || 'none';
    const size = document.getElementById('findSize')?.value || '5ml';
    const budget = Number(document.getElementById('findBudget')?.value || 500);
    const pricePreference = document.getElementById('findPricePreference')?.value || 'balanced';
    const resultsBox = document.getElementById('findResults');
    if (!resultsBox) return;

    const matches = getAvailablePerfumes().map(product => {
      const selected = availableSize(product, size);
      if (!selected || selected.size !== size || selected.item.price > budget) return null;
      const traits = getTraits(product);
      const profile = buildPerfumeProfile(product);
      const directOccasionHit = profile.uses.has(occasion);
      const relatedOccasionHits = occasionTraits[occasion].filter(trait => traits.has(trait)).length;
      const occasionFit = directOccasionHit ? 1 : clamp(relatedOccasionHits / 3, .15, .8);
      const characterHit = mood === 'versatile' ? profile.versatility >= 4 : profile.character.has(mood);
      const characterFit = characterHit ? 1 : mood === 'fresh' ? profile.freshness / 5 : mood === 'sweet' ? profile.sweetness / 5 : .25;
      const weatherFit = weatherScore(product, weather) / 100;
      const targetStrength = presence === 'light' ? 2 : presence === 'strong' ? 5 : 3;
      const presenceFit = clamp(1 - Math.abs(profile.strength - targetStrength) / 4, .2, 1);
      const presenceHit = presenceFit >= .75;
      const avoidHit = avoid !== 'none' && (profile.character.has(avoid) || traits.has(avoid) || (avoid === 'bold' && profile.strength >= 4));
      const maturityFit = styleFit(profile, style);
      const budgetFit = budgetPositionFit(selected.item.price, budget, pricePreference);
      const confidence = evidenceFit(product, profile);
      let score = occasionFit * findWeights.occasion
        + characterFit * findWeights.character
        + weatherFit * findWeights.weather
        + presenceFit * findWeights.presence
        + maturityFit * findWeights.style
        + budgetFit * findWeights.budget
        + findWeights.availability
        + confidence * findWeights.confidence;
      if (avoidHit) score -= 22;
      if (!profile.topPickEligible) score -= 10;
      score = Math.round(Math.max(28, Math.min(98, score)));
      const why = [
        directOccasionHit ? `Directly profiled for ${occasionNames[occasion]}` : relatedOccasionHits ? `Related traits support ${occasionNames[occasion]}` : '',
        characterHit ? `${traitLabel(mood)} character matched` : '',
        weatherFit >= .7 ? `Strong ${weatherNames[weather].toLowerCase()} fit` : '',
        presenceHit ? `${strengthLabel(profile.strength)} presence matched` : '',
        maturityFit >= .74 ? `${traitLabel(style)} style matched` : '',
        confidence >= .95 ? 'Source-checked profile' : 'Catalogue profile; sample before committing',
        `${displayMl(size)} stays within budget`
      ].filter(Boolean);
      const cautions = [];
      if (!characterHit) cautions.push(`Its profile is not primarily ${traitLabel(mood).toLowerCase()}`);
      if (!directOccasionHit) cautions.push(`Occasion fit is based on related profile traits, not a direct ${occasionNames[occasion].toLowerCase()} classification`);
      if (!presenceHit) cautions.push(`Presence is ${strengthLabel(profile.strength).toLowerCase()}, not your selected ${presence}`);
      if (avoidHit) cautions.push(`It may include the ${traitLabel(avoid).toLowerCase()} character you prefer to avoid`);
      if (confidence < .95) cautions.push('Its detailed note pyramid is still being source-reviewed');
      if (!profile.topPickEligible) cautions.push('This is kept as an alternative rather than a first recommendation');
      const risk = score >= 84 && !avoidHit ? 'Lower sampling risk' : score >= 70 ? 'Moderate sampling risk' : 'Higher sampling risk';
      return { product, score, selected, why, cautions, risk, confidence };
    }).filter(Boolean);
    const diverseMatches = selectDiverseMatches(matches, 3);

    if (!diverseMatches.length) {
      resultsBox.innerHTML = '<div class="discovery-empty">No available perfume matches that exact size and budget. Try a smaller size or increase the budget.</div>';
      return;
    }
    resultsBox.innerHTML = `
      <div class="discovery-results-head"><h3>Your strongest matches</h3><span>Live stock and prices</span></div>
      <div class="discovery-result-grid similarity-grid">${diverseMatches.map(({ product, score, selected, why, cautions, risk }) => renderResultCard(product, {
        wide: true,
        size: selected.size,
        badge: `${score}% explained match`,
        reason: why.slice(0, 3).join(' · '),
        breakdown: `<div class="explainable-match"><strong>Why it fits</strong><ul>${why.map(item => `<li>${esc(item)}</li>`).join('')}</ul><strong>Consider before choosing</strong><p>${cautions.length ? esc(cautions.join('. ')) : 'No major conflict was detected from your answers.'}</p><span>${esc(risk)} — try 5 ML first if unsure.</span></div>`
      })).join('')}</div>
      <p class="discovery-disclaimer"><strong>Transparent scoring:</strong> occasion 22%, scent family 20%, weather 16%, presence 12%, style/maturity 14%, budget position 8%, availability 4% and profile confidence 4%. Results are diversified by scent family and brand, with penalties for dislikes and first-pick restrictions. This is shopping guidance, not a guarantee of personal preference.</p>
    `;
    saveToolPreference('find', { occasion, mood, style, weather, presence, avoid, size, budget, pricePreference });
  }

  function renderWeatherTool() {
    return renderToolShell('weather',
      'Enter the weather you see in your phone or weather app. Scentory matches perfumes and spray ranges without location permission, an API or an internet weather service.',
      `
        <form class="discovery-form" onsubmit="runManualWeatherMatch(event)">
          <div class="discovery-field full weather-area-field">
            <label for="weatherArea">Bangladesh district</label>
            <div class="weather-area-combobox">
              <input id="weatherArea" type="text" inputmode="search" autocomplete="off" placeholder="Start typing a district" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="weatherDistrictSuggestions" aria-describedby="weatherDistrictHelp" required>
              <div id="weatherDistrictSuggestions" class="weather-district-suggestions" role="listbox" aria-label="Bangladesh districts" hidden></div>
            </div>
            <small id="weatherDistrictHelp" class="weather-district-help">Search all 64 districts in English or Bangla. The district labels your result; your entered weather controls the match.</small>
          </div>
          <div class="discovery-field"><label for="manualTemperature">Temperature</label><div class="manual-weather-value"><input id="manualTemperature" type="number" inputmode="decimal" min="10" max="50" step="1" value="30" required><span>°C</span></div></div>
          <div class="discovery-field"><label for="manualCondition">Current conditions</label><select id="manualCondition"><option value="Clear / sunny">Clear / sunny</option><option value="Cloudy">Cloudy</option><option value="Rain / monsoon">Rain / monsoon</option><option value="Cool / dry">Cool / dry</option></select></div>
          <div class="discovery-field"><label for="weatherEnvironment">Where will you wear it?</label><select id="weatherEnvironment"><option value="outdoor">Outdoor / open area</option><option value="indoor">Office / enclosed room</option></select></div>
          <div class="discovery-field"><label for="weatherStrength">Preferred presence</label><select id="weatherStrength"><option value="balanced">Balanced</option><option value="light">Light & fresh</option><option value="strong">Strong projection</option></select></div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Show Weather Matches</button></div>
        </form>
        <div id="weatherResults" class="discovery-results"></div>
      `
    );
  }

  function normalizeDistrictQuery(value) {
    return String(value || '').trim().toLocaleLowerCase();
  }

  function districtSearchText(district) {
    return normalizeDistrictQuery([
      district.name,
      district.bangla,
      district.division,
      ...(district.aliases || [])
    ].join(' '));
  }

  function closeWeatherDistrictSuggestions() {
    const input = document.getElementById('weatherArea');
    const list = document.getElementById('weatherDistrictSuggestions');
    if (!input || !list) return;
    list.hidden = true;
    list.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    currentWeatherDistrictMatches = [];
    activeWeatherDistrictIndex = -1;
  }

  function setActiveWeatherDistrict(index) {
    const input = document.getElementById('weatherArea');
    const list = document.getElementById('weatherDistrictSuggestions');
    if (!input || !list || !currentWeatherDistrictMatches.length) return;
    activeWeatherDistrictIndex = (index + currentWeatherDistrictMatches.length) % currentWeatherDistrictMatches.length;
    const options = [...list.querySelectorAll('[role="option"]')];
    options.forEach((option, optionIndex) => {
      const active = optionIndex === activeWeatherDistrictIndex;
      option.classList.toggle('active', active);
      option.setAttribute('aria-selected', String(active));
      if (active) {
        input.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function selectWeatherDistrict(district) {
    const input = document.getElementById('weatherArea');
    if (!input || !district) return;
    input.value = district.name;
    closeWeatherDistrictSuggestions();
    input.focus();
  }

  function updateWeatherDistrictSuggestions() {
    const input = document.getElementById('weatherArea');
    const list = document.getElementById('weatherDistrictSuggestions');
    if (!input || !list) return;
    const query = normalizeDistrictQuery(input.value);
    if (!query) {
      closeWeatherDistrictSuggestions();
      return;
    }

    currentWeatherDistrictMatches = BANGLADESH_DISTRICTS
      .map((district) => {
        const searchable = districtSearchText(district);
        const starts = [district.name, district.bangla, ...(district.aliases || [])]
          .some((value) => normalizeDistrictQuery(value).startsWith(query));
        return { district, searchable, rank: starts ? 0 : searchable.includes(query) ? 1 : 2 };
      })
      .filter((result) => result.rank < 2)
      .sort((a, b) => a.rank - b.rank || a.district.name.localeCompare(b.district.name))
      .slice(0, 8)
      .map((result) => result.district);

    activeWeatherDistrictIndex = -1;
    input.removeAttribute('aria-activedescendant');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');

    if (!currentWeatherDistrictMatches.length) {
      list.innerHTML = '<div class="weather-district-empty">No district found. Check the spelling.</div>';
      return;
    }

    list.innerHTML = currentWeatherDistrictMatches.map((district, index) => `
      <button id="weather-district-option-${index}" class="weather-district-option" type="button" role="option" aria-selected="false" data-district-index="${index}">
        <strong>${esc(district.name)}</strong>
        <span>${esc(district.bangla)} · ${esc(district.division)} Division</span>
      </button>
    `).join('');

    list.querySelectorAll('[data-district-index]').forEach((option) => {
      option.addEventListener('pointerdown', (event) => event.preventDefault());
      option.addEventListener('click', () => selectWeatherDistrict(
        currentWeatherDistrictMatches[Number(option.dataset.districtIndex)]
      ));
    });
  }

  function handleWeatherDistrictKeydown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!currentWeatherDistrictMatches.length) updateWeatherDistrictSuggestions();
      if (currentWeatherDistrictMatches.length) setActiveWeatherDistrict(activeWeatherDistrictIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!currentWeatherDistrictMatches.length) updateWeatherDistrictSuggestions();
      if (currentWeatherDistrictMatches.length) setActiveWeatherDistrict(activeWeatherDistrictIndex - 1);
    } else if (event.key === 'Enter' && activeWeatherDistrictIndex >= 0) {
      event.preventDefault();
      selectWeatherDistrict(currentWeatherDistrictMatches[activeWeatherDistrictIndex]);
    } else if (event.key === 'Escape') {
      closeWeatherDistrictSuggestions();
    }
  }

  function initWeatherDistrictAutocomplete() {
    const input = document.getElementById('weatherArea');
    if (!input || input.dataset.districtAutocompleteReady === 'true') return;
    input.dataset.districtAutocompleteReady = 'true';
    input.addEventListener('input', updateWeatherDistrictSuggestions);
    input.addEventListener('focus', () => {
      if (input.value.trim()) updateWeatherDistrictSuggestions();
    });
    input.addEventListener('keydown', handleWeatherDistrictKeydown);
    input.addEventListener('blur', () => setTimeout(closeWeatherDistrictSuggestions, 150));
  }

  function showWeatherError(error) {
    const resultsBox = document.getElementById('weatherResults');
    if (resultsBox) resultsBox.innerHTML = `<div class="discovery-empty"><strong>Check your entries.</strong><br>${esc(error?.message || 'Please try again.')}</div>`;
  }

  function runManualWeatherMatch(event) {
    event?.preventDefault();
    const location = document.getElementById('weatherArea')?.value.trim() || 'Selected district';
    const temperature = Number(document.getElementById('manualTemperature')?.value);
    const condition = document.getElementById('manualCondition')?.value || 'Clear / sunny';
    if (!Number.isFinite(temperature) || temperature < 10 || temperature > 50) return showWeatherError(new Error('Enter a temperature from 10°C to 50°C.'));
    applyWeatherReading({ temperature, condition, location, manual: true });
  }

  function applyWeatherReading(reading) {
    const temperature = Number(reading.temperature);
    const feelsLike = Number(reading.feelsLike);
    const effectiveTemperature = Number.isFinite(feelsLike) ? feelsLike : temperature;
    const weather = weatherModeFromReading(effectiveTemperature, reading.condition);
    const strength = document.getElementById('weatherStrength')?.value || 'balanced';
    const environment = document.getElementById('weatherEnvironment')?.value || 'outdoor';
    const resultsBox = document.getElementById('weatherResults');
    if (!resultsBox) return;
    const matches = getAvailablePerfumes().map(product => {
      const traits = getTraits(product);
      let score = weatherScore(product, weather);
      const profile = buildPerfumeProfile(product);
      const advice = sprayAdvice(product, effectiveTemperature, environment);
      if (effectiveTemperature >= 30 && advice.fresh) score += 8;
      if (effectiveTemperature < 25 && advice.winterBased) score += 8;
      if (effectiveTemperature >= 30 && advice.winterBased) score -= 12;
      if (environment === 'indoor') score += (profile.officeSafety - 3) * 5;
      if (strength === 'light' && (traits.has('fresh') || traits.has('aquatic'))) score += 8;
      if (strength === 'strong' && traits.has('bold')) score += 8;
      if (strength === 'balanced' && traits.has('versatile')) score += 6;
      return { product, advice, score: Math.max(30, Math.min(99, score)), confidence: evidenceFit(product, profile) };
    });
    const diverseWeatherMatches = selectDiverseMatches(matches, 4);

    resultsBox.innerHTML = `
      <article class="live-weather-reading"><span>Manual weather check</span><strong>${esc(reading.location || 'Selected district')}</strong><b>${esc(weatherSummaryLabel(reading))}</b><small>Based only on the weather details entered by the customer.</small></article>
      <div class="discovery-results-head"><h3>Best perfumes for right now</h3><span>Scentory weather fit</span></div>
      <div class="discovery-result-grid">${diverseWeatherMatches.map(({ product, score, advice }) => {
        const traits = [...getTraits(product)].filter(trait => weatherProfiles[weather].preferred.includes(trait)).slice(0, 3);
        return renderResultCard(product, { badge: `${score}/100 weather fit`, reason: traits.length ? `Why it fits: ${traits.map(traitLabel).join(', ')}. Suggested ${advice.min}–${advice.max} total sprays (${advice.basis}).` : `A versatile available option. Suggested ${advice.min}–${advice.max} total sprays.` });
      }).join('')}</div>
      <p class="discovery-disclaimer"><strong>Spray rules used:</strong> fresh perfumes at 30°C+ use 10–12 sprays; at 25–29°C use 8–10; below 25°C use 6–8. Winter-based perfumes use 8–10 in suitable cool weather. Strong perfumes or enclosed rooms reduce the range by two. These are starting points—skin, atomizer and sensitivity differ.</p>
    `;
    saveToolPreference('weather', { location: reading.location || '', temperature, condition: reading.condition || '', weather, strength, environment });
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
    return value >= 4 ? 'Strong' : value <= 2 ? 'Light' : 'Balanced';
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
      strength: 1 - Math.abs(sourceProfile.strength - candidateProfile.strength) / 4,
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
      'Choose the size that fits your perfume journey!',
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

  function renderCollectionTool() {
    collectionIds = safeStorageGet('scentoryPerfumeCollectionV3047', []);
    if (!Array.isArray(collectionIds)) collectionIds = [];
    collectionIds = collectionIds.filter(id => getCatalogue().some(product => product.id === id));
    return renderToolShell('collection',
      'Add the perfumes you already own or have tried. The analyzer finds repetition, coverage gaps and a useful next addition.',
      `
        <form class="discovery-form" onsubmit="addCollectionPerfume(event)">
          <div class="discovery-field full"><label for="collectionProduct">Choose a perfume</label><select id="collectionProduct">${productOptions('', true)}</select></div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Add to My Collection</button><button class="discovery-action secondary" type="button" onclick="clearPerfumeCollection()">Clear</button></div>
        </form>
        <div id="collectionChips" class="collection-chips"></div>
        <div class="discovery-form-actions collection-analyse-action"><button class="discovery-action" type="button" onclick="analysePerfumeCollection()">Analyse My Collection</button></div>
        <div id="collectionResults" class="discovery-results"></div>
      `
    );
  }

  function renderCollectionChips() {
    const box = document.getElementById('collectionChips');
    if (!box) return;
    if (!collectionIds.length) {
      box.innerHTML = '<span class="collection-empty-line">Add at least two perfumes for a useful analysis.</span>';
      return;
    }
    box.innerHTML = collectionIds.map(id => {
      const product = getCatalogue().find(item => item.id === id);
      return product ? `<button type="button" class="collection-chip" onclick="removeCollectionPerfume('${esc(id)}')">${esc(product.name)} <span aria-label="Remove">×</span></button>` : '';
    }).join('');
  }

  function addCollectionPerfume(event) {
    event?.preventDefault();
    const id = document.getElementById('collectionProduct')?.value;
    if (id && !collectionIds.includes(id)) collectionIds.push(id);
    safeStorageSet('scentoryPerfumeCollectionV3047', collectionIds);
    renderCollectionChips();
  }

  function removeCollectionPerfume(id) {
    collectionIds = collectionIds.filter(item => item !== id);
    safeStorageSet('scentoryPerfumeCollectionV3047', collectionIds);
    renderCollectionChips();
    const results = document.getElementById('collectionResults');
    if (results) results.innerHTML = '';
  }

  function clearPerfumeCollection() {
    collectionIds = [];
    safeStorageSet('scentoryPerfumeCollectionV3047', collectionIds);
    renderCollectionChips();
    const results = document.getElementById('collectionResults');
    if (results) results.innerHTML = '';
  }

  function analysePerfumeCollection() {
    const results = document.getElementById('collectionResults');
    const selected = collectionIds.map(id => getCatalogue().find(product => product.id === id)).filter(Boolean);
    if (!results) return;
    if (selected.length < 2) {
      results.innerHTML = '<div class="discovery-empty">Add at least two perfumes so Scentory can compare overlap and gaps.</div>';
      return;
    }

    const traitCounts = new Map();
    const useCounts = new Map();
    const weatherCounts = new Map();
    selected.forEach(product => {
      const profile = buildPerfumeProfile(product);
      profile.character.forEach(trait => traitCounts.set(trait, (traitCounts.get(trait) || 0) + 1));
      profile.uses.forEach(trait => useCounts.set(trait, (useCounts.get(trait) || 0) + 1));
      profile.weather.forEach(trait => weatherCounts.set(trait, (weatherCounts.get(trait) || 0) + 1));
    });
    const strongest = [...traitCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    const coverageTargets = ['fresh', 'aquatic', 'citrus', 'green', 'sweet', 'woody', 'spicy', 'gourmand', 'oud', 'clean'];
    const gaps = coverageTargets.filter(trait => !traitCounts.has(trait));
    const pairs = [];
    selected.forEach((first, index) => selected.slice(index + 1).forEach(second => pairs.push({ first, second, score: similarityBreakdown(first, second).score })));
    pairs.sort((a, b) => b.score - a.score);

    const candidates = getAvailablePerfumes().filter(product => !collectionIds.includes(product.id)).map(product => {
      const profile = buildPerfumeProfile(product);
      const newCharacters = [...profile.character].filter(trait => !traitCounts.has(trait));
      const newUses = [...profile.uses].filter(trait => !useCounts.has(trait));
      const averageSimilarity = selected.reduce((sum, owned) => sum + similarityBreakdown(owned, product).score, 0) / selected.length;
      const score = newCharacters.length * 15 + newUses.length * 10 + (100 - averageSimilarity) * .35 + (getTraits(product).has('versatile') ? 5 : 0);
      return { product, score, newCharacters, newUses, averageSimilarity };
    }).sort((a, b) => b.score - a.score);
    const next = candidates[0];
    const overlap = pairs[0];
    const useLabels = [...useCounts.keys()].map(traitLabel);
    const weatherLabels = [...weatherCounts.keys()].map(traitLabel);

    results.innerHTML = `
      <div class="collection-stat-grid">
        <article><span>Collection size</span><strong>${selected.length}</strong><small>saved on this device</small></article>
        <article><span>Main character</span><strong>${esc(strongest[0] ? traitLabel(strongest[0][0]) : 'Balanced')}</strong><small>${strongest.slice(1).map(item => traitLabel(item[0])).join(' · ') || 'More data needed'}</small></article>
        <article><span>Occasion coverage</span><strong>${useCounts.size}/6</strong><small>${esc(useLabels.slice(0, 4).join(' · '))}</small></article>
        <article><span>Weather coverage</span><strong>${weatherCounts.size}/5</strong><small>${esc(weatherLabels.slice(0, 4).join(' · '))}</small></article>
      </div>
      ${overlap ? `<article class="collection-insight"><span>Closest overlap</span><strong>${esc(overlap.first.name)} + ${esc(overlap.second.name)}</strong><p>${overlap.score}% profile similarity. They may serve similar roles, although they are not claimed to smell identical.</p></article>` : ''}
      <article class="collection-insight"><span>Missing variety</span><strong>${gaps.length ? esc(gaps.slice(0, 5).map(traitLabel).join(' · ')) : 'No major character gap detected'}</strong><p>${gaps.length ? 'Adding one of these characters can make the collection more useful across different moods and occasions.' : 'Your collection already covers the main character groups in Scentory’s catalogue model.'}</p></article>
      ${next ? `<div class="discovery-results-head"><h3>Smartest next addition</h3><span>diversity-first suggestion</span></div>${renderResultCard(next.product, { wide: true, badge: `${Math.round(next.score)} diversity points`, reason: `${next.newCharacters.length ? `Adds ${next.newCharacters.slice(0, 3).map(traitLabel).join(', ')}` : 'Adds a different overall balance'}. Average overlap with your collection: ${Math.round(next.averageSimilarity)}%.` })}` : ''}
      <p class="discovery-disclaimer">The analyzer uses catalogue character, occasion, weather, strength and price profiles. It does not verify ownership and it does not claim two perfumes are identical.</p>
    `;
  }

  function layerWeatherLabel(recipe) {
    return recipe.weather.map(item => weatherNames[item] || traitLabel(item)).join(' · ');
  }

  function layeringSprayText(recipe, temperatureBand, environment) {
    const fresh = ['fresh', 'fruitier', 'cleaner', 'greener'].includes(recipe.goal);
    let min = 8;
    let max = 10;
    if (fresh && temperatureBand === '30') { min = 10; max = 12; }
    else if (fresh && temperatureBand === '25') { min = 8; max = 10; }
    else if (fresh) { min = 6; max = 8; }
    else if (temperatureBand !== 'cool') { min = 4; max = 6; }
    if (environment === 'indoor') { min = Math.max(2, min - 2); max = Math.max(min + 1, max - 2); }
    return `${min}–${max} total sprays across both perfumes`;
  }

  function renderLayeringTool(seedId = '') {
    const recipeIds = new Set(layeringRecipes.flatMap(recipe => [recipe.first, recipe.second]));
    const options = getCatalogue().filter(product => recipeIds.has(product.id)).sort((a, b) => a.name.localeCompare(b.name)).map(product => `<option value="${esc(product.id)}" ${product.id === seedId ? 'selected' : ''}>${esc(product.name)}</option>`).join('');
    return renderToolShell('layering',
      'Choose a perfume or desired effect. Results come only from Scentory’s documented recipe library—never from random catalogue pairing.',
      `
        <div class="layering-method"><strong>Evidence-first recipe standard</strong><span>Exact pair documented</span><span>Application order</span><span>Strength-aware ratio</span><span>Weather and room safety</span></div>
        <form class="discovery-form" onsubmit="runLayeringLab(event)">
          <div class="discovery-field"><label for="layerProduct">Start with a perfume</label><select id="layerProduct"><option value="">Show all documented pairs</option>${options}</select></div>
          <div class="discovery-field"><label for="layerGoal">Desired result</label><select id="layerGoal"><option value="all">Any result</option><option value="fresh">Fresher</option><option value="fruitier">Fruitier</option><option value="cleaner">Cleaner</option><option value="greener">Greener</option><option value="sweeter">Sweeter</option><option value="warmer">Warmer</option><option value="bolder">Bolder</option></select></div>
          <div class="discovery-field"><label for="layerTemperature">Today’s temperature</label><select id="layerTemperature"><option value="30">30°C or above</option><option value="25">25–29°C</option><option value="cool">Below 25°C</option></select></div>
          <div class="discovery-field"><label for="layerEnvironment">Environment</label><select id="layerEnvironment"><option value="outdoor">Outdoor / open area</option><option value="indoor">Office / enclosed room</option></select></div>
          <div class="discovery-form-actions"><button class="discovery-action" type="submit">Show Documented Recipes</button></div>
        </form>
        <div id="layeringResults" class="discovery-results"></div>
      `
    );
  }

  function runLayeringLab(event) {
    event?.preventDefault();
    const selected = document.getElementById('layerProduct')?.value || '';
    const goal = document.getElementById('layerGoal')?.value || 'all';
    const temperature = document.getElementById('layerTemperature')?.value || '30';
    const environment = document.getElementById('layerEnvironment')?.value || 'outdoor';
    const results = document.getElementById('layeringResults');
    if (!results) return;
    const recipes = layeringRecipes.filter(recipe => (!selected || recipe.first === selected || recipe.second === selected) && (goal === 'all' || recipe.goal === goal));
    if (!recipes.length) {
      results.innerHTML = '<div class="discovery-empty">No documented pair matches those exact filters. Change the desired result or show all documented pairs—Scentory will not invent one.</div>';
      return;
    }
    results.innerHTML = `<div class="discovery-results-head"><h3>${recipes.length} documented recipe${recipes.length === 1 ? '' : 's'}</h3><span>curated, not auto-generated</span></div><div class="layering-grid">${recipes.map(recipe => {
      const first = getCatalogue().find(product => product.id === recipe.first);
      const second = getCatalogue().find(product => product.id === recipe.second);
      if (!first || !second) return '';
      const firstSize = availableSize(first, '5ml');
      const secondSize = availableSize(second, '5ml');
      return `<article class="layering-card">
        <div class="layering-card-head"><span>${esc(recipe.confidence)} · ${recipe.sources} source${recipe.sources === 1 ? '' : 's'}</span><strong>${esc(recipe.title)}</strong></div>
        <div class="layering-pair"><div><img src="${esc(imagePath(first))}" alt="${esc(first.name)}"><b>${esc(first.name)}</b></div><i>＋</i><div><img src="${esc(imagePath(second))}" alt="${esc(second.name)}"><b>${esc(second.name)}</b></div></div>
        <dl><div><dt>Apply</dt><dd>${esc(recipe.order)}</dd></div><div><dt>Starting ratio</dt><dd>${esc(recipe.ratio)}</dd></div><div><dt>Expected effect</dt><dd>${esc(recipe.effect)}</dd></div><div><dt>Best setting</dt><dd>${esc(layerWeatherLabel(recipe))}</dd></div><div><dt>Total spray guide</dt><dd>${esc(layeringSprayText(recipe, temperature, environment))}</dd></div></dl>
        <p>${esc(recipe.note)}</p>
        <div class="discovery-result-actions">${firstSize && secondSize ? `<button class="discovery-mini-action primary" type="button" onclick="addLayeringPair('${esc(first.id)}','${esc(firstSize.size)}','${esc(second.id)}','${esc(secondSize.size)}')">Add both 5 ML decants</button>` : '<span class="layering-stock-note">One perfume is currently unavailable.</span>'}</div>
      </article>`;
    }).join('')}</div><p class="discovery-disclaimer"><strong>Layer safely:</strong> the spray number is the combined total—not the amount for each perfume. Test on paper or separate skin areas first. Community reports are subjective; Scentory excludes undocumented random pairings but cannot guarantee personal preference.</p>`;
  }

  function addLayeringPair(firstId, firstSize, secondId, secondSize) {
    const addedFirst = typeof addToCart === 'function' ? addToCart(firstId, firstSize) : false;
    const addedSecond = typeof addToCart === 'function' ? addToCart(secondId, secondSize) : false;
    const count = Number(addedFirst) + Number(addedSecond);
    if (typeof showToast === 'function') showToast(count ? `${count} layering decant${count === 1 ? '' : 's'} added to your order.` : 'Those decants are already in your order or unavailable.', count ? 'success' : 'info');
  }

  function contextProfile(context) {
    const profiles = {
      office: { label: 'Office / enclosed room', preferred: ['office', 'clean', 'fresh', 'versatile'], boldBonus: -9, comfortBonus: 8 },
      university: { label: 'University / daily', preferred: ['daily', 'fresh', 'versatile', 'clean'], boldBonus: -3, comfortBonus: 6 },
      outdoor: { label: 'Outdoor day', preferred: ['fresh', 'aquatic', 'active', 'bold'], boldBonus: 7, comfortBonus: 0 },
      date: { label: 'Date night', preferred: ['date', 'sweet', 'woody', 'elegant'], boldBonus: 6, comfortBonus: 1 },
      party: { label: 'Party', preferred: ['party', 'bold', 'sweet', 'beast mode'], boldBonus: 12, comfortBonus: -4 }
    };
    return profiles[context] || profiles.office;
  }

  function renderMeterTool(seedId = '') {
    const initial = getAvailablePerfumes().some(product => product.id === seedId) ? seedId : (getAvailablePerfumes()[0]?.id || '');
    return renderToolShell('meter',
      'Estimate the balance between noticeable presence and wearer or room comfort for a specific setting.',
      `<form class="discovery-form" onsubmit="runComplimentComfort(event)">
        <div class="discovery-field full"><label for="meterProduct">Choose a perfume</label><select id="meterProduct">${productOptions(initial, false)}</select></div>
        <div class="discovery-field"><label for="meterContext">Where will you wear it?</label><select id="meterContext"><option value="office">Office / enclosed room</option><option value="university">University / daily</option><option value="outdoor">Outdoor day</option><option value="date">Date night</option><option value="party">Party</option></select></div>
        <div class="discovery-field"><label for="meterTemperature">Temperature</label><select id="meterTemperature"><option value="32">30°C or above</option><option value="27">25–29°C</option><option value="22">Below 25°C</option></select></div>
        <div class="discovery-form-actions"><button class="discovery-action" type="submit">Check the Balance</button></div>
      </form><div id="meterResults" class="discovery-results"></div>`
    );
  }

  function runComplimentComfort(event) {
    event?.preventDefault();
    const product = getCatalogue().find(item => item.id === document.getElementById('meterProduct')?.value);
    const context = document.getElementById('meterContext')?.value || 'office';
    const temperature = Number(document.getElementById('meterTemperature')?.value || 32);
    const results = document.getElementById('meterResults');
    if (!product || !results) return;
    const profile = buildPerfumeProfile(product);
    const traits = getTraits(product);
    const setting = contextProfile(context);
    const hits = setting.preferred.filter(trait => traits.has(trait) || profile.uses.has(trait) || profile.character.has(trait));
    const advice = sprayAdvice(product, temperature, ['office', 'university'].includes(context) ? 'indoor' : 'outdoor');
    let compliment = 48 + hits.length * 6 + (profile.projection - 1) * 5 + setting.boldBonus;
    if (traits.has('versatile')) compliment += 5;
    let comfort = 58 + hits.length * 4 + setting.comfortBonus + (profile.officeSafety - 3) * 6 - (profile.projection - 3) * 4;
    if (temperature >= 30 && advice.winterBased) comfort -= 16;
    if (temperature >= 30 && advice.fresh) comfort += 8;
    if (['office', 'university'].includes(context) && profile.strength >= 4) comfort -= 10;
    compliment = Math.round(Math.max(30, Math.min(94, compliment)));
    comfort = Math.round(Math.max(28, Math.min(96, comfort)));
    const balance = Math.round((compliment + comfort) / 2 - Math.abs(compliment - comfort) * .12);
    const warning = comfort < 55 ? 'High overspray risk for this setting—use the lower end or choose a lighter perfume.' : compliment - comfort > 18 ? 'Noticeable, but comfort may fall if you overspray.' : 'A workable balance when used inside the suggested range.';

    results.innerHTML = `<article class="meter-card"><div class="discovery-results-head"><h3>${esc(product.name)}</h3><span>${esc(setting.label)}</span></div>
      <div class="meter-row"><span>Compliment potential</span><div><i style="width:${compliment}%"></i></div><strong>${compliment}</strong></div>
      <div class="meter-row comfort"><span>Comfort potential</span><div><i style="width:${comfort}%"></i></div><strong>${comfort}</strong></div>
      <div class="meter-balance"><span>Balanced-use score</span><strong>${balance}/100</strong><p>${esc(warning)}</p></div>
      <div class="meter-guidance"><b>${advice.min}–${advice.max} sprays suggested</b><span>${esc(advice.basis)}. Start low and add only if needed.</span></div>
      <p class="discovery-disclaimer">This meter estimates social noticeability and environmental comfort from perfume character, strength, setting and temperature. Compliments are personal and can never be guaranteed.</p></article>`;
    saveToolPreference('meter', { product: product.id, context, temperature });
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
        cost: () => renderCostTool(seedId),
        collection: renderCollectionTool,
        layering: () => renderLayeringTool(seedId),
        meter: () => renderMeterTool(seedId)
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
      if (key === 'weather') initWeatherDistrictAutocomplete();
      if (key === 'similar') runSimilarPerfumes();
      if (key === 'cost') { syncCostSpraySizes(); calculateCostPerSpray(); }
      if (key === 'collection') renderCollectionChips();
      if (key === 'layering') runLayeringLab();
      if (key === 'meter') runComplimentComfort();
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
        <button type="button" class="discovery-mini-action" onclick="openDiscoveryFromProduct('layering','${esc(id)}')">Layering Lab</button>
        <button type="button" class="discovery-mini-action" onclick="openDiscoveryFromProduct('meter','${esc(id)}')">Compliment vs Comfort</button>
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
  window.runManualWeatherMatch = runManualWeatherMatch;
  window.runDecantBox = runDecantBox;
  window.showNextBoxOption = showNextBoxOption;
  window.runSimilarPerfumes = runSimilarPerfumes;
  window.syncCostSpraySizes = syncCostSpraySizes;
  window.calculateCostPerSpray = calculateCostPerSpray;
  window.addCollectionPerfume = addCollectionPerfume;
  window.removeCollectionPerfume = removeCollectionPerfume;
  window.clearPerfumeCollection = clearPerfumeCollection;
  window.analysePerfumeCollection = analysePerfumeCollection;
  window.runLayeringLab = runLayeringLab;
  window.addLayeringPair = addLayeringPair;
  window.runComplimentComfort = runComplimentComfort;
  window.addDiscoveryItem = addDiscoveryItem;
  window.addDiscoveryBox = addDiscoveryBox;
  window.openDiscoveryProduct = openDiscoveryProduct;
  window.openDiscoveryFromProduct = openDiscoveryFromProduct;

  modalClose?.addEventListener('click', closeDiscoveryTool);
  modal?.addEventListener('click', event => { if (event.target === modal) closeDiscoveryTool(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('show')) closeDiscoveryTool(); });
})();
