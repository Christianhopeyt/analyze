'use strict';

const STOP_WORDS = new Set([
  'a','about','after','all','and','are','as','at','be','best','by','can','complete','de','des','du','en',
  'for','from','guide','how','i','in','is','it','la','le','les','my','new','of','on','or','pour','que',
  'the','this','to','top','un','une','video','videos','vs','what','with','you','your','youtube'
]);

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function average(values) {
  const valid = values.filter(Number.isFinite);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

function median(values) {
  const valid = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!valid.length) return null;
  const middle = Math.floor(valid.length / 2);
  return valid.length % 2 ? valid[middle] : (valid[middle - 1] + valid[middle]) / 2;
}

function percentile(values, percent) {
  const valid = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!valid.length) return null;
  const index = Math.min(valid.length - 1, Math.max(0, Math.ceil(percent * valid.length) - 1));
  return valid[index];
}

function ratioScore(current, baseline, neutral = 50) {
  if (!Number.isFinite(current) || !Number.isFinite(baseline) || baseline <= 0) return neutral;
  return clamp(50 + Math.log2(Math.max(0.125, current / baseline)) * 22);
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map(word => word.replace(/^-+|-+$/g, ''))
    .filter(word => word.length >= 3 && !STOP_WORDS.has(word));
}

function getCommonKeywords(videos, query, limit = 12) {
  const queryWords = new Set(tokenize(query));
  const counts = new Map();
  videos.forEach(video => {
    const words = new Set([
      ...tokenize(video.title),
      ...(Array.isArray(video.tags) ? video.tags.flatMap(tokenize) : [])
    ]);
    words.forEach(word => {
      if (!queryWords.has(word)) counts.set(word, (counts.get(word) || 0) + 1);
    });
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count, share: videos.length ? count / videos.length : 0 }));
}

function classifyTitlePatterns(videos) {
  const patterns = [
    ['how_to', title => /\bhow to\b/i.test(title)],
    ['numbered', title => /(^|\s)\d{1,3}\b/.test(title)],
    ['question', title => /\?|^(what|why|when|where|can|should|is|are|do|does)\b/i.test(title)],
    ['beginner', title => /\b(beginner|beginners|starter|start here|101)\b/i.test(title)],
    ['comparison', title => /\b(vs\.?|versus|compare|comparison)\b/i.test(title)],
    ['review', title => /\b(review|tested|worth it)\b/i.test(title)],
    ['urgency', title => /\b(new|latest|today|now|202[4-9]|breaking)\b/i.test(title)]
  ];
  return patterns
    .map(([pattern, matches]) => ({
      pattern,
      count: videos.filter(video => matches(video.title)).length
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

function summarizeWindow(videos, days) {
  const subset = videos.filter(video => video.ageDays <= days);
  const views = subset.map(video => video.views);
  const likes = subset.map(video => video.likes).filter(Number.isFinite);
  const comments = subset.map(video => video.comments).filter(Number.isFinite);
  const engagement = subset.map(video => video.engagementRate).filter(Number.isFinite);
  const viewsPerDay = subset.map(video => video.viewsPerDay);
  return {
    days,
    videoCount: subset.length,
    distinctChannels: new Set(subset.map(video => video.channelId)).size,
    uploadsPerWeek: subset.length / days * 7,
    averageViews: average(views),
    medianViews: median(views),
    averageLikes: average(likes),
    averageComments: average(comments),
    averageEngagementRate: average(engagement),
    medianEngagementRate: median(engagement),
    averageViewsPerDay: average(viewsPerDay),
    medianViewsPerDay: median(viewsPerDay)
  };
}

function normalizeVideos(rawVideos, now = Date.now()) {
  return rawVideos.map(video => {
    const publishedAt = new Date(video.publishedAt).getTime();
    const ageDays = Math.max(1, (now - publishedAt) / 86400000);
    const views = Number(video.views) || 0;
    const likes = video.likes === null || video.likes === undefined ? null : Number(video.likes);
    const comments = video.comments === null || video.comments === undefined ? null : Number(video.comments);
    const interactionTotal = (Number.isFinite(likes) ? likes : 0) + (Number.isFinite(comments) ? comments : 0);
    return {
      ...video,
      views,
      likes: Number.isFinite(likes) ? likes : null,
      comments: Number.isFinite(comments) ? comments : null,
      ageDays,
      viewsPerDay: views / ageDays,
      engagementRate: views > 0 && (Number.isFinite(likes) || Number.isFinite(comments))
        ? interactionTotal / views * 100
        : null
    };
  });
}

function calculateScores(videos, windows, patterns) {
  const recent = windows['7'].videoCount >= 5 ? windows['7'] : windows['30'];
  const baseline = windows['90'];
  const viewsMomentum = ratioScore(recent.medianViewsPerDay, baseline.medianViewsPerDay);
  const uploadAcceleration = ratioScore(recent.uploadsPerWeek, baseline.uploadsPerWeek);
  const engagementLift = ratioScore(recent.medianEngagementRate, baseline.medianEngagementRate);

  const fastThreshold = Math.max(
    percentile(videos.map(video => video.viewsPerDay), 0.75) || 0,
    (median(videos.map(video => video.viewsPerDay)) || 0) * 2
  );
  const fastPerformers = videos
    .filter(video => video.ageDays <= 30 && video.viewsPerDay >= fastThreshold && video.views > 0)
    .sort((a, b) => b.viewsPerDay - a.viewsPerDay);
  const fastShareScore = clamp((fastPerformers.length / Math.max(1, windows['30'].videoCount)) * 250);

  const trendScore = Math.round(
    viewsMomentum * 0.35 +
    uploadAcceleration * 0.25 +
    engagementLift * 0.20 +
    fastShareScore * 0.20
  );

  const channelViews = new Map();
  videos.forEach(video => channelViews.set(video.channelId, (channelViews.get(video.channelId) || 0) + video.views));
  const totalViews = [...channelViews.values()].reduce((sum, value) => sum + value, 0);
  const topThreeViews = [...channelViews.values()].sort((a, b) => b - a).slice(0, 3).reduce((sum, value) => sum + value, 0);
  const dominanceScore = totalViews ? clamp(topThreeViews / totalViews * 100) : 0;
  const supplyScore = clamp(windows['90'].uploadsPerWeek / 5 * 100);
  const channelBreadthScore = clamp(windows['90'].distinctChannels / 35 * 100);
  const repetitionScore = clamp(
    ((patterns[0]?.count || 0) / Math.max(1, videos.length)) * 100 +
    (videos.length - new Set(videos.map(video => tokenize(video.title).slice(0, 5).join(' '))).size) / Math.max(1, videos.length) * 50
  );
  const competitionScore = Math.round(
    supplyScore * 0.35 +
    channelBreadthScore * 0.25 +
    dominanceScore * 0.25 +
    repetitionScore * 0.15
  );

  const engagementQuality = clamp((windows['90'].medianEngagementRate || 0) / 6 * 100);
  const contentGapScore = clamp(100 - (dominanceScore * 0.55 + repetitionScore * 0.45));
  const opportunityScore = Math.round(
    trendScore * 0.35 +
    engagementQuality * 0.20 +
    fastShareScore * 0.15 +
    contentGapScore * 0.15 +
    (100 - competitionScore) * 0.15
  );

  return {
    trendScore,
    competitionScore,
    opportunityScore,
    fastPerformers,
    factors: {
      viewsMomentum: Math.round(viewsMomentum),
      uploadAcceleration: Math.round(uploadAcceleration),
      engagementLift: Math.round(engagementLift),
      fastPerformerShare: Math.round(fastShareScore),
      incumbentDominance: Math.round(dominanceScore),
      contentGap: Math.round(contentGapScore)
    }
  };
}

function confidenceFor(videos, windows) {
  const channels = windows['90'].distinctChannels;
  const availableEngagement = videos.filter(video => video.engagementRate !== null).length;
  if (videos.length >= 35 && channels >= 20 && availableEngagement >= 25 && windows['30'].videoCount >= 10) return 'high';
  if (videos.length >= 15 && channels >= 8 && availableEngagement >= 8) return 'medium';
  return 'low';
}

function analyzeNiche(rawVideos, query, now = Date.now()) {
  const videos = normalizeVideos(rawVideos, now).filter(video => video.ageDays <= 90);
  const windows = {
    '7': summarizeWindow(videos, 7),
    '30': summarizeWindow(videos, 30),
    '90': summarizeWindow(videos, 90)
  };
  const commonKeywords = getCommonKeywords(videos, query);
  const titlePatterns = classifyTitlePatterns(videos);
  const scores = videos.length ? calculateScores(videos, windows, titlePatterns) : null;

  return {
    sampleSize: videos.length,
    confidence: confidenceFor(videos, windows),
    windows,
    scores: {
      trend: scores?.trendScore ?? null,
      competition: scores?.competitionScore ?? null,
      opportunity: scores?.opportunityScore ?? null
    },
    scoreFactors: scores?.factors ?? null,
    commonKeywords,
    titlePatterns,
    fastPerformers: scores?.fastPerformers.slice(0, 8) ?? [],
    videos: videos.sort((a, b) => b.viewsPerDay - a.viewsPerDay)
  };
}

module.exports = {
  analyzeNiche,
  average,
  clamp,
  median,
  percentile,
  tokenize
};
