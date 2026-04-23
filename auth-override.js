(function () {
  async function getSessionSafe() {
    try {
      if (!window.supabaseClient) return null;
      const { data, error } = await window.supabaseClient.auth.getSession();
      if (error) {
        console.error('getSession error', error);
        return null;
      }
      return data.session || null;
    } catch (err) {
      console.error('getSession exception', err);
      return null;
    }
  }

  async function handleLoginForm() {
    const loginForm = document.querySelector('#loginForm');
    if (!loginForm) return false;

    const emailInput =
      document.querySelector('#email') ||
      document.querySelector('input[type="email"]') ||
      document.querySelector('input[name="email"]') ||
      document.querySelector('input[name="login"]');

    const passwordInput =
      document.querySelector('#password') ||
      document.querySelector('input[type="password"]') ||
      document.querySelector('input[name="password"]');

    const errorBox =
      document.querySelector('#loginError') ||
      document.querySelector('.login-error') ||
      document.querySelector('[data-login-error]');

    if (!emailInput || !passwordInput) {
      console.warn('Login inputs not found');
      return false;
    }

    const clonedForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(clonedForm, loginForm);

    clonedForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (errorBox) errorBox.textContent = '';

      const email = (document.querySelector('#email')?.value ||
        document.querySelector('input[type="email"]')?.value ||
        document.querySelector('input[name="email"]')?.value ||
        document.querySelector('input[name="login"]')?.value ||
        '').trim();

      const password = (document.querySelector('#password')?.value ||
        document.querySelector('input[type="password"]')?.value ||
        document.querySelector('input[name="password"]')?.value ||
        '');

      try {
        if (!window.login) {
          throw new Error('window.login puudub');
        }

        const result = await window.login(email, password);

        if (!result || !result.user) {
          if (errorBox) {
            errorBox.textContent = 'Vale kasutajanimi või parool';
          } else {
            alert('Vale kasutajanimi või parool');
          }
          return;
        }

        window.location.href = 'toorained.html';
      } catch (err) {
        console.error('Supabase login failed', err);
        if (errorBox) {
          errorBox.textContent = 'Vale kasutajanimi või parool';
        } else {
          alert('Vale kasutajanimi või parool');
        }
      }
    });

    return true;
  }

  async function protectInnerPages() {
    const isLoginPage =
      location.pathname.endsWith('/index.html') ||
      location.pathname.endsWith('/') ||
      /index\.html$/i.test(location.pathname);

    const session = await getSessionSafe();

    if (isLoginPage) {
      if (session) {
        window.location.href = 'toorained.html';
        return true;
      }
      return false;
    }

    if (!session) {
      window.location.href = 'index.html';
      return true;
    }

    return false;
  }

  function wireLogout() {
    const btn =
      document.querySelector('#logoutBtn') ||
      document.querySelector('[data-logout]');

    if (!btn || !window.supabaseClient) return;

    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      try {
        await window.supabaseClient.auth.signOut();
      } catch (err) {
        console.error('logout error', err);
      }
      window.location.href = 'index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const redirected = await protectInnerPages();
    if (redirected) return;

    await handleLoginForm();
    wireLogout();
  });
})();
