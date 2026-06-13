import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicPages = [
  'index.html',
  'creator-dashboard/index.html',
  'niche-insights/index.html',
  'blog/index.html',
  'blog/ai-tools-for-youtube-creators.html',
  'blog/compare-youtube-channels.html',
  'blog/grow-youtube-channel-fast.html',
  'blog/how-much-youtube-pays-per-view.html',
  'blog/youtube-channel-country-analyzer.html',
  'blog/youtube-cpm-countries.html',
  'blog/youtube-engagement-rate-calculator.html',
  'blog/youtube-monetization-requirements-2026.html',
  'blog/youtube-revenue-affiliate-memberships.html',
  'blog/youtube-rpm-by-niche.html',
  'blog/youtube-shorts-monetization.html',
  'blog/youtube-sponsorship-guide.html',
  'about/index.html',
  'contact/index.html',
  'privacy/index.html',
  'terms/index.html',
  'cookies-notice/index.html'
];

const skipTags = new Set(['script', 'style', 'svg', 'path', 'line', 'polyline', 'polygon', 'circle', 'rect']);
const preservedTerms = ['YouTube', 'Norlytics', 'Norcanto', 'AdSense', 'Gemini', 'RPM', 'CPM', 'API', 'QuickDocs'];
const untranslatedTokens = new Set(['EN', 'FR', 'Blog', 'Contact', 'Cookies', 'FAQ', 'USD']);
const cachePath = path.join(root, '.translation-cache.json');
let cache = {};

try { cache = JSON.parse(await fs.readFile(cachePath, 'utf8')); } catch {}

function pageUrl(file, locale = 'en') {
  const clean = publicPath(file === 'index.html'
    ? ''
    : file.replace(/\/index\.html$/, '').replace(/\.html$/, ''));
  if (!clean) return `https://norcanto.com${locale === 'fr' ? '/fr' : '/'}`;
  return `https://norcanto.com${locale === 'fr' ? '/fr' : ''}/${clean}`;
}

function shouldTranslate(text) {
  const value = text.trim();
  return value.length > 1
    && /[A-Za-z]/.test(value)
    && !untranslatedTokens.has(value)
    && !/^(?:https?:|mailto:|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|[\w-]+\.(?:html|css|js|png|jpg|jpeg|webp|svg|xml))$/i.test(value);
}

function restoreProtectedText(source, translated) {
  const emails = source.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g) || [];
  const protectedValues = preservedTerms.filter(term => source.toLowerCase().includes(term.toLowerCase()));
  let restored = translated;
  protectedValues.forEach(value => {
    restored = restored.replace(new RegExp(value, 'gi'), value);
  });
  emails.forEach(value => {
    restored = restored.replace(/[\p{L}\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/u, value);
  });
  restored = restored.replace(/Norlytiques/gi, 'Norlytics');
  return restored;
}

async function translate(text) {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!shouldTranslate(compact)) return text;
  if (cache[compact]) return text.replace(compact, restoreProtectedText(compact, cache[compact]));

  const url = new URL(process.env.TRANSLATE_ENDPOINT || 'https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', 'fr');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', compact);
  let data;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`Translation request failed (${response.status})`);
      data = await response.json();
      break;
    } catch (error) {
      if (attempt === 4) throw error;
      await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
  }
  let translated = data[0].map(item => item[0]).join('');
  translated = restoreProtectedText(compact, translated);
  cache[compact] = translated;
  await fs.writeFile(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  await new Promise(resolve => setTimeout(resolve, 35));
  return text.replace(compact, translated);
}

async function translateTextNodes(html) {
  const tagStack = [];
  const parts = html.split(/(<[^>]+>)/g);
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (part.startsWith('<')) {
      const closing = part.match(/^<\/\s*([a-z0-9-]+)/i);
      const opening = part.match(/^<\s*([a-z0-9-]+)/i);
      if (closing) tagStack.pop();
      else if (opening && !/\/\s*>$/.test(part) && !/^<(meta|link|img|input|br|hr)\b/i.test(part)) tagStack.push(opening[1].toLowerCase());
      continue;
    }
    if (!skipTags.has(tagStack.at(-1)) && shouldTranslate(part)) parts[index] = await translate(part);
  }
  return parts.join('');
}

async function translateAttributes(html) {
  const pattern = /\s(placeholder|aria-label|title)="([^"]+)"/gi;
  const matches = [...html.matchAll(pattern)];
  for (const match of matches) {
    if (!shouldTranslate(match[2])) continue;
    const translated = await translate(match[2]);
    html = html.replace(match[0], ` ${match[1]}="${translated}"`);
  }
  return html;
}

function localizedInternalHref(file, href) {
  if (/^(?:https?:|mailto:|#|\/fr\/|\/api\/)/.test(href)) return href;
  const [pathname, suffix = ''] = href.split(/(?=[?#])/);
  if (!pathname || /\.(?:css|js|png|jpg|jpeg|webp|svg|ico|xml)$/i.test(pathname)) return href;
  const resolved = pathname.startsWith('/')
    ? path.posix.normalize(pathname)
    : path.posix.normalize(path.posix.join('/', path.posix.dirname(file), pathname));
  const clean = resolved
    .replace(/\/index\.html$/, '')
    .replace(/\.html$/, '');
  const collapsed = collapseRepeatedSegments(clean);
  const publicClean = publicPath(collapsed);
  return `/fr${publicClean === '/' ? '' : publicClean}${suffix}`;
}

function collapseRepeatedSegments(pathname) {
  const parts = pathname.split('/');
  const collapsed = parts.filter((part, index) => !part || part !== parts[index - 1]);
  const routeNames = new Set(['about', 'blog', 'contact', 'cookies-notice', 'creator-dashboard', 'niche-insights', 'privacy', 'terms']);
  const routeIndexes = collapsed
    .map((part, index) => routeNames.has(part) ? index : -1)
    .filter(index => index > 0);
  if (routeIndexes.length > 1) return `/${collapsed.slice(routeIndexes.at(-1)).join('/')}`;
  return collapsed.join('/') || '/';
}

function publicPath(pathname) {
  const clean = pathname.replace(/(^|\/)cookies-notice(?=\/|$)/, '$1cookies');
  return clean.length > 1 ? clean.replace(/\/$/, '') : clean;
}

function cleanPublicLinks(html, file) {
  return html.replace(/href="([^"]+)"/g, (_, href) => {
    if (/^(?:https?:|mailto:|#|\/api\/|\/fr(?:\/|$))/.test(href)) return `href="${href}"`;
    const [pathname, suffix = ''] = href.split(/(?=[?#])/);
    if (!pathname || /\.(?:css|js|png|jpg|jpeg|webp|svg|ico|xml)$/i.test(pathname)) return `href="${href}"`;
    const resolved = pathname.startsWith('/')
      ? path.posix.normalize(pathname)
      : path.posix.normalize(path.posix.join('/', path.posix.dirname(file), pathname));
    const clean = resolved === '/index.html'
      ? '/'
      : resolved.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    return `href="${publicPath(collapseRepeatedSegments(clean))}${suffix}"`;
  });
}

function cleanAbsolutePublicUrls(html) {
  return html.replace(/https:\/\/norcanto\.com(\/[^"' <]*)?/g, (_, pathname = '/') => {
    const [pathPart, suffix = ''] = pathname.split(/(?=[?#])/);
    const clean = pathPart === '/index.html'
      ? '/'
      : pathPart.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
    return `https://norcanto.com${publicPath(clean) || '/'}${suffix}`;
  });
}

function localizeLinks(html, file) {
  html = html
    .replace(/(href|src)="(?:\.\.\/)+(?=(css|js|images)\/)/g, '$1="/')
    .replace(/(href|src)="(?=(css|js|images)\/)/g, '$1="/');
  return html.replace(/href="([^"]+)"/g, (_, href) => `href="${localizedInternalHref(file, href)}"`);
}

async function translateMetadata(html) {
  const attributes = ['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description'];
  for (const attribute of attributes) {
    const pattern = attribute.includes(':')
      ? new RegExp(`(<meta property="${attribute}" content=")([^"]+)(")`, 'i')
      : new RegExp(`(<meta name="${attribute}" content=")([^"]+)(")`, 'i');
    const match = html.match(pattern);
    if (match) html = html.replace(pattern, `${match[1]}${await translate(match[2])}${match[3]}`);
  }
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const script of scripts) {
    try {
      const data = JSON.parse(script[1]);
      async function translateStructuredData(value, key = '') {
        if (Array.isArray(value)) {
          for (let index = 0; index < value.length; index += 1) {
            value[index] = await translateStructuredData(value[index], key);
          }
        } else if (value && typeof value === 'object') {
          for (const [childKey, childValue] of Object.entries(value)) {
            value[childKey] = await translateStructuredData(childValue, childKey);
          }
        } else if (typeof value === 'string' && ['headline', 'description', 'featureList', 'name', 'text'].includes(key)) {
          return translate(value);
        }
        return value;
      }
      await translateStructuredData(data);
      data.inLanguage = 'fr';
      html = html.replace(script[0], `<script type="application/ld+json">${JSON.stringify(data)}</script>`);
    } catch {
      // Keep malformed third-party structured data unchanged.
    }
  }
  return html;
}

function removeLocaleSeo(html) {
  return html
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<link rel="alternate" hreflang="[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta property="og:url"[^>]*>\s*/gi, '')
    .replace(/<meta property="og:locale(?::alternate)?"[^>]*>\s*/gi, '');
}

function withEnglishSeo(html, file) {
  const enUrl = pageUrl(file);
  const frUrl = pageUrl(file, 'fr');
  html = removeLocaleSeo(html);
  return html.replace('</head>', [
    `  <link rel="canonical" href="${enUrl}" />`,
    `  <link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `  <link rel="alternate" hreflang="fr" href="${frUrl}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
    `  <meta property="og:url" content="${enUrl}" />`,
    '  <meta property="og:locale" content="en_US" />',
    '  <meta property="og:locale:alternate" content="fr_FR" />',
    '</head>'
  ].join('\n'));
}

async function buildPage(file) {
  const sourcePath = path.join(root, file);
  let html = await fs.readFile(sourcePath, 'utf8');
  html = cleanPublicLinks(html, file);
  html = cleanAbsolutePublicUrls(html);
  html = withEnglishSeo(html, file);
  await fs.writeFile(sourcePath, html, 'utf8');
  const enUrl = pageUrl(file);
  const frUrl = pageUrl(file, 'fr');
  html = html.replace(/<html lang="en">/, '<html lang="fr">');
  html = removeLocaleSeo(html);
  html = html.replace('</head>', [
    `  <link rel="canonical" href="${frUrl}" />`,
    `  <link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `  <link rel="alternate" hreflang="fr" href="${frUrl}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
    `  <meta property="og:url" content="${frUrl}" />`,
    '  <meta property="og:locale" content="fr_FR" />',
    '  <meta property="og:locale:alternate" content="en_US" />',
    '</head>'
  ].join('\n'));
  html = localizeLinks(html, file);
  html = await translateTextNodes(html);
  html = await translateAttributes(html);
  html = await translateMetadata(html);
  const outputFile = file === 'blog/index.html'
    ? file
    : file.replace(/^blog\/(.+)\.html$/, 'blog/$1/index.html');
  const output = path.join(root, 'fr', outputFile);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, html, 'utf8');
  if (outputFile !== file) {
    await fs.rm(path.join(root, 'fr', file), { force: true });
  }
  console.log(`Generated ${path.relative(root, output)}`);
}

async function updateSitemap() {
  const sitemapPath = path.join(root, 'sitemap.xml');
  let sitemap = await fs.readFile(sitemapPath, 'utf8');
  sitemap = cleanAbsolutePublicUrls(sitemap);
  sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/norcanto\.com\/fr(?:\/[^<]*)?<\/loc>[\s\S]*?<\/url>/g, '');
  const frenchEntries = publicPages.map(file => [
    '  <url>',
    `    <loc>${pageUrl(file, 'fr')}</loc>`,
    '    <lastmod>2026-06-11</lastmod>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.7</priority>',
    '  </url>'
  ].join('\n')).join('\n');
  sitemap = sitemap.replace('</urlset>', `${frenchEntries}\n</urlset>`);
  await fs.writeFile(sitemapPath, sitemap, 'utf8');
}

for (const file of publicPages) await buildPage(file);
await fs.rm(path.join(root, 'fr', 'blog', 'index'), { recursive: true, force: true });
await updateSitemap();
await fs.writeFile(cachePath, JSON.stringify(cache, null, 2), 'utf8');
