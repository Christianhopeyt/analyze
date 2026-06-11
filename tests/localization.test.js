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
  const relative = pathname.replace(/^\//, '');
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

    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const target = localFileForUrl(match[1]);
      if (target) assert.ok(fs.existsSync(target), `${relative} links to missing ${match[1]}`);
    }
  });
});

test('sitemap includes every French canonical URL', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  htmlFiles(path.join(root, 'fr')).forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canonical, path.relative(root, file));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), canonical);
  });
});
