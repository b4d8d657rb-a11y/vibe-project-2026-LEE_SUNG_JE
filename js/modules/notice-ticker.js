import { postService } from '../services/post-service.js';

const element = (tagName, className = '', text = '') => {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const getDetailUrl = (postId) => {
  const isSupportPage = window.location.pathname.endsWith('/pages/support/notice.html');
  const path = isSupportPage ? './notice.html' : 'pages/support/notice.html';
  return `${path}?view=detail&id=${encodeURIComponent(postId)}`;
};

export const initializeNoticeTicker = async () => {
  if (document.querySelector('.notice-ticker')) return;

  const ticker = element('aside', 'notice-ticker is-loading');
  ticker.setAttribute('aria-label', '주요 공지사항');
  ticker.setAttribute('aria-busy', 'true');

  const inner = element('div', 'inner-box notice-ticker__inner');
  const label = element('span', 'notice-ticker__label', 'NOTICE');
  const message = element('div', 'notice-ticker__message');
  const category = element('span', 'notice-ticker__category');
  const title = element('a', 'notice-ticker__title');
  const counter = element('span', 'notice-ticker__counter');
  const controls = element('div', 'notice-ticker__controls');
  const pauseButton = element('button', 'notice-ticker__control', 'Ⅱ');
  pauseButton.type = 'button';
  pauseButton.setAttribute('aria-label', '공지 순환 일시정지');
  pauseButton.title = '일시정지';
  const playButton = element('button', 'notice-ticker__control', '▶');
  playButton.type = 'button';
  playButton.setAttribute('aria-label', '공지 순환 재생');
  playButton.title = '재생';
  playButton.hidden = true;
  const closeButton = element('button', 'notice-ticker__control notice-ticker__control--close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', '공지 박스 닫기');
  closeButton.title = '닫기';

  message.append(category, title);
  controls.append(pauseButton, playButton, closeButton);
  inner.append(label, message, counter, controls);
  ticker.append(inner);
  document.body.prepend(ticker);
  document.body.classList.add('has-notice-ticker');

  let timerId = 0;
  let posts = [];
  let currentIndex = 0;
  let isPlaying = false;

  const stopRotation = () => {
    window.clearInterval(timerId);
    timerId = 0;
  };

  const renderPost = () => {
    const post = posts[currentIndex];
    if (!post) return;
    category.textContent = post.category;
    title.textContent = post.title;
    title.href = getDetailUrl(post.id);
    title.title = post.title;
    counter.textContent = `${currentIndex + 1} / ${posts.length}`;
  };

  const setPlaying = (shouldPlay) => {
    isPlaying = shouldPlay && posts.length > 1;
    stopRotation();
    pauseButton.hidden = !isPlaying;
    playButton.hidden = isPlaying;
    ticker.setAttribute('aria-live', isPlaying ? 'off' : 'polite');
    if (isPlaying) {
      timerId = window.setInterval(() => {
        currentIndex = (currentIndex + 1) % posts.length;
        renderPost();
      }, 5000);
    }
  };

  pauseButton.addEventListener('click', () => {
    setPlaying(false);
    playButton.focus();
  });
  playButton.addEventListener('click', () => {
    setPlaying(true);
    pauseButton.focus();
  });
  closeButton.addEventListener('click', () => {
    stopRotation();
    ticker.remove();
    document.body.classList.remove('has-notice-ticker');
  });

  try {
    const allPosts = await postService.getAll();
    posts = [...allPosts]
      .sort((first, second) => {
        if (first.isPinned !== second.isPinned) return first.isPinned ? -1 : 1;
        return new Date(second.createdAt) - new Date(first.createdAt);
      })
      .slice(0, 3);

    if (!posts.length) {
      ticker.remove();
      document.body.classList.remove('has-notice-ticker');
      return;
    }

    renderPost();
    ticker.classList.remove('is-loading');
    ticker.setAttribute('aria-busy', 'false');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPlaying(!prefersReducedMotion);
  } catch (error) {
    console.error('상단 공지사항을 불러오지 못했습니다.', error);
    ticker.remove();
    document.body.classList.remove('has-notice-ticker');
  }
};
