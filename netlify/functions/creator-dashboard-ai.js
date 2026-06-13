'use strict';

const crypto = require('node:crypto');
const { getCached, setCached } = require('./lib/cache');
const { generateCreatorIdeas } = require('./lib/creator-gemini');

function json(statusCode, body) {
  return { statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify(body) };
}

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return json(405, { code: 'METHOD_NOT_ALLOWED', error: 'Method not allowed.' });
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (_) { return json(400, { code: 'INVALID_REQUEST', error: 'Invalid request.' }); }
  const channelId = String(body.channelId || '');
  const language = body.language === 'fr' ? 'fr' : 'en';
  if (!/^UC[\w-]{20,}$/.test(channelId)) return json(400, { code: 'INVALID_CHANNEL', error: 'Invalid channel ID.' });
  const cachedReport = await getCached(`creator:report:${channelId}:v1`, true);
  if (!cachedReport) return json(404, { code: 'REPORT_NOT_FOUND', error: 'Analyze the channel before requesting ideas.' });
  const snapshot = crypto.createHash('sha256').update(cachedReport.value.dashboard.sampledAt).digest('hex').slice(0, 16);
  const aiKey = `creator:ai:${channelId}:${snapshot}:${language}`;
  const cachedAi = await getCached(aiKey);
  if (cachedAi) return json(200, { suggestions: cachedAi.value, source: 'Gemini AI-generated', cached: true });
  try {
    const suggestions = await generateCreatorIdeas({
      report: cachedReport.value,
      language,
      apiKey: process.env.GEMINI_API_KEY
    });
    if (!suggestions) return json(503, { code: 'AI_NOT_CONFIGURED', error: 'AI suggestions are not configured.' });
    await setCached(aiKey, suggestions, 24 * 60 * 60 * 1000);
    return json(200, { suggestions, source: 'Gemini AI-generated', cached: false });
  } catch (_) {
    return json(502, { code: 'AI_UNAVAILABLE', error: 'AI suggestions are temporarily unavailable. Public analytics remain valid.' });
  }
};
