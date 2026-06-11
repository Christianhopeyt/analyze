'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

function localFileForUrl(url) {
  const pathname = url.split(/[?#]/, 1)[0];
  if (!pathname.startsWith('/fr/')) return null;
  const relative = pathname.replace(/^\/fr\/cookies$/, '/fr/cookies-notice/').replace(/^\//, '');
  return path.join(root, relative.endsWith('/') ? relative + 'index.html' : relative);
}

test('French pages have reciprocal SEO metadata and valid internal routes', () => {
  const files = htmlFiles(path.join(root, 'fr'));
  assert.equal(files.length, 20);

  files.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file);
    assert.match(html, /<html lang="fr">/, relative);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, relative);
    assert.equal((html.match(/hreflang=/g) || []).length, 3, relative);
    assert.equal((html.match(/property="og:url"/g) || []).length, 1, relative);
    assert.doesNotMatch(html, /href="[^"]*(?:index\.html|\.html(?:[?#"]|$))/, relative);
    assert.doesNotMatch(html, /https:\/\/norcanto\.com[^"< ]*(?:index\.html|\.html)/, relative);

    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const target = localFileForUrl(match[1]);
      if (target) assert.ok(fs.existsSync(target), `${relative} links to missing ${match[1]}`);
    }
  });
});

test('English public pages expose clean links and SEO URLs', () => {
  [
    path.join(root, 'index.html'),
    ...['about', 'blog', 'contact', 'cookies-notice', 'niche-insights', 'privacy', 'terms']
      .flatMap(directory => htmlFiles(path.join(root, directory)))
  ]
    .forEach(file => {
      const html = fs.readFileSync(file, 'utf8');
      const relative = path.relative(root, file);
      assert.doesNotMatch(html, /href="[^"]*(?:index\.html|\.html(?:[?#"]|$))/, relative);
      assert.doesNotMatch(html, /https:\/\/norcanto\.com[^"< ]*(?:index\.html|\.html)/, relative);
    });
});

test('sitemap includes every French canonical URL', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /\.html|index\.html/);
  htmlFiles(path.join(root, 'fr')).forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canonical, path.relative(root, file));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), canonical);
  });
});

test('Netlify preserves legacy URLs with forced clean redirects', () => {
  const redirects = fs.readFileSync(path.join(root, '_redirects'), 'utf8');
  [
    '/index.html  /  301!',
    '/blog/index.html  /blog  301!',
    '/niche-insights/index.html  /niche-insights  301!',
    '/blog/:slug.html  /blog/:slug  301!',
    '/fr/blog/:slug.html  /fr/blog/:slug  301!',
    '/cookies-notice/index.html  /cookies  301!'
  ].forEach(rule => assert.ok(redirects.includes(rule), rule));
});
