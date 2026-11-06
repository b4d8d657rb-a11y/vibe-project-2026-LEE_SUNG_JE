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
  document.body.prepend(ticker);
  main.before(cloneTemplate(templateDocument, layout.header));
  main.after(cloneTemplate(templateDocument, layout.footer));
};

export const siteShellReady = renderSiteShell();
