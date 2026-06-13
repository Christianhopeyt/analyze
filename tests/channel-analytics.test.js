'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeChannel } = require('../netlify/functions/lib/channel-analytics');

const NOW = Date.parse('2026-06-11T12:00:00Z');

function video(index, ageDays, views, dayHour = 12) {
  const date = new Date(NOW - ageDays * 86400000);
  date.setUTCHours(dayHour, 0, 0, 0);
  return {
    id: `video-${index}`,
    title: `Creator Strategy ${index}`,
    tags: ['creator', index % 2 ? 'growth' : 'strategy'],
    publishedAt: date.toISOString(),
    thumbnail: '',
    views,
    likes: Math.round(views * 0.04),
    comments: Math.round(views * 0.004),
    url: `https://www.youtube.com/watch?v=video-${index}`
  };
}

test('channel analytics calculates upload, growth, score, and top videos', () => {
  const videos = Array.from({ length: 24 }, (_, index) =>
    video(index, index * 3 + 1, index < 10 ? 20000 - index * 300 : 5000 - index * 80, index % 2 ? 16 : 12)
  );
  const result = analyzeChannel(videos, { subscriberCount: 100000, hiddenSubscriberCount: false }, NOW);

  assert.equal(result.sampleSize, 24);
  assert.ok(result.uploadPattern.uploadsPerWeek > 2);
  assert.ok(result.uploadPattern.averageDaysBetweenUploads > 0);
  assert.equal(result.performance.direction, 'growth');
  assert.ok(result.performance.growthPercent > 0);
  assert.ok(result.score.score >= 0 && result.score.score <= 100);
  assert.equal(result.topVideos.length, 8);
  assert.ok(result.commonKeywords.some(item => item.keyword === 'strategy'));
});

test('hidden subscribers do not become a zero-value score factor', () => {
  const videos = Array.from({ length: 12 }, (_, index) => video(index, index + 1, 1000 + index * 100));
  const result = analyzeChannel(videos, { subscriberCount: null, hiddenSubscriberCount: true }, NOW);

  assert.equal(result.score.factors.viewsPerSubscriber, undefined);
  assert.ok(Number.isFinite(result.score.score));
});

test('small samples withhold the channel score', () => {
  const result = analyzeChannel([video(1, 1, 1000), video(2, 4, 800)], { subscriberCount: 100 }, NOW);

  assert.equal(result.score.score, null);
  assert.equal(result.score.confidence, 'insufficient');
});
