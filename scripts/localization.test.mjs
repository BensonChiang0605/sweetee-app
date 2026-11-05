import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
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
    assert.ok(html.includes('method="post"'));
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
  delete incomplete['form.error'];
  assert.throws(() => validateCopy(incomplete, site.source, 'test'), /keys/);
  assert.throws(() => validateCopy({ ...site.source, 'hero.body': ' ' }, site.source, 'test'), /missing text/);
});

test('translated prose is escaped in both text and attributes', () => {
  const copy = { ...site.source, 'hero.body': '<script>alert(1)</script>', 'form.error': '" onfocus="alert(1)' };
  const html = renderPage(site.template, copy, site.languages[0], site.languages);
  assert.ok(!html.includes('<script>alert(1)'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(html.includes('data-error="&quot; onfocus=&quot;alert(1)"'));
});

function formEnvironment(copy, fetch) {
  const element = () => ({
    hidden: false, disabled: false, textContent: '', dataset: {}, events: {},
    attributes: {}, classes: new Set(),
    addEventListener(name, handler) { this.events[name] = handler; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    classList: { add() {} },
  });
  const form = element();
  form.dataset = { pending: copy['form.pending'], error: copy['form.error'], invalid: copy['form.invalid'] };
  form.action = 'https://app.loops.so/api/newsletter-form/cmlxvlrt302oh0iwl16vbao0e';
  const input = element();
  input.value = ' person@example.com ';
  input.valid = true;
  input.setCustomValidity = message => { input.validationMessage = message; };
  input.checkValidity = () => input.valid;
  input.reportValidity = () => { input.reported = true; };
  const button = element(); button.textContent = copy['form.submit'];
  form.querySelector = () => button;
  const success = element(); success.classList.add = value => success.classes.add(value);
  const error = element(); error.hidden = true;
  const picker = element(); picker.contains = () => false;
  const elements = { waitlistForm: form, emailInput: input, successMessage: success, formError: error };
  const document = { querySelectorAll: () => [], querySelector: () => picker, getElementById: id => elements[id], addEventListener() {} };
  return { context: { document, window: {}, fetch, URLSearchParams }, form, input, button, success, error };
}

const script = await readFile(path.join(root, 'landing.js'), 'utf8');
for (const { language, copy } of site.pages) {
  test(`${language.tag}: localized form validation, failure, pending and success without a live signup`, async () => {
    const requests = [];
    let finish;
    const environment = formEnvironment(copy, (url, options) => {
      requests.push({ url, options });
      return new Promise(resolve => { finish = resolve; });
    });
    vm.runInNewContext(script, environment.context);
    const { form, input, button, success, error } = environment;
    const submit = () => form.events.submit({ preventDefault() {} });
    input.valid = false;
    await submit();
    assert.equal(requests.length, 0);
    assert.equal(input.validationMessage, copy['form.invalid']);
    assert.equal(input.reported, true);
    input.valid = true;
    const first = submit();
    await submit();
    assert.equal(requests.length, 1, 'duplicate submissions are blocked');
    assert.equal(button.textContent, copy['form.pending']);
    assert.equal(button.disabled, true);
    assert.equal(requests[0].options.body, 'email=person%40example.com');
    finish({ ok: false }); await first;
    assert.equal(error.textContent, copy['form.error']);
    assert.equal(error.hidden, false);
    assert.equal(form.hidden, false);
    assert.equal(button.textContent, copy['form.submit']);
    const retry = submit();
    finish({ ok: true }); await retry;
    assert.equal(form.hidden, true);
    assert.equal(success.classes.has('show'), true);
    assert.equal(error.hidden, true);
  });
}
