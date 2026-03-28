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
    
    // Fallbacks or Defaults
    VANTAGE_KEY       : '__VANTAGE_KEY__',
    FINNHUB_KEY       : '__FINNHUB_KEY__',
    POLYGON_KEY       : '__POLYGON_KEY__'
};

// Initialize Supabase Client
if (window.TRUMPSTER_CONFIG.SUPABASE_URL && window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY && window.TRUMPSTER_CONFIG.SUPABASE_URL !== '__SUPABASE_URL__') {
    window.supabaseClient = supabase.createClient(
        window.TRUMPSTER_CONFIG.SUPABASE_URL, 
        window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY
    );
    console.log("MAGA: Supabase Telemetry Connected.");
} else {
    console.warn("MAGA: Supabase Keys missing. Trade history will be local only.");
}
