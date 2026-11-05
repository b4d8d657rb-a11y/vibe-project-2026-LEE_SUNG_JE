import { NOTICE_CATEGORIES } from '../data/notice-seed.js';
import { NOTICE_MAX_ATTACHMENT_BYTES, NOTICE_PAGE_SIZE } from '../config/notice-board.js';
import { initializeNoticeTicker } from './notice-ticker.js';
import { postService } from '../services/post-service.js';
import {
  renderDetailView,
  renderFormView,
  renderListView,
  renderStatusView,
} from './notice-board-view.js';

const viewRoot = document.querySelector('[data-notice-view]');
if (!(viewRoot instanceof HTMLElement)) {
  throw new Error('공지사항 화면을 찾을 수 없습니다.');
}

const getRoute = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    view: params.get('view') ?? 'list',
    mode: params.get('mode') ?? 'create',
    id: params.get('id') ?? '',
    category: params.get('category') ?? '',
    query: (params.get('q') ?? '').trim(),
    page: Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1),
  };
};

const sortPosts = (posts) => [...posts].sort((first, second) => {
  if (first.isPinned !== second.isPinned) return first.isPinned ? -1 : 1;
  return new Date(second.createdAt) - new Date(first.createdAt);
});

const setPageTitle = (title) => {
  document.title = `${title} | Nothing 지원센터`;
};

const showView = (view) => {
  viewRoot.replaceChildren(view);
  viewRoot.setAttribute('aria-busy', 'false');
};

const buildListUrl = (query = '') => {
  const params = new URLSearchParams({ view: 'list' });
  if (query) params.set('q', query);
  return `./notice.html?${params.toString()}`;
};

const renderList = async (route) => {
  setPageTitle('공지사항');
  const posts = sortPosts(await postService.getAll());
  const category = NOTICE_CATEGORIES.includes(route.category) ? route.category : '';
  showView(renderListView({
    posts,
    category,
    query: route.query,
    page: route.page,
    pageSize: NOTICE_PAGE_SIZE,
  }));
};

const renderDetail = async (route) => {
  setPageTitle('공지사항 상세');
  const post = await postService.incrementViews(route.id);
  if (!post) {
    showView(renderStatusView('게시글을 찾을 수 없습니다.', true));
    return;
  }

  const posts = sortPosts(await postService.getAll());
  const postIndex = posts.findIndex((item) => item.id === post.id);
  showView(renderDetailView({
    post,
    previousPost: posts[postIndex + 1] ?? null,
    nextPost: posts[postIndex - 1] ?? null,
  }));
};

const renderForm = async (route) => {
  const isEdit = route.mode === 'edit';
  setPageTitle(isEdit ? '공지 수정' : '공지 작성');
  if (!isEdit) {
    showView(renderFormView({ post: null, mode: 'create' }));
    return;
  }

  const post = await postService.getById(route.id);
  if (!post) {
    showView(renderStatusView('수정할 게시글을 찾을 수 없습니다.', true));
    return;
  }
  showView(renderFormView({ post, mode: 'edit' }));
};

const renderRoute = async () => {
  const route = getRoute();
  viewRoot.setAttribute('aria-busy', 'true');
  viewRoot.replaceChildren(renderStatusView('공지사항을 불러오는 중입니다.'));

  try {
    if (route.view === 'detail') {
      await renderDetail(route);
    } else if (route.view === 'form') {
      await renderForm(route);
    } else {
      await renderList(route);
    }
  } catch (error) {
    console.error('공지사항을 불러오지 못했습니다.', error);
    showView(renderStatusView('공지사항을 불러오지 못했습니다. 새로고침해 주세요.', true));
  }
};

const displayFormMessage = (form, message) => {
  const messageElement = form.querySelector('[data-form-message]');
  if (!(messageElement instanceof HTMLElement)) return;
  messageElement.textContent = message;
  messageElement.hidden = false;
};

const getAttachment = (form, existingAttachment) => {
  const fileInput = form.querySelector('[data-notice-file]');
  const removeInput = form.querySelector('[data-remove-attachment]');
  if (!(fileInput instanceof HTMLInputElement)) return existingAttachment;
  const file = fileInput.files?.[0];
  if (file && file.size > NOTICE_MAX_ATTACHMENT_BYTES) {
    throw new Error('첨부파일은 10MB 이하만 등록할 수 있습니다.');
  }
  if (file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
  }
  if (removeInput instanceof HTMLInputElement && removeInput.checked) return null;

  return existingAttachment;
};

const submitNoticeForm = async (form) => {
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const category = String(formData.get('category') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  if (!NOTICE_CATEGORIES.includes(category)) {
    displayFormMessage(form, '카테고리를 선택해 주세요.');
    return;
  }
  if (!title || !content) {
    displayFormMessage(form, '제목과 내용을 모두 입력해 주세요.');
    return;
  }

  const postId = form.dataset.postId ?? '';
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
  viewRoot.setAttribute('aria-busy', 'true');

  try {
    const currentPost = postId ? await postService.getById(postId) : null;
    if (postId && !currentPost) throw new Error('게시글을 찾을 수 없습니다.');
    const attachment = getAttachment(form, currentPost?.attachment ?? null);
    const postData = { category, title, content, attachment };
    const savedPost = postId
      ? await postService.update(postId, postData)
      : await postService.create(postData);
    window.location.href = `./notice.html?view=detail&id=${encodeURIComponent(savedPost.id)}`;
  } catch (error) {
    console.error('공지사항을 저장하지 못했습니다.', error);
    displayFormMessage(form, error instanceof Error ? error.message : '저장 중 문제가 발생했습니다. 다시 시도해 주세요.');
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
    viewRoot.setAttribute('aria-busy', 'false');
  }
};

viewRoot.addEventListener('submit', (event) => {
  if (event.target instanceof HTMLFormElement && event.target.matches('[data-notice-form]')) {
    event.preventDefault();
    void submitNoticeForm(event.target);
  }
});

viewRoot.addEventListener('change', (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-notice-file]')) return;
  const file = event.target.files?.[0];
  const nameElement = viewRoot.querySelector('.notice-form__file-name');
  const form = event.target.closest('[data-notice-form]');
  if (file && file.size > NOTICE_MAX_ATTACHMENT_BYTES) {
    event.target.value = '';
    if (nameElement instanceof HTMLElement && form instanceof HTMLFormElement) {
      nameElement.textContent = form.dataset.currentAttachment || '선택된 파일 없음';
    }
    if (form instanceof HTMLFormElement) displayFormMessage(form, '첨부파일은 10MB 이하만 등록할 수 있습니다.');
    return;
  }
  if (nameElement instanceof HTMLElement) nameElement.textContent = file?.name ?? '선택된 파일 없음';
});

viewRoot.addEventListener('click', async (event) => {
  if (!(event.target instanceof Element)) return;
  const deleteButton = event.target.closest('[data-notice-action="delete"]');
  if (!(deleteButton instanceof HTMLButtonElement)) return;
  if (!window.confirm('이 공지사항을 삭제할까요?')) return;

  deleteButton.disabled = true;
  viewRoot.setAttribute('aria-busy', 'true');
  try {
    await postService.delete(deleteButton.dataset.postId ?? '');
    window.location.href = buildListUrl();
  } catch (error) {
    console.error('공지사항을 삭제하지 못했습니다.', error);
    window.alert(error instanceof Error ? error.message : '삭제 중 문제가 발생했습니다.');
    deleteButton.disabled = false;
    viewRoot.setAttribute('aria-busy', 'false');
  }
});

const searchForms = document.querySelectorAll('.support-hero__search');
searchForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    const input = form.querySelector('input[name="q"]');
    if (!(input instanceof HTMLInputElement)) return;
    event.preventDefault();
    window.location.href = buildListUrl(input.value.trim());
  });
});

const heroSearch = document.querySelector('#support-search');
if (heroSearch instanceof HTMLInputElement) {
  heroSearch.value = getRoute().query;
}

void initializeNoticeTicker();
void renderRoute();
