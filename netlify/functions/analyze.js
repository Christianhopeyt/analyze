// netlify/functions/analyze.js

exports.handler = async function (event, context) {
  // Activation des CORS pour l'accès depuis le Front-End
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

    // 1. Identification du type d'entrée avec extraction d'index stricte
    if (cleanQuery.startsWith("UC") && cleanQuery.length === 24) {
      apiParam = `id=${cleanQuery}`;
    } else if (cleanQuery.startsWith("@")) {
      apiParam = `forHandle=${encodeURIComponent(cleanQuery)}`;
    } else {
      const handleMatch = cleanQuery.match(/youtube\.com\/(@[a-zA-Z0-9_\-\.]+)/);
      const idMatch = cleanQuery.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_\-]{22})/);

      if (idMatch) {
        apiParam = `id=${idMatch[1]}`;
      } else if (handleMatch) {
        apiParam = `forHandle=${encodeURIComponent(handleMatch[1])}`;
      } else {
        apiParam = `forUsername=${encodeURIComponent(cleanQuery)}`;
      }
    }

    // 2. Requête vers l'API officielle YouTube Data v3
    const url = `https://googleapis.com{apiParam}&key=${apiKey}`;
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
    const countryCode = item.snippet.country || "US";

    // 3. Calculs algorithmiques dynamiques du potentiel business
    const detectedNiche = determineNiche(item.snippet.title, item.snippet.description);
    const calculatedRPM = determineRPM(item.snippet.title, item.snippet.description, countryCode);

    const subscriberCount = parseInt(item.statistics.subscriberCount) || 0;
    const viewCount = parseInt(item.statistics.viewCount) || 0;
    const videoCount = parseInt(item.statistics.videoCount) || 1;

    // Estimation brute basée sur la moyenne historique d'activité
    const avgMonthlyRevenue = (viewCount / videoCount * 0.1) * calculatedRPM;

    let dynamicScore = "Medium Potential";
    if (avgMonthlyRevenue > 50000 || subscriberCount > 5000000) {
      dynamicScore = "Premium Tier";
    } else if (avgMonthlyRevenue > 10000 || subscriberCount > 100000) {
      dynamicScore = "High Potential";
    } else if (subscriberCount < 10000) {
      dynamicScore = "Low Potential";
    }

    // 4. Formatage de la réponse propre et dynamique pour l'interface
    const formattedChannel = {
      name: item.snippet.title,
      handle: item.snippet.customUrl || query,
      avatar: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      banner: item.brandingSettings?.image?.bannerExternalUrl || "https://unsplash.com",
      subscribers: subscriberCount,
      totalViews: viewCount,
      videoCount: videoCount,
      creationDate: item.snippet.publishedAt ? item.snippet.publishedAt.split('T')[0] : "2020-01-01",
      niche: detectedNiche,
      language: item.snippet.defaultLanguage || "English",
      country: countryCode,
      rpm: calculatedRPM,
      score: dynamicScore,
      sponsors: subscriberCount > 500000 ? "High" : "Medium",
      affiliate: calculatedRPM > 5 ? "High" : "Medium",
      growth: viewCount > 100000000 ? "Exponential" : "Stable"
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

// Algorithme de détection sémantique amélioré
function determineNiche(title, desc) {
  const combined = (title + " " + (desc || "")).toLowerCase();
  
  if (/\b(finance|crypto|invest|money|trading|bourse|riche|business|marketing|saas)\b/.test(combined)) {
    return "Finance & Business";
  }
  if (/\b(tech|review|gadget|coding|code|dev|ai|intelligence artificielle|smartphone|hardware)\b/.test(combined)) {
    return "Technology & Software";
  }
  if (/\b(game|play|xbox|gaming|playstation|stream|nintendo|pc|fortnite|minecraft)\b/.test(combined)) {
    return "Gaming";
  }
  if (/\b(cook|recipe|cuisine|food|restaurant|manger|voyage|travel|vlog|lifestyle)\b/.test(combined)) {
    return "Lifestyle & Travel";
  }
  return "Entertainment / Vlogs";
}

// Algorithme de calcul du RPM basé sur la Niche et le Pays
function determineRPM(title, desc, country) {
  const niche = determineNiche(title, desc);
  let baseRPM = 3.50;

  if (niche === "Finance & Business") baseRPM = 9.50;
  else if (niche === "Technology & Software") baseRPM = 7.20;
  else if (niche === "Gaming") baseRPM = 1.40;
  else if (niche === "Lifestyle & Travel") baseRPM = 4.20;
  else if (niche === "Entertainment / Vlogs") baseRPM = 2.50;

  const tier1Countries = ["US", "CA", "GB", "AU", "DE", "FR", "NL"];
  const tier2Countries = ["BR", "MX", "IN", "PH", "ID", "ZA"];
  
  const upperCountry = (country || "").toUpperCase();

  if (tier1Countries.includes(upperCountry)) {
    baseRPM *= 1.3; // +30% pour les zones géographiques à fort pouvoir d'achat
  } else if (tier2Countries.includes(upperCountry)) {
    baseRPM *= 0.6; // -40% pour les marchés émergents
  }

  return parseFloat(baseRPM.toFixed(2));
}
