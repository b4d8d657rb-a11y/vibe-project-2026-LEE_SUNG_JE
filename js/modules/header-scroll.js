export const initializeHeaderScroll = () => {
  const header = document.querySelector('.site-header');

  if (!(header instanceof HTMLElement)) {
    throw new Error('The site header could not be initialized.');
  }

  const desktopViewport = window.matchMedia('(min-width: 1025px)');
  let referenceScrollY = window.scrollY;
  let animationFrame = 0;

  const updateHeaderVisibility = () => {
    animationFrame = 0;

    if (!desktopViewport.matches || document.body.classList.contains('menu-open')) {
      header.classList.remove('is-hidden');
      referenceScrollY = window.scrollY;
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - referenceScrollY;

    const hasVisibleKeyboardFocus =
      document.activeElement instanceof HTMLElement &&
      header.contains(document.activeElement) &&
      document.activeElement.matches(':focus-visible');

    if (currentScrollY <= 0 || hasVisibleKeyboardFocus) {
      header.classList.remove('is-hidden');
      referenceScrollY = currentScrollY;
      return;
    }

    if (scrollDelta >= 8) {
      header.classList.add('is-hidden');
      referenceScrollY = currentScrollY;
    } else if (scrollDelta <= -4) {
      header.classList.remove('is-hidden');
      referenceScrollY = currentScrollY;
    }
  };

  const scheduleHeaderUpdate = () => {
    if (animationFrame === 0) {
      animationFrame = window.requestAnimationFrame(updateHeaderVisibility);
    }
  };

  window.addEventListener('scroll', scheduleHeaderUpdate, { passive: true });
  desktopViewport.addEventListener('change', scheduleHeaderUpdate);
};
