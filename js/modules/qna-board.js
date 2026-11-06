import { QNA_CATEGORIES } from '../config/qna-board.js';
import { authService } from '../services/auth-service.js';
import { qnaService } from '../services/qna-service.js';
import { initializeAuthStatus } from './auth-status.js';
import { siteShellReady } from './site-shell.js';
import {
  renderQnaDetailView,
  renderQnaFormView,
  renderQnaListView,
  renderQnaStatusView,
} from './qna-board-view.js';

await siteShellReady;
initializeAuthStatus();

const viewRoot = document.querySelector('[data-qna-view]');
if (!(viewRoot instanceof HTMLElement)) throw new Error('묻고답하기 화면을 찾을 수 없습니다.');

let currentUser = null;
let renderVersion = 0;

const getRoute = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    view: params.get('view') ?? 'list',
    mode: params.get('mode') ?? 'create',
    id: params.get('id') ?? '',
    category: params.get('category') ?? '',
    query: (params.get('q') ?? '').trim(),
  };
};

const setPageTitle = (title) => {
  document.title = `${title} | Nothing 지원센터`;
};

const showView = (view, version) => {
  if (version !== renderVersion) return;
  viewRoot.replaceChildren(view);
  viewRoot.setAttribute('aria-busy', 'false');
};

const renderList = async (route, version) => {
  setPageTitle('묻고답하기');
  const posts = await qnaService.getAll();
  const selectedCategory = QNA_CATEGORIES.includes(route.category) ? route.category : '';
  const normalizedQuery = route.query.toLocaleLowerCase('ko-KR');
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesQuery = !normalizedQuery || post.title.toLocaleLowerCase('ko-KR').includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  showView(renderQnaListView({
    posts: filteredPosts,
    categories: QNA_CATEGORIES,
    category: selectedCategory,
    query: route.query,
    isMember: Boolean(currentUser),
  }), version);
};

const renderDetail = async (route, version) => {
  setPageTitle('질문 상세');
  const question = await qnaService.getQuestion(route.id, currentUser);
  if (!question) {
    showView(renderQnaStatusView('질문을 찾을 수 없습니다.', { isError: true }), version);
    return;
  }
  showView(renderQnaDetailView(question), version);
};

const renderForm = async (route, version) => {
  if (!currentUser) {
    setPageTitle('로그인 필요');
    showView(renderQnaStatusView('로그인한 회원만 질문을 작성할 수 있습니다.', { showLogin: true }), version);
    return;
  }

  const isEdit = route.mode === 'edit';
  setPageTitle(isEdit ? '질문 수정' : '질문 작성');
  if (!isEdit) {
    showView(renderQnaFormView({ categories: QNA_CATEGORIES }), version);
    return;
  }

  const question = await qnaService.getQuestion(route.id, currentUser);
  if (!question || !question.canEdit) {
    showView(renderQnaStatusView('본인이 작성한 질문만 수정할 수 있습니다.', { isError: true }), version);
    return;
  }
  showView(renderQnaFormView({ categories: QNA_CATEGORIES, post: question, mode: 'edit' }), version);
};

const renderRoute = async () => {
  const version = ++renderVersion;
  const route = getRoute();
  viewRoot.setAttribute('aria-busy', 'true');
  viewRoot.replaceChildren(renderQnaStatusView('묻고답하기를 불러오는 중입니다.'));

  try {
    if (route.view === 'detail') {
      await renderDetail(route, version);
    } else if (route.view === 'form') {
      await renderForm(route, version);
    } else {
      await renderList(route, version);
    }
  } catch (error) {
    console.error('묻고답하기를 불러오지 못했습니다.', error);
    showView(renderQnaStatusView('질문을 불러오지 못했습니다. 다시 시도해 주세요.', { isError: true }), version);
  }
};

const setFormMessage = (form, message) => {
  const messageElement = form.querySelector('[data-qna-form-message], [data-qna-answer-message]');
  if (!(messageElement instanceof HTMLElement)) return;
  messageElement.textContent = message;
  messageElement.hidden = false;
};

const submitQuestion = async (form) => {
  if (!currentUser) {
    setFormMessage(form, '로그인한 회원만 질문을 작성할 수 있습니다.');
    return;
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
  try {
    const input = {
      category: String(data.get('category') ?? ''),
      title: String(data.get('title') ?? ''),
      content: String(data.get('content') ?? ''),
      isPrivate: data.has('isPrivate'),
    };
    const id = form.dataset.postId
      ? await qnaService.update(form.dataset.postId, input)
      : await qnaService.create(input);
    window.location.href = `./qna.html?view=detail&id=${encodeURIComponent(id)}`;
  } catch (error) {
    console.error('질문을 저장하지 못했습니다.', error);
    setFormMessage(form, error instanceof Error ? error.message : '질문을 저장하지 못했습니다.');
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
  }
};

const submitAnswer = async (form) => {
  if (!form.reportValidity()) return;
  const submitButton = form.querySelector('button[type="submit"]');
  const content = form.querySelector('[name="content"]');
  if (!(content instanceof HTMLTextAreaElement)) return;
  if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
  try {
    await qnaService.saveAnswer(getRoute().id, content.value);
    await renderRoute();
  } catch (error) {
    console.error('답변을 저장하지 못했습니다.', error);
    setFormMessage(form, error instanceof Error ? error.message : '답변을 저장하지 못했습니다.');
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
  }
};

viewRoot.addEventListener('submit', (event) => {
  if (!(event.target instanceof HTMLFormElement)) return;
  if (event.target.matches('[data-qna-filter]')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const params = new URLSearchParams({ view: 'list' });
    const category = String(data.get('category') ?? '');
    const query = String(data.get('q') ?? '').trim();
    if (category) params.set('category', category);
    if (query) params.set('q', query);
    window.location.href = `./qna.html?${params.toString()}`;
  } else if (event.target.matches('[data-qna-form]')) {
    event.preventDefault();
    void submitQuestion(event.target);
  } else if (event.target.matches('[data-qna-answer-form]')) {
    event.preventDefault();
    void submitAnswer(event.target);
  }
});

viewRoot.addEventListener('click', async (event) => {
  if (!(event.target instanceof Element)) return;
  const deleteButton = event.target.closest('[data-qna-action="delete"]');
  if (!(deleteButton instanceof HTMLButtonElement) || !currentUser) return;
  if (!window.confirm('이 질문을 삭제할까요?')) return;
  deleteButton.disabled = true;
  try {
    await qnaService.delete(getRoute().id);
    window.location.href = './qna.html';
  } catch (error) {
    console.error('질문을 삭제하지 못했습니다.', error);
    window.alert(error instanceof Error ? error.message : '질문을 삭제하지 못했습니다.');
    deleteButton.disabled = false;
  }
});

authService.subscribe((user) => {
  currentUser = user && !user.isAnonymous ? user : null;
  void renderRoute();
});
