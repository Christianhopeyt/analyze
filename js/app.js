/* ===========================
   YouTube Analyzer by Norcanto
   Main Application JS — Fixed & Enhanced
   =========================== */

'use strict';

/* ========================
   SVG ICONS
   ======================== */
const icons = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
};

/* ========================
   THEME MANAGER
   ======================== */
const ThemeManager = {
  current: localStorage.getItem('yta-theme') || 'light',
  init() {
    this.apply(this.current);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.current = theme;
    localStorage.setItem('yta-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? icons.sun : icons.moon;
    });
  },
  toggle() { this.apply(this.current === 'dark' ? 'light' : 'dark'); }
};

/* ========================
   LANGUAGE MANAGER
   ======================== */
const LangManager = {
  current: localStorage.getItem('yta-lang') || 'EN',
  strings: {
    EN: {
      hero_title: 'Discover How Much a <span class="accent">YouTube Channel</span> Can Earn',
      hero_subtitle: 'Analyze any YouTube channel and get a detailed estimate of its revenue, growth potential, and performance.',
      analyzer_label: 'YouTube Channel Analysis',
      input_placeholder: 'Paste a YouTube channel URL...',
      analyze_btn: 'Analyze Now',
      calc_title: 'Make a Manual Estimate',
    },
    FR: {
      hero_title: 'Découvrez Combien une <span class="accent">Chaîne YouTube</span> Peut Gagner',
      hero_subtitle: "Analysez n'importe quelle chaîne YouTube et obtenez une estimation détaillée de ses revenus, de son potentiel de croissance et de ses performances.",
      analyzer_label: 'Analyse de Chaîne YouTube',
      input_placeholder: "Collez l'URL d'une chaîne YouTube...",
      analyze_btn: 'Analyser Maintenant',
      calc_title: 'Faire une Estimation Manuelle',
    }
  },
  init() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang !== this.current) this.apply(lang);
      });
    });
    this.apply(this.current);
  },
  apply(lang) {
    this.current = lang;
    localStorage.setItem('yta-lang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    const s = this.strings[lang];
    if (!s) return;
    const q = id => document.getElementById(id);
    if (q('hero-title'))      q('hero-title').innerHTML   = s.hero_title;
    if (q('hero-subtitle'))   q('hero-subtitle').textContent = s.hero_subtitle;
    if (q('analyzer-label'))  q('analyzer-label').textContent = s.analyzer_label;
    if (q('channel-input'))   q('channel-input').placeholder = s.input_placeholder;
    if (q('analyze-btn-text')) q('analyze-btn-text').textContent = s.analyze_btn;
    if (q('calc-title'))      q('calc-title').textContent = s.calc_title;
  }
};

/* ========================
   MOBILE MENU
   ======================== */
const MobileMenu = {
  init() {
    const hamburger = document.querySelector('.hamburger');
    const menu      = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      const open = menu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    // Close on nav link tap (mobile)
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
};

/* ========================
   SCROLL REVEAL
   ======================== */
const ScrollReveal = {
  init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};

/* ========================
   COOKIE BANNER
   ======================== */
const CookieBanner = {
  init() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    if (localStorage.getItem('yta-cookies')) { banner.classList.add('hidden'); return; }
    banner.classList.remove('hidden');
    document.getElementById('cookie-accept')?.addEventListener('click', () => {
      localStorage.setItem('yta-cookies', 'accepted');
      banner.classList.add('hidden');
    });
    document.getElementById('cookie-reject')?.addEventListener('click', () => {
      localStorage.setItem('yta-cookies', 'rejected');
      banner.classList.add('hidden');
    });
  }
};

/* ========================
   TOAST NOTIFICATIONS
   ======================== */
function showToast(message, type = 'success') {
  document.querySelector('.toast')?.remove();
  const icon = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icon}<span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

/* ========================
   RPM DATA
   ======================== */
const RPM_DATA = {
  niches: {
    finance:       { rpm: 18,  label: 'Finance & Investing' },
    tech:          { rpm: 12,  label: 'Technology' },
    business:      { rpm: 14,  label: 'Business' },
    education:     { rpm: 9,   label: 'Education' },
    health:        { rpm: 8,   label: 'Health & Fitness' },
    gaming:        { rpm: 4,   label: 'Gaming' },
    entertainment: { rpm: 3.5, label: 'Entertainment' },
    lifestyle:     { rpm: 5,   label: 'Lifestyle & Vlogs' },
    food:          { rpm: 5,   label: 'Food & Cooking' },
    travel:        { rpm: 6,   label: 'Travel' },
    music:         { rpm: 3,   label: 'Music' },
    news:          { rpm: 7,   label: 'News & Politics' },
    sports:        { rpm: 4,   label: 'Sports' },
    beauty:        { rpm: 6,   label: 'Beauty & Fashion' },
    auto:          { rpm: 10,  label: 'Automotive' },
  },
  countries: {
    US: 1.5, GB: 1.3, CA: 1.2, AU: 1.2, DE: 1.2, FR: 1.0,
    NL: 1.15, SE: 1.1, NO: 1.1, JP: 0.9, KR: 0.8,
    BR: 0.4, IN: 0.3, MX: 0.35, ID: 0.25, OTHER: 0.5
  }
};

/* ========================
   DETECTION HELPERS
   ======================== */
function detectNiche(title, description) {
  const t = (title + ' ' + description).toLowerCase();
  if (/financ|invest|stock|crypto|money|wealth|trading|budget/.test(t)) return 'finance';
  if (/tech|software|code|program|developer|gadget|app\b|ai\b/.test(t))  return 'tech';
  if (/business|entrepreneur|startup|market|brand|sales/.test(t))        return 'business';
  if (/learn|teach|educat|tutori|course|school|lesson/.test(t))          return 'education';
  if (/health|fitness|workout|gym|diet|nutrition|wellness/.test(t))      return 'health';
  if (/game|gaming|gamer|esport|minecraft|fortnite|playthrough/.test(t)) return 'gaming';
  if (/music|song|sing|artist|album|beat|rap|hip.?hop/.test(t))         return 'music';
  if (/food|cook|recipe|chef|kitchen|bake|restaurant/.test(t))           return 'food';
  if (/travel|vlog|adventure|explore|tour|trip/.test(t))                 return 'travel';
  if (/beauty|makeup|fashion|style|skincare|hair|outfit/.test(t))        return 'beauty';
  if (/car|auto|vehicl|motor|drive|road|speed/.test(t))                  return 'auto';
  if (/sport|football|soccer|basketball|tennis|baseball/.test(t))        return 'sports';
  if (/news|politic|current|break|world|report/.test(t))                 return 'news';
  if (/lifestyle|daily|life|family|home|personal/.test(t))               return 'lifestyle';
  return 'entertainment';
}

function detectLanguage(title, description) {
  const t = title + ' ' + description;
  if (/[àâäéèêëîïôùûüç]/i.test(t))  return 'French';
  if (/[äöüß]/i.test(t))             return 'German';
  if (/[áéíóúñ¿¡]/i.test(t))         return 'Spanish';
  if (/[àèéìíîòóùú]/i.test(t))       return 'Italian';
  if (/[\u3040-\u30ff]/.test(t))      return 'Japanese';
  if (/[\u4e00-\u9fff]/.test(t))      return 'Chinese';
  if (/[\u0600-\u06ff]/.test(t))      return 'Arabic';
  if (/[\u0400-\u04ff]/.test(t))      return 'Russian';
  if (/[\u0900-\u097f]/.test(t))      return 'Hindi';
  return 'English';
}

function detectCountry(language) {
  const map = { 'French': 'FR', 'German': 'DE', 'Spanish': 'ES', 'Italian': 'IT',
    'Japanese': 'JP', 'Chinese': 'CN', 'Arabic': 'SA', 'Russian': 'RU',
    'Hindi': 'IN', 'English': 'US' };
  return map[language] || 'US';
}

/* ========================
   FORMAT HELPERS
   ======================== */
function formatNumber(n) {
  n = parseInt(n) || 0;
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
}

function formatCurrency(n) {
  n = Math.max(0, Math.round(n));
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toLocaleString('en-US');
}

/* ========================
   REVENUE CALCULATION
   ======================== */
function calculateRevenue(data) {
  const nicheData   = RPM_DATA.niches[data.niche] || RPM_DATA.niches.entertainment;
  const countryMult = RPM_DATA.countries[data.country] || RPM_DATA.countries.OTHER;
  const baseRpm     = nicheData.rpm;

  const minRpm = baseRpm * 0.45 * countryMult;
  const avgRpm = baseRpm * countryMult;
  const maxRpm = baseRpm * 1.9  * countryMult;

  const viewsRaw       = parseInt(data.viewCount || 0);
  const channelAgeMonths = Math.max(1, data.ageMonths || 24);
  const avgMonthlyViews  = Math.round(viewsRaw / channelAgeMonths);

  return {
    rpm: { min: minRpm, avg: avgRpm, max: maxRpm },
    monthly: {
      min:   Math.round((avgMonthlyViews / 1000) * minRpm),
      avg:   Math.round((avgMonthlyViews / 1000) * avgRpm),
      max:   Math.round((avgMonthlyViews / 1000) * maxRpm),
      views: avgMonthlyViews,
    },
    annual: {
      min: Math.round((avgMonthlyViews / 1000) * minRpm * 12),
      avg: Math.round((avgMonthlyViews / 1000) * avgRpm * 12),
      max: Math.round((avgMonthlyViews / 1000) * maxRpm * 12),
    }
  };
}

function calculateBusinessScore(data, revenue) {
  let score = 0;
  const subs   = parseInt(data.subscriberCount || 0);
  const views  = parseInt(data.viewCount || 0);
  const videos = parseInt(data.videoCount || 1);

  if (subs > 10e6)  score += 30;
  else if (subs > 1e6)   score += 22;
  else if (subs > 100e3) score += 15;
  else if (subs > 10e3)  score += 8;
  else                   score += 3;

  const avg = revenue.monthly.avg;
  if (avg > 50000)  score += 25;
  else if (avg > 10000) score += 18;
  else if (avg > 2000)  score += 12;
  else if (avg > 500)   score += 6;
  else                  score += 2;

  if (videos > 500)  score += 20;
  else if (videos > 200) score += 15;
  else if (videos > 50)  score += 10;
  else if (videos > 10)  score += 5;
  else                   score += 2;

  const nicheRpm = (RPM_DATA.niches[data.niche] || RPM_DATA.niches.entertainment).rpm;
  score += Math.min(15, Math.round(nicheRpm * 1.1));

  const ratio = subs > 0 ? views / subs : 0;
  if (ratio > 200)  score += 10;
  else if (ratio > 100) score += 7;
  else if (ratio > 50)  score += 5;
  else                  score += 2;

  score = Math.min(100, score);
  let level = 'Low';
  if (score >= 75) level = 'Premium';
  else if (score >= 55) level = 'High';
  else if (score >= 35) level = 'Medium';

  const nicheRpmNorm   = Math.min(100, Math.round(nicheRpm * 5.5));
  const sponsorScore   = Math.min(100, Math.round((subs / 1e6) * 60 + nicheRpmNorm * 0.4));
  const affiliateScore = Math.min(100, Math.round((avg / 500) * 40 + nicheRpmNorm * 0.6));
  const growthScore    = Math.min(100, Math.round(score * 0.9 + (videos / 10)));

  return { score, level, rpm: nicheRpmNorm, sponsor: sponsorScore, affiliate: affiliateScore, growth: growthScore };
}

/* ========================
   ANALYZER
   ======================== */
const Analyzer = {
  loading: false,
  rateLimit: { count: 0, resetTime: Date.now() + 3600000, max: 20 },

  parseChannelUrl(raw) {
    const url = raw.trim().replace(/\s+/g, '');
    // Handle bare @handle
    if (/^@[\w.-]+$/.test(url)) return { type: 'handle', value: url.slice(1) };
    // Full URL patterns
    const patterns = [
      { re: /youtube\.com\/@([\w.-]+)/,        type: 'handle' },
      { re: /youtube\.com\/channel\/(UC[\w-]+)/, type: 'id'     },
      { re: /youtube\.com\/c\/([\w.-]+)/,       type: 'handle' },
      { re: /youtube\.com\/user\/([\w.-]+)/,    type: 'handle' },
      { re: /youtube\.com\/([\w.-]+)$/,         type: 'handle' },
    ];
    for (const { re, type } of patterns) {
      const m = url.match(re);
      if (m) return { type, value: m[1] };
    }
    // Bare handle without @
    if (/^[\w.-]{3,}$/.test(url)) return { type: 'handle', value: url };
    return null;
  },

  checkRateLimit() {
    if (Date.now() > this.rateLimit.resetTime) {
      this.rateLimit.count = 0;
      this.rateLimit.resetTime = Date.now() + 3600000;
    }
    if (this.rateLimit.count >= this.rateLimit.max) {
      showToast('Hourly limit reached. Please try again later.', 'error');
      return false;
    }
    this.rateLimit.count++;
    return true;
  },

  async analyze(url) {
    if (this.loading) return;

    const parsed = this.parseChannelUrl(url);
    if (!parsed) {
      showToast('Please enter a valid YouTube channel URL or @handle.', 'error');
      return;
    }

    if (!this.checkRateLimit()) return;

    // Check 24h cache
    const cacheKey = 'yta-cache-' + parsed.value.toLowerCase();
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 86400000) {
          this.renderResults(data);
          return;
        }
      }
    } catch (_) {}

    this.setLoading(true);

    try {
      const apiKey = window.YT_API_KEY || '';
      let channelData;

      if (apiKey) {
        channelData = await this.fetchFromYouTube(parsed, apiKey);
      } else {
        // Demo mode — always works without an API key
        await new Promise(r => setTimeout(r, 1200)); // realistic delay
        channelData = this.getDemoData(parsed.value);
      }

      if (!channelData) {
        showToast('Channel not found. Please check the URL.', 'error');
        return;
      }

      try { localStorage.setItem(cacheKey, JSON.stringify({ data: channelData, ts: Date.now() })); } catch (_) {}
      this.renderResults(channelData);

    } catch (err) {
      console.error('Analyzer error:', err);
      showToast('Analysis failed. Please try again.', 'error');
    } finally {
      this.setLoading(false);
    }
  },

  async fetchFromYouTube(parsed, apiKey) {
    const base = 'https://www.googleapis.com/youtube/v3';
    let channelId = parsed.type === 'id' ? parsed.value : null;

    if (!channelId) {
      const sr = await fetch(`${base}/search?part=snippet&type=channel&q=${encodeURIComponent(parsed.value)}&key=${apiKey}`);
      const sd = await sr.json();
      if (sd.error) throw new Error(sd.error.message);
      channelId = sd.items?.[0]?.snippet?.channelId;
    }
    if (!channelId) return null;

    const cr = await fetch(`${base}/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`);
    const cd = await cr.json();
    if (cd.error) throw new Error(cd.error.message);
    const ch = cd.items?.[0];
    if (!ch) return null;

    const { snippet, statistics: stats, brandingSettings: branding } = ch;
    const ageMonths = Math.max(1, Math.round((Date.now() - new Date(snippet.publishedAt)) / (1000 * 60 * 60 * 24 * 30)));
    const niche    = detectNiche(snippet.title, snippet.description);
    const language = detectLanguage(snippet.title, snippet.description);
    const country  = snippet.country || detectCountry(language);

    return {
      id: ch.id, title: snippet.title,
      handle: snippet.customUrl || '@' + snippet.title.toLowerCase().replace(/\s+/g, ''),
      description: snippet.description,
      avatar: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
      banner: branding?.image?.bannerExternalUrl || null,
      subscriberCount: stats.subscriberCount || 0,
      viewCount:       stats.viewCount || 0,
      videoCount:      stats.videoCount || 0,
      publishedAt:     snippet.publishedAt,
      ageMonths, niche, language, country,
    };
  },

  getDemoData(handle) {
    const seed = [...handle.toLowerCase()].reduce((a, c) => a + c.charCodeAt(0), 0);
    const niches    = Object.keys(RPM_DATA.niches);
    const languages = ['English','French','Spanish','German','Portuguese','Japanese'];
    const countries = ['US','GB','FR','DE','CA','AU','BR','IN'];
    const niche    = niches[seed % niches.length];
    const language = languages[seed % languages.length];
    const country  = countries[seed % countries.length];
    const subs     = Math.round((seed * 347891 + 100000) % 5000000 + 50000);
    const views    = subs * (Math.round((seed * 13) % 300 + 50));
    const videos   = Math.round((seed * 7 + 30) % 800 + 30);
    const ageMo    = Math.round((seed * 11) % 60 + 18);
    const name     = handle.charAt(0).toUpperCase() + handle.slice(1).replace(/[-_]/g, ' ');
    return {
      id: 'UC' + handle.replace(/[^a-zA-Z0-9]/g,'').padEnd(22,'X').slice(0,22),
      title: name,
      handle: '@' + handle,
      description: `A ${RPM_DATA.niches[niche].label} channel delivering quality content to a global audience.`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF0000&color=fff&size=200&bold=true`,
      banner: null,
      subscriberCount: subs, viewCount: views, videoCount: videos,
      publishedAt: new Date(Date.now() - ageMo * 30 * 24 * 3600 * 1000).toISOString(),
      ageMonths: ageMo, niche, language, country,
    };
  },

  setLoading(state) {
    this.loading = state;
    const inputGroup = document.getElementById('analyzer-input-group');
    const spinner    = document.getElementById('analyzer-spinner');
    const btn        = document.getElementById('analyze-btn');
    if (inputGroup) inputGroup.style.display = state ? 'none' : '';
    if (spinner)    spinner.classList.toggle('visible', state);
    if (btn)        btn.disabled = state;
  },

  renderResults(data) {
    const revenue = calculateRevenue(data);
    const score   = calculateBusinessScore(data, revenue);

    // Show results
    const resultsEl = document.getElementById('results');
    if (resultsEl) {
      resultsEl.classList.add('visible');
      setTimeout(() => resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    // Avatar
    const avatarEl = document.getElementById('res-avatar');
    if (avatarEl) {
      avatarEl.src = data.avatar || '';
      avatarEl.alt = data.title;
      avatarEl.onerror = () => {
        avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.title)}&background=FF0000&color=fff&size=200&bold=true`;
      };
    }

    // Banner
    const bannerEl = document.getElementById('res-banner');
    if (bannerEl) {
      if (data.banner) { bannerEl.src = data.banner; bannerEl.style.display = ''; }
      else               bannerEl.style.display = 'none';
    }

    // Text fields
    setInner('res-name',     data.title);
    setInner('res-handle',   data.handle);
    setInner('res-niche',    RPM_DATA.niches[data.niche]?.label || data.niche);
    setInner('res-language', data.language);
    setInner('res-country',  data.country);
    setInner('res-subs',     formatNumber(data.subscriberCount));
    setInner('res-views',    formatNumber(data.viewCount));
    setInner('res-videos',   formatNumber(data.videoCount));
    setInner('res-created',  new Date(data.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));

    // Revenue
    setInner('res-month-min', formatCurrency(revenue.monthly.min));
    setInner('res-month-avg', formatCurrency(revenue.monthly.avg));
    setInner('res-month-max', formatCurrency(revenue.monthly.max));
    setInner('res-year-min',  formatCurrency(revenue.annual.min));
    setInner('res-year-avg',  formatCurrency(revenue.annual.avg));
    setInner('res-year-max',  formatCurrency(revenue.annual.max));

    // Chart
    renderChart(revenue);

    // Score
    const scoreEl = document.getElementById('res-score-num');
    if (scoreEl) animateCounter(scoreEl, 0, score.score, 900);
    setInner('res-score-level', score.level);
    setBarWidth('res-score-bar',    score.score);
    setBarWidth('res-rpm-bar',      score.rpm);
    setBarWidth('res-sponsor-bar',  score.sponsor);
    setBarWidth('res-affiliate-bar',score.affiliate);
    setBarWidth('res-growth-bar',   score.growth);
    setInner('res-rpm-val',       score.rpm       + '/100');
    setInner('res-sponsor-val',   score.sponsor   + '/100');
    setInner('res-affiliate-val', score.affiliate + '/100');
    setInner('res-growth-val',    score.growth    + '/100');

    // Trigger reveal animations on results section
    document.querySelectorAll('#results .reveal').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 200);
    });

    // Push URL state (only when served from a real server, not file://)
    if (location.protocol !== 'file:') {
      history.pushState({}, '', `/channel/${data.id}`);
    }
    document.title = `${data.title} — YouTube Analyzer by Norcanto`;

    showToast('Analysis complete!', 'success');
  }
};

/* ========================
   DOM HELPERS
   ======================== */
function setInner(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setBarWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => { el.style.width = Math.min(100, Math.max(0, pct)) + '%'; }, 350);
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  const tick = ts => {
    const p = Math.min(1, (ts - start) / duration);
    el.textContent = Math.round(from + (to - from) * p);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ========================
   REVENUE CHART
   ======================== */
function renderChart(revenue) {
  const container = document.getElementById('revenue-chart');
  if (!container) return;
  const months      = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const seasonality = [0.85,0.82,0.90,0.92,0.95,1.00,0.88,0.90,0.95,1.05,1.15,1.20];
  const maxVal      = Math.max(1, revenue.monthly.max * 1.2);

  container.innerHTML = months.map((m, i) => {
    const minH = Math.round((revenue.monthly.min * seasonality[i] / maxVal) * 140);
    const avgH = Math.round((revenue.monthly.avg * seasonality[i] / maxVal) * 140);
    const maxH = Math.round((revenue.monthly.max * seasonality[i] / maxVal) * 140);
    const tip  = `${m}: ${formatCurrency(Math.round(revenue.monthly.avg * seasonality[i]))}`;
    return `<div class="chart-bar-group" title="${tip}">
      <div class="chart-bars">
        <div class="chart-bar min" style="height:${minH}px"></div>
        <div class="chart-bar avg" style="height:${avgH}px"></div>
        <div class="chart-bar max" style="height:${maxH}px"></div>
      </div>
      <div class="chart-bar-label">${m.slice(0,1)}</div>
    </div>`;
  }).join('');
}

/* ========================
   MANUAL CALCULATOR
   ======================== */
const Calculator = {
  init() {
    ['calc-views','calc-country','calc-niche'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input',  () => this.calculate());
      if (el) el.addEventListener('change', () => this.calculate());
    });
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.calculate();
      });
    });
    this.calculate();
  },
  calculate() {
    const views       = parseFloat(document.getElementById('calc-views')?.value)   || 100000;
    const country     = document.getElementById('calc-country')?.value             || 'US';
    const niche       = document.getElementById('calc-niche')?.value               || 'entertainment';
    const isShorts    = document.querySelector('.type-btn.active')?.dataset.type   === 'shorts';
    const nicheData   = RPM_DATA.niches[niche]    || RPM_DATA.niches.entertainment;
    const countryMult = RPM_DATA.countries[country] || RPM_DATA.countries.OTHER;
    const typeMult    = isShorts ? 0.08 : 1;
    setInner('calc-min', formatCurrency(Math.round((views/1000) * nicheData.rpm * 0.45 * countryMult * typeMult)));
    setInner('calc-avg', formatCurrency(Math.round((views/1000) * nicheData.rpm         * countryMult * typeMult)));
    setInner('calc-max', formatCurrency(Math.round((views/1000) * nicheData.rpm * 1.9   * countryMult * typeMult)));
  }
};

/* ========================
   FAQ ACCORDION
   ======================== */
const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
};

/* ========================
   NAV ACTIVE STATE
   ======================== */
function initNavActive() {
  const navLinks = document.querySelectorAll('.header-nav a');
  if (!navLinks.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}

/* ========================
   ANALYZE BUTTON — THE FIX
   The original code checked for #analyzer-form which doesn't exist in the HTML.
   We now bind directly to the button and input — no form element needed.
   ======================== */
function initAnalyzerForm() {
  const input = document.getElementById('channel-input');
  const btn   = document.getElementById('analyze-btn');

  // Guard: both elements must exist
  if (!input || !btn) {
    console.warn('YTA: channel-input or analyze-btn not found in DOM');
    return;
  }

  const submit = () => {
    const url = input.value.trim();
    if (!url) {
      input.focus();
      input.classList.add('input-error');
      setTimeout(() => input.classList.remove('input-error'), 1200);
      showToast('Please enter a YouTube channel URL or @handle.', 'error');
      return;
    }
    Analyzer.analyze(url);
  };

  // Button click
  btn.addEventListener('click', submit);

  // Enter key in input
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  });

  // Clear error style on typing
  input.addEventListener('input', () => input.classList.remove('input-error'));
}

/* ========================
   SMOOTH ANCHOR SCROLL
   Handles nav links that point to #sections
   ======================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ========================
   HEADER SCROLL SHADOW
   ======================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  const update = () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.08)'
      : 'none';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ========================
   BOOT
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
  // Inject logo from base64 into all logo img elements
  if (typeof LOGO_B64 !== 'undefined') {
    document.querySelectorAll('.site-logo-img').forEach(img => { img.src = LOGO_B64; });
  }

  ThemeManager.init();
  LangManager.init();
  MobileMenu.init();
  ScrollReveal.init();
  CookieBanner.init();
  initAnalyzerForm();   // <-- this now works correctly
  Calculator.init();
  FAQ.init();
  initNavActive();
  initSmoothScroll();
  initHeaderScroll();
});
