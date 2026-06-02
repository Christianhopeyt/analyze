// YouTube Analyzer – API Proxy Server (Node.js)
// Deploy as a Netlify Function or standalone Express server

const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.YT_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// In-memory cache (use Redis for production)
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rate limiting: 20 requests per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Channel analysis endpoint
app.get('/api/channel', async (req, res) => {
  const { handle, id } = req.query;

  if (!handle && !id) {
    return res.status(400).json({ error: 'Missing channel handle or id parameter' });
  }

  if (!API_KEY) {
    return res.status(503).json({ error: 'API key not configured on server' });
  }

  const cacheKey = handle || id;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return res.json({ ...cached.data, cached: true });
  }

  try {
    const base = 'https://www.googleapis.com/youtube/v3';
    let channelId = id;

    if (!channelId && handle) {
      // Search for channel by handle
      const searchRes = await fetch(
        `${base}/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`
      );
      const searchData = await searchRes.json();
      if (searchData.error) throw new Error(searchData.error.message);
      channelId = searchData.items?.[0]?.snippet?.channelId;
    }

    if (!channelId) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const channelRes = await fetch(
      `${base}/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();
    if (channelData.error) throw new Error(channelData.error.message);

    const ch = channelData.items?.[0];
    if (!ch) return res.status(404).json({ error: 'Channel data not found' });

    const result = {
      id: ch.id,
      title: ch.snippet.title,
      handle: ch.snippet.customUrl,
      description: ch.snippet.description,
      publishedAt: ch.snippet.publishedAt,
      country: ch.snippet.country,
      avatar: ch.snippet.thumbnails?.high?.url,
      banner: ch.brandingSettings?.image?.bannerExternalUrl,
      subscriberCount: ch.statistics.subscriberCount,
      viewCount: ch.statistics.viewCount,
      videoCount: ch.statistics.videoCount,
      hiddenSubscriberCount: ch.statistics.hiddenSubscriberCount,
    };

    cache.set(cacheKey, { data: result, ts: Date.now() });
    res.json(result);

  } catch (err) {
    console.error('YouTube API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch channel data' });
  }
});

app.listen(PORT, () => {
  console.log(`YouTube Analyzer API proxy running on port ${PORT}`);
});
