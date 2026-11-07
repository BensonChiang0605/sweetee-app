// Cookieless event tracking for the quiz. Only the events and coarse props in
// EVENTS can leave the browser; quiz answers, scores and the URL hash never do.

// Umami Cloud website ID (Settings > Websites > Edit > Website ID).
// While empty, nothing loads and no request is made.
export const UMAMI_WEBSITE_ID = 'cc1aa01d-3e45-43e3-8c1b-0acf9e80acb0';

const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';
const ALLOWED_HOSTS = ['www.sweetee-app.com', 'sweetee-app.com'];
const BEFORE_SEND = 'sweeteeAnalyticsBeforeSend';
const MAX_QUEUE = 50;

const isBoolean = value => typeof value === 'boolean';
const oneOf = (...values) => value => values.includes(value);
const method = oneOf('clipboard', 'manual');

// Event name -> required props and their validators. Anything else is dropped.
const EVENTS = {
  quiz_start: { has_partner: isBoolean },
  quiz_progress: { step: oneOf(10, 20) },
  quiz_complete: { has_partner: isBoolean },
  partner_link_opened: {},
  partner_guide_viewed: {},
  result_link_copied: { method },
  result_text_copied: { method },
  restart_confirmed: {},
  sweetee_cta_clicked: { placement: oneOf('results', 'intro') },
};

export function cleanEvent(name, props) {
  if (typeof name !== 'string' || !Object.hasOwn(EVENTS, name)) return null;
  const data = {};
  for (const [key, valid] of Object.entries(EVENTS[name])) {
    const value = props?.[key];
    if (!valid(value)) return null;
    data[key] = value;
  }
  return Object.keys(data).length ? { name, data } : { name };
}

// Drops the hash and every query parameter except utm_* campaign tags.
export function sanitizeUrl(value) {
  try {
    const absolute = /^[a-z][a-z0-9+.-]*:/i.test(value);
    const url = new URL(value, 'https://placeholder.invalid');
    const kept = new URLSearchParams();
    for (const [key, param] of url.searchParams) if (/^utm_[a-z]+$/.test(key)) kept.append(key, param);
    const search = kept.toString();
    return (absolute ? url.origin : '') + url.pathname + (search ? '?' + search : '');
  } catch {
    return '';
  }
}

export function sanitizeReferrer(value) {
  try {
    if (!value) return '';
    const url = new URL(value);
    return url.origin + url.pathname;
  } catch {
    return '';
  }
}

// Runs on every payload the Umami tracker is about to send, including its
// automatic pageview. Returning null cancels the send.
export function sanitizePayload(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const out = { ...payload };
  if (typeof out.url === 'string') out.url = sanitizeUrl(out.url);
  if (typeof out.referrer === 'string') out.referrer = sanitizeReferrer(out.referrer);
  if ('name' in out || 'data' in out) {
    const event = cleanEvent(out.name, out.data);
    if (!event) return null;
    if (event.data) out.data = event.data;
    else delete out.data;
  }
  if (JSON.stringify(out).includes('scores')) return null;
  return out;
}

export function isLocalHost(hostname) {
  return ['localhost', '127.0.0.1', '[::1]'].includes(hostname) || hostname.endsWith('.localhost');
}

// load() resolves to an object with track(name, data?). It is only called when
// a website ID is set and the page is on an allowed host.
export function createAnalytics({ websiteId = '', hostname = '', load, log = () => {} } = {}) {
  const enabled = Boolean(websiteId) && ALLOWED_HOSTS.includes(hostname) && typeof load === 'function';
  const queue = [];
  let tracker = null;
  let failed = false;

  const send = ({ name, data }) => {
    try {
      const result = data ? tracker.track(name, data) : tracker.track(name);
      result?.catch?.(() => {});
    } catch {}
  };

  if (enabled) {
    try {
      Promise.resolve(load()).then(
        ready => {
          if (typeof ready?.track !== 'function') throw new Error('tracker unavailable');
          tracker = ready;
          for (const event of queue.splice(0)) send(event);
        },
      ).catch(() => {
        failed = true;
        queue.length = 0;
      });
    } catch {
      failed = true;
    }
  }

  function track(name, props) {
    try {
      const event = cleanEvent(name, props);
      if (!event) {
        log('[analytics] dropped invalid event', name);
        return;
      }
      if (!enabled) {
        log('[analytics]', event.name, event.data ?? {});
        return;
      }
      if (failed) return;
      if (tracker) send(event);
      else if (queue.length < MAX_QUEUE) queue.push(event);
    } catch {}
  }

  return { track };
}

// Remembers which keys already fired. Seed it with saved keys to dedupe across reloads.
export function createOnce(initial = []) {
  const seen = new Set(initial);
  return {
    first(key) {
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    },
    keys: () => [...seen],
    clear: () => seen.clear(),
  };
}

function injectUmami(websiteId) {
  return new Promise((resolve, reject) => {
    window[BEFORE_SEND] = (_type, payload) => sanitizePayload(payload);
    const script = document.createElement('script');
    script.async = true;
    script.src = UMAMI_SCRIPT_URL;
    script.dataset.websiteId = websiteId;
    script.dataset.excludeHash = 'true';
    script.dataset.domains = ALLOWED_HOSTS.join(',');
    script.dataset.beforeSend = BEFORE_SEND;
    script.addEventListener('load', () => resolve(window.umami));
    script.addEventListener('error', () => reject(new Error('analytics script blocked')));
    document.head.append(script);
  });
}

const browserHost = typeof location === 'undefined' ? '' : location.hostname;

export const { track } = createAnalytics({
  websiteId: UMAMI_WEBSITE_ID,
  hostname: browserHost,
  load: typeof document === 'undefined' ? undefined : () => injectUmami(UMAMI_WEBSITE_ID),
  log: isLocalHost(browserHost) ? (...args) => console.debug(...args) : undefined,
});
