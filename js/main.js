import { initializeCollectionSliders } from './modules/collection-slider.js';
import { initializeHeaderScroll } from './modules/header-scroll.js';
import { initializeSiteMenu } from './modules/site-menu.js';
import { initializeAuthStatus } from './modules/auth-status.js';
import { siteShellReady } from './modules/site-shell.js';

await siteShellReady;
initializeAuthStatus();

const mainVideo = document.querySelector('[data-main-video]');
const mainVideoToggle = document.querySelector('[data-main-video-toggle]');
const filmVideo = document.querySelector('[data-film-video]');
const filmControls = document.querySelector('[data-film-controls]');
const filmToggle = document.querySelector('[data-film-toggle]');
const filmPlayIcon = document.querySelector('[data-film-play-icon]');
const filmSeek = document.querySelector('[data-film-seek]');
const filmMute = document.querySelector('[data-film-mute]');
const communitySubmit = document.querySelector('[data-community-submit]');
if (
  !(mainVideo instanceof HTMLVideoElement) ||
  !(mainVideoToggle instanceof HTMLButtonElement) ||
  !(filmVideo instanceof HTMLVideoElement) ||
  !(filmControls instanceof HTMLDivElement) ||
  !(filmToggle instanceof HTMLButtonElement) ||
  !(filmPlayIcon instanceof HTMLSpanElement) ||
  !(filmSeek instanceof HTMLInputElement) ||
  !(filmMute instanceof HTMLButtonElement) ||
  !(communitySubmit instanceof HTMLButtonElement)
) {
  throw new Error('The page controls could not be initialized.');
}

const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let isVideoPlaying = false;

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

initializeSiteMenu();
initializeCollectionSliders();
initializeHeaderScroll();