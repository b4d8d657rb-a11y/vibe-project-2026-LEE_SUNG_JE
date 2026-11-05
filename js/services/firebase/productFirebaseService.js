const notConfigured = () => new Error('Firebase 제품 서비스를 구현한 뒤 활성화해 주세요.');

// Implement getAll with Firestore orderBy('order') to preserve the Mock service contract.
/** @type {import('../../types/product.js').ProductService} */
export const productFirebaseService = {
  getAll: async () => {
    throw notConfigured();
  },

  getById: async () => {
    throw notConfigured();
  },

  create: async () => {
    throw notConfigured();
  },

  update: async () => {
    throw notConfigured();
  },

  delete: async () => {
    throw notConfigured();
  },
};
