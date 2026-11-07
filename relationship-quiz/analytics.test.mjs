import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAnalytics, createOnce, cleanEvent, sanitizePayload, sanitizeUrl, sanitizeReferrer, UMAMI_WEBSITE_ID } from './analytics.mjs';

const partnerHash = '#v=1&scores=12,12,12,13,12,13,5,11,11,10';
const host = 'www.sweetee-app.com';

function fakeTracker() {
  const calls = [];
  return { calls, track: (...args) => { calls.push(args); return Promise.resolve(); } };
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

test('the shipped website ID is a well-formed Umami ID', () => {
  assert.match(UMAMI_WEBSITE_ID, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});

test('without a website ID, track never loads the provider and only logs', async () => {
  let loads = 0;
  const logs = [];
  const { track } = createAnalytics({ websiteId: '', hostname: host, load: () => { loads += 1; return fakeTracker(); }, log: (...args) => logs.push(args) });
  track('quiz_start', { has_partner: false });
  await flush();
  assert.equal(loads, 0);
  assert.deepEqual(logs, [['[analytics]', 'quiz_start', { has_partner: false }]]);
});

test('with an ID on a host that is not allowed, nothing loads', async () => {
  let loads = 0;
  const { track } = createAnalytics({ websiteId: 'id', hostname: 'localhost', load: () => { loads += 1; return fakeTracker(); } });
  track('quiz_start', { has_partner: true });
  await flush();
  assert.equal(loads, 0);
});

test('events queued before the provider loads are sent once it is ready', async () => {
  const tracker = fakeTracker();
  let ready;
  const { track } = createAnalytics({ websiteId: 'id', hostname: host, load: () => new Promise(resolve => { ready = () => resolve(tracker); }) });
  track('quiz_start', { has_partner: true });
  track('partner_link_opened');
  assert.equal(tracker.calls.length, 0);
  ready();
  await flush();
  track('restart_confirmed');
  assert.deepEqual(tracker.calls, [['quiz_start', { has_partner: true }], ['partner_link_opened'], ['restart_confirmed']]);
});

test('a blocked provider script never throws and drops events', async () => {
  const { track } = createAnalytics({ websiteId: 'id', hostname: host, load: () => Promise.reject(new Error('blocked')) });
  track('quiz_start', { has_partner: false });
  await flush();
  assert.doesNotThrow(() => track('quiz_complete', { has_partner: false }));
});

test('a throwing or rejecting tracker never reaches the caller', async () => {
  const { track } = createAnalytics({ websiteId: 'id', hostname: host, load: () => ({ track: () => { throw new Error('boom'); } }) });
  await flush();
  assert.doesNotThrow(() => track('quiz_start', { has_partner: false }));
  const rejecting = createAnalytics({ websiteId: 'id', hostname: host, load: () => ({ track: () => Promise.reject(new Error('offline')) }) });
  await flush();
  rejecting.track('quiz_start', { has_partner: false });
  await flush();
  assert.doesNotThrow(() => createAnalytics({ websiteId: 'id', hostname: host, load: () => { throw new Error('sync'); } }).track('quiz_start', { has_partner: false }));
});

test('only listed events with valid coarse props are sent', () => {
  assert.equal(cleanEvent('quiz_answer', { question: 3 }), null);
  assert.equal(cleanEvent('quiz_progress', { step: 12 }), null);
  assert.equal(cleanEvent('quiz_start', {}), null);
  assert.equal(cleanEvent('result_link_copied', { method: 'email' }), null);
  assert.deepEqual(cleanEvent('quiz_complete', { has_partner: true, scores: [12, 12], answers: [1, 2] }), { name: 'quiz_complete', data: { has_partner: true } });
  assert.deepEqual(cleanEvent('sweetee_cta_clicked', { placement: 'intro', href: 'https://example.com/' + partnerHash }), { name: 'sweetee_cta_clicked', data: { placement: 'intro' } });
  assert.deepEqual(cleanEvent('partner_guide_viewed', { scores: '12,12' }), { name: 'partner_guide_viewed' });
});

test('sent payloads never contain the hash or score digits', async () => {
  const tracker = fakeTracker();
  const { track } = createAnalytics({ websiteId: 'id', hostname: host, load: () => tracker });
  await flush();
  const scores = [12, 12, 12, 13, 12, 13, 5, 11, 11, 10];
  const extra = { scores, answers: [5, 4, 3], hash: partnerHash, url: 'https://www.sweetee-app.com/relationship-quiz/' + partnerHash };
  track('quiz_start', { has_partner: true, ...extra });
  track('quiz_progress', { step: 10, ...extra });
  track('quiz_progress', { step: 20, ...extra });
  track('quiz_complete', { has_partner: true, ...extra });
  track('partner_link_opened', extra);
  track('partner_guide_viewed', extra);
  track('result_link_copied', { method: 'clipboard', ...extra });
  track('result_text_copied', { method: 'manual', ...extra });
  track('restart_confirmed', extra);
  track('sweetee_cta_clicked', { placement: 'results', ...extra });
  assert.equal(tracker.calls.length, 10);
  for (const call of tracker.calls) {
    const json = JSON.stringify(call);
    assert.doesNotMatch(json, /#|scores|answers|hash|url/);
    // The only digits allowed anywhere are the progress steps.
    assert.doesNotMatch(json.replace(/"step":(10|20)/, ''), /\d/);
  }
});

test('the provider payload hook strips the hash from automatic pageviews', () => {
  const pageview = {
    website: 'id',
    hostname: host,
    screen: '390x844',
    language: 'en-US',
    title: 'Sweetee Connection Quiz',
    url: '/relationship-quiz/?utm_source=tiktok&ref=me' + partnerHash,
    referrer: 'https://www.sweetee-app.com/relationship-quiz/?x=1' + partnerHash,
  };
  const out = sanitizePayload(pageview);
  assert.equal(out.url, '/relationship-quiz/?utm_source=tiktok');
  assert.equal(out.referrer, 'https://www.sweetee-app.com/relationship-quiz/');
  assert.doesNotMatch(JSON.stringify(out), /scores|#/);
  assert.equal(sanitizeUrl('https://www.sweetee-app.com/relationship-quiz/' + partnerHash), 'https://www.sweetee-app.com/relationship-quiz/');
  assert.equal(sanitizeReferrer(''), '');
});

test('the provider payload hook cancels unknown or score-bearing events', () => {
  const base = { website: 'id', url: '/relationship-quiz/' };
  assert.equal(sanitizePayload({ ...base, name: 'auto-click', data: {} }), null);
  assert.deepEqual(sanitizePayload({ ...base, name: 'quiz_complete', data: { has_partner: false, scores: [1] } }), { ...base, name: 'quiz_complete', data: { has_partner: false } });
  assert.equal(sanitizePayload({ ...base, title: 'scores=12,12' }), null);
  assert.equal(sanitizePayload(null), null);
});

test('createOnce fires each key once and can be seeded and cleared', () => {
  const page = createOnce();
  assert.equal(page.first('partner_link_opened'), true);
  assert.equal(page.first('partner_link_opened'), false);

  // An attempt saved after question 10 does not fire step 10 again after a reload.
  const restored = createOnce(['progress_10']);
  assert.equal(restored.first('progress_10'), false);
  assert.equal(restored.first('progress_20'), true);
  assert.equal(restored.first('complete'), true);
  assert.equal(restored.first('complete'), false);
  assert.deepEqual(restored.keys(), ['progress_10', 'progress_20', 'complete']);

  // A confirmed restart begins a new attempt.
  restored.clear();
  assert.equal(restored.first('progress_10'), true);
});
