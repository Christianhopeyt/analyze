'use strict';

const { getCached, setCached } = require('./lib/cache');

const API_BASE = 'https://www.googleapis.com/youtube/v3';
const CACHE_TTL = 24 * 60 * 60 * 1000;
const rateLimits = new Map();

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    body: JSON.stringify(body)
  };
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
  if (entry.count >= 20) return false;
  entry.count += 1;
  return true;
}

async function youtubeRequest(path, params, apiKey) {
  const url = new URL(`${API_BASE}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.error) {
    const error = new Error(data.error?.message || `YouTube API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

async function resolveChannelId(type, value, apiKey) {
  if (type === 'id') return value;

  const byHandle = await youtubeRequest('channels', { part: 'id', forHandle: value }, apiKey);
  if (byHandle.items?.[0]?.id) return byHandle.items[0].id;

  const search = await youtubeRequest('search', {
    part: 'snippet',
    type: 'channel',
    q: value,
    maxResults: '1'
  }, apiKey);
  return search.items?.[0]?.snippet?.channelId || null;
}

exports.handler = async event => {
  if (event.httpMethod !== 'GET') return json(405, { code: 'METHOD_NOT_ALLOWED', error: 'Method not allowed.' });
  if (!withinRateLimit(event)) return json(429, { code: 'RATE_LIMIT', error: 'Hourly channel-analysis limit reached.' });

  const type = event.queryStringParameters?.type === 'id' ? 'id' : 'handle';
  const value = String(event.queryStringParameters?.value || '').trim();
  if (!/^[\w.-]{3,100}$/.test(value)) return json(400, { code: 'INVALID_CHANNEL', error: 'Invalid channel identifier.' });

  const apiKey = process.env.YT_API_KEY;
  if (!apiKey) return json(503, { code: 'API_NOT_CONFIGURED', error: 'YouTube API is not configured.' });

  const cacheKey = `channel:${type}:${value.toLowerCase()}`;
  const cached = await getCached(cacheKey);
  if (cached) return json(200, { ...cached.value, cached: true });

  try {
    const channelId = await resolveChannelId(type, value, apiKey);
    if (!channelId) return json(404, { code: 'CHANNEL_NOT_FOUND', error: 'Channel not found.' });

    const data = await youtubeRequest('channels', {
      part: 'snippet,statistics,brandingSettings',
      id: channelId
    }, apiKey);
    const channel = data.items?.[0];
    if (!channel) return json(404, { code: 'CHANNEL_NOT_FOUND', error: 'Channel not found.' });

    const hiddenSubscriberCount = Boolean(channel.statistics?.hiddenSubscriberCount);
    const result = {
      id: channel.id,
      title: channel.snippet?.title || '',
      handle: channel.snippet?.customUrl || '',
      description: channel.snippet?.description || '',
      publishedAt: channel.snippet?.publishedAt,
      country: channel.snippet?.country || null,
      avatar: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url || null,
      banner: channel.brandingSettings?.image?.bannerExternalUrl || null,
      subscriberCount: hiddenSubscriberCount ? null : Number(channel.statistics?.subscriberCount) || 0,
      hiddenSubscriberCount,
      viewCount: channel.statistics?.viewCount || 0,
      videoCount: channel.statistics?.videoCount || 0
    };
    await setCached(cacheKey, result, CACHE_TTL);
    return json(200, result);
  } catch (error) {
    return json(error.status === 403 ? 429 : 502, {
      code: 'YOUTUBE_UNAVAILABLE',
      error: 'YouTube public data is temporarily unavailable.'
    });
  }
};
