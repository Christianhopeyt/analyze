'use strict';

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    titleIdeas: { type: 'ARRAY', items: { type: 'STRING' } },
    tagSuggestions: { type: 'ARRAY', items: { type: 'STRING' } },
    videoAngles: { type: 'ARRAY', items: { type: 'STRING' } }
  },
  required: ['summary', 'titleIdeas', 'tagSuggestions', 'videoAngles']
};

function generationEvidence(query, analytics, language) {
  return {
    query,
    responseLanguage: language === 'fr' ? 'French' : 'English',
    publicYouTubeAnalytics: {
      sampleSize: analytics.sampleSize,
      confidence: analytics.confidence,
      scores: analytics.scores,
      windows: analytics.windows,
      commonKeywords: analytics.commonKeywords,
      titlePatterns: analytics.titlePatterns,
      fastPerformingTitles: analytics.fastPerformers.slice(0, 6).map(video => video.title)
    }
  };
}

async function generateSuggestions({ query, analytics, language, apiKey }) {
  if (!apiKey) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const prompt = [
    'You are generating creative YouTube strategy suggestions from an analytics report.',
    'Never invent, alter, estimate, or restate analytics numbers beyond the supplied evidence.',
    'Do not claim Google Trends, search volume, revenue, or private channel data.',
    'Generate one short niche summary, 8 distinct title ideas, 12 concise tags, and 6 useful video angles.',
    `Return all creative text in ${language === 'fr' ? 'French' : 'English'}.`,
    JSON.stringify(generationEvidence(query, analytics, language))
  ].join('\n');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA
        }
      })
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Gemini request failed (${response.status})`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no suggestions');
  return JSON.parse(text);
}

module.exports = { generateSuggestions };
