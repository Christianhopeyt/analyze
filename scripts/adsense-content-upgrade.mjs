import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const today = '2026-06-29';
const displayDate = 'June 29, 2026';

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function words(text) {
  return text.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function articleCss() {
  return `
    .article-body{max-width:760px;margin:0 auto}
    .article-body h2{font-size:clamp(1.22rem,2.6vw,1.48rem);margin:clamp(34px,5vw,46px) 0 14px;color:var(--text)}
    .article-body h3{font-size:clamp(1rem,2vw,1.16rem);margin:25px 0 10px;color:var(--text)}
    .article-body p{margin-bottom:18px;color:var(--text-2);line-height:1.82;font-size:clamp(.9rem,1.8vw,1rem)}
    .article-body ul,.article-body ol{margin:0 0 20px 22px;color:var(--text-2);line-height:1.78}
    .article-body li{margin-bottom:8px;font-size:clamp(.88rem,1.8vw,1rem)}
    .article-body strong{color:var(--text)}
    .article-body a{color:var(--yt-red)}
    .article-body a:hover{text-decoration:underline}
    .callout{background:var(--yt-red-glow);border-left:3px solid var(--yt-red);border-radius:0 var(--radius-md) var(--radius-md) 0;padding:16px 20px;margin:26px 0}
    .callout p{margin:0;color:var(--text-2);font-size:.91rem;line-height:1.7}
    .note-box{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;margin:26px 0}
    .note-box p:last-child{margin-bottom:0}
    .example-box{background:linear-gradient(135deg,rgba(255,0,0,.055),transparent 70%),var(--surface);border:1px solid rgba(255,0,0,.16);border-radius:var(--radius-lg);padding:20px;margin:28px 0}
    .example-box h3{margin-top:0}
    .data-table{width:100%;border-collapse:collapse;margin:20px 0 28px;font-size:clamp(.78rem,1.5vw,.9rem);display:block;overflow-x:auto}
    .data-table th{padding:11px 14px;text-align:left;background:var(--bg-3);color:var(--text);font-weight:700;border-bottom:2px solid var(--border);white-space:nowrap}
    .data-table td{padding:10px 14px;border-bottom:1px solid var(--border-light);color:var(--text-2);vertical-align:top}
    .data-table tr:hover td{background:var(--bg-2)}
    .cta-inline{background:linear-gradient(135deg,rgba(255,0,0,.06),rgba(255,0,0,.02));border:1px solid rgba(255,0,0,.15);border-radius:var(--radius-lg);padding:24px;margin:32px 0;text-align:center}
    .cta-inline h3{font-size:clamp(1rem,2vw,1.15rem);margin-bottom:8px}
    .cta-inline p{font-size:.9rem;color:var(--text-3);margin-bottom:16px}
    .related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:16px}
    .related-grid .card{text-decoration:none;padding:18px}
    .article-trust-note{max-width:760px;margin:40px auto 8px;padding:20px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-2);color:var(--text-2);line-height:1.7}
  `;
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

function header(active = 'blog') {
  return `<header id="header"><div class="container"><div class="header-inner">
  <a href="/" class="header-logo"><img src="/images/norlytics-logo.png" alt="Norlytics" class="site-logo-img" fetchpriority="high" loading="eager" decoding="async" />Norlytics</a>
  <nav class="header-nav"><a href="/#analyzer">Channel Analysis</a><a href="/creator-dashboard"${active === 'dashboard' ? ' class="active"' : ''}>Creator Dashboard</a><a href="/niche-insights"${active === 'niche' ? ' class="active"' : ''}>Niche Insights</a><a href="/blog"${active === 'blog' ? ' class="active"' : ''}>Blog</a><a href="/about">About</a></nav>
  <div class="header-controls"><div class="lang-switcher"><button class="lang-btn active" data-lang="EN">EN</button><button class="lang-btn" data-lang="FR">FR</button></div><button class="theme-toggle" aria-label="Toggle theme"></button></div>
  <button class="hamburger" aria-label="Menu" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
</div></div></header>
<nav class="mobile-menu"><a href="/">Home</a><a href="/creator-dashboard">Creator Dashboard</a><a href="/niche-insights">Niche Insights</a><a href="/blog">Blog</a><a href="/about">About</a><div class="mobile-menu-controls"><button class="theme-toggle" aria-label="Toggle theme"></button></div></nav>`;
}

function footer() {
  return `<footer id="footer"><div class="container">
  <div class="footer-top">
    <div class="footer-brand"><div class="footer-logo"><img src="/images/norlytics-logo.png" alt="Norlytics" class="site-logo-img" loading="lazy" decoding="async" /><div class="footer-logo-text">Norlytics</div></div><p class="footer-desc">Free YouTube channel analysis, revenue education, and public-data creator tools. Powered by Norcanto.</p></div>
    <div><div class="footer-col-title">Tools</div><div class="footer-links"><a href="/#analyzer">Channel Analyzer</a><a href="/creator-dashboard">Creator Dashboard</a><a href="/niche-insights">Niche Insights</a></div></div>
    <div><div class="footer-col-title">Learn</div><div class="footer-links"><a href="/blog/how-much-youtube-pays-per-view">Revenue Guide</a><a href="/blog/youtube-monetization-requirements-2026">Monetization Requirements</a><a href="/blog">Blog</a></div></div>
    <div><div class="footer-col-title">Legal</div><div class="footer-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a><a href="/cookies">Cookies</a></div></div>
  </div>
  <div class="footer-bottom"><div class="footer-copy">© 2026 Norlytics.</div><div class="footer-legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></div></div>
</div></footer><script src="../js/app.js" defer></script>`;
}

function frenchHeader() {
  return `<header id="header"><div class="container"><div class="header-inner">
  <a href="/fr" class="header-logo"><img src="/images/norlytics-logo.png" alt="Norlytics" class="site-logo-img" fetchpriority="high" loading="eager" decoding="async" />Norlytics</a>
  <nav class="header-nav"><a href="/fr">Analyse de chaîne</a><a href="/fr/creator-dashboard">Tableau de bord</a><a href="/fr/niche-insights">Niche Insights</a><a href="/fr/blog" class="active">Blog</a><a href="/fr/about">À propos</a></nav>
  <div class="header-controls"><div class="lang-switcher"><button class="lang-btn" data-lang="EN">EN</button><button class="lang-btn active" data-lang="FR">FR</button></div><button class="theme-toggle" aria-label="Changer le thème"></button></div>
  <button class="hamburger" aria-label="Menu" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
</div></div></header>
<nav class="mobile-menu"><a href="/fr">Accueil</a><a href="/fr/creator-dashboard">Tableau de bord</a><a href="/fr/niche-insights">Niche Insights</a><a href="/fr/blog">Blog</a><a href="/fr/about">À propos</a><div class="mobile-menu-controls"><button class="theme-toggle" aria-label="Changer le thème"></button></div></nav>`;
}

function frenchFooter() {
  return `<footer id="footer"><div class="container">
  <div class="footer-top">
    <div class="footer-brand"><div class="footer-logo"><img src="/images/norlytics-logo.png" alt="Norlytics" class="site-logo-img" loading="lazy" decoding="async" /><div class="footer-logo-text">Norlytics</div></div><p class="footer-desc">Outils gratuits d'analyse YouTube, d'estimation de revenus et de recherche de niches. Propulsé par Norcanto.</p></div>
    <div><div class="footer-col-title">Outils</div><div class="footer-links"><a href="/fr">Analyseur de chaîne</a><a href="/fr/creator-dashboard">Creator Dashboard</a><a href="/fr/niche-insights">Niche Insights</a></div></div>
    <div><div class="footer-col-title">Guides</div><div class="footer-links"><a href="/fr/blog/how-much-youtube-pays-per-view">Revenus YouTube</a><a href="/fr/blog/youtube-monetization-requirements-2026">Monétisation</a><a href="/fr/blog">Blog</a></div></div>
    <div><div class="footer-col-title">Légal</div><div class="footer-links"><a href="/fr/privacy">Confidentialité</a><a href="/fr/terms">Conditions</a><a href="/fr/contact">Contact</a><a href="/fr/cookies">Cookies</a></div></div>
  </div>
  <div class="footer-bottom"><div class="footer-copy">© 2026 Norlytics.</div><div class="footer-legal"><a href="/fr/privacy">Confidentialité</a><a href="/fr/terms">Conditions</a><a href="/fr/contact">Contact</a></div></div>
</div></footer><script src="/js/app.js" defer></script>`;
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

function articlePage({ slug, title, description, category, date, readTime, body, faqs = [], sources = '' }) {
  const canonical = `https://norcanto.com/blog/${slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date,
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
  <title>${title} | Norlytics</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title} | Norlytics" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="https://norcanto.com/images/og-image.png" />
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  ${faqs.length ? faqSchema(faqs) : ''}
  <link rel="stylesheet" href="../css/main.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" /></noscript>
  <style>${articleCss()}</style>
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:locale" content="en_US" />
${icons()}
</head>
<body>
${header('blog')}
<main style="padding-top:64px">
  <section style="padding:clamp(40px,7vw,60px) 0 clamp(28px,5vw,44px);background:var(--bg-2);border-bottom:1px solid var(--border)"><div class="container"><div class="article-body">
    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap"><span class="badge badge-red">${category}</span><span style="font-size:.75rem;color:var(--text-4)">Last updated ${displayDate} · ${readTime}</span></div>
    <h1 style="font-size:clamp(1.7rem,4vw,2.55rem);line-height:1.15;margin-bottom:14px">${title}</h1>
    <p style="font-size:clamp(.95rem,2vw,1.08rem);color:var(--text-3);line-height:1.7;margin:0">${description}</p>
  </div></div></section>
  <article class="section"><div class="container"><div class="article-body">
${body}
${faqs.length ? `<h2>Frequently Asked Questions</h2>${faqs.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join('\n')}` : ''}
${sources}
<div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border)">
  <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);margin-bottom:16px">Related Norlytics resources</div>
  <div class="related-grid">
    <a href="/creator-dashboard" class="card"><div class="blog-cat" style="margin-bottom:6px">Tool</div><div style="font-weight:700;color:var(--text);line-height:1.35">Creator Dashboard</div></a>
    <a href="/niche-insights" class="card"><div class="blog-cat" style="margin-bottom:6px">Tool</div><div style="font-weight:700;color:var(--text);line-height:1.35">Niche Insights</div></a>
    <a href="/blog/youtube-monetization-requirements-2026" class="card"><div class="blog-cat" style="margin-bottom:6px">Guide</div><div style="font-weight:700;color:var(--text);line-height:1.35">YouTube Monetization Requirements</div></a>
  </div>
</div>
  </div></div>
  <aside class="article-trust-note">
    <p style="margin:0 0 8px"><strong style="color:var(--text)">Written by Christian Hope</strong>, founder of Norcanto and creator of Norlytics.</p>
    <p style="margin:0"><strong style="color:var(--text)">Methodology note:</strong> Norlytics uses public YouTube API statistics and clearly stated assumptions. Estimates vary by niche, country, audience, season, and advertiser demand. They are not official YouTube Studio analytics.</p>
  </aside>
  </article>
</main>
${footer()}
</body>
</html>`;
}

function frenchRpmVsCpmPage() {
  const slug = 'youtube-rpm-vs-cpm';
  const canonical = `https://norcanto.com/fr/blog/${slug}`;
  const en = `https://norcanto.com/blog/${slug}`;
  const title = 'YouTube RPM vs CPM : la différence utile pour les créateurs';
  const description = 'Un guide clair pour comprendre RPM, CPM, vues monétisées et calculs de revenus YouTube sans confondre coût publicitaire et revenu créateur.';
  const faqs = [
    ['Le RPM est-il plus utile que le CPM pour un créateur ?', 'Oui, dans la plupart des cas. Le RPM estime le revenu créateur pour 1 000 vues totales, alors que le CPM décrit le coût payé par les annonceurs pour 1 000 impressions publicitaires.'],
    ['Pourquoi mon RPM est-il inférieur à mon CPM ?', 'Le RPM tient compte du partage de revenus, des vues non monétisées, de la disponibilité des annonces, du pays de l’audience, du format et de la saison.'],
    ['Un outil public peut-il connaître le vrai RPM d’une chaîne ?', 'Non. Le vrai RPM est une donnée privée de YouTube Studio. Un outil public peut seulement produire une estimation prudente avec des hypothèses visibles.']
  ];
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: today,
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
  <title>${title} | Norlytics</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title} | Norlytics" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="https://norcanto.com/images/og-image.png" />
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  ${faqSchema(faqs)}
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
    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap"><span class="badge badge-red">Revenus YouTube</span><span style="font-size:.75rem;color:var(--text-4)">Dernière mise à jour : 29 juin 2026 · 10 min de lecture</span></div>
    <h1 style="font-size:clamp(1.7rem,4vw,2.55rem);line-height:1.15;margin-bottom:14px">${title}</h1>
    <p style="font-size:clamp(.95rem,2vw,1.08rem);color:var(--text-3);line-height:1.7;margin:0">${description}</p>
  </div></div></section>
  <article class="section"><div class="container"><div class="article-body">
    <p>RPM et CPM sont souvent mélangés, mais ils ne répondent pas à la même question. Le CPM décrit ce que paient les annonceurs. Le RPM décrit ce qu’un créateur reçoit pour 1 000 vues totales, après le partage de revenus et après prise en compte des vues qui ne génèrent pas forcément d’annonce.</p>
    <p>Si vous planifiez une chaîne, comparez des niches ou estimez les revenus d’une chaîne publique, le RPM est généralement le chiffre le plus utile. Le CPM reste important pour comprendre la demande publicitaire, mais il peut donner une impression trop optimiste des revenus réels.</p>
    <h2>Définitions simples</h2>
    <table class="data-table"><thead><tr><th>Métrique</th><th>Signification</th><th>Utilisation</th></tr></thead><tbody><tr><td>CPM</td><td>Coût payé par les annonceurs pour 1 000 impressions publicitaires</td><td>Comprendre la demande publicitaire</td></tr><tr><td>CPM basé sur les lectures</td><td>Coût pour 1 000 lectures monétisées</td><td>Analyse publicitaire dans YouTube Studio</td></tr><tr><td>RPM</td><td>Revenu créateur pour 1 000 vues totales</td><td>Planification et estimation des revenus</td></tr></tbody></table>
    <h2>Pourquoi le CPM paraît plus élevé que le RPM</h2>
    <p>Toutes les vues ne montrent pas une publicité. Certains spectateurs utilisent YouTube Premium, certaines vidéos sont moins adaptées aux annonces, certains pays ont une demande publicitaire plus faible et certains formats se monétisent différemment. Le RPM résume mieux cette réalité côté créateur.</p>
    <div class="example-box"><h3>Exemple de calcul</h3><p>Une vidéo peut afficher un CPM de 12 $ sur ses impressions publicitaires monétisées, mais seulement une partie des vues totales a généré des annonces. Après le partage de revenus et les vues non monétisées, le RPM créateur peut être plutôt entre 4 $ et 7 $.</p></div>
    <h2>Quel chiffre utiliser ?</h2>
    <p>Utilisez le RPM pour estimer les revenus d’une chaîne, comparer des niches ou décider si une stratégie peut soutenir une activité. Utilisez le CPM pour comprendre l’intérêt des annonceurs ou discuter d’achat média. Si un calculateur demande un CPM, souvenez-vous que le revenu créateur sera inférieur.</p>
    <h2>Lien avec la niche et le pays</h2>
    <p>Une niche à forte intention commerciale peut produire un RPM plus élevé parce que les annonceurs se disputent ces spectateurs. Le pays de l’audience peut amplifier ou réduire l’estimation. C’est pourquoi le guide <a href="/fr/blog/how-much-youtube-pays-per-view">combien YouTube paie par vue</a> et le guide sur <a href="/fr/blog/youtube-channel-country-analyzer">l’origine de l’audience</a> doivent être lus ensemble.</p>
    <h2>Méthode d’estimation publique</h2>
    <ol><li>Identifier la niche dominante de la chaîne.</li><li>Estimer la zone géographique probable de l’audience à partir de signaux publics.</li><li>Choisir une fourchette de RPM prudente.</li><li>Multiplier les vues récentes par cette fourchette.</li><li>Présenter un scénario bas, probable et optimiste plutôt qu’un chiffre exact.</li></ol>
    <h2>Quand le CPM reste utile</h2>
    <p>Le CPM reste utile quand vous pensez comme un annonceur. Une marque peut vouloir comparer le coût pour atteindre une audience sur YouTube, dans une newsletter ou sur un podcast. Un créateur, en revanche, ne doit pas confondre ce coût publicitaire avec son revenu personnel.</p>
    <h2>Questions à poser avant de publier</h2>
    <ul><li>La vidéo attire-t-elle des spectateurs qui cherchent, comparent, achètent ou apprennent vraiment ?</li><li>Le sujet se relie-t-il naturellement à des annonceurs, outils, produits ou sponsors ?</li><li>La vidéo peut-elle continuer à attirer du trafic après la première semaine ?</li><li>L’audience semble-t-elle concentrée dans des marchés publicitaires forts, moyens ou faibles ?</li><li>Le sujet peut-il soutenir une suite, une ressource affiliée, un modèle ou un avantage membre ?</li></ul>
    <h2>Note de méthodologie</h2>
    <p>Norlytics estime les revenus avec des données publiques, des hypothèses de niche, des signaux géographiques et des fourchettes de RPM. Le vrai RPM reste une donnée privée de YouTube Studio. Les estimations doivent servir à comparer et planifier, pas à promettre un revenu garanti.</p>
    <div class="cta-inline"><h3>Estimez avec le RPM, pas avec du buzz</h3><p>Utilisez Norlytics pour calculer des fourchettes de revenus réalistes à partir de données publiques, puis comparez le résultat avec l’engagement et la force de la niche.</p><a href="/fr" class="btn btn-primary">Utiliser le calculateur</a></div>
    <h2>Questions fréquentes</h2>
    ${faqs.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join('\n')}
    <div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border)"><div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);margin-bottom:16px">Ressources liées</div><div class="related-grid"><a href="/fr/creator-dashboard" class="card"><div class="blog-cat">Outil</div><strong>Creator Dashboard</strong></a><a href="/fr/niche-insights" class="card"><div class="blog-cat">Outil</div><strong>Niche Insights</strong></a><a href="/fr/blog/how-much-youtube-pays-per-view" class="card"><div class="blog-cat">Guide</div><strong>Revenus YouTube par vue</strong></a></div></div>
  </div></div>
  <aside class="article-trust-note"><p style="margin:0 0 8px"><strong style="color:var(--text)">Rédigé par Christian Hope</strong>, fondateur de Norcanto et créateur de Norlytics.</p><p style="margin:0"><strong style="color:var(--text)">Note de méthodologie :</strong> Norlytics utilise des statistiques publiques de l’API YouTube et des hypothèses clairement indiquées. Les estimations varient selon la niche, le pays, l’audience, la saison et la demande publicitaire. Elles ne sont pas des données officielles de YouTube Studio.</p></aside>
  </article>
</main>
${frenchFooter()}
</body>
</html>`;
}

const expanded = [
  {
    slug: 'compare-youtube-channels',
    title: 'How to Analyze and Compare YouTube Channels Like a Professional in 2026',
    description: 'A practical framework for comparing public YouTube channels by consistency, audience quality, engagement, revenue potential, and repeatable content signals.',
    category: 'Channel Growth',
    date: '2026-06-03',
    readTime: '12 min read',
    body: `
<p>Channel comparison is useful only when it answers a decision. A creator may want to know which competitor is worth studying. A brand may want to know which channel deserves a sponsorship budget. An agency may want to explain why one channel with fewer subscribers is a better partner than a larger but weaker one.</p>
<p>The mistake is comparing vanity metrics in isolation. Subscriber count, total views, and one viral upload can all mislead you. A stronger comparison looks at recent public performance, publishing behavior, audience fit, and whether the channel has a repeatable content engine.</p>
<div class="callout"><p><strong>Fast rule:</strong> compare channels by recent average views, engagement rate, upload consistency, topic focus, and monetization fit before you look at total subscribers.</p></div>
<h2>The 6-Metric Professional Channel Comparison Framework</h2>
<h3>1. Recent average views</h3><p>Pull the last 10 to 20 public videos and calculate the average and median view count. The median matters because one breakout video can inflate the average. If Channel A averages 80,000 views but has a median of 18,000, while Channel B averages 42,000 with a median of 39,000, Channel B probably has the more reliable audience.</p>
<h3>2. Subscriber-to-view ratio</h3><p>A channel with one million subscribers and 12,000 views per upload may be weaker than a 120,000-subscriber channel earning 45,000 views per upload. Divide recent median views by subscriber count to estimate active audience pull. This is not an official YouTube metric, but it is useful for spotting inactive or mismatch-heavy audiences.</p>
<h3>3. Upload consistency</h3><p>Review the publish dates for the most recent 20 videos. Strong comparison candidates usually have a cadence viewers can recognize: weekly, twice monthly, or a clear seasonal format. A channel with uneven gaps may still be valuable, but you should not compare its best upload against a competitor's normal cadence.</p>
<h3>4. Engagement rate</h3><p>For public comparison, use likes and comments where visible. A simple public engagement formula is: <strong>(likes + comments) / views x 100</strong>. Do not compare a 12-hour-old upload to a two-month-old upload. Normalize by age or use a consistent sample window.</p>
<h3>5. Niche and audience fit</h3><p>Two channels with similar views can have very different business value. A personal finance channel, a gaming highlights channel, and a local food channel may each get 50,000 views, but advertisers, affiliate partners, and viewer purchase intent are different. This is where RPM and CPM explanations matter. If revenue is the goal, read the <a href="/blog/how-much-youtube-pays-per-view">YouTube pay-per-view guide</a> alongside the comparison.</p>
<h3>6. Repeatable topic patterns</h3><p>Look for formats that win more than once. A single viral video is evidence of reach; three similar strong videos are evidence of repeatability. Repeatability is what creators can learn from and what sponsors can buy with more confidence.</p>
<h2>A Small Comparison Example</h2>
<table class="data-table"><thead><tr><th>Signal</th><th>Channel A</th><th>Channel B</th><th>Better read</th></tr></thead><tbody><tr><td>Subscribers</td><td>500,000</td><td>140,000</td><td>A looks bigger</td></tr><tr><td>Median recent views</td><td>22,000</td><td>41,000</td><td>B has stronger active demand</td></tr><tr><td>Upload cadence</td><td>Irregular</td><td>Weekly</td><td>B is easier to forecast</td></tr><tr><td>Public engagement</td><td>1.1%</td><td>3.4%</td><td>B has a more responsive audience</td></tr><tr><td>Niche clarity</td><td>Mixed lifestyle</td><td>Beginner budgeting</td><td>B is easier to match with brands</td></tr></tbody></table>
<p>In this example, the smaller channel is the better benchmark and likely the better sponsorship partner. The larger channel may still have reach, but the active audience signal is weaker.</p>
<h2>How to Use Norlytics for the Comparison</h2>
<p>Start with the <a href="/creator-dashboard">Creator Dashboard</a> for each channel. It reviews recent public uploads, top videos, upload patterns, growth velocity, and public engagement signals. Then use the main <a href="/#analyzer">Norlytics channel analyzer</a> to estimate revenue context, niche, country signal, and business potential.</p>
<p>If the channels operate in different topics, use <a href="/niche-insights">Niche Insights</a> to compare the wider demand environment. A channel in a slow but high-RPM niche may be more valuable than a channel in a fast but low-RPM trend.</p>
<h2>Common Comparison Mistakes</h2>
<ul><li><strong>Comparing all-time totals:</strong> total views reflect history, not current strength.</li><li><strong>Ignoring video age:</strong> a video published yesterday has not had the same time to collect views as one published last month.</li><li><strong>Treating AI summaries as analytics:</strong> AI can help interpret patterns, but the underlying metrics should come first.</li><li><strong>Comparing different formats:</strong> Shorts, livestreams, podcasts, and edited tutorials behave differently.</li><li><strong>Forgetting monetization fit:</strong> a channel can be large and still have low commercial value for a specific partner.</li></ul>
<h2>Methodology Notes</h2>
<p>This comparison method uses public YouTube information: visible subscribers, public videos, publish dates, view counts, likes where available, comments where available, titles, descriptions, and channel metadata. It cannot see YouTube Studio data such as retention, impressions, click-through rate, private demographics, or actual revenue.</p>
<div class="cta-inline"><h3>Compare a channel with public data</h3><p>Use the Creator Dashboard to review recent uploads, engagement, growth velocity, and top videos before you make a content or sponsorship decision.</p><a href="/creator-dashboard" class="btn btn-primary">Open Creator Dashboard</a></div>`,
    faqs: [
      ['What is the best metric for comparing YouTube channels?', 'Recent median views are usually more useful than subscriber count because they show how much active demand a channel currently earns.'],
      ['Can I compare channels without YouTube Studio access?', 'Yes. You can compare public uploads, views, publish cadence, engagement signals, topics, and visible metadata, but private Studio metrics remain unavailable.'],
      ['Should brands choose the channel with more subscribers?', 'Not automatically. Brands should compare audience fit, recent views, engagement, niche relevance, and consistency before subscriber count.']
    ]
  },
  {
    slug: 'how-much-youtube-pays-per-view',
    title: 'How Much Does YouTube Pay Per View in 2026?',
    description: 'A creator-focused explanation of YouTube RPM, CPM, revenue per view, country differences, Shorts revenue, and realistic calculation examples.',
    category: 'YouTube Revenue',
    date: '2026-01-15',
    readTime: '13 min read',
    body: `
<p>YouTube does not pay a fixed amount for every view. A creator earns money when eligible views generate advertising revenue, YouTube Premium revenue, Shorts revenue share, or other monetization features. That is why two videos with the same view count can produce very different earnings.</p>
<p>The useful question is not "what is one YouTube view worth?" The useful question is: <strong>what RPM can this channel realistically earn for this topic, audience country, format, season, and monetization mix?</strong></p>
<h2>CPM vs RPM: The Difference That Matters</h2>
<p><strong>CPM</strong> is what advertisers pay per 1,000 ad impressions. <strong>RPM</strong> is creator revenue per 1,000 views after YouTube's revenue share and after accounting for views that may not show an ad. Creators should plan with RPM, not CPM, because RPM is closer to take-home revenue.</p>
<div class="example-box"><h3>Basic revenue calculation</h3><p>If a channel receives 100,000 long-form views and has a $6 RPM, estimated ad revenue is:</p><p><strong>100,000 / 1,000 x $6 = $600</strong></p><p>If the same views earn a $2 RPM, the estimate becomes $200. Same view count, very different result.</p></div>
<h2>Typical RPM Differences by Niche</h2>
<table class="data-table"><thead><tr><th>Niche</th><th>Common RPM pattern</th><th>Why it differs</th></tr></thead><tbody><tr><td>Finance and investing</td><td>High</td><td>Advertisers often sell high-value products and services.</td></tr><tr><td>Business software</td><td>High</td><td>B2B buyers can be valuable, especially for subscriptions.</td></tr><tr><td>Technology tutorials</td><td>Medium to high</td><td>Product intent can be strong, but audience mix varies.</td></tr><tr><td>Education</td><td>Medium</td><td>Useful search intent, often less direct purchase intent.</td></tr><tr><td>Food, lifestyle, travel</td><td>Low to medium</td><td>Broad audiences and variable advertiser demand.</td></tr><tr><td>Gaming and entertainment</td><td>Often lower</td><td>Large supply, younger audiences, and less direct buying intent.</td></tr></tbody></table>
<p>These are planning ranges, not promises. A gaming channel with a wealthy U.S. audience and strong sponsorships can outperform a generic finance channel. Public calculators should show a range rather than a single "exact" number.</p>
<h2>Country and Language Change the Estimate</h2>
<p>Audience country matters because advertiser demand and purchasing power differ by market. A video viewed mostly in the United States, Canada, the United Kingdom, Australia, Germany, or the Netherlands will usually monetize differently from the same video viewed mostly in lower-CPM markets.</p>
<p>If you are analyzing a public channel, use the <a href="/blog/youtube-channel-country-analyzer">channel country analyzer guide</a> to understand what can be inferred from language, topic, upload timing, comments, and public metadata. Treat it as an estimate, not a demographic report.</p>
<h2>Long-Form Videos vs Shorts</h2>
<p>Long-form videos and Shorts are monetized differently. Long-form videos can run watch-page ads and may become eligible for more ad placements depending on length and suitability. Shorts revenue is shared from Shorts Feed ad revenue and is usually much lower per view than long-form RPM.</p>
<p>This does not make Shorts useless. Shorts can introduce new viewers to a channel, test ideas quickly, and create top-of-funnel reach. But if a creator's business model depends on AdSense, they should usually convert some of that attention into long-form videos, email lists, products, memberships, or affiliate funnels.</p>
<h2>Three Practical Revenue Examples</h2>
<table class="data-table"><thead><tr><th>Scenario</th><th>Views</th><th>Planning RPM</th><th>Estimated revenue</th></tr></thead><tbody><tr><td>Gaming highlights channel</td><td>250,000</td><td>$2.50</td><td>$625</td></tr><tr><td>Software tutorial channel</td><td>80,000</td><td>$9.00</td><td>$720</td></tr><tr><td>Personal finance explainer</td><td>40,000</td><td>$18.00</td><td>$720</td></tr></tbody></table>
<p>The smallest channel in this example can earn as much as the larger channels because the audience intent is commercially valuable. This is why niche, country, and intent matter as much as raw views.</p>
<h2>How to Estimate a Public Channel</h2>
<ol><li>Collect recent video views, not only total channel views.</li><li>Identify the dominant content topic and viewer intent.</li><li>Estimate likely audience region using public signals.</li><li>Apply a conservative RPM range rather than one exact value.</li><li>Compare the estimate with engagement and upload consistency.</li></ol>
<p>Norlytics combines these public signals in the main <a href="/#analyzer">channel analyzer</a>. For deeper performance context, use the <a href="/creator-dashboard">Creator Dashboard</a> to inspect recent uploads and top videos.</p>
<h2>Why a Range Is More Honest Than One Number</h2>
<p>Many revenue articles give a single rate per view because it feels satisfying. It is rarely honest. A better estimate shows a conservative case, a likely case, and an optimistic case. For example, a 200,000-view software tutorial might be modeled at $5, $9, and $14 RPM. That produces a planning range of $1,000 to $2,800 rather than a fake exact answer.</p>
<p>Ranges also help creators make better decisions. If a channel needs $3,000 per month from ads alone, a low-RPM niche may require a much larger view target than expected. If the same channel adds affiliate links, templates, or sponsorships, the required view target may become more realistic.</p>
<h2>What Creators Can Actually Influence</h2>
<p>You cannot control advertiser budgets, but you can influence the kind of audience and intent your videos attract. Clear problem-solving titles, search-friendly tutorials, buyer-aware comparisons, and evergreen explainers tend to create stronger commercial signals than broad entertainment uploads. That does not mean every channel should become a finance channel. It means creators should understand the revenue tradeoff of the formats they choose.</p>
<h2>Methodology Notes</h2>
<p>Norlytics revenue estimates are built from public channel and video data, category assumptions, country multipliers, and stated RPM ranges. They are not pulled from YouTube Studio, AdSense, or a creator's private account. Use them for planning, comparisons, and scenario analysis, not as guaranteed earnings.</p>
<div class="cta-inline"><h3>Estimate revenue with a range</h3><p>Paste a public channel URL into Norlytics to estimate revenue, engagement, niche, and business potential using public data.</p><a href="/#analyzer" class="btn btn-primary">Open Revenue Calculator</a></div>`,
    faqs: [
      ['How much does YouTube pay for 1,000 views?', 'There is no fixed rate. A practical estimate uses RPM, which can range from low single digits to much higher values depending on niche, audience country, format, and advertiser demand.'],
      ['Is RPM the same as CPM?', 'No. CPM is the advertiser cost per 1,000 ad impressions. RPM is the creator revenue per 1,000 views and is usually the more useful planning metric.'],
      ['Do Shorts pay the same as long-form videos?', 'Usually no. Shorts revenue per view is typically lower because Shorts use a different revenue-sharing model from watch-page ads.']
    ]
  },
  {
    slug: 'youtube-channel-country-analyzer',
    title: "How to Find Out Where a YouTube Channel's Audience Comes From",
    description: 'Learn what public signals can and cannot reveal about YouTube audience geography, why country affects RPM, and how to interpret estimates responsibly.',
    category: 'YouTube Monetization',
    date: '2026-05-05',
    readTime: '11 min read',
    body: `
<p>YouTube Studio shows a channel owner where viewers come from. Public viewers do not get that private demographic report. Still, public signals can help estimate a channel's likely audience geography well enough for revenue planning, sponsorship research, and competitive analysis.</p>
<p>The key is honesty. A public country estimate is not official audience data. It is an inference based on language, topic, upload timing, comments, titles, currency references, and other visible context.</p>
<h2>Why Audience Country Changes Revenue</h2>
<p>Advertisers pay different rates in different markets. A software advertiser targeting U.S. small businesses may pay much more than a brand targeting a broad global entertainment audience. That is why a smaller channel with a high-value audience can sometimes earn more than a larger channel with lower advertiser demand.</p>
<div class="example-box"><h3>Simple country multiplier example</h3><p>Imagine a topic with a $6 base RPM. If the likely audience market has a 1.4x multiplier, the planning RPM becomes $8.40. If another channel in the same topic has a 0.4x multiplier, the planning RPM becomes $2.40.</p><p><strong>100,000 views x $8.40 RPM = $840</strong><br /><strong>100,000 views x $2.40 RPM = $240</strong></p></div>
<h2>Public Signals That Help Estimate Audience Country</h2>
<ul><li><strong>Spoken and written language:</strong> useful, but not enough on its own because English channels can serve global audiences.</li><li><strong>Currency and examples:</strong> mentions of dollars, pounds, euros, tax systems, schools, laws, or local brands can reveal audience intent.</li><li><strong>Comment language:</strong> a comment section can show where engaged viewers likely come from, although it overrepresents people who comment.</li><li><strong>Upload timing:</strong> channels often publish when their core audience is awake, but scheduling strategies can blur this signal.</li><li><strong>Topic geography:</strong> local real estate, local politics, regional jobs, and country-specific finance topics are stronger clues than generic entertainment.</li><li><strong>Channel metadata:</strong> about-page location and external links can help, but many creators leave them blank or use creator location rather than audience location.</li></ul>
<h2>What Public Data Cannot Reveal</h2>
<p>Public tools cannot see YouTube Studio geography, returning viewers, subscribed-viewer split, age, gender, traffic sources, impressions, or watch-time geography. Any tool that claims exact private demographics for a channel it does not own should be treated with skepticism.</p>
<h2>How Norlytics Handles Country Estimates</h2>
<p>Norlytics uses public channel and video signals to form an audience-country estimate, then applies that estimate to revenue scenarios. The estimate should be read as a planning assumption. It helps you compare possibilities, but it should not be presented as verified YouTube Studio data.</p>
<p>For a wider audit, pair the country estimate with the <a href="/creator-dashboard">Creator Dashboard</a>. A channel with a high-value audience estimate but weak recent performance may still be less attractive than a consistent channel in a moderate market.</p>
<h2>Country Analysis for Creators</h2>
<p>If you own the channel, check YouTube Studio first. Public estimates are mainly useful for competitor research and external channel analysis. Once you know where your audience is, adapt examples, posting times, product recommendations, and sponsorship targets to fit the audience you actually serve.</p>
<h2>Country Analysis for Sponsors</h2>
<p>Sponsors should ask creators for first-party analytics screenshots before signing a major deal. Public country estimates are useful for shortlisting channels, but paid campaigns deserve verified data. A transparent creator can share geography, age range, watch time, and recent performance without exposing sensitive revenue details.</p>
<h2>Common Mistakes When Reading Audience Country</h2>
<ul><li><strong>Confusing creator location with audience location:</strong> a creator living in France may have a mostly U.S. audience, or the reverse.</li><li><strong>Trusting language alone:</strong> English channels can serve viewers across North America, Europe, India, the Philippines, Africa, and global expat communities.</li><li><strong>Overweighting comments:</strong> comments show engaged viewers, not the entire viewer base.</li><li><strong>Ignoring topic specificity:</strong> a generic tech channel is harder to place than a channel about U.K. tax software.</li></ul>
<p>The best estimate combines several weak signals into one stronger directional read. If language, examples, comments, upload timing, and topic references all point to the same region, confidence is higher. If the signals disagree, a responsible tool should show uncertainty rather than invent precision.</p>
<h2>Methodology Notes</h2>
<p>This guide uses only public signals. It does not claim to access private YouTube Studio analytics. Norlytics country estimates are intended to support research and planning, especially when comparing public channels where owner-only data is unavailable.</p>
<div class="cta-inline"><h3>Estimate audience context</h3><p>Use Norlytics to combine likely audience country, niche, RPM assumptions, and public performance into a practical revenue estimate.</p><a href="/#analyzer" class="btn btn-primary">Analyze a Channel</a></div>`,
    faqs: [
      ['Can I see the exact country breakdown of someone else\'s YouTube channel?', 'No. Exact geography is private YouTube Studio data. Public tools can only estimate likely audience geography from visible signals.'],
      ['Why does audience country affect YouTube RPM?', 'Advertiser demand, purchasing power, and local ad markets differ by country, so the same topic and view count can monetize differently across regions.'],
      ['Should sponsors rely only on public country estimates?', 'No. Public estimates are useful for shortlisting. Serious paid campaigns should request first-party analytics from the creator.']
    ]
  },
  {
    slug: 'youtube-engagement-rate-calculator',
    title: 'YouTube Engagement Rate: What It Is, How to Calculate It, and Why It Matters in 2026',
    description: 'A practical guide to YouTube engagement rate formulas, examples, benchmarks, sponsorship evaluation, and how to interpret public engagement signals.',
    category: 'Content Creators',
    date: '2026-04-20',
    readTime: '12 min read',
    body: `
<p>Engagement rate helps answer a question view count cannot: did viewers care enough to respond? For creators, engagement can show which topics build community. For brands, it helps separate a large passive audience from a smaller but more responsive one.</p>
<p>YouTube engagement is not one official public metric. It is a calculation you choose based on the data available. For public analysis, the most practical formula is likes plus comments divided by views.</p>
<div class="example-box"><h3>Public engagement formula</h3><p><strong>(likes + comments) / views x 100 = public engagement rate</strong></p><p>If a video has 2,400 likes, 180 comments, and 90,000 views, the calculation is:</p><p><strong>(2,400 + 180) / 90,000 x 100 = 2.87%</strong></p></div>
<h2>Why Engagement Rate Matters</h2>
<p>Subscribers show potential reach. Views show actual consumption. Engagement shows response. A channel that gets viewers to comment, ask questions, save ideas, and return for future uploads may be more valuable than a channel that only earns passive views.</p>
<p>Engagement also gives creators a feedback loop. If tutorials with checklists receive twice the comment rate of news-style videos, the audience may be asking for practical help rather than updates.</p>
<h2>Which Engagement Formula Should You Use?</h2>
<table class="data-table"><thead><tr><th>Formula</th><th>Best for</th><th>Limitation</th></tr></thead><tbody><tr><td>(likes + comments) / views</td><td>Public video analysis</td><td>Does not include shares, saves, retention, or watch time.</td></tr><tr><td>Comments / views</td><td>Community depth</td><td>Comment-heavy topics can skew results.</td></tr><tr><td>Likes / views</td><td>Quick comparison</td><td>Likes may be hidden or less meaningful in some niches.</td></tr><tr><td>Engaged views in Studio</td><td>Owned-channel analysis</td><td>Requires channel-owner access.</td></tr></tbody></table>
<h2>How to Read Engagement by Channel Size</h2>
<p>Smaller channels often have higher engagement percentages because the audience is tighter and more personal. Larger channels often earn more total comments but lower percentages. Do not judge a 10,000-subscriber channel and a 2-million-subscriber channel by the same expectations.</p>
<p>Compare engagement against similar channels in the same niche, language, and format. A tutorial channel, a livestream channel, a Shorts channel, and a documentary channel create different viewer behavior.</p>
<h2>Practical Ways to Improve Engagement</h2>
<ul><li><strong>Ask a specific question:</strong> "What tool are you using for thumbnails?" is stronger than "Comment below."</li><li><strong>Use pinned comments:</strong> turn the first comment into a prompt, checklist, or follow-up resource.</li><li><strong>Build series logic:</strong> viewers engage more when each video connects to a larger journey.</li><li><strong>Reply early:</strong> the first 24 to 48 hours are usually when the comment section is easiest to shape.</li><li><strong>Make examples concrete:</strong> practical examples create more viewer responses than abstract advice.</li></ul>
<h2>How Brands Should Use Engagement Rate</h2>
<p>Brands should avoid buying sponsorships on engagement rate alone. A high engagement rate on a controversial video may not be commercially useful. Combine engagement with audience fit, recent view consistency, topic relevance, and country signals.</p>
<p>Use the <a href="/blog/compare-youtube-channels">channel comparison framework</a> when evaluating creators side by side. Engagement should support the decision, not replace it.</p>
<h2>Engagement Rate by Video Age</h2>
<p>Engagement changes over time. A new upload may receive intense comments in the first 48 hours, then settle into slower search traffic. Evergreen tutorials may collect fewer early comments but keep earning useful views for months. When comparing videos, use similar age windows whenever possible.</p>
<p>A practical method is to compare each video's first-week public engagement if you are tracking your own channel. For public competitor research, group videos by approximate age: less than 7 days, 7 to 30 days, and older than 30 days. This prevents a brand-new upload from looking weak simply because it has not had enough time to accumulate responses.</p>
<h2>What Engagement Cannot Tell You</h2>
<p>A high public engagement rate does not prove high retention, strong click-through rate, or buying intent. Some topics generate comments because they are controversial, confusing, or polarizing. Other topics solve a problem quietly and produce fewer comments while still converting well. Use engagement as one part of the audit, not the whole diagnosis.</p>
<h2>How Norlytics Calculates Public Engagement</h2>
<p>The <a href="/creator-dashboard">Creator Dashboard</a> reviews recent public videos and calculates engagement from visible likes, comments, and views where available. If some signals are hidden or unavailable, the dashboard explains the limitation instead of inventing a precise number.</p>
<h2>Methodology Notes</h2>
<p>Public engagement calculations use visible public metrics and can change as YouTube changes visibility, creator settings, or API availability. They do not include private Studio metrics such as watch time, retention, impressions, click-through rate, or returning viewers.</p>
<div class="cta-inline"><h3>Check public engagement signals</h3><p>Use the Creator Dashboard to review engagement, top videos, upload patterns, and content opportunities from recent public uploads.</p><a href="/creator-dashboard" class="btn btn-primary">Open Creator Dashboard</a></div>`,
    faqs: [
      ['What is a good YouTube engagement rate?', 'It depends on niche, format, video age, and channel size. Compare against similar channels rather than using one universal benchmark.'],
      ['Is engagement rate more important than views?', 'Neither metric replaces the other. Views show reach, while engagement shows response. Strong analysis uses both.'],
      ['Can public tools calculate exact engagement?', 'They can calculate public engagement from visible likes, comments, and views, but they cannot see private engagement data inside YouTube Studio.']
    ]
  },
  {
    slug: 'youtube-monetization-requirements-2026',
    title: 'YouTube Partner Program Requirements in 2026: Everything You Need to Qualify',
    description: 'Current YouTube Partner Program eligibility explained clearly, including subscriber thresholds, valid watch hours, Shorts views, policy requirements, and review risks.',
    category: 'YouTube Monetization',
    date: '2026-05-18',
    readTime: '12 min read',
    body: `
<p>YouTube monetization is not unlocked by views alone. To earn from ads through the YouTube Partner Program, a channel must meet eligibility thresholds, follow YouTube monetization policies, link an AdSense for YouTube account, and pass review.</p>
<p>As of this update, YouTube's main ad-revenue eligibility route requires 1,000 subscribers plus either 4,000 valid public watch hours in the last 12 months or 10 million valid public Shorts views in the last 90 days. YouTube also has expanded YPP access in eligible countries for some fan-funding and Shopping features, but ad revenue still requires the higher threshold.</p>
<div class="callout"><p><strong>Important:</strong> meeting the numbers does not guarantee approval. YouTube reviews the channel as a whole for policy compliance, originality, and suitability.</p></div>
<h2>The Main YPP Eligibility Checklist</h2>
<ul><li>Follow YouTube channel monetization policies.</li><li>Live in a country or region where YPP is available.</li><li>Have no active Community Guidelines strikes.</li><li>Turn on 2-Step Verification for the Google account.</li><li>Have access to advanced features on YouTube.</li><li>Have or set up one active AdSense for YouTube account through YouTube Studio.</li><li>Reach 1,000 subscribers plus either valid long-form watch hours or valid Shorts views.</li></ul>
<h2>Valid Public Watch Hours</h2>
<p>For the long-form route, YouTube looks at valid public watch hours from public long-form videos in the last 12 months. Private videos, unlisted videos, deleted videos, ad campaigns, and Shorts Feed views do not count toward the 4,000-hour watch-hour threshold.</p>
<div class="example-box"><h3>Watch-hour calculation example</h3><p>If a 10-minute video earns 30,000 views and the average viewer watches 4 minutes, estimated watch time is 120,000 minutes. Divide by 60 and you get 2,000 watch hours. Two similar videos could put a channel near the 4,000-hour threshold, assuming the views are valid public long-form views.</p></div>
<h2>Valid Shorts Views</h2>
<p>For the Shorts route, YouTube counts valid engaged views from public Shorts that appear in the Shorts Feed. Private Shorts, unlisted Shorts, deleted Shorts, ad-campaign views, and certain non-video feed appearances do not count toward the 10 million valid Shorts views route.</p>
<h2>Policy Requirements Matter More Than Creators Expect</h2>
<p>YouTube reviewers can look at a channel's main theme, most viewed videos, newest videos, videos that represent a large share of watch time, metadata, and About section. This is especially important for channels using repetitive formats, mass-produced content, AI-generated material, compilations, reaction videos, or reused footage.</p>
<p>Originality and viewer value matter. A channel can meet the numeric threshold and still be rejected if the content appears repetitive, low effort, reused without meaningful transformation, or created mainly to capture views at scale.</p>
<h2>How Long Review Can Take</h2>
<p>YouTube says applications are reviewed by automated systems and human reviewers, and the decision commonly takes about a month, though delays can happen. If rejected, creators may be able to appeal or reapply after a waiting period depending on the situation.</p>
<h2>How to Prepare Before Applying</h2>
<ol><li>Review the last 20 to 30 uploads as if you were a human reviewer.</li><li>Remove or improve videos that look repetitive, reused, misleading, or low effort.</li><li>Make the channel About section clear and honest.</li><li>Check that titles, thumbnails, and descriptions match the actual content.</li><li>Use the <a href="/creator-dashboard">Creator Dashboard</a> to inspect recent consistency and performance patterns.</li><li>Use the <a href="/blog/youtube-engagement-rate-calculator">engagement guide</a> to identify videos that viewers respond to most.</li></ol>
<h2>Pre-Submission Content Cleanup</h2>
<p>Before applying, look for videos that could make a reviewer question the channel's originality or purpose. This includes near-duplicate uploads, slideshow-style videos with little commentary, copied clips without meaningful transformation, misleading titles, and videos that exist mainly to chase search traffic without satisfying the viewer.</p>
<p>If a video is weak but important to the channel, improve the description, add context, clarify sources, or create a stronger follow-up that demonstrates original value. If the video is off-topic and low quality, consider whether it belongs on the public channel at all. The goal is not to hide mistakes; it is to make the channel's overall value clear.</p>
<h2>What to Do If You Are Rejected</h2>
<p>A rejection is a signal to audit the channel as a whole. Read the reason carefully, review the most viewed and newest videos, and document what changed before reapplying. If the issue is originality, adding more uploads is not enough; the channel needs better substance, clearer commentary, or more original production.</p>
<h2>Methodology and Sources</h2>
<p>This guide summarizes YouTube Help documentation available on ${displayDate}. Because YouTube policies can change, creators should verify the latest requirements in YouTube Studio and YouTube Help before applying.</p>
<div class="note-box"><p><strong>Official references:</strong> YouTube Help's Partner Program overview and eligibility page, and YouTube Help's channel monetization policies page.</p></div>
<div class="cta-inline"><h3>Audit your public channel before applying</h3><p>Use Norlytics to review recent uploads, public engagement, top videos, and growth signals before you submit your channel for YPP review.</p><a href="/creator-dashboard" class="btn btn-primary">Open Creator Dashboard</a></div>`,
    faqs: [
      ['What are the main YouTube monetization requirements in 2026?', 'The main ad-revenue route requires 1,000 subscribers plus either 4,000 valid public watch hours in the last 12 months or 10 million valid public Shorts views in the last 90 days, along with policy and account requirements.'],
      ['Does meeting the threshold guarantee YPP approval?', 'No. YouTube reviews the channel as a whole and can reject channels that do not meet monetization policies.'],
      ['Do Shorts views count toward the 4,000 watch-hour requirement?', 'Shorts views from the Shorts Feed do not count toward the 4,000 public watch-hour threshold. Shorts have their own valid-view route.']
    ],
    sources: '<div class="note-box"><p>Official source links: <a href="https://support.google.com/youtube/answer/72851" target="_blank" rel="noopener">YouTube Partner Program overview and eligibility</a> and <a href="https://support.google.com/youtube/answer/1311392" target="_blank" rel="noopener">YouTube channel monetization policies</a>.</p></div>'
  },
  {
    slug: 'youtube-revenue-affiliate-memberships',
    title: 'Beyond AdSense: YouTube Affiliate Marketing and Channel Memberships in 2026',
    description: 'How creators can evaluate affiliate marketing, memberships, and AdSense together without inflated claims or unrealistic revenue promises.',
    category: 'YouTube Revenue',
    date: '2026-06-04',
    readTime: '12 min read',
    body: `
<p>AdSense is useful because it is built into YouTube, but it is rarely the whole creator business. Many channels can create more stable income by combining ads with affiliate links, memberships, products, services, sponsorships, or email-driven offers.</p>
<p>The right mix depends on trust. A channel with strong viewer intent can recommend products responsibly. A community-driven channel can make memberships valuable. A broad entertainment channel may need sponsorships or merchandise instead.</p>
<h2>Start With Viewer Intent</h2>
<p>Affiliate income works when viewers are already trying to choose, buy, compare, or implement something. A video titled "Best budget microphones for beginner YouTubers" has clearer purchase intent than a general vlog. Memberships work when viewers want continuity: direct access, community, templates, live sessions, behind-the-scenes work, or a repeatable learning path.</p>
<h2>Affiliate Revenue Example</h2>
<div class="example-box"><h3>Simple affiliate calculation</h3><p>A tutorial video gets 50,000 views. Five percent click the recommended tool link, so 2,500 people visit the product page. If 3% buy and the creator earns $12 per conversion, estimated affiliate revenue is:</p><p><strong>2,500 x 3% x $12 = $900</strong></p><p>If the same video earns $6 RPM from ads, AdSense adds roughly $300. In this scenario, affiliate income is larger, but it depends on trust, fit, conversion rate, and the offer.</p></div>
<h2>Membership Revenue Example</h2>
<p>Memberships are more predictable when the channel has a clear recurring promise. For example, a creator teaching video editing might offer monthly project files, critique sessions, and member-only livestreams.</p>
<table class="data-table"><thead><tr><th>Scenario</th><th>Estimate</th></tr></thead><tbody><tr><td>Active monthly viewers</td><td>40,000</td></tr><tr><td>Membership conversion</td><td>0.3%</td></tr><tr><td>Members</td><td>120</td></tr><tr><td>Price</td><td>$5/month</td></tr><tr><td>Gross monthly revenue</td><td>$600 before platform fees and taxes</td></tr></tbody></table>
<p>A small conversion rate can matter if the channel delivers recurring value. But memberships without a clear benefit often churn quickly.</p>
<h2>When Each Revenue Stream Fits</h2>
<ul><li><strong>AdSense:</strong> best for consistent publishing and search/discovery traffic.</li><li><strong>Affiliate links:</strong> best for reviews, tutorials, comparisons, and buying decisions.</li><li><strong>Memberships:</strong> best for education, community, accountability, and creator access.</li><li><strong>Sponsorships:</strong> best when the channel has a clear audience and reliable view floor.</li><li><strong>Products or services:</strong> best when the creator can solve a specific audience problem directly.</li></ul>
<h2>How to Avoid Low-Trust Monetization</h2>
<p>Creators damage trust when every recommendation looks like a commission grab. Disclose affiliate relationships, recommend products you can explain clearly, and separate educational content from sales-heavy content. A smaller number of relevant offers usually performs better than a page full of unrelated links.</p>
<h2>A Simple Revenue Mix Worksheet</h2>
<p>Creators can plan a healthier business by estimating each revenue stream separately. Start with a conservative monthly view estimate, multiply by a realistic RPM range, then add only revenue streams that fit the audience. A channel teaching Notion workflows might model ads, template sales, and affiliate links. A comedy channel may model ads, sponsorships, and merchandise instead.</p>
<table class="data-table"><thead><tr><th>Revenue stream</th><th>Planning question</th><th>Risk to check</th></tr></thead><tbody><tr><td>AdSense</td><td>What RPM range fits the niche and audience?</td><td>Seasonality and demonetization risk.</td></tr><tr><td>Affiliate</td><td>Is there real buying intent?</td><td>Trust loss from irrelevant recommendations.</td></tr><tr><td>Membership</td><td>What recurring value do members receive?</td><td>Churn if perks are vague.</td></tr><tr><td>Sponsorships</td><td>Can the channel deliver reliable views in a target audience?</td><td>Brand mismatch or weak disclosure.</td></tr></tbody></table>
<p>This worksheet keeps the creator from assuming that every audience can support every monetization model. The best revenue strategy usually follows existing viewer behavior rather than forcing viewers into an unrelated offer.</p>
<h2>Use Public Data Before Choosing a Revenue Strategy</h2>
<p>Use <a href="/niche-insights">Niche Insights</a> to check whether a topic has commercial intent, common keywords, and recent demand. Use the <a href="/creator-dashboard">Creator Dashboard</a> to identify which public videos already earn the strongest engagement and repeatable view patterns. Then build offers around proven viewer behavior, not creator guesswork.</p>
<h2>Methodology Notes</h2>
<p>The examples above are simple scenarios, not promises. Affiliate conversion rates, membership retention, fees, taxes, niche demand, and audience trust vary widely. Norlytics does not see private sales data or actual YouTube Studio revenue for public channels.</p>
<div class="cta-inline"><h3>Estimate the ad side first</h3><p>Use Norlytics to estimate public ad-revenue potential, then decide whether affiliate links, memberships, or sponsorships fit the audience.</p><a href="/#analyzer" class="btn btn-primary">Estimate Channel Revenue</a></div>`,
    faqs: [
      ['Can affiliate marketing earn more than AdSense?', 'Sometimes, especially in high-intent niches, but it depends on product fit, audience trust, conversion rate, and offer quality.'],
      ['Are channel memberships good for every YouTube channel?', 'No. Memberships work best when the creator offers recurring value such as community, access, templates, critique, lessons, or exclusive updates.'],
      ['Should creators rely only on AdSense?', 'Usually no. AdSense can be a baseline, but creators often build more resilient businesses by adding revenue streams that match viewer intent.']
    ]
  }
];

const newArticles = [
  {
    slug: 'youtube-rpm-vs-cpm',
    title: 'YouTube RPM vs CPM: The Creator-Friendly Difference',
    description: 'A plain-English guide to RPM, CPM, playback-based CPM, monetized views, and the calculations creators should use when estimating YouTube revenue.',
    category: 'YouTube Revenue',
    date: today,
    readTime: '10 min read',
    body: `
<p>RPM and CPM are often used interchangeably, but they answer different questions. CPM describes what advertisers pay. RPM describes what creators earn per 1,000 views after YouTube's share and after non-monetized views are included in the denominator.</p>
<p>If you are planning a channel, comparing niches, or estimating a public channel's revenue, RPM is usually the safer number. CPM can be useful for understanding advertiser demand, but it can make earnings look higher than they actually are.</p>
<h2>The Simple Definitions</h2>
<table class="data-table"><thead><tr><th>Metric</th><th>Meaning</th><th>Best use</th></tr></thead><tbody><tr><td>CPM</td><td>Advertiser cost per 1,000 ad impressions</td><td>Understanding advertiser demand</td></tr><tr><td>Playback-based CPM</td><td>Advertiser cost per 1,000 monetized playbacks</td><td>Owned-channel ad analysis</td></tr><tr><td>RPM</td><td>Creator revenue per 1,000 total views</td><td>Creator planning and public estimates</td></tr></tbody></table>
<h2>Why CPM Looks Bigger Than RPM</h2>
<p>Not every view shows an ad. Some viewers use YouTube Premium, some videos are not suitable for ads, some countries have lower ad demand, and some formats monetize differently. YouTube also keeps a share of ad revenue. RPM rolls these practical realities into a creator-side number.</p>
<div class="example-box"><h3>CPM-to-RPM example</h3><p>A video has a $12 CPM on monetized ad impressions, but only part of the total view count produced ads. After YouTube's share and non-monetized views are included, the creator's RPM might be $4 to $7 rather than $12.</p></div>
<h2>Which Number Should Creators Use?</h2>
<p>Use RPM when estimating channel revenue, comparing niches, or deciding whether a content strategy can support a business. Use CPM when studying advertiser demand or discussing media buying. If a calculator asks for CPM, remember that the creator's take-home revenue will be lower.</p>
<h2>How RPM Connects to Niche and Country</h2>
<p>A high-commercial-intent niche can produce higher RPM because advertisers compete for those viewers. Audience country can amplify or reduce the estimate. That is why the <a href="/blog/how-much-youtube-pays-per-view">YouTube pay-per-view guide</a> and the <a href="/blog/youtube-channel-country-analyzer">country analyzer guide</a> should be read together.</p>
<h2>Public Estimate Method</h2>
<ol><li>Estimate the channel's dominant niche.</li><li>Estimate likely audience geography from public signals.</li><li>Choose a conservative RPM range.</li><li>Multiply recent views by that range.</li><li>Show min, likely, and optimistic outcomes rather than one precise value.</li></ol>
<p>Norlytics uses this style of range-based estimation because public tools cannot know a creator's actual private RPM.</p>
<h2>When CPM Is Still Useful</h2>
<p>CPM is useful when you are thinking like an advertiser. A sponsor may care about how expensive it is to reach a certain audience. A media buyer may compare YouTube CPM with newsletter, podcast, or paid social CPM. A creator, however, should avoid treating advertiser CPM as personal income.</p>
<p>For example, a brand might be willing to pay a high CPM to reach U.S. finance viewers, while the creator's RPM still depends on ad fill, watch behavior, content suitability, and revenue share. Both numbers can be true at the same time because they describe different sides of the marketplace.</p>
<h2>How RPM Helps With Content Strategy</h2>
<p>RPM should not be the only reason to choose a topic, but it can reveal strategic tradeoffs. If two topics both fit your channel and one has stronger purchase intent, the higher-RPM topic may support fewer but deeper videos. If a low-RPM topic grows faster, you may need sponsorships, products, or community revenue to make the channel sustainable.</p>
<h2>RPM Questions to Ask Before Publishing</h2>
<ul><li>Will this video attract viewers who are researching, buying, learning, or just passing time?</li><li>Does the topic naturally connect to advertisers, tools, products, services, or sponsorship categories?</li><li>Will the video keep earning search traffic after the first week?</li><li>Is the audience likely concentrated in high, medium, or low advertising markets?</li><li>Could this topic support a follow-up video, affiliate resource, template, or membership benefit?</li></ul>
<p>These questions keep RPM practical. The goal is not to chase the highest-paying keyword; it is to choose topics where audience value, creator credibility, and long-term usefulness overlap.</p>
<div class="cta-inline"><h3>Estimate with RPM, not hype</h3><p>Use Norlytics to calculate realistic public-data revenue ranges for a channel, then compare the result with engagement and niche strength.</p><a href="/#analyzer" class="btn btn-primary">Use Revenue Calculator</a></div>`,
    faqs: [
      ['Is RPM better than CPM for creators?', 'RPM is usually better for creator planning because it estimates creator revenue per 1,000 total views rather than advertiser cost per ad impression.'],
      ['Why is my RPM lower than my CPM?', 'RPM includes YouTube revenue share, non-monetized views, ad availability, format differences, and other practical factors.'],
      ['Can public tools know a channel\'s real RPM?', 'No. Public tools can estimate RPM ranges, but actual RPM is private YouTube Studio data.']
    ]
  },
  {
    slug: 'youtube-channel-audit-checklist',
    title: 'YouTube Channel Audit Checklist: 30 Public Signals to Review',
    description: 'A practical checklist for auditing any public YouTube channel before changing strategy, pitching sponsors, buying a channel, or copying a competitor.',
    category: 'Channel Growth',
    date: today,
    readTime: '11 min read',
    body: `
<p>A good YouTube audit turns scattered observations into a decision. It helps creators find what to improve, helps brands shortlist partners, and helps teams avoid copying channels that look successful only because of old viral uploads.</p>
<p>This checklist uses public data only. It is designed for channels you do not own, where YouTube Studio metrics are not available.</p>
<h2>Channel Positioning Signals</h2>
<ul><li>Is the channel promise clear within 10 seconds?</li><li>Does the About page explain who the channel helps?</li><li>Are the last 10 titles focused on one audience or scattered across many?</li><li>Do thumbnails and titles set accurate expectations?</li><li>Is there a recognizable format viewers can return for?</li></ul>
<h2>Recent Performance Signals</h2>
<ul><li>Median views across the last 10 videos.</li><li>Average views across the last 10 videos.</li><li>Difference between average and median views.</li><li>Videos that outperform the median by 2x or more.</li><li>Videos that underperform the median by 50% or more.</li></ul>
<h2>Publishing Signals</h2>
<ul><li>Upload cadence across the last 90 days.</li><li>Any large gaps between uploads.</li><li>Whether strong videos cluster around certain days or formats.</li><li>Whether the channel relies on Shorts, long-form, livestreams, or a mix.</li><li>Whether the cadence is realistic for the creator's production style.</li></ul>
<h2>Engagement Signals</h2>
<ul><li>Likes per view where visible.</li><li>Comments per view.</li><li>Quality of comments: questions, feedback, spam, or arguments.</li><li>Creator replies in the first few days.</li><li>Pinned comments and calls to action.</li></ul>
<h2>Monetization Signals</h2>
<ul><li>Likely niche RPM.</li><li>Likely audience country.</li><li>Presence of affiliate links, sponsors, memberships, or products.</li><li>Whether offers match the audience problem.</li><li>Whether the channel is close to YouTube Partner Program thresholds.</li></ul>
<h2>How to Turn the Audit Into Action</h2>
<p>Do not end an audit with a long list of facts. End it with three decisions: what to keep doing, what to stop doing, and what to test next. A creator may decide to double down on one repeatable format. A sponsor may decide to request first-party analytics. A competitor researcher may decide the channel is not actually a useful benchmark.</p>
<p>The <a href="/creator-dashboard">Creator Dashboard</a> can speed up the audit by organizing recent uploads, top videos, growth velocity, and public performance signals. For topic-level research, pair it with <a href="/niche-insights">Niche Insights</a>.</p>
<h2>Example Audit Summary</h2>
<div class="example-box"><h3>Public audit conclusion</h3><p>The channel publishes weekly and has a stable median of 28,000 views across recent uploads. Three tutorial videos outperform the median by more than 2x, while news-style updates underperform. Comments show viewers asking for templates and implementation help. The next test should be a three-part tutorial series with downloadable resources, not more broad news coverage.</p></div>
<p>A summary like this is more useful than a spreadsheet alone. It connects the public evidence to a concrete content decision.</p>
<h2>Audit Frequency</h2>
<p>Fast-moving channels should run a light audit every month and a deeper audit every quarter. Slower channels can audit after every 10 uploads or before a major strategy change. Brands evaluating sponsorships should audit the most recent 90 days rather than relying on old media kits.</p>
<h2>What to Keep Out of the Audit</h2>
<p>A public audit should not pretend to know private data. Do not estimate retention from comments, do not invent click-through rate from thumbnail quality, and do not treat subscriber growth as proof of revenue. If a conclusion depends on private Studio data, label it as unknown and decide what public proxy, if any, can help.</p>
<p>This makes the final audit more trustworthy. A short list of verified public findings is more valuable than a long report filled with guesses that cannot be checked.</p>
<h2>Methodology Notes</h2>
<p>This checklist intentionally avoids private YouTube Studio metrics. It uses only public signals, so its conclusions should be treated as directional. If you own the channel, verify public findings with retention, impressions, click-through rate, traffic sources, and audience geography inside YouTube Studio.</p>
<div class="cta-inline"><h3>Run the audit faster</h3><p>Paste a public channel into the Creator Dashboard to review recent uploads, top videos, engagement, and growth signals.</p><a href="/creator-dashboard" class="btn btn-primary">Open Creator Dashboard</a></div>`,
    faqs: [
      ['How often should creators audit a YouTube channel?', 'Monthly audits work well for active channels. Slower channels can usually audit quarterly or before major content planning cycles.'],
      ['Can I audit a competitor without YouTube Studio access?', 'Yes, but only with public signals. You cannot see retention, impressions, CTR, private demographics, or actual revenue.'],
      ['What is the most important audit metric?', 'Recent median views are often the best starting point because they show current demand without being distorted as much by one viral upload.']
    ]
  },
  {
    slug: 'youtube-niche-validation-framework',
    title: 'YouTube Niche Validation Framework: Test Demand Before You Commit',
    description: 'A creator-focused framework for validating a YouTube niche with public data, pilot videos, monetization fit, and content gap analysis.',
    category: 'Channel Growth',
    date: today,
    readTime: '12 min read',
    body: `
<p>A niche can look exciting in a spreadsheet and still fail on YouTube. The audience may be too small, the competition may be too strong, the topics may run out quickly, or the creator may not be able to publish the format consistently.</p>
<p>Niche validation reduces that risk. Instead of choosing a niche because it sounds profitable, you test whether demand, competition, content supply, and monetization fit are strong enough to justify a serious channel plan.</p>
<h2>The Four Validation Questions</h2>
<ol><li><strong>Demand:</strong> are viewers already watching this type of content?</li><li><strong>Access:</strong> can newer or smaller channels still break through?</li><li><strong>Repeatability:</strong> can you list 50 credible video ideas without forcing it?</li><li><strong>Monetization:</strong> does the audience have a problem advertisers, affiliates, products, or sponsors can serve?</li></ol>
<h2>Step 1: Study Recent Demand</h2>
<p>Search the niche and collect 30 to 50 relevant recent videos. Look at views relative to channel size and video age. A niche with several recent videos outperforming channel averages may have active demand. A niche where only old authority channels rank may be harder to enter.</p>
<h2>Step 2: Separate Trend From Saturation</h2>
<p>A trend is useful when demand is rising faster than supply. Saturation appears when many creators repeat the same ideas and newer uploads struggle to earn attention. Use <a href="/niche-insights">Niche Insights</a> to review common keywords, fast-performing videos, title patterns, and competition signals.</p>
<h2>Step 3: Build a Content Gap Map</h2>
<p>Look for missing angles: beginner versions, advanced versions, comparisons, mistakes, examples, local versions, tool-specific workflows, time-saving checklists, and myth-busting videos. A niche without gaps forces you to compete only on production quality or personality.</p>
<h2>Step 4: Run Pilot Videos</h2>
<p>Before committing for a year, publish three to five pilot videos that test different angles. Compare early performance to the channel's baseline, not to giant competitors. A small channel should look for relative lift: better retention, stronger comments, faster view velocity, or clearer search intent.</p>
<div class="example-box"><h3>Pilot interpretation example</h3><p>If your normal videos get 800 views in 14 days and a pilot gets 1,900 views with useful comments, that is a signal. If three pilot videos all underperform, the niche may need a different angle or may not fit your channel.</p></div>
<h2>Step 5: Check Monetization Fit</h2>
<p>High RPM alone is not enough. Ask whether the audience has products to buy, problems to solve, sponsors that fit, and content formats that maintain trust. The <a href="/blog/youtube-rpm-vs-cpm">RPM vs CPM guide</a> explains why commercial intent matters more than a generic category label.</p>
<h2>Scoring a Niche Before You Commit</h2>
<p>Use a simple 1 to 5 score for each validation question: demand, access, repeatability, monetization, and creator fit. A niche does not need a perfect score, but it should not have a fatal weakness. A high-demand niche with no creator fit will be hard to sustain. A high-RPM niche with no access for small channels may take too long to validate.</p>
<table class="data-table"><thead><tr><th>Signal</th><th>Low score</th><th>High score</th></tr></thead><tbody><tr><td>Demand</td><td>Few recent videos earning meaningful views</td><td>Multiple recent videos outperform channel baselines</td></tr><tr><td>Access</td><td>Only giant channels rank or trend</td><td>Smaller channels can still break through</td></tr><tr><td>Repeatability</td><td>Hard to list 20 useful ideas</td><td>50+ credible ideas appear quickly</td></tr><tr><td>Monetization</td><td>No clear buyer, sponsor, or product fit</td><td>Clear advertiser or product intent</td></tr><tr><td>Creator fit</td><td>You cannot produce it consistently</td><td>You can publish with authority and energy</td></tr></tbody></table>
<p>If a niche scores low on repeatability or creator fit, be careful. The first few videos may be exciting, but the channel can become exhausting after the obvious topics are gone.</p>
<h2>When to Commit</h2>
<p>Commit when you see active demand, a realistic entry angle, repeatable topics, and a monetization path that matches viewer intent. If one of those is missing, keep researching or narrow the niche further.</p>
<h2>Methodology Notes</h2>
<p>This framework uses public YouTube data and creator-side pilot testing. It cannot guarantee channel success because execution quality, retention, thumbnails, timing, and audience fit all matter. Use it to reduce guesswork, not to predict the future exactly.</p>
<div class="cta-inline"><h3>Validate the niche before building the channel</h3><p>Use Niche Insights to review public demand, competition, fast videos, keywords, and content gaps before you commit.</p><a href="/niche-insights" class="btn btn-primary">Explore Niche Insights</a></div>`,
    faqs: [
      ['How many videos should I analyze before choosing a niche?', 'A sample of 30 to 50 recent relevant videos is a good starting point, especially if you include several channels and video ages.'],
      ['Is a high-RPM niche always the best choice?', 'No. A high-RPM niche still needs demand, entry opportunities, repeatable topics, and creator fit.'],
      ['How many pilot videos should I publish?', 'Three to five pilot videos can reveal whether the audience responds before you commit to a full channel strategy.']
    ]
  }
];

for (const article of expanded) {
  write(`blog/${article.slug}.html`, articlePage(article));
}
for (const article of newArticles) {
  write(`blog/${article.slug}.html`, articlePage(article));
}

function toolContent(kind) {
  if (kind === 'creator') {
    return `<section class="section-sm creator-page-education" aria-labelledby="creator-education-title">
    <div class="container">
      <div class="article-body">
        <div class="section-divider"></div>
        <h2 id="creator-education-title">What the Creator Dashboard Measures</h2>
        <p>The Creator Dashboard is designed for public YouTube channel audits. It reviews recent public uploads and organizes the signals creators usually check by hand: upload cadence, view distribution, top videos, engagement signals, growth velocity, and content patterns.</p>
        <p>Use it when you want to understand whether a channel is improving, stalling, relying on one breakout video, or building repeatable demand. It is useful for creators reviewing their own public footprint, agencies comparing channels, and brands shortlisting sponsorship partners.</p>
        <h3>Practical workflow</h3>
        <ol><li>Paste a public channel URL or handle.</li><li>Review recent median views before total subscribers.</li><li>Check upload consistency and top-video patterns.</li><li>Use the Ideas tab as a brainstorming layer, not as invented analytics.</li><li>Open the strongest public videos and verify the pattern manually.</li></ol>
        <h3>What this tool cannot see</h3>
        <p>Norlytics cannot access private YouTube Studio metrics such as retention, impressions, click-through rate, traffic sources, watch time by country, returning viewers, or actual AdSense revenue. The dashboard is built from public data and clearly marked assumptions.</p>
        <h3>Methodology note</h3>
        <p>The dashboard uses up to 50 recent public uploads when available. Public metrics can be delayed, hidden, rounded, or unavailable depending on YouTube and creator settings. AI-generated ideas are interpretations of the measured public signals, not private analytics.</p>
        <div class="related-grid">
          <a href="/blog/youtube-channel-audit-checklist" class="card"><div class="blog-cat">Guide</div><strong>YouTube Channel Audit Checklist</strong></a>
          <a href="/blog/compare-youtube-channels" class="card"><div class="blog-cat">Guide</div><strong>Compare YouTube Channels</strong></a>
          <a href="/blog/youtube-engagement-rate-calculator" class="card"><div class="blog-cat">Guide</div><strong>Engagement Rate Calculator</strong></a>
        </div>
      </div>
    </div>
  </section>`;
  }
  return `<section class="section-sm niche-page-education" aria-labelledby="niche-education-title">
    <div class="container">
      <div class="article-body">
        <div class="section-divider"></div>
        <h2 id="niche-education-title">How Niche Insights Helps Validate a YouTube Topic</h2>
        <p>Niche Insights analyzes a recent public-video sample for a topic so creators can judge demand before committing to a content direction. It is built for questions like: are people watching this topic now, are smaller channels breaking through, and what content gaps are visible?</p>
        <p>The tool works best when you enter a specific niche, not a broad category. "Personal finance for beginners" is more useful than "finance." "Meal prep for college students" is more useful than "cooking."</p>
        <h3>How to interpret the scores</h3>
        <p>Trend, competition, and opportunity scores should be read together. A high trend score with high competition may mean the topic is active but hard to enter. Moderate demand with low competition may be an overlooked opportunity or a weak market that needs more research.</p>
        <h3>What to do after a report</h3>
        <ol><li>Review fast-performing videos for repeatable patterns.</li><li>Look for keywords that appear often but are not fully served.</li><li>Build a list of 30 to 50 possible video ideas.</li><li>Publish a small pilot set before committing to the niche.</li><li>Use the Creator Dashboard after publishing to compare your public performance.</li></ol>
        <h3>Methodology note</h3>
        <p>Niche Insights uses recent public YouTube video data where available, including titles, publish dates, views, engagement signals, keywords, and time-window comparisons. It does not access private YouTube Studio data and does not guarantee future performance.</p>
        <div class="related-grid">
          <a href="/blog/youtube-niche-validation-framework" class="card"><div class="blog-cat">Guide</div><strong>Niche Validation Framework</strong></a>
          <a href="/blog/find-profitable-youtube-niches" class="card"><div class="blog-cat">Guide</div><strong>Find Profitable Niches</strong></a>
          <a href="/creator-dashboard" class="card"><div class="blog-cat">Tool</div><strong>Creator Dashboard</strong></a>
        </div>
      </div>
    </div>
  </section>`;
}

function ensureToolCss(file) {
  let html = read(file);
  if (!html.includes('.article-body{max-width:760px')) {
    html = html.replace('</head>', `<style>${articleCss()}</style>\n</head>`);
  }
  return html;
}

let creator = ensureToolCss('creator-dashboard/index.html')
  .replace(/\s*<section class="section-sm creator-page-education"[\s\S]*?<\/section>\s*(?=<\/main>)/g, '');
creator = creator.replace('</main>', `${toolContent('creator')}\n</main>`);
creator = creator.replace(/<title>[^<]+<\/title>/, '<title>Norlytics Creator Dashboard - Public YouTube Channel Analytics</title>');
creator = creator.replace(/<meta name="description" content="[^"]+" \/>/, '<meta name="description" content="Analyze recent public YouTube uploads with the Norlytics Creator Dashboard. Review upload consistency, top videos, public engagement, growth signals, limitations, and AI-assisted content ideas." />');
write('creator-dashboard/index.html', creator);

let niche = ensureToolCss('niche-insights/index.html')
  .replace(/\s*<section class="section-sm niche-page-education"[\s\S]*?<\/section>\s*(?=<\/main>)/g, '');
niche = niche.replace('</main>', `${toolContent('niche')}\n</main>`);
niche = niche.replace(/<title>[^<]+<\/title>/, '<title>Norlytics Niche Insights - YouTube Trend and Opportunity Research</title>');
niche = niche.replace(/<meta name="description" content="[^"]+" \/>/, '<meta name="description" content="Analyze recent public YouTube videos with Norlytics Niche Insights. Review demand, competition, opportunity, keywords, fast-performing videos, limitations, and content gaps." />');
write('niche-insights/index.html', niche);

const blogCards = [
  ['youtube-rpm-vs-cpm', 'YouTube Revenue', 'YouTube RPM vs CPM: The Creator-Friendly Difference', 'Understand the difference between advertiser CPM and creator RPM, with practical examples for revenue estimates.', 'June 29, 2026 · 10 min read'],
  ['youtube-channel-audit-checklist', 'Channel Growth', 'YouTube Channel Audit Checklist: 30 Public Signals to Review', 'A practical public-data checklist for creators, brands, and agencies auditing any YouTube channel.', 'June 29, 2026 · 11 min read'],
  ['youtube-niche-validation-framework', 'Channel Growth', 'YouTube Niche Validation Framework: Test Demand Before You Commit', 'Validate demand, competition, content gaps, pilot videos, and monetization fit before committing to a niche.', 'June 29, 2026 · 12 min read']
].map(([slug, cat, title, excerpt, meta]) => `
        <a href="/blog/${slug}" class="blog-card" data-cat="${cat}">
          <div class="blog-thumb"><div class="blog-thumb-inner"><div class="blog-thumb-bg"></div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-7"/></svg></div></div>
          <div class="blog-body">
            <div class="blog-cat">${cat}</div>
            <div class="blog-title">${title}</div>
            <div class="blog-excerpt">${excerpt}</div>
            <div class="blog-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${meta}</div>
          </div>
        </a>`).join('\n');

let blogIndex = read('blog/index.html');
for (const slug of newArticles.map(article => article.slug)) {
  blogIndex = blogIndex.replace(new RegExp(`\\s*<a href="/blog/${slug}" class="blog-card"[\\s\\S]*?<\\/a>`, 'g'), '');
}
blogIndex = blogIndex.replace('<div class="blog-grid" id="blog-grid">', `<div class="blog-grid" id="blog-grid">\n${blogCards}`);
blogIndex = blogIndex.replace(/<meta name="description" content="[^"]+" \/>/, '<meta name="description" content="Original YouTube creator guides about revenue, RPM vs CPM, monetization, channel audits, niche validation, engagement, and public-data analysis with Norlytics." />');
write('blog/index.html', blogIndex);

let home = read('index.html');
const homeLinks = `<a href="/blog/youtube-rpm-vs-cpm">RPM vs CPM</a><a href="/blog/youtube-channel-audit-checklist">Channel Audit Checklist</a><a href="/blog/youtube-niche-validation-framework">Niche Validation</a>`;
if (!home.includes('/blog/youtube-rpm-vs-cpm')) {
  home = home.replace('<a href="/blog">Blog</a>', `<a href="/blog">Blog</a>${homeLinks}`);
}
write('index.html', home);

function sitemapEntry(url, lastmod = today, priority = '0.85') {
  return `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
}

let sitemap = read('sitemap.xml');
for (const slug of newArticles.map(a => a.slug)) {
  const url = `https://norcanto.com/blog/${slug}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    sitemap = sitemap.replace('</urlset>', `${sitemapEntry(url, today, '0.86')}\n</urlset>`);
  }
}
for (const slug of newArticles.map(a => a.slug)) {
  const url = `https://norcanto.com/fr/blog/${slug}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    sitemap = sitemap.replace('</urlset>', `${sitemapEntry(url, today, '0.7')}\n</urlset>`);
  }
}
for (const article of [...expanded, ...newArticles]) {
  sitemap = sitemap.replace(new RegExp(`(<loc>https://norcanto\\.com/blog/${article.slug}</loc><lastmod>)[^<]+`, 'g'), `$1${today}`);
  sitemap = sitemap.replace(new RegExp(`(<loc>https://norcanto\\.com/fr/blog/${article.slug}</loc><lastmod>)[^<]+`, 'g'), `$1${today}`);
}
write('sitemap.xml', sitemap);

write('fr/blog/youtube-rpm-vs-cpm/index.html', frenchRpmVsCpmPage());

for (const file of [
  'fr/blog/youtube-channel-audit-checklist/index.html',
  'fr/blog/youtube-niche-validation-framework/index.html',
  'fr/blog/youtube-rpm-vs-cpm/index.html'
]) {
  if (!fs.existsSync(path.join(root, file))) continue;
  let html = read(file);
  html = html
    .replace(/"author":\{"@type":"Person","name":"Espoir chrétien"\}/g, '"author":{"@type":"Person","name":"Christian Hope"}')
    .replace(/"author":\{"@type":"Person","name":"Espoir chrÃ©tien"\}/g, '"author":{"@type":"Person","name":"Christian Hope"}')
    .replace(/Rédigé par Espoir chrétien/g, 'Rédigé par Christian Hope')
    .replace(/RÃ©digÃ© par Espoir chrÃ©tien/g, 'Rédigé par Christian Hope');
  write(file, html);
}

const report = `# Norlytics AdSense Content Upgrade Report

Audit/update date: ${displayDate}

## Articles improved

- /blog/compare-youtube-channels - expanded with a comparison framework, examples, FAQ, methodology, and Creator Dashboard links.
- /blog/how-much-youtube-pays-per-view - expanded with RPM/CPM explanations, calculation examples, Shorts context, FAQ, and revenue calculator links.
- /blog/youtube-channel-country-analyzer - expanded with public geography signals, limitations, examples, sponsor guidance, and FAQ.
- /blog/youtube-engagement-rate-calculator - expanded with formulas, examples, brand-use guidance, limitations, and FAQ.
- /blog/youtube-monetization-requirements-2026 - rewritten with current official YouTube Help requirements, review caveats, sources, and FAQ.
- /blog/youtube-revenue-affiliate-memberships - rewritten to remove inflated claims and add practical revenue examples, fit guidance, and limitations.

## New high-value articles added

- /blog/youtube-rpm-vs-cpm
- /blog/youtube-channel-audit-checklist
- /blog/youtube-niche-validation-framework

## Articles still noindexed

- /blog/ai-tools-for-youtube-creators
- /blog/grow-youtube-channel-fast
- /blog/youtube-cpm-countries
- /blog/youtube-rpm-by-niche
- /blog/youtube-shorts-monetization
- /blog/youtube-sponsorship-guide
- Corresponding /fr/blog/... pages

## Pages added to sitemap

- https://norcanto.com/blog/youtube-rpm-vs-cpm
- https://norcanto.com/blog/youtube-channel-audit-checklist
- https://norcanto.com/blog/youtube-niche-validation-framework
- https://norcanto.com/fr/blog/youtube-rpm-vs-cpm
- https://norcanto.com/fr/blog/youtube-channel-audit-checklist
- https://norcanto.com/fr/blog/youtube-niche-validation-framework

## Pages removed from sitemap

- None in this update. Previously quarantined thin articles remain excluded.

## Trust improvements made

- Added or strengthened Last updated dates, author blocks, methodology notes, and FAQ sections on retained/reworked articles.
- Added explanatory methodology and limitations content to Creator Dashboard and Niche Insights pages.
- Added official YouTube Help source links to the monetization requirements guide.
- Replaced inflated affiliate-membership language with scenario-based examples and caveats.

## Remaining low-value-content risks

- The French build was completed locally for the three new indexed articles because the external translation endpoint was unavailable in the sandbox.
- Quarantined articles should remain noindex until each receives a full rewrite or is merged into stronger guides.
- Live DNS, consent, and Search Console validation should still be checked before resubmitting.

## Recommended pages for manual indexing

- /
- /creator-dashboard
- /niche-insights
- /blog
- /blog/analyze-youtube-channel-without-studio
- /blog/find-profitable-youtube-niches
- /blog/how-much-youtube-pays-per-view
- /blog/youtube-rpm-vs-cpm
- /blog/youtube-channel-audit-checklist
- /blog/youtube-niche-validation-framework
- /blog/youtube-monetization-requirements-2026

## Recommended waiting period

Wait 10 to 14 days after deployment, sitemap recrawl, and manual indexing requests before resubmitting to AdSense. Use the time to confirm Google Search Console indexing, crawl status, canonical selection, mobile usability, and noindex behavior for quarantined articles.
`;
write('ADSENSE_CONTENT_UPGRADE_REPORT.md', report);

console.log(JSON.stringify({
  improved: expanded.length,
  added: newArticles.length,
  toolPagesImproved: 2,
  wordCounts: Object.fromEntries([...expanded, ...newArticles].map(article => [`blog/${article.slug}.html`, words(read(`blog/${article.slug}.html`))]))
}, null, 2));
