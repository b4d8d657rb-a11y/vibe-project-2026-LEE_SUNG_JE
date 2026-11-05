const STORAGE_DELAY_MS = 150;

const delay = () => new Promise((resolve) => {
  window.setTimeout(resolve, STORAGE_DELAY_MS);
});

const clone = (value) => JSON.parse(JSON.stringify(value));

export const storageHelper = {
  /**
   * @template T
   * @param {string} key
   * @param {T} defaultValue
   * @returns {Promise<T>}
   */
  get: async (key, defaultValue) => {
    await delay();

    try {
      const savedValue = window.localStorage.getItem(key);
      return savedValue === null ? clone(defaultValue) : JSON.parse(savedValue);
    } catch (error) {
      throw new Error('제품 데이터를 불러오지 못했습니다.', { cause: error });
    }
  },

  /**
   * @template T
   * @param {string} key
   * @param {T} value
   * @returns {Promise<void>}
   */
  set: async (key, value) => {
    await delay();

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error('제품 데이터를 저장하지 못했습니다.', { cause: error });
    }
  },
};
