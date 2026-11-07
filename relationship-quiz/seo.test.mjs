import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preferences } from './quiz.mjs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const decode = text => text.replace(/&amp;/g, '&');
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

test('page is indexable with a canonical URL', () => {
  assert.ok(!/name="robots"/.test(html), 'no robots meta');
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.sweetee-app\.com\/relationship-quiz\/">/);
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  assert.ok(title.length <= 60, `title is ${title.length} chars`);
  const description = html.match(/<meta name="description" content="(.*?)">/)[1];
  assert.ok(description.length <= 160, `description is ${description.length} chars`);
});

test('static preference list matches the quiz', () => {
  const listed = [...html.matchAll(/<dt>(.*?)<\/dt>/g)].map(m => decode(m[1]));
  assert.deepEqual(listed, preferences.map(p => p.name));
});

test('FAQ structured data matches the visible FAQ', () => {
  const faq = ld['@graph'].find(node => node['@type'] === 'FAQPage');
  const visible = html.split('Frequently asked questions')[1];
  for (const item of faq.mainEntity) {
    const question = item.name.replace(/'/g, '’');
    const answer = item.acceptedAnswer.text.replace(/'/g, '’');
    assert.ok(visible.includes(`<h3>${question}</h3>`), question);
    assert.ok(visible.includes(`<p>${answer}</p>`), answer);
  }
});
