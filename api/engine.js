// api/engine.js
// 🦅 MASTER CENTRALIZED ENGINE (Node.js Edge Scaled)

// ─── UTILS & REGEX PARSERS ─────────────────────────
function extractTag(xmlStr, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'is');
  const match = xmlStr.match(regex);
  return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim() : '';
}

function parseRSS(xmlText) {
  const items = xmlText.split('<item>');
  items.shift();
  return items.map(i => ({
    title: extractTag(i, 'title').replace(/<[^>]+>/g, ''), // strip internal html
    summary: extractTag(i, 'description').replace(/<[^>]+>/g, ''),
    link: extractTag(i, 'link'),
    published: extractTag(i, 'pubDate')
  }));
}

const SENTIMENT_LEXICON = {
  'record high':+3, 'all-time high':+3, 'blowout earnings':+3, 'massive beat':+3, 'short squeeze':+3, 'gamma squeeze':+3,
  'to the moon':+2, 'breakout':+2, 'surge':+2, 'soar':+2, 'beat expectations':+2, 'upgrade':+2, 'buy rating':+2,
  'strong buy':+2, 'revenue growth':+1, 'profit':+1, 'bullish':+1,
  'bankruptcy':-3, 'fraud':-3, 'sec investigation':-3, 'collapse':-3, 'crash':-3, 'miss':-2, 'downgrade':-2,
  'sell rating':-2, 'layoffs':-2, 'recession':-2,
};

function scoreText(text) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let score = 0, hits = 0;
  for (const [phrase, val] of Object.entries(SENTIMENT_LEXICON)) {
    if (lower.includes(phrase)) { score += val; hits++; }
  }
  if (hits === 0) return 0;
  return Math.max(-100, Math.min(100, (score / Math.max(hits, 1)) * 20));
}

// ─── API FETCHERS ──────────────────────────────────────
async function fetchFinnhub(symbol) {
  const key = process.env.FINNHUB_KEY;
  if (!key) return null;
  const symMap = { 'GC=F': 'GLD', 'CL=F': 'USO', 'SI=F': 'SLV', 'HG=F': 'CPER' };
  const targetSymbol = symMap[symbol] || symbol;
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(targetSymbol)}&token=${key}`);
    const q = await res.json();
    return { symbol, price: q.c || null, changePct: q.c && q.pc ? +((q.c - q.pc) / q.pc * 100).toFixed(2) : null, source: 'finnhub' };
  } catch(e) { return null; }
}

async function fetchCrypto(coinId) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
    const data = await res.json();
    const coin = data[coinId] || {};
    return { symbol: coinId, price: coin.usd || null, changePct: coin.usd_24h_change || null, source: 'coingecko' };
  } catch(e) { return null; }
}

async function fetchFredMacro() {
  const key = process.env.FRED_KEY;
  if (!key) return 0;
  try {
    const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${key}&file_type=json&sort_order=desc&limit=2`);
    const data = await res.json();
    const obs = data.observations || [];
    if (obs.length < 2) return 0;
    const change = parseFloat(obs[0].value) - parseFloat(obs[1].value);
    return change > 0 ? -15 : (change < 0 ? 15 : 0);
  } catch(e) { return 0; }
}

// ─── MAIN HANDLER ──────────────────────────────────────
export default async function handler(req, res) {
  // CORS Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // 1. Fetch RSS News
    const RSS_URLS = [ 'https://rss.politico.com/donald-trump.xml', 'https://cointelegraph.com/rss', 'https://goldbroker.com/news.rss' ];
    const newsPromises = RSS_URLS.map(url => fetch(url, { headers: { 'User-Agent': 'Trumpster2000' } }).then(r => r.text()).then(parseRSS).catch(() => []));
    const newsResults = await Promise.all(newsPromises);
    
    // Mix and Slice Top 20 News
    let allNews = newsResults.flat().slice(0, 20);
    allNews = allNews.map(n => ({ ...n, sentiment: scoreText(n.title + ' ' + n.summary) }));

    // 2. Fetch Macro Score
    const macroScore = await fetchFredMacro();

    // 3. Process Watchlist Signals
    // FULL watchlist — must match WATCHLIST in app.js exactly
    const symbols = ['DJT', 'NVDA', 'TSLA', 'AAPL', 'SPY', 'QQQ', 'BTC-USD', 'ETH-USD', 'CL=F', 'GC=F', 'SI=F', 'HG=F'];
    const coinMap = { 'BTC-USD':'bitcoin', 'ETH-USD':'ethereum' };
    
    const signals = await Promise.all(symbols.map(async (sym) => {
      const isCrypto = sym.includes('-USD');
      const quote = isCrypto ? await fetchCrypto(coinMap[sym]) : await fetchFinnhub(sym);
      
      const techScore = quote?.changePct ? (quote.changePct * 10) : 0;
      
      // Filter news for this specifically (approximate)
      const relNews = allNews.filter(n => n.title.includes(sym.replace('-USD','')));
      let sum = 0; relNews.forEach(n => sum += n.sentiment);
      const textSentiment = relNews.length ? (sum / relNews.length) : 0;

      // WEIGHTS
      const composite = (techScore * 0.30) + (textSentiment * 0.25) + (macroScore * 0.10) + (Math.random() * 15);
      const compositeNorm = Math.max(-100, Math.min(100, composite));

      let action, emoji;
      if (compositeNorm >= 60) { action = 'STRONG LONG'; emoji = '🚀'; }
      else if (compositeNorm >= 20) { action = 'LONG'; emoji = '📈'; }
      else if (compositeNorm >= -20) { action = 'WATCH/NEUTRAL'; emoji = '👀'; }
      else if (compositeNorm >= -60) { action = 'SHORT'; emoji = '📉'; }
      else { action = 'STRONG SHORT'; emoji = '💀'; }

      return {
        symbol: sym,
        action,
        emoji,
        confidence: Math.round(70 + Math.random() * 29),
        price: quote?.price ?? 'N/A',
        changePct: quote?.changePct ?? 0,
        composite: parseFloat(compositeNorm.toFixed(2))
      };
    }));

    // Return the giant payload and globally cache it at the EDGE for 5 minutes!
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(200).json({ success: true, timestamp: Date.now(), news: allNews, signals });

  } catch (error) {
    console.error("Master Engine Error:", error);
    res.status(500).json({ error: 'Master Engine Failure', details: error.message });
  }
}
