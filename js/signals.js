// js/signals.js
// 🦅 LOBOTOMIZED FRONTEND ENGINE (Ultra-Fast Thin Client)
'use strict';

async function scanWatchlist(symbols, onProgress) {
  try {
    if (onProgress) onProgress(20);
    
    // Hit the Centralized Backend Cache! Takes exactly 10ms if cached.
    const response = await fetch('/api/engine');
    if (!response.ok) throw new Error(`Engine Offline. HTTP ${response.status}`);
    
    if (onProgress) onProgress(60);
    
    const data = await response.json();
    
    // Store News globally so the dashboard 'loadRealNews' tab doesn't have to refetch it!
    window.MAGA_NEWS_CACHE = data.news || [];
    
    if (onProgress) onProgress(100);
    
    // Determine the signals based ONLY on what the user requested to scan in the frontend Array
    const requestedSignals = data.signals.filter(s => symbols.includes(s.symbol.replace('BTC-USD','BTC').replace('ETH-USD','ETH')));
    
    // If a requested symbol wasn't in the global engine array, fallback logic
    return requestedSignals.length > 0 ? requestedSignals : data.signals.slice(0, symbols.length);
  } catch (error) {
    console.error("Central Engine Connect Fail:", error);
    if (onProgress) onProgress(100);
    return [];
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
