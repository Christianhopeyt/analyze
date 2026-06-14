import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const quarantinedSlugs = new Set([
  'ai-tools-for-youtube-creators',
  'grow-youtube-channel-fast',
  'youtube-cpm-countries',
  'youtube-rpm-by-niche',
  'youtube-shorts-monetization',
  'youtube-sponsorship-guide'
]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === 'node_modules' || entry.name === '.git') return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function removeImmediateGoogleScripts(html) {
  return html
    .replace(/\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-8121112277976862"\s*crossorigin="anonymous"><\/script>\s*/gi, '\n')
    .replace(/\s*<!-- Google tag \(gtag\.js\) -->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-5BCXGE5L5G"><\/script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-5BCXGE5L5G'\);\s*<\/script>\s*/gi, '\n');
}

function replaceUnsupportedClaims(html) {
  return html
    .replace(/<div class="hero-stat-num">500K\+<\/div>\s*<div class="hero-stat-label">Channels Analyzed<\/div>/g,
      '<div class="hero-stat-num">Public Data</div>\n          <div class="hero-stat-label">YouTube API Based</div>')
    .replace(/<div class="hero-stat-num">98%<\/div>\s*<div class="hero-stat-label">Estimation Accuracy<\/div>/g,
      '<div class="hero-stat-num">Estimates</div>\n          <div class="hero-stat-label">Clearly Explained</div>')
    .replace(/<div class="hero-stat-num">500k\+<\/div>\s*<div class="hero-stat-label">cha[^<]*analys[^<]*<\/div>/gi,
      '<div class="hero-stat-num">Donn\u00e9es publiques</div>\n          <div class="hero-stat-label">Bas\u00e9 sur l\u2019API YouTube</div>')
    .replace(/<div class="hero-stat-num">98%<\/div>\s*<div class="hero-stat-label">Pr[^<]*estimations<\/div>/gi,
      '<div class="hero-stat-num">Estimations</div>\n          <div class="hero-stat-label">M\u00e9thode expliqu\u00e9e</div>')
    .replace(/<div class="stat-box-num">500K\+<\/div>\s*<div class="stat-box-label">Channels Analyzed<\/div>/g,
      '<div class="stat-box-num">Public Data</div>\n            <div class="stat-box-label">YouTube API Based</div>')
    .replace(/<div class="stat-box-num">500k\+<\/div>\s*<div class="stat-box-label">cha[^<]*analys[^<]*<\/div>/gi,
      '<div class="stat-box-num">Donn\u00e9es publiques</div>\n            <div class="stat-box-label">Bas\u00e9 sur l\u2019API YouTube</div>')
    .replace(/get a full revenue breakdown in under 2 seconds/gi, 'get a public-data revenue estimate with a clear methodology')
    .replace(/obtenez une ventilation compl[^<]*en moins de 2 secondes/gi, 'obtenez une estimation des revenus fond\u00e9e sur des donn\u00e9es publiques et une m\u00e9thode transparente');
}

function addNoindex(html) {
  if (/<meta name="robots"/i.test(html)) {
    return html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, '<meta name="robots" content="noindex, follow" />');
  }
  return html.replace(/(<meta name="viewport"[^>]*>\s*)/i, '$1\n  <meta name="robots" content="noindex, follow" />\n');
}

function addTrustBlock(html, french) {
  if (/class="article-trust-note"/.test(html)) return html;
  const block = french
    ? `
      <aside class="article-trust-note" style="margin:40px 0 8px;padding:20px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-2);color:var(--text-2);line-height:1.7;">
        <p style="margin:0 0 8px;"><strong style="color:var(--text);">R\u00e9dig\u00e9 par Christian Hope</strong>, fondateur de Norcanto et cr\u00e9ateur de Norlytics.</p>
        <p style="margin:0;"><strong style="color:var(--text);">Note m\u00e9thodologique :</strong> Norlytics utilise des statistiques publiques de l\u2019API YouTube et des hypoth\u00e8ses clairement indiqu\u00e9es. Les estimations varient selon la niche, le pays, l\u2019audience, la saison et la demande des annonceurs. Elles ne remplacent pas les donn\u00e9es officielles de YouTube Studio.</p>
      </aside>
`
    : `
      <aside class="article-trust-note" style="margin:40px 0 8px;padding:20px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-2);color:var(--text-2);line-height:1.7;">
        <p style="margin:0 0 8px;"><strong style="color:var(--text);">Written by Christian Hope</strong>, founder of Norcanto and creator of Norlytics.</p>
        <p style="margin:0;"><strong style="color:var(--text);">Methodology note:</strong> Norlytics uses public YouTube API statistics and clearly stated assumptions. Estimates vary by niche, country, audience, season, and advertiser demand. They are not official YouTube Studio analytics.</p>
      </aside>
`;
  const closing = html.lastIndexOf('</article>');
  if (closing !== -1) return `${html.slice(0, closing)}${block}${html.slice(closing)}`;
  return html.replace('</main>', `${block}</main>`);
}

function updateLegalCopy(html, relative) {
  if (relative === 'privacy/index.html') {
    return html
      .replace('We use cookies to remember your theme and language preferences, cache channel analysis results for 24 hours, and serve advertising. You may opt out of non-essential cookies via our cookie consent banner.',
        'We use local storage for theme, language, consent preferences, and short-lived channel analysis caching. Google Analytics and Google AdSense scripts load only after you select Accept in the consent banner. Selecting Reject keeps those non-essential Google scripts disabled.')
      .replace('We use the YouTube Data API v3 (subject to Google\'s Privacy Policy), Google AdSense for advertising, and may use analytics services. These services have their own privacy policies which we encourage you to review.',
        'We use the YouTube Data API v3 to retrieve public channel statistics. With your consent, we also use Google Analytics to understand site usage and may use Google AdSense to serve advertising. These Google services are subject to Google\'s own terms and privacy policies.');
  }
  if (relative === 'fr/privacy/index.html') {
    return html
      .replace(/Nous utilisons des cookies[^<]*banni[^<]*\./i,
        'Nous utilisons le stockage local pour le th\u00e8me, la langue, le choix de consentement et la mise en cache temporaire des analyses. Les scripts Google Analytics et Google AdSense ne se chargent qu\u2019apr\u00e8s avoir choisi Accepter. Choisir Refuser maintient ces scripts Google non essentiels d\u00e9sactiv\u00e9s.')
      .replace(/Nous utilisons l[^<]*YouTube Data API v3[^<]*\./i,
        'Nous utilisons l\u2019API YouTube Data v3 pour r\u00e9cup\u00e9rer des statistiques publiques. Avec votre consentement, nous utilisons aussi Google Analytics et pouvons utiliser Google AdSense. Ces services Google sont soumis \u00e0 leurs propres conditions et politiques de confidentialit\u00e9.');
  }
  if (relative === 'cookies-notice/index.html') {
    return html
      .replace('<tr><td style="padding:10px 12px;">Google AdSense</td><td style="padding:10px 12px;"><span class="badge badge-red">Advertising</span></td><td style="padding:10px 12px;">Serves personalized ads</td><td style="padding:10px 12px;">Varies</td></tr>',
        '<tr style="border-bottom:1px solid var(--border-light);"><td style="padding:10px 12px;">Google Analytics</td><td style="padding:10px 12px;"><span class="badge badge-red">Analytics</span></td><td style="padding:10px 12px;">Loads only after Accept to measure site usage</td><td style="padding:10px 12px;">Varies</td></tr><tr><td style="padding:10px 12px;">Google AdSense</td><td style="padding:10px 12px;"><span class="badge badge-red">Advertising</span></td><td style="padding:10px 12px;">Loads only after Accept; advertising availability may vary</td><td style="padding:10px 12px;">Varies</td></tr>')
      .replace('You can manage or delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of this site. You can also opt out of personalized advertising via',
        'Selecting Reject in our consent banner keeps Google Analytics and Google AdSense scripts disabled. You can also clear the saved consent choice through your browser storage settings and opt out of personalized advertising via');
  }
  if (relative === 'fr/cookies-notice/index.html') {
    return html
      .replace(/<tr><td style="padding:10px 12px;">Google AdSense<\/td>[\s\S]*?<\/tr>/i,
        '<tr style="border-bottom:1px solid var(--border-light);"><td style="padding:10px 12px;">Google Analytics</td><td style="padding:10px 12px;"><span class="badge badge-red">Analyse</span></td><td style="padding:10px 12px;">Se charge uniquement apr\u00e8s Accepter pour mesurer l\u2019utilisation du site</td><td style="padding:10px 12px;">Variable</td></tr><tr><td style="padding:10px 12px;">Google AdSense</td><td style="padding:10px 12px;"><span class="badge badge-red">Publicit\u00e9</span></td><td style="padding:10px 12px;">Se charge uniquement apr\u00e8s Accepter; la disponibilit\u00e9 publicitaire peut varier</td><td style="padding:10px 12px;">Variable</td></tr>')
      .replace(/Vous pouvez g[^<]*param[^<]*navigateur\.[^<]*/i,
        'Choisir Refuser dans notre banni\u00e8re maintient Google Analytics et Google AdSense d\u00e9sactiv\u00e9s. Vous pouvez aussi effacer votre choix dans les param\u00e8tres de stockage de votre navigateur. ');
  }
  return html;
}

function removeQuarantinedDiscoveryCards(html, relative) {
  if (!['index.html', 'fr/index.html', 'blog/index.html', 'fr/blog/index.html'].includes(relative)) return html;
  for (const slug of quarantinedSlugs) {
    html = html.replace(
      new RegExp(`\\s*<a href="\\/(?:fr\\/)?blog\\/${slug}" class="blog-card[^"]*"[^>]*>[\\s\\S]*?<\\/a>`, 'g'),
      ''
    );
  }
  return html;
}

for (const file of walk(root).filter(file => file.endsWith('.html') && !file.endsWith('googlece3ace88da98e238.html'))) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  let html = fs.readFileSync(file, 'utf8');
  html = removeImmediateGoogleScripts(html);
  html = replaceUnsupportedClaims(html);
  html = updateLegalCopy(html, relative);
  html = removeQuarantinedDiscoveryCards(html, relative);

  const match = relative.match(/^(fr\/)?blog\/([^/]+)(?:\/index)?\.html$/);
  if (match) {
    const french = Boolean(match[1]);
    const slug = match[2];
    if (quarantinedSlugs.has(slug)) html = addNoindex(html);
    else if (slug !== 'index') html = addTrustBlock(html, french);
  }

  html = html.replace(/[ \t]+$/gm, '');
  fs.writeFileSync(file, html, 'utf8');
}

let sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const slug of quarantinedSlugs) {
  for (const prefix of ['/blog/', '/fr/blog/']) {
    const url = `https://norcanto.com${prefix}${slug}`;
    sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${url.replaceAll('/', '\\/')}<\\/loc>[\\s\\S]*?<\\/url>`, 'g'), '');
  }
}
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');

console.log('Applied AdSense readiness HTML and sitemap fixes.');
