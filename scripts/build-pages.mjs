import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://www.sweetee-app.com';
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
export const localePath = tag => tag === 'en' ? '/' : `/${tag}/`;

export function validateCopy(copy, source, tag) {
  const expected = Object.keys(source).sort();
  if (JSON.stringify(Object.keys(copy).sort()) !== JSON.stringify(expected)) {
    throw new Error(`${tag}: translation keys do not match English`);
  }
  for (const key of expected) {
    if (typeof copy[key] !== 'string' || !copy[key].trim()) {
      throw new Error(`${tag}: missing text for ${key}`);
    }
  }
}

export function renderPage(template, copy, language, languages) {
  const { tag } = language;
  const assetBase = tag === 'en' ? './' : '../';
  const seoLinks = [
    `<link rel="canonical" href="${origin}${localePath(tag)}" />`,
    ...languages.map(item => `<link rel="alternate" hreflang="${item.tag}" href="${origin}${localePath(item.tag)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${origin}/" />`,
  ].join('\n  ');
  const languageLinks = languages.map(item => {
    const href = item.tag === 'en' ? assetBase : `${assetBase}${item.tag}/`;
    return `<li><a href="${href}" lang="${item.tag}" hreflang="${item.tag}"${item.tag === tag ? ' aria-current="page"' : ''}>${escapeHtml(item.name)}</a></li>`;
  }).join('\n            ');
  const languageSwitcher = `<details class="language-picker">
        <summary aria-label="${escapeHtml(copy['nav.language'])}: ${escapeHtml(language.name)}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg>
          <span lang="${tag}">${escapeHtml(language.name)}</span>
        </summary>
        <ul aria-label="${escapeHtml(copy['nav.language'])}">
            ${languageLinks}
        </ul>
      </details>`;
  const values = {
    ...Object.fromEntries(Object.entries(copy).map(([key, value]) => [key, escapeHtml(value)])),
    locale: tag,
    assetBase,
    heroImage: `${assetBase}${tag === 'en' ? 'sweetee-home-current.png' : `assets/hero/${tag}.png`}`,
    featureBase: `${assetBase}assets/features/${tag === 'en' ? '' : `${tag}/`}`,
    seoLinks,
    languageSwitcher,
    legalNote: tag === 'en' ? '' : `<p class="footer__text footer__language-note">${escapeHtml(copy['footer.legalLanguage'])}</p>`,
  };
  if (tag === 'zh-Hant') {
    const phrases = ['玩一局「甜蜜默契」，', '或一起畫出', '天馬行空的點子。'];
    if (phrases.join('') === copy['play.body']) {
      values['play.body'] = phrases.map(phrase => `<span class="caption-phrase">${escapeHtml(phrase)}</span>`).join('<wbr>');
    }
  }
  return template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unknown template key: ${key}`);
    return values[key];
  }).replace(/[\t ]+$/gm, '');
}

export async function loadSite() {
  const json = async filename => JSON.parse(await readFile(path.join(root, filename), 'utf8'));
  const languages = await json('locales/languages.json');
  const source = await json('locales/en.json');
  const template = await readFile(path.join(root, 'templates/landing.html'), 'utf8');
  const pages = [];
  for (const language of languages) {
    const copy = await json(`locales/${language.tag}.json`);
    validateCopy(copy, source, language.tag);
    const filename = language.tag === 'en' ? 'index.html' : `${language.tag}/index.html`;
    pages.push({ language, copy, filename, html: renderPage(template, copy, language, languages) });
  }
  return { languages, source, template, pages };
}

async function build() {
  const { pages } = await loadSite();
  const check = process.argv.includes('--check');
  for (const { filename, html } of pages) {
    const target = path.join(root, filename);
    if (check) {
      const saved = await readFile(target, 'utf8').catch(() => '');
      if (saved !== html) throw new Error(`${filename} is stale. Run npm run build:locales.`);
    } else {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, html);
    }
  }
  console.log(`${check ? 'Verified' : 'Generated'} ${pages.length} static language pages.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  build().catch(error => { console.error(error.message); process.exitCode = 1; });
}
