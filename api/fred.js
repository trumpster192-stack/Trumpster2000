// api/fred.js
// Vercel Serverless Function – FRED Macro Data (FEDFUNDS)
export default async function handler(req, res) {
  try {
    const key = process.env.FRED_KEY || '48bf00ac5df3a0548ae2df72648a0de8'; // Fallback to provided key if env var is missing during initial deployment
    if (!key) {
      return res.status(500).json({ error: 'FRED_KEY environment variable not set' });
    }

    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${key}&file_type=json&sort_order=desc&limit=2`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Trumpster2000/1.0' }
    });

    if (!response.ok) {
      throw new Error(`FRED HTTP ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('FRED API error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
