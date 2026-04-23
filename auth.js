(function () {
  const SESSION_KEY = 'toorained_session_v56';
  const USERS_KEY = 'toorained_users_v56';

  function deriveNames(email) {
    const base = (email || '').split('@')[0] || '';
    const clean = base.replace(/[._-]+/g, ' ').trim();
    return { firstName: clean || email || 'Kasutaja', lastName: '' };
  }

  async function bootstrapAuthState() {
    if (!window.AppSupabase?.isEnabled?.()) return null;
    const client = window.AppSupabase.getClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const email = data.user.email || '';
    const { data: profile } = await client.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
    const names = deriveNames(email);
    const user = {
      login: email,
      email,
      password: '',
      firstName: profile?.first_name || names.firstName,
      lastName: profile?.last_name || names.lastName,
      isSuperuser: !!profile?.is_superuser,
      lastLoginAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      lastPage: location.pathname.split('/').pop() || ''
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ login: email }));
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = users.findIndex(u => u.login === email);
    if (idx >= 0) users[idx] = { ...users[idx], ...user };
    else users.unshift(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return user;
  }

  async function login(email, password) {
    if (!window.AppSupabase?.isEnabled?.()) throw new Error('Supabase ei ole seadistatud');
    const client = window.AppSupabase.getClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return bootstrapAuthState();
  }

  async function logout() {
    if (window.AppSupabase?.isEnabled?.()) {
      const client = window.AppSupabase.getClient();
      await client.auth.signOut();
    }
    localStorage.removeItem(SESSION_KEY);
    location.href = 'index.html';
  }

  function isEnabled() {
    return !!window.AppSupabase?.isEnabled?.();
  }

  window.AppAuth = { isEnabled, bootstrapAuthState, login, logout };
})();
