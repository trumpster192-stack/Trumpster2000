// api/news.js
// Vercel Serverless Function – RSS News Proxy (Trump + Crypto + Gold)
const RSS_MAP = {
  trump:   'https://rss.politico.com/donald-trump.xml',
  crypto:  'https://cointelegraph.com/rss',
  gold:    'https://goldbroker.com/news.rss',
};

export default async function handler(req, res) {
  try {
    // req.query works in Vercel Node.js Serverless functions
    const type = req.query.type || 'trump';
    const rssUrl = RSS_MAP[type];

    if (!rssUrl) {
      return res.status(400).json({ error: 'Unknown type. Use ?type=trump|crypto|gold' });
    }

    const response = await fetch(rssUrl, {
      headers: { 'User-Agent': 'Trumpster2000/1.0' }
    });

    if (!response.ok) {
      throw new Error(`RSS HTTP ${response.status}`);
    }

    const xml = await response.text();

    // Return raw XML
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(200).send(xml);
  } catch (error) {
    console.error('RSS proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
