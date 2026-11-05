import { NOTICE_SEED } from '../../data/notice-seed.js';
import { storageHelper } from './storage-helper.js';

const STORAGE_KEY = 'nothing-support:notice-posts:v1';

const readPosts = async () => {
  const posts = await storageHelper.getOrInitialize(STORAGE_KEY, NOTICE_SEED);
  if (!Array.isArray(posts)) {
    throw new Error('공지사항 데이터 형식이 올바르지 않습니다.');
  }
  return posts;
};

const createId = () => {
  if (typeof globalThis.crypto?.randomUUID !== 'function') {
    throw new Error('이 브라우저에서는 안전한 게시글 ID를 만들 수 없습니다.');
  }
  return globalThis.crypto.randomUUID();
};

export const postMockService = {
  getAll: async () => readPosts(),

  getById: async (id) => {
    const posts = await readPosts();
    return posts.find((post) => post.id === id) ?? null;
  },

  create: async (postData) => {
    const posts = await readPosts();
    const now = new Date().toISOString();
    const nextNumber = posts.reduce((highest, post) => Math.max(highest, Number(post.number) || 0), 0) + 1;
    const createdPost = {
      id: createId(),
      number: nextNumber,
      category: postData.category,
      title: postData.title,
      content: postData.content,
      createdAt: now,
      updatedAt: now,
      views: 0,
      isPinned: false,
      attachment: postData.attachment ?? null,
    };

    posts.push(createdPost);
    await storageHelper.set(STORAGE_KEY, posts);
    return createdPost;
  },

  update: async (id, postData) => {
    const posts = await readPosts();
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex < 0) {
      throw new Error('수정할 게시글을 찾을 수 없습니다.');
    }

    const updatedPost = {
      ...posts[postIndex],
      category: postData.category,
      title: postData.title,
      content: postData.content,
      attachment: postData.attachment ?? null,
      updatedAt: new Date().toISOString(),
    };

    posts[postIndex] = updatedPost;
    await storageHelper.set(STORAGE_KEY, posts);
    return updatedPost;
  },

  delete: async (id) => {
    const posts = await readPosts();
    const remainingPosts = posts.filter((post) => post.id !== id);
    if (remainingPosts.length === posts.length) {
      throw new Error('삭제할 게시글을 찾을 수 없습니다.');
    }
    await storageHelper.set(STORAGE_KEY, remainingPosts);
  },

  incrementViews: async (id) => {
    const posts = await readPosts();
    const post = posts.find((item) => item.id === id);
    if (!post) {
      return null;
    }

    post.views += 1;
    await storageHelper.set(STORAGE_KEY, posts);
    return post;
  },
};
