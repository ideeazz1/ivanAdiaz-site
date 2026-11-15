'use strict';
// Run the actual browser script with a small DOM boundary; no live requests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const groups = [
  { lane: 'Shared Ivan OS', title: 'SHARED IVAN OS', sections: [] },
  { lane: 'Peregrine', title: 'PEREGRINE', sections: [] },
  { lane: 'Mortgage', title: 'MORTGAGE INTELLIGENCE CORE', sections: ['5 AM — Research', '7 AM — Follow-up', '9 PM — End of day', 'Support'] },
  { lane: 'Career', title: 'CAREER MANAGER', sections: [] },
];
function item(id, lane, extra = {}) {
  return { id, name: id, lane, provider: 'Worker', schedule: 'Daily', registeredState: 'active', receiptState: 'valid', lastRunAt: '2026-11-13T20:00:00Z', outcome: 'SUCCEEDED', ...extra };
}
let payload = {
  schemaVersion: 1, fetchedAt: new Date().toISOString(), sourceStatus: 'current', groups,
  automations: [
    item('report', 'Shared Ivan OS', { outcome: 'DELIVERED' }),
    item('pilot', 'Peregrine', { outcome: 'PARTIAL' }),
    ...groups[2].sections.map((section, i) => item('mortgage' + i, 'Mortgage', { section })),
    item('sebas', 'Career'),
    item('paused', 'Mortgage', { registeredState: 'paused', receiptState: 'missing', lastRunAt: null, outcome: null }),
    item('invalid', 'Career', { receiptState: 'unavailable', lastRunAt: null, outcome: null }),
    item('hidden', 'Career', { outcome: null }),
    item('retired', 'Career', { registeredState: 'retired' }),
  ],
};
let details = [];
function element() {
  return { value: '', dataset: {}, listeners: {}, textContent: '', setAttribute() {}, addEventListener(event, fn) { this.listeners[event] = fn; } };
}
const ids = Object.fromEntries(['rows', 'search', 'refresh', 'total', 'recorded', 'missing', 'paused', 'count', 'feed-dot', 'feed-message'].map(id => [id, element()]));
Object.defineProperty(ids.rows, 'innerHTML', {
  set(value) { this.html = value; details = [...value.matchAll(/<details class="row" data-id="([^"]+)"/g)].map(match => ({ dataset: { id: match[1] }, open: false })); },
  get() { return this.html; },
});
const buttons = ['all', ...groups.map(g => g.lane)].map(lane => ({ ...element(), dataset: { lane } }));
const document = {
  hidden: false, getElementById: id => ids[id], addEventListener() {},
  querySelectorAll(selector) { return selector === '[data-lane]' ? buttons : selector === '.row[open]' ? details.filter(d => d.open) : details; },
};
const context = { document, Intl, Date, Set, AbortController, setTimeout, clearTimeout, setInterval() {}, fetch: async () => ({ ok: true, json: async () => payload }) };
const flush = () => new Promise(resolve => setImmediate(resolve));
(async () => {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../console-os/console.js'), 'utf8'), context);
  await flush();
  for (const group of groups) assert.ok(ids.rows.innerHTML.includes(group.title));
  let previous = -1;
  for (const title of groups[2].sections) { const position = ids.rows.innerHTML.indexOf('>' + title + '</h4>'); assert.ok(position > previous); previous = position; }
  assert.equal(ids.total.textContent, 10);
  assert.equal(ids.recorded.textContent, 8);
  assert.equal(ids.missing.textContent, 2);
  assert.equal(ids.paused.textContent, 1);
  assert.ok(!ids.rows.innerHTML.includes('data-id="retired"'));
  for (const text of ['DELIVERED', 'PARTIAL', 'No receipt', 'Receipt unreadable', 'Outcome withheld']) assert.ok(ids.rows.innerHTML.includes(text));
  assert.ok(!/Aging|Needs attention|freshness window/.test(ids.rows.innerHTML));
  details.find(d => d.dataset.id === 'sebas').open = true;
  payload = { ...payload, automations: [...payload.automations].reverse() };
  await ids.refresh.listeners.click();
  assert.equal(details.find(d => d.dataset.id === 'sebas').open, true);
  buttons.find(b => b.dataset.lane === 'Mortgage').listeners.click();
  assert.ok(!ids.rows.innerHTML.includes('<h3') && !ids.rows.innerHTML.includes('<h4'));
  assert.equal(details.length, 5);
  ids.search.value = 'paused'; ids.search.listeners.input();
  assert.equal(details.length, 1); assert.equal(details[0].dataset.id, 'paused');
  ids.search.value = '<script>'; ids.search.listeners.input();
  assert.ok(ids.rows.innerHTML.includes('No systems match'));
  ids.search.value = ''; buttons[0].listeners.click();
  payload = { ...payload, groups: groups.map(g => ({ ...g, title: g.title + ' & <custom>' })) };
  await ids.refresh.listeners.click();
  assert.ok(ids.rows.innerHTML.includes('SHARED IVAN OS &amp; &lt;custom&gt;'));
  console.log('PASS: factual outcomes, counts, registry groups, flat filters, search, stable expanded rows and escaping');
})().catch(error => { console.error(error); process.exitCode = 1; });
