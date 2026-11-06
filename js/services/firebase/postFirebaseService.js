import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  runTransaction,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { NOTICE_CATEGORIES, NOTICE_SEED } from '../../data/notice-seed.js';
import { postMockService } from '../mock/post-mock-service.js';
import { ensureAnonymousUser, db, firebaseProjectId } from './firebaseConfig.js';

const POSTS_COLLECTION = 'notices';
const METADATA_COLLECTION = 'noticeMetadata';
const COUNTER_ID = 'notice-counter';
const STORAGE_KEY = 'nothing-support:notice-posts:v1';
const MIGRATED_KEY = `${STORAGE_KEY}:firebase-migrated:${firebaseProjectId}`;

let migrationPromise = null;
let hasLoggedFallbackWarning = false;

const normalizeAttachment = (attachment) => {
  if (attachment == null) return null;
  if (
    typeof attachment.name !== 'string' ||
    typeof attachment.size !== 'number' ||
    typeof attachment.type !== 'string' ||
    typeof attachment.lastModified !== 'number'
  ) {
    throw new Error('기존 첨부파일 정보 형식이 올바르지 않습니다.');
  }

  return {
    name: attachment.name,
    size: attachment.size,
    type: attachment.type,
    lastModified: attachment.lastModified,
  };
};

const normalizePost = (post) => {
  if (
    !post ||
    typeof post.id !== 'string' ||
    !post.id ||
    post.id.includes('/') ||
    !NOTICE_CATEGORIES.includes(post.category) ||
    typeof post.title !== 'string' ||
    typeof post.content !== 'string' ||
    typeof post.createdAt !== 'string' ||
    typeof post.updatedAt !== 'string' ||
    !Number.isInteger(post.number) ||
    !Number.isInteger(post.views) ||
    typeof post.isPinned !== 'boolean'
  ) {
    throw new Error('기존 공지사항 데이터 형식이 올바르지 않습니다.');
  }

  return {
    id: post.id,
    number: post.number,
    category: post.category,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    views: post.views,
    isPinned: post.isPinned,
    attachment: normalizeAttachment(post.attachment),
  };
};

const migrateLocalPosts = async () => {
  const storedPosts = window.localStorage.getItem(STORAGE_KEY);
  const sourcePosts = storedPosts === null ? NOTICE_SEED : JSON.parse(storedPosts);
  if (!Array.isArray(sourcePosts)) {
    throw new Error('기존 공지사항 데이터 형식이 올바르지 않습니다.');
  }

  const posts = sourcePosts.map(normalizePost);
  const postRefs = posts.map((post) => doc(db, POSTS_COLLECTION, post.id));
  const counterRef = doc(db, METADATA_COLLECTION, COUNTER_ID);

  await runTransaction(db, async (transaction) => {
    const counterSnapshot = await transaction.get(counterRef);
    const postSnapshots = await Promise.all(postRefs.map((postRef) => transaction.get(postRef)));

    posts.forEach((post, index) => {
      if (!postSnapshots[index].exists()) {
        const { id, ...postData } = post;
        transaction.set(postRefs[index], postData);
      }
    });

    const highestImportedNumber = posts.reduce((highest, post) => Math.max(highest, post.number), 0);
    const currentNumber = counterSnapshot.exists()
      ? Number(counterSnapshot.data().lastNumber) || 0
      : 0;
    if (!counterSnapshot.exists() || highestImportedNumber > currentNumber) {
      transaction.set(counterRef, { lastNumber: highestImportedNumber });
    }
  });

  window.localStorage.setItem(MIGRATED_KEY, 'true');
};

const ensureReady = async () => {
  await ensureAnonymousUser();
  if (window.localStorage.getItem(MIGRATED_KEY) !== 'true') {
    migrationPromise ??= migrateLocalPosts().finally(() => {
      migrationPromise = null;
    });
    await migrationPromise;
  }
};

const withLocalFallback = async (firebaseAction, localAction) => {
  try {
    await ensureReady();
    return await firebaseAction();
  } catch (error) {
    if (!['auth/configuration-not-found', 'permission-denied', 'unauthenticated'].includes(error?.code)) {
      throw error;
    }
    if (!hasLoggedFallbackWarning) {
      console.warn('Firebase 인증 또는 Firestore 쓰기 권한이 없어 이 브라우저의 LocalStorage를 사용합니다.');
      hasLoggedFallbackWarning = true;
    }
    return localAction();
  }
  return firebaseAction();
};

const getPostRef = (id) => {
  if (typeof id !== 'string' || !id || id.includes('/')) return null;
  return doc(db, POSTS_COLLECTION, id);
};

const getPostData = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export const postFirebaseService = {
  getAll: async () => withLocalFallback(
    async () => {
      const snapshot = await getDocs(collection(db, POSTS_COLLECTION));
      const remotePosts = snapshot.docs.map(getPostData);
      const remoteIds = new Set(remotePosts.map((post) => post.id));
      const localPosts = await postMockService.getAll();
      return [...remotePosts, ...localPosts.filter((post) => !remoteIds.has(post.id))];
    },
    () => postMockService.getAll(),
  ),

  getById: async (id) => withLocalFallback(
    async () => {
      const postRef = getPostRef(id);
      if (!postRef) return null;
      const snapshot = await getDoc(postRef);
      return snapshot.exists() ? getPostData(snapshot) : postMockService.getById(id);
    },
    () => postMockService.getById(id),
  ),

  create: async (postData) => withLocalFallback(
    async () => {
      const postRef = doc(collection(db, POSTS_COLLECTION));
      const counterRef = doc(db, METADATA_COLLECTION, COUNTER_ID);
      const now = new Date().toISOString();
      const newPost = {
        category: postData.category,
        title: postData.title,
        content: postData.content,
        createdAt: now,
        updatedAt: now,
        views: 0,
        isPinned: false,
        attachment: postData.attachment ?? null,
      };
      let number = 0;

      await runTransaction(db, async (transaction) => {
        const counterSnapshot = await transaction.get(counterRef);
        if (!counterSnapshot.exists()) {
          throw new Error('공지사항 번호를 준비하지 못했습니다. 다시 시도해 주세요.');
        }
        const lastNumber = counterSnapshot.data().lastNumber;
        if (!Number.isInteger(lastNumber) || lastNumber < 0) {
          throw new Error('공지사항 번호 데이터가 올바르지 않습니다.');
        }
        number = lastNumber + 1;
        transaction.update(counterRef, { lastNumber: number });
        transaction.set(postRef, { ...newPost, number });
      });

      return { id: postRef.id, ...newPost, number };
    },
    () => postMockService.create(postData),
  ),

  update: async (id, postData) => withLocalFallback(
    async () => {
      const postRef = getPostRef(id);
      if (!postRef) throw new Error('수정할 게시글을 찾을 수 없습니다.');
      const snapshot = await getDoc(postRef);
      if (!snapshot.exists()) {
        return postMockService.update(id, postData);
      }

      const updatedFields = {
        category: postData.category,
        title: postData.title,
        content: postData.content,
        attachment: postData.attachment ?? null,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(postRef, updatedFields);
      return { ...getPostData(snapshot), ...updatedFields };
    },
    () => postMockService.update(id, postData),
  ),

  delete: async (id) => withLocalFallback(
    async () => {
      const postRef = getPostRef(id);
      if (!postRef) throw new Error('삭제할 게시글을 찾을 수 없습니다.');
      const snapshot = await getDoc(postRef);
      if (!snapshot.exists()) {
        return postMockService.delete(id);
      }
      await deleteDoc(postRef);
    },
    () => postMockService.delete(id),
  ),

  incrementViews: async (id) => withLocalFallback(
    async () => {
      const postRef = getPostRef(id);
      if (!postRef) return null;
      const snapshot = await getDoc(postRef);
      if (!snapshot.exists()) return postMockService.incrementViews(id);

      await updateDoc(postRef, { views: increment(1) });
      const updatedSnapshot = await getDoc(postRef);
      return updatedSnapshot.exists() ? getPostData(updatedSnapshot) : null;
    },
    () => postMockService.incrementViews(id),
  ),
};