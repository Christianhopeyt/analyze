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

async function fetchChannelDashboardSource({ type, value, apiKey }) {
  const channelId = await resolveChannelId(type, value, apiKey);
  if (!channelId) return null;
  const channelData = await youtubeRequest('channels', {
    part: 'snippet,statistics,contentDetails,brandingSettings',
    id: channelId
  }, apiKey);
  const item = channelData.items?.[0];
  if (!item) return null;
  const hiddenSubscriberCount = Boolean(item.statistics?.hiddenSubscriberCount);
  const channel = {
    id: item.id,
    title: item.snippet?.title || '',
    handle: item.snippet?.customUrl || '',
    description: item.snippet?.description || '',
    publishedAt: item.snippet?.publishedAt,
    country: item.snippet?.country || null,
    avatar: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || null,
    banner: item.brandingSettings?.image?.bannerExternalUrl || null,
    subscriberCount: hiddenSubscriberCount ? null : Number(item.statistics?.subscriberCount) || 0,
    hiddenSubscriberCount,
    viewCount: Number(item.statistics?.viewCount) || 0,
    videoCount: Number(item.statistics?.videoCount) || 0
  };
  const uploadsId = item.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return { channel, videos: [] };
  const playlist = await youtubeRequest('playlistItems', {
    part: 'contentDetails',
    playlistId: uploadsId,
    maxResults: '50'
  }, apiKey);
  const ids = playlist.items.map(entry => entry.contentDetails?.videoId).filter(Boolean);
  if (!ids.length) return { channel, videos: [] };
  const details = await youtubeRequest('videos', {
    part: 'snippet,statistics,contentDetails',
    id: ids.join(',')
  }, apiKey);
  return {
    channel,
    videos: details.items.map(video => ({
      id: video.id,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      tags: video.snippet?.tags || [],
      publishedAt: video.snippet?.publishedAt,
      thumbnail: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || '',
      duration: video.contentDetails?.duration || '',
      views: Number(video.statistics?.viewCount) || 0,
      likes: video.statistics?.likeCount === undefined ? null : Number(video.statistics.likeCount),
      comments: video.statistics?.commentCount === undefined ? null : Number(video.statistics.commentCount),
      url: `https://www.youtube.com/watch?v=${video.id}`
    }))
  };
}

module.exports = { fetchRecentNicheVideos, fetchChannelDashboardSource, resolveChannelId, youtubeRequest };
