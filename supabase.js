(function () {
  function isConfigured() {
    return !!(window.APP_CONFIG && APP_CONFIG.SUPABASE_URL && APP_CONFIG.SUPABASE_ANON_KEY && window.supabase);
  }
  function isEnabled() {
    return !!(window.APP_CONFIG && APP_CONFIG.DATA_MODE === 'supabase' && isConfigured());
  }
  function getClient() {
    if (!isEnabled()) return null;
    if (!window.__ttSupabaseClient) {
      window.__ttSupabaseClient = window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY);
    }
    return window.__ttSupabaseClient;
  }
  window.AppSupabase = { isConfigured, isEnabled, getClient };
})();
