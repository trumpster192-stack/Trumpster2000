// api/cron.js
// 🦅 HEADLESS AUTONOMOUS TRIGGER ROUTE (Designed for cron-job.org)

export default async function handler(req, res) {
  try {
    // 1. Fetch the master calculated dataset from our own internal engine
    // We use headers to bypass the Edge Cache, forcing a fresh scrape for the Cron!
    const engineUrl = `https://${req.headers.host || 'trumpster2000.vercel.app'}/api/engine`;
    const engineRes = await fetch(engineUrl, { headers: { 'Cache-Control': 'no-cache' } });
    
    if (!engineRes.ok) throw new Error("Failed to wake up the Master Engine");
    const { signals, news } = await engineRes.json();

    let alertsFired = 0;

    // Helper: Supabase State Memory
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    
    // Check if we already alerted for this today
    const alreadyAlerted = async (messageChunk) => {
      if (!SUPABASE_URL || !SUPABASE_KEY) return false;
      try {
        const checkUrl = `${SUPABASE_URL}/rest/v1/signals_history?message=eq.${encodeURIComponent(messageChunk)}&select=id`;
        const res = await fetch(checkUrl, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
        const data = await res.json();
        return data && data.length > 0;
      } catch (e) { return false; }
    };

    // Save alert so we don't repeat
    const saveAlert = async (symbol, action, messageChunk) => {
      if (!SUPABASE_URL || !SUPABASE_KEY) return;
      try {
        const insertUrl = `${SUPABASE_URL}/rest/v1/signals_history`;
        await fetch(insertUrl, {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({ symbol, action, message: messageChunk })
        });
      } catch (e) {}
    };

    const triggerTG = async (symbol, action, msg, dedupeChunk) => {
      const isDuplicate = await alreadyAlerted(dedupeChunk);
      if (isDuplicate) return;

      await fetch(`https://${req.headers.host || 'trumpster2000.vercel.app'}/api/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      
      await saveAlert(symbol, action, dedupeChunk);
      alertsFired++;
    };

    // 2. Scan Signals for EXTREME movements
    for (const sig of signals) {
      if (sig.action === 'STRONG LONG' || sig.action === 'STRONG SHORT') {
        const formattedDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        const tgMsg = `🚨 <b>TRUMPSTER SIGNAL: ${sig.action}</b> 🚨\n\n` +
          `🦅 <b>Asset:</b> ${sig.symbol}\n` +
          `💵 <b>Price:</b> $${sig.price}\n` +
          `🔥 <b>Confidence:</b> ${sig.confidence}%\n` +
          `📈 <b>Momentum:</b> ${sig.changePct > 0 ? '+' : ''}${sig.changePct}%\n\n` +
          `⏱ ${formattedDate} EST`;
          
        await triggerTG(sig.symbol, sig.action, tgMsg, `sig_${sig.symbol}_${sig.action}`);
      }
    }

    // 3. Scan News for EXTREME Sentiment
    // Since cron hits this every ~60 mins, let's just trigger on the TOP hottest breaking story out of the batch to avoid spam
    const extremeNews = news.filter(n => n.sentiment > 10 || n.sentiment < -10);
    if (extremeNews.length > 0) {
      const topStory = extremeNews.sort((a,b) => Math.abs(b.sentiment) - Math.abs(a.sentiment))[0];
      const tag = topStory.sentiment > 0 ? 'bullish' : 'bearish';
      const emoji = topStory.sentiment > 0 ? '🚀' : '🩸';
      const tgMsg = `🚨 <b>BREAKING: EXTREME ${tag.toUpperCase()} NEWS</b> ${emoji}\n\n` +
                    `📰 <b>Headline:</b> ${topStory.title}\n` +
                    `🔥 <b>Sentiment Score:</b> ${topStory.sentiment}\n` +
                    `🔗 <a href="${topStory.link}">Read Full Intel</a>`;
                    
      const dedupeChunk = tag + '_' + encodeURIComponent(topStory.title).substring(0, 15);
      await triggerTG('NEWS', 'BREAKING', tgMsg, dedupeChunk);
    }

    // 4. Return summary to the cron-job log
    res.status(200).json({ 
      success: true, 
      message: 'Autonomous Cycle Completed',
      alerts_sent: alertsFired 
    });

  } catch (error) {
    console.error("Cron Execution Error:", error);
    res.status(500).json({ error: 'Cron Failure', details: error.message });
  }
}
