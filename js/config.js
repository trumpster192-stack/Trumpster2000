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
    SUPABASE_ANON_KEY : 'sb_publishable_42sD3WdanDiRF_Ca7OqfAA_jLXJhHXs'
};

// Unconditionally initialize Supabase to prevent Vercel environment replacement bugs
const supaUrl = window.TRUMPSTER_CONFIG.SUPABASE_URL !== '__SUPABASE_URL__' ? window.TRUMPSTER_CONFIG.SUPABASE_URL : 'https://jjcplqmdlbzkaxhkfdli.supabase.co';
const supaKey = window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY !== '__SUPABASE_ANON_KEY__' ? window.TRUMPSTER_CONFIG.SUPABASE_ANON_KEY : 'sb_publishable_42sD3WdanDiRF_Ca7OqfAA_jLXJhHXs';

try {
    window.supabaseClient = supabase.createClient(supaUrl, supaKey);
    console.log("MAGA: Supabase Telemetry Connected.");
} catch (e) {
    console.warn("MAGA: Supabase initialization failed.", e);
}
