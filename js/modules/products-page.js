import { productService } from '../services/productService.js';
import { productDetailPage } from './product-detail-page.js';

const main = document.querySelector('#main-content');
const productView = document.querySelector('[data-products-view]');
const detailView = document.querySelector('[data-product-detail-view]');
const status = document.querySelector('[data-products-status]');
const retryButton = document.querySelector('[data-products-retry]');
const grid = document.querySelector('[data-products-grid]');
const count = document.querySelector('[data-products-count]');
const filterWrap = document.querySelector('[data-products-refine-wrap]');
const filterMenu = document.querySelector('[data-products-filter-menu]');
const refineButton = document.querySelector('[data-products-refine]');
const categoryFilters = [...document.querySelectorAll('[data-filter-category]')];
const brandFilters = [...document.querySelectorAll('[data-filter-brand]')];
const productsMenuLink = document.querySelector('.site-menu__category[href="#products"]');

if (
  !(main instanceof HTMLElement) ||
  !(productView instanceof HTMLElement) ||
  !(detailView instanceof HTMLElement) ||
  !(status instanceof HTMLElement) ||
  !(retryButton instanceof HTMLButtonElement) ||
  !(grid instanceof HTMLUListElement) ||
  !(count instanceof HTMLElement) ||
  !(filterWrap instanceof HTMLElement) ||
  !(filterMenu instanceof HTMLElement) ||
  !(refineButton instanceof HTMLButtonElement) ||
  !(productsMenuLink instanceof HTMLAnchorElement) ||
  categoryFilters.length === 0 ||
  brandFilters.length === 0 ||
  categoryFilters.some((button) => !(button instanceof HTMLButtonElement)) ||
  brandFilters.some((button) => !(button instanceof HTMLButtonElement))
) {
  throw new Error('전체 제품 화면을 초기화할 수 없습니다.');
}

/** @type {import('../types/product.js').Product[] | null} */
let allProducts = null;
/** @type {Promise<void> | null} */
let loadingPromise = null;
let selectedCategory = 'all';
const selectedBrands = new Set();
const homeTitle = document.title;
const homeSections = [...main.querySelectorAll(':scope > section:not([data-products-view])')];
let previousScrollY = window.scrollY;
let scrollFrame = 0;
let previousRoute = '';

const updateRefineBoundary = () => {
  const bottomBeforeUpdate = productView.getBoundingClientRect().bottom;
  const previousReservedHeight =
    Number.parseFloat(productView.style.getPropertyValue('--index-products-refine-height')) || 0;
  const isAtMainEnd = bottomBeforeUpdate <= window.innerHeight + 2;
  const nextReservedHeight = isAtMainEnd ? filterWrap.offsetHeight : 0;

  productView.classList.toggle('index-products--refine-clamped', isAtMainEnd);
  filterWrap.classList.toggle('index-products__refine-wrap--at-main-end', isAtMainEnd);

  if (isAtMainEnd) {
    productView.style.setProperty('--index-products-refine-height', `${nextReservedHeight}px`);
  } else {
    productView.style.removeProperty('--index-products-refine-height');
  }

  const addedHeight = nextReservedHeight - previousReservedHeight;
  if (addedHeight > 0 && bottomBeforeUpdate <= window.innerHeight + 2) {
    previousScrollY += addedHeight;
    window.scrollBy(0, addedHeight);
  }
};

const setStatus = (message, { loading = false, error = false } = {}) => {
  status.textContent = message;
  status.hidden = !message;
  status.classList.toggle('is-loading', loading);
  status.setAttribute('role', error ? 'alert' : 'status');
  retryButton.hidden = !error;
};

const getProductCategory = (product) => {
  const series = product.series.toLowerCase();
  if (product.category === 'phones') {
    return 'phones';
  }
  if (series.includes('watch')) {
    return 'watches';
  }
  if (/cushion|accessor/.test(series)) {
    return 'accessories';
  }
  if (product.category === 'audio' || /headphone|ear|buds|speaker|clip/.test(series)) {
    return 'audio';
  }
  return 'accessories';
};

const renderProducts = (products) => {
  if (!Array.isArray(products)) {
    throw new TypeError('제품 목록 형식이 올바르지 않습니다.');
  }

  if (products.length === 0) {
    grid.replaceChildren();
    grid.hidden = true;
    count.textContent = '선택한 조건에 맞는 제품이 없습니다.';
    setStatus('선택한 조건에 맞는 제품이 없습니다.');
    updateRefineBoundary();
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach((product, index) => {
    const card = document.createElement('li');
    card.className = 'index-products__card';
    if (products.length === 61 && product.order === 61) {
      card.classList.add('index-products__card--last');
    }

    const figure = document.createElement('figure');
    figure.className = 'index-products__figure';

    const image = document.createElement('img');
    image.className = 'index-products__image';
    image.src = new URL(product.imageUrl, document.baseURI).href;
    image.alt = product.alt;
    image.width = 800;
    image.height = 800;
    image.decoding = 'async';
    image.loading = index < 5 ? 'eager' : 'lazy';
    figure.append(image);

    const caption = document.createElement('figcaption');
    caption.className = 'index-products__caption';
    if (product.brand === 'CMF') {
      const brand = document.createElement('span');
      brand.className = 'index-products__brand';
      brand.textContent = product.brand;
      caption.append(brand);
    }

    const name = document.createElement('span');
    name.className = 'index-products__name';
    name.textContent = product.series || product.name;
    caption.append(name);

    const link = document.createElement('a');
    link.className = 'index-products__link';
    link.href = `#product/${encodeURIComponent(product.id)}`;
    link.setAttribute('aria-label', `${product.series || product.name}, ${product.color} 상세 보기`);
    link.append(figure, caption);
    card.append(link);
    fragment.append(card);
  });

  grid.replaceChildren(fragment);
  grid.hidden = false;
  count.textContent = `${products.length}개 제품이 표시되었습니다.`;
  setStatus('');
  updateRefineBoundary();
};

const applyFilters = () => {
  if (!allProducts) {
    return;
  }

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || getProductCategory(product) === selectedCategory;
    const matchesBrand =
      selectedBrands.size === 0 ||
      selectedBrands.size === brandFilters.length ||
      selectedBrands.has(product.brand);
    return matchesCategory && matchesBrand;
  });

  renderProducts(filteredProducts);
};

const syncFilterChoices = () => {
  categoryFilters.forEach((button) => {
    const isSelected = button.dataset.filterCategory === selectedCategory;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
  brandFilters.forEach((button) => {
    const isSelected = selectedBrands.has(button.dataset.filterBrand);
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
};

const isProduct = (product) =>
  product !== null &&
  typeof product === 'object' &&
  typeof product.id === 'string' &&
  typeof product.name === 'string' &&
  typeof product.series === 'string' &&
  (product.brand === 'NOTHING' || product.brand === 'CMF') &&
  typeof product.category === 'string' &&
  typeof product.color === 'string' &&
  typeof product.imageUrl === 'string' &&
  typeof product.alt === 'string' &&
  typeof product.order === 'number' &&
  typeof product.createdAt === 'string' &&
  typeof product.updatedAt === 'string';

const loadProducts = async () => {
  if (allProducts) {
    applyFilters();
    return;
  }
  if (loadingPromise) {
    await loadingPromise;
    return;
  }

  productView.setAttribute('aria-busy', 'true');
  grid.hidden = true;
  retryButton.hidden = true;
  setStatus('제품 목록을 불러오는 중입니다.', { loading: true });

  loadingPromise = (async () => {
    try {
      const products = await productService.getAll();
      if (!Array.isArray(products) || !products.every(isProduct)) {
        throw new TypeError('제품 목록 형식이 올바르지 않습니다.');
      }
      allProducts = products;
      applyFilters();
    } catch (error) {
      console.error('제품 목록을 불러오지 못했습니다.', error);
      setStatus(
        error instanceof Error ? error.message : '제품 목록을 불러오지 못했습니다.',
        { error: true },
      );
    } finally {
      productView.setAttribute('aria-busy', 'false');
      loadingPromise = null;
      updateRefineBoundary();
    }
  })();

  await loadingPromise;
};

const updateRoute = () => {
  const hash = window.location.hash;
  const isProductsRoute = hash === '#products';
  const productRouteMatch = hash.match(/^#product\/(.+)$/);
  let productId = null;
  if (productRouteMatch) {
    try {
      productId = decodeURIComponent(productRouteMatch[1]);
    } catch (error) {
      console.error('제품 경로를 해석하지 못했습니다.', error);
    }
  }
  const isDetailRoute = productId !== null && productId.length > 0;
  const currentRoute = isProductsRoute ? 'products' : isDetailRoute ? 'detail' : 'home';

  homeSections.forEach((section) => {
    section.hidden = currentRoute !== 'home';
  });
  productView.hidden = !isProductsRoute;
  detailView.hidden = !isDetailRoute;
  if (!isDetailRoute) {
    productDetailPage.deactivate();
  }
  if (isProductsRoute) {
    productsMenuLink.setAttribute('aria-current', 'page');
  } else {
    productsMenuLink.removeAttribute('aria-current');
  }

  if (isProductsRoute) {
    document.title = '전체 제품 | Nothing';
    window.scrollTo({ top: 0, behavior: 'auto' });
    void loadProducts();
    window.requestAnimationFrame(updateRefineBoundary);
    previousRoute = currentRoute;
    return;
  }

  if (isDetailRoute && productId) {
    productsMenuLink.removeAttribute('aria-current');
    void productDetailPage.load(productId);
    if (previousRoute !== 'detail') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    previousRoute = currentRoute;
    return;
  }

  document.title = homeTitle;
  previousRoute = currentRoute;
};

updateRefineBoundary();

window.addEventListener('scroll', () => {
  if (scrollFrame || productView.hidden) {
    return;
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    const currentScrollY = window.scrollY;
    const hasVisibleKeyboardFocus =
      document.activeElement instanceof HTMLElement &&
      filterWrap.contains(document.activeElement) &&
      document.activeElement.matches(':focus-visible');
    const isFilterOpen = refineButton.getAttribute('aria-expanded') === 'true';

    if (isFilterOpen || hasVisibleKeyboardFocus || currentScrollY < previousScrollY) {
      filterWrap.classList.remove('index-products__refine-wrap--hidden');
    } else if (currentScrollY > previousScrollY) {
      filterWrap.classList.add('index-products__refine-wrap--hidden');
    }

    updateRefineBoundary();
    previousScrollY = currentScrollY;
  });
}, { passive: true });

window.addEventListener('resize', updateRefineBoundary, { passive: true });

refineButton.addEventListener('click', () => {
  const isExpanded = refineButton.getAttribute('aria-expanded') === 'true';
  refineButton.setAttribute('aria-expanded', String(!isExpanded));
  filterMenu.hidden = isExpanded;
  filterWrap.classList.remove('index-products__refine-wrap--hidden');
  updateRefineBoundary();
});

categoryFilters.forEach((button) => {
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.filterCategory ?? 'all';
    syncFilterChoices();
    applyFilters();
  });
});

brandFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const brand = button.dataset.filterBrand;
    if (!brand) {
      return;
    }

    if (selectedBrands.has(brand)) {
      selectedBrands.delete(brand);
    } else {
      selectedBrands.add(brand);
    }

    syncFilterChoices();
    applyFilters();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && refineButton.getAttribute('aria-expanded') === 'true') {
    filterMenu.hidden = true;
    refineButton.setAttribute('aria-expanded', 'false');
    refineButton.focus();
  }
});

retryButton.addEventListener('click', () => {
  void loadProducts();
});

window.addEventListener('hashchange', updateRoute);
updateRoute();
