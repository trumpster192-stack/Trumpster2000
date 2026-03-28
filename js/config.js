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
    VANTAGE_KEY       : '0AQFRLJK08VO4WZV', // Default key
    FINNHUB_KEY       : 'd73vkbhr01qno4pvskt0d73vkbhr01qno4pvsktg',
    POLYGON_KEY       : 'a8aMBxrSJnA5JypSfnfXzWHYj57X3AGe'
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
