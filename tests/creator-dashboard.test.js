'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { handler: dashboardHandler } = require('../netlify/functions/creator-dashboard');
const { handler: ideasHandler } = require('../netlify/functions/creator-dashboard-ai');

const root = path.resolve(__dirname, '..');

test('Creator Dashboard rejects invalid identifiers before API access', async () => {
  const response = await dashboardHandler({
    httpMethod: 'GET',
    headers: { 'x-forwarded-for': 'creator-invalid' },
    queryStringParameters: { type: 'handle', value: '!' }
  });

  assert.equal(response.statusCode, 400);
  assert.equal(JSON.parse(response.body).code, 'INVALID_CHANNEL');
});

test('Creator Dashboard keeps the YouTube API key server-side', async () => {
  const originalKey = process.env.YT_API_KEY;
  delete process.env.YT_API_KEY;

  try {
    const response = await dashboardHandler({
      httpMethod: 'GET',
      headers: { 'x-forwarded-for': 'creator-no-key' },
      queryStringParameters: { type: 'handle', value: 'norlytics' }
    });

    assert.equal(response.statusCode, 503);
    assert.equal(JSON.parse(response.body).code, 'API_NOT_CONFIGURED');
  } finally {
    if (originalKey === undefined) delete process.env.YT_API_KEY;
    else process.env.YT_API_KEY = originalKey;
  }
});

test('Creator Dashboard ideas require a valid server-cached channel report', async () => {
  const response = await ideasHandler({
    httpMethod: 'POST',
    body: JSON.stringify({ channelId: 'invalid', language: 'en' })
  });

  assert.equal(response.statusCode, 400);
  assert.equal(JSON.parse(response.body).code, 'INVALID_CHANNEL');
});

test('English and French dashboards expose only Overview, Videos, and Ideas tabs', () => {
  for (const file of [
    'index.html',
    path.join('fr', 'index.html'),
    path.join('creator-dashboard', 'index.html'),
    path.join('fr', 'creator-dashboard', 'index.html')
  ]) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(html, /id="creator-dashboard"/, file);
    assert.match(html, /creator-dashboard\.css/, file);
    assert.match(html, /creator-dashboard\.js/, file);
    assert.equal((html.match(/role="tab"/g) || []).length, 3, file);
    assert.doesNotMatch(html, /data-tab="comments"|Comments tab|Onglet commentaires/i, file);
  }
});

test('standalone Creator Dashboard pages have reciprocal clean URLs and page controller', () => {
  const english = fs.readFileSync(path.join(root, 'creator-dashboard', 'index.html'), 'utf8');
  const french = fs.readFileSync(path.join(root, 'fr', 'creator-dashboard', 'index.html'), 'utf8');

  assert.match(english, /canonical" href="https:\/\/norcanto\.com\/creator-dashboard"/);
  assert.match(french, /canonical" href="https:\/\/norcanto\.com\/fr\/creator-dashboard"/);
  assert.match(english, /creator-dashboard-page\.js/);
  assert.match(french, /creator-dashboard-page\.js/);
  assert.doesNotMatch(french, /Norlytiques/i);
});

test('Creator Dashboard does not request or analyze comment text', () => {
  const files = [
    path.join(root, 'netlify', 'functions', 'creator-dashboard.js'),
    path.join(root, 'netlify', 'functions', 'creator-dashboard-ai.js'),
    path.join(root, 'netlify', 'functions', 'lib', 'channel-analytics.js'),
    path.join(root, 'netlify', 'functions', 'lib', 'creator-gemini.js'),
    path.join(root, 'netlify', 'functions', 'lib', 'youtube.js')
  ];

  const source = files.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(source, /commentThreads|comments\.list/i);
});
