'use strict';

const crypto = require('node:crypto');
const { analyzeNiche } = require('./lib/niche-analytics');
const { fetchRecentNicheVideos } = require('./lib/youtube');
const { generateSuggestions } = require('./lib/gemini');
const { getCached, setCached } = require('./lib/cache');

const ANALYTICS_TTL = 8 * 60 * 60 * 1000;
const STALE_TTL = 48 * 60 * 60 * 1000;
const MAX_QUERY_LENGTH = 100;
const allowedRegions = new Set(['US','GB','CA','AU','FR','DE','ES','BR','IN','MX','JP','KR','NL','SE','NO']);
const rateLimits = new Map();

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

function normalizeInput(body) {
  const query = String(body.query || '').trim().replace(/\s+/g, ' ');
  if (query.length < 2 || query.length > MAX_QUERY_LENGTH) {
    const error = new Error('Query must contain between 2 and 100 characters.');
    error.status = 400;
    throw error;
  }
  const region = allowedRegions.has(String(body.region || '').toUpperCase())
    ? String(body.region).toUpperCase()
    : 'US';
  const language = String(body.language || '').toLowerCase() === 'fr' ? 'fr' : 'en';
  return { query, region, language, includeAiSuggestions: body.includeAiSuggestions !== false };
}

function cacheKey(prefix, input) {
  const raw = JSON.stringify({ v: 1, q: input.query.toLowerCase(), r: input.region, l: input.language });
  return `${prefix}:${crypto.createHash('sha256').update(raw).digest('hex')}`;
}

function withinRateLimit(event) {
  const forwarded = event.headers?.['x-forwarded-for'] || event.headers?.['client-ip'] || 'unknown';
  const ip = forwarded.split(',')[0].trim();
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count += 1;
  return true;
}

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {}, { 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' });
  }
  if (event.httpMethod !== 'POST') return json(405, { code: 'METHOD_NOT_ALLOWED', error: 'Method not allowed.' });
  if (!withinRateLimit(event)) return json(429, { code: 'RATE_LIMIT', error: 'Hourly niche-analysis limit reached. Try again later.' });

  let input;
  try {
    input = normalizeInput(JSON.parse(event.body || '{}'));
  } catch (error) {
    return json(error.status || 400, { code: 'INVALID_QUERY', error: error.message || 'Invalid request.' });
  }

  const youtubeKey = process.env.YT_API_KEY;
  if (!youtubeKey) return json(503, { code: 'API_NOT_CONFIGURED', error: 'YouTube API is not configured. No analytics were generated.' });

  const analyticsKey = cacheKey('analytics', input);
  const aiKey = cacheKey('ai', input);
  let cached = await getCached(analyticsKey);
  let analyticsPayload;
  let youtubeCached = Boolean(cached);
  let stale = false;

  try {
    if (cached) {
      analyticsPayload = cached.value;
    } else {
      const source = await fetchRecentNicheVideos({ ...input, apiKey: youtubeKey });
      const analytics = analyzeNiche(source.videos, input.query);
      analyticsPayload = {
        query: input.query,
        region: input.region,
        language: input.language,
        sampledAt: new Date().toISOString(),
        approximateTotalResults: source.approximateTotalResults,
        analytics
      };
      await setCached(analyticsKey, analyticsPayload, ANALYTICS_TTL);
    }
  } catch (error) {
    cached = await getCached(analyticsKey, true);
    if (!cached || Date.now() - new Date(cached.value.sampledAt).getTime() > STALE_TTL) {
      return json(error.status === 403 ? 429 : 502, {
        code: 'YOUTUBE_UNAVAILABLE',
        error: 'YouTube public data is temporarily unavailable. No analytics were generated.'
      });
    }
    analyticsPayload = cached.value;
    youtubeCached = true;
    stale = true;
  }

  let aiSuggestions = null;
  let aiError = null;
  let aiCached = false;
  if (input.includeAiSuggestions && analyticsPayload.analytics.sampleSize > 0) {
    const cachedAi = await getCached(aiKey);
    if (cachedAi) {
      aiSuggestions = cachedAi.value;
      aiCached = true;
    } else {
      try {
        aiSuggestions = await generateSuggestions({
          query: input.query,
          analytics: analyticsPayload.analytics,
          language: input.language,
          apiKey: process.env.GEMINI_API_KEY
        });
        if (aiSuggestions) await setCached(aiKey, aiSuggestions, 24 * 60 * 60 * 1000);
      } catch (_) {
        aiError = 'AI suggestions are temporarily unavailable. Public YouTube analytics are still valid.';
      }
    }
  }

  return json(200, {
    ...analyticsPayload,
    source: {
      analytics: 'YouTube Data API public data',
      suggestions: aiSuggestions ? 'Gemini AI-generated' : null,
      youtubeCached,
      aiCached,
      stale
    },
    aiSuggestions,
    aiError,
    limitations: ['sample','directional','frequency','unavailable']
  });
};
