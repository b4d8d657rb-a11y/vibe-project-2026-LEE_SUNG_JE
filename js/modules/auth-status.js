import { ADMIN_EMAIL, authService } from '../services/auth-service.js';

const openAuthWindow = (url) => {
  const authWindow = window.open(url, 'nothing-auth', 'popup,width=520,height=820,resizable=yes,scrollbars=yes');
  if (authWindow) {
    authWindow.focus();
    return;
  }
  window.location.assign(url);
};

export const initializeAuthStatus = () => {
  const openButtons = document.querySelectorAll('[data-auth-open]');
  openButtons.forEach((button) => {
    button.addEventListener('click', () => openAuthWindow(button.dataset.authUrl ?? ''));
  });

  document.querySelectorAll('[data-auth-status]').forEach((status) => {
    const greeting = status.querySelector('[data-auth-greeting]');
    const toggle = status.querySelector('[data-auth-toggle]');
    if (!(greeting instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) return;

    authService.subscribe((user) => {
      const isSignedIn = Boolean(user && !user.isAnonymous);
      const name = user?.displayName || (user?.email === ADMIN_EMAIL ? '관리자' : '사용자');
      greeting.textContent = isSignedIn ? `${name}님 환영합니다` : '';
      greeting.hidden = !isSignedIn;
      toggle.textContent = isSignedIn ? '로그아웃' : '로그인';
      toggle.setAttribute('aria-label', isSignedIn ? '로그아웃' : '로그인');
    });

    toggle.addEventListener('click', async () => {
      if (toggle.textContent === '로그인') {
        openAuthWindow(toggle.dataset.authUrl ?? '');
        return;
      }
      toggle.disabled = true;
      try {
        await authService.signOut();
      } catch (error) {
        console.error('로그아웃하지 못했습니다.', error);
      } finally {
        toggle.disabled = false;
      }
    });
  });
};
