const element = (tagName, className = '', text = '') => {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const link = (href, className, text) => {
  const node = element('a', className, text);
  node.href = href;
  return node;
};

const button = (className, text, action = '') => {
  const node = element('button', className, text);
  node.type = 'button';
  if (action) node.dataset.qnaAction = action;
  return node;
};

const makeListUrl = ({ category = '', query = '' } = {}) => {
  const params = new URLSearchParams({ view: 'list' });
  if (category) params.set('category', category);
  if (query) params.set('q', query);
  return `./qna.html?${params.toString()}`;
};

const makeDetailUrl = (id) => `./qna.html?view=detail&id=${encodeURIComponent(id)}`;
const makeFormUrl = (id = '') => {
  const params = new URLSearchParams({ view: 'form', mode: id ? 'edit' : 'create' });
  if (id) params.set('id', id);
  return `./qna.html?${params.toString()}`;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date).replaceAll('. ', '.').replace(/\.$/, '');
};

const renderPageHeading = () => {
  const heading = element('header', 'notice-page-heading');
  const copy = element('div', 'notice-page-heading__copy');
  copy.append(
    element('h1', 'notice-page-heading__title', '묻고답하기'),
    element('p', 'notice-page-heading__description', '궁금한 점을 질문하고 답변을 확인하세요.'),
  );
  const breadcrumb = element('nav', 'notice-breadcrumb', 'Home  ›  Support  ›  묻고답하기');
  breadcrumb.setAttribute('aria-label', '현재 위치');
  heading.append(copy, breadcrumb);
  return heading;
};

const renderFilterToolbar = ({ categories, category, query, isMember }) => {
  const toolbar = element('div', 'notice-toolbar qna-toolbar');
  const form = element('form', 'notice-toolbar__filters');
  form.dataset.qnaFilter = '';
  const categorySelect = element('select', 'notice-select');
  categorySelect.name = 'category';
  categorySelect.setAttribute('aria-label', '질문 유형 필터');
  const allOption = element('option', '', '전체 유형');
  allOption.value = '';
  categorySelect.append(allOption);
  categories.forEach((value) => {
    const option = element('option', '', value);
    option.value = value;
    categorySelect.append(option);
  });
  categorySelect.value = category;

  const search = element('div', 'notice-search');
  const searchInput = element('input', 'notice-search__input');
  searchInput.type = 'search';
  searchInput.name = 'q';
  searchInput.value = query;
  searchInput.placeholder = '질문 제목 검색';
  searchInput.setAttribute('aria-label', '질문 제목 검색');
  const searchButton = element('button', 'notice-search__button', '검색');
  searchButton.type = 'submit';
  search.append(searchInput, searchButton);
  form.append(categorySelect, search);

  const createLink = isMember
    ? link(makeFormUrl(), 'notice-button notice-button--primary notice-toolbar__write', '질문하기')
    : link('../../pages/auth.html', 'notice-button notice-button--primary notice-toolbar__write', '로그인 후 질문하기');
  toolbar.append(form, createLink);
  return toolbar;
};

const renderQuestionRow = (question) => {
  const row = element('tr', 'notice-table__row qna-table__row');
  const answerCell = element('td', 'notice-table__cell qna-table__answer-status');
  answerCell.dataset.label = '답변';
  answerCell.append(element(
    'span',
    question.hasAnswer ? 'qna-answer-badge is-complete' : 'qna-answer-badge',
    question.hasAnswer ? '답변완료' : '답변대기',
  ));

  const categoryCell = element('td', 'notice-table__cell qna-table__category');
  categoryCell.dataset.label = '유형';
  categoryCell.append(element('span', 'qna-category-label', question.category));

  const titleCell = element('td', 'notice-table__cell notice-table__title-cell qna-table__title-cell');
  titleCell.dataset.label = '질문';
  const titleGroup = element('div', 'notice-table__title-group qna-table__title-group');
  titleGroup.append(link(makeDetailUrl(question.id), 'notice-table__title', question.title));
  if (question.isPrivate) titleGroup.append(element('span', 'qna-private-label', '비공개'));
  titleCell.append(titleGroup);

  const dateCell = element('td', 'notice-table__cell notice-table__date');
  dateCell.dataset.label = '등록일';
  dateCell.textContent = formatDate(question.createdAt);
  row.append(answerCell, categoryCell, titleCell, dateCell);
  return row;
};

export const renderQnaListView = ({ posts, categories, category, query, isMember }) => {
  const root = element('div', 'notice-view notice-view--list qna-view');
  root.append(renderPageHeading(), renderFilterToolbar({ categories, category, query, isMember }));

  const table = element('table', 'notice-table qna-table');
  table.append(element('caption', 'visually-hidden', '묻고답하기 질문 목록'));
  const head = element('thead', 'notice-table__head');
  const headerRow = element('tr');
  ['답변 상태', '질문 유형', '질문', '등록일'].forEach((label) => {
    const heading = element('th', 'notice-table__heading-cell', label);
    heading.scope = 'col';
    headerRow.append(heading);
  });
  head.append(headerRow);

  const body = element('tbody');
  if (posts.length) {
    posts.forEach((post) => body.append(renderQuestionRow(post)));
  } else {
    const emptyRow = element('tr', 'notice-table__empty');
    const emptyCell = element('td', 'notice-table__cell', '등록된 질문이 없습니다.');
    emptyCell.colSpan = 4;
    emptyRow.append(emptyCell);
    body.append(emptyRow);
  }
  table.append(head, body);
  root.append(table, element('p', 'visually-hidden', `전체 ${posts.length}건`));
  return root;
};

const renderAnswerForm = (question) => {
  const section = element('section', 'qna-answer-section');
  section.append(element('h4', 'qna-answer-section__title', question.hasAnswer ? '답변' : '답변 작성'));
  if (question.hasAnswer) {
    section.append(element('div', 'notice-detail__body qna-answer__body', question.answer || '답변을 불러오지 못했습니다.'));
  }
  if (!question.canAnswer) return section;

  const form = element('form', 'notice-form qna-answer-form');
  form.dataset.qnaAnswerForm = '';
  const label = element('label', 'notice-form__label', '답변 내용');
  label.htmlFor = 'qna-answer-content';
  const content = element('textarea', 'notice-form__textarea');
  content.id = 'qna-answer-content';
  content.name = 'content';
  content.required = true;
  content.maxLength = 900000;
  content.rows = 7;
  content.value = question.answer ?? '';
  content.placeholder = '답변을 입력해 주세요.';
  form.append(label, content);
  const message = element('p', 'notice-form__message');
  message.dataset.qnaAnswerMessage = '';
  message.setAttribute('role', 'alert');
  message.hidden = true;
  const actions = element('div', 'notice-form__actions');
  const submit = element('button', 'notice-button notice-button--primary', question.hasAnswer ? '답변 수정' : '답변 등록');
  submit.type = 'submit';
  actions.append(submit);
  form.append(message, actions);
  section.append(form);
  return section;
};

export const renderQnaDetailView = (question) => {
  const root = element('div', 'notice-view notice-view--detail qna-view');
  root.append(renderPageHeading());
  const actions = element('div', 'notice-detail__top-actions');
  actions.append(link(makeListUrl(), 'notice-button notice-button--secondary', '← 목록으로'));
  if (question.canEdit) {
    const management = element('div', 'notice-detail__management');
    management.append(link(makeFormUrl(question.id), 'notice-button notice-button--secondary', '수정하기'));
    management.append(button('notice-button notice-button--secondary', '삭제하기', 'delete'));
    actions.append(management);
  }
  root.append(actions);

  if (!question.canRead) {
    root.append(element('p', 'notice-status', '비공개 질문입니다. 작성자와 관리자만 내용을 볼 수 있습니다.'));
    return root;
  }

  const article = element('article', 'notice-detail qna-question');
  const articleHeader = element('header', 'notice-detail__header');
  articleHeader.append(
    element('span', 'qna-category-label', question.category),
    element('h3', 'notice-detail__title', question.title),
  );
  if (question.isPrivate) articleHeader.append(element('span', 'qna-private-label', '비공개 질문'));
  const meta = element('div', 'notice-detail__meta');
  meta.append(element('time', '', formatDate(question.createdAt)));
  articleHeader.append(meta);
  article.append(articleHeader, element('div', 'notice-detail__body qna-question__body', question.content));
  root.append(article);
  if (question.hasAnswer || question.canAnswer) root.append(renderAnswerForm(question));
  return root;
};

const makeFormField = (labelText, control, required = false, hint = '') => {
  const field = element('div', 'notice-form__field');
  const label = element('label', 'notice-form__label', labelText);
  label.htmlFor = control.id;
  field.append(label, control);
  if (hint) field.append(element('p', 'notice-form__hint', hint));
  return field;
};

export const renderQnaFormView = ({ categories, post = null, mode = 'create' }) => {
  const isEdit = mode === 'edit';
  const root = element('div', 'notice-view notice-view--form qna-view');
  root.append(renderPageHeading());
  const form = element('form', 'notice-form qna-form');
  form.dataset.qnaForm = '';
  form.dataset.mode = mode;
  if (post) form.dataset.postId = post.id;

  const category = element('select', 'notice-form__select');
  category.id = 'qna-category';
  category.name = 'category';
  category.required = true;
  const placeholder = element('option', '', '질문 유형을 선택해 주세요.');
  placeholder.value = '';
  category.append(placeholder);
  categories.forEach((name) => {
    const option = element('option', '', name);
    option.value = name;
    category.append(option);
  });
  category.value = post?.category ?? '';

  const title = element('input', 'notice-form__input');
  title.id = 'qna-title';
  title.name = 'title';
  title.type = 'text';
  title.maxLength = 100;
  title.required = true;
  title.value = post?.title ?? '';
  title.placeholder = '질문 제목을 입력해 주세요.';

  const content = element('textarea', 'notice-form__textarea');
  content.id = 'qna-content';
  content.name = 'content';
  content.rows = 12;
  content.maxLength = 900000;
  content.required = true;
  content.value = post?.content ?? '';
  content.placeholder = '질문 내용을 입력해 주세요.';

  const fields = element('div', 'notice-form__fields qna-form__fields');
  fields.append(
    makeFormField('질문 유형', category, true),
    makeFormField('제목', title, true),
    makeFormField('내용', content, true),
  );
  const privateLabel = element('label', 'qna-private-toggle');
  const privateInput = element('input');
  privateInput.type = 'checkbox';
  privateInput.name = 'isPrivate';
  privateInput.checked = Boolean(post?.isPrivate);
  privateLabel.append(privateInput, element('span', '', '비공개 질문으로 등록'));

  const message = element('p', 'notice-form__message');
  message.dataset.qnaFormMessage = '';
  message.setAttribute('role', 'alert');
  message.hidden = true;
  const actions = element('div', 'notice-form__actions');
  const cancel = link(post ? makeDetailUrl(post.id) : makeListUrl(), 'notice-button notice-button--secondary', '취소');
  const submit = element('button', 'notice-button notice-button--primary', isEdit ? '수정하기' : '질문 등록');
  submit.type = 'submit';
  actions.append(cancel, submit);
  form.append(fields, privateLabel, message, actions);
  root.append(form);
  return root;
};

export const renderQnaStatusView = (message, { showLogin = false, isError = false } = {}) => {
  const root = element('div', 'notice-view notice-view--status qna-view');
  root.append(renderPageHeading());
  const status = element('p', isError ? 'notice-status is-error' : 'notice-status', message);
  if (isError) status.setAttribute('role', 'alert');
  root.append(status);
  if (showLogin) root.append(link('../../pages/auth.html', 'notice-button notice-button--primary', '로그인'));
  root.append(link(makeListUrl(), 'notice-button notice-button--secondary', '목록으로'));
  return root;
};
