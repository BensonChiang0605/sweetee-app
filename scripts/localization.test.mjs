import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { root, loadSite, renderPage, validateCopy } from './build-pages.mjs';

const site = await loadSite();
const decode = value => value.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

test('every locale has complete static content, language links and matching artwork', async () => {
  assert.equal(new Set(site.languages.map(item => item.tag)).size, 8);
  for (const { language, copy, filename, html } of site.pages) {
    assert.match(html, new RegExp(`<html lang="${language.tag}">`));
    assert.equal((html.match(/class="feature__image"/g) ?? []).length, 6);
    assert.equal((html.match(/rel="alternate"/g) ?? []).length, 9);
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
    assert.ok(!html.includes('{{'));
    assert.ok(!html.includes('<form'));
    assert.equal((html.match(/href="https:\/\/apps\.apple\.com\/app\/id6761756253"/g) ?? []).length, 2);
    assert.ok(html.includes(`assets/app-store-badge/${language.tag}.svg" alt="${copy['hero.download'].replace(/'/g, '&#39;')}"`));
    assert.ok(html.includes('hreflang="en">'));
    validateCopy(copy, site.source, language.tag);
    for (const [, encoded] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const value = decode(encoded);
      if (/^https?:/.test(value) || value.startsWith('#')) continue;
      const relative = value.split('?')[0];
      const target = path.resolve(root, path.dirname(filename), relative);
      await access(relative.endsWith('/') ? path.join(target, 'index.html') : target);
    }
    if (language.tag !== 'en') {
      assert.ok(html.includes(`assets/features/${language.tag}/quiz-results.webp`));
      assert.ok(html.includes(`assets/hero/${language.tag}.png`));
      assert.ok(!html.includes('sweetee-home-current.png'));
      assert.ok(html.includes('class="footer__text footer__language-note"'));
    }
  }
});

test('missing translations fail instead of silently mixing English into a page', () => {
  const incomplete = { ...site.source };
  delete incomplete['hero.download'];
  assert.throws(() => validateCopy(incomplete, site.source, 'test'), /keys/);
  assert.throws(() => validateCopy({ ...site.source, 'hero.body': ' ' }, site.source, 'test'), /missing text/);
});

test('translated prose is escaped in both text and attributes', () => {
  const copy = { ...site.source, 'hero.body': '<script>alert(1)</script>', 'hero.iconAlt': '" onfocus="alert(1)' };
  const html = renderPage(site.template, copy, site.languages[0], site.languages);
  assert.ok(!html.includes('<script>alert(1)'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(html.includes('alt="&quot; onfocus=&quot;alert(1)"'));
});
