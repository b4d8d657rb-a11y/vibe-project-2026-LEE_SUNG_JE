import { productService } from '../services/productService.js';

const page = document.querySelector('[data-products-page]');
const grid = document.querySelector('[data-products-grid]');
const status = document.querySelector('[data-products-status]');
const count = document.querySelector('[data-products-count]');
const refineButton = document.querySelector('[data-products-refine]');
const filterWrap = document.querySelector('[data-products-refine-wrap]');
const filterMenu = document.querySelector('[data-products-filter-menu]');
const main = document.querySelector('.products-main');
const categoryFilters = [...document.querySelectorAll('[data-filter-category]')];
const brandFilters = [...document.querySelectorAll('[data-filter-brand]')];

if (
  !(page instanceof HTMLElement) ||
  !(grid instanceof HTMLUListElement) ||
  !(status instanceof HTMLElement) ||
  !(count instanceof HTMLElement) ||
  !(refineButton instanceof HTMLButtonElement) ||
  !(filterWrap instanceof HTMLElement) ||
  !(filterMenu instanceof HTMLElement) ||
  !(main instanceof HTMLElement) ||
  categoryFilters.length === 0 ||
  brandFilters.length === 0 ||
  categoryFilters.some((button) => !(button instanceof HTMLButtonElement)) ||
  brandFilters.some((button) => !(button instanceof HTMLButtonElement))
) {
  throw new Error('전체 제품 섹션을 초기화할 수 없습니다.');
}

/** @type {import('../types/product.js').Product[]} */
let allProducts = [];
let selectedCategory = 'all';
let selectedBrands = new Set();

/**
 * @param {import('../types/product.js').Product[]} products
 */
const renderProducts = (products) => {
  if (!Array.isArray(products)) {
    throw new TypeError('제품 목록 형식이 올바르지 않습니다.');
  }

  if (products.length === 0) {
    status.textContent = '표시할 제품이 없습니다.';
    status.hidden = false;
    grid.hidden = true;
    count.textContent = '표시할 제품이 없습니다.';
    updateRefineBoundary();
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach((product, index) => {
    const card = document.createElement('li');
    card.className = 'products__card';
    if (products.length === 61 && product.order === 61) {
      card.classList.add('products__card--last');
    }

    const figure = document.createElement('figure');
    figure.className = 'products__figure';

    const image = document.createElement('img');
    image.className = 'products__image';
    image.src = new URL(product.imageUrl, document.baseURI).href;
    image.alt = product.alt;
    image.width = 800;
    image.height = 800;
    image.decoding = 'async';
    if (index < 5) {
      image.fetchPriority = 'high';
    } else {
      image.loading = 'lazy';
    }
    figure.append(image);

    const caption = document.createElement('figcaption');
    caption.className = 'products__caption';
    if (product.brand === 'CMF') {
      const brand = document.createElement('span');
      brand.className = 'products__brand';
      brand.textContent = product.brand;
      caption.append(brand);
    }

    const name = document.createElement('span');
    name.className = 'products__name';
    name.textContent = product.series;
    caption.append(name);

    card.append(figure, caption);
    fragment.append(card);
  });

  grid.replaceChildren(fragment);
  grid.hidden = false;
  status.hidden = true;
  count.textContent = `${products.length}개 제품이 표시되었습니다.`;
  updateRefineBoundary();
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

const applyFilters = () => {
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || getProductCategory(product) === selectedCategory;
    const matchesBrand = selectedBrands.size === 0 ||
      selectedBrands.size === brandFilters.length ||
      selectedBrands.has(product.brand);
    return matchesCategory && matchesBrand;
  });

  if (filteredProducts.length === 0) {
    status.textContent = '선택한 조건에 맞는 제품이 없습니다.';
    status.hidden = false;
    grid.hidden = true;
    count.textContent = '선택한 조건에 맞는 제품이 없습니다.';
    updateRefineBoundary();
    return;
  }

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

let previousScrollY = window.scrollY;
let scrollFrame = 0;
const updateRefineBoundary = () => {
  const isAtMainEnd = main.getBoundingClientRect().bottom <= window.innerHeight;
  main.classList.toggle('products-main--refine-clamped', isAtMainEnd);
  filterWrap.classList.toggle('products__refine-wrap--at-main-end', isAtMainEnd);

  if (isAtMainEnd) {
    main.style.setProperty('--products-refine-height', `${filterWrap.offsetHeight}px`);
  } else {
    main.style.removeProperty('--products-refine-height');
  }
};

updateRefineBoundary();
window.addEventListener('scroll', () => {
  if (scrollFrame) {
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
      filterWrap.classList.remove('products__refine-wrap--hidden');
    } else if (currentScrollY > previousScrollY) {
      filterWrap.classList.add('products__refine-wrap--hidden');
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
  filterWrap.classList.remove('products__refine-wrap--hidden');
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

const showProductsError = (error) => {
  console.error('제품 목록을 불러오지 못했습니다.', error);
  status.textContent = error instanceof Error
    ? error.message
    : '제품 목록을 불러오지 못했습니다. localhost 또는 HTTPS 환경에서 다시 시도해 주세요.';
  status.setAttribute('role', 'alert');
  status.hidden = false;
  grid.hidden = true;
  count.textContent = '제품 목록을 불러오지 못했습니다.';
  updateRefineBoundary();
};

try {
  allProducts = await productService.getAll();
  renderProducts(allProducts);
} catch (error) {
  showProductsError(error);
} finally {
  page.setAttribute('aria-busy', 'false');
}
