const menuIcons = {
  closed: new URL('../../images/d/hbg.svg', import.meta.url).href,
  open: new URL('../../images/d/menu_1.svg', import.meta.url).href,
};

export const initializeSiteMenu = () => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuToggleMark = menuToggle?.querySelector('.header__menu-mark');
  const menu = document.querySelector('#site-menu');
  const menuPanel = menu?.querySelector('.site-menu__panel');

  if (
    !(menuToggle instanceof HTMLButtonElement) ||
    !(menuToggleMark instanceof HTMLImageElement) ||
    !(menu instanceof HTMLElement) ||
    !(menuPanel instanceof HTMLElement)
  ) {
    throw new Error('The site menu could not be initialized.');
  }

  const finishMenuClose = () => {
    menu.classList.remove('is-visible');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
    document.body.classList.remove('menu-open');
  };

  const setMenuOpen = (isOpen, shouldFocusToggle = true) => {
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? '전체 메뉴 닫기' : '전체 메뉴 열기');
    menuToggleMark.src = isOpen ? menuIcons.open : menuIcons.closed;

    if (isOpen) {
      document.body.classList.add('menu-open');
      menu.inert = false;
      menu.setAttribute('aria-hidden', 'false');
      menu.classList.add('is-visible');
      window.requestAnimationFrame(() => {
        if (menuToggle.getAttribute('aria-expanded') === 'true') {
          menu.classList.add('is-open');
        }
      });
      return;
    }

    const wasOpen = menu.classList.contains('is-open');
    menu.classList.remove('is-open');
    if (shouldFocusToggle) {
      menuToggle.focus();
    }
    if (!wasOpen) {
      finishMenuClose();
    }
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-menu-link]')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (menuToggle.getAttribute('aria-expanded') !== 'true') {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (
      menuToggle.getAttribute('aria-expanded') === 'true' &&
      event.target instanceof Node &&
      !menuPanel.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenuOpen(false, false);
    }
  });

  menu.addEventListener('transitionend', (event) => {
    if (
      event.target !== menuPanel ||
      event.propertyName !== 'height' ||
      menu.classList.contains('is-open')
    ) {
      return;
    }

    finishMenuClose();
  });
};