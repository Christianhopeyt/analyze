'use strict';

const crypto = require('node:crypto');
const { getCached, setCached } = require('./lib/cache');
const { generateCreatorIdeas } = require('./lib/creator-gemini');

function json(statusCode, body) {
  return { statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify(body) };
}

function finite(value, fallback = null) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function text(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeMetrics(input) {
  if (!input || typeof input !== 'object' || !input.channel || !input.dashboard) return null;
  const sampledAt = text(input.dashboard.sampledAt, 40);
  if (!Number.isFinite(new Date(sampledAt).getTime())) return null;
  const topVideos = Array.isArray(input.dashboard.topVideos) ? input.dashboard.topVideos.slice(0, 6).map(video => ({
    title: text(video?.title, 180),
    views: finite(video?.views, 0),
    viewsPerDay: finite(video?.viewsPerDay, 0),
    engagementRate: finite(video?.engagementRate),
    publishedAt: text(video?.publishedAt, 40)
  })).filter(video => video.title) : [];
  const commonKeywords = Array.isArray(input.dashboard.commonKeywords)
    ? input.dashboard.commonKeywords.slice(0, 12).map(item => ({ keyword: text(item?.keyword, 60), count: finite(item?.count, 0) })).filter(item => item.keyword)
    : [];
  return {
    channel: {
      id: text(input.channel.id, 80),
      title: text(input.channel.title, 150),
      description: text(input.channel.description, 1000)
    },
    dashboard: {
      sampledAt,
      sampleSize: finite(input.dashboard.sampleSize, 0),
      score: input.dashboard.score && typeof input.dashboard.score === 'object' ? input.dashboard.score : {},
      uploadPattern: input.dashboard.uploadPattern && typeof input.dashboard.uploadPattern === 'object' ? input.dashboard.uploadPattern : {},
      performance: input.dashboard.performance && typeof input.dashboard.performance === 'object' ? input.dashboard.performance : {},
      commonKeywords,
      topVideos
    }
  };
}

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return json(405, { code: 'METHOD_NOT_ALLOWED', error: 'Method not allowed.' });
  if (Buffer.byteLength(event.body || '', 'utf8') > 64 * 1024) return json(413, { code: 'REQUEST_TOO_LARGE', error: 'Request body is too large.' });
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (_) { return json(400, { code: 'INVALID_JSON', error: 'Request body must be valid JSON.' }); }
  const channelId = String(body.channelId || '');
  const language = body.language === 'fr' ? 'fr' : 'en';
  if (!/^UC[\w-]{20,}$/.test(channelId)) return json(400, { code: 'INVALID_CHANNEL', error: 'Invalid channel ID.' });
  const metrics = normalizeMetrics(body.metrics);
  if (!metrics || metrics.channel.id !== channelId) return json(400, { code: 'INVALID_METRICS', error: 'Valid Creator Dashboard public metrics are required.' });
  if (!process.env.GEMINI_API_KEY) return json(503, { code: 'AI_NOT_CONFIGURED', error: 'AI suggestions are not configured.' });
  const cachedReport = await getCached(`creator:report:${channelId}:v1`, true);
  if (!cachedReport) return json(404, { code: 'REPORT_NOT_FOUND', error: 'Analyze the channel before requesting ideas.' });
  const cachedMetrics = normalizeMetrics({ channel: cachedReport.value.channel, dashboard: cachedReport.value.dashboard });
  if (!cachedMetrics || JSON.stringify(metrics) !== JSON.stringify(cachedMetrics)) {
    return json(409, { code: 'METRICS_MISMATCH', error: 'Refresh the Creator Dashboard before requesting ideas.' });
  }
  const snapshot = crypto.createHash('sha256').update(cachedReport.value.dashboard.sampledAt).digest('hex').slice(0, 16);
  const aiKey = `creator:ai:${channelId}:${snapshot}:${language}`;
  const cachedAi = await getCached(aiKey);
  if (cachedAi) return json(200, { suggestions: cachedAi.value, source: 'Gemini AI-generated', cached: true });
  try {
    const suggestions = await generateCreatorIdeas({
      metrics,
      language,
      apiKey: process.env.GEMINI_API_KEY
    });
    await setCached(aiKey, suggestions, 24 * 60 * 60 * 1000);
    return json(200, { suggestions, source: 'Gemini AI-generated', cached: false });
  } catch (_) {
    return json(502, { code: 'AI_UNAVAILABLE', error: 'AI suggestions are temporarily unavailable. Public analytics remain valid.' });
  }
};
