import { postService } from '../services/post-service.js';
import { siteShellReady } from './site-shell.js';

await siteShellReady;

const ticker = document.querySelector('[data-announcement-ticker]');
if (ticker instanceof HTMLElement) {
  const link = ticker.querySelector('[data-announcement-link]');
  const title = ticker.querySelector('[data-announcement-title]');
  const count = ticker.querySelector('[data-announcement-count]');
  const pauseButton = ticker.querySelector('[data-announcement-pause]');
  const playButton = ticker.querySelector('[data-announcement-play]');
  const closeButton = ticker.querySelector('[data-announcement-close]');

  if (
    link instanceof HTMLAnchorElement &&
    title instanceof HTMLElement &&
    count instanceof HTMLElement &&
    pauseButton instanceof HTMLButtonElement &&
    playButton instanceof HTMLButtonElement &&
    closeButton instanceof HTMLButtonElement
  ) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let posts = [];
    let currentIndex = 0;
    let intervalId = 0;
    let isPlaying = !reducedMotion.matches;

    const renderPost = () => {
      const post = posts[currentIndex];
      if (!post) return;
      title.textContent = post.title;
      count.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(posts.length).padStart(2, '0')}`;
      const noticeUrl = new URL(ticker.dataset.noticeUrl || 'pages/support/notice.html', window.location.href);
      noticeUrl.search = new URLSearchParams({ view: 'detail', id: post.id }).toString();
      link.href = noticeUrl.href;
    };

    const advancePost = () => {
      currentIndex = (currentIndex + 1) % posts.length;
      renderPost();
    };

    const setPlaying = (shouldPlay) => {
      isPlaying = shouldPlay && posts.length > 1;
      window.clearInterval(intervalId);
      intervalId = 0;
      pauseButton.disabled = !isPlaying;
      playButton.disabled = isPlaying || posts.length < 2;

      if (isPlaying) {
        intervalId = window.setInterval(advancePost, 5000);
      }
    };

    const closeTicker = () => {
      setPlaying(false);
      ticker.hidden = true;
      document.documentElement.classList.remove('has-announcement-ticker');
    };

    pauseButton.addEventListener('click', () => setPlaying(false));
    playButton.addEventListener('click', () => setPlaying(true));
    closeButton.addEventListener('click', closeTicker);
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) setPlaying(false);
    });

    postService.getAll()
      .then((allPosts) => {
        posts = [...allPosts]
          .sort((first, second) => {
            if (first.isPinned !== second.isPinned) return first.isPinned ? -1 : 1;
            return new Date(second.createdAt) - new Date(first.createdAt);
          })
          .slice(0, 3);

        if (posts.length === 0) return;
        renderPost();
        ticker.hidden = false;
        document.documentElement.classList.add('has-announcement-ticker');
        setPlaying(isPlaying);
      })
      .catch((error) => {
        console.error('주요 공지사항을 불러오지 못했습니다.', error);
      });
  }
}