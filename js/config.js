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

// Unconditionally initialize Supabase to prevent Vercel environment replacement bugs
const supaUrl = window.TRUMPSTER_CONFIG.SUPABASE_URL !== '__SUPABASE_URL__' ? window.TRUMPSTER_CONFIG.SUPABASE_URL : 'https://jjcplqmdlbzkaxhkfdli.supabase.co';
const supaKey = window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY !== '__SUPABASE_ANON_KEY__' ? window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY : 'sb_secret_p0ivG9uPo5pfyiglYyIqnw_BsJz4o89';

try {
    window.supabaseClient = supabase.createClient(supaUrl, supaKey);
    console.log("MAGA: Supabase Telemetry Connected.");
} catch (e) {
    console.warn("MAGA: Supabase initialization failed.", e);
}
