import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGuide } from './guide.mjs';
import { content, combos, shared } from './guide-content.mjs';
import { preferences } from './quiz.mjs';

// Order: inclusion, known, understanding, chosen, support, reassurance, ease, play, discovery, touch
const girlfriend = [12, 12, 12, 13, 12, 13, 5, 11, 11, 10];
const benson = [9, 10, 9, 9, 8, 9, 10, 11, 14, 14];

const allText = guide => JSON.stringify(guide);

test('girlfriend profile leads with Feeling chosen and Reassurance', () => {
  const g = buildGuide(girlfriend, benson);
  assert.equal(g.kind, 'focused');
  assert.deepEqual(g.matters.map(m => m.name), ['Feeling chosen', 'Reassurance']);
  assert.deepEqual(g.alsoMatters.map(m => m.name), ['Inclusion', 'Feeling known', 'Understanding', 'Practical support']);
  assert.equal(g.experiment, combos['chosen+reassurance']);
  assert.match(g.opening, /broad rather than sharply defined/);
  assert.match(g.overlook.join(' '), /Discovery and Touch/);
});

test('benson profile leads with Discovery and Touch', () => {
  const g = buildGuide(benson, girlfriend);
  assert.deepEqual(g.matters.map(m => m.name), ['Discovery', 'Touch']);
  assert.equal(g.experiment, combos['discovery+touch']);
  // Her top two are not in his top group, so she gets the bias note.
  assert.match(g.overlook.join(' '), /Feeling chosen and Reassurance/);
});

test('blind spot is the lead preference the reader scores lowest on', () => {
  const reader = [9, 9, 9, 15, 9, 3, 9, 9, 9, 9];
  const g = buildGuide(girlfriend, reader);
  assert.equal(g.overlook[0], content.reassurance.notice);
});

test('single lead borrows a combo with a close-behind preference', () => {
  const scores = [9, 14, 9, 15, 9, 9, 9, 9, 9, 9];
  const g = buildGuide(scores, benson);
  assert.equal(g.experiment, combos['chosen+known']);
});

test('falls back to the lead preference experiment', () => {
  const scores = [9, 9, 9, 9, 9, 9, 15, 9, 9, 9];
  assert.equal(buildGuide(scores, benson).experiment, content.ease.experiment);
});

test('girlfriend and benson share no top preference', () => {
  assert.equal(buildGuide(girlfriend, benson).shared.length, 0);
  assert.equal(buildGuide(benson, girlfriend).shared.length, 0);
});

test('shared top preference replaces its overlook note', () => {
  const partner = [9, 9, 9, 15, 9, 9, 9, 9, 9, 9]; // Feeling chosen
  const reader = [9, 9, 9, 14, 9, 9, 9, 9, 9, 9];
  const g = buildGuide(partner, reader);
  assert.deepEqual(g.shared, [{ name: 'Feeling chosen', text: shared.chosen.text }]);
  assert.ok(!g.overlook.includes(content.chosen.notice));
});

test('partly shared lead keeps the overlook note for the unshared one', () => {
  const g = buildGuide(girlfriend, [9, 9, 9, 14, 9, 6, 9, 9, 9, 9]);
  assert.deepEqual(g.shared.map(s => s.name), ['Feeling chosen']);
  assert.deepEqual(g.overlook.slice(0, 1), [content.reassurance.notice]);
});

test('shared notes are similar in length to the overlook section', () => {
  for (const [id, note] of Object.entries(shared)) {
    const words = note.text.split(/\s+/).length;
    assert.ok(words >= 55 && words <= 90, `${id}: ${words} words`);
    assert.ok(['given', 'together'].includes(note.kind), id);
  }
});

test('even profile names no winner', () => {
  const g = buildGuide(Array(10).fill(12), benson);
  assert.equal(g.kind, 'even');
  assert.equal(g.matters.length, 0);
  assert.equal(g.alsoMatters.length, 10);
});

test('broad profile treats a four-way tie equally', () => {
  const g = buildGuide([14, 14, 14, 14, 9, 9, 9, 9, 9, 9], benson);
  assert.equal(g.kind, 'broad');
  assert.deepEqual(g.alsoMatters.map(m => m.name), ['Inclusion', 'Feeling known', 'Understanding', 'Feeling chosen']);
});

test('low profile is hedged', () => {
  const g = buildGuide([3, 3, 6, 3, 3, 4, 3, 3, 3, 3], benson);
  assert.equal(g.kind, 'low');
  assert.match(g.opening, /may not capture/);
});

test('no tag repeats and no section is empty text, across many profiles', () => {
  let seed = 7;
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let n = 0; n < 2000; n++) {
    const a = preferences.map(() => 3 + Math.floor(rand() * 13));
    const b = preferences.map(() => 3 + Math.floor(rand() * 13));
    const g = buildGuide(a, b);
    const texts = [...g.habits, ...g.alsoMatters, ...g.more].map(x => x.text);
    assert.ok(texts.every(Boolean));
    assert.equal(new Set(texts).size, texts.length);
    assert.ok(g.experiment?.text && g.experiment?.apart);
    assert.ok(!/undefined|NaN|\d/.test(allText(g)), 'guide text must not cite scores');
    assert.deepEqual(buildGuide(a, b), g);
  }
});

test('every preference has complete content', () => {
  for (const p of preferences) {
    const c = content[p.id];
    assert.ok(c.matters && c.habit.tag && c.short.tag && c.notice && c.experiment.apart && c.more.length === 2, p.id);
  }
  for (const key of Object.keys(combos)) {
    for (const id of key.split('+')) assert.ok(content[id], key);
  }
});
