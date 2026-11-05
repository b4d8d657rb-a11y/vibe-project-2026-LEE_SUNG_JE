import { initializeHeaderScroll } from './modules/header-scroll.js';
import { initializeSiteMenu } from './modules/site-menu.js';

const productResponse = await fetch('data/products.json');
if (!productResponse.ok) {
  throw new Error('Product catalog request failed: ' + productResponse.status + ' ' + productResponse.statusText);
}

const products = await productResponse.json();
const isProductRecord = (product) =>
  product !== null &&
  typeof product === 'object' &&
  typeof product.id === 'string' &&
  typeof product.name === 'string' &&
  typeof product.color === 'string' &&
  typeof product.category === 'string' &&
  typeof product.image === 'string';

if (!Array.isArray(products) || products.length !== 61 || !products.every(isProductRecord)) {
  throw new Error('The product catalog data is invalid.');
}

const productGrid = document.querySelector('[data-products-grid]');
const refineToggle = document.querySelector('[data-products-refine]');
const refineOptions = document.querySelector('#products-refine-options');
const filterButtons = document.querySelectorAll('[data-product-filter]');
const productCount = document.querySelector('[data-products-count]');

if (
  !(productGrid instanceof HTMLUListElement) ||
  !(refineToggle instanceof HTMLButtonElement) ||
  !(refineOptions instanceof HTMLDivElement) ||
  !(productCount instanceof HTMLParagraphElement)
) {
  throw new Error('The products page controls could not be initialized.');
}

if (products.length !== 61) {
  throw new Error(`Expected 61 products, received ${products.length}.`);
}

products.forEach((product, index) => {
  const item = document.createElement('li');
  item.className = `products__item${index === products.length - 1 ? ' products__item--last' : ''}`;
  item.dataset.productCategory = product.category;

  const card = document.createElement('a');
  card.className = 'products__card';
  card.href = 'pdp.html?id=' + encodeURIComponent(product.id);
  card.setAttribute('aria-label', `${product.brand ? `${product.brand} ` : ''}${product.name}, 색상 ${product.color}`);

  const media = document.createElement('span');
  media.className = 'products__media';

  const image = document.createElement('img');
  image.className = 'products__image';
  image.src = product.image;
  image.alt = `${product.brand ? `${product.brand} ` : ''}${product.name} - ${product.color}`;
  image.width = 800;
  image.height = 800;
  image.decoding = 'async';
  image.loading = index < 5 ? 'eager' : 'lazy';
  if (index < 5) {
    image.fetchPriority = 'high';
  }
  media.append(image);

  const caption = document.createElement('span');
  caption.className = 'products__caption';
  if (product.brand) {
    const brand = document.createElement('span');
    brand.className = 'products__brand';
    brand.textContent = product.brand;
    caption.append(brand);
  }

  const name = document.createElement('span');
  name.className = 'products__name';
  name.textContent = product.name;
  caption.append(name);

  card.append(media, caption);
  item.append(card);
  productGrid.append(item);
});

const setRefineOpen = (isOpen, shouldFocusToggle = false) => {
  refineToggle.setAttribute('aria-expanded', String(isOpen));
  refineToggle.setAttribute('aria-label', `제품 카테고리 필터 ${isOpen ? '닫기' : '열기'}`);
  refineOptions.hidden = !isOpen;
  if (shouldFocusToggle) {
    refineToggle.focus();
  }
};

const filterProducts = (category) => {
  const visibleProducts = [...productGrid.children].filter((item) => {
    const isVisible = category === 'all' || item.dataset.productCategory === category;
    item.hidden = !isVisible;
    return isVisible;
  });

  productCount.textContent = `${visibleProducts.length}개 제품`;
  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.productFilter === category));
  });
  setRefineOpen(false, true);
};

refineToggle.addEventListener('click', () => {
  setRefineOpen(refineToggle.getAttribute('aria-expanded') !== 'true');
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button instanceof HTMLButtonElement) {
      filterProducts(button.dataset.productFilter ?? 'all');
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !refineOptions.hidden) {
    setRefineOpen(false, true);
  }
});

document.addEventListener('click', (event) => {
  if (
    !refineOptions.hidden &&
    event.target instanceof Node &&
    !refineOptions.contains(event.target) &&
    !refineToggle.contains(event.target)
  ) {
    setRefineOpen(false);
  }
});

productCount.textContent = `${products.length}개 제품`;
initializeSiteMenu();
initializeHeaderScroll();
