export const initializeHeaderScroll = () => {
  const header = document.querySelector('.site-header');
  const mainContent = document.querySelector('#main-content');

  if (!(header instanceof HTMLElement) || !(mainContent instanceof HTMLElement)) {
    throw new Error('The header scroll controls could not be initialized.');
  }

  const desktopViewport = window.matchMedia('(min-width: 1025px)');
  const handleMainContentWheel = (event) => {
    if (!desktopViewport.matches || document.body.classList.contains('menu-open')) {
      return;
    }

    const hasVisibleKeyboardFocus =
      document.activeElement instanceof HTMLElement &&
      header.contains(document.activeElement) &&
      document.activeElement.matches(':focus-visible');

    if (hasVisibleKeyboardFocus) {
      header.classList.remove('is-hidden');
      return;
    }

    if (event.deltaY > 0) {
      header.classList.add('is-hidden');
    } else if (event.deltaY < 0) {
      header.classList.remove('is-hidden');
    }
  };

  const handleViewportChange = () => {
    if (!desktopViewport.matches) {
      header.classList.remove('is-hidden');
    }
  };

  mainContent.addEventListener('wheel', handleMainContentWheel, { passive: true });
  desktopViewport.addEventListener('change', handleViewportChange);
};
