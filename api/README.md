# YouTube Analyzer API Proxy

This folder contains a lightweight Node.js proxy server that securely forwards
requests to the YouTube Data API v3 without exposing your API key in the browser.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file:
```
YT_API_KEY=your_youtube_data_api_v3_key_here
PORT=3001
ALLOWED_ORIGIN=https://analyzer.norcanto.com
```

3. Run locally:
```
node server.js
```

4. Deploy to Netlify Functions by placing the `netlify/functions/` folder in your project root.

## Security
- API key is stored server-side only via environment variable
- Rate limiting: 20 requests per IP per hour
- CORS restricted to your domain
- Requests cached for 24 hours per channel ID

## Netlify Environment Variables
Set `YT_API_KEY` in your Netlify site settings under Environment Variables.
