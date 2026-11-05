import { initializeHeaderScroll } from './header-scroll.js';
import { initializeSiteMenu } from './site-menu.js';

const page = document.querySelector('[data-pdp-page]');
const pageContent = document.querySelector('[data-pdp-content]');
const status = document.querySelector('[data-pdp-status]');
const catalogMessage = document.querySelector('[data-pdp-catalog-message]');
const heroImage = document.querySelector('[data-pdp-hero-image]');
const heroTitle = document.querySelector('[data-pdp-hero-title]');
const productName = document.querySelector('[data-pdp-name]');
const buyImage = document.querySelector('[data-pdp-buy-image]');
const colorSelect = document.querySelector('[data-pdp-color]');
const buyLink = document.querySelector('[data-pdp-buy-link]');
const buyCard = document.querySelector('[data-pdp-buy-card]');
const headphoneContent = document.querySelector('[data-pdp-headphone-content]');

if (
  !(page instanceof HTMLBodyElement) ||
  !(pageContent instanceof HTMLDivElement) ||
  !(status instanceof HTMLParagraphElement) ||
  !(catalogMessage instanceof HTMLParagraphElement) ||
  !(heroImage instanceof HTMLImageElement) ||
  !(heroTitle instanceof HTMLParagraphElement) ||
  !(productName instanceof HTMLParagraphElement) ||
  !(buyImage instanceof HTMLImageElement) ||
  !(colorSelect instanceof HTMLSelectElement) ||
  !(buyLink instanceof HTMLAnchorElement) ||
  !(buyCard instanceof HTMLElement) ||
  !(headphoneContent instanceof HTMLElement)
) {
  throw new Error('The product detail page could not be initialized.');
}

const iconPaths = {
  specifications: ['M8 3h8v18H8z', 'M11 7h2', 'M11 11h2', 'M11 15h2'],
  film: ['M4 5h16v14H4z', 'm10 9 5 3-5 3z', 'M7 5V3', 'M17 5V3'],
  design: ['M4 17 17 4l3 3L7 20H4z', 'm14 7 3 3'],
  intelligence: ['M12 3v3', 'M12 18v3', 'M3 12h3', 'M18 12h3', 'm6 6 2 2', 'm16 16 2 2', 'm18 6-2 2', 'm8 16-2 2', 'M9 10h6v5H9z'],
  kef: ['M4 19V5', 'M4 12h8', 'm12 12 7-7', 'm12 12 7 7'],
  'nothing-x': ['M5 5l14 14', 'M19 5 5 19', 'M4 4h3', 'M17 17h3'],
  performance: ['M4 17V7', 'M9 17V4', 'M14 17v-6', 'M19 17V8', 'M3 20h18'],
  controls: ['M4 7h16', 'M4 17h16', 'M9 4v6', 'M15 14v6'],
  hardware: ['M5 8h14v8H5z', 'M8 8V5h8v3', 'M9 16v3', 'M15 16v3'],
  soundscape: ['M3 12h3l2-6 4 12 3-9 2 3h4'],
};

const createMenuIcon = (name) => {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  icon.classList.add('pdp__menu-icon');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.4');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('aria-hidden', 'true');

  (iconPaths[name] ?? iconPaths.specifications).forEach((pathData) => {
    const path = document.createElementNS(namespace, 'path');
    path.setAttribute('d', pathData);
    icon.append(path);
  });

  return icon;
};

const createMenuLink = (item) => {
  const link = document.createElement('a');
  link.className = `pdp__menu-link pdp__menu-link--${item.icon}`;
  link.href = item.target;
  link.setAttribute('aria-label', [item.label, item.sublabel].filter(Boolean).join(', '));
  if (item.external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  const label = document.createElement('span');
  label.className = 'pdp__menu-label';
  label.textContent = item.label;

  link.append(createMenuIcon(item.icon), label);
  if (item.sublabel) {
    const sublabel = document.createElement('span');
    sublabel.className = 'pdp__menu-sublabel';
    sublabel.textContent = item.sublabel;
    link.append(sublabel);
  }

  return link;
};

const createImagePlaceholder = (media, className) => {
  const placeholder = document.createElement('div');
  placeholder.className = `pdp__media-placeholder ${className}`;
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', media.placeholder);

  const label = document.createElement('span');
  label.className = 'pdp__media-placeholder-label';
  label.textContent = media.placeholder;
  placeholder.append(label);
  return placeholder;
};

const showError = (error) => {
  const message = error instanceof Error ? error.message : '제품 정보를 불러오지 못했습니다.';
  status.textContent = `제품 정보를 표시할 수 없습니다. ${message}`;
  status.hidden = false;
  page.setAttribute('aria-busy', 'false');
  console.error('The product detail page failed to load.', error);
};

const initialize = async () => {
  const requestedId = new URLSearchParams(window.location.search).get('id') ?? 'product-03';
  const [catalogResponse, detailResponse] = await Promise.all([
    fetch('data/products.json'),
    fetch('data/pdp.json'),
  ]);
  if (!catalogResponse.ok) {
    throw new Error(`Product catalog request failed: ${catalogResponse.status}.`);
  }
  if (!detailResponse.ok) {
    throw new Error(`Product detail data request failed: ${detailResponse.status}.`);
  }

  const [products, detailData] = await Promise.all([
    catalogResponse.json(),
    detailResponse.json(),
  ]);
  if (
    !Array.isArray(products) ||
    !products.every((item) =>
      item !== null &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.color === 'string' &&
      typeof item.image === 'string'
    ) ||
    detailData === null ||
    typeof detailData !== 'object' ||
    !Array.isArray(detailData.productIds) ||
    !Array.isArray(detailData.features) ||
    !Array.isArray(detailData.media?.modelGrid) ||
    !Array.isArray(detailData.media?.productCuts)
  ) {
    throw new Error('The product detail data is invalid.');
  }

  const variants = products.filter((item) => {
    const requestedProduct = products.find((entry) => entry.id === requestedId);
    return requestedProduct &&
      item.name === requestedProduct.name &&
      item.brand === requestedProduct.brand &&
      item.category === requestedProduct.category;
  });
  let selectedProduct = products.find((item) => item.id === requestedId);
  if (!selectedProduct) {
    throw new Error(`Product "${requestedId}" was not found in the catalog.`);
  }

  const setProduct = (product, updateAddress = false) => {
    selectedProduct = product;
    const accessibleName = `${product.brand ? `${product.brand} ` : ''}${product.name} ${product.color}`;
    heroImage.src = product.image;
    heroImage.alt = accessibleName;
    heroTitle.textContent = accessibleName.toUpperCase();
    productName.textContent = product.name.toLowerCase();
    buyImage.src = product.image;
    buyImage.alt = accessibleName;
    document.title = `${product.name} | Nothing`;
    colorSelect.value = product.id;

    const searchTerm = encodeURIComponent(`${product.brand ? `${product.brand} ` : ''}${product.name} ${product.color}`);
    buyLink.href = `https://search.shopping.naver.com/search/all?query=${searchTerm}`;
    buyCard.setAttribute('aria-label', `${accessibleName} 구매 정보`);

    if (updateAddress) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', product.id);
      window.history.replaceState(null, '', url);
    }
  };

  setProduct(selectedProduct);

  const isEditorialProduct = detailData.productIds.includes(selectedProduct.id);
  headphoneContent.hidden = !isEditorialProduct;
  catalogMessage.hidden = isEditorialProduct;
  if (!isEditorialProduct) {
    catalogMessage.textContent = `${selectedProduct.name} ${selectedProduct.color} 상품 정보입니다. 이 제품의 상세 콘텐츠는 준비 중입니다.`;
    document.querySelectorAll('[data-pdp-menu]').forEach((menu) => {
      menu.hidden = true;
    });
  } else {
    Object.entries(detailData.menuGroups).forEach(([group, items]) => {
      const menu = document.querySelector(`[data-pdp-menu="${group}"]`);
      if (!(menu instanceof HTMLElement) || !Array.isArray(items)) {
        throw new Error(`The product detail menu "${group}" is invalid.`);
      }
      menu.replaceChildren(...items.map(createMenuLink));
    });

    const featureList = document.querySelector('[data-pdp-features]');
    const buyFeatures = document.querySelector('[data-pdp-buy-features]');
    const modelGrid = document.querySelector('[data-pdp-model-grid]');
    const productCuts = document.querySelector('[data-pdp-product-cuts]');
    const fullBleed = document.querySelector('[data-pdp-fullbleed]');
    if (
      !(featureList instanceof HTMLUListElement) ||
      !(buyFeatures instanceof HTMLUListElement) ||
      !(modelGrid instanceof HTMLUListElement) ||
      !(productCuts instanceof HTMLDivElement) ||
      !(fullBleed instanceof HTMLDivElement)
    ) {
      throw new Error('The product detail content could not be initialized.');
    }

    featureList.replaceChildren(...detailData.features.map((feature) => {
      const item = document.createElement('li');
      item.textContent = feature;
      return item;
    }));
    buyFeatures.replaceChildren(...detailData.features.map((feature) => {
      const item = document.createElement('li');
      item.textContent = feature;
      return item;
    }));

    fullBleed.replaceWith(createImagePlaceholder(detailData.media.fullBleed, 'pdp__media-placeholder--wide'));
    modelGrid.replaceChildren(...detailData.media.modelGrid.map((media) => {
      const item = document.createElement('li');
      item.className = 'pdp-gallery__item';
      item.append(createImagePlaceholder(media, ''));
      return item;
    }));
    productCuts.replaceChildren(...detailData.media.productCuts.map((media) => {
      const cut = createImagePlaceholder(media, 'pdp-story__cut');
      return cut;
    }));
  }

  colorSelect.replaceChildren(...variants.map((variant) => {
    const option = document.createElement('option');
    option.value = variant.id;
    option.textContent = variant.color;
    return option;
  }));
  colorSelect.value = selectedProduct.id;
  colorSelect.addEventListener('change', () => {
    const nextProduct = variants.find((variant) => variant.id === colorSelect.value);
    if (nextProduct) {
      setProduct(nextProduct, true);
    }
  });

  pageContent.hidden = false;
  buyCard.hidden = false;
  page.setAttribute('aria-busy', 'false');
  initializeSiteMenu();
  initializeHeaderScroll();
};

initialize().catch(showError);
