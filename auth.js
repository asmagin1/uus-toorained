window.login = async function (email, password) {
  try {
    if (!window.supabaseClient) {
      throw new Error('supabaseClient puudub');
    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert('Sisselogimine ebaõnnestus: ' + error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('login error', err);
    alert('Sisselogimise viga: ' + (err.message || String(err)));
    return null;
  }
};

window.logout = async function () {
  try {
    if (!window.supabaseClient) {
      throw new Error('supabaseClient puudub');
    }

    await window.supabaseClient.auth.signOut();
    location.reload();
  } catch (err) {
    console.error('logout error', err);
    alert('Väljalogimise viga: ' + (err.message || String(err)));
  }
};

window.getCurrentUser = async function () {
  try {
    if (!window.supabaseClient) {
      throw new Error('supabaseClient puudub');
    }

    const { data, error } = await window.supabaseClient.auth.getUser();
    if (error) {
      console.error('getUser error', error);
      return null;
    }
    return data.user || null;
  } catch (err) {
    console.error('getCurrentUser error', err);
    return null;
  }
};
