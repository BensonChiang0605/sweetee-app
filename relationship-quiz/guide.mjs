import { preferences } from './quiz.mjs';
import { content, combos, shared } from './guide-content.mjs';

// Builds the guide a reader sees about their partner from two score arrays
// (totals out of 15, in `preferences` order). Pure and deterministic: the same
// scores always produce the same guide.

const list = names => names.length <= 1 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names.at(-1);

export function profileShape(scores) {
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const lead = preferences.filter((_, i) => scores[i] === max);
  const close = preferences
    .map((preference, i) => ({ preference, score: scores[i] }))
    .filter(item => item.score === max - 1)
    .map(item => item.preference);
  let kind = 'focused';
  if (max === min) kind = 'even';
  else if (max <= 6) kind = 'low';
  else if (lead.length > 3) kind = 'broad';
  return { kind, max, min, lead, close };
}

function pickCombo(ids) {
  for (let a = 0; a < ids.length; a++) {
    for (let b = a + 1; b < ids.length; b++) {
      const combo = combos[[ids[a], ids[b]].sort().join('+')];
      if (combo) return combo;
    }
  }
  return null;
}

export function buildGuide(partnerScores, readerScores) {
  const shape = profileShape(partnerScores);
  const readerScore = id => readerScores[preferences.findIndex(p => p.id === id)];
  const shown = new Set();
  const take = item => {
    if (shown.has(item.tag)) return null;
    shown.add(item.tag);
    return item.text;
  };

  const guide = { kind: shape.kind, opening: '', matters: [], habits: [], alsoMatters: [], shared: [], overlook: [], experiment: null, more: [] };

  if (shape.kind === 'even' || shape.kind === 'broad') {
    const group = shape.kind === 'even' ? preferences : shape.lead;
    guide.opening = shape.kind === 'even'
      ? `Your partner gave every preference the same score, so the quiz can’t tell which ones matter most to them. Use the list below as a menu and ask them which two sound most like them.`
      : `Your partner rated ${list(group.map(p => p.name))} equally high. Their profile is broad, so this guide treats them equally instead of picking a winner. Ask them which two feel most like them.`;
    guide.alsoMatters = group.map(p => ({ name: p.name, text: take(content[p.id].short) }));
    guide.experiment = {
      text: 'Show them this list and ask them to pick the two that feel most like them. Try one suggestion from each this week, then ask which one landed.',
      apart: 'Go through the list together on a call, pick two, and try the apart version of each.',
    };
    return guide;
  }

  const { lead, close } = shape;
  const leadNames = list(lead.map(p => p.name));
  guide.opening = (lead.length === 1
    ? `What stands out most for your partner is ${leadNames}.`
    : `${leadNames} stand out equally for your partner.`);
  if (close.length >= 3) guide.opening += ` ${list(close.map(p => p.name))} come close behind, so their profile is broad rather than sharply defined. Start with the top, and don’t ignore the rest.`;
  else if (close.length) guide.opening += ` ${list(close.map(p => p.name))} ${close.length === 1 ? 'is' : 'are'} close behind.`;
  if (shape.kind === 'low') guide.opening += ' They rated most statements low, so these statements may not capture what matters most to them. Treat this as a light starting point and ask them.';

  guide.matters = lead.map(p => ({ name: p.name, text: content[p.id].matters }));
  guide.habits = lead.map(p => ({ name: p.name, text: take(content[p.id].habit) })).filter(h => h.text);
  if (close.length <= 4) {
    guide.alsoMatters = close.map(p => ({ name: p.name, text: take(content[p.id].short) })).filter(h => h.text);
  }

  // A leading preference is shared when the reader also rates it within one
  // point of their own top. Shared ones get a shared note; the likeliest blind
  // spot is the unshared leading preference the reader scores lowest on.
  const readerMax = Math.max(...readerScores);
  const isShared = p => readerScore(p.id) >= readerMax - 1;
  guide.shared = lead.filter(isShared).map(p => ({ name: p.name, text: shared[p.id].text }));
  const blind = lead.filter(p => !isShared(p)).sort((a, b) => readerScore(a.id) - readerScore(b.id))[0];
  if (blind) guide.overlook.push(content[blind.id].notice);
  const partnerTop = new Set([...lead, ...close].map(p => p.id));
  const readerOwn = preferences.filter((p, i) => readerScores[i] === readerMax && !partnerTop.has(p.id));
  if (readerOwn.length && readerOwn.length <= 3 && readerMax > shape.min) {
    guide.overlook.push(`Your own top ${readerOwn.length === 1 ? 'preference is' : 'preferences are'} ${list(readerOwn.map(p => p.name))}. People often give what they like to receive, and ${readerOwn.length === 1 ? 'that isn’t' : 'those aren’t'} among your partner’s top ones, so check that your effort also reaches ${leadNames}.`);
  }

  const ids = lead.map(p => p.id);
  const withClose = lead.length === 1
    ? close.map(p => pickCombo([ids[0], p.id])).find(Boolean)
    : null;
  guide.experiment = pickCombo(ids) ?? withClose ?? content[ids[0]].experiment;

  guide.more = lead.flatMap(p => content[p.id].more.map(item => ({ name: p.name, text: take(item) })))
    .filter(item => item.text);
  return guide;
}
