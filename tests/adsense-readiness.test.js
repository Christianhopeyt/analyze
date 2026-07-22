'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const restoredSlugs = [
  'ai-tools-for-youtube-creators',
  'grow-youtube-channel-fast',
  'youtube-cpm-countries',
  'youtube-rpm-by-niche',
  'youtube-shorts-monetization',
  'youtube-sponsorship-guide'
];

function visibleWordCount(html) {
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

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git') return [];
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

test('CookieYes loads once in every public head before controlled Google scripts', () => {
  htmlFiles(root).forEach(file => {
    if (file.endsWith('googlece3ace88da98e238.html')) return;
    const html = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file);
    assert.equal((html.match(/id="cookieyes"/g) || []).length, 1, relative);
    assert.equal((html.match(/cdn-cookieyes\.com\/client_data\/bb75bdf1ed45084387a6477e5939d0a1\/script\.js/g) || []).length, 1, relative);
    const head = html.match(/<head>[\s\S]*?<\/head>/i)?.[0] || '';
    assert.match(head, /id="cookieyes"/, relative);
    assert.ok(head.indexOf('id="cookieyes"') < head.indexOf('googletagmanager.com/gtag'), relative);
    assert.ok(head.indexOf('id="cookieyes"') < head.indexOf('pagead2.googlesyndication.com'), relative);
    assert.match(head, /type="text\/plain" data-cookieyes="analytics"/, relative);
    assert.match(head, /type="text\/plain" data-cookieyes="advertisement"/, relative);
    assert.doesNotMatch(html, /id="cookie-banner"|id="cookie-accept"|id="cookie-reject"/, relative);
  });

  const app = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
  assert.doesNotMatch(app, /ConsentManager|CookieBanner|yta-cookies/);
});

test('unsupported trust claims are absent from public pages', () => {
  const content = htmlFiles(root)
    .filter(file => !file.endsWith('googlece3ace88da98e238.html'))
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');
  assert.doesNotMatch(content, /500K\+\s*<\/div>\s*<div class="(?:hero-stat-label|stat-box-label)">Channels Analyzed/i);
  assert.doesNotMatch(content, /98%\s*<\/div>\s*<div class="hero-stat-label">Estimation Accuracy/i);
});

test('formerly thin articles are improved, indexable, and discoverable', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const discoveryPages = [
    fs.readFileSync(path.join(root, 'index.html'), 'utf8'),
    fs.readFileSync(path.join(root, 'blog', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(root, 'fr', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(root, 'fr', 'blog', 'index.html'), 'utf8')
  ].join('\n');
  restoredSlugs.forEach(slug => {
    const english = fs.readFileSync(path.join(root, 'blog', `${slug}.html`), 'utf8');
    const french = fs.readFileSync(path.join(root, 'fr', 'blog', slug, 'index.html'), 'utf8');
    assert.doesNotMatch(english, /noindex,\s*follow/i, slug);
    assert.doesNotMatch(french, /noindex,\s*follow/i, `fr/${slug}`);
    assert.ok(sitemap.includes(`/blog/${slug}</loc>`), slug);
    assert.ok(sitemap.includes(`/fr/blog/${slug}</loc>`), `fr/${slug}`);
    assert.ok(discoveryPages.includes(`/blog/${slug}"`), `discovery/${slug}`);
    assert.ok(discoveryPages.includes(`/fr/blog/${slug}"`), `discovery/fr/${slug}`);
    assert.ok(visibleWordCount(english) >= 1000, `english depth/${slug}`);
    assert.ok(visibleWordCount(french) >= 500, `french depth/${slug}`);
    assert.match(english, /class="article-trust-note"/, slug);
    assert.match(english, /Sources and Methodology/, slug);
    assert.match(english, /FAQPage/, slug);
  });
});

test('retained articles include author and methodology trust notes', () => {
  for (const file of fs.readdirSync(path.join(root, 'blog')).filter(name => name.endsWith('.html') && name !== 'index.html')) {
    const slug = file.replace(/\.html$/, '');
    const html = fs.readFileSync(path.join(root, 'blog', file), 'utf8');
    assert.match(html, /class="article-trust-note"/, file);
    assert.match(html, /Written by Christian Hope/, file);
    assert.match(html, /not official YouTube Studio analytics/, file);
  }
});
