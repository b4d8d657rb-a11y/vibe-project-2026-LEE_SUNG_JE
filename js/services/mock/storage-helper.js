const STORAGE_DELAY_MS = 120;

const waitForStorage = () => new Promise((resolve) => {
  window.setTimeout(resolve, STORAGE_DELAY_MS);
});

const copyValue = (value) => JSON.parse(JSON.stringify(value));

export const storageHelper = {
  getOrInitialize: async (key, initialValue) => {
    await waitForStorage();

    try {
      const savedValue = window.localStorage.getItem(key);
      if (savedValue === null) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return copyValue(initialValue);
      }

      return JSON.parse(savedValue);
    } catch (error) {
      throw new Error('공지사항 데이터를 불러오지 못했습니다.', { cause: error });
    }
  },

  set: async (key, value) => {
    await waitForStorage();

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error('공지사항 데이터를 저장하지 못했습니다.', { cause: error });
    }
  },
};
