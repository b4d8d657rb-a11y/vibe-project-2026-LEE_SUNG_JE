import { initializeSiteMenu } from './modules/site-menu.js';
import { initializeHeaderScroll } from './modules/header-scroll.js';

initializeSiteMenu();
<<<<<<< HEAD
initializeHeaderScroll();
=======
initializeHeaderScroll();

const productsGrid = document.querySelector('[data-products-grid]');
const productsStatus = document.querySelector('[data-products-status]');
const productsCount = document.querySelector('[data-products-count]');

if (!(productsGrid instanceof HTMLUListElement)) {
  throw new Error('The products page could not be initialized.');
}

const renderProducts = (products) => {
  if (!Array.isArray(products) || products.length !== 61) {
    throw new TypeError('The products data must contain exactly 61 products.');
  }

  const fragment = document.createDocumentFragment();
  products.forEach((product, index) => {
    if (
      typeof product.image !== 'string' ||
      typeof product.name !== 'string' ||
      typeof product.color !== 'string' ||
      typeof product.alt !== 'string' ||
      !Number.isInteger(product.width) ||
      !Number.isInteger(product.height)
    ) {
      throw new TypeError(`Product data is incomplete at item ${index + 1}.`);
    }

    const card = document.createElement('li');
    card.className = 'products__card';

    const figure = document.createElement('figure');
    figure.className = 'products__figure';

    const image = document.createElement('img');
    image.className = 'products__image';
    image.src = new URL(product.image, document.baseURI).href;
    image.alt = product.alt;
    image.width = product.width;
    image.height = product.height;
    image.decoding = 'async';
    if (index < 5) {
      image.fetchPriority = 'high';
      image.loading = 'eager';
    } else {
      image.loading = 'lazy';
    }
    figure.append(image);

    const caption = document.createElement('figcaption');
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

    card.append(figure, caption);
    fragment.append(card);
  });

  productsGrid.append(fragment);
  if (productsStatus instanceof HTMLElement) {
    productsStatus.hidden = true;
  }
  if (productsCount instanceof HTMLElement) {
    productsCount.textContent = `${products.length}개 제품이 표시되었습니다.`;
  }
};

const showProductsError = (error) => {
  console.error('제품 목록을 불러오지 못했습니다.', error);
  if (productsStatus instanceof HTMLElement) {
    productsStatus.textContent = '제품 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
    productsStatus.setAttribute('role', 'alert');
  }
  if (productsCount instanceof HTMLElement) {
    productsCount.textContent = '제품 목록을 불러오지 못했습니다.';
  }
};

fetch(new URL('data/products.json', document.baseURI))
  .then((response) => {
    if (!response.ok) {
      throw new Error(`제품 데이터 요청에 실패했습니다 (${response.status}).`);
    }
    return response.json();
  })
  .then(renderProducts)
  .catch(showProductsError);
>>>>>>> 4085516f6f4dc810ec796f318cd2517cf9cfdfb4
