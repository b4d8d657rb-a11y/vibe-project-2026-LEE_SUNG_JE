import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  doc,
  getDoc,
  runTransaction,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { auth, db, ensureAnonymousUser } from './firebase/firebaseConfig.js';

export const ADMIN_ID = 'admin';
export const ADMIN_EMAIL = 'admin.com@company.co.kr';
const USERNAMES_COLLECTION = 'usernames';

const getUsernameRef = (id) => doc(db, USERNAMES_COLLECTION, id);

const normalizeId = (id) => id.trim().toLocaleLowerCase('ko-KR');

export const authService = {
  subscribe: (callback) => onAuthStateChanged(auth, callback),

  signIn: async (id, password) => {
    await ensureAnonymousUser();
    const normalizedId = normalizeId(id);
    let email = ADMIN_EMAIL;
    if (normalizedId !== ADMIN_ID) {
      const usernameSnapshot = await getDoc(getUsernameRef(normalizedId));
      if (!usernameSnapshot.exists()) throw new Error('아이디 또는 비밀번호를 확인해 주세요.');
      email = usernameSnapshot.data().email;
    }
    return signInWithEmailAndPassword(auth, email, password);
  },

  register: async ({ name, id, password, email }) => {
    const normalizedId = normalizeId(id);
    const normalizedEmail = email.trim().toLocaleLowerCase('en-US');
    if (normalizedId === ADMIN_ID || normalizedEmail === ADMIN_EMAIL) {
      throw new Error('사용할 수 없는 계정 정보입니다.');
    }
    await ensureAnonymousUser();

    const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    try {
      await updateProfile(credential.user, { displayName: name.trim() });
      await runTransaction(db, async (transaction) => {
        const usernameRef = getUsernameRef(normalizedId);
        const usernameSnapshot = await transaction.get(usernameRef);
        if (usernameSnapshot.exists()) throw new Error('이미 사용 중인 아이디입니다.');
        transaction.set(usernameRef, {
          uid: credential.user.uid,
          email: credential.user.email,
        });
      });
      return credential.user;
    } catch (error) {
      await deleteUser(credential.user);
      throw error;
    }
  },

  signOut: () => signOut(auth),
};
