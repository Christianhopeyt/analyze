/* ===========================
   Norlytics
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
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  },
  toggle() { this.apply(this.current === 'dark' ? 'light' : 'dark'); }
};

/* ========================
   LANGUAGE
   ======================== */
const LangManager = {
  current: location.pathname === '/fr' || location.pathname.startsWith('/fr/') ? 'FR' : 'EN',
  strings: {
    EN: {
      hero_title:        'Discover How Much a <span class="accent">YouTube Channel</span> Can Earn',
      hero_subtitle:     'Free YouTube engagement rate calculator and channel country analyzer. Paste any channel URL and get a complete revenue estimate, RPM breakdown, and business potential score — in seconds.',
      analyzer_label:    'YouTube Channel Analysis',
      input_placeholder: 'Paste a YouTube channel URL or @handle...',
      analyze_btn:       'Analyze Now',
      calc_title:        'Make a Manual Estimate',
      blog_title:        'Latest from the Blog',
      faq_title:         'Frequently Asked Questions',
      hero_badge:        'Free YouTube Channel Analyzer — Updated 2026',
      how_it_works:      'How It Works',
      how_subtitle:      'Three steps to a complete YouTube channel analysis',
      step1_title:       'Paste the Channel URL',
      step1_desc:        'Paste any YouTube channel URL — handles, custom URLs, and channel IDs all supported.',
      step2_title:       'AI-Powered Analysis',
      step2_desc:        'Our algorithm detects niche, language, and audience to calculate the most accurate RPM-based revenue estimate.',
      step3_title:       'Get Your Revenue Report',
      step3_desc:        'Receive a full breakdown of monthly and annual earnings, business score, and growth potential in seconds.',
      calc_subtitle:     'Enter your own numbers to calculate estimated YouTube revenue',
      view_all_articles: 'View All Articles',
      result_subs:       'Subscribers',
      result_views:      'Total Views',
      result_videos:     'Videos',
      result_created:    'Channel Created',
      monthly_revenue:   'Monthly Revenue',
      annual_revenue:    'Annual Revenue',
      minimum:           'Minimum',
      average:           'Average',
      maximum:           'Maximum',
      business_score:    'Business Potential Score',
      score_subtitle:    'Composite monetization potential',
      norcanto_title:    'Need to Work Smarter with Your Documents?',
      norcanto_text:     'Use Norcanto AI to analyze, summarize, translate, and leverage your documents with artificial intelligence.',
      norcanto_btn:      'Discover Norcanto AI',
      quickdocs_title:   'Convert Your Documents in Seconds',
      quickdocs_text:    'QuickDocs Converter allows you to quickly convert PDF, DOCX, PPTX, XLSX files and much more. Fast, secure, and free.',
      quickdocs_btn:     'Use QuickDocs Converter',
      about_title:       'About Norlytics',
      about_sub:         'Norlytics gives creators and marketers clear YouTube channel analytics, revenue estimates, and niche opportunity insights.',
      about_mission_h:   'Our Mission',
      about_method_h:    'How Revenue Is Calculated',
      about_data_h:      'Data Sources',
      about_score_h:     'The Business Potential Score',
      about_norcanto_h:  'The Company Behind Norlytics',
      about_cta_h:       'Ready to Analyze a YouTube Channel?',
      about_cta_p:       'Paste any channel URL and get a public-data revenue estimate with a clear methodology — free, no login required.',
      about_cta_btn:     'Analyze a Channel Free',
      privacy_title:     'Privacy Policy',
      privacy_updated:   'Last updated: January 1, 2026',
      terms_title:       'Terms of Use',
      terms_updated:     'Last updated: January 1, 2026',
      contact_title:     'Contact Us',
      contact_sub:       'We read every message and reply within 48 hours.',
      contact_form_h:    'Send a Message',
      contact_name_l:    'Your Name',
      contact_email_l:   'Email Address',
      contact_subject_l: 'Subject',
      contact_subject_p: 'Select a topic...',
      contact_message_l: 'Message',
      contact_message_p: 'Tell us how we can help...',
      contact_submit:    'Send Message',
      contact_resp_t:    'Response Time',
      contact_resp_p:    'We reply within 48 hours on business days (Mon\u2013Fri).',
      contact_priv_t:    'Privacy Requests',
      contact_priv_p:    'For data deletion or privacy concerns, email privacy@norcanto.com directly.',
      contact_free_t:    'Free Tool',
      contact_free_p:    'Norlytics is 100% free. No account, no subscription.',
      contact_success_h: 'Message sent!',
      contact_success_p: 'Thank you for reaching out. We will reply within 48 hours.',
      cookies_title:     'Cookie Policy',
      cookies_updated:   'Last updated: January 1, 2026',
      cookies_what_h:    'What Are Cookies?',
      cookies_what_p:    'Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences and improve your experience.',
      cookies_use_h:     'Cookies We Use',
      cookies_manage_h:  'Managing Cookies',
      cookies_manage_p:  'You can manage or delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of this site.',
      blog_hero_title:   'YouTube Creator Blog',
      blog_hero_sub:     'Guides, strategies, and 2026 data-driven insights for YouTube creators and marketers',
      blog_filter_lbl:   'Filter:',
      blog_cta_h:        "Check Any Channel's Real Revenue Potential",
      blog_cta_p:        'Use Norlytics to get an instant revenue estimate, engagement rate, and Business Potential Score for any public channel.',
      blog_cta_btn:      'Analyze a Channel Free',
      footer_copy:       '\u00a9 2026 Norlytics. All rights reserved.',
      footer_desc:       'Free YouTube channel revenue analysis and performance insights. Powered by Norcanto.',
      cookie_text:       'With your permission, we use Google Analytics and may load Google AdSense. Rejecting keeps non-essential Google scripts disabled. See our Cookie Policy.',
      cookie_accept:     'Accept',
      cookie_reject:     'Reject',
      nav_analysis:      'Channel Analysis',
      nav_creator:       'Creator Dashboard',
      nav_calculator:    'Calculator',
      nav_niche:         'Niche Insights',
      nav_blog:          'Blog',
      nav_privacy:       'Privacy',
      nav_about:         'About',
      creator_cta_title: 'Want deeper channel insights?',
      creator_cta_text:  'Open Creator Dashboard for upload patterns, growth velocity, top videos, and AI content ideas.',
      creator_cta_button:'Open Creator Dashboard',
      loading:           'Analyzing channel data...',
      invalid_channel:   'Enter a valid YouTube channel URL or @handle.',
      empty_channel:     'Please enter a YouTube channel URL or @handle.',
      hourly_limit:      'Hourly limit reached. Try again later.',
      analysis_complete: 'Analysis complete.',
      analysis_failed:   'Analysis failed. Please try again.',
      live_notice:       'Live channel statistics retrieved from YouTube. Revenue figures are independent estimates and are not provided by YouTube.',
    },
    FR: {
      hero_title:        'D\u00e9couvrez Combien une <span class="accent">Cha\u00eene YouTube</span> Peut Gagner',
      hero_subtitle:     "Calculateur de taux d'engagement YouTube gratuit et analyseur de pays. Collez une URL de cha\u00eene et obtenez une estimation compl\u00e8te des revenus, RPM et score de potentiel en quelques secondes.",
      analyzer_label:    'Analyse de Cha\u00eene YouTube',
      input_placeholder: "Collez l'URL d'une cha\u00eene YouTube ou @pseudo...",
      analyze_btn:       'Analyser Maintenant',
      calc_title:        'Faire une Estimation Manuelle',
      blog_title:        'Derniers Articles du Blog',
      faq_title:         'Questions Fr\u00e9quentes',
      hero_badge:        'Norlytics Gratuit \u2014 Mis \u00e0 jour 2026',
      how_it_works:      'Comment \u00c7a Fonctionne',
      how_subtitle:      'Trois \u00e9tapes pour une analyse compl\u00e8te de cha\u00eene YouTube',
      step1_title:       "Collez l'URL de la Cha\u00eene",
      step1_desc:        "Collez n'importe quelle URL YouTube \u2014 handles, URLs personnalis\u00e9es et identifiants de cha\u00eene tous accept\u00e9s.",
      step2_title:       'Analyse par Intelligence Artificielle',
      step2_desc:        "Notre algorithme d\u00e9tecte la niche, la langue et l'audience pour calculer l'estimation de revenus la plus pr\u00e9cise.",
      step3_title:       'Recevez Votre Rapport',
      step3_desc:        'Obtenez une ventilation compl\u00e8te des revenus mensuels et annuels, score commercial et potentiel de croissance en secondes.',
      calc_subtitle:     'Entrez vos propres chiffres pour calculer les revenus YouTube estim\u00e9s',
      view_all_articles: 'Voir Tous les Articles',
      result_subs:       'Abonn\u00e9s',
      result_views:      'Vues Totales',
      result_videos:     'Vid\u00e9os',
      result_created:    'Cha\u00eene Cr\u00e9\u00e9e',
      monthly_revenue:   'Revenus Mensuels',
      annual_revenue:    'Revenus Annuels',
      minimum:           'Minimum',
      average:           'Moyenne',
      maximum:           'Maximum',
      business_score:    'Score de Potentiel Commercial',
      score_subtitle:    'Potentiel de mon\u00e9tisation composite',
      norcanto_title:    'Besoin de Travailler Plus Intelligemment avec vos Documents\u00a0?',
      norcanto_text:     "Utilisez Norcanto AI pour analyser, r\u00e9sumer, traduire et exploiter vos documents gr\u00e2ce \u00e0 l'intelligence artificielle.",
      norcanto_btn:      'D\u00e9couvrir Norcanto AI',
      quickdocs_title:   'Convertissez vos Documents en Quelques Secondes',
      quickdocs_text:    'QuickDocs Converter vous permet de convertir rapidement des fichiers PDF, DOCX, PPTX, XLSX et bien plus encore.',
      quickdocs_btn:     'Utiliser QuickDocs Converter',
      about_title:       '\u00c0 Propos de Norlytics',
      about_sub:         "Norlytics offre aux cr\u00e9ateurs et sp\u00e9cialistes marketing des analyses YouTube claires, des estimations de revenus et des insights sur les opportunit\u00e9s de niche.",
      about_mission_h:   'Notre Mission',
      about_method_h:    'Comment les Revenus Sont Calcul\u00e9s',
      about_data_h:      'Sources de Donn\u00e9es',
      about_score_h:     'Le Score de Potentiel Commercial',
      about_norcanto_h:  "L'entreprise derri\u00e8re Norlytics",
      about_cta_h:       'Pr\u00eat \u00e0 Analyser une Cha\u00eene YouTube\u00a0?',
      about_cta_p:       "Collez n'importe quelle URL de cha\u00eene et obtenez une estimation des revenus fond\u00e9e sur des donn\u00e9es publiques et une m\u00e9thode transparente \u2014 gratuit, sans compte requis.",
      about_cta_btn:     'Analyser une Cha\u00eene Gratuitement',
      privacy_title:     'Politique de Confidentialit\u00e9',
      privacy_updated:   'Derni\u00e8re mise \u00e0 jour\u00a0: 1er janvier 2026',
      terms_title:       "Conditions d'Utilisation",
      terms_updated:     'Derni\u00e8re mise \u00e0 jour\u00a0: 1er janvier 2026',
      contact_title:     'Nous Contacter',
      contact_sub:       'Nous lisons chaque message et r\u00e9pondons sous 48 heures.',
      contact_form_h:    'Envoyer un Message',
      contact_name_l:    'Votre Nom',
      contact_email_l:   'Adresse E-mail',
      contact_subject_l: 'Sujet',
      contact_subject_p: 'S\u00e9lectionnez un sujet\u2026',
      contact_message_l: 'Message',
      contact_message_p: 'Comment pouvons-nous vous aider\u00a0?',
      contact_submit:    'Envoyer le Message',
      contact_resp_t:    'D\u00e9lai de R\u00e9ponse',
      contact_resp_p:    'Nous r\u00e9pondons sous 48 heures les jours ouvr\u00e9s (lun.\u2013ven.).',
      contact_priv_t:    'Demandes de Confidentialit\u00e9',
      contact_priv_p:    'Pour toute suppression de donn\u00e9es ou question de confidentialit\u00e9, \u00e9crivez directement \u00e0 privacy@norcanto.com.',
      contact_free_t:    'Outil Gratuit',
      contact_free_p:    'Norlytics est 100\u00a0% gratuit. Aucun compte, aucun abonnement.',
      contact_success_h: 'Message envoy\u00e9\u00a0!',
      contact_success_p: 'Merci de nous avoir contact\u00e9s. Nous vous r\u00e9pondrons sous 48 heures.',
      cookies_title:     'Politique des Cookies',
      cookies_updated:   'Derni\u00e8re mise \u00e0 jour\u00a0: 1er janvier 2026',
      cookies_what_h:    'Que Sont les Cookies\u00a0?',
      cookies_what_p:    'Les cookies sont de petits fichiers texte plac\u00e9s sur votre appareil lorsque vous visitez un site web. Ils permettent aux sites de m\u00e9moriser vos pr\u00e9f\u00e9rences et d\'am\u00e9liorer votre exp\u00e9rience.',
      cookies_use_h:     'Cookies Utilis\u00e9s',
      cookies_manage_h:  'G\u00e9rer les Cookies',
      cookies_manage_p:  'Vous pouvez g\u00e9rer ou supprimer les cookies via les param\u00e8tres de votre navigateur. Notez que la d\u00e9sactivation de certains cookies peut affecter le fonctionnement du site.',
      blog_hero_title:   'Blog Cr\u00e9ateurs YouTube',
      blog_hero_sub:     'Guides, strat\u00e9gies et donn\u00e9es 2026 pour les cr\u00e9ateurs et sp\u00e9cialistes marketing YouTube',
      blog_filter_lbl:   'Filtrer\u00a0:',
      blog_cta_h:        "V\u00e9rifiez le Potentiel de Revenus de N'importe Quelle Cha\u00eene",
      blog_cta_p:        'Utilisez Norlytics pour obtenir une estimation instantan\u00e9e des revenus, du taux d\'engagement et du Score de Potentiel Commercial.',
      blog_cta_btn:      'Analyser une Cha\u00eene Gratuitement',
      footer_copy:       '\u00a9 2026 Norlytics. Tous droits r\u00e9serv\u00e9s.',
      footer_desc:       'Analyse gratuite des revenus et performances de cha\u00eenes YouTube. Propuls\u00e9 par Norcanto.',
      cookie_text:       'Avec votre autorisation, nous utilisons Google Analytics et pouvons charger Google AdSense. Refuser maintient les scripts Google non essentiels d\u00e9sactiv\u00e9s. Consultez notre Politique des Cookies.',
      cookie_accept:     'Accepter',
      cookie_reject:     'Refuser',
      nav_analysis:      'Analyse de Cha\u00eene',
      nav_creator:       'Tableau Créateur',
      nav_calculator:    'Calculateur',
      nav_niche:         'Tendances de Niche',
      nav_blog:          'Blog',
      nav_privacy:       'Confidentialit\u00e9',
      nav_about:         '\u00c0 Propos',
      creator_cta_title: 'Vous souhaitez des analyses plus approfondies\u00a0?',
      creator_cta_text:  'Ouvrez le Tableau Cr\u00e9ateur pour analyser le rythme de publication, la croissance, les meilleures vid\u00e9os et les id\u00e9es IA.',
      creator_cta_button:'Ouvrir le Tableau Cr\u00e9ateur',
      loading:           'Analyse des donn\u00e9es de la cha\u00eene...',
      invalid_channel:   'Saisissez une URL YouTube ou un @pseudo valide.',
      empty_channel:     'Saisissez une URL YouTube ou un @pseudo.',
      hourly_limit:      'Limite horaire atteinte. R\u00e9essayez plus tard.',
      analysis_complete: 'Analyse termin\u00e9e.',
      analysis_failed:   "L'analyse a \u00e9chou\u00e9. Veuillez r\u00e9essayer.",
      live_notice:       'Statistiques de cha\u00eene r\u00e9cup\u00e9r\u00e9es depuis YouTube. Les revenus sont des estimations ind\u00e9pendantes non fournies par YouTube.',
    }
  },
  init() {
    localStorage.setItem('yta-lang', this.current);
    document.querySelectorAll('.lang-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        if (btn.dataset.lang === this.current) return;
        const path = location.pathname.replace(/^\/fr(?=\/|$)/, '') || '/';
        const targetPath = btn.dataset.lang === 'FR' ? `/fr${path === '/' ? '' : path}` : path;
        location.href = `${targetPath}${location.search}${location.hash}`;
      })
    );
    this.apply(this.current);
  },
  apply(lang, persist = true) {
    this.current = lang;
    if (persist) localStorage.setItem('yta-lang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn =>
      {
        const active = btn.dataset.lang === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      }
    );
    const s = this.strings[lang]; if (!s) return;
    const q   = id  => document.getElementById(id);
    const qs  = sel => document.querySelector(sel);
    const qsa = sel => document.querySelectorAll(sel);
    const txt = (id, key) => { const el = q(id); if (el && s[key] !== undefined) el.textContent = s[key]; };
    const ph  = (id, key) => { const el = q(id); if (el && s[key] !== undefined) el.placeholder  = s[key]; };

    // ── data-i18n attribute: <any data-i18n="key"> (works on every page) ──
    qsa('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] !== undefined) el.textContent = s[k]; });
    qsa('[data-i18n-ph]').forEach(el => { const k = el.dataset.i18nPh; if (s[k] !== undefined) el.placeholder = s[k]; });
    qsa('[data-i18n-html]').forEach(el => { const k = el.dataset.i18nHtml; if (s[k] !== undefined) el.innerHTML = s[k]; });

    // ── Index page ──
    const htEl = q('hero-title');
    if (htEl) htEl.innerHTML = s.hero_title;
    txt('hero-subtitle',     'hero_subtitle');
    txt('analyzer-label',    'analyzer_label');
    ph('channel-input',      'input_placeholder');
    txt('analyze-btn-text',  'analyze_btn');
    txt('spinner-text',      'loading');
    txt('calc-title',        'calc_title');
    txt('calc-subtitle',     'calc_subtitle');
    txt('faq-title',         'faq_title');
    txt('blog-preview-title','blog_title');
    txt('hiw-title',         'how_it_works');
    txt('hiw-subtitle',      'how_subtitle');
    txt('step1-title',       'step1_title');  txt('step1-desc', 'step1_desc');
    txt('step2-title',       'step2_title');  txt('step2-desc', 'step2_desc');
    txt('step3-title',       'step3_title');  txt('step3-desc', 'step3_desc');
    txt('norcanto-promo-title',   'norcanto_title');
    txt('norcanto-promo-text',    'norcanto_text');
    txt('norcanto-promo-btn',     'norcanto_btn');
    txt('quickdocs-promo-title',  'quickdocs_title');
    txt('quickdocs-promo-text',   'quickdocs_text');
    txt('quickdocs-promo-btn',    'quickdocs_btn');

    // Hero badge
    const badge = qs('.hero-badge');
    if (badge && s.hero_badge) badge.childNodes.forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) n.textContent = ' ' + s.hero_badge + ' '; });

    // View all articles button
    const vaa = qs('.view-all-articles');
    if (vaa) vaa.childNodes.forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) n.textContent = ' ' + s.view_all_articles + ' '; });

    // Results stat labels
    txt('stat-label-subs',    'result_subs');
    txt('stat-label-views',   'result_views');
    txt('stat-label-videos',  'result_videos');
    txt('stat-label-created', 'result_created');
    txt('res-score-title',    'business_score');
    txt('res-score-subtitle', 'score_subtitle');

    // Revenue period labels (contain SVG, so use childNode text)
    const patchPeriod = (id, key) => {
      const el = q(id);
      if (el && s[key]) el.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ' ' + s[key]; });
    };
    patchPeriod('rev-period-monthly', 'monthly_revenue');
    patchPeriod('rev-period-annual',  'annual_revenue');

    // Revenue row labels (Minimum / Average / Maximum)
    qsa('.revenue-row-label').forEach(el => {
      const t = el.textContent.trim();
      if (/^(Minimum)$/i.test(t))         el.textContent = s.minimum;
      if (/^(Average|Moyenne)$/i.test(t)) el.textContent = s.average;
      if (/^(Maximum)$/i.test(t))         el.textContent = s.maximum;
    });

    // ── About page ──
    txt('about-page-title',   'about_title');
    txt('about-page-sub',     'about_sub');
    txt('about-mission-h',    'about_mission_h');
    txt('about-method-h',     'about_method_h');
    txt('about-data-h',       'about_data_h');
    txt('about-score-h',      'about_score_h');
    txt('about-norcanto-h',   'about_norcanto_h');
    txt('about-cta-h',        'about_cta_h');
    txt('about-cta-p',        'about_cta_p');
    txt('about-cta-btn',      'about_cta_btn');

    // ── Privacy page ──
    txt('privacy-page-title',   'privacy_title');
    txt('privacy-page-updated', 'privacy_updated');

    // ── Terms page ──
    txt('terms-page-title',   'terms_title');
    txt('terms-page-updated', 'terms_updated');

    // ── Contact page ──
    txt('contact-page-title',   'contact_title');
    txt('contact-page-sub',     'contact_sub');
    txt('contact-form-h',       'contact_form_h');
    txt('contact-name-label',   'contact_name_l');
    txt('contact-email-label',  'contact_email_l');
    txt('contact-subject-label','contact_subject_l');
    ph('cf-subject',            'contact_subject_p');
    txt('contact-message-label','contact_message_l');
    ph('cf-message',            'contact_message_p');
    ph('cf-name',               'contact_name_l');
    ph('cf-email',              'contact_email_l');
    txt('submit-label',         'contact_submit');
    txt('contact-resp-title',   'contact_resp_t');
    txt('contact-resp-text',    'contact_resp_p');
    txt('contact-priv-title',   'contact_priv_t');
    txt('contact-priv-text',    'contact_priv_p');
    txt('contact-free-title',   'contact_free_t');
    txt('contact-free-text',    'contact_free_p');
    txt('form-success-h',       'contact_success_h');
    txt('form-success-p',       'contact_success_p');

    // ── Cookies page ──
    txt('cookies-page-title',   'cookies_title');
    txt('cookies-page-updated', 'cookies_updated');
    txt('cookies-what-h',       'cookies_what_h');
    txt('cookies-what-p',       'cookies_what_p');
    txt('cookies-use-h',        'cookies_use_h');
    txt('cookies-manage-h',     'cookies_manage_h');
    txt('cookies-manage-p',     'cookies_manage_p');

    // ── Blog page ──
    txt('blog-hero-title',  'blog_hero_title');
    txt('blog-hero-sub',    'blog_hero_sub');
    txt('filter-label',     'blog_filter_lbl');
    txt('blog-cta-h',       'blog_cta_h');
    txt('blog-cta-p',       'blog_cta_p');
    txt('blog-cta-btn',     'blog_cta_btn');

    // ── Footer (all pages) ──
    qsa('.footer-copy').forEach(el => { el.textContent = s.footer_copy; });
    qsa('.footer-desc').forEach(el => { el.textContent = s.footer_desc; });

    // ── Cookie banner ──
    const cb = q('cookie-banner-text');
    if (cb && s.cookie_text) {
      // Preserve the cookies-notice link inside the banner text
      const linkEl = cb.querySelector('a');
      const linkHtml = linkEl ? linkEl.outerHTML : '<a href="/cookies-notice">Cookie Policy</a>';
      cb.innerHTML = s.cookie_text.replace('Cookie Policy', linkHtml).replace('Politique des Cookies', linkHtml);
    }
    txt('cookie-accept-label', 'cookie_accept');
    txt('cookie-reject-label', 'cookie_reject');

    const notice = q('results-data-notice');
    if (notice?.classList.contains('visible')) {
      notice.textContent = s.live_notice;
    }

    // ── Nav links (desktop + mobile, all pages) ──
    qsa('.header-nav a, .mobile-menu a').forEach(a => {
      const navKey = a.dataset.nav;
      if (navKey && s[`nav_${navKey}`]) {
        a.textContent = s[`nav_${navKey}`];
        return;
      }
      const href = a.getAttribute('href') || '';
      const clean = href.replace(/^.*?#/, '#').replace(/^.*\/([^/]+)\/?$/, '$1');
      if (clean.includes('#analyzer') || clean.includes('analyzer'))          { if (!clean.includes('http') && !clean.includes('norcanto')) a.textContent = s.nav_analysis; }
      if (clean.includes('#calculator') || clean === 'calculator')             a.textContent = s.nav_calculator;
      if (clean === 'blog') a.textContent = s.nav_blog;
      if (clean.includes('privacy') && !clean.includes('http'))               a.textContent = s.nav_privacy;
      if (clean.includes('about') && !clean.includes('http'))                 a.textContent = s.nav_about;
    });

    // html lang attr
    document.documentElement.lang = lang === 'FR' ? 'fr' : 'en';
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
    if (!menu.id) menu.id = 'mobile-menu';
    hamburger.setAttribute('aria-controls', menu.id);
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-hidden', 'true');
    if (!menu.getAttribute('aria-label')) menu.setAttribute('aria-label', 'Mobile navigation');

    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    menu.after(backdrop);

    const close = (restoreFocus = false) => {
      menu.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      menu.setAttribute('aria-hidden', 'true');
      if (restoreFocus) hamburger.focus();
    };
    const open = () => {
      menu.classList.add('open');
      backdrop.classList.add('open');
      document.body.classList.add('menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      menu.setAttribute('aria-hidden', 'false');
      menu.querySelector('a, button')?.focus();
    };
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.contains('open') ? close() : open();
    });
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) close();
    });
    backdrop.addEventListener('click', () => close(true));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) close(true);
      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const focusable = [...menu.querySelectorAll('a[href], button:not([disabled])')];
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menu.classList.contains('open')) close();
    }, { passive: true });
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
const ConsentManager = {
  choice: localStorage.getItem('yta-cookies'),
  scriptLoaded(id) {
    return Boolean(document.getElementById(id));
  },
  loadScript(id, src, attributes = {}) {
    if (this.scriptLoaded(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
    document.head.appendChild(script);
  },
  loadGoogleServices() {
    if (this.choice !== 'accepted') return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-5BCXGE5L5G');
    this.loadScript('norlytics-google-analytics', 'https://www.googletagmanager.com/gtag/js?id=G-5BCXGE5L5G');
    this.loadScript(
      'norlytics-google-adsense',
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8121112277976862',
      { crossorigin: 'anonymous' }
    );
  },
  accept() {
    this.choice = 'accepted';
    localStorage.setItem('yta-cookies', this.choice);
    this.loadGoogleServices();
  },
  reject() {
    this.choice = 'rejected';
    localStorage.setItem('yta-cookies', this.choice);
  },
  init() {
    this.loadGoogleServices();
  }
};

const CookieBanner = {
  init() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    if (localStorage.getItem('yta-cookies')) { banner.classList.add('hidden'); return; }
    banner.classList.remove('hidden');
    document.getElementById('cookie-accept')?.addEventListener('click', () => {
      ConsentManager.accept(); banner.classList.add('hidden');
    });
    document.getElementById('cookie-reject')?.addEventListener('click', () => {
      ConsentManager.reject(); banner.classList.add('hidden');
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
  t.setAttribute('role', type === 'error' ? 'alert' : 'status');
  t.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
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
    if (this._rl.n >= this._rl.max) { showToast(this.text('hourly_limit'),'error'); return false; }
    this._rl.n++; return true;
  },

  async run(raw) {
    if (this.loading) return;
    const parsed = this.parse(raw);
    if (!parsed) { this.showError(this.text('invalid_channel')); return; }
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
      // Live channel data is fetched through the same-origin serverless proxy.
      // ────────────────────────────────────────────────────────────────────────
      const data = await this.ytFetch(parsed);

      if (!data) { showToast('Channel not found. Check the URL.','error'); return; }
      try { localStorage.setItem(ck, JSON.stringify({d:data,t:Date.now()})); } catch(_){}
      this.render(data);
    } catch(err) {
      console.error('[YTA]', err);
      this.showError(this.text('analysis_failed'));
    } finally {
      this.setLoading(false);
    }
  },

  async ytFetch(parsed) {
    const query = `type=${encodeURIComponent(parsed.type)}&value=${encodeURIComponent(parsed.value)}`;
    const response = await fetch(`/api/channel-analyzer?${query}`);
    if (!response.ok) throw new Error(`Channel API HTTP ${response.status}`);
    const ch = await response.json();
    const sn = ch;
    const st = ch;
    const ageMo = Math.max(1,Math.round((Date.now()-new Date(sn.publishedAt))/(1000*60*60*24*30)));
    const lang  = detectLanguage(sn.title, sn.description);
    return {
      id:ch.id, title:sn.title,
      handle: sn.handle||('@'+sn.title.toLowerCase().replace(/\s+/g,'')),
      description:sn.description,
      avatar: sn.avatar,
      banner: sn.banner,
      subscriberCount:st.hiddenSubscriberCount ? null : (st.subscriberCount||0),
      hiddenSubscriberCount:Boolean(st.hiddenSubscriberCount),
      viewCount:st.viewCount||0, videoCount:st.videoCount||0,
      publishedAt:sn.publishedAt, ageMonths:ageMo,
      niche:detectNiche(sn.title,sn.description), language:lang,
      country:sn.country||detectCountry(lang), source:'live',
    };
  },

  text(key) {
    return LangManager.strings[LangManager.current]?.[key] || LangManager.strings.EN[key] || key;
  },

  showError(message) {
    const error = document.getElementById('analyzer-error');
    const input = document.getElementById('channel-input');
    if (error) error.textContent = message;
    if (input) input.setAttribute('aria-invalid', 'true');
    shakeInput();
    showToast(message, 'error');
  },

  setLoading(on) {
    this.loading = on;
    const ig  = document.getElementById('analyzer-input-group');
    const sp  = document.getElementById('analyzer-spinner');
    const btn = document.getElementById('analyze-btn');
    if (ig)  ig.style.display  = on ? 'none' : '';
    if (sp)  sp.classList.toggle('visible', on);
    if (btn) btn.disabled = on;
    if (sp) sp.setAttribute('aria-hidden', String(!on));
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

    const notice = document.getElementById('results-data-notice');
    if (notice) {
      notice.textContent = this.text('live_notice');
      notice.className = 'data-notice visible live';
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
    set('res-subs',     data.hiddenSubscriberCount ? '—' : fmtNum(data.subscriberCount));
    set('res-views',    fmtNum(data.viewCount));
    set('res-videos',   fmtNum(data.videoCount));
    set('res-created',  new Date(data.publishedAt).toLocaleDateString(LangManager.current === 'FR' ? 'fr-FR' : 'en-US',{year:'numeric',month:'long'}));

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

    document.title = `${data.title} — Norlytics`;
    showToast(this.text('analysis_complete'),'success');
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
        document.querySelectorAll('.type-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        this.run();
      })
    );
    document.querySelectorAll('.type-btn').forEach(btn =>
      btn.setAttribute('aria-pressed', String(btn.classList.contains('active')))
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
    document.querySelectorAll('.faq-question').forEach((btn, index) => {
      const answer = btn.closest('.faq-item')?.querySelector('.faq-answer');
      if (!answer) return;
      const answerId = answer.id || `faq-answer-${index + 1}`;
      answer.id = answerId;
      btn.setAttribute('aria-controls', answerId);
      btn.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item'), open = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          el.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'true');
        });
        if (!open) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
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

function normalizeNavigation() {
  const path = location.pathname.toLowerCase();
  const localePrefix = path === '/fr' || path.startsWith('/fr/') ? '/fr' : '';
  const isFrench = localePrefix === '/fr';
  const localHref = href => `${localePrefix}${isFrench && href.startsWith('/#') ? href.slice(1) : href}`;
  const active = path.includes('/blog/') ? 'blog'
    : path.includes('/creator-dashboard') ? 'creator'
    : path.includes('/niche-insights') ? 'niche'
    : path.includes('/privacy/') ? 'privacy'
    : path.includes('/about/') ? 'about'
    : path === '/' || path === '/fr' ? 'analysis'
    : '';
  const labels = isFrench
    ? { analysis: 'Analyse de chaîne', creator: 'Tableau Créateur', calculator: 'Calculateur', niche: 'Tendances de niche', blog: 'Blog', privacy: 'Confidentialité', about: 'À propos' }
    : { analysis: 'Channel Analysis', creator: 'Creator Dashboard', calculator: 'Calculator', niche: 'Niche Insights', blog: 'Blog', privacy: 'Privacy', about: 'About' };
  const links = [
    { key: 'analysis', href: localHref('/#analyzer'), label: labels.analysis },
    { key: 'creator', href: localHref('/creator-dashboard'), label: labels.creator },
    { key: 'calculator', href: localHref('/#calculator'), label: labels.calculator },
    { key: 'niche', href: localHref('/niche-insights'), label: labels.niche },
    { key: 'blog', href: localHref('/blog'), label: labels.blog },
    { key: 'privacy', href: localHref('/privacy'), label: labels.privacy },
    { key: 'about', href: localHref('/about'), label: labels.about },
  ];
  document.querySelectorAll('.header-nav').forEach(nav => {
    nav.setAttribute('aria-label', isFrench ? 'Navigation principale' : 'Primary navigation');
    nav.innerHTML = links.map(link =>
      `<a href="${link.href}" data-nav="${link.key}"${active === link.key ? ' class="active" aria-current="page"' : ''}>${link.label}</a>`
    ).join('');
  });
  document.querySelectorAll('.mobile-menu').forEach(menu => {
    const controls = menu.querySelector('.mobile-menu-controls');
    controls?.querySelectorAll('.lang-switcher').forEach(switcher => switcher.remove());
    menu.querySelectorAll(':scope > a').forEach(link => link.remove());
    links.forEach(link => {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.dataset.nav = link.key;
      anchor.textContent = link.label;
      if (active === link.key) {
        anchor.className = 'active';
        anchor.setAttribute('aria-current', 'page');
      }
      menu.insertBefore(anchor, controls);
    });
  });
}

function ensureHeaderControls() {
  document.querySelectorAll('.header-controls').forEach(controls => {
    if (!controls.querySelector('.lang-switcher')) {
      const switcher = document.createElement('div');
      switcher.className = 'lang-switcher';
      switcher.innerHTML = '<button class="lang-btn active" data-lang="EN">EN</button><button class="lang-btn" data-lang="FR">FR</button>';
      controls.prepend(switcher);
    }
  });
}

function initAccessibility() {
  const target = document.querySelector('main') || document.getElementById('analyzer');
  if (target && !target.id) target.id = 'main-content';
  if (target && !document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = `#${target.id}`;
    skip.textContent = LangManager.current === 'FR' ? 'Aller au contenu' : 'Skip to content';
    document.body.prepend(skip);
  }
  document.querySelectorAll('.header-nav a.active, .mobile-menu a.active').forEach(link =>
    link.setAttribute('aria-current', 'page')
  );
}

/* ========================
   ANALYZER FORM — direct binding, no <form> element needed
   ======================== */
function initForm() {
  const input = document.getElementById('channel-input');
  const btn   = document.getElementById('analyze-btn');
  const form  = document.getElementById('analyzer-form');

  if (!input || !btn) return;

  const go = () => {
    const v = input.value.trim();
    if (!v) { Analyzer.showError(Analyzer.text('empty_channel')); return; }
    Analyzer.run(v);
  };

  if (form) form.addEventListener('submit', e => { e.preventDefault(); go(); });
  else btn.addEventListener('click', go);
  input.addEventListener('input', () => {
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    const error = document.getElementById('analyzer-error');
    if (error) error.textContent = '';
  });
}

/* ========================
   BOOT
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  ensureHeaderControls();
  normalizeNavigation();
  LangManager.init();
  initAccessibility();
  MobileMenu.init();
  ScrollReveal.init();
  ConsentManager.init();
  CookieBanner.init();
  initForm();
  Calc.init();
  FAQ.init();
  initSmoothScroll();
  initHeaderScroll();
});
