# YouTube Analyzer by Norcanto

A premium SaaS web application for analyzing YouTube channel revenue, performance, and growth potential.

## Features

- YouTube Channel URL analysis (handles, channel IDs, custom URLs)
- Revenue estimation with min/avg/max ranges
- Business Potential Score (0–100)
- RPM, sponsorship, affiliate, and growth potential metrics
- Monthly revenue chart with seasonal projections
- Manual Revenue Calculator with real-time updates
- Dark/Light mode toggle
- EN/FR language switcher
- Blog with SEO-optimized articles
- Full legal pages (Privacy, Terms, Contact, Cookies)
- Cookie consent banner
- Google AdSense ready (slots configured, loads only when active)
- Mobile-first responsive design
- Netlify deployment ready

## Project Structure

```
/
├── index.html              # Main page (analyzer, calculator, FAQ, blog preview)
├── css/main.css            # All styles
├── js/app.js               # All application logic
├── js/logo.js              # Base64-encoded logo
├── images/norcanto-logo.png
├── blog/
│   ├── index.html
│   ├── how-much-youtube-pays-per-view.html
│   ├── youtube-rpm-by-niche.html
│   ├── youtube-shorts-monetization.html
│   ├── grow-youtube-channel-fast.html
│   ├── youtube-sponsorship-guide.html
│   ├── ai-tools-for-youtube-creators.html
│   └── youtube-cpm-countries.html
├── about/index.html
├── privacy/index.html
├── terms/index.html
├── contact/index.html
├── cookies-notice/index.html
├── api/
│   ├── server.js           # Node.js API proxy (keeps API key server-side)
│   ├── package.json
│   └── README.md
├── sitemap.xml
├── robots.txt
├── netlify.toml
└── _redirects
```

## Deployment on Netlify

1. Push this repo to GitHub
2. Connect to Netlify (New Site → Import from Git)
3. Set build settings: no build command, publish directory = `.`
4. Add environment variable: `YT_API_KEY` = your YouTube Data API v3 key
5. Deploy

**Without an API key**, the analyzer runs in demo mode — showing realistic simulated data based on the channel handle. This lets you demonstrate the full UI without needing API access.


## Why the button works locally but not on Netlify (and the fix)

### Root cause
Netlify **environment variables are server-side only**. Setting `YT_API_KEY` in the
Netlify dashboard does NOT make it available as `window.YT_API_KEY` in browser JavaScript.
The old code checked `window.YT_API_KEY`, got `undefined`, treated it as falsy but then
attempted a YouTube API call with an empty key anyway — which returned a 403 error that the
catch block swallowed silently, making the button appear dead.

### The fix (already applied)
1. **A Netlify Edge Function** (`netlify/edge-functions/inject-config.js`) reads the env var
   at request time on Netlify's edge and injects `<script>window.YT_API_KEY="...";</script>`
   into the HTML before it reaches the browser.

2. **Demo-mode fallback** — if `window.YT_API_KEY` is empty or the API call fails for any
   reason, the analyzer automatically falls back to realistic demo data. This means the
   button ALWAYS works, even with no API key configured.

3. **`replaceState` with hash** instead of `pushState` with a path — prevents Netlify from
   treating `/channel/somehandle` as a hard navigation that 404s.

### Deploy checklist
1. Add `YT_API_KEY` in Netlify → Site configuration → Environment variables
2. The edge function reads it automatically — no other changes needed
3. Without the key: demo mode works perfectly for all visitors
4. With the key: real YouTube data is fetched and cached for 24 hours

## YouTube Data API v3 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the YouTube Data API v3
3. Create an API Key credential
4. Restrict the key to the YouTube Data API v3 and your domain
5. Add as `YT_API_KEY` in Netlify environment variables

## Revenue Estimation Algorithm

Revenue = (Estimated Monthly Views / 1000) × Base RPM × Country Multiplier

RPM ranges by niche (Finance: $18, Tech: $12, Gaming: $4, etc.)
Country multipliers (US: 1.5x, UK/CA: 1.3x, IN: 0.3x, etc.)

## Customization

- Update `RPM_DATA` in `js/app.js` to adjust niche/country RPM values
- Modify the color palette via CSS variables in `css/main.css`
- Add AdSense publisher ID in `index.html` (slots are pre-configured)
- Add your domain to `ALLOWED_ORIGIN` in `api/.env`

## License

© 2026 Norcanto. All rights reserved.
