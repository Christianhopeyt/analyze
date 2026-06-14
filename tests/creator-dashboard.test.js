'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { handler: dashboardHandler } = require('../netlify/functions/creator-dashboard');
const { handler: ideasHandler } = require('../netlify/functions/creator-dashboard-ai');
const { setCached } = require('../netlify/functions/lib/cache');

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

test('Creator Dashboard AI route accepts POST only and requires public metrics', async () => {
  const getResponse = await ideasHandler({ httpMethod: 'GET' });
  assert.equal(getResponse.statusCode, 405);

  const response = await ideasHandler({
    httpMethod: 'POST',
    body: JSON.stringify({ channelId: 'UC12345678901234567890', language: 'en' })
  });
  assert.equal(response.statusCode, 400);
  assert.equal(JSON.parse(response.body).code, 'INVALID_METRICS');
});

test('Creator Dashboard AI route generates ideas from verified public metrics', async () => {
  const channelId = 'UCcreatorideas1234567890';
  const sampledAt = '2026-06-14T12:34:56.000Z';
  const metrics = {
    channel: { id: channelId, title: 'Example Creator', description: 'Public channel description' },
    dashboard: {
      sampledAt,
      sampleSize: 12,
      score: { score: 72, confidence: 'low', factors: { engagement: 70 } },
      uploadPattern: { uploadsPerWeek: 1.5, bestUploadDay: 2, bestUploadHourUtc: 16 },
      performance: { averageViewsPerVideo: 12000, growthPercent: 14, direction: 'growth' },
      commonKeywords: [{ keyword: 'tutorial', count: 5 }],
      topVideos: [{ title: 'Public video', views: 20000, viewsPerDay: 1000, engagementRate: 4.2, publishedAt: '2026-06-10T00:00:00.000Z' }]
    }
  };
  await setCached(`creator:report:${channelId}:v1`, metrics, 60_000);

  const originalKey = process.env.GEMINI_API_KEY;
  const originalModel = process.env.GEMINI_MODEL;
  const originalFetch = global.fetch;
  process.env.GEMINI_API_KEY = 'server-only-test-key';
  delete process.env.GEMINI_MODEL;
  global.fetch = async url => {
    assert.match(String(url), /models\/gemini-2\.5-flash:generateContent/);
    assert.match(String(url), /key=server-only-test-key/);
    return {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: JSON.stringify({
          summary: 'Summary',
          recommendations: ['Recommendation'],
          videoIdeas: ['Video idea'],
          titleIdeas: ['Title idea'],
          topicAngles: ['Angle'],
          tags: ['tag']
        }) }] } }]
      })
    };
  };

  try {
    const response = await ideasHandler({
      httpMethod: 'POST',
      body: JSON.stringify({ channelId, language: 'en', metrics })
    });
    assert.equal(response.statusCode, 200);
    assert.equal(JSON.parse(response.body).suggestions.summary, 'Summary');
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = originalModel;
  }
});

test('Creator Dashboard frontend sends metrics and shows one localized AI fallback', () => {
  const source = fs.readFileSync(path.join(root, 'js', 'creator-dashboard.js'), 'utf8');
  assert.match(source, /fetch\('\/api\/creator-dashboard-ai'/);
  assert.match(source, /metrics:this\.ideasMetrics\(this\.report\)/);
  assert.match(source, /if \(this\.ideasErrorKey === requestKey\) return;/);
  assert.match(source, /this\.text\('ai_error'\)/);
  assert.equal((source.match(/this\.text\('ai_error'\)/g) || []).length, 1);
});

test('English and French dashboards expose only Overview, Videos, and Ideas tabs', () => {
  for (const file of [
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

test('homepage channel analysis does not embed or load Creator Dashboard', () => {
  for (const file of ['index.html', path.join('fr', 'index.html')]) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(html, /id="creator-dashboard"|creator-dashboard\.js|creator-dashboard\.css/, file);
    assert.match(html, /class="creator-dashboard-cta"/, file);
  }

  const app = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
  assert.doesNotMatch(app, /CreatorDashboard\?\.(?:load|accept)|fetch\(`\/api\/creator-dashboard\?/);
  assert.match(app, /fetch\(`\/api\/channel-analyzer\?/);
});

test('AI fallback is dedicated-page-only and single-shot per report', () => {
  const source = fs.readFileSync(path.join(root, 'js', 'creator-dashboard.js'), 'utf8');
  assert.match(source, /isDedicatedPage\(\)/);
  assert.match(source, /ideasStatus === 'idle'/);
  assert.match(source, /this\.ideasStatus = 'error'/);
  assert.match(source, /AI ideas are temporarily unavailable\. Public statistics are still valid\./);
  assert.match(source, /Les idées IA sont temporairement indisponibles\. Les statistiques publiques restent valides\./);
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
