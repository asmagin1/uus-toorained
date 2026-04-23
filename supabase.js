(function () {
  try {
    window.supabaseClient = window.supabase.createClient(
      window.APP_CONFIG.SUPABASE_URL,
      window.APP_CONFIG.SUPABASE_ANON_KEY
    );
  } catch (err) {
    console.error('supabase init error', err);
  }
})();
