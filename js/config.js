/**
 * ============================================================
 *  TRUMPSTER 2000 — config.js
 *  The Greatest Configuration Ever Built.
 * ============================================================
 */

window.TRUMPSTER_CONFIG = {
    // These will be replaced by Vercel environment variables during build
    // Or you can manually replace them for local testing.
    SUPABASE_URL      : 'https://jjcplqmdlbzkaxhkfdli.supabase.co',
    SUPABASE_ANON_KEY : 'sb_secret_p0ivG9uPo5pfyiglYyIqnw_BsJz4o89',
    
    // API Keys (Placeholders for Vercel)
    VANTAGE_KEY       : '0AQFRLJK08VO4WZV',
    FINNHUB_KEY       : 'd73vkbhr01qno4pvskt0d73vkbhr01qno4pvsktg',
    POLYGON_KEY       : 'a8aMBxrSJnA5JypSfnfXzWHYj57X3AGe',
    FRED_KEY          : '48bf00ac5df3a0548ae2df72648a0de8'
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
