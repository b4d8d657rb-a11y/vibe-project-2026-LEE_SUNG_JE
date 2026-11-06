import { authService } from '../services/auth-service.js';

const message = document.querySelector('[data-auth-message]');
const loginForm = document.querySelector('[data-login-form]');
const signupForm = document.querySelector('[data-signup-form]');
const closeButton = document.querySelector('[data-auth-close]');
const loginView = document.querySelector('[data-login-view]');
const signupView = document.querySelector('[data-signup-view]');
const pageTitle = document.querySelector('#auth-title');
const showSignupButton = document.querySelector('[data-show-signup]');
const showLoginButton = document.querySelector('[data-show-login]');

if (
  !(message instanceof HTMLElement) ||
  !(loginForm instanceof HTMLFormElement) ||
  !(signupForm instanceof HTMLFormElement) ||
  !(closeButton instanceof HTMLButtonElement) ||
  !(loginView instanceof HTMLElement) ||
  !(signupView instanceof HTMLElement) ||
  !(pageTitle instanceof HTMLHeadingElement) ||
  !(showSignupButton instanceof HTMLButtonElement) ||
  !(showLoginButton instanceof HTMLButtonElement)
) {
  throw new Error('인증 화면을 초기화할 수 없습니다.');
}

const setMessage = (text, isError = false) => {
  message.textContent = text;
  message.hidden = !text;
  message.dataset.error = String(isError);
};

const getErrorMessage = (error) => {
  const messages = {
    'auth/email-already-in-use': '이미 가입된 이메일입니다.',
    'auth/invalid-credential': '아이디 또는 비밀번호를 확인해 주세요.',
    'auth/invalid-email': '이메일 형식을 확인해 주세요.',
    'auth/network-request-failed': '네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
    'auth/operation-not-allowed': 'Firebase Console에서 Authentication의 Email/Password 로그인을 활성화해 주세요.',
    'auth/too-many-requests': '잠시 후 다시 시도해 주세요.',
    'auth/weak-password': '비밀번호를 6자 이상 입력해 주세요.',
  };
  if (error instanceof Error && 'code' in error && messages[error.code]) return messages[error.code];
  return error instanceof Error ? error.message : '요청을 처리하지 못했습니다. 다시 시도해 주세요.';
};

const completeAuthentication = (text) => {
  setMessage(text);
  window.opener?.postMessage({ type: 'nothing-auth:updated' }, window.location.origin);
  window.close();
};

showSignupButton.addEventListener('click', () => {
  setMessage('');
  loginView.hidden = true;
  signupView.hidden = false;
  pageTitle.textContent = '회원가입';
  signupForm.querySelector('input')?.focus();
});

showLoginButton.addEventListener('click', () => {
  setMessage('');
  signupView.hidden = true;
  loginView.hidden = false;
  pageTitle.textContent = '로그인';
  loginForm.querySelector('input')?.focus();
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  const submitButton = loginForm.querySelector('button[type="submit"]');
  if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
  setMessage('로그인 중입니다.');
  const formData = new FormData(loginForm);
  try {
    await authService.signIn(String(formData.get('id') ?? ''), String(formData.get('password') ?? ''));
    completeAuthentication('로그인되었습니다.');
  } catch (error) {
    setMessage(getErrorMessage(error), true);
  } finally {
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
  }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!signupForm.reportValidity()) return;
  const submitButton = signupForm.querySelector('button[type="submit"]');
  if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
  setMessage('회원가입 중입니다.');
  const formData = new FormData(signupForm);
  try {
    await authService.register({
      name: String(formData.get('name') ?? ''),
      id: String(formData.get('id') ?? ''),
      password: String(formData.get('password') ?? ''),
      email: String(formData.get('email') ?? ''),
    });
    completeAuthentication('회원가입과 로그인이 완료되었습니다.');
  } catch (error) {
    setMessage(getErrorMessage(error), true);
  } finally {
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
  }
});

closeButton.addEventListener('click', () => window.close());
