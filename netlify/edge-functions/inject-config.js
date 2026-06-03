// Netlify Edge Function — injects server-side env vars into HTML at the edge.
// This is the CORRECT way to expose a build-time config to browser JS on Netlify.
// The YT_API_KEY env var is set in Netlify → Site configuration → Environment variables.

export default async (request, context) => {
  const response = await context.next();

  // Only process HTML responses for the main page
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const url = new URL(request.url);
  // Only inject on the root and index pages, not sub-pages or blog articles
  if (url.pathname !== '/' && url.pathname !== '/index.html') return response;

  const apiKey = Netlify.env.get('YT_API_KEY') || '';

  const html = await response.text();

  // Inject window.YT_API_KEY right before </head>
  // This is safe: the value is never exposed in source control, only at runtime
  const injected = html.replace(
    '</head>',
    `<script>window.YT_API_KEY=${JSON.stringify(apiKey)};</script>\n</head>`
  );

  return new Response(injected, {
    status:  response.status,
    headers: response.headers,
  });
};

export const config = { path: ["/", "/index.html"] };
