import { labels, preferences, questions, validAnswers, calculateScores, topPreferences, decodeSharedScores, resultAnalysis } from './quiz.mjs';
import { buildGuide } from './guide.mjs';
import { track, createOnce } from './analytics.mjs';

const $ = id => document.getElementById(id);
const storageKey = 'sweetee-connection-quiz-v1';
let answers = Array(questions.length).fill(null);
let index = 0;
let completed = false;
let storageAvailable = true;
let partnerScores = decodeSharedScores(location.hash);
$('partner-notice').hidden = !partnerScores;
// pageOnce resets on every page load; attemptOnce is saved with the answers so
// progress and completion count once per attempt, across reloads.
const pageOnce = createOnce();
let attemptOnce = createOnce();
const trackPartnerLink = () => {
  if (partnerScores && pageOnce.first('partner_link_opened')) track('partner_link_opened');
};
trackPartnerLink();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && validAnswers(saved.answers)) {
    answers = saved.answers;
    index = Number.isInteger(saved.index) ? Math.max(0, Math.min(questions.length - 1, saved.index)) : 0;
    completed = saved.completed === true && !answers.includes(null);
    if (Array.isArray(saved.tracked)) attemptOnce = createOnce(saved.tracked.filter(key => typeof key === 'string'));
  }
} catch {
  storageAvailable = false;
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ answers, index, completed, tracked: attemptOnce.keys() }));
  } catch {
    storageAvailable = false;
  }
  if (!storageAvailable) $('status').textContent = 'Browser storage is unavailable. Keep this tab open to retain your progress.';
}

function show(section) {
  for (const id of ['intro', 'quiz', 'results']) $(id).hidden = id !== section;
  $('restart-confirm').hidden = true;
  $('partner-notice').hidden = !partnerScores;
  $('partner-notice').textContent = section === 'results'
    ? 'Your partner’s shared scores are shown alongside yours below.'
    : 'Your partner shared their scores. Finish the quiz to see your results together.';
  $('copy-fallback').hidden = true;
  $('status').textContent = storageAvailable ? '' : 'Progress cannot be saved in this browser. Keep this tab open.';
}

function renderQuestion() {
  show('quiz');
  $('position').textContent = `Question ${index + 1} of ${questions.length} · ${answers.filter(value => value !== null).length} answered`;
  $('progress').value = answers.filter(value => value !== null).length;
  $('question').textContent = questions[index].text;
  $('choices').replaceChildren();
  labels.forEach((label, choice) => {
    const wrapper = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = String(choice + 1);
    input.checked = answers[index] === choice + 1;
    input.required = true;
    input.addEventListener('change', () => {
      answers[index] = choice + 1;
      completed = false;
      persist();
      $('next').disabled = false;
      $('progress').value = answers.filter(value => value !== null).length;
      $('position').textContent = `Question ${index + 1} of ${questions.length} · ${answers.filter(value => value !== null).length} answered`;
    });
    wrapper.append(input, document.createTextNode(label));
    $('choices').append(wrapper);
  });
  $('back').disabled = index === 0;
  $('next').disabled = answers[index] === null;
  $('next').textContent = index === questions.length - 1 ? 'See my results' : 'Next';
  $('question').focus();
}

function renderResults() {
  const scores = calculateScores(answers);
  const resultUrl = new URL(location.href);
  resultUrl.hash = 'v=1&scores=' + scores.join(',');
  $('result-link').value = resultUrl.href;
  const top = topPreferences(scores);
  show('results');
  if (top.length === preferences.length) {
    $('summary').textContent = 'All ten preferences received the same score. Your answers do not identify one leading preference.';
  } else if (Math.max(...scores) <= 6) {
    $('summary').textContent = 'You rated all preferences toward the lower end. This set of statements may not capture what matters most to you. Your relatively highest scores are ' + top.map(item => item.name).join(', ') + '.';
  } else {
    $('summary').textContent = (top.length === 1 ? 'Your highest-scoring preference is ' : 'Your highest-scoring preferences are tied: ') + top.map(item => item.name).join(', ') + '.';
  }
  $('highlights').replaceChildren();
  const ordered = preferences.map((preference, i) => ({ preference, score: scores[i] }))
    .sort((a, b) => b.score - a.score);
  const profile = document.createElement('p');
  profile.textContent = `Your preference averages range from ${(Math.min(...scores) / 3).toFixed(1)} to ${(Math.max(...scores) / 3).toFixed(1)} out of 5. Open any preference below to explore its meaning and the answers behind it. Use the descriptions to notice what fits your experience.`;
  $('highlights').append(profile);
  for (const { preference, score } of ordered) {
    const [phrase, meaning, discussion] = resultAnalysis[preference.id];
    const card = document.createElement('details');
    card.className = 'highlight';
    card.open = top.length <= 2 && top.includes(preference) && score >= 9;
    const title = document.createElement('summary');
    title.textContent = `${preference.name} · ${(score / 3).toFixed(1)} / 5`;
    card.append(title);
    for (const [heading, text] of [
      [phrase, meaning],
      ['Something to talk about', discussion],
      ['A small thing to try', preference.idea],
    ]) {
      const h = document.createElement('h4');
      h.textContent = heading;
      const p = document.createElement('p');
      p.textContent = text;
      card.append(h, p);
    }
    const evidenceTitle = document.createElement('h4');
    evidenceTitle.textContent = 'Your answers behind this score';
    const evidence = document.createElement('ul');
    questions.forEach((question, questionIndex) => {
      if (question.preference !== preference.id) return;
      const item = document.createElement('li');
      item.textContent = `${question.text} — ${labels[answers[questionIndex] - 1]}`;
      evidence.append(item);
    });
    card.append(evidenceTitle, evidence);
    $('highlights').append(card);
  }
  $('partner-column').hidden = !partnerScores;
  $('scores').replaceChildren();
  const sorted = preferences.map((preference, i) => ({ preference, i })).sort((a, b) => scores[b.i] - scores[a.i]);
  for (const { preference, i } of sorted) {
    const row = document.createElement('tr');
    const name = document.createElement('th');
    name.scope = 'row';
    name.textContent = preference.name;
    const own = document.createElement('td');
    own.textContent = (scores[i] / 3).toFixed(1) + ' / 5';
    row.append(name, own);
    if (partnerScores) {
      const partner = document.createElement('td');
      partner.textContent = (partnerScores[i] / 3).toFixed(1) + ' / 5';
      row.append(partner);
    }
    $('scores').append(row);
  }
  $('together').hidden = !partnerScores;
  $('guide').hidden = !partnerScores;
  $('guide-invite').hidden = Boolean(partnerScores);
  if (partnerScores) renderGuide(buildGuide(partnerScores, scores));
  if (partnerScores && pageOnce.first('partner_guide_viewed')) track('partner_guide_viewed');
  if (partnerScores) {
    const differences = preferences.map((preference, i) => ({ preference, own: scores[i], partner: partnerScores[i], gap: Math.abs(scores[i] - partnerScores[i]) }));
    const largestGap = Math.max(...differences.map(item => item.gap));
    const comparison = largestGap === 0
      ? 'You gave the same average scores across all ten preferences. Compare specific examples of what each preference looks like for you; similar scores can still mean different things in daily life.'
      : 'Your largest score differences are in ' + differences.filter(item => item.gap === largestGap).map(item => `${item.preference.name} (you ${(item.own / 3).toFixed(1)}, partner ${(item.partner / 3).toFixed(1)})`).join(', ') + '. Ask each other which moments you were picturing when answering. These differences offer a conversation about preferences, and do not measure the amount of love either person feels.';
    const partnerTop = topPreferences(partnerScores);
    const suggestions = [...new Set([...top, ...partnerTop].map(item => item.idea))];
    $('together-text').textContent = top.length === 1 && partnerTop.length === 1
      ? suggestions.join(' ') + ' Afterward, ask each other which part felt most connecting.'
      : 'Each choose one preference from your highest scores. Tell your partner a recent moment that fits it, then agree on one small thing to try for each other this week.';
    $('together-text').textContent = comparison + '\n\n' + $('together-text').textContent;
  }
  $('result-heading').focus();
}

function renderGuide(guide) {
  const body = $('guide-body');
  body.replaceChildren();
  const add = (tag, text, parent = body) => {
    const node = document.createElement(tag);
    node.textContent = text;
    parent.append(node);
    return node;
  };
  const section = (heading, items) => {
    if (!items.length) return;
    add('h4', heading);
    const ul = add('ul', '');
    for (const item of items) {
      const li = add('li', '', ul);
      if (item.name) add('strong', item.name + '. ', li);
      li.append(item.text);
    }
  };
  add('p', guide.opening);
  section('What may matter most to them', guide.matters);
  section('Habits to build', guide.habits);
  section(guide.kind === 'focused' || guide.kind === 'low' ? 'Also high for them' : 'Ways to meet them', guide.alsoMatters);
  if (guide.shared.length) {
    add('h4', 'What you have in common');
    for (const item of guide.shared) {
      const p = add('p', '');
      if (guide.shared.length > 1) add('strong', item.name + '. ', p);
      p.append(item.text);
    }
  }
  if (guide.overlook.length) {
    add('h4', 'Something you might overlook');
    for (const text of guide.overlook) add('p', text);
  }
  add('h4', 'One thing to try this week');
  add('p', guide.experiment.text);
  add('h4', 'If you’re apart');
  add('p', guide.experiment.apart);
  if (guide.more.length) {
    const more = add('details', '');
    add('summary', 'More ideas', more);
    const ul = add('ul', '', more);
    for (const item of guide.more) add('li', item.text, ul);
  }
  add('p', 'Afterward, ask which part they appreciated most and what they’d change. What they tell you outranks these scores.').className = 'muted';
}

async function copyText(text, message, eventName) {
  try {
    await navigator.clipboard.writeText(text);
    $('status').textContent = message;
    $('copy-fallback').hidden = true;
    track(eventName, { method: 'clipboard' });
  } catch {
    track(eventName, { method: 'manual' });
    $('copy-fallback').hidden = false;
    $('copy-value').value = text;
    $('copy-value').focus();
    $('copy-value').select();
    $('status').textContent = 'Automatic copying is unavailable. Select and copy the text below.';
  }
}

$('start').addEventListener('click', () => {
  track('quiz_start', { has_partner: Boolean(partnerScores) });
  renderQuestion();
});
$('question-form').addEventListener('submit', event => {
  event.preventDefault();
  if (answers[index] === null) return;
  if (index < questions.length - 1) {
    index += 1;
    if ((index === 10 || index === 20) && attemptOnce.first('progress_' + index)) track('quiz_progress', { step: index });
    persist();
    renderQuestion();
    return;
  }
  const missing = answers.indexOf(null);
  if (missing !== -1) {
    index = missing;
    persist();
    renderQuestion();
    return;
  }
  completed = true;
  const firstCompletion = attemptOnce.first('complete');
  persist();
  renderResults();
  if (firstCompletion) track('quiz_complete', { has_partner: Boolean(partnerScores) });
});
$('back').addEventListener('click', () => {
  index = Math.max(0, index - 1);
  persist();
  renderQuestion();
});
$('review').addEventListener('click', () => {
  index = 0;
  completed = false;
  persist();
  renderQuestion();
});
$('restart').addEventListener('click', () => {
  $('restart-confirm').hidden = false;
  $('cancel-restart').focus();
});
$('cancel-restart').addEventListener('click', () => {
  $('restart-confirm').hidden = true;
  $('restart').focus();
});
$('confirm-restart').addEventListener('click', () => {
  answers = Array(questions.length).fill(null);
  index = 0;
  completed = false;
  attemptOnce.clear();
  persist();
  track('restart_confirmed');
  renderQuestion();
});
$('share').addEventListener('click', () => {
  copyText($('result-link').value, 'Result link copied. Send it to your partner so they can take the quiz and compare.', 'result_link_copied');
});
$('copy').addEventListener('click', () => {
  const scores = calculateScores(answers);
  const lines = preferences.map((preference, i) => `${preference.name}: ${(scores[i] / 3).toFixed(1)} / 5`);
  copyText(['My Sweetee connection quiz results', ...lines, 'Experimental self-reflection quiz.'].join('\n'), 'Results copied.', 'result_text_copied');
});

window.addEventListener('hashchange', () => {
  partnerScores = decodeSharedScores(location.hash);
  $('partner-notice').hidden = !partnerScores;
  trackPartnerLink();
  if (completed) renderResults();
});
// Delegated so the call-to-action links work whether or not they exist yet.
document.addEventListener('click', event => {
  const cta = event.target instanceof Element ? event.target.closest('#sweetee-cta, #sweetee-cta-intro') : null;
  if (cta) track('sweetee_cta_clicked', { placement: cta.id === 'sweetee-cta-intro' ? 'intro' : 'results' });
});

if (completed) renderResults();
else if (answers.some(value => value !== null)) renderQuestion();
