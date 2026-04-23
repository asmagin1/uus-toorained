(function () {
  if (!window.APP_CONFIG) {
    console.error('APP_CONFIG puudub');
    return;
  }

  if (!window.supabase) {
    console.error('Supabase CDN puudub');
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    window.APP_CONFIG.SUPABASE_URL,
    window.APP_CONFIG.SUPABASE_ANON_KEY
  );
})();
