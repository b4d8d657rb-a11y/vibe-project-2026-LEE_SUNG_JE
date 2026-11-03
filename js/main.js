const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('#site-menu');
const menuClose = document.querySelector('[data-menu-close]');
const menuPanel = menu?.querySelector('.site-menu__panel');
const menuCloseMark = menuClose?.querySelector('.site-menu__close-mark');
const menuFocusableElements = menu?.querySelectorAll('button:not([disabled]), a[href]');
const backgroundElements = [
  document.querySelector('main'),
  document.querySelector('.site-footer'),
];

if (
  !(menuToggle instanceof HTMLButtonElement) ||
  !(menu instanceof HTMLElement) ||
  !(menuClose instanceof HTMLButtonElement) ||
  !(menuPanel instanceof HTMLElement) ||
  !(menuCloseMark instanceof HTMLImageElement) ||
  !(menuFocusableElements instanceof NodeList) ||
  backgroundElements.some((element) => !(element instanceof HTMLElement))
) {
  throw new Error('The full-screen menu could not be initialized.');
}

const finishMenuClose = () => {
  menuCloseMark.src = 'images/d/hbg.svg';
  menu.classList.remove('is-visible');
  menu.setAttribute('aria-hidden', 'true');
  menu.inert = true;
  document.body.classList.remove('menu-open');
  backgroundElements.forEach((element) => {
    element.inert = false;
  });
};

const setMenuOpen = (isOpen) => {
  menuToggle.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    menuCloseMark.src = 'images/d/menu_1.svg';
    document.body.classList.add('menu-open');
    backgroundElements.forEach((element) => {
      element.inert = true;
    });
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-visible');
    window.requestAnimationFrame(() => {
      if (menuToggle.getAttribute('aria-expanded') === 'true') {
        menu.classList.add('is-open');
        menuClose.focus();
      }
    });
    return;
  }

  const wasOpen = menu.classList.contains('is-open');
  menu.classList.remove('is-open');
  menuCloseMark.src = 'images/d/hbg.svg';
  menuToggle.focus();
  if (!wasOpen) {
    finishMenuClose();
  }
};

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menuClose.addEventListener('click', () => {
  setMenuOpen(false);
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
    return;
  }

  if (event.key !== 'Tab' || menuFocusableElements.length === 0) {
    return;
  }

  const firstElement = menuFocusableElements[0];
  const lastElement = menuFocusableElements[menuFocusableElements.length - 1];
  if (!menu.contains(document.activeElement)) {
    event.preventDefault();
    menuClose.focus();
  } else if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

menu.addEventListener('transitionend', (event) => {
  if (
    event.target !== menuPanel ||
    event.propertyName !== 'transform' ||
    menu.classList.contains('is-open')
  ) {
    return;
  }

  finishMenuClose();
});