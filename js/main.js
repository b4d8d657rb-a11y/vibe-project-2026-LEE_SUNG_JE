import { initializeCollectionSliders } from './modules/collection-slider.js';
import { initializeHeaderScroll } from './modules/header-scroll.js';
import { initializeNoticeTicker } from './modules/notice-ticker.js';

const menuToggle = document.querySelector('[data-menu-toggle]');
const menuToggleMark = menuToggle?.querySelector('.header__menu-mark');
const menu = document.querySelector('#site-menu');
const menuPanel = menu?.querySelector('.site-menu__panel');
const mainVideo = document.querySelector('[data-main-video]');
const mainVideoToggle = document.querySelector('[data-main-video-toggle]');
const filmVideo = document.querySelector('[data-film-video]');
const filmControls = document.querySelector('[data-film-controls]');
const filmToggle = document.querySelector('[data-film-toggle]');
const filmPlayIcon = document.querySelector('[data-film-play-icon]');
const filmSeek = document.querySelector('[data-film-seek]');
const filmMute = document.querySelector('[data-film-mute]');
const communityConsent = document.querySelector('[data-community-consent]');
const communitySubmit = document.querySelector('[data-community-submit]');
if (
  !(menuToggle instanceof HTMLButtonElement) ||
  !(menuToggleMark instanceof HTMLImageElement) ||
  !(menu instanceof HTMLElement) ||
  !(menuPanel instanceof HTMLElement) ||
  !(mainVideo instanceof HTMLVideoElement) ||
  !(mainVideoToggle instanceof HTMLButtonElement) ||
  !(filmVideo instanceof HTMLVideoElement) ||
  !(filmControls instanceof HTMLDivElement) ||
  !(filmToggle instanceof HTMLButtonElement) ||
  !(filmPlayIcon instanceof HTMLSpanElement) ||
  !(filmSeek instanceof HTMLInputElement) ||
  !(filmMute instanceof HTMLButtonElement) ||
  !(communityConsent instanceof HTMLInputElement) ||
  !(communitySubmit instanceof HTMLButtonElement)
) {
  throw new Error('The page controls could not be initialized.');
}

const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let isVideoPlaying = false;

const updateCommunitySubmit = () => {
  communitySubmit.disabled = !communityConsent.checked;
};

communityConsent.addEventListener('change', updateCommunitySubmit);
updateCommunitySubmit();

const updateVideoToggle = () => {
  const label = isVideoPlaying ? '영상 일시정지' : '영상 재생';
  mainVideoToggle.textContent = label;
  mainVideoToggle.setAttribute('aria-label', label);
};

mainVideo.addEventListener('play', () => {
  isVideoPlaying = true;
  updateVideoToggle();
});

mainVideo.addEventListener('pause', () => {
  isVideoPlaying = false;
  updateVideoToggle();
});

mainVideoToggle.addEventListener('click', () => {
  if (mainVideo.paused) {
    mainVideo.play().catch((error) => {
      console.error('The hero video could not be played.', error);
    });
  } else {
    mainVideo.pause();
  }
});

const updateFilmControls = () => {
  const isPlaying = !filmVideo.paused;
  filmPlayIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
  filmToggle.setAttribute('aria-label', isPlaying ? '영상 일시정지' : '영상 재생');
  filmMute.setAttribute('aria-pressed', String(filmVideo.muted));
  filmMute.setAttribute('aria-label', filmVideo.muted ? '음소거 해제' : '음소거');
};

const updateFilmSeek = () => {
  const duration = filmVideo.duration;
  const progress = Number.isFinite(duration) && duration > 0
    ? filmVideo.currentTime / duration
    : 0;
  const value = Math.round(progress * Number(filmSeek.max));
  filmSeek.value = String(value);
  filmSeek.style.setProperty('--film-progress', `${progress * 100}%`);
};

const showFilmControls = () => {
  filmControls.hidden = false;
};

filmVideo.addEventListener('click', showFilmControls);
filmVideo.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && filmControls.hidden) {
    event.preventDefault();
    showFilmControls();
  }
});
filmVideo.addEventListener('play', updateFilmControls);
filmVideo.addEventListener('pause', updateFilmControls);
filmVideo.addEventListener('volumechange', updateFilmControls);
filmVideo.addEventListener('timeupdate', updateFilmSeek);
filmVideo.addEventListener('loadedmetadata', updateFilmSeek);
filmVideo.addEventListener('error', () => {
  console.error('The full-screen film could not be loaded.', filmVideo.error);
});

filmToggle.addEventListener('click', () => {
  if (filmVideo.paused) {
    filmVideo.play().catch((error) => {
      console.error('The full-screen film could not be played.', error);
    });
  } else {
    filmVideo.pause();
  }
});

filmSeek.addEventListener('input', () => {
  if (Number.isFinite(filmVideo.duration) && filmVideo.duration > 0) {
    filmVideo.currentTime = (Number(filmSeek.value) / Number(filmSeek.max)) * filmVideo.duration;
  }
});

filmMute.addEventListener('click', () => {
  filmVideo.muted = !filmVideo.muted;
});

updateFilmControls();
updateFilmSeek();

reducedMotionPreference.addEventListener('change', (event) => {
  if (event.matches) {
    mainVideo.pause();
    filmVideo.pause();
  }
});

if (!reducedMotionPreference.matches) {
  mainVideo.play().catch((error) => {
    console.error('The hero video could not autoplay.', error);
  });
  filmVideo.play().catch((error) => {
    console.error('The full-screen film could not autoplay.', error);
  });
}
updateVideoToggle();

const finishMenuClose = () => {
  menu.classList.remove('is-visible');
  menu.setAttribute('aria-hidden', 'true');
  menu.inert = true;
  document.body.classList.remove('menu-open');
};

const setMenuOpen = (isOpen, shouldFocusToggle = true) => {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '전체 메뉴 닫기' : '전체 메뉴 열기');
  menuToggleMark.src = isOpen ? 'images/d/menu_1.svg' : 'images/d/hbg.svg';

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

initializeCollectionSliders();
initializeHeaderScroll();
void initializeNoticeTicker();