const SITE_LAYOUTS = {
  home: {
    header: 'home-header-template',
    footer: 'home-footer-template',
    noticeUrl: 'pages/support/notice.html',
  },
  support: {
    header: 'support-header-template',
    footer: 'support-footer-template',
    noticeUrl: './notice.html',
    currentNav: 'support',
    mainId: 'notice-main',
  },
  qna: {
    header: 'support-header-template',
    footer: 'support-footer-template',
    noticeUrl: './notice.html',
    currentNav: 'qna',
    mainId: 'qna-main',
  },
};

const cloneTemplate = (templateDocument, templateId) => {
  const template = templateDocument.querySelector(`#${templateId}`);
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`공통 레이아웃 템플릿을 찾을 수 없습니다: ${templateId}`);
  }
  return document.importNode(template.content, true);
};

const renderSiteShell = async () => {
  const layoutName = document.body.dataset.siteShell;
  const layout = SITE_LAYOUTS[layoutName];
  if (!layout) return;

  const response = await fetch(new URL('../../partials/site-shell.html', import.meta.url));
  if (!response.ok) {
    throw new Error(`공통 레이아웃을 불러오지 못했습니다: ${response.status}`);
  }

  const templateDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
  const main = document.querySelector('main');
  if (!(main instanceof HTMLElement)) {
    throw new Error('공통 레이아웃을 삽입할 본문을 찾을 수 없습니다.');
  }

  const ticker = cloneTemplate(templateDocument, 'announcement-ticker-template');
  ticker.firstElementChild.dataset.noticeUrl = layout.noticeUrl;
  const header = cloneTemplate(templateDocument, layout.header);
  const skipLink = header.querySelector('[data-shell-skip]');
  if (skipLink instanceof HTMLAnchorElement && layout.mainId) {
    skipLink.href = `#${layout.mainId}`;
  }
  if (layout.currentNav) {
    const activeLink = header.querySelector(`[data-shell-nav="${layout.currentNav}"]`);
    if (activeLink instanceof HTMLAnchorElement) {
      activeLink.classList.add('support-header__link--current');
      activeLink.setAttribute('aria-current', 'page');
    }
  }
  document.body.prepend(ticker);
  main.before(header);
  main.after(cloneTemplate(templateDocument, layout.footer));
};

export const siteShellReady = renderSiteShell();
