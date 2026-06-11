'use strict';

const API_BASE = 'https://www.googleapis.com/youtube/v3';

async function youtubeRequest(path, params, apiKey) {
  const url = new URL(`${API_BASE}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.error) {
    const error = new Error(data.error?.message || `YouTube API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

async function fetchRecentNicheVideos({ query, region, language, apiKey }) {
  const publishedAfter = new Date(Date.now() - 90 * 86400000).toISOString();
  const search = await youtubeRequest('search', {
    part: 'snippet',
    type: 'video',
    q: query,
    publishedAfter,
    order: 'date',
    maxResults: '50',
    regionCode: region,
    relevanceLanguage: language,
    safeSearch: 'moderate'
  }, apiKey);

  const ids = search.items.map(item => item.id?.videoId).filter(Boolean);
  if (!ids.length) {
    return { videos: [], approximateTotalResults: search.pageInfo?.totalResults || 0 };
  }

  const details = await youtubeRequest('videos', {
    part: 'snippet,statistics,contentDetails',
    id: ids.join(',')
  }, apiKey);

  return {
    approximateTotalResults: search.pageInfo?.totalResults || 0,
    videos: details.items.map(item => ({
      id: item.id,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      tags: item.snippet?.tags || [],
      channelId: item.snippet?.channelId || '',
      channelTitle: item.snippet?.channelTitle || '',
      publishedAt: item.snippet?.publishedAt,
      thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
      duration: item.contentDetails?.duration || '',
      views: Number(item.statistics?.viewCount) || 0,
      likes: item.statistics?.likeCount === undefined ? null : Number(item.statistics.likeCount),
      comments: item.statistics?.commentCount === undefined ? null : Number(item.statistics.commentCount),
      url: `https://www.youtube.com/watch?v=${item.id}`
    }))
  };
}

module.exports = { fetchRecentNicheVideos };
