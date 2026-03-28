/**
 * ============================================================
 *  TRUMPSTER 2000 — config.js
 *  The Greatest Configuration Ever Built.
 * ============================================================
 */

window.TRUMPSTER_CONFIG = {
    // These will be replaced by Vercel environment variables during build
    // Or you can manually replace them for local testing.
    SUPABASE_URL      : '__SUPABASE_URL__',
    SUPABASE_ANON_KEY : '__SUPABASE_ANON_KEY__',
    
    // API Keys (Placeholders for Vercel)
    VANTAGE_KEY       : '__VANTAGE_KEY__',
    FINNHUB_KEY       : '__FINNHUB_KEY__',
    POLYGON_KEY       : '__POLYGON_KEY__',
    FRED_KEY          : '__FRED_KEY__'
};

// Initialize Supabase Client
// We only initialize if the keys have been replaced (not equal to placeholders)
const isConfigured = 
    window.TRUMPSTER_CONFIG.SUPABASE_URL && 
    window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY && 
    window.TRUMPSTER_CONFIG.SUPABASE_URL !== '__SUPABASE_URL__';

if (isConfigured) {
    window.supabaseClient = supabase.createClient(
        window.TRUMPSTER_CONFIG.SUPABASE_URL, 
        window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY
    );
    console.log("MAGA: Supabase Telemetry Connected.");
} else {
    const msg = "MAGA: Supabase Keys missing. Trade history NOT CONNECTED. (Set SUPABASE_URL & SUPABASE_ANON_KEY in Vercel settings!)";
    console.warn(msg);
}
