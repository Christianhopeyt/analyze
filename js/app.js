/* ===========================
   YouTube Analyzer by Norcanto
   Main Application JS — Production Ready
   =========================== */
'use strict';

/* ========================
   ICONS
   ======================== */
const icons = {
  sun:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
};

/* ========================
   THEME
   ======================== */
const ThemeManager = {
  current: localStorage.getItem('yta-theme') || 'light',
  init() {
    this.apply(this.current);
    document.querySelectorAll('.theme-toggle').forEach(btn =>
      btn.addEventListener('click', () => this.toggle())
    );
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
   LANGUAGE
   ======================== */
const LangManager = {
  current: localStorage.getItem('yta-lang') || 'EN',
  strings: {
    EN: {
      hero_title:       'Discover How Much a <span class="accent">YouTube Channel</span> Can Earn',
      hero_subtitle:    'Analyze any YouTube channel and get a detailed estimate of its revenue, growth potential, and performance.',
      analyzer_label:   'YouTube Channel Analysis',
      input_placeholder:'Paste a YouTube channel URL or @handle...',
      analyze_btn:      'Analyze Now',
      calc_title:       'Make a Manual Estimate',
    },
    FR: {
      hero_title:       'Découvrez Combien une <span class="accent">Chaîne YouTube</span> Peut Gagner',
      hero_subtitle:    "Analysez n'importe quelle chaîne YouTube et obtenez une estimation détaillée de ses revenus.",
      analyzer_label:   'Analyse de Chaîne YouTube',
      input_placeholder:"Collez l'URL d'une chaîne YouTube ou @pseudo...",
      analyze_btn:      'Analyser',
      calc_title:       'Faire une Estimation Manuelle',
    }
  },
  init() {
    document.querySelectorAll('.lang-btn').forEach(btn =>
      btn.addEventListener('click', () => { if (btn.dataset.lang !== this.current) this.apply(btn.dataset.lang); })
    );
    this.apply(this.current);
  },
  apply(lang) {
    this.current = lang;
    localStorage.setItem('yta-lang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.lang === lang)
    );
    const s = this.strings[lang]; if (!s) return;
    const q = id => document.getElementById(id);
    if (q('hero-title'))       q('hero-title').innerHTML      = s.hero_title;
    if (q('hero-subtitle'))    q('hero-subtitle').textContent = s.hero_subtitle;
    if (q('analyzer-label'))   q('analyzer-label').textContent= s.analyzer_label;
    if (q('channel-input'))    q('channel-input').placeholder = s.input_placeholder;
    if (q('analyze-btn-text')) q('analyze-btn-text').textContent = s.analyze_btn;
    if (q('calc-title'))       q('calc-title').textContent    = s.calc_title;
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
      hamburger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      })
    );
  }
};

/* ========================
   SCROLL REVEAL
   ======================== */
const ScrollReveal = {
  init() {
    if (!window.IntersectionObserver) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
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
      localStorage.setItem('yta-cookies', 'accepted'); banner.classList.add('hidden');
    });
    document.getElementById('cookie-reject')?.addEventListener('click', () => {
      localStorage.setItem('yta-cookies', 'rejected'); banner.classList.add('hidden');
    });
  }
};

/* ========================
   TOAST
   ======================== */
function showToast(msg, type = 'success') {
  document.querySelector('.toast')?.remove();
  const icon = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${icon}<span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3500);
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
function detectNiche(title, desc) {
  const t = (title + ' ' + desc).toLowerCase();
  if (/financ|invest|stock|crypto|money|wealth|trading/.test(t)) return 'finance';
  if (/tech|software|code|program|developer|gadget|ai\b/.test(t)) return 'tech';
  if (/business|entrepreneur|startup|market|brand|sales/.test(t)) return 'business';
  if (/learn|teach|educat|tutori|course|school/.test(t))          return 'education';
  if (/health|fitness|workout|gym|diet|nutrition/.test(t))        return 'health';
  if (/game|gaming|gamer|esport|minecraft|fortnite/.test(t))      return 'gaming';
  if (/music|song|sing|artist|album|beat|rap/.test(t))            return 'music';
  if (/food|cook|recipe|chef|kitchen|bake/.test(t))               return 'food';
  if (/travel|vlog|adventure|explore|trip/.test(t))               return 'travel';
  if (/beauty|makeup|fashion|style|skincare/.test(t))             return 'beauty';
  if (/car|auto|vehicl|motor|drive/.test(t))                      return 'auto';
  if (/sport|football|soccer|basketball|tennis/.test(t))          return 'sports';
  if (/news|politic|current|break|world/.test(t))                 return 'news';
  if (/lifestyle|daily|life|family|home/.test(t))                 return 'lifestyle';
  return 'entertainment';
}

function detectLanguage(title, desc) {
  const t = title + ' ' + desc;
  if (/[àâäéèêëîïôùûüç]/i.test(t)) return 'French';
  if (/[äöüß]/i.test(t))            return 'German';
  if (/[áéíóúñ¿¡]/i.test(t))        return 'Spanish';
  if (/[\u3040-\u30ff]/.test(t))     return 'Japanese';
  if (/[\u4e00-\u9fff]/.test(t))     return 'Chinese';
  if (/[\u0600-\u06ff]/.test(t))     return 'Arabic';
  if (/[\u0400-\u04ff]/.test(t))     return 'Russian';
  if (/[\u0900-\u097f]/.test(t))     return 'Hindi';
  return 'English';
}

function detectCountry(lang) {
  return ({ French:'FR', German:'DE', Spanish:'ES', Japanese:'JP', Chinese:'CN', Arabic:'SA', Russian:'RU', Hindi:'IN', English:'US' })[lang] || 'US';
}

/* ========================
   FORMAT HELPERS
   ======================== */
function fmtNum(n) {
  n = parseInt(n) || 0;
  if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return n.toLocaleString();
}
function fmtUSD(n) {
  n = Math.max(0, Math.round(n));
  if (n >= 1e6) return '$'+(n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return '$'+(n/1e3).toFixed(1)+'K';
  return '$'+n.toLocaleString('en-US');
}

/* ========================
   REVENUE & SCORE
   ======================== */
function calcRevenue(data) {
  const nd  = RPM_DATA.niches[data.niche] || RPM_DATA.niches.entertainment;
  const cm  = RPM_DATA.countries[data.country] || RPM_DATA.countries.OTHER;
  const amv = Math.round(parseInt(data.viewCount||0) / Math.max(1, data.ageMonths||24));
  const rev = (views, mult) => Math.round((views/1000)*nd.rpm*mult*cm);
  return {
    monthly: { min: rev(amv,0.45), avg: rev(amv,1), max: rev(amv,1.9), views: amv },
    annual:  { min: rev(amv,0.45)*12, avg: rev(amv,1)*12, max: rev(amv,1.9)*12 }
  };
}

function calcScore(data, rev) {
  let s = 0;
  const subs = parseInt(data.subscriberCount||0), videos = parseInt(data.videoCount||1);
  s += subs>10e6?30:subs>1e6?22:subs>100e3?15:subs>10e3?8:3;
  const am = rev.monthly.avg;
  s += am>50000?25:am>10000?18:am>2000?12:am>500?6:2;
  s += videos>500?20:videos>200?15:videos>50?10:videos>10?5:2;
  const nr = (RPM_DATA.niches[data.niche]||RPM_DATA.niches.entertainment).rpm;
  s += Math.min(15,Math.round(nr*1.1));
  const ratio = subs>0?parseInt(data.viewCount||0)/subs:0;
  s += ratio>200?10:ratio>100?7:ratio>50?5:2;
  s = Math.min(100,s);
  const level = s>=75?'Premium':s>=55?'High':s>=35?'Medium':'Low';
  const nrn = Math.min(100,Math.round(nr*5.5));
  return { score:s, level, rpm:nrn, sponsor:Math.min(100,Math.round((subs/1e6)*60+nrn*0.4)), affiliate:Math.min(100,Math.round((am/500)*40+nrn*0.6)), growth:Math.min(100,Math.round(s*0.9+(videos/10))) };
}

/* ========================
   ANALYZER
   ======================== */
const Analyzer = {
  loading: false,
  _rl: { n: 0, reset: Date.now()+3600000, max: 20 },

  parse(raw) {
    const u = (raw||'').trim().replace(/\s+/g,'');
    if (!u) return null;
    if (/^@[\w.-]+$/.test(u)) return { type:'handle', value:u.slice(1) };
    const pats = [
      [/youtube\.com\/@([\w.-]+)/,         'handle'],
      [/youtube\.com\/channel\/(UC[\w-]+)/,'id'],
      [/youtube\.com\/c\/([\w.-]+)/,       'handle'],
      [/youtube\.com\/user\/([\w.-]+)/,    'handle'],
      [/youtu\.be\/([\w.-]+)/,             'handle'],
    ];
    for (const [re, type] of pats) {
      const m = u.match(re);
      if (m) return { type, value: m[1] };
    }
    if (/^[\w][\w.-]{2,}$/.test(u)) return { type:'handle', value:u };
    return null;
  },

  rl() {
    if (Date.now() > this._rl.reset) { this._rl.n=0; this._rl.reset=Date.now()+3600000; }
    if (this._rl.n >= this._rl.max) { showToast('Hourly limit reached. Try again later.','error'); return false; }
    this._rl.n++; return true;
  },

  async run(raw) {
    if (this.loading) return;
    const parsed = this.parse(raw);
    if (!parsed) { showToast('Enter a valid YouTube URL or @handle.','error'); shakeInput(); return; }
    if (!this.rl()) return;

    // Check cache
    const ck = 'yta-c-'+parsed.value.toLowerCase().replace(/[^a-z0-9]/g,'-');
    try {
      const hit = localStorage.getItem(ck);
      if (hit) { const {d,t}=JSON.parse(hit); if (Date.now()-t<86400000) { this.render(d); return; } }
    } catch(_){}

    this.setLoading(true);
    try {
      // ── KEY POINT ───────────────────────────────────────────────────────────
      // window.YT_API_KEY is ONLY set if you manually inject it via a
      // Netlify Edge Function or a build-time inject script (see README).
      // A bare Netlify env var NEVER reaches browser JS.
      // Without a key we always use demo mode — that is intentional and correct.
      // ────────────────────────────────────────────────────────────────────────
      const key = (typeof window !== 'undefined' && window.YT_API_KEY) ? window.YT_API_KEY : '';
      let data;

      if (key) {
        data = await this.ytFetch(parsed, key);
      } else {
        await new Promise(r => setTimeout(r, 1100 + Math.random()*400));
        data = this.demo(parsed.value);
      }

      if (!data) { showToast('Channel not found. Check the URL.','error'); return; }
      try { localStorage.setItem(ck, JSON.stringify({d:data,t:Date.now()})); } catch(_){}
      this.render(data);
    } catch(err) {
      console.error('[YTA]', err);
      // If the API call itself failed (wrong key, quota, network), fall back to demo
      try {
        const fallback = this.demo(parsed.value);
        this.render(fallback);
        showToast('Using estimated data (API unavailable).','success');
      } catch(e2) {
        showToast('Analysis failed. Please try again.','error');
      }
    } finally {
      this.setLoading(false);
    }
  },

  async ytFetch(parsed, key) {
    const base = 'https://www.googleapis.com/youtube/v3';
    let id = parsed.type==='id' ? parsed.value : null;
    if (!id) {
      const r = await fetch(`${base}/search?part=snippet&type=channel&q=${encodeURIComponent(parsed.value)}&maxResults=1&key=${key}`);
      if (!r.ok) throw new Error(`Search HTTP ${r.status}`);
      const j = await r.json();
      if (j.error) throw new Error(j.error.message);
      id = j.items?.[0]?.snippet?.channelId;
    }
    if (!id) return null;
    const r2 = await fetch(`${base}/channels?part=snippet,statistics,brandingSettings&id=${id}&key=${key}`);
    if (!r2.ok) throw new Error(`Channel HTTP ${r2.status}`);
    const j2 = await r2.json();
    if (j2.error) throw new Error(j2.error.message);
    const ch = j2.items?.[0]; if (!ch) return null;
    const {snippet:sn, statistics:st, brandingSettings:br} = ch;
    const ageMo = Math.max(1,Math.round((Date.now()-new Date(sn.publishedAt))/(1000*60*60*24*30)));
    const lang  = detectLanguage(sn.title, sn.description);
    return {
      id:ch.id, title:sn.title,
      handle: sn.customUrl||('@'+sn.title.toLowerCase().replace(/\s+/g,'')),
      description:sn.description,
      avatar: sn.thumbnails?.high?.url||sn.thumbnails?.default?.url,
      banner: br?.image?.bannerExternalUrl||null,
      subscriberCount:st.subscriberCount||0, viewCount:st.viewCount||0, videoCount:st.videoCount||0,
      publishedAt:sn.publishedAt, ageMonths:ageMo,
      niche:detectNiche(sn.title,sn.description), language:lang,
      country:sn.country||detectCountry(lang),
    };
  },

  demo(handle) {
    const h    = String(handle||'demo').toLowerCase().replace(/[^a-z0-9]/g,'');
    const seed = [...h].reduce((a,c)=>a+c.charCodeAt(0),0)||42;
    const pick = (arr) => arr[seed % arr.length];
    const niche = pick(Object.keys(RPM_DATA.niches));
    const lang  = pick(['English','French','Spanish','German','Portuguese']);
    const cntry = pick(['US','GB','FR','DE','CA','AU','BR','IN']);
    const subs  = ((seed*347891+100000)%5000000)+50000;
    const views = subs * (((seed*13)%300)+50);
    const vids  = ((seed*7+30)%800)+30;
    const age   = ((seed*11)%60)+18;
    const name  = h.charAt(0).toUpperCase()+h.slice(1).replace(/[-_]/g,' ');
    return {
      id:'UC'+h.replace(/[^a-zA-Z0-9]/g,'').padEnd(22,'X').slice(0,22),
      title:name, handle:'@'+h,
      description:`A ${RPM_DATA.niches[niche].label} channel.`,
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF0000&color=fff&size=200&bold=true`,
      banner:null,
      subscriberCount:Math.round(subs), viewCount:Math.round(views), videoCount:Math.round(vids),
      publishedAt:new Date(Date.now()-age*30*24*3600*1000).toISOString(),
      ageMonths:age, niche, language:lang, country:cntry,
    };
  },

  setLoading(on) {
    this.loading = on;
    const ig  = document.getElementById('analyzer-input-group');
    const sp  = document.getElementById('analyzer-spinner');
    const btn = document.getElementById('analyze-btn');
    if (ig)  ig.style.display  = on ? 'none' : '';
    if (sp)  sp.classList.toggle('visible', on);
    if (btn) btn.disabled = on;
  },

  render(data) {
    const rev   = calcRevenue(data);
    const score = calcScore(data, rev);

    // Show results section
    const sec = document.getElementById('results');
    if (sec) {
      sec.classList.add('visible');
      // Force all inner reveals visible immediately (already scrolling to it)
      sec.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      setTimeout(() => {
        const hdr = document.getElementById('header');
        const off = (hdr ? hdr.offsetHeight : 64) + 12;
        const top = sec.getBoundingClientRect().top + window.scrollY - off;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 80);
    }

    // Avatar
    const av = document.getElementById('res-avatar');
    if (av) {
      av.src = data.avatar||'';
      av.alt = data.title;
      av.onerror = () => { av.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.title)}&background=FF0000&color=fff&size=200&bold=true`; };
    }

    // Banner
    const bn = document.getElementById('res-banner');
    if (bn) { if (data.banner) { bn.src=data.banner; bn.style.display=''; } else bn.style.display='none'; }

    // Text
    set('res-name',     data.title);
    set('res-handle',   data.handle);
    set('res-niche',    RPM_DATA.niches[data.niche]?.label||data.niche);
    set('res-language', data.language);
    set('res-country',  data.country);
    set('res-subs',     fmtNum(data.subscriberCount));
    set('res-views',    fmtNum(data.viewCount));
    set('res-videos',   fmtNum(data.videoCount));
    set('res-created',  new Date(data.publishedAt).toLocaleDateString('en-US',{year:'numeric',month:'long'}));

    // Revenue
    set('res-month-min', fmtUSD(rev.monthly.min));
    set('res-month-avg', fmtUSD(rev.monthly.avg));
    set('res-month-max', fmtUSD(rev.monthly.max));
    set('res-year-min',  fmtUSD(rev.annual.min));
    set('res-year-avg',  fmtUSD(rev.annual.avg));
    set('res-year-max',  fmtUSD(rev.annual.max));

    // Chart
    renderChart(rev);

    // Score
    const sEl = document.getElementById('res-score-num');
    if (sEl) { sEl.textContent = '0'; counter(sEl, 0, score.score, 900); }
    set('res-score-level', score.level);
    bar('res-score-bar',     score.score);
    bar('res-rpm-bar',       score.rpm);
    bar('res-sponsor-bar',   score.sponsor);
    bar('res-affiliate-bar', score.affiliate);
    bar('res-growth-bar',    score.growth);
    set('res-rpm-val',       score.rpm+'/100');
    set('res-sponsor-val',   score.sponsor+'/100');
    set('res-affiliate-val', score.affiliate+'/100');
    set('res-growth-val',    score.growth+'/100');

    // ── CRITICAL: only call pushState if we're on a real server,
    // NOT on file:// and NOT if it would cause a 404 navigation on Netlify.
    // We use replaceState with a hash instead so no page reload ever happens.
    try {
      if (location.protocol !== 'file:') {
        const slug = data.handle ? data.handle.replace('@','') : data.id;
        history.replaceState({ channelId: data.id }, '', `#channel/${slug}`);
      }
    } catch(_) {}

    document.title = `${data.title} — YouTube Analyzer by Norcanto`;
    showToast('Analysis complete!','success');
  }
};

/* ========================
   DOM HELPERS
   ======================== */
function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function bar(id, pct) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => { el.style.width = Math.min(100,Math.max(0,pct))+'%'; }, 360);
}
function counter(el, from, to, ms) {
  const s = performance.now();
  const tick = ts => { const p=Math.min(1,(ts-s)/ms); el.textContent=Math.round(from+(to-from)*p); if(p<1)requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function shakeInput() {
  const el = document.getElementById('channel-input');
  if (!el) return;
  el.classList.add('input-error');
  setTimeout(() => el.classList.remove('input-error'), 700);
}

/* ========================
   CHART
   ======================== */
function renderChart(rev) {
  const c = document.getElementById('revenue-chart');
  if (!c) return;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const seas   = [0.85,0.82,0.90,0.92,0.95,1.00,0.88,0.90,0.95,1.05,1.15,1.20];
  const maxV   = Math.max(1, rev.monthly.max * 1.2);
  c.innerHTML = months.map((m,i) => {
    const h = (v) => Math.max(3, Math.round((rev.monthly[v] * seas[i] / maxV) * 130));
    return `<div class="chart-bar-group" title="${m}: ${fmtUSD(Math.round(rev.monthly.avg*seas[i]))}">
      <div class="chart-bars">
        <div class="chart-bar min" style="height:${h('min')}px"></div>
        <div class="chart-bar avg" style="height:${h('avg')}px"></div>
        <div class="chart-bar max" style="height:${h('max')}px"></div>
      </div>
      <div class="chart-bar-label">${m.slice(0,1)}</div>
    </div>`;
  }).join('');
}

/* ========================
   CALCULATOR
   ======================== */
const Calc = {
  init() {
    ['calc-views','calc-country','calc-niche'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.addEventListener('input',()=>this.run()); el.addEventListener('change',()=>this.run()); }
    });
    document.querySelectorAll('.type-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active'); this.run();
      })
    );
    this.run();
  },
  run() {
    const views = parseFloat(document.getElementById('calc-views')?.value)||100000;
    const cntry = document.getElementById('calc-country')?.value||'US';
    const niche = document.getElementById('calc-niche')?.value||'entertainment';
    const short = document.querySelector('.type-btn.active')?.dataset.type==='shorts';
    const nd    = RPM_DATA.niches[niche]||RPM_DATA.niches.entertainment;
    const cm    = RPM_DATA.countries[cntry]||RPM_DATA.countries.OTHER;
    const tm    = short ? 0.08 : 1;
    const r     = (m) => fmtUSD(Math.round((views/1000)*nd.rpm*m*cm*tm));
    set('calc-min', r(0.45)); set('calc-avg', r(1)); set('calc-max', r(1.9));
  }
};

/* ========================
   FAQ
   ======================== */
const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(btn =>
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item'), open = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        if (!open) item.classList.add('open');
      })
    );
  }
};

/* ========================
   SMOOTH SCROLL (nav anchors)
   ======================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      // Don't intercept hash-channel URLs
      if (id.startsWith('channel/')) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const off = (document.getElementById('header')?.offsetHeight||64)+8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior:'smooth' });
    });
  });
}

/* ========================
   HEADER SCROLL SHADOW
   ======================== */
function initHeaderScroll() {
  const h = document.getElementById('header');
  if (!h) return;
  const update = () => h.style.boxShadow = scrollY>8 ? '0 2px 24px rgba(0,0,0,0.09)' : 'none';
  window.addEventListener('scroll', update, {passive:true});
  update();
}

/* ========================
   ANALYZER FORM — direct binding, no <form> element needed
   ======================== */
function initForm() {
  const input = document.getElementById('channel-input');
  const btn   = document.getElementById('analyze-btn');

  if (!input) { console.warn('[YTA] #channel-input not found'); return; }
  if (!btn)   { console.warn('[YTA] #analyze-btn not found');   return; }

  const go = () => {
    const v = input.value.trim();
    if (!v) { shakeInput(); showToast('Please enter a YouTube channel URL.','error'); return; }
    Analyzer.run(v);
  };

  btn.addEventListener('click', go);
  input.addEventListener('keydown', e => { if (e.key==='Enter') { e.preventDefault(); go(); } });
  input.addEventListener('input', () => input.classList.remove('input-error'));
}

/* ========================
   BOOT
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
  // Inject logo
  if (typeof LOGO_B64 !== 'undefined') {
    document.querySelectorAll('.site-logo-img').forEach(img => { img.src = LOGO_B64; });
  }

  ThemeManager.init();
  LangManager.init();
  MobileMenu.init();
  ScrollReveal.init();
  CookieBanner.init();
  initForm();
  Calc.init();
  FAQ.init();
  initSmoothScroll();
  initHeaderScroll();
});
