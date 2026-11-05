const DETAILS_URL = new URL('../../../data/product-details.json', import.meta.url);

let detailsPromise;

const isDetailCopy = (value) =>
  value !== null &&
  typeof value === 'object' &&
  typeof value.eyebrow === 'string' &&
  typeof value.description === 'string' &&
  Array.isArray(value.features) &&
  value.features.length > 0 &&
  value.features.every(
    (feature) =>
      feature !== null &&
      typeof feature === 'object' &&
      typeof feature.label === 'string' &&
      typeof feature.title === 'string' &&
      typeof feature.description === 'string',
  ) &&
  Array.isArray(value.storyImages) &&
  value.storyImages.every(
    (image) =>
      image !== null &&
      typeof image === 'object' &&
      typeof image.src === 'string' &&
      typeof image.alt === 'string' &&
      typeof image.caption === 'string',
  );

const readDetails = async () => {
  const response = await fetch(DETAILS_URL);
  if (!response.ok) {
    throw new Error(`제품 상세 데이터를 불러오지 못했습니다 (${response.status}).`);
  }

  const details = await response.json();
  if (
    details === null ||
    typeof details !== 'object' ||
    details.categories === null ||
    typeof details.categories !== 'object' ||
    details.families === null ||
    typeof details.families !== 'object'
  ) {
    throw new TypeError('제품 상세 데이터 형식이 올바르지 않습니다.');
  }

  return details;
};

const getDetails = async () => {
  if (!detailsPromise) {
    detailsPromise = readDetails().catch((error) => {
      detailsPromise = undefined;
      throw error;
    });
  }
  return detailsPromise;
};

const getCategoryKey = (product) => {
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

/** @type {import('../../types/product.js').ProductDetailService} */
export const productDetailMockService = {
  getForProduct: async (product) => {
    if (!product || typeof product.series !== 'string' || typeof product.category !== 'string') {
      throw new TypeError('상세 정보를 찾을 제품 데이터가 올바르지 않습니다.');
    }

    const details = await getDetails();
    const familyKey = Object.keys(details.families).find(
      (key) => key.toLowerCase() === product.series.toLowerCase(),
    );
    const detailCopy = familyKey
      ? details.families[familyKey]
      : details.categories[getCategoryKey(product)];

    if (!isDetailCopy(detailCopy)) {
      throw new TypeError(`제품 상세 데이터가 올바르지 않습니다: ${product.series}`);
    }

    return detailCopy;
  },
};
