import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
	apiKey: 'AIzaSyB_06M4XkpIsf8n4ZOh0Co4skXD0FOSHRA',
	authDomain: 'sj-web-pj.firebaseapp.com',
	projectId: 'sj-web-pj',
	storageBucket: 'sj-web-pj.firebasestorage.app',
	messagingSenderId: '636753231038',
	appId: '1:636753231038:web:6edef6b8015353ccb2b2ef',
	measurementId: 'G-5PBZ009QWK',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseProjectId = firebaseConfig.projectId;

let anonymousSignInPromise = null;

export const ensureAnonymousUser = async () => {
	await auth.authStateReady();
	if (auth.currentUser) return auth.currentUser;

	anonymousSignInPromise ??= signInAnonymously(auth)
		.then(({ user }) => user)
		.catch((error) => {
			anonymousSignInPromise = null;
			throw error;
		});

	return anonymousSignInPromise;
};
