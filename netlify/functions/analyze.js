// netlify/functions/analyze.js

exports.handler = async function (event, context) {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const query = event.queryStringParameters.q;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key environment variable is not configured on Netlify." })
    };
  }

  if (!query) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing query parameter 'q'." })
    };
  }

  try {
    let apiParam = "";
    let cleanQuery = query.trim();

    // 1. Identify input type (ID, Username, or Handle)
    if (cleanQuery.startsWith("UC") && cleanQuery.length === 24) {
      apiParam = `id=${cleanQuery}`;
    } else if (cleanQuery.startsWith("@")) {
      apiParam = `forHandle=${encodeURIComponent(cleanQuery)}`;
    } else {
      // If the user pasted a full URL, attempt to parse handles or IDs
      const handleMatch = cleanQuery.match(/youtube\.com\/(@[a-zA-Z0-9_\-\.]+)/);
      const idMatch = cleanQuery.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_\-]{22})/);

      if (idMatch) {
        apiParam = `id=${idMatch[1]}`;
      } else if (handleMatch) {
        apiParam = `forHandle=${encodeURIComponent(handleMatch[1])}`;
      } else {
        // Fallback fallback: search for it as a username
        apiParam = `forUsername=${encodeURIComponent(cleanQuery)}`;
      }
    }

    // 2. Fetch data from YouTube Data API v3
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&${apiParam}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Channel not found." })
      };
    }

    const item = data.items[0];

    // 3. Format the response data to match the UI state expectations
    const formattedChannel = {
      name: item.snippet.title,
      handle: item.snippet.customUrl || query,
      avatar: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      banner: item.brandingSettings?.image?.bannerExternalUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      subscribers: parseInt(item.statistics.subscriberCount) || 0,
      totalViews: parseInt(item.statistics.viewCount) || 0,
      videoCount: parseInt(item.statistics.videoCount) || 0,
      creationDate: item.snippet.publishedAt ? item.snippet.publishedAt.split('T')[0] : "2020-01-01",
      niche: determineNiche(item.snippet.title, item.snippet.description),
      language: item.snippet.defaultLanguage || "English",
      country: item.snippet.country || "United States",
      rpm: determineRPM(item.snippet.title, item.snippet.description),
      score: "High",
      sponsors: "High",
      affiliate: "Medium",
      growth: "Stable"
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedChannel)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to connect to the YouTube API.", details: error.message })
    };
  }
};

// Helper algorithms to predict parameters based on text keywords
function determineNiche(title, desc) {
  const combined = (title + " " + (desc || "")).toLowerCase();
  if (combined.includes("finance") || combined.includes("crypto") || combined.includes("invest") || combined.includes("money")) {
    return "Finance & Business";
  }
  if (combined.includes("tech") || combined.includes("review") || combined.includes("gadget") || combined.includes("coding")) {
    return "Technology & Software";
  }
  if (combined.includes("game") || combined.includes("play") || combined.includes("xbox") || combined.includes("gaming")) {
    return "Gaming";
  }
  return "Entertainment / Vlogs";
}

function determineRPM(title, desc) {
  const niche = determineNiche(title, desc);
  if (niche === "Finance & Business") return 8.50;
  if (niche === "Technology & Software") return 6.80;
  if (niche === "Gaming") return 1.80;
  return 3.50;
}