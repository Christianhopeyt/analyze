'use strict';

const { analyzeChannel } = require('./lib/channel-analytics');
const { fetchChannelDashboardSource } = require('./lib/youtube');
const { getCached, setCached } = require('./lib/cache');

const TTL = 8 * 60 * 60 * 1000;
const STALE_TTL = 48 * 60 * 60 * 1000;
const rateLimits = new Map();

function json(statusCode, body) {
  return { statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify(body) };
}

function withinRateLimit(event) {
  const ip = String(event.headers?.['x-forwarded-for'] || event.headers?.['client-ip'] || 'unknown').split(',')[0].trim();
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
  if (event.httpMethod !== 'GET') return json(405, { code: 'METHOD_NOT_ALLOWED', error: 'Method not allowed.' });
  if (!withinRateLimit(event)) return json(429, { code: 'RATE_LIMIT', error: 'Hourly Creator Dashboard limit reached.' });
  const type = event.queryStringParameters?.type === 'id' ? 'id' : 'handle';
  const value = String(event.queryStringParameters?.value || '').trim();
  if (!/^[\w.-]{3,100}$/.test(value)) return json(400, { code: 'INVALID_CHANNEL', error: 'Invalid channel identifier.' });
  const apiKey = process.env.YT_API_KEY;
  if (!apiKey) return json(503, { code: 'API_NOT_CONFIGURED', error: 'YouTube API is not configured.' });
  const inputKey = `creator:input:${type}:${value.toLowerCase()}:v1`;
  let cached = await getCached(inputKey);
  if (cached) return json(200, { ...cached.value, source: { ...cached.value.source, youtubeCached: true } });
  try {
    const source = await fetchChannelDashboardSource({ type, value, apiKey });
    if (!source) return json(404, { code: 'CHANNEL_NOT_FOUND', error: 'Channel not found.' });
    const dashboard = analyzeChannel(source.videos, source.channel);
    const report = {
      channel: source.channel,
      dashboard,
      source: { analytics: 'YouTube Data API public data', youtubeCached: false, stale: false },
      limitations: ['public_only', 'sample', 'utc', 'missing_fields']
    };
    await Promise.all([
      setCached(inputKey, report, TTL),
      setCached(`creator:report:${source.channel.id}:v1`, report, TTL)
    ]);
    return json(200, report);
  } catch (error) {
    cached = await getCached(inputKey, true);
    if (cached && Date.now() - new Date(cached.value.dashboard.sampledAt).getTime() <= STALE_TTL) {
      return json(200, { ...cached.value, source: { ...cached.value.source, youtubeCached: true, stale: true } });
    }
    return json(error.status === 403 ? 429 : 502, { code: 'YOUTUBE_UNAVAILABLE', error: 'YouTube public data is temporarily unavailable.' });
  }
};
