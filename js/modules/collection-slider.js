export const initializeCollectionSliders = () => {
  const SwiperConstructor = globalThis.Swiper;
  const featuredSlider = document.querySelector('[data-collection-featured]');
  const featuredScrollbar = document.querySelector('[data-collection-featured-scrollbar]');
  const gallerySlider = document.querySelector('[data-collection-gallery]');
  const featuredPrevious = document.querySelector('[data-collection-featured-prev]');
  const featuredNext = document.querySelector('[data-collection-featured-next]');
  const galleryPrevious = document.querySelector('[data-collection-gallery-prev]');
  const galleryNext = document.querySelector('[data-collection-gallery-next]');

  if (
    typeof SwiperConstructor !== 'function' ||
    !(featuredSlider instanceof HTMLElement) ||
    !(featuredScrollbar instanceof HTMLElement) ||
    !(gallerySlider instanceof HTMLElement) ||
    !(featuredPrevious instanceof HTMLButtonElement) ||
    !(featuredNext instanceof HTMLButtonElement) ||
    !(galleryPrevious instanceof HTMLButtonElement) ||
    !(galleryNext instanceof HTMLButtonElement)
  ) {
    throw new Error('The collection sliders could not be initialized.');
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = prefersReducedMotion ? 0 : 450;
  const autoplay = prefersReducedMotion
    ? false
    : {
        delay: 3000,
        disableOnInteraction: false,
      };
  const accessibility = {
    prevSlideMessage: '이전 슬라이드',
    nextSlideMessage: '다음 슬라이드',
  };

  new SwiperConstructor(featuredSlider, {
    a11y: accessibility,
    autoplay,
    grabCursor: true,
    navigation: {
      prevEl: featuredPrevious,
      nextEl: featuredNext,
    },
    scrollbar: {
      el: featuredScrollbar,
      draggable: true,
      hide: false,
      snapOnRelease: true,
    },
    slidesPerView: 1,
    speed,
    watchOverflow: true,
  });

  new SwiperConstructor(gallerySlider, {
    a11y: accessibility,
    autoplay,
    breakpoints: {
      640: {
        slidesPerView: 1.5,
      },
      768: {
        slidesPerView: 2,
      },
    },
    grabCursor: true,
    navigation: {
      prevEl: galleryPrevious,
      nextEl: galleryNext,
    },
    slidesPerView: 1.15,
    spaceBetween: 16,
    speed,
    watchOverflow: true,
  });
};
