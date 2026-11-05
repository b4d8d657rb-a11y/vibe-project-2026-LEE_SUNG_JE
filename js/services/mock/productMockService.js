import { storageHelper } from './storageHelper.js';

const STORAGE_KEY = 'mock_products';
const SEED_FLAG_KEY = 'mock_products_seeded';
const SEED_URL = new URL('../../../data/products.json', import.meta.url);

let initializationPromise;

const createId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => {
      bytes[index] = Math.floor(Math.random() * 256);
    });
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const readSeed = async () => {
  const response = await fetch(SEED_URL);
  if (!response.ok) {
    throw new Error(`제품 시드 데이터를 불러오지 못했습니다 (${response.status}).`);
  }

  const seed = await response.json();
  if (!Array.isArray(seed) || seed.length !== 61) {
    throw new TypeError('제품 시드 데이터는 61개 항목이어야 합니다.');
  }

  const now = new Date().toISOString();
  return seed.map((item, index) => {
    if (
      typeof item.name !== 'string' ||
      typeof item.image !== 'string' ||
      typeof item.color !== 'string' ||
      typeof item.category !== 'string' ||
      typeof item.alt !== 'string' ||
      !item.image.startsWith('images/')
    ) {
      throw new TypeError(`제품 시드 데이터가 올바르지 않습니다 (${index + 1}번째 항목).`);
    }

    return {
      id: createId(),
      name: item.alt,
      series: item.name,
      brand: item.brand === 'CMF' ? 'CMF' : 'NOTHING',
      category: item.category,
      color: item.color,
      imageUrl: item.image,
      alt: item.alt,
      order: index + 1,
      createdAt: now,
      updatedAt: now,
    };
  });
};

const initializeProducts = async () => {
  const seeded = await storageHelper.get(SEED_FLAG_KEY, false);
  if (seeded === true) {
    return;
  }

  const existingProducts = await storageHelper.get(STORAGE_KEY, null);
  if (existingProducts !== null && !Array.isArray(existingProducts)) {
    throw new TypeError('저장된 제품 데이터 형식이 올바르지 않습니다.');
  }

  if (!Array.isArray(existingProducts) || existingProducts.length === 0) {
    await storageHelper.set(STORAGE_KEY, await readSeed());
  }

  await storageHelper.set(SEED_FLAG_KEY, true);
};

const ensureInitialized = () => {
  if (!initializationPromise) {
    initializationPromise = initializeProducts();
  }

  return initializationPromise;
};

const readProducts = async () => {
  await ensureInitialized();
  const products = await storageHelper.get(STORAGE_KEY, []);
  if (!Array.isArray(products)) {
    throw new TypeError('저장된 제품 데이터 형식이 올바르지 않습니다.');
  }

  return products;
};

/** @type {import('../../types/product.js').ProductService} */
export const productMockService = {
  getAll: async () => {
    const products = await readProducts();
    return products.sort((first, second) => first.order - second.order);
  },

  getById: async (id) => {
    const products = await readProducts();
    return products.find((product) => product.id === id) ?? null;
  },

  create: async (dto) => {
    const products = await readProducts();
    const now = new Date().toISOString();
    const product = {
      ...dto,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    products.push(product);
    await storageHelper.set(STORAGE_KEY, products);
    return product;
  },

  update: async (id, dto) => {
    const products = await readProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index < 0) {
      throw new Error(`수정할 제품을 찾을 수 없습니다: ${id}`);
    }

    const updatedProduct = {
      ...products[index],
      ...dto,
      id: products[index].id,
      createdAt: products[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updatedProduct;
    await storageHelper.set(STORAGE_KEY, products);
    return updatedProduct;
  },

  delete: async (id) => {
    const products = await readProducts();
    const remainingProducts = products.filter((product) => product.id !== id);
    if (remainingProducts.length === products.length) {
      throw new Error(`삭제할 제품을 찾을 수 없습니다: ${id}`);
    }

    await storageHelper.set(STORAGE_KEY, remainingProducts);
  },
};
