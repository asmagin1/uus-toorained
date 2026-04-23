window.login = async function (email, password) {
  try {
    if (!window.supabaseClient) {
      throw new Error('supabaseClient puudub');
    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    console.log('LOGIN DATA:', data);
    console.log('LOGIN ERROR:', error);

    if (error) {
      alert('Sisselogimine ebaõnnestus: ' + error.message);
      return null;
    }

    alert('Sisselogimine õnnestus');
    return data;
  } catch (err) {
    console.error('login error', err);
    alert('Sisselogimise viga: ' + (err.message || String(err)));
    return null;
  }
};
