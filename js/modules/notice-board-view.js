import { NOTICE_CATEGORIES } from '../data/notice-seed.js';

const element = (tagName, className = '', text = '') => {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  if (text) {
    node.textContent = text;
  }
  return node;
};

const link = (href, className, text) => {
  const node = element('a', className, text);
  node.href = href;
  return node;
};

const actionButton = (className, text, action) => {
  const node = element('button', className, text);
  node.type = 'button';
  if (action) {
    node.dataset.noticeAction = action;
  }
  return node;
};

const makeListUrl = ({ category, query, page }) => {
  const params = new URLSearchParams({ view: 'list' });
  if (category) params.set('category', category);
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  return `./notice.html?${params.toString()}`;
};

const makeDetailUrl = (id) => `./notice.html?view=detail&id=${encodeURIComponent(id)}`;
const makeFormUrl = (id) => `./notice.html?view=form&mode=edit&id=${encodeURIComponent(id)}`;

const formatDate = (dateValue) => {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(dateValue));
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  return `${year}.${month}.${day}`;
};

const renderPageHeading = () => {
  const heading = element('header', 'notice-page-heading');
  const copy = element('div', 'notice-page-heading__copy');
  copy.append(
    element('h2', 'notice-page-heading__title', 'NOTICE'),
    element('p', 'notice-page-heading__description', 'Nothing의 최신 소식과 공지사항을 확인해보세요.'),
  );

  const breadcrumb = element('nav', 'notice-breadcrumb', 'Home  ›  Support  ›  Notice');
  breadcrumb.setAttribute('aria-label', '현재 위치');
  heading.append(copy, breadcrumb);
  return heading;
};

const renderToolbar = ({ category, query, canManage }) => {
  const toolbar = element('div', 'notice-toolbar');
  const form = element('form', 'notice-toolbar__filters');
  form.method = 'get';
  form.action = './notice.html';

  const viewInput = element('input');
  viewInput.type = 'hidden';
  viewInput.name = 'view';
  viewInput.value = 'list';

  const categorySelect = element('select', 'notice-select');
  categorySelect.name = 'category';
  categorySelect.setAttribute('aria-label', '카테고리 필터');
  const allOption = element('option', '', '전체');
  allOption.value = '';
  categorySelect.append(allOption);
  NOTICE_CATEGORIES.forEach((value) => {
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
  searchInput.placeholder = '검색어를 입력하세요.';
  searchInput.setAttribute('aria-label', '제목 검색');
  const searchButton = element('button', 'notice-search__button');
  searchButton.type = 'submit';
  searchButton.setAttribute('aria-label', '검색');
  const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchIcon.classList.add('notice-search__icon');
  searchIcon.setAttribute('viewBox', '0 0 24 24');
  searchIcon.setAttribute('fill', 'currentColor');
  searchIcon.setAttribute('aria-hidden', 'true');
  searchIcon.setAttribute('focusable', 'false');
  [
    [9, 4], [13, 4], [17, 7], [18, 11], [16, 15], [13, 17],
    [9, 17], [6, 15], [4, 11], [5, 7], [18, 18], [21, 21],
  ].forEach(([cx, cy]) => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', String(cx));
    dot.setAttribute('cy', String(cy));
    dot.setAttribute('r', '1.25');
    searchIcon.append(dot);
  });
  searchButton.append(searchIcon);
  search.append(searchInput, searchButton);
  form.append(viewInput, categorySelect, search);

  toolbar.append(form);
  if (canManage) {
    toolbar.append(link('./notice.html?view=form&mode=create', 'notice-button notice-button--primary notice-toolbar__write', '글쓰기'));
  }
  return toolbar;
};

const renderPagination = ({ page, pageCount, category, query }) => {
  const nav = element('nav', 'notice-pagination');
  nav.setAttribute('aria-label', '페이지 탐색');
  const list = element('ul', 'notice-pagination__list');
  const addPage = (pageNumber, label, isCurrent = false, isDisabled = false) => {
    const item = element('li', 'notice-pagination__item');
    if (isDisabled) {
      const disabled = actionButton('notice-pagination__link is-disabled', label);
      disabled.disabled = true;
      disabled.setAttribute('aria-label', label === '‹' ? '이전 페이지' : '다음 페이지');
      item.append(disabled);
    } else {
      const pageLink = link(
        makeListUrl({ category, query, page: pageNumber }),
        `notice-pagination__link${isCurrent ? ' is-current' : ''}`,
        label,
      );
      if (isCurrent) pageLink.setAttribute('aria-current', 'page');
      if (label === '‹') pageLink.setAttribute('aria-label', '이전 페이지');
      if (label === '›') pageLink.setAttribute('aria-label', '다음 페이지');
      item.append(pageLink);
    }
    list.append(item);
  };

  addPage(Math.max(1, page - 1), '‹', false, page <= 1);
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    addPage(pageNumber, String(pageNumber), pageNumber === page);
  }
  addPage(Math.min(pageCount, page + 1), '›', false, page >= pageCount);
  nav.append(list);
  return nav;
};

const renderPostRow = (post) => {
  const row = element('tr', post.isPinned ? 'notice-table__row is-pinned' : 'notice-table__row');
  const numberCell = element('td', 'notice-table__cell notice-table__number', String(post.number));
  numberCell.dataset.label = '번호';
  const titleCell = element('td', 'notice-table__cell notice-table__title-cell');
  titleCell.dataset.label = '제목';
  const titleGroup = element('div', 'notice-table__title-group');
  if (post.isPinned) {
    titleGroup.append(element('span', 'notice-badge', '공지'));
  }
  titleGroup.append(link(makeDetailUrl(post.id), 'notice-table__title', post.title));
  titleCell.append(titleGroup);

  const dateCell = element('td', 'notice-table__cell notice-table__date', formatDate(post.createdAt));
  dateCell.dataset.label = '등록일';
  const viewsCell = element('td', 'notice-table__cell notice-table__views', new Intl.NumberFormat('ko-KR').format(post.views));
  viewsCell.dataset.label = '조회수';
  row.append(numberCell, titleCell, dateCell, viewsCell);
  return row;
};

export const renderListView = ({ posts, category, query, page, pageSize, canManage }) => {
  const root = element('div', 'notice-view notice-view--list');
  root.append(renderPageHeading());

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !category || post.category === category;
    const matchesQuery = !query || post.title.toLocaleLowerCase('ko-KR').includes(query.toLocaleLowerCase('ko-KR'));
    return matchesCategory && matchesQuery;
  });
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const start = (currentPage - 1) * pageSize;
  const pagePosts = filteredPosts.slice(start, start + pageSize);
  root.append(renderToolbar({ category, query, canManage }));

  const table = element('table', 'notice-table');
  table.append(element('caption', 'visually-hidden', '공지사항 목록'));
  const head = element('thead', 'notice-table__head');
  const headerRow = element('tr');
  [['번호', 'number'], ['제목', 'title'], ['등록일', 'date'], ['조회수', 'views']].forEach(([labelText, modifier]) => {
    headerRow.append(element('th', `notice-table__heading-cell notice-table__heading-cell--${modifier}`, labelText));
  });
  head.append(headerRow);
  const body = element('tbody');
  if (pagePosts.length) {
    pagePosts.forEach((post) => body.append(renderPostRow(post)));
  } else {
    const emptyRow = element('tr', 'notice-table__empty');
    const cell = element('td', 'notice-table__cell', query ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.');
    cell.colSpan = 4;
    emptyRow.append(cell);
    body.append(emptyRow);
  }
  table.append(head, body);
  root.append(table);
  root.append(element('p', 'visually-hidden', `전체 ${filteredPosts.length}건`));
  root.append(renderPagination({ page: currentPage, pageCount, category, query }));
  return root;
};

const renderAdjacentLink = (post, label, direction) => {
  const item = element('li', `notice-adjacent__item notice-adjacent__item--${direction}`);
  item.append(element('span', 'notice-adjacent__label', label));
  if (post) {
    item.append(link(makeDetailUrl(post.id), 'notice-adjacent__link', post.title));
  } else {
    item.append(element('span', 'notice-adjacent__link is-disabled', '게시글이 없습니다.'));
  }
  return item;
};

export const renderDetailView = ({ post, previousPost, nextPost, canManage }) => {
  const root = element('div', 'notice-view notice-view--detail');
  root.append(renderPageHeading());
  const actions = element('div', 'notice-detail__top-actions');
  actions.append(link('./notice.html?view=list', 'notice-button notice-button--secondary', '← 목록으로'));
  if (canManage) {
    const management = element('div', 'notice-detail__management');
    management.append(link(makeFormUrl(post.id), 'notice-button notice-button--secondary', '수정하기'));
    const deleteButton = actionButton('notice-button notice-button--secondary', '삭제하기', 'delete');
    deleteButton.dataset.postId = post.id;
    management.append(deleteButton);
    actions.append(management);
  }

  const article = element('article', 'notice-detail');
  const articleHeader = element('header', 'notice-detail__header');
  const title = element('h3', 'notice-detail__title', post.title);
  const meta = element('div', 'notice-detail__meta');
  const time = element('time', '', formatDate(post.createdAt));
  time.dateTime = post.createdAt;
  meta.append(time, element('span', '', `조회수 ${new Intl.NumberFormat('ko-KR').format(post.views)}`));
  articleHeader.append(title, meta);
  article.append(articleHeader);

  if (post.id === 'seed-20261020-os-30') {
    const visual = element('figure', 'notice-detail__visual');
    const image = element('img', 'notice-detail__visual-image');
    image.src = '../../images/d/nothing-dt-18.jpg';
    image.alt = 'Nothing Phone 제품 이미지';
    image.width = 1000;
    image.height = 1000;
    image.loading = 'lazy';
    image.decoding = 'async';
    const visualCopy = element('figcaption', 'notice-detail__visual-copy');
    visualCopy.append(
      element('strong', 'notice-detail__visual-title', 'Nothing OS 3.0'),
      element('span', 'notice-detail__visual-tagline', 'Smarter. Faster. More personal.'),
    );
    visual.append(image, visualCopy);
    article.append(visual);
  }

  article.append(element('div', 'notice-detail__body', post.content));
  if (post.attachment?.name) {
    const attachment = element('p', 'notice-detail__attachment', `첨부파일: ${post.attachment.name} (${(post.attachment.size / 1024 / 1024).toFixed(2)}MB)`);
    article.append(attachment);
  }

  const adjacent = element('nav', 'notice-adjacent');
  adjacent.setAttribute('aria-label', '이전글과 다음글');
  const adjacentList = element('ul', 'notice-adjacent__list');
  adjacentList.append(
    renderAdjacentLink(previousPost, '이전글', 'previous'),
    renderAdjacentLink(nextPost, '다음글', 'next'),
  );
  adjacent.append(adjacentList);
  root.append(actions, article, adjacent);
  return root;
};

const makeFormField = (labelText, control, required = false, hint = '') => {
  const field = element('div', 'notice-form__field');
  const label = element('label', 'notice-form__label', labelText);
  label.htmlFor = control.id;
  if (required) {
    const requiredMark = element('span', 'notice-form__required', ' *');
    requiredMark.setAttribute('aria-hidden', 'true');
    label.append(requiredMark);
  }
  field.append(label, control);
  if (hint) field.append(element('p', 'notice-form__hint', hint));
  return field;
};

export const renderFormView = ({ post, mode }) => {
  const isEdit = mode === 'edit';
  const root = element('div', 'notice-view notice-view--form');
  root.append(renderPageHeading());
  const form = element('form', 'notice-form');
  form.dataset.noticeForm = '';
  if (post) form.dataset.postId = post.id;
  form.dataset.currentAttachment = post?.attachment?.name ?? '';

  const category = element('select', 'notice-form__select');
  category.id = 'notice-category';
  category.name = 'category';
  category.required = true;
  category.append(element('option', '', '카테고리 선택'));
  category.options[0].value = '';
  NOTICE_CATEGORIES.forEach((categoryName) => {
    const option = element('option', '', categoryName);
    option.value = categoryName;
    category.append(option);
  });
  category.value = post?.category ?? '';

  const title = element('input', 'notice-form__input');
  title.id = 'notice-title';
  title.name = 'title';
  title.type = 'text';
  title.maxLength = 100;
  title.required = true;
  title.value = post?.title ?? '';
  title.placeholder = '제목을 입력해주세요.';

  const content = element('textarea', 'notice-form__textarea');
  content.id = 'notice-content';
  content.name = 'content';
  content.required = true;
  content.rows = 12;
  content.value = post?.content ?? '';
  content.placeholder = '내용을 입력해주세요.';

  const fields = element('div', 'notice-form__fields');
  fields.append(
    makeFormField('카테고리', category, true),
    makeFormField('제목', title, true),
    makeFormField('내용', content, true),
  );

  const attachmentSection = element('div', 'notice-form__attachment');
  const attachmentTitle = element('p', 'notice-form__label notice-form__attachment-title', '첨부파일 (선택)');
  attachmentSection.append(attachmentTitle);
  if (post?.attachment?.name) {
    attachmentSection.append(element('p', 'notice-form__current-file', `현재 파일: ${post.attachment.name}`));
    const removeLabel = element('label', 'notice-form__remove-label');
    const removeInput = element('input');
    removeInput.type = 'checkbox';
    removeInput.name = 'removeAttachment';
    removeInput.dataset.removeAttachment = '';
    removeLabel.append(removeInput, element('span', '', '기존 첨부파일 삭제'));
    attachmentSection.append(removeLabel);
  }
  const fileInput = element('input', 'notice-form__file-input visually-hidden');
  fileInput.type = 'file';
  fileInput.name = 'attachment';
  fileInput.accept = '*/*';
  fileInput.setAttribute('aria-describedby', 'notice-file-hint notice-file-status');
  fileInput.dataset.noticeFile = '';
  const fileLabel = element('label', 'notice-button notice-button--secondary notice-form__file-button', '파일 업로드');
  fileLabel.htmlFor = 'notice-attachment';
  fileInput.id = 'notice-attachment';
  const fileName = element('span', 'notice-form__file-name', post?.attachment?.name ?? '선택된 파일 없음');
  fileName.id = 'notice-file-status';
  fileName.setAttribute('aria-live', 'polite');
  const fileRow = element('div', 'notice-form__file-row');
  fileRow.append(fileInput, fileLabel, fileName);
  attachmentSection.append(fileRow);
  const fileHint = element('p', 'notice-form__hint', '최대 10MB까지 첨부할 수 있습니다.');
  fileHint.id = 'notice-file-hint';
  attachmentSection.append(fileHint);

  const message = element('p', 'notice-form__message');
  message.dataset.formMessage = '';
  message.setAttribute('role', 'alert');
  message.hidden = true;
  const formActions = element('div', 'notice-form__actions');
  const cancelHref = post ? makeDetailUrl(post.id) : './notice.html?view=list';
  formActions.append(
    link(cancelHref, 'notice-button notice-button--secondary', '취소'),
  );
  const submit = element('button', 'notice-button notice-button--primary', isEdit ? '수정하기' : '등록하기');
  submit.type = 'submit';
  formActions.append(submit);
  form.append(fields, attachmentSection, message, formActions);
  root.append(form);
  return root;
};

export const renderStatusView = (message, isError = false) => {
  const root = element('div', 'notice-view notice-view--status');
  root.append(renderPageHeading());
  const status = element('p', isError ? 'notice-status is-error' : 'notice-status', message);
  if (isError) status.setAttribute('role', 'alert');
  root.append(status);
  return root;
};
