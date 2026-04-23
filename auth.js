window.login = async function (email, password) {
  try {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    console.log('LOGIN DATA:', data);
    console.log('LOGIN ERROR:', error);

    if (error) return null;
    return data;
  } catch (err) {
    console.error('login error', err);
    return null;
  }
};

window.logout = async function () {
  try {
    await window.supabaseClient.auth.signOut();
    window.location.href = 'index.html';
  } catch (err) {
    console.error('logout error', err);
  }
};
