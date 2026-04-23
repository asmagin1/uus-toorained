(function () {
  const SAVE_TIMERS = new Map();
  const DEFAULT_KEYS = [];

  async function bootstrapState(keys) {
    if (!window.AppSupabase?.isEnabled?.()) return false;
    const client = window.AppSupabase.getClient();
    const { data, error } = await client.from('app_state').select('state_key,state_value').in('state_key', keys || DEFAULT_KEYS);
    if (error) throw error;
    (data || []).forEach(row => {
      localStorage.setItem(row.state_key, JSON.stringify(row.state_value));
    });
    return true;
  }

  async function saveStateNow(key, value) {
    if (!window.AppSupabase?.isEnabled?.()) return false;
    const client = window.AppSupabase.getClient();
    const payload = { state_key: key, state_value: value, updated_at: new Date().toISOString() };
    const { error } = await client.from('app_state').upsert(payload, { onConflict: 'state_key' });
    if (error) throw error;
    return true;
  }

  function queueStateSave(key, value) {
    if (!window.AppSupabase?.isEnabled?.()) return;
    clearTimeout(SAVE_TIMERS.get(key));
    const timer = setTimeout(() => {
      saveStateNow(key, value).catch(err => console.error('Supabase save error', key, err));
    }, 800);
    SAVE_TIMERS.set(key, timer);
  }

  function isReady() {
    return !!window.AppSupabase?.isEnabled?.();
  }

  window.AppDB = { bootstrapState, saveStateNow, queueStateSave, isReady };
})();
