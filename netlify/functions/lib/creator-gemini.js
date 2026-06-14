'use strict';

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    recommendations: { type: 'ARRAY', items: { type: 'STRING' } },
    videoIdeas: { type: 'ARRAY', items: { type: 'STRING' } },
    titleIdeas: { type: 'ARRAY', items: { type: 'STRING' } },
    topicAngles: { type: 'ARRAY', items: { type: 'STRING' } },
    tags: { type: 'ARRAY', items: { type: 'STRING' } }
  },
  required: ['summary', 'recommendations', 'videoIdeas', 'titleIdeas', 'topicAngles', 'tags']
};

async function generateCreatorIdeas({ metrics, language, apiKey }) {
  if (!apiKey) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const evidence = {
    responseLanguage: language === 'fr' ? 'French' : 'English',
    channel: { title: metrics.channel.title, description: metrics.channel.description },
    verifiedPublicAnalytics: {
      sampleSize: metrics.dashboard.sampleSize,
      score: metrics.dashboard.score,
      uploadPattern: metrics.dashboard.uploadPattern,
      performance: metrics.dashboard.performance,
      commonKeywords: metrics.dashboard.commonKeywords,
      topVideos: metrics.dashboard.topVideos.slice(0, 6).map(video => ({
        title: video.title,
        views: video.views,
        viewsPerDay: video.viewsPerDay,
        engagementRate: video.engagementRate,
        publishedAt: video.publishedAt
      }))
    }
  };
  const prompt = [
    'You are interpreting a Creator Dashboard built only from public YouTube Data API fields.',
    'Never invent analytics, private YouTube Studio data, audience demographics, search volume, revenue, or comment sentiment.',
    'Recommendations must be grounded in the supplied evidence. Treat upload times as UTC.',
    'Generate one short summary, 5 concise recommendations, 6 video ideas, 8 title ideas, 5 topic angles, and 12 tags.',
    `Return all text in ${language === 'fr' ? 'French' : 'English'}.`,
    JSON.stringify(evidence)
  ].join('\n');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.72, responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA }
      })
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Gemini request failed (${response.status})`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no Creator Dashboard ideas.');
  return JSON.parse(text);
}

module.exports = { generateCreatorIdeas };
