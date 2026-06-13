'use strict';

const { average, clamp, median, tokenize } = require('./niche-analytics');

function normalizeVideos(rawVideos, now = Date.now()) {
  return rawVideos
    .map(video => {
      const publishedMs = new Date(video.publishedAt).getTime();
      if (!Number.isFinite(publishedMs)) return null;
      const views = Number(video.views) || 0;
      const likes = video.likes === null || video.likes === undefined ? null : Number(video.likes);
      const comments = video.comments === null || video.comments === undefined ? null : Number(video.comments);
      const ageDays = Math.max(1, (now - publishedMs) / 86400000);
      const engagementAvailable = Number.isFinite(likes) || Number.isFinite(comments);
      return {
        ...video,
        views,
        likes: Number.isFinite(likes) ? likes : null,
        comments: Number.isFinite(comments) ? comments : null,
        publishedMs,
        ageDays,
        viewsPerDay: views / ageDays,
        engagementRate: views > 0 && engagementAvailable
          ? ((Number.isFinite(likes) ? likes : 0) + (Number.isFinite(comments) ? comments : 0)) / views * 100
          : null
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.publishedMs - a.publishedMs);
}

function summarizeCohort(videos) {
  return {
    videoCount: videos.length,
    averageViews: average(videos.map(video => video.views)),
    medianViews: median(videos.map(video => video.views)),
    averageViewsPerDay: average(videos.map(video => video.viewsPerDay)),
    medianViewsPerDay: median(videos.map(video => video.viewsPerDay)),
    averageEngagementRate: average(videos.map(video => video.engagementRate))
  };
}

function uploadPattern(videos) {
  const gaps = videos.slice(0, -1).map((video, index) => (video.publishedMs - videos[index + 1].publishedMs) / 86400000);
  const spanDays = videos.length > 1 ? (videos[0].publishedMs - videos[videos.length - 1].publishedMs) / 86400000 : 0;
  const groups = new Map();
  const hours = new Map();
  videos.forEach(video => {
    const date = new Date(video.publishedMs);
    const day = date.getUTCDay();
    const hourStart = Math.floor(date.getUTCHours() / 4) * 4;
    if (!groups.has(day)) groups.set(day, []);
    if (!hours.has(hourStart)) hours.set(hourStart, []);
    groups.get(day).push(video);
    hours.get(hourStart).push(video);
  });
  const rank = map => [...map.entries()]
    .map(([key, items]) => ({
      key,
      videoCount: items.length,
      averageViews: average(items.map(video => video.views)),
      medianViewsPerDay: median(items.map(video => video.viewsPerDay))
    }))
    .sort((a, b) => (b.medianViewsPerDay || 0) - (a.medianViewsPerDay || 0));
  const byDay = rank(groups);
  const byHour = rank(hours);
  return {
    uploadsPerWeek: spanDays > 0 ? (videos.length - 1) / spanDays * 7 : null,
    averageDaysBetweenUploads: average(gaps),
    medianDaysBetweenUploads: median(gaps),
    bestUploadDay: (byDay.find(item => item.videoCount >= 2) || null)?.key ?? null,
    bestUploadHourUtc: (byHour.find(item => item.videoCount >= 2) || null)?.key ?? null,
    byDay,
    byHour
  };
}

function scoreMetric(value, target) {
  if (!Number.isFinite(value)) return null;
  return clamp(value / target * 100);
}

function calculateChannelScore(videos, channel) {
  if (videos.length < 10) return { score: null, confidence: 'insufficient', factors: null };
  const recent = videos.slice(0, Math.min(10, Math.floor(videos.length / 2)));
  const older = videos.slice(recent.length, recent.length * 2);
  const pattern = uploadPattern(videos);
  const engagement = scoreMetric(median(videos.map(video => video.engagementRate)), 6);
  const consistency = Number.isFinite(pattern.medianDaysBetweenUploads)
    ? clamp(100 - Math.abs(pattern.medianDaysBetweenUploads - (pattern.averageDaysBetweenUploads || pattern.medianDaysBetweenUploads)) * 12)
    : null;
  const recentPerformance = older.length
    ? clamp(50 + Math.log2(Math.max(0.125, (median(recent.map(video => video.viewsPerDay)) || 0) / Math.max(1, median(older.map(video => video.viewsPerDay)) || 0))) * 22)
    : null;
  const viewsPerVideo = scoreMetric(median(videos.map(video => video.viewsPerDay)), 1000);
  const subscribers = channel.hiddenSubscriberCount ? null : Number(channel.subscriberCount);
  const viewsPerSubscriber = Number.isFinite(subscribers) && subscribers > 0
    ? scoreMetric((average(recent.map(video => video.views)) || 0) / subscribers, 0.35)
    : null;
  const weighted = [
    ['engagement', engagement, 25],
    ['consistency', consistency, 20],
    ['recentPerformance', recentPerformance, 25],
    ['viewsPerVideo', viewsPerVideo, 15],
    ['viewsPerSubscriber', viewsPerSubscriber, 15]
  ].filter(([, value]) => Number.isFinite(value));
  const totalWeight = weighted.reduce((sum, [, , weight]) => sum + weight, 0);
  const score = totalWeight ? Math.round(weighted.reduce((sum, [, value, weight]) => sum + value * weight, 0) / totalWeight) : null;
  return {
    score,
    confidence: videos.length >= 30 ? 'high' : videos.length >= 15 ? 'medium' : 'low',
    factors: Object.fromEntries(weighted.map(([key, value]) => [key, Math.round(value)]))
  };
}

function commonKeywords(videos, limit = 12) {
  const counts = new Map();
  videos.forEach(video => new Set([
    ...tokenize(video.title),
    ...(Array.isArray(video.tags) ? video.tags.flatMap(tokenize) : [])
  ]).forEach(word => counts.set(word, (counts.get(word) || 0) + 1)));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
}

function analyzeChannel(rawVideos, channel, now = Date.now()) {
  const videos = normalizeVideos(rawVideos, now);
  const cohortSize = Math.min(10, Math.floor(videos.length / 2));
  const recentVideos = cohortSize ? videos.slice(0, cohortSize) : videos;
  const olderVideos = cohortSize ? videos.slice(cohortSize, cohortSize * 2) : [];
  const recent = summarizeCohort(recentVideos);
  const older = summarizeCohort(olderVideos);
  const baseline = median(videos.map(video => video.viewsPerDay));
  const growthPercent = older.medianViewsPerDay > 0
    ? (recent.medianViewsPerDay / older.medianViewsPerDay - 1) * 100
    : null;
  const enriched = videos.map(video => ({
    ...video,
    performanceRatio: baseline > 0 ? video.viewsPerDay / baseline : null
  }));
  return {
    sampleSize: videos.length,
    sampledAt: new Date(now).toISOString(),
    score: calculateChannelScore(videos, channel),
    uploadPattern: uploadPattern(videos),
    performance: {
      averageViewsPerVideo: average(videos.map(video => video.views)),
      peakVideo: enriched.slice().sort((a, b) => b.views - a.views)[0] || null,
      recent,
      older,
      growthPercent,
      direction: growthPercent === null ? 'unavailable' : growthPercent > 8 ? 'growth' : growthPercent < -8 ? 'decline' : 'stable'
    },
    commonKeywords: commonKeywords(videos),
    topVideos: enriched.slice().sort((a, b) => b.viewsPerDay - a.viewsPerDay).slice(0, 8),
    recentVideos: enriched.slice(0, 20)
  };
}

module.exports = { analyzeChannel, normalizeVideos, uploadPattern };
