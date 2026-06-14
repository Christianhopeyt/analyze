'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const quarantinedSlugs = [
  'ai-tools-for-youtube-creators',
  'grow-youtube-channel-fast',
  'youtube-cpm-countries',
  'youtube-rpm-by-niche',
  'youtube-shorts-monetization',
  'youtube-sponsorship-guide'
];

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git') return [];
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

test('public HTML does not load Google ads or analytics before consent', () => {
  htmlFiles(root).forEach(file => {
    if (file.endsWith('googlece3ace88da98e238.html')) return;
    const html = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /pagead2\.googlesyndication\.com|googletagmanager\.com\/gtag/, path.relative(root, file));
  });

  const app = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
  assert.match(app, /if \(this\.choice !== 'accepted'\) return;/);
  assert.match(app, /ConsentManager\.reject\(\)/);
  assert.match(app, /ConsentManager\.accept\(\)/);
});

test('unsupported trust claims are absent from public pages', () => {
  const content = htmlFiles(root)
    .filter(file => !file.endsWith('googlece3ace88da98e238.html'))
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');
  assert.doesNotMatch(content, /500K\+\s*<\/div>\s*<div class="(?:hero-stat-label|stat-box-label)">Channels Analyzed/i);
  assert.doesNotMatch(content, /98%\s*<\/div>\s*<div class="hero-stat-label">Estimation Accuracy/i);
});

test('thin duplicate articles are noindex and excluded from sitemap', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const discoveryPages = [
    fs.readFileSync(path.join(root, 'index.html'), 'utf8'),
    fs.readFileSync(path.join(root, 'blog', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(root, 'fr', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(root, 'fr', 'blog', 'index.html'), 'utf8')
  ].join('\n');
  quarantinedSlugs.forEach(slug => {
    const english = fs.readFileSync(path.join(root, 'blog', `${slug}.html`), 'utf8');
    const french = fs.readFileSync(path.join(root, 'fr', 'blog', slug, 'index.html'), 'utf8');
    assert.match(english, /<meta name="robots" content="noindex, follow"/, slug);
    assert.match(french, /<meta name="robots" content="noindex, follow"/, `fr/${slug}`);
    assert.ok(!sitemap.includes(`/blog/${slug}</loc>`), slug);
    assert.ok(!sitemap.includes(`/fr/blog/${slug}</loc>`), `fr/${slug}`);
    assert.ok(!discoveryPages.includes(`/blog/${slug}"`), `discovery/${slug}`);
    assert.ok(!discoveryPages.includes(`/fr/blog/${slug}"`), `discovery/fr/${slug}`);
  });
});

test('retained articles include author and methodology trust notes', () => {
  for (const file of fs.readdirSync(path.join(root, 'blog')).filter(name => name.endsWith('.html') && name !== 'index.html')) {
    const slug = file.replace(/\.html$/, '');
    if (quarantinedSlugs.includes(slug)) continue;
    const html = fs.readFileSync(path.join(root, 'blog', file), 'utf8');
    assert.match(html, /class="article-trust-note"/, file);
    assert.match(html, /Written by Christian Hope/, file);
    assert.match(html, /not official YouTube Studio analytics/, file);
  }
});
