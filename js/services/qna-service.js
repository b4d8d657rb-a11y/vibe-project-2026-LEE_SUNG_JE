import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { QNA_CATEGORIES, QNA_CONTENT_MAX_LENGTH, QNA_TITLE_MAX_LENGTH } from '../config/qna-board.js';
import { ADMIN_EMAIL } from './auth-service.js';
import { auth, db } from './firebase/firebaseConfig.js';

const QUESTIONS_COLLECTION = 'qnaQuestions';
const CONTENTS_COLLECTION = 'qnaContents';
const ANSWERS_COLLECTION = 'qnaAnswers';

const getQuestionRef = (id) => doc(db, QUESTIONS_COLLECTION, id);
const getContentRef = (id) => doc(db, CONTENTS_COLLECTION, id);
const getAnswerRef = (id) => doc(db, ANSWERS_COLLECTION, id);

const requireMember = async () => {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('로그인한 회원만 이용할 수 있습니다.');
  return user;
};

const isAdminUser = (user) => Boolean(user && !user.isAnonymous && user.email === ADMIN_EMAIL);

const normalizeQuestionInput = ({ category, title, content, isPrivate }) => {
  const normalizedTitle = title.trim();
  const normalizedContent = content.trim();
  if (!QNA_CATEGORIES.includes(category)) throw new Error('질문 유형을 선택해 주세요.');
  if (!normalizedTitle || normalizedTitle.length > QNA_TITLE_MAX_LENGTH) {
    throw new Error(`제목은 1~${QNA_TITLE_MAX_LENGTH}자로 입력해 주세요.`);
  }
  if (!normalizedContent || normalizedContent.length > QNA_CONTENT_MAX_LENGTH) {
    throw new Error('질문 내용을 확인해 주세요.');
  }
  return { category, title: normalizedTitle, content: normalizedContent, isPrivate: Boolean(isPrivate) };
};

export const qnaService = {
  getAll: async () => {
    const postsQuery = query(collection(db, QUESTIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map((post) => ({ id: post.id, ...post.data() }));
  },

  getQuestion: async (id, currentUser = auth.currentUser) => {
    if (!id || id.includes('/')) return null;
    const questionSnapshot = await getDoc(getQuestionRef(id));
    if (!questionSnapshot.exists()) return null;

    const question = { id: questionSnapshot.id, ...questionSnapshot.data() };
    const isAdmin = isAdminUser(currentUser);
    const isOwner = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid === question.ownerUid);
    const canRead = !question.isPrivate || isAdmin || isOwner;
    if (!canRead) return { ...question, content: '', answer: '', canRead: false, canEdit: false, canAnswer: false };

    const contentSnapshot = await getDoc(getContentRef(id));
    if (!contentSnapshot.exists()) throw new Error('질문 내용을 불러오지 못했습니다.');
    let answer = '';
    if (question.hasAnswer) {
      const answerSnapshot = await getDoc(getAnswerRef(id));
      answer = answerSnapshot.exists() ? String(answerSnapshot.data().content ?? '') : '';
    }

    return {
      ...question,
      content: String(contentSnapshot.data().content ?? ''),
      answer,
      canRead: true,
      canEdit: isOwner,
      canAnswer: isAdmin,
    };
  },

  create: async (input) => {
    const user = await requireMember();
    const question = normalizeQuestionInput(input);
    const questionRef = doc(collection(db, QUESTIONS_COLLECTION));
    const now = new Date().toISOString();
    const batch = writeBatch(db);
    batch.set(questionRef, {
      category: question.category,
      title: question.title,
      createdAt: now,
      updatedAt: now,
      ownerUid: user.uid,
      isPrivate: question.isPrivate,
      hasAnswer: false,
    });
    batch.set(getContentRef(questionRef.id), {
      ownerUid: user.uid,
      isPrivate: question.isPrivate,
      content: question.content,
      createdAt: now,
      updatedAt: now,
    });
    await batch.commit();
    return questionRef.id;
  },

  update: async (id, input) => {
    const user = await requireMember();
    const question = normalizeQuestionInput(input);
    const questionRef = getQuestionRef(id);
    const snapshot = await getDoc(questionRef);
    if (!snapshot.exists() || snapshot.data().ownerUid !== user.uid) {
      throw new Error('본인이 작성한 질문만 수정할 수 있습니다.');
    }

    const now = new Date().toISOString();
    const batch = writeBatch(db);
    batch.update(questionRef, {
      category: question.category,
      title: question.title,
      isPrivate: question.isPrivate,
      updatedAt: now,
    });
    batch.update(getContentRef(id), {
      content: question.content,
      isPrivate: question.isPrivate,
      updatedAt: now,
    });
    await batch.commit();
    return id;
  },

  delete: async (id) => {
    const user = await requireMember();
    const questionRef = getQuestionRef(id);
    const snapshot = await getDoc(questionRef);
    if (!snapshot.exists() || snapshot.data().ownerUid !== user.uid) {
      throw new Error('본인이 작성한 질문만 삭제할 수 있습니다.');
    }

    const batch = writeBatch(db);
    batch.delete(questionRef);
    batch.delete(getContentRef(id));
    if (snapshot.data().hasAnswer) batch.delete(getAnswerRef(id));
    await batch.commit();
  },

  saveAnswer: async (id, content) => {
    const user = await requireMember();
    if (!isAdminUser(user)) throw new Error('관리자만 답변을 등록할 수 있습니다.');
    const answerContent = content.trim();
    if (!answerContent || answerContent.length > QNA_CONTENT_MAX_LENGTH) {
      throw new Error('답변 내용을 확인해 주세요.');
    }

    const questionRef = getQuestionRef(id);
    const answerRef = getAnswerRef(id);
    await runTransaction(db, async (transaction) => {
      const questionSnapshot = await transaction.get(questionRef);
      if (!questionSnapshot.exists()) throw new Error('질문을 찾을 수 없습니다.');
      let existingAnswerData = null;
      if (questionSnapshot.data().hasAnswer) {
        const answerSnapshot = await transaction.get(answerRef);
        if (answerSnapshot.exists()) existingAnswerData = answerSnapshot.data();
      }
      const now = new Date().toISOString();
      transaction.set(answerRef, {
        questionId: id,
        ownerUid: questionSnapshot.data().ownerUid,
        adminUid: user.uid,
        content: answerContent,
        createdAt: existingAnswerData?.createdAt ?? now,
        updatedAt: now,
      });
      transaction.update(questionRef, { hasAnswer: true });
    });
  },
};
