import { productService } from '../services/productService.js';
import { productDetailService } from '../services/productDetailService.js';

const detailView = document.querySelector('[data-product-detail-view]');
const status = document.querySelector('[data-product-detail-status]');
const retryButton = document.querySelector('[data-product-detail-retry]');
const content = document.querySelector('[data-product-detail-content]');

if (
  !(detailView instanceof HTMLElement) ||
  !(status instanceof HTMLElement) ||
  !(retryButton instanceof HTMLButtonElement) ||
  !(content instanceof HTMLElement)
) {
  throw new Error('제품 상세 화면을 초기화할 수 없습니다.');
}

let currentProductId = '';
let requestVersion = 0;

const setStatus = (message, { loading = false, error = false } = {}) => {
  status.textContent = message;
  status.hidden = !message;
  status.classList.toggle('is-loading', loading);
  status.setAttribute('role', error ? 'alert' : 'status');
  retryButton.hidden = !error;
  detailView.setAttribute('aria-busy', String(loading));
};

const makeElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
};

const makeImage = (src, alt, className, loading = 'lazy') => {
  const image = document.createElement('img');
  image.className = className;
  image.src = new URL(src, document.baseURI).href;
  image.alt = alt;
  image.loading = loading;
  image.decoding = 'async';
  return image;
};

const getCategoryLabel = (category) => {
  const labels = {
    audio: '오디오',
    phones: '휴대전화',
    watches: '시계',
    accessories: '액세서리',
    cmf: 'CMF',
  };
  return labels[category] ?? category;
};

const getVariantColor = (color) => {
  const normalizedColor = color.trim().toLowerCase();
  const colorMap = [
    [/화이트|white|light grey|silver/, '#f4f4f1'],
    [/블랙|black|dark grey/, '#242426'],
    [/그레이|grey|gray/, '#8c8d8e'],
    [/핑크|pink/, '#e7a5bd'],
    [/블루|blue|turquoise/, '#66b6c4'],
    [/옐로|yellow/, '#e5c72e'],
    [/오렌지|orange/, '#ed6b34'],
    [/그린|green/, '#a8bb76'],
  ];
  return colorMap.find(([pattern]) => pattern.test(normalizedColor))?.[1] ?? '#d8d8d4';
};

const makeBackLink = () => {
  const link = makeElement('a', 'product-detail__back');
  const icon = makeElement('img', 'product-detail__back-icon');
  icon.src = 'images/d/main.svg';
  icon.alt = '';
  icon.setAttribute('aria-hidden', 'true');
  icon.width = 16;
  icon.height = 16;
  link.append(icon, makeElement('span', '', '모든 제품'));
  link.href = '#products';
  return link;
};

const createHero = (product, detailCopy) => {
  const hero = makeElement('section', 'product-detail__hero');
  const intro = makeElement('div', 'product-detail__intro');
  intro.append(makeElement('p', 'product-detail__eyebrow', detailCopy.eyebrow));

  const heading = makeElement('h1', 'product-detail__title', product.series || product.name);
  intro.append(heading);
  intro.append(makeElement('p', 'product-detail__description', detailCopy.description));

  const selectedColor = makeElement('p', 'product-detail__selected-color');
  selectedColor.append(
    makeElement('span', 'product-detail__color-dot'),
    makeElement('span', '', product.color),
  );
  selectedColor.querySelector('.product-detail__color-dot').style.backgroundColor =
    getVariantColor(product.color);
  intro.append(selectedColor);

  const imagePanel = makeElement('figure', 'product-detail__hero-image');
  imagePanel.append(makeImage(product.imageUrl, product.alt, 'product-detail__product-image', 'eager'));
  imagePanel.append(makeElement('figcaption', 'product-detail__image-caption', product.color));
  hero.append(intro, imagePanel);
  return hero;
};

const createStoryGallery = (product, variants, detailCopy) => {
  const section = makeElement('section', 'product-detail__gallery');
  const header = makeElement('div', 'product-detail__section-heading');
  header.append(
    makeElement('p', 'product-detail__eyebrow', 'A CLOSER LOOK'),
    makeElement('h2', 'product-detail__section-title', '제품의 디테일을 만나보세요.'),
  );
  section.append(header);

  const images = detailCopy.storyImages.length
    ? detailCopy.storyImages
    : variants
        .filter((variant) => variant.id !== product.id)
        .slice(0, 3)
        .map((variant) => ({
          src: variant.imageUrl,
          alt: variant.alt,
          caption: variant.color,
        }));

  if (images.length === 0) {
    const showcase = makeElement('div', 'product-detail__single-showcase');
    showcase.append(makeImage(product.imageUrl, product.alt, 'product-detail__showcase-image'));
    showcase.append(
      makeElement('p', 'product-detail__showcase-note', '제품을 더 자세히 살펴보세요.'),
    );
    section.append(showcase);
    return section;
  }

  const list = makeElement('div', 'product-detail__gallery-grid');
  images.forEach((item, index) => {
    const figure = makeElement('figure', 'product-detail__gallery-item');
    if (detailCopy.storyImages.length > 0 && index === 0) {
      figure.classList.add('product-detail__gallery-item--wide');
    }
    figure.append(makeImage(item.src, item.alt, 'product-detail__gallery-image'));
    figure.append(makeElement('figcaption', 'product-detail__gallery-caption', item.caption));
    list.append(figure);
  });
  section.append(list);
  return section;
};

const createFeatureSection = (product, detailCopy) => {
  const section = makeElement('section', 'product-detail__features');
  section.append(
    makeElement('p', 'product-detail__eyebrow', 'MADE FOR YOUR EVERYDAY'),
    makeElement('h2', 'product-detail__section-title', `${product.series || product.name}, 자세히 보기`),
  );

  const grid = makeElement('div', 'product-detail__feature-grid');
  detailCopy.features.forEach((feature) => {
    const card = makeElement('article', 'product-detail__feature');
    card.append(
      makeElement('p', 'product-detail__feature-label', feature.label),
      makeElement('h3', 'product-detail__feature-title', feature.title),
      makeElement('p', 'product-detail__feature-description', feature.description),
    );
    grid.append(card);
  });
  section.append(grid);
  return section;
};

const createSpecDock = (product, variants) => {
  const dock = makeElement('aside', 'product-detail__dock');
  dock.setAttribute('aria-label', '제품 선택 및 상세 정보');

  const toggle = makeElement('button', 'product-detail__dock-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'product-detail-specs');
  toggle.append(
    makeElement('span', 'product-detail__dock-label', '제품 스펙'),
    makeElement('span', 'product-detail__dock-product', `${product.series || product.name} · ${product.color}`),
    makeElement('span', 'product-detail__dock-indicator', '+'),
  );
  toggle.querySelector('.product-detail__dock-indicator').setAttribute('aria-hidden', 'true');

  const panel = makeElement('div', 'product-detail__spec-panel');
  panel.id = 'product-detail-specs';
  panel.hidden = true;
  panel.append(makeElement('p', 'product-detail__spec-heading', '선택한 제품 정보'));

  const specs = makeElement('dl', 'product-detail__spec-list');
  [
    ['브랜드', product.brand],
    ['제품명', product.series || product.name],
    ['컬러', product.color],
    ['제품군', getCategoryLabel(product.category)],
  ].forEach(([label, value]) => {
    specs.append(
      makeElement('dt', '', label),
      makeElement('dd', '', value),
    );
  });
  panel.append(specs);

  const choices = makeElement('div', 'product-detail__variants');
  choices.append(makeElement('p', 'product-detail__variant-heading', '다른 컬러 보기'));
  const variantList = makeElement('div', 'product-detail__variant-list');
  variants.forEach((variant) => {
    const choice = makeElement('a', 'product-detail__variant');
    choice.href = `#product/${encodeURIComponent(variant.id)}`;
    choice.setAttribute(
      'aria-label',
      `${variant.color}${variant.id === product.id ? ', 선택됨' : ''}`,
    );
    choice.setAttribute('title', variant.color);
    choice.classList.toggle('is-selected', variant.id === product.id);
    choice.style.setProperty('--product-detail-swatch', getVariantColor(variant.color));
    if (variant.id === product.id) {
      choice.setAttribute('aria-current', 'true');
    }
    variantList.append(choice);
  });
  choices.append(variantList);
  panel.append(choices);

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    panel.hidden = isExpanded;
  });

  dock.append(toggle, panel);
  return dock;
};

const renderProduct = (product, variants, detailCopy) => {
  const article = makeElement('article', 'product-detail__article');
  article.append(makeBackLink(), createHero(product, detailCopy));
  article.append(createStoryGallery(product, variants, detailCopy));
  article.append(createFeatureSection(product, detailCopy));
  article.append(makeElement('p', 'product-detail__footer-note', 'NOTHING · DESIGNED WITH PURPOSE'));
  article.append(createSpecDock(product, variants));
  content.replaceChildren(article);
  content.hidden = false;
  setStatus('');
};

const loadProduct = async (id) => {
  const version = ++requestVersion;
  currentProductId = id;
  content.hidden = true;
  setStatus('제품 정보를 불러오는 중입니다.', { loading: true });

  try {
    const product = await productService.getById(id);
    if (version !== requestVersion) {
      return;
    }
    if (!product) {
      throw new Error('요청한 제품을 찾을 수 없습니다.');
    }

    const [products, detailCopy] = await Promise.all([
      productService.getAll(),
      productDetailService.getForProduct(product),
    ]);
    if (version !== requestVersion) {
      return;
    }

    const variants = products.filter(
      (item) => item.series === product.series && item.brand === product.brand,
    );
    renderProduct(product, variants, detailCopy);
    document.title = `${product.series || product.name} | Nothing`;
  } catch (error) {
    if (version !== requestVersion) {
      return;
    }
    console.error('제품 상세 정보를 불러오지 못했습니다.', error);
    setStatus(
      error instanceof Error ? error.message : '제품 상세 정보를 불러오지 못했습니다.',
      { error: true },
    );
  }
};

retryButton.addEventListener('click', () => {
  if (currentProductId) {
    void loadProduct(currentProductId);
  }
});

export const productDetailPage = {
  load: loadProduct,
  deactivate: () => {
    requestVersion += 1;
  },
};
