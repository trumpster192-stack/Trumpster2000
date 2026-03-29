// js/signals.js
// 🦅 LOBOTOMIZED FRONTEND ENGINE (Ultra-Fast Thin Client)
'use strict';

async function scanWatchlist(symbols, onProgress) {
  try {
    if (onProgress) onProgress(20);
    
    // Hit the Centralized Backend Cache — 10ms if cached, full compute if stale
    const response = await fetch('/api/engine');
    if (!response.ok) throw new Error(`Engine Offline. HTTP ${response.status}`);
    
    if (onProgress) onProgress(80);
    
    const data = await response.json();
    
    // Store News globally so loadRealNews() can use it without a second fetch
    window.MAGA_NEWS_CACHE = data.news || [];
    
    if (onProgress) onProgress(100);
    
    // Return all signals — engine order matches WATCHLIST in app.js exactly
    return data.signals || [];
  } catch (error) {
    console.error("Central Engine Connect Fail:", error);
    if (onProgress) onProgress(100);
    // Fallback: return empty placeholders matching the watchlist so UI doesn't break
    return symbols.map(sym => ({
      symbol: sym,
      action: 'WATCH/NEUTRAL',
      emoji: '👀',
      confidence: 70,
      price: 'N/A',
      changePct: 0,
      composite: 0
    }));
  }
}

// Minimal Lexicon for on-the-fly rendering if absolutely needed by older parts of app.js
function scoreText(text) {
  return 0; // Handled Backend now
}

// Export for global use in app.js
window.SignalEngine = {
  scoreText,
  scanWatchlist,
  // Ensure backward compatibility if anything else tries to call these:
  fetchNewsFromRSS: async () => window.MAGA_NEWS_CACHE || [],
  triggerTelegramAlert: () => {} // Handled Backend now
};
