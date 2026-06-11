'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeNiche, median, tokenize } = require('../netlify/functions/lib/niche-analytics');

const NOW = Date.parse('2026-06-11T12:00:00Z');

function video(index, ageDays, views, likes, comments, title = `How to Build Topic ${index}`) {
  return {
    id: `video-${index}`,
    title,
    tags: ['topic', index % 2 ? 'beginner' : 'strategy'],
    channelId: `channel-${index % 9}`,
    channelTitle: `Channel ${index % 9}`,
    publishedAt: new Date(NOW - ageDays * 86400000).toISOString(),
    views,
    likes,
    comments,
    thumbnail: '',
    url: `https://www.youtube.com/watch?v=video-${index}`
  };
}

test('median handles odd, even, and empty samples', () => {
  assert.equal(median([1, 4, 2]), 2);
  assert.equal(median([1, 4, 2, 3]), 2.5);
  assert.equal(median([]), null);
});

test('tokenize removes accents, stop words, and short words', () => {
  assert.deepEqual(tokenize('The Résumé Guide for YouTube'), ['resume']);
});

test('analytics creates recent windows and bounded scores', () => {
  const videos = Array.from({ length: 36 }, (_, index) => {
    const ageDays = index + 1;
    const recentBoost = ageDays <= 7 ? 4 : ageDays <= 30 ? 2 : 1;
    return video(
      index,
      ageDays,
      (index + 1) * 1800 * recentBoost,
      (index + 1) * 90,
      (index + 1) * 12,
      index % 3 ? `Beginner Topic Strategy ${index}` : `How to Build Topic ${index}`
    );
  });

  const result = analyzeNiche(videos, 'topic', NOW);

  assert.equal(result.windows['7'].videoCount, 7);
  assert.equal(result.windows['30'].videoCount, 30);
  assert.equal(result.windows['90'].videoCount, 36);
  assert.equal(result.confidence, 'medium');
  assert.ok(result.scores.trend >= 0 && result.scores.trend <= 100);
  assert.ok(result.scores.competition >= 0 && result.scores.competition <= 100);
  assert.ok(result.scores.opportunity >= 0 && result.scores.opportunity <= 100);
  assert.ok(result.fastPerformers.length > 0);
  assert.ok(result.commonKeywords.some(item => item.keyword === 'beginner'));
});

test('missing public engagement fields remain unavailable', () => {
  const result = analyzeNiche([video(1, 2, 1000, null, null)], 'topic', NOW);

  assert.equal(result.windows['7'].averageLikes, null);
  assert.equal(result.windows['7'].averageComments, null);
  assert.equal(result.windows['7'].averageEngagementRate, null);
});

test('empty samples never produce analytics scores', () => {
  const result = analyzeNiche([], 'topic', NOW);

  assert.equal(result.sampleSize, 0);
  assert.deepEqual(result.scores, {
    trend: null,
    competition: null,
    opportunity: null
  });
  assert.equal(result.scoreFactors, null);
  assert.deepEqual(result.fastPerformers, []);
});
