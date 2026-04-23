(function () {
  function findLoginForm() {
    return (
      document.querySelector('#loginForm') ||
      document.querySelector('form') ||
      null
    );
  }

  function findEmailInput(root) {
    return (
      root.querySelector('#email') ||
      root.querySelector('input[type="email"]') ||
      root.querySelector('input[name="email"]') ||
      root.querySelector('input[name="login"]') ||
      root.querySelector('input[type="text"]')
    );
  }

  function findPasswordInput(root) {
    return (
      root.querySelector('#password') ||
      root.querySelector('input[type="password"]') ||
      root.querySelector('input[name="password"]')
    );
  }

  function setError(message) {
    const box =
      document.querySelector('#loginError') ||
      document.querySelector('.login-error') ||
      document.querySelector('[data-login-error]');

    if (box) {
      box.textContent = message || '';
    } else if (message) {
      alert(message);
    }
  }

  async function doSupabaseLogin(email, password) {
    if (!window.login) throw new Error('window.login puudub');
    const result = await window.login(email, password);
    if (!result || !result.user) {
      throw new Error('Vale kasutajanimi või parool');
    }
    window.location.href = 'toorained.html';
  }

  function killOldHandlers(form) {
    const cleanForm = form.cloneNode(true);
    form.parentNode.replaceChild(cleanForm, form);
    return cleanForm;
  }

  function wireLogin(form) {
    const emailInput = findEmailInput(form);
    const passwordInput = findPasswordInput(form);

    if (!emailInput || !passwordInput) {
      console.error('Login fields not found');
      return;
    }

    const submitHandler = async function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') {
        e.stopImmediatePropagation();
      }

      setError('');

      const email = (findEmailInput(form)?.value || '').trim();
      const password = findPasswordInput(form)?.value || '';

      try {
        await doSupabaseLogin(email, password);
      } catch (err) {
        console.error('Supabase login failed', err);
        setError('Vale kasutajanimi või parool');
      }

      return false;
    };

    form.addEventListener('submit', submitHandler, true);
    form.addEventListener('submit', submitHandler, false);

    const buttons = form.querySelectorAll('button, input[type="submit"]');
    buttons.forEach((btn) => {
      btn.onclick = null;
      btn.addEventListener(
        'click',
        async function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === 'function') {
            e.stopImmediatePropagation();
          }

          setError('');

          const email = (findEmailInput(form)?.value || '').trim();
          const password = findPasswordInput(form)?.value || '';

          try {
            await doSupabaseLogin(email, password);
          } catch (err) {
            console.error('Supabase login failed', err);
            setError('Vale kasutajanimi või parool');
          }

          return false;
        },
        true
      );
    });
  }

  async function protectPages() {
    if (!window.supabaseClient) return;

    const isLoginPage =
      location.pathname.endsWith('/index.html') ||
      location.pathname === '/' ||
      /index\.html$/i.test(location.pathname);

    const { data } = await window.supabaseClient.auth.getSession();
    const session = data?.session || null;

    if (isLoginPage && session) {
      window.location.href = 'toorained.html';
      return true;
    }

    if (!isLoginPage && !session) {
      window.location.href = 'index.html';
      return true;
    }

    return false;
  }

  function wireLogout() {
    const logoutBtn =
      document.querySelector('#logoutBtn') ||
      document.querySelector('[data-logout]');

    if (!logoutBtn || !window.logout) return;

    logoutBtn.onclick = async function (e) {
      e.preventDefault();
      await window.logout();
      return false;
    };
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const redirected = await protectPages();
    if (redirected) return;

    const form = findLoginForm();
    if (!form) return;

    const cleanForm = killOldHandlers(form);
    wireLogin(cleanForm);
    wireLogout();
  });
})();
