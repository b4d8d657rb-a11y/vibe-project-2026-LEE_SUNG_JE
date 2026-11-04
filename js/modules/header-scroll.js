export const initializeHeaderScroll = () => {
  const header = document.querySelector('.site-header');

  if (!(header instanceof HTMLElement)) {
    throw new Error('The header scroll controls could not be initialized.');
  }

  let previousScrollY = window.scrollY;
  let scrollFrame = 0;
  const handleWindowScroll = () => {
    if (scrollFrame) {
    return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    const currentScrollY = window.scrollY;
    const hasVisibleKeyboardFocus =
      document.activeElement instanceof HTMLElement &&
      header.contains(document.activeElement) &&
      document.activeElement.matches(':focus-visible');

    if (document.body.classList.contains('menu-open') || hasVisibleKeyboardFocus) {
      header.classList.remove('is-hidden');
    } else if (currentScrollY <= header.offsetHeight || currentScrollY < previousScrollY) {
      header.classList.remove('is-hidden');
    } else if (currentScrollY > previousScrollY) {
      header.classList.add('is-hidden');
    }

    previousScrollY = currentScrollY;
    });
  };

  window.addEventListener('scroll', handleWindowScroll, { passive: true });
};
