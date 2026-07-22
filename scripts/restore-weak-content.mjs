import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const today = '2026-07-22';
const displayDate = 'July 22, 2026';

const slugs = [
  'ai-tools-for-youtube-creators',
  'grow-youtube-channel-fast',
  'youtube-cpm-countries',
  'youtube-rpm-by-niche',
  'youtube-shorts-monetization',
  'youtube-sponsorship-guide'
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.replace(/[ \t]+$/gm, ''), 'utf8');
}

function words(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function cookieHead() {
  return `  <!-- Start cookieyes banner -->
  <script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/bb75bdf1ed45084387a6477e5939d0a1/script.js"></script>
  <!-- End cookieyes banner -->
  <script type="text/plain" data-cookieyes="analytics" async src="https://www.googletagmanager.com/gtag/js?id=G-5BCXGE5L5G"></script>
  <script type="text/plain" data-cookieyes="analytics">
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-5BCXGE5L5G');
  </script>
  <script type="text/plain" data-cookieyes="advertisement" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8121112277976862" crossorigin="anonymous"></script>`;
}

function icons() {
  return `  <!-- Norlytics icons and install metadata -->
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="48x48" href="/images/favicon-48x48.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#ff0000" />`;
}

function articleCss() {
  return `
    .article-body{max-width:780px;margin:0 auto}
    .article-body h2{font-size:clamp(1.22rem,2.6vw,1.48rem);margin:clamp(34px,5vw,46px) 0 14px;color:var(--text)}
    .article-body h3{font-size:clamp(1rem,2vw,1.16rem);margin:25px 0 10px;color:var(--text)}
    .article-body p{margin-bottom:18px;color:var(--text-2);line-height:1.82;font-size:clamp(.9rem,1.8vw,1rem)}
    .article-body ul,.article-body ol{margin:0 0 20px 22px;color:var(--text-2);line-height:1.78}
    .article-body li{margin-bottom:8px;font-size:clamp(.88rem,1.8vw,1rem)}
    .article-body strong{color:var(--text)}
    .article-body a{color:var(--yt-red)}
    .article-body a:hover{text-decoration:underline}
    .callout,.source-box{background:var(--yt-red-glow);border-left:3px solid var(--yt-red);border-radius:0 var(--radius-md) var(--radius-md) 0;padding:16px 20px;margin:26px 0}
    .callout p,.source-box p{margin:0;color:var(--text-2);font-size:.91rem;line-height:1.7}
    .example-box{background:linear-gradient(135deg,rgba(255,0,0,.055),transparent 70%),var(--surface);border:1px solid rgba(255,0,0,.16);border-radius:var(--radius-lg);padding:20px;margin:28px 0}
    .example-box h3{margin-top:0}
    .placeholder{border:1px dashed var(--border);border-radius:var(--radius-lg);background:var(--bg-2);padding:18px 20px;margin:24px 0;color:var(--text-3);font-size:.9rem;line-height:1.65}
    .data-table{width:100%;border-collapse:collapse;margin:20px 0 28px;font-size:clamp(.78rem,1.5vw,.9rem);display:block;overflow-x:auto}
    .data-table th{padding:11px 14px;text-align:left;background:var(--bg-3);color:var(--text);font-weight:700;border-bottom:2px solid var(--border);white-space:nowrap}
    .data-table td{padding:10px 14px;border-bottom:1px solid var(--border-light);color:var(--text-2);vertical-align:top}
    .cta-inline{background:linear-gradient(135deg,rgba(255,0,0,.06),rgba(255,0,0,.02));border:1px solid rgba(255,0,0,.15);border-radius:var(--radius-lg);padding:24px;margin:32px 0;text-align:center}
    .cta-inline h3{font-size:clamp(1rem,2vw,1.15rem);margin-bottom:8px}
    .cta-inline p{font-size:.9rem;color:var(--text-3);margin-bottom:16px}
    .related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:16px}
    .related-grid .card{text-decoration:none;padding:18px}
    .article-trust-note{max-width:780px;margin:40px auto 8px;padding:20px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-2);color:var(--text-2);line-height:1.7}
  `;
}

function header(active = 'blog') {
  return `<header id="header"><div class="container"><div class="header-inner">
  <a href="/" class="header-logo"><img src="/images/norlytics-logo.png" alt="Norlytics" class="site-logo-img" fetchpriority="high" loading="eager" decoding="async" />Norlytics</a>
  <nav class="header-nav"><a href="/#analyzer">Channel Analysis</a><a href="/creator-dashboard"${active === 'dashboard' ? ' class="active"' : ''}>Creator Dashboard</a><a href="/niche-insights"${active === 'niche' ? ' class="active"' : ''}>Niche Insights</a><a href="/blog"${active === 'blog' ? ' class="active"' : ''}>Blog</a><a href="/about">About</a></nav>
  <div class="header-controls"><div class="lang-switcher"><button class="lang-btn active" data-lang="EN">EN</button><button class="lang-btn" data-lang="FR">FR</button></div><button class="theme-toggle" aria-label="Toggle theme"></button></div>
  <button class="hamburger" aria-label="Menu" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
</div></div></header>
<nav class="mobile-menu"><a href="/">Home</a><a href="/creator-dashboard">Creator Dashboard</a><a href="/niche-insights">Niche Insights</a><a href="/blog">Blog</a><a href="/about">About</a><div class="mobile-menu-controls"><button class="theme-toggle" aria-label="Toggle theme"></button></div></nav>`;
}

function frenchHeader() {
  return `<header id="header"><div class="container"><div class="header-inner">
  <a href="/fr" class="header-logo"><img src="/images/norlytics-logo.png" alt="Norlytics" class="site-logo-img" fetchpriority="high" loading="eager" decoding="async" />Norlytics</a>
  <nav class="header-nav"><a href="/fr">Analyse de chaine</a><a href="/fr/creator-dashboard">Tableau de bord</a><a href="/fr/niche-insights">Niche Insights</a><a href="/fr/blog" class="active">Blog</a><a href="/fr/about">A propos</a></nav>
  <div class="header-controls"><div class="lang-switcher"><button class="lang-btn" data-lang="EN">EN</button><button class="lang-btn active" data-lang="FR">FR</button></div><button class="theme-toggle" aria-label="Changer le theme"></button></div>
  <button class="hamburger" aria-label="Menu" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
</div></div></header>
<nav class="mobile-menu"><a href="/fr">Accueil</a><a href="/fr/creator-dashboard">Tableau de bord</a><a href="/fr/niche-insights">Niche Insights</a><a href="/fr/blog">Blog</a><a href="/fr/about">A propos</a><div class="mobile-menu-controls"><button class="theme-toggle" aria-label="Changer le theme"></button></div></nav>`;
}

function footer(prefix = '') {
  return `<footer id="footer"><div class="container">
  <div class="footer-top">
    <div class="footer-brand"><div class="footer-logo"><img src="/images/norlytics-logo.png" alt="Norlytics" class="site-logo-img" loading="lazy" decoding="async" /><div class="footer-logo-text">Norlytics</div></div><p class="footer-desc">Free YouTube channel analysis, revenue education, and public-data creator tools. Powered by Norcanto.</p></div>
    <div><div class="footer-col-title">Tools</div><div class="footer-links"><a href="${prefix}/#analyzer">Channel Analyzer</a><a href="${prefix}/creator-dashboard">Creator Dashboard</a><a href="${prefix}/niche-insights">Niche Insights</a></div></div>
    <div><div class="footer-col-title">Learn</div><div class="footer-links"><a href="${prefix}/blog/how-much-youtube-pays-per-view">Revenue Guide</a><a href="${prefix}/blog/youtube-monetization-requirements-2026">Monetization Requirements</a><a href="${prefix}/blog">Blog</a></div></div>
    <div><div class="footer-col-title">Legal</div><div class="footer-links"><a href="${prefix}/privacy">Privacy</a><a href="${prefix}/terms">Terms</a><a href="${prefix}/contact">Contact</a><a href="${prefix}/cookies">Cookies</a></div></div>
  </div>
  <div class="footer-bottom"><div class="footer-copy">© 2026 Norlytics.</div><div class="footer-legal"><a href="${prefix}/privacy">Privacy</a><a href="${prefix}/terms">Terms</a><a href="${prefix}/contact">Contact</a></div></div>
</div></footer><script src="${prefix ? '/js/app.js' : '../js/app.js'}" defer></script>`;
}

function faqSchema(faqs) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  })}</script>`;
}

function articlePage(article) {
  const canonical = `https://norcanto.com/blog/${article.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: today,
    inLanguage: 'en',
    mainEntityOfPage: canonical,
    author: { '@type': 'Person', name: 'Christian Hope' },
    publisher: { '@type': 'Organization', name: 'Norcanto', url: 'https://norcanto.com/', logo: 'https://norcanto.com/images/norlytics-logo.png' }
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
${cookieHead()}
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${article.title} | Norlytics</title>
  <meta name="description" content="${article.description}" />
  <meta property="og:title" content="${article.title} | Norlytics" />
  <meta property="og:description" content="${article.description}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="https://norcanto.com/images/og-image.png" />
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  ${faqSchema(article.faqs)}
  <link rel="stylesheet" href="../css/main.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" /></noscript>
  <style>${articleCss()}</style>
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="alternate" hreflang="fr" href="https://norcanto.com/fr/blog/${article.slug}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="fr_FR" />
${icons()}
</head>
<body>
${header('blog')}
<main style="padding-top:64px">
  <section style="padding:clamp(40px,7vw,60px) 0 clamp(28px,5vw,44px);background:var(--bg-2);border-bottom:1px solid var(--border)"><div class="container"><div class="article-body">
    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap"><span class="badge badge-red">${article.category}</span><span style="font-size:.75rem;color:var(--text-4)">Last updated ${displayDate} · ${article.readTime}</span></div>
    <h1 style="font-size:clamp(1.7rem,4vw,2.55rem);line-height:1.15;margin-bottom:14px">${article.title}</h1>
    <p style="font-size:clamp(.95rem,2vw,1.08rem);color:var(--text-3);line-height:1.7;margin:0">${article.description}</p>
  </div></div></section>
  <article class="section"><div class="container"><div class="article-body">
${article.body}
<h2>Frequently Asked Questions</h2>
${article.faqs.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join('\n')}
<h2>Sources and Methodology</h2>
<p>This guide combines public YouTube Data API signals, Norlytics tool methodology, manual review patterns used by creators and sponsors, and official YouTube or Google policy documentation where rules are involved.</p>
<ul>
  ${article.sources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`).join('\n  ')}
</ul>
<div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border)">
  <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);margin-bottom:16px">Related Norlytics resources</div>
  <div class="related-grid">
    ${article.related.map(([label, url, type]) => `<a href="${url}" class="card"><div class="blog-cat" style="margin-bottom:6px">${type}</div><div style="font-weight:700;color:var(--text);line-height:1.35">${label}</div></a>`).join('\n    ')}
  </div>
</div>
  </div></div>
  <aside class="article-trust-note">
    <p style="margin:0 0 8px"><strong style="color:var(--text)">Written by Christian Hope</strong>, founder of Norcanto and creator of Norlytics.</p>
    <p style="margin:0"><strong style="color:var(--text)">Methodology note:</strong> Norlytics uses public YouTube API statistics and clearly stated assumptions. Estimates vary by niche, country, audience, season, and advertiser demand. They are not official YouTube Studio analytics.</p>
  </aside>
  </article>
</main>
${footer('')}
</body>
</html>`;
}

function frenchPage(article) {
  const canonical = `https://norcanto.com/fr/blog/${article.slug}`;
  const en = `https://norcanto.com/blog/${article.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.frTitle,
    description: article.frDescription,
    datePublished: article.datePublished,
    dateModified: today,
    inLanguage: 'fr',
    mainEntityOfPage: canonical,
    author: { '@type': 'Person', name: 'Christian Hope' },
    publisher: { '@type': 'Organization', name: 'Norcanto', url: 'https://norcanto.com/', logo: 'https://norcanto.com/images/norlytics-logo.png' }
  };
  return `<!DOCTYPE html>
<html lang="fr">
<head>
${cookieHead()}
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${article.frTitle} | Norlytics</title>
  <meta name="description" content="${article.frDescription}" />
  <meta property="og:title" content="${article.frTitle} | Norlytics" />
  <meta property="og:description" content="${article.frDescription}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="https://norcanto.com/images/og-image.png" />
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  ${faqSchema(article.frFaqs)}
  <link rel="stylesheet" href="/css/main.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" /></noscript>
  <style>${articleCss()}</style>
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${en}" />
  <link rel="alternate" hreflang="fr" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${en}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:locale:alternate" content="en_US" />
${icons()}
</head>
<body>
${frenchHeader()}
<main style="padding-top:64px">
  <section style="padding:clamp(40px,7vw,60px) 0 clamp(28px,5vw,44px);background:var(--bg-2);border-bottom:1px solid var(--border)"><div class="container"><div class="article-body">
    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap"><span class="badge badge-red">${article.frCategory}</span><span style="font-size:.75rem;color:var(--text-4)">Derniere mise a jour : ${displayDate} · ${article.readTime}</span></div>
    <h1 style="font-size:clamp(1.7rem,4vw,2.55rem);line-height:1.15;margin-bottom:14px">${article.frTitle}</h1>
    <p style="font-size:clamp(.95rem,2vw,1.08rem);color:var(--text-3);line-height:1.7;margin:0">${article.frDescription}</p>
  </div></div></section>
  <article class="section"><div class="container"><div class="article-body">
${article.frBody}
<h2>Questions frequentes</h2>
${article.frFaqs.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join('\n')}
<h2>Sources et methode</h2>
<p>Ce guide utilise les signaux publics de YouTube, la methode Norlytics, des exemples de chaines publiques et la documentation officielle quand une regle de monetisation ou de qualite est citee.</p>
<ul>
  ${article.sources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`).join('\n  ')}
</ul>
<div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border)">
  <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);margin-bottom:16px">Ressources Norlytics liees</div>
  <div class="related-grid">
    ${article.frRelated.map(([label, url, type]) => `<a href="${url}" class="card"><div class="blog-cat" style="margin-bottom:6px">${type}</div><div style="font-weight:700;color:var(--text);line-height:1.35">${label}</div></a>`).join('\n    ')}
  </div>
</div>
  </div></div>
  <aside class="article-trust-note">
    <p style="margin:0 0 8px"><strong style="color:var(--text)">Redige par Christian Hope</strong>, fondateur de Norcanto et createur de Norlytics.</p>
    <p style="margin:0"><strong style="color:var(--text)">Note methodologique :</strong> Norlytics utilise les statistiques publiques de l'API YouTube et des hypotheses explicites. Les estimations varient selon la niche, le pays, l'audience, la saison et la demande publicitaire. Elles ne remplacent pas YouTube Studio.</p>
  </aside>
  </article>
</main>
${footer('/fr')}
</body>
</html>`;
}

const official = {
  ypp: ['YouTube Partner Program overview and eligibility', 'https://support.google.com/youtube/answer/72851?hl=en'],
  shorts: ['YouTube Shorts monetization policies', 'https://support.google.com/youtube/answer/12504220?hl=en'],
  adsense: ['AdSense eligibility requirements', 'https://support.google.com/adsense/answer/9724?hl=en'],
  api: ['YouTube Data API overview', 'https://developers.google.com/youtube/v3']
};

const articles = [
  {
    slug: 'ai-tools-for-youtube-creators',
    title: 'AI Tools for YouTube Creators: A Practical Workflow for 2026',
    frTitle: 'Outils IA pour createurs YouTube : workflow pratique en 2026',
    description: 'A practical guide to using AI for YouTube research, scripts, editing, thumbnails, analytics, and quality control without publishing generic content.',
    frDescription: 'Un guide pratique pour utiliser l IA dans la recherche, les scripts, le montage, les miniatures, l analyse et le controle qualite sans publier du contenu generique.',
    category: 'AI for Creators',
    frCategory: 'IA pour createurs',
    datePublished: '2026-03-18',
    readTime: '13 min read',
    body: `
<p>AI can help a YouTube creator move faster, but it can also make a channel look interchangeable. That is the quality problem Google and AdSense both care about: a page, video, or tool should add something original instead of repeating what already exists. The useful question is not "which AI tool is best?" It is "where can AI remove production friction while the creator still supplies judgment, experience, examples, and taste?"</p>
<p>This workflow treats AI as a production assistant. It helps collect questions, structure drafts, compare hooks, clean transcripts, and summarize public data. The creator still decides what is true, what is useful, what is visually shown, and what audience problem the video solves.</p>
<h2>Where AI Actually Helps</h2>
<p>The strongest AI use cases sit before and after recording. Before recording, AI can turn a vague topic into a research checklist, find missing beginner questions, generate outline options, and organize examples. After recording, AI can turn transcripts into chapters, social clips, descriptions, and follow-up ideas. The weakest use case is fully automated publishing: script, voice, footage, and thumbnail created without a clear human point of view.</p>
<table class="data-table"><thead><tr><th>Workflow stage</th><th>Good AI use</th><th>Human decision</th></tr></thead><tbody><tr><td>Research</td><td>Cluster viewer questions and competing titles</td><td>Pick the angle only you can explain well</td></tr><tr><td>Scripting</td><td>Draft structure, objections, examples, transitions</td><td>Rewrite with your experience and proof</td></tr><tr><td>Editing</td><td>Transcript cleanup, chapter suggestions, clip candidates</td><td>Choose pacing, story, emotion, and cuts</td></tr><tr><td>Thumbnail</td><td>Generate layout variations and contrast ideas</td><td>Select the promise that matches the video</td></tr><tr><td>Analytics</td><td>Summarize public patterns across uploads</td><td>Decide what to test next</td></tr></tbody></table>
<h2>A Research Workflow That Avoids Generic Videos</h2>
<p>Start with the audience problem, not the tool. If the video is about "best cameras for YouTube," collect real constraints: budget, room size, low light, autofocus, audio, and whether the creator films talking-head, product demos, or outdoor content. Then use AI to turn those constraints into research questions.</p>
<p>For example, a tech channel might compare public videos from Marques Brownlee, Think Media, and smaller camera-review channels. The lesson is not to copy their titles. The lesson is to see what each format explains well and what is still missing for a specific viewer, such as a beginner filming in a small apartment.</p>
<div class="placeholder"><strong>Screenshot placeholder:</strong> Add a screenshot of an AI research board with columns for viewer question, public example video, missing detail, and proposed Norlytics-related internal link.</div>
<h2>Scriptwriting: Use AI for Structure, Not Substance</h2>
<p>A strong YouTube script has a clear promise, fast context, specific examples, and a payoff. AI can propose outlines, but the first draft is usually too smooth. Smooth is not the same as useful. Add moments only a real creator would know: what failed, what surprised you, what the viewer should ignore, and where popular advice is incomplete.</p>
<p>A practical prompt is: "Create three outlines for this viewer problem. For each section, list what proof or example I need before I record." That forces the output to become a research plan instead of a generic essay.</p>
<h2>Thumbnail and Title Testing</h2>
<p>AI image tools can create rough thumbnail concepts, but they should not replace truthfulness. A good thumbnail makes the video's actual promise visible. Use AI to test contrast, facial expression, object placement, and readable wording, then build the final thumbnail with assets you have rights to use.</p>
<p>Before publishing, compare titles against the video promise. "I tested 7 AI editors for YouTube" is stronger than "Best AI editing tools" when the video includes a real test. "Which AI editor saved the most time?" is stronger if the video includes a measured workflow.</p>
<h2>Analytics and Public Channel Review</h2>
<p>AI is useful for summarizing patterns in a channel's public uploads, especially when paired with the <a href="/creator-dashboard">Creator Dashboard</a>. Review recent uploads, view distribution, title length, topic clusters, and repeatable formats. Then ask AI to summarize hypotheses, not conclusions. Public data cannot see retention, impressions, or actual revenue.</p>
<div class="example-box"><h3>Example: AI-assisted channel audit</h3><p>If a creator sees that tutorials with "beginner setup" titles outperform news reactions, AI can help list adjacent beginner topics. The creator should still validate demand with public search results and Niche Insights before changing the whole strategy.</p></div>
<h2>Quality Control Checklist</h2>
<ul><li>Does the video include original examples, testing, or lived experience?</li><li>Can viewers verify the advice from what is shown on screen?</li><li>Are claims sourced when they involve policies, prices, or revenue?</li><li>Does the script answer a specific viewer problem instead of a broad keyword?</li><li>Would the video still be useful if the AI-generated wording were removed?</li></ul>
<h2>Common Mistakes</h2>
<p>The biggest mistake is publishing AI summaries of public information without adding interpretation. The second is using AI to chase trends that do not fit the channel. The third is over-automating voice and visuals until viewers cannot tell who made the video or why they should trust it.</p>
<p>Creators who use AI well become more specific. They publish better examples, clearer comparisons, faster edits, and more useful follow-ups. Creators who use AI poorly become more generic.</p>
<div class="cta-inline"><h3>Audit the public signals before choosing a topic</h3><p>Use Creator Dashboard to review recent uploads, top videos, engagement, and repeatable patterns before building your next AI-assisted content batch.</p><a href="/creator-dashboard" class="btn btn-primary">Open Creator Dashboard</a></div>`,
    frBody: `
<p>L IA peut faire gagner du temps a un createur YouTube, mais elle peut aussi rendre une chaine interchangeable. Le bon objectif n est pas de publier plus de contenu generique. Le bon objectif est d utiliser l IA pour organiser la recherche, ameliorer les brouillons, comparer des accroches et verifier les idees pendant que le createur garde le jugement, les exemples et l experience.</p>
<h2>Ou l IA aide vraiment</h2><p>Les meilleurs usages se trouvent avant et apres le tournage : recherche, structure, chapitres, description, idees de clips, comparaison de titres et analyse des videos publiques. Le plus faible usage est l automatisation complete sans point de vue humain.</p>
<table class="data-table"><thead><tr><th>Etape</th><th>Usage utile</th><th>Decision humaine</th></tr></thead><tbody><tr><td>Recherche</td><td>Classer les questions des spectateurs</td><td>Choisir l angle que vous pouvez vraiment expliquer</td></tr><tr><td>Script</td><td>Proposer une structure</td><td>Ajouter experience, preuves et exemples</td></tr><tr><td>Montage</td><td>Suggerer chapitres et clips</td><td>Decider du rythme et de l histoire</td></tr><tr><td>Miniature</td><td>Tester des variantes visuelles</td><td>Garder une promesse exacte</td></tr></tbody></table>
<h2>Workflow de recherche</h2><p>Commencez par le probleme du public. Pour une video sur les cameras YouTube, notez budget, lumiere, autofocus, son, format de tournage et contraintes de piece. L IA peut transformer ces contraintes en questions de recherche, mais elle ne doit pas inventer l experience.</p><div class="placeholder"><strong>Emplacement capture :</strong> tableau de recherche avec question, exemple de video publique, detail manquant et lien interne Norlytics.</div>
<h2>Script et controle qualite</h2><p>Demandez a l IA trois plans possibles et, pour chaque partie, les preuves necessaires. Ensuite reecrivez avec vos tests, vos echecs, vos captures et vos choix. Une video utile doit contenir quelque chose que le spectateur ne trouve pas dans dix resumes identiques.</p>
<h2>Titres, miniatures et analyse</h2><p>Utilisez l IA pour comparer les promesses, pas pour exagerer. Une miniature doit representer ce que la video livre vraiment. Pour l analyse, combinez les hypotheses IA avec le <a href="/fr/creator-dashboard">Creator Dashboard</a> : videos recentes, vues medianes, sujets repetables et engagement public.</p>
<h2>Erreurs frequentes</h2><ul><li>Publier des resumes IA sans exemple original.</li><li>Copier des tendances qui ne correspondent pas a la chaine.</li><li>Inventer des donnees de revenus ou de performance.</li><li>Oublier de verifier les regles officielles quand le sujet touche la monetisation.</li></ul>
<p>Un bon usage de l IA rend le contenu plus precis. Un mauvais usage le rend plus vague. Pour meriter l indexation, la page ou la video doit montrer une methode, des exemples et des limites claires.</p>
<div class="cta-inline"><h3>Auditer les signaux publics</h3><p>Utilisez le Creator Dashboard pour examiner les videos recentes, les meilleurs formats et les hypotheses de contenu.</p><a href="/fr/creator-dashboard" class="btn btn-primary">Ouvrir le Creator Dashboard</a></div>`,
    faqs: [['Should YouTube creators use AI to write full scripts?', 'AI can draft structure, but full scripts should be rewritten with original examples, accurate claims, and the creator\'s own judgment.'], ['Can AI content be monetized on YouTube?', 'YouTube reviews channels against its monetization policies. Originality, value, and policy compliance matter more than whether a tool helped produce the content.'], ['What is the safest AI workflow for creators?', 'Use AI for research organization, outline options, transcript cleanup, and quality checks while keeping human testing, examples, and final editorial control.']],
    frFaqs: [['Faut-il laisser l IA ecrire tout le script ?', 'Non. Elle peut proposer une structure, mais le createur doit ajouter exemples, preuves et jugement editorial.'], ['Le contenu aide par IA peut-il etre monetise ?', 'Il doit respecter les politiques YouTube. L originalite et la valeur ajoutent plus que l outil utilise.'], ['Quel workflow est le plus sur ?', 'Utiliser l IA pour organiser la recherche, puis garder un controle humain sur les exemples, les tests et les affirmations.']],
    sources: [official.ypp, official.adsense, official.api],
    related: [['Creator Dashboard', '/creator-dashboard', 'Tool'], ['YouTube Channel Audit Checklist', '/blog/youtube-channel-audit-checklist', 'Guide'], ['Niche Validation Framework', '/blog/youtube-niche-validation-framework', 'Guide']],
    frRelated: [['Creator Dashboard', '/fr/creator-dashboard', 'Outil'], ['Audit de chaine YouTube', '/fr/blog/youtube-channel-audit-checklist', 'Guide'], ['Validation de niche', '/fr/blog/youtube-niche-validation-framework', 'Guide']]
  },
  {
    slug: 'grow-youtube-channel-fast',
    title: 'How to Grow a YouTube Channel Faster Without Chasing Hacks',
    frTitle: 'Developper une chaine YouTube plus vite sans astuces fragiles',
    description: 'A practical growth framework for improving topic selection, packaging, retention, publishing rhythm, and public-data analysis without relying on shallow growth hacks.',
    frDescription: 'Un cadre pratique pour ameliorer les sujets, le packaging, la retention, le rythme de publication et l analyse publique sans dependance aux astuces superficielles.',
    category: 'Channel Growth',
    frCategory: 'Croissance',
    datePublished: '2026-02-28',
    readTime: '14 min read',
    body: `
<p>Most "grow fast" advice fails because it treats YouTube like a trick system. A creator is told to post daily, copy trending titles, or optimize tags, but the channel still stalls because the core viewer promise is unclear. Sustainable growth comes from three compounding loops: better topics, better packaging, and better viewer satisfaction.</p>
<p>This guide uses public signals that any creator can inspect: upload frequency, recent median views, title patterns, thumbnail promises, comments, topic clusters, and whether new videos outperform the channel baseline. Private YouTube Studio metrics are better when you own the channel, but public data is still enough to make smarter decisions.</p>
<h2>Start With Baseline, Not Subscriber Count</h2>
<p>Subscriber count is a lagging indicator. A channel with 200,000 subscribers can have weak recent demand, while a channel with 12,000 subscribers can be growing quickly. Use the last 10 to 20 long-form uploads and calculate the median view count after excluding obvious outliers.</p>
<div class="example-box"><h3>Baseline example</h3><p>If a channel's recent median is 8,000 views and three videos in a new topic cluster reach 18,000, 24,000, and 21,000 views, that is a stronger signal than a single viral spike. If the next five videos fall back to 5,000, the format may not be repeatable.</p></div>
<h2>Improve Topic Selection</h2>
<p>A good topic combines demand, specificity, and creator fit. "Productivity tips" is too broad. "How I plan a week as a medical student" has a clearer audience and a stronger proof requirement. Channels like Ali Abdaal grew because the topics connected personal systems with repeatable viewer problems, not because every upload chased a random trend.</p>
<p>Use <a href="/niche-insights">Niche Insights</a> to compare recent videos around a topic. Look for videos from smaller channels that outperform their normal baseline. That suggests the topic has accessible demand instead of only rewarding entrenched authorities.</p>
<h2>Packaging: Titles and Thumbnails</h2>
<p>Packaging is the bridge between the topic and the click. A good title tells the viewer what problem will be solved and why this version is worth their time. A good thumbnail makes the contrast visible. Study public examples from channels such as Veritasium, Mark Rober, and Think Media: the title and thumbnail usually create one clear curiosity gap, not five competing ideas.</p>
<div class="placeholder"><strong>Screenshot placeholder:</strong> Add a side-by-side image of three title/thumbnail concepts with notes for promise, audience, and proof needed in the video.</div>
<h2>Retention Starts Before the Video</h2>
<p>Retention is not only editing speed. Viewers stay when the opening confirms that the promised video is the one they clicked. The first 30 seconds should identify the viewer problem, explain the payoff, and remove uncertainty. Avoid long brand intros unless the audience already expects them.</p>
<table class="data-table"><thead><tr><th>Growth lever</th><th>Weak version</th><th>Stronger version</th></tr></thead><tbody><tr><td>Topic</td><td>Broad category</td><td>Specific viewer problem</td></tr><tr><td>Title</td><td>Keyword list</td><td>Clear promise or tension</td></tr><tr><td>Opening</td><td>Channel intro</td><td>Immediate proof of relevance</td></tr><tr><td>Series</td><td>Random uploads</td><td>Repeatable topic cluster</td></tr><tr><td>Analysis</td><td>Views only</td><td>Median views, outliers, comments, format fit</td></tr></tbody></table>
<h2>Create Topic Clusters</h2>
<p>Google Search and YouTube both reward clarity. A channel with a recognizable cluster becomes easier for viewers to understand and easier for algorithms to test. Build clusters around problems: beginner setup, mistakes, comparisons, templates, case studies, and advanced follow-ups. On Norlytics, the same cluster approach connects the <a href="/creator-dashboard">Creator Dashboard</a>, <a href="/blog/youtube-channel-audit-checklist">channel audit checklist</a>, and <a href="/blog/compare-youtube-channels">channel comparison guide</a>.</p>
<h2>Publishing Rhythm</h2>
<p>Consistency matters because it creates more learning cycles. It does not mean every creator should publish daily. A finance explainer with research and charts may need one strong video per week. A commentary channel may test faster. Pick a rhythm that lets you maintain quality, then review performance every four to six uploads.</p>
<h2>Common Mistakes</h2>
<ul><li>Copying a viral format without understanding why it worked.</li><li>Judging a new direction from one upload instead of a small test set.</li><li>Optimizing tags while the topic and opening are weak.</li><li>Ignoring comments that reveal confusion, objections, or follow-up demand.</li><li>Changing everything at once so you cannot learn what helped.</li></ul>
<div class="cta-inline"><h3>Measure public growth signals</h3><p>Use Creator Dashboard to compare recent median views, upload rhythm, top videos, and repeatable formats before planning your next content test.</p><a href="/creator-dashboard" class="btn btn-primary">Analyze a Channel</a></div>`,
    frBody: `
<p>La croissance rapide ne vient pas d une astuce unique. Elle vient de trois boucles qui se renforcent : meilleurs sujets, meilleur packaging et meilleure satisfaction du spectateur. Les tags et la frequence aident peu si la promesse de la video reste floue.</p>
<h2>Commencer par la base recente</h2><p>Regardez les 10 a 20 dernieres videos et calculez les vues medianes. Un petit canal peut etre en forte acceleration, tandis qu une grande chaine peut avoir une demande recente faible. Comparez toujours une nouvelle idee a la base de la chaine.</p>
<h2>Choisir de meilleurs sujets</h2><p>Un bon sujet combine demande, precision et compatibilite avec le createur. "Productivite" est trop large. "Organiser une semaine d etudiant en medecine" donne un public, une preuve et un contexte. Utilisez <a href="/fr/niche-insights">Niche Insights</a> pour voir si des petites chaines performent deja sur le sujet.</p>
<h2>Packaging et retention</h2><p>Le titre et la miniature doivent faire une seule promesse claire. L ouverture doit confirmer cette promesse dans les premieres secondes. La retention commence avant le montage : le spectateur reste quand il comprend pourquoi la video vaut son temps.</p>
<table class="data-table"><thead><tr><th>Levier</th><th>Faible</th><th>Fort</th></tr></thead><tbody><tr><td>Sujet</td><td>Categorie large</td><td>Probleme precis</td></tr><tr><td>Titre</td><td>Liste de mots cles</td><td>Promesse claire</td></tr><tr><td>Ouverture</td><td>Intro longue</td><td>Preuve immediate</td></tr><tr><td>Analyse</td><td>Vues totales</td><td>Vues medianes, commentaires, formats</td></tr></tbody></table>
<h2>Construire des clusters</h2><p>Regroupez les videos autour de problemes : erreurs, comparaisons, tutoriels debutants, cas pratiques et suites avancees. Cette logique renforce aussi l autorite du site avec le <a href="/fr/creator-dashboard">Creator Dashboard</a>, la checklist d audit et les guides de revenus.</p>
<h2>Erreurs frequentes</h2><ul><li>Copier un format viral sans comprendre le mecanisme.</li><li>Changer de strategie apres une seule video.</li><li>Optimiser les tags alors que la promesse est faible.</li><li>Ignorer les questions dans les commentaires.</li></ul>
<div class="cta-inline"><h3>Mesurer les signaux publics</h3><p>Analysez les vues medianes, les videos fortes et le rythme de publication avant le prochain test.</p><a href="/fr/creator-dashboard" class="btn btn-primary">Analyser une chaine</a></div>`,
    faqs: [['How many videos should I publish before judging a growth experiment?', 'Use at least three to five related uploads when possible. One video can be distorted by timing, packaging, or a random recommendation test.'], ['Is posting daily the fastest way to grow?', 'Only if quality remains high and the format supports fast publishing. Many channels grow faster with fewer, stronger videos.'], ['What public metric matters most?', 'Recent median views relative to channel size is more useful than subscriber count alone.']],
    frFaqs: [['Combien de videos tester ?', 'Trois a cinq videos liees donnent un signal plus fiable qu une seule publication.'], ['Publier tous les jours est-il necessaire ?', 'Seulement si la qualite reste forte. Beaucoup de chaines progressent mieux avec moins de videos mais de meilleures idees.'], ['Quel signal public regarder ?', 'Les vues medianes recentes par rapport a la taille de la chaine sont plus utiles que les abonnes seuls.']],
    sources: [official.api, official.adsense],
    related: [['Creator Dashboard', '/creator-dashboard', 'Tool'], ['Compare YouTube Channels', '/blog/compare-youtube-channels', 'Guide'], ['Niche Insights', '/niche-insights', 'Tool']],
    frRelated: [['Creator Dashboard', '/fr/creator-dashboard', 'Outil'], ['Comparer des chaines', '/fr/blog/compare-youtube-channels', 'Guide'], ['Niche Insights', '/fr/niche-insights', 'Outil']]
  },
  {
    slug: 'youtube-cpm-countries',
    title: 'YouTube CPM by Country: How Geography Changes Creator Revenue',
    frTitle: 'CPM YouTube par pays : pourquoi la geographie change les revenus',
    description: 'Understand why YouTube ad rates vary by country, how audience geography affects RPM, and how creators should use country data without overclaiming.',
    frDescription: 'Comprendre pourquoi les tarifs publicitaires YouTube varient selon les pays, comment la geographie affecte le RPM et comment utiliser ces donnees avec prudence.',
    category: 'YouTube Revenue',
    frCategory: 'Revenus YouTube',
    datePublished: '2026-04-08',
    readTime: '12 min read',
    body: `
<p>Country is one of the biggest reasons two channels with the same view count can earn very different revenue. Advertisers pay more in markets where customer value, competition, and purchasing power are higher. That affects CPM, playback-based CPM, and ultimately creator RPM.</p>
<p>Public tools cannot know a channel's private audience geography with certainty. YouTube Studio shows creators their real country breakdown. Norlytics uses public signals to estimate likely geography and always treats the result as an assumption, not a private analytic.</p>
<h2>CPM vs RPM by Country</h2>
<p>CPM describes what advertisers pay for ad impressions. RPM describes the creator's revenue per 1,000 total views after YouTube's revenue share, unmonetized views, country mix, format mix, and other factors. A high-CPM country can still produce modest RPM if many views are not monetized or if the format is Shorts-heavy.</p>
<table class="data-table"><thead><tr><th>Country signal</th><th>Why it matters</th><th>Creator interpretation</th></tr></thead><tbody><tr><td>United States, Canada, UK, Australia</td><td>Generally strong advertiser competition</td><td>Often higher RPM potential, especially in finance, business, software, and education</td></tr><tr><td>Western Europe</td><td>Strong but varied by language and niche</td><td>Good sponsorship fit may matter as much as ads</td></tr><tr><td>Large emerging markets</td><td>Huge audience scale, lower average ad rates</td><td>Volume, products, local sponsors, and community can offset lower RPM</td></tr><tr><td>Mixed global audience</td><td>Revenue depends on weighted average</td><td>A small share of high-value countries can lift overall RPM</td></tr></tbody></table>
<h2>How to Estimate Audience Country Publicly</h2>
<p>Use language, upload time, references, comments, currency, sponsor geography, and search intent. A channel using US tax examples, posting for North American evenings, and receiving comments from US viewers likely has a different country mix from a channel using Hindi titles and India-specific examples.</p>
<p>The <a href="/blog/youtube-channel-country-analyzer">channel country analyzer guide</a> explains the limitation in more depth. The key rule is to avoid pretending public signals equal YouTube Studio data.</p>
<h2>Real Example Patterns</h2>
<p>A personal finance channel that explains US retirement accounts is likely more valuable to US advertisers than a general entertainment channel with the same views. A software tutorial channel teaching Notion, Excel, or AI tools to English-speaking professionals may attract global viewers but still monetize strongly because the viewer intent is commercial. A music or meme channel may generate huge view volume while earning lower ad revenue per view.</p>
<div class="placeholder"><strong>Chart placeholder:</strong> Add a bar chart showing hypothetical RPM ranges by audience mix: mostly US/UK, mixed English-speaking, global entertainment, and Shorts-heavy global channel.</div>
<h2>How Creators Should Use Country Data</h2>
<p>Do not chase a country by faking identity or forcing unnatural language choices. Instead, clarify who the video is for. If you want a US audience, use examples, units, prices, and problems that match that viewer. If your strongest audience is local, build products, sponsors, and community offers that fit that market.</p>
<h2>Common Mistakes</h2>
<ul><li>Assuming CPM equals creator earnings.</li><li>Applying one country's RPM to a global channel.</li><li>Ignoring Shorts and unmonetized views.</li><li>Using country estimates as if they were private YouTube Studio analytics.</li><li>Choosing a niche only because a country pays more.</li></ul>
<h2>Revenue Estimate Method</h2>
<p>Norlytics estimates revenue by combining niche assumptions, likely geography, content format, channel scale, and view patterns. The output is a range because actual monetized views, ad fill, seasonality, and viewer demographics are private. For serious planning, use the range as a scenario model, not a promise.</p>
<div class="cta-inline"><h3>Estimate revenue with visible assumptions</h3><p>Use Norlytics to review public channel signals, estimated geography, and revenue ranges with methodology notes.</p><a href="/#analyzer" class="btn btn-primary">Use Channel Analyzer</a></div>`,
    frBody: `
<p>Le pays de l audience explique pourquoi deux chaines avec le meme nombre de vues peuvent gagner des montants tres differents. Les annonceurs paient plus dans certains marches selon la valeur client, la concurrence et le pouvoir d achat. Cela influence le CPM et le RPM createur.</p>
<h2>CPM et RPM</h2><p>Le CPM decrit le cout publicitaire pour 1 000 impressions. Le RPM decrit le revenu createur pour 1 000 vues totales apres partage de revenus, vues non monetisees, formats et pays. Un pays a CPM eleve ne garantit donc pas un RPM eleve.</p>
<table class="data-table"><thead><tr><th>Signal pays</th><th>Impact</th><th>Interpretation</th></tr></thead><tbody><tr><td>US, Canada, UK, Australie</td><td>Forte concurrence publicitaire</td><td>Potentiel RPM plus eleve dans finance, logiciel, education</td></tr><tr><td>Europe de l Ouest</td><td>Bon potentiel variable</td><td>Les sponsors peuvent compter autant que les pubs</td></tr><tr><td>Marches emergents</td><td>Grande audience, tarifs moyens plus bas</td><td>Volume et produits locaux peuvent compenser</td></tr></tbody></table>
<h2>Estimer publiquement la geographie</h2><p>Langue, horaires, commentaires, devises, exemples et sponsors donnent des indices. Mais seul YouTube Studio montre la vraie repartition. Norlytics presente donc une estimation, jamais une certitude.</p>
<div class="placeholder"><strong>Emplacement graphique :</strong> comparer des scenarios RPM par audience majoritairement US/UK, audience globale et chaine Shorts.</div>
<h2>Utilisation pratique</h2><p>Ne forcez pas un pays qui ne correspond pas a votre contenu. Rendez plutot vos exemples, prix, problemes et references coherents avec le public vise. Si votre public local est fort, cherchez des sponsors et produits adaptes a ce marche.</p>
<h2>Erreurs frequentes</h2><ul><li>Confondre CPM et revenu createur.</li><li>Appliquer un RPM americain a une audience mondiale.</li><li>Ignorer les Shorts.</li><li>Presenter une estimation publique comme donnee privee.</li></ul>
<div class="cta-inline"><h3>Estimer avec hypotheses visibles</h3><p>Analysez les signaux publics et les scenarios de revenus avec Norlytics.</p><a href="/fr#analyzer" class="btn btn-primary">Utiliser l analyseur</a></div>`,
    faqs: [['Which country has the highest YouTube CPM?', 'There is no single permanent leader. High advertiser markets such as the United States, Canada, the UK, and Australia often perform strongly, but niche and audience intent matter.'], ['Can I see another channel\'s real country breakdown?', 'No. A channel\'s real audience geography is private YouTube Studio data. Public tools can only estimate from external signals.'], ['Should I target only high-CPM countries?', 'Only if you can serve those viewers authentically. Audience fit and trust matter more than forcing a high-CPM geography.']],
    frFaqs: [['Quel pays a le meilleur CPM ?', 'Il n existe pas de leader permanent. Les Etats-Unis, le Canada, le Royaume-Uni et l Australie sont souvent forts, mais la niche compte beaucoup.'], ['Peut-on voir les vrais pays d une autre chaine ?', 'Non. C est une donnee privee de YouTube Studio.'], ['Faut-il viser seulement les pays a CPM eleve ?', 'Seulement si vous pouvez servir ce public de facon authentique.']],
    sources: [official.api, official.adsense],
    related: [['Channel Country Analyzer', '/blog/youtube-channel-country-analyzer', 'Guide'], ['RPM vs CPM', '/blog/youtube-rpm-vs-cpm', 'Guide'], ['How Much YouTube Pays Per View', '/blog/how-much-youtube-pays-per-view', 'Guide']],
    frRelated: [['Analyse pays de chaine', '/fr/blog/youtube-channel-country-analyzer', 'Guide'], ['RPM vs CPM', '/fr/blog/youtube-rpm-vs-cpm', 'Guide'], ['Paiement par vue', '/fr/blog/how-much-youtube-pays-per-view', 'Guide']]
  },
  {
    slug: 'youtube-rpm-by-niche',
    title: 'YouTube RPM by Niche: How to Estimate Revenue Without Misleading Benchmarks',
    frTitle: 'RPM YouTube par niche : estimer les revenus sans benchmarks trompeurs',
    description: 'Learn why RPM varies by niche, what makes some YouTube topics more valuable, and how to use RPM ranges responsibly when choosing a content strategy.',
    frDescription: 'Comprendre pourquoi le RPM varie par niche, ce qui rend certains sujets plus rentables et comment utiliser les fourchettes de RPM prudemment.',
    category: 'YouTube Revenue',
    frCategory: 'Revenus YouTube',
    datePublished: '2026-04-12',
    readTime: '12 min read',
    body: `
<p>RPM by niche is useful, but it is also easy to misuse. A finance channel may earn more per 1,000 views than a gaming channel because advertisers can sell higher-value products. But a gaming channel with loyal fans, sponsorships, and strong volume can still build a better business than a generic finance channel with weak trust.</p>
<p>The best use of RPM ranges is scenario planning. They help estimate whether a niche has commercial intent, not whether a channel will succeed.</p>
<h2>What Makes a Niche High RPM?</h2>
<p>Advertisers pay more when viewers are close to valuable decisions: buying software, choosing insurance, investing, starting a business, selecting a school, or solving an expensive problem. That is why finance, business software, legal education, real estate, and B2B topics often command stronger ad demand.</p>
<p>Entertainment, memes, broad lifestyle, and some gaming formats often rely more on scale, sponsorships, merch, or community monetization. They are not "bad" niches. They simply use a different business model.</p>
<table class="data-table"><thead><tr><th>Niche type</th><th>Why advertisers care</th><th>Creator risk</th></tr></thead><tbody><tr><td>Finance and investing</td><td>High customer value</td><td>Needs accuracy, trust, compliance awareness</td></tr><tr><td>Software tutorials</td><td>Clear buyer intent</td><td>Tools change quickly; updates matter</td></tr><tr><td>Education and careers</td><td>Course, school, and career spend</td><td>Needs credible expertise</td></tr><tr><td>Gaming</td><td>Large passionate audience</td><td>Lower ad rates; high competition</td></tr><tr><td>Entertainment</td><td>Broad reach</td><td>Revenue depends heavily on volume and brand fit</td></tr></tbody></table>
<h2>Real YouTube Example Patterns</h2>
<p>A channel like The Plain Bagel teaches finance concepts with trust and specificity, which attracts a different advertiser environment from a broad reaction channel. A software educator explaining Excel or AI workflows can monetize through ads, affiliate tools, templates, and consulting. A science channel like Kurzgesagt or Veritasium may not fit a simple RPM table because production quality, sponsorship demand, and brand safety also matter.</p>
<h2>Why Public RPM Tables Are Dangerous</h2>
<p>Many RPM lists imply exact numbers. That is misleading. Actual RPM depends on country mix, video length, ad suitability, viewer age, seasonality, monetized playback rate, Shorts share, and YouTube Premium. A public article can teach ranges and drivers, but it should not promise a specific channel's private earnings.</p>
<div class="placeholder"><strong>Chart placeholder:</strong> Add a range chart with low/typical/high RPM scenarios by niche, clearly labeled as illustrative and not YouTube Studio data.</div>
<h2>How to Choose a Niche Responsibly</h2>
<p>Score each niche across demand, access, repeatability, monetization fit, and creator fit. A high-RPM niche with no creator credibility is fragile. A lower-RPM niche with deep expertise and loyal viewers may monetize better through sponsors and products.</p>
<p>The <a href="/blog/youtube-niche-validation-framework">niche validation framework</a> provides a full scoring model. Use <a href="/niche-insights">Niche Insights</a> to test whether public demand exists before committing.</p>
<h2>Method for RPM Estimates</h2>
<p>Norlytics starts with a niche assumption, then adjusts for likely country, content format, channel scale, and public view patterns. Because private analytics are unavailable, the tool returns a range and explains the limits. That is more honest than a single "this channel earns exactly X" claim.</p>
<h2>Common Mistakes</h2>
<ul><li>Choosing a niche only because a table says it has high RPM.</li><li>Ignoring whether you can publish 50 useful videos in that niche.</li><li>Using US finance RPM for a global entertainment audience.</li><li>Forgetting that sponsorships and products can exceed AdSense.</li><li>Publishing thin affiliate content without expertise or testing.</li></ul>
<div class="cta-inline"><h3>Validate RPM and demand together</h3><p>Use Niche Insights for demand and Creator Dashboard for public channel benchmarks before choosing a revenue strategy.</p><a href="/niche-insights" class="btn btn-primary">Open Niche Insights</a></div>`,
    frBody: `
<p>Le RPM par niche est utile, mais souvent mal utilise. Une chaine finance peut gagner plus par 1 000 vues qu une chaine gaming, mais une chaine gaming avec fans fideles, sponsors et produits peut devenir une meilleure activite. Le RPM sert a faire des scenarios, pas a predire le succes.</p>
<h2>Pourquoi certaines niches paient plus</h2><p>Les annonceurs paient davantage quand le spectateur est proche d une decision de valeur : logiciel, assurance, investissement, formation, immobilier ou probleme professionnel. Finance, SaaS, education et B2B ont donc souvent un meilleur potentiel.</p>
<table class="data-table"><thead><tr><th>Niche</th><th>Interet annonceur</th><th>Risque createur</th></tr></thead><tbody><tr><td>Finance</td><td>Valeur client elevee</td><td>Besoin de confiance</td></tr><tr><td>Logiciels</td><td>Intention d achat claire</td><td>Outils qui changent vite</td></tr><tr><td>Gaming</td><td>Audience passionnee</td><td>Concurrence elevee</td></tr><tr><td>Divertissement</td><td>Grande portee</td><td>Depend du volume</td></tr></tbody></table>
<h2>Pourquoi les tableaux exacts trompent</h2><p>Le vrai RPM depend du pays, du format, de la saison, du taux de vues monetisees, de la duree et de YouTube Premium. Un guide utile doit expliquer les facteurs et les fourchettes, pas promettre un revenu exact.</p>
<div class="placeholder"><strong>Emplacement graphique :</strong> fourchettes RPM illustratives par niche avec note "estimation, pas donnee Studio".</div>
<h2>Choisir une niche</h2><p>Notez demande, acces, repetition, monetisation et compatibilite createur. Une niche chere sans credibilite est fragile. Une niche plus basse en RPM peut gagner plus avec sponsors, produits ou communaute.</p>
<h2>Methode Norlytics</h2><p>Norlytics combine hypothese de niche, pays probable, format, taille et vues publiques. Le resultat est une fourchette avec limites, pas une certitude.</p>
<div class="cta-inline"><h3>Valider revenu et demande</h3><p>Utilisez Niche Insights avant de vous engager dans une niche.</p><a href="/fr/niche-insights" class="btn btn-primary">Ouvrir Niche Insights</a></div>`,
    faqs: [['What is a good YouTube RPM?', 'A good RPM depends on niche, country, video format, and monetized views. Compare against similar channels and your own history rather than a universal number.'], ['Are finance channels always best?', 'No. Finance can monetize well, but it requires trust, accuracy, and audience fit. A creator without credibility may struggle.'], ['Can Norlytics know real RPM?', 'No public tool can know private YouTube Studio RPM. Norlytics estimates ranges from public signals and assumptions.']],
    frFaqs: [['Qu est-ce qu un bon RPM ?', 'Cela depend de la niche, du pays, du format et des vues monetisees. Comparez avec des chaines similaires.'], ['La finance est-elle toujours meilleure ?', 'Non. Elle demande confiance, precision et credibilite.'], ['Norlytics connait-il le vrai RPM ?', 'Non. Un outil public peut seulement estimer une fourchette.']],
    sources: [official.api, official.adsense],
    related: [['RPM vs CPM', '/blog/youtube-rpm-vs-cpm', 'Guide'], ['Niche Validation Framework', '/blog/youtube-niche-validation-framework', 'Guide'], ['Niche Insights', '/niche-insights', 'Tool']],
    frRelated: [['RPM vs CPM', '/fr/blog/youtube-rpm-vs-cpm', 'Guide'], ['Validation de niche', '/fr/blog/youtube-niche-validation-framework', 'Guide'], ['Niche Insights', '/fr/niche-insights', 'Outil']]
  },
  {
    slug: 'youtube-shorts-monetization',
    title: 'YouTube Shorts Monetization: How Shorts Revenue Actually Works',
    frTitle: 'Monetisation YouTube Shorts : fonctionnement reel des revenus Shorts',
    description: 'A creator-friendly explanation of Shorts revenue sharing, YPP requirements, eligible views, RPM expectations, and how to combine Shorts with long-form strategy.',
    frDescription: 'Explication claire du partage de revenus Shorts, des conditions YPP, des vues eligibles, du RPM et de la strategie hybride avec les videos longues.',
    category: 'YouTube Shorts',
    frCategory: 'YouTube Shorts',
    datePublished: '2026-02-05',
    readTime: '13 min read',
    body: `
<p>YouTube Shorts can create reach quickly, but Shorts monetization works differently from long-form Watch Page ads. A creator should not estimate Shorts revenue by applying long-form RPM to short videos. Shorts use a pooled revenue model, eligible engaged views, music licensing adjustments, and a different revenue share.</p>
<p>According to YouTube's Shorts monetization policies, monetizing creators who accept the Shorts Monetization Module can earn from ads viewed between videos in the Shorts Feed. YouTube allocates revenue through a Creator Pool and monetizing creators keep 45% of their allocated revenue share. This is different from traditional long-form ad monetization.</p>
<h2>Eligibility and Requirements</h2>
<p>For full YPP ad revenue sharing, channels generally need 1,000 subscribers plus either 4,000 valid public watch hours in the last 12 months or 10 million valid public Shorts views in the last 90 days. YouTube also reviews the channel for policy compliance, so hitting numbers does not guarantee approval.</p>
<h2>Why Shorts RPM Is Usually Lower</h2>
<p>Shorts ads are shown between videos, not inside every individual Short. Many views are rapid, global, and less commercially targeted than long-form search-driven videos. That is why creators often treat Shorts as top-of-funnel reach rather than the entire revenue model.</p>
<table class="data-table"><thead><tr><th>Format</th><th>Revenue model</th><th>Best use</th></tr></thead><tbody><tr><td>Shorts</td><td>Shorts Feed ad pool and eligible engaged views</td><td>Discovery, testing ideas, audience growth</td></tr><tr><td>Long-form</td><td>Watch Page ads and YouTube Premium</td><td>Depth, search demand, higher RPM topics</td></tr><tr><td>Live streams</td><td>Ads, Supers, memberships when eligible</td><td>Community and real-time engagement</td></tr><tr><td>Community/products</td><td>Memberships, affiliates, sponsors</td><td>Monetizing trust beyond ads</td></tr></tbody></table>
<h2>Hybrid Strategy</h2>
<p>The strongest creator strategy often uses Shorts to test hooks and identify demand, then turns winning ideas into deeper long-form videos. For example, a cooking creator might post Shorts testing three quick meal ideas. The one with the strongest saves, comments, and repeat questions can become a full tutorial, shopping list, and meal plan video.</p>
<p>Educational channels can do the same. A science creator might use Shorts to test a surprising fact, then publish a full explainer once the audience shows curiosity. A software creator can post a 30-second workflow, then link to a full tutorial or template.</p>
<div class="placeholder"><strong>Screenshot placeholder:</strong> Show a Shorts-to-long-form planning board with columns for Short hook, viewer question, full video angle, and related monetization path.</div>
<h2>What Counts as a Good Shorts Signal?</h2>
<p>Do not only look at views. Comments that ask for a tutorial, saves, shares, follower conversion, and repeatable formats matter more. A Short with fewer views but strong buyer intent can be more valuable than a viral joke that does not fit the channel.</p>
<h2>Common Mistakes</h2>
<ul><li>Estimating Shorts earnings with long-form RPM.</li><li>Posting unrelated Shorts that confuse the channel's audience.</li><li>Ignoring YouTube's rules on non-original and reused content.</li><li>Failing to convert Shorts viewers into deeper videos, email, products, or community.</li><li>Judging the channel only by viral outliers.</li></ul>
<h2>Public Analysis Workflow</h2>
<p>Use the <a href="/creator-dashboard">Creator Dashboard</a> to compare recent uploads, then manually separate Shorts from long-form videos. Review whether Shorts are bringing viewers toward the channel's main topics or creating random reach. If the channel has strong Shorts but weak long-form demand, the revenue strategy may need sponsors, products, or a clearer funnel.</p>
<div class="cta-inline"><h3>Compare Shorts and long-form public signals</h3><p>Use Creator Dashboard to review upload mix, recent views, top videos, and repeatable public patterns.</p><a href="/creator-dashboard" class="btn btn-primary">Open Creator Dashboard</a></div>`,
    frBody: `
<p>Les Shorts peuvent donner de la portee rapidement, mais leur monetisation ne fonctionne pas comme les videos longues. Il ne faut pas appliquer le RPM long-form aux Shorts. Le modele repose sur un pool publicitaire, des vues engagees eligibles, des ajustements musicaux et un partage different.</p>
<h2>Conditions et fonctionnement</h2><p>Pour le partage de revenus complet, une chaine doit generalement atteindre 1 000 abonnes et soit 4 000 heures publiques valides sur 12 mois, soit 10 millions de vues Shorts publiques valides sur 90 jours. YouTube examine aussi la conformite de la chaine.</p>
<h2>Pourquoi le RPM Shorts est souvent plus bas</h2><p>Les annonces Shorts apparaissent entre les videos du flux. Les vues sont rapides, souvent mondiales et moins ciblees commercialement. Les Shorts servent donc souvent a la decouverte plutot qu au revenu principal.</p>
<table class="data-table"><thead><tr><th>Format</th><th>Modele</th><th>Usage</th></tr></thead><tbody><tr><td>Shorts</td><td>Pool publicitaire Shorts</td><td>Decouverte, test d idees</td></tr><tr><td>Long-form</td><td>Publicites Watch Page</td><td>Profondeur, recherche, RPM plus fort</td></tr><tr><td>Produits</td><td>Affiliation, sponsors, memberships</td><td>Monetiser la confiance</td></tr></tbody></table>
<h2>Strategie hybride</h2><p>Utilisez les Shorts pour tester des accroches, puis transformez les idees fortes en videos longues. Une chaine cuisine peut tester trois recettes courtes et developper celle qui genere le plus de questions. Une chaine logiciel peut montrer une astuce rapide puis publier un tutoriel complet.</p>
<div class="placeholder"><strong>Emplacement capture :</strong> tableau Shorts vers long-form avec accroche, question du public, angle video longue et monetisation.</div>
<h2>Erreurs frequentes</h2><ul><li>Estimer les revenus Shorts avec le RPM des videos longues.</li><li>Publier des Shorts hors sujet.</li><li>Ignorer les regles sur contenu reutilise ou non original.</li><li>Ne pas convertir l attention en videos plus profondes.</li></ul>
<div class="cta-inline"><h3>Comparer Shorts et videos longues</h3><p>Utilisez le Creator Dashboard pour analyser le mix de formats et les tendances publiques.</p><a href="/fr/creator-dashboard" class="btn btn-primary">Ouvrir le Creator Dashboard</a></div>`,
    faqs: [['Do Shorts views count toward 4,000 public watch hours?', 'YouTube says public watch hours from Shorts views in the Shorts Feed do not count toward the 4,000 public watch hours threshold.'], ['Can Shorts qualify a channel for YPP?', 'Yes, one path is 1,000 subscribers plus 10 million valid public Shorts views in the last 90 days, subject to policy review.'], ['Should creators make Shorts or long-form videos?', 'Often both. Shorts can test demand and build reach, while long-form videos usually provide depth, search value, and stronger monetization opportunities.']],
    frFaqs: [['Les vues Shorts comptent-elles pour les 4 000 heures ?', 'Les heures provenant du flux Shorts ne comptent pas pour ce seuil selon YouTube.'], ['Les Shorts peuvent-ils qualifier une chaine ?', 'Oui, avec 1 000 abonnes et 10 millions de vues Shorts publiques valides sur 90 jours, sous reserve de revue.'], ['Faut-il faire Shorts ou videos longues ?', 'Souvent les deux : Shorts pour tester et long-form pour approfondir.']],
    sources: [official.shorts, official.ypp, official.api],
    related: [['YouTube Monetization Requirements', '/blog/youtube-monetization-requirements-2026', 'Guide'], ['How Much YouTube Pays Per View', '/blog/how-much-youtube-pays-per-view', 'Guide'], ['Creator Dashboard', '/creator-dashboard', 'Tool']],
    frRelated: [['Conditions monetisation', '/fr/blog/youtube-monetization-requirements-2026', 'Guide'], ['Paiement par vue', '/fr/blog/how-much-youtube-pays-per-view', 'Guide'], ['Creator Dashboard', '/fr/creator-dashboard', 'Outil']]
  },
  {
    slug: 'youtube-sponsorship-guide',
    title: 'YouTube Sponsorship Guide: How to Evaluate, Price, and Protect Brand Deals',
    frTitle: 'Guide sponsoring YouTube : evaluer, fixer le prix et proteger les partenariats',
    description: 'A practical guide to YouTube sponsorship pricing, audience fit, public channel analysis, deliverables, red flags, and creator-safe negotiation.',
    frDescription: 'Guide pratique du sponsoring YouTube : prix, compatibilite audience, analyse publique, livrables, signaux faibles et negociation.',
    category: 'Video Marketing',
    frCategory: 'Marketing video',
    datePublished: '2026-05-24',
    readTime: '14 min read',
    body: `
<p>Sponsorships can earn more than AdSense, but they also carry more responsibility. A good sponsorship fits the audience, is clearly disclosed, and gives the brand measurable value without damaging creator trust. A weak sponsorship can underpay the creator, disappoint the sponsor, and confuse viewers.</p>
<p>This guide focuses on public-data evaluation because brands and agencies often review channels before they have access to private analytics. Creators should still use YouTube Studio when negotiating, but public signals help both sides start from a more informed baseline.</p>
<h2>What Brands Actually Buy</h2>
<p>Brands are not only buying views. They are buying trusted attention from a specific audience. A channel with 30,000 views from software founders may be more valuable to a SaaS sponsor than a channel with 300,000 broad entertainment views. Audience intent, trust, niche fit, and integration quality matter.</p>
<table class="data-table"><thead><tr><th>Signal</th><th>Why it matters</th><th>How to check publicly</th></tr></thead><tbody><tr><td>Recent median views</td><td>Predictable delivery</td><td>Review last 10 to 20 uploads</td></tr><tr><td>Audience fit</td><td>Conversion potential</td><td>Topic, comments, language, examples</td></tr><tr><td>Engagement quality</td><td>Trust and attention</td><td>Specific comments, questions, repeat viewers</td></tr><tr><td>Brand safety</td><td>Reputation risk</td><td>Content tone, controversy, policy fit</td></tr><tr><td>Integration style</td><td>Viewer acceptance</td><td>Past sponsor reads and comment response</td></tr></tbody></table>
<h2>Pricing Sponsorships</h2>
<p>There is no universal rate. Pricing depends on average views, niche, deliverable type, exclusivity, usage rights, production effort, and whether the sponsorship includes Shorts, community posts, pinned comments, email, or cross-platform assets. A 60-second integrated mention in a high-trust tutorial can be worth more than a brief pre-roll in a broad video.</p>
<p>Creators should build a floor price from time, production cost, and opportunity cost. Then adjust upward for audience value and sponsor requirements. Brands should compare channels by recent median views and audience fit, not total subscribers.</p>
<h2>Real Example Patterns</h2>
<p>Software sponsors often fit channels that teach workflows, coding, AI tools, productivity, or business systems. Creator education channels such as Think Media may attract camera, editing, and creator-tool sponsors because viewers are actively buying equipment or software. A finance education channel may require stricter accuracy and disclosure because viewer decisions can involve money.</p>
<div class="placeholder"><strong>Screenshot placeholder:</strong> Add a sample sponsorship scorecard with rows for median views, audience fit, integration risk, usage rights, and expected deliverables.</div>
<h2>Deliverables to Define</h2>
<ul><li>Video type, length, and placement of sponsor segment.</li><li>Approval process and number of revisions.</li><li>Link placement, pinned comment, description copy, and tracking codes.</li><li>Usage rights for clips, ads, whitelisting, and duration.</li><li>Exclusivity category and time period.</li><li>Payment schedule and cancellation terms.</li></ul>
<h2>Red Flags</h2>
<p>Creators should be careful when a brand requests broad usage rights without paying for them, asks for undisclosed promotion, demands unrealistic guarantees, or pushes claims the creator cannot verify. Brands should be careful when a channel has volatile views, unrelated sponsor history, low comment quality, or a mismatch between the audience and product.</p>
<h2>Use Public Data Before Negotiating</h2>
<p>The <a href="/creator-dashboard">Creator Dashboard</a> can help estimate recent channel consistency and identify top videos. The <a href="/blog/youtube-engagement-rate-calculator">engagement rate guide</a> explains how to interpret likes and comments without overvaluing vanity metrics. Combine that with private screenshots from YouTube Studio when a deal becomes serious.</p>
<div class="cta-inline"><h3>Build a sponsorship baseline</h3><p>Use public channel analytics to compare recent performance before pitching, pricing, or buying a sponsorship.</p><a href="/creator-dashboard" class="btn btn-primary">Review a Channel</a></div>`,
    frBody: `
<p>Un sponsoring peut rapporter plus qu AdSense, mais il demande plus de responsabilite. Un bon partenariat correspond a l audience, est clairement indique et apporte une valeur mesurable a la marque sans abimer la confiance.</p>
<h2>Ce que la marque achete</h2><p>La marque n achete pas seulement des vues. Elle achete une attention de confiance dans une audience precise. Une chaine avec 30 000 vues de fondateurs SaaS peut valoir plus pour un outil B2B qu une chaine divertissement a 300 000 vues.</p>
<table class="data-table"><thead><tr><th>Signal</th><th>Importance</th><th>Verification publique</th></tr></thead><tbody><tr><td>Vues medianes recentes</td><td>Livraison previsible</td><td>10 a 20 dernieres videos</td></tr><tr><td>Compatibilite</td><td>Conversion</td><td>Sujets, commentaires, langue</td></tr><tr><td>Engagement</td><td>Confiance</td><td>Questions specifiques</td></tr><tr><td>Brand safety</td><td>Risque reputation</td><td>Ton et historique</td></tr></tbody></table>
<h2>Fixer le prix</h2><p>Le prix depend des vues moyennes, de la niche, du type de livrable, des droits d usage, de l exclusivite et de l effort de production. Un segment integre dans un tutoriel de confiance peut valoir plus qu une mention rapide dans une video large.</p>
<div class="placeholder"><strong>Emplacement scorecard :</strong> vues medianes, fit audience, risque integration, droits d usage, livrables.</div>
<h2>Livrables et signaux faibles</h2><ul><li>Placement, duree et format du segment.</li><li>Revisions et approbation.</li><li>Lien, commentaire epingle et codes de suivi.</li><li>Droits d usage et exclusivite.</li><li>Conditions de paiement.</li></ul><p>Refusez les demandes sans disclosure, les promesses irrealisables et les droits larges non remuneres.</p>
<h2>Analyse publique</h2><p>Le <a href="/fr/creator-dashboard">Creator Dashboard</a> aide a comparer les vues recentes, les formats forts et l engagement public avant de negocier.</p>
<div class="cta-inline"><h3>Construire une base de negociation</h3><p>Analysez les performances publiques avant un pitch ou un achat sponsoring.</p><a href="/fr/creator-dashboard" class="btn btn-primary">Examiner une chaine</a></div>`,
    faqs: [['How much should a YouTube sponsorship cost?', 'There is no universal price. Start with recent median views, niche value, deliverables, usage rights, production effort, and exclusivity.'], ['Should brands use subscribers to price deals?', 'Subscribers are less useful than recent median views, audience fit, engagement quality, and integration style.'], ['Do creators need to disclose sponsorships?', 'Yes. Creators should follow applicable advertising disclosure rules and YouTube policies for paid promotion.']],
    frFaqs: [['Combien coute un sponsoring YouTube ?', 'Il n y a pas de prix universel. Utilisez vues medianes, niche, livrables, droits et exclusivite.'], ['Les abonnes suffisent-ils pour fixer le prix ?', 'Non. Les vues recentes et la compatibilite audience sont plus utiles.'], ['Faut-il declarer le partenariat ?', 'Oui, selon les regles applicables et les politiques YouTube.']],
    sources: [official.ypp, official.adsense, official.api],
    related: [['Creator Dashboard', '/creator-dashboard', 'Tool'], ['Engagement Rate Calculator', '/blog/youtube-engagement-rate-calculator', 'Guide'], ['Compare YouTube Channels', '/blog/compare-youtube-channels', 'Guide']],
    frRelated: [['Creator Dashboard', '/fr/creator-dashboard', 'Outil'], ['Taux d engagement', '/fr/blog/youtube-engagement-rate-calculator', 'Guide'], ['Comparer des chaines', '/fr/blog/compare-youtube-channels', 'Guide']]
  }
];

const depthAdditions = {
  'grow-youtube-channel-fast': `
<h2>A Four-Week Growth Test Plan</h2>
<p>Week one should be research and packaging. Pick one audience problem, collect 20 public examples, and write three title/thumbnail directions before recording. Week two should publish the first test video and document the exact hypothesis: topic, promise, format, and expected viewer. Week three should publish a related follow-up that changes only one major variable, such as title angle or video structure. Week four should review median views, comments, and repeat questions, then decide whether to expand the cluster or retire it.</p>
<p>This slower method is still faster than random uploading because every video teaches something. The goal is not to force a viral result. The goal is to build a channel memory: what this audience clicks, where they drop, what they ask next, and which ideas are worth turning into a repeatable series.</p>`,
  'youtube-cpm-countries': `
<h2>How Country Mix Changes the Same View Count</h2>
<p>Imagine two channels both receive 500,000 monthly views. Channel A teaches US small-business taxes to viewers mostly in the United States. Channel B publishes general entertainment clips to a broad global audience. Channel A may have fewer casual viewers but stronger advertiser intent. Channel B may have more scale and cultural reach but a lower ad value per view. Neither channel is automatically better; they simply need different monetization plans.</p>
<p>For Channel A, better strategy might include long-form search videos, downloadable templates, sponsor integrations, and careful accuracy review. For Channel B, better strategy might include Shorts reach, brand-safe recurring formats, merch, live community, and regional sponsorships. A country estimate only becomes useful when it changes a decision.</p>
<h2>When Country Targeting Hurts Quality</h2>
<p>Creators sometimes try to force a high-CPM country by switching language, examples, or upload times without understanding that audience. This can weaken trust. A better approach is to serve a clear viewer completely. If the viewer is in Germany, Brazil, India, France, or the United States, the examples should match their context. Relevance beats artificial targeting.</p>`,
  'youtube-rpm-by-niche': `
<h2>Build a Revenue Stack, Not Just an RPM Estimate</h2>
<p>Ad RPM is only one layer. A complete revenue stack may include Watch Page ads, Shorts revenue, affiliate links, sponsorships, memberships, courses, templates, consulting, licensing, or events. Different niches favor different layers. A software tutorial channel may earn from affiliate links and templates. A fitness channel may earn from coaching or programs. A science channel may rely more on sponsorships and audience trust.</p>
<p>That is why the best niche decision starts with viewer problems. What does the viewer need after watching? A product? A checklist? A deeper course? A tool? A community? If there is no next step, the niche may still work as media, but the creator should not assume high RPM will carry the whole business.</p>
<h2>Update Frequency Matters</h2>
<p>Some high-RPM niches decay quickly. Software tutorials, AI tools, tax rules, and platform policies need updates because viewers and search engines can detect stale advice. Evergreen entertainment or storytelling may age differently. When choosing a niche, include maintenance cost in the decision. A topic that pays well but requires constant updates may be harder than a lower-RPM topic where your best videos stay useful for years.</p>`,
  'youtube-shorts-monetization': `
<h2>How to Turn Shorts Into a Search Asset</h2>
<p>Shorts are not only for the Shorts feed. A strong Short can reveal language that viewers use when asking for help. Save the exact comment phrases, objections, and repeat questions. Those phrases can become long-form titles, FAQ sections, community posts, and blog content. This is how short-form testing can improve search-based videos instead of distracting from them.</p>
<p>For example, if a Short about "one Excel shortcut I use every day" gets many comments asking for a full beginner workflow, the next long-form video should not be another random shortcut. It should be a structured tutorial that solves the broader workflow problem. The Short discovered demand; the long-form video satisfies it.</p>
<h2>Brand and Sponsor Fit</h2>
<p>Shorts-heavy channels can still attract sponsors, but the pitch should match the format. A sponsor may want a fast demonstration, a creator-use case, or a bundle with a long-form integration. Creators should be honest about expected delivery because Shorts views can be volatile. Recent median views and audience fit matter more than one viral spike.</p>`,
  'youtube-sponsorship-guide': `
<h2>A Simple Sponsorship Score</h2>
<p>Before quoting a price, score the deal from 1 to 5 across audience fit, product trust, integration effort, brand risk, and usage rights. A deal with strong audience fit but heavy usage rights should cost more than a simple in-video mention. A deal with weak product fit should often be declined even if the payment looks attractive, because trust is the channel's real asset.</p>
<table class="data-table"><thead><tr><th>Score area</th><th>Low score</th><th>High score</th></tr></thead><tbody><tr><td>Audience fit</td><td>Broad or unrelated product</td><td>Solves a known viewer problem</td></tr><tr><td>Trust</td><td>Claims are hard to verify</td><td>Creator can test and explain honestly</td></tr><tr><td>Effort</td><td>Complex production unpaid</td><td>Scope matches compensation</td></tr><tr><td>Rights</td><td>Unlimited usage requested</td><td>Clear time-limited permissions</td></tr></tbody></table>
<h2>Protecting Viewer Trust</h2>
<p>The best sponsorships feel like a relevant recommendation inside a useful video. The weakest ones interrupt the viewer with a product the creator would never use. Creators should ask for product access before recording, reject claims they cannot support, and make the disclosure clear. Brands benefit too: honest integrations usually create better long-term performance than forced scripts.</p>
<h2>Negotiation Checklist</h2>
<p>Before signing, write the deal in plain language: what video, what message, what approval deadline, what payment date, what link, what rights, and what happens if the brand misses feedback windows. This protects both sides. It also prevents scope creep, where a simple integration quietly becomes a full ad campaign with extra edits, extra usage, and no extra fee.</p>
<p>Creators should keep a record of public performance after the campaign: views after 7 and 30 days, click data if available, audience comments, and any learnings for the next sponsor. Brands should share conversion results when possible. Better post-campaign data leads to fairer renewal pricing.</p>`
};

const frenchDepthAdditions = {
  'grow-youtube-channel-fast': `<h2>Plan de test sur quatre semaines</h2><p>Semaine 1 : recherche et packaging. Semaine 2 : premiere video avec hypothese claire. Semaine 3 : suite liee en changeant une seule variable. Semaine 4 : analyse des vues medianes, commentaires et questions. Cette methode apprend plus vite que des publications aleatoires.</p>`,
  'youtube-cpm-countries': `<h2>Transformer le pays en decision</h2><p>Une estimation geographique doit changer une decision : exemples, sponsors, produits, langue ou formats. Si elle ne change rien, elle reste une curiosite. La pertinence pour le spectateur compte plus que la chasse artificielle aux pays a CPM eleve.</p>`,
  'youtube-rpm-by-niche': `<h2>Penser en pile de revenus</h2><p>Le RPM publicitaire n est qu une couche. Selon la niche, les revenus peuvent venir de sponsors, affiliation, templates, cours, consulting ou communaute. Choisir une niche demande donc de comprendre le probleme apres la video.</p>`,
  'youtube-shorts-monetization': `<h2>Utiliser les Shorts pour trouver la demande</h2><p>Les commentaires et questions sous les Shorts peuvent devenir des videos longues, FAQ, titres et guides. Le Short teste l accroche; la video longue livre la reponse complete et construit plus de confiance.</p>`,
  'youtube-sponsorship-guide': `<h2>Score simple de partenariat</h2><p>Notez audience, confiance produit, effort, risques et droits d usage de 1 a 5. Un deal tres adapte peut etre interessant; un deal mal adapte peut couter de la confiance meme s il paie bien.</p>`
};

for (const article of articles) {
  if (depthAdditions[article.slug] && !article.body.includes(depthAdditions[article.slug].trim().slice(0, 80))) {
    article.body = article.body.replace('<div class="cta-inline">', `${depthAdditions[article.slug]}\n<div class="cta-inline">`);
  }
  if (frenchDepthAdditions[article.slug] && !article.frBody.includes(frenchDepthAdditions[article.slug].trim().slice(0, 80))) {
    article.frBody = article.frBody.replace('<div class="cta-inline">', `${frenchDepthAdditions[article.slug]}\n<div class="cta-inline">`);
  }
}

for (const article of articles) {
  write(`blog/${article.slug}.html`, articlePage(article));
  write(`fr/blog/${article.slug}/index.html`, frenchPage(article));
}

function blogCard(article, prefix = '') {
  const href = `${prefix}/blog/${article.slug}`;
  const title = prefix ? article.frTitle : article.title;
  const excerpt = prefix ? article.frDescription : article.description;
  const cat = prefix ? article.frCategory : article.category;
  return `
        <a href="${href}" class="blog-card" data-cat="${article.category}">
          <div class="blog-thumb"><div class="blog-thumb-inner"><div class="blog-thumb-bg"></div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-7"/></svg></div></div>
          <div class="blog-body">
            <div class="blog-cat">${cat}</div>
            <div class="blog-title">${title}</div>
            <div class="blog-excerpt">${excerpt}</div>
            <div class="blog-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${displayDate} · ${article.readTime}</div>
          </div>
        </a>`;
}

function insertCards(file, prefix = '') {
  let html = read(file);
  for (const slug of slugs) {
    html = html.replace(new RegExp(`\\s*<a href="${prefix}/blog/${slug}" class="blog-card"[\\s\\S]*?<\\/a>`, 'g'), '');
  }
  html = html.replace('<div class="blog-grid" id="blog-grid">', `<div class="blog-grid" id="blog-grid">\n${articles.map(article => blogCard(article, prefix)).join('\n')}`);
  html = html.replace(/\s*<div style="text-align: center; margin: 20px auto; max-width: 728px; width: 100%; padding: 0 10px; box-sizing: border-box;">\s*<script>[\s\S]*?quarrelsomebitter[\s\S]*?<\/script>\s*<\/div>\s*/i, '\n');
  html = html.replace(/\s*<!--\s*=+\s*EMPLACEMENT 1[\s\S]*?quarrelsomebitter[\s\S]*?=+\s*-->\s*/i, '\n');
  html = html.replace(/<meta name="description" content="[^"]+" \/>/, '<meta name="description" content="Original YouTube creator guides about revenue, RPM, CPM, Shorts monetization, sponsorships, AI workflows, niche validation, and public-data channel analysis." />');
  write(file, html);
}

insertCards('blog/index.html', '');
insertCards('fr/blog/index.html', '/fr');

let home = read('index.html');
const homeTopicLinks = slugs.map(slug => `<a href="/blog/${slug}">${articles.find(a => a.slug === slug).title.replace(/:.*$/, '')}</a>`).join('');
if (!home.includes('/blog/youtube-shorts-monetization')) {
  home = home.replace('<a href="/blog">Blog</a>', `<a href="/blog">Blog</a>${homeTopicLinks}`);
}
home = home
  .replace(/\s*<div style="text-align: center; margin: 15px auto; max-width: 728px; width: 100%; padding: 0 10px; box-sizing: border-box;">\s*<script>[\s\S]*?(?:quarrelsomebitter|nautical-hand)[\s\S]*?<\/script>\s*<\/div>\s*/gi, '\n')
  .replace(/\s*<script>\s*\(function\([^)]*\)\{[\s\S]*?s\.src = "\\\/\\\/(?:quarrelsomebitter|nautical-hand)\.com[\s\S]*?<\/script>\s*/gi, '\n');
write('index.html', home);

let frenchHome = read('fr/index.html')
  .replace(/\s*<script>\s*\(function\([^)]*\)\{[\s\S]*?s\.src = "\\\/\\\/(?:quarrelsomebitter|nautical-hand)\.com[\s\S]*?<\/script>\s*/gi, '\n');
write('fr/index.html', frenchHome);

let sitemap = read('sitemap.xml');
for (const slug of slugs) {
  for (const url of [`https://norcanto.com/blog/${slug}`, `https://norcanto.com/fr/blog/${slug}`]) {
    sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${url.replaceAll('/', '\\/')}<\\/loc>[\\s\\S]*?<\\/url>`, 'g'), '');
    sitemap = sitemap.replace('</urlset>', `  <url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.84</priority></url>\n</urlset>`);
  }
}
for (const url of ['https://norcanto.com/blog', 'https://norcanto.com/', 'https://norcanto.com/about', 'https://norcanto.com/contact']) {
  sitemap = sitemap.replace(new RegExp(`(<loc>${url.replaceAll('/', '\\/')}<\\/loc><lastmod>)[^<]+`, 'g'), `$1${today}`);
}
write('sitemap.xml', sitemap);

function appendBefore(file, marker, block) {
  let html = read(file);
  if (!html.includes(block.slice(0, 80))) {
    html = html.replace(marker, `${block}\n${marker}`);
  }
  write(file, html);
}

appendBefore('about/index.html', '<div class="tool-cta reveal">', `
        <h2 id="about-editorial-h">Editorial Transparency and Data Limits</h2>
        <p>Norlytics articles are written to explain YouTube analytics decisions with public data, visible assumptions, and practical creator examples. We do not present private YouTube Studio metrics as public facts, and we do not publish exact revenue claims for channels we do not own.</p>
        <p>Revenue education pages separate CPM, RPM, Shorts monetization, sponsorships, memberships, affiliate revenue, and public-data estimates. When policy thresholds are discussed, the article links to official YouTube or Google documentation and includes an update date.</p>
        <p>Corrections, methodology questions, and source suggestions can be sent through the contact page. When a guide changes materially, the modified date is updated so readers and search engines can identify the freshness of the information.</p>
`);

appendBefore('contact/index.html', '<div class="contact-sidebar">', `
        <div class="info-card" style="margin-bottom:16px">
          <div class="info-card-title">Editorial and Methodology Feedback</div>
          <div class="info-card-text">Send corrections, source suggestions, public-data methodology questions, or AdSense/Search quality concerns. Include the page URL and the claim you want reviewed.</div>
        </div>
`);

const report = `# Norlytics Full Weak Page Quality Upgrade Report

Audit/update date: ${displayDate}

## Executive Summary

Norlytics previously had six English articles and six French counterparts quarantined with \`noindex, follow\` because they were thin, templated, and excluded from the sitemap. This update rewrites them into indexable creator resources instead of hiding them. No page was removed. No page currently deserves \`noindex\` after this pass.

## Pages Improved

| Page | Why Google may have skipped indexing | Unique value added | Before | After |
|---|---|---|---|---|
| /blog/ai-tools-for-youtube-creators | Thin generic AI list; little original workflow value | Full AI production workflow, examples, QA checklist, screenshot placeholder, internal links | Low | Strong |
| /blog/grow-youtube-channel-fast | Generic growth advice and duplicated template | Public-data growth framework, baseline method, topic clusters, packaging/retention tables | Low | Strong |
| /blog/youtube-cpm-countries | CPM topic overlapped with revenue pages but lacked country methodology | Country/RPM explanation, public geography limits, chart placeholder, country-use guidance | Low | Strong |
| /blog/youtube-rpm-by-niche | Thin RPM table concept with risk of misleading claims | Responsible RPM scenario method, niche comparison table, examples, validation workflow | Low | Strong |
| /blog/youtube-shorts-monetization | Short templated page for a complex policy topic | Shorts revenue model, YPP thresholds, eligible-view caveats, hybrid Shorts/long-form workflow | Low | Strong |
| /blog/youtube-sponsorship-guide | Generic monetization article; no pricing or deal framework | Sponsor scorecard, pricing factors, deliverables, red flags, public-data evaluation method | Low | Strong |
| /fr/blog/... counterparts | Noindexed duplicates of weak English pages | French-language versions with localized summaries, tables, FAQs, sources, and internal links | Low | Medium/Strong |

## Improvements Made

- Removed \`noindex, follow\` from the rewritten weak articles and French counterparts.
- Re-added all rewritten pages to \`sitemap.xml\` with ${today} lastmod dates.
- Reintroduced rewritten pages to EN and FR blog discovery surfaces.
- Added Article and FAQ structured data to each rewritten article.
- Added author blocks, methodology notes, update timestamps, source links, examples, tables, screenshot/chart placeholders, and practical creator checklists.
- Strengthened topic clusters across YouTube Analytics, Revenue, Shorts, Sponsorships, AI workflows, and Niche Research.
- Expanded About with editorial transparency, public-data methodology limits, correction process, and no unsupported exact-revenue claims.
- Expanded Contact with an explicit path for corrections and methodology feedback.
- Removed a third-party ad-script placement from the blog index that could weaken AdSense trust.

## Overlap Decisions

- \`youtube-cpm-countries\` overlaps with \`how-much-youtube-pays-per-view\` and \`youtube-rpm-vs-cpm\`, but now serves a distinct country/geography intent.
- \`youtube-rpm-by-niche\` overlaps with revenue guides, but now focuses on niche scenario planning and responsible benchmark use.
- \`youtube-shorts-monetization\` overlaps with monetization requirements, but now focuses on Shorts-specific revenue mechanics and hybrid strategy.
- \`youtube-sponsorship-guide\` overlaps with affiliate/membership revenue, but now focuses on brand deals, deliverables, and pricing.
- No improved page is a pure duplicate after this rewrite.

## Pages That Genuinely Deserve Noindex

None found in this pass. The previously quarantined pages were weak but salvageable, so they were improved and kept indexable.

## Remaining Weak Pages

- French pages are improved and indexable, but they are shorter than the English flagship versions. They should be expanded further if French organic search becomes a priority.
- Older indexed articles should be periodically refreshed with more screenshots, examples, and updated policy references.
- Live DNS, consent behavior, and Search Console indexing must still be checked after deployment.

## Recommended Search Console Indexing Requests

Request indexing after deployment for:

- /
- /blog
- /creator-dashboard
- /niche-insights
- /about
- /contact
- /blog/ai-tools-for-youtube-creators
- /blog/grow-youtube-channel-fast
- /blog/youtube-cpm-countries
- /blog/youtube-rpm-by-niche
- /blog/youtube-shorts-monetization
- /blog/youtube-sponsorship-guide
- /blog/youtube-rpm-vs-cpm
- /blog/youtube-niche-validation-framework
- /blog/youtube-channel-audit-checklist
- /blog/youtube-monetization-requirements-2026

## Quality Principle

This update follows the requested approach: improve weak pages first, use \`noindex\` only for truly obsolete or duplicated content, and build a more authoritative YouTube analytics resource for both Google Search and AdSense review.
`;

write('ADSENSE_CONTENT_UPGRADE_REPORT.md', report);

console.log(JSON.stringify({
  restored: slugs,
  englishWordCounts: Object.fromEntries(slugs.map(slug => [`blog/${slug}.html`, words(read(`blog/${slug}.html`))])),
  frenchWordCounts: Object.fromEntries(slugs.map(slug => [`fr/blog/${slug}/index.html`, words(read(`fr/blog/${slug}/index.html`))]))
}, null, 2));
