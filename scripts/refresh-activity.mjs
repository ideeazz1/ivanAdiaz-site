#!/usr/bin/env node
// Regenerates the Recent Activity block on /experience/:
//   - a rolling 90-day GitHub contribution heatmap (inline SVG + JSON snapshot)
//   - the two newest verified delivery receipts from experience/receipts.json
//
// Usage:
//   GITHUB_TOKEN=... node scripts/refresh-activity.mjs            # live GraphQL fetch
//   node scripts/refresh-activity.mjs --fixture path/to/data.json # offline, reuse a snapshot
//
// Only the regions between <!-- activity:*:start --> / <!-- activity:*:end -->
// markers in experience/index.html are rewritten. No repository names or
// private content are published: only per-day counts.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = join(ROOT, 'experience/index.html');
const SNAPSHOT = join(ROOT, 'experience/github-contributions-90d.json');
const RECEIPTS = join(ROOT, 'experience/receipts.json');
const ACCOUNT = process.env.ACTIVITY_LOGIN || 'ideeazz1';
const TZ = 'America/Chicago';
const WINDOW_DAYS = 90;
const RECEIPTS_SHOWN = 2;

const COLORS = ['#ebedf0', '#c6e8d1', '#7fc99b', '#42a86d', '#1f713f'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function todayIn(tz) {
  // YYYY-MM-DD for "now" in the given zone.
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
const addDays = (iso, n) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const weekday = (iso) => new Date(iso + 'T00:00:00Z').getUTCDay();

async function fetchDays(start, end) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required for a live fetch (or pass --fixture).');
  const query = `query($login:String!,$from:DateTime!,$to:DateTime!){
    user(login:$login){ contributionsCollection(from:$from,to:$to){
      contributionCalendar{ weeks{ contributionDays{ date contributionCount } } } } } }`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'site-activity-refresh' },
    body: JSON.stringify({ query, variables: { login: ACCOUNT, from: `${start}T00:00:00Z`, to: `${end}T23:59:59Z` } }),
  });
  const body = await res.json();
  if (!res.ok || body.errors) throw new Error(`GraphQL failed: ${res.status} ${JSON.stringify(body.errors || body)}`);
  const days = body.data.user.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays);
  return days.map((d) => ({ date: d.date, contributionCount: d.contributionCount }));
}

// Levels relative to this window (GitHub's own quartiles are year-wide and
// flatten a 90-day view into one shade).
function assignLevels(days) {
  const nonzero = days.map((d) => d.contributionCount).filter((c) => c > 0).sort((a, b) => a - b);
  const q = (p) => nonzero[Math.min(nonzero.length - 1, Math.floor(p * nonzero.length))] ?? 0;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  return days.map((d) => {
    const c = d.contributionCount;
    const level = c === 0 ? 0 : c <= q1 ? 1 : c <= q2 ? 2 : c <= q3 ? 3 : 4;
    return { ...d, level, weekday: weekday(d.date) };
  });
}

function fmtRange(start, end) {
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  const left = `${MONTHS_LONG[sm - 1]} ${sd}${sy !== ey ? `, ${sy}` : ''}`;
  const right = `${sm === em && sy === ey ? '' : MONTHS_LONG[em - 1] + ' '}${ed}, ${ey}`;
  return `${left}&ndash;${right}`;
}

function renderSvg(days, start, end) {
  const startWd = weekday(start);
  const col = (i) => Math.floor((startWd + i) / 7);
  const x = (c) => 48 + c * 22;
  const y = (wd) => 31 + wd * 22;
  const plain = fmtRange(start, end).replace('&ndash;', ' through ');
  const parts = [];
  parts.push(`<svg class="career-contribution-chart" xmlns="http://www.w3.org/2000/svg" width="360" height="227" viewBox="0 0 360 227" role="img" aria-labelledby="contribution-title contribution-desc">`);
  parts.push(`<title id="contribution-title">GitHub contribution activity, ${plain}</title>`);
  parts.push(`<desc id="contribution-desc">Ninety dated daily contribution counts from the authenticated GitHub contribution calendar for ${esc(ACCOUNT)}, refreshed automatically each day. Each square has its date and exact count in a tooltip. Shades are relative to this 90-day window. The final day is a partial-day snapshot.</desc>`);

  // Month labels at the first column containing the 1st; label the opening
  // month only if the next label is at least 3 columns away.
  const labels = [];
  days.forEach((d, i) => { if (d.date.endsWith('-01')) labels.push({ c: col(i), m: Number(d.date.slice(5, 7)) }); });
  if (!labels.length || labels[0].c >= 3) labels.unshift({ c: 0, m: Number(start.slice(5, 7)) });
  parts.push(`<g fill="#656d76" font-family="system-ui, sans-serif" font-size="12">`);
  for (const l of labels) parts.push(`<text x="${x(l.c)}" y="17">${MONTHS[l.m - 1]}</text>`);
  parts.push(`<text x="0" y="65">Mon</text><text x="0" y="109">Wed</text><text x="0" y="153">Fri</text></g>`);

  days.forEach((d, i) => {
    const n = d.contributionCount;
    parts.push(`<rect x="${x(col(i))}" y="${y(d.weekday)}" width="17" height="17" rx="3" fill="${COLORS[d.level]}"><title>${d.date}: ${n} contribution${n === 1 ? '' : 's'}</title></rect>`);
  });

  parts.push(`<g fill="#656d76" font-family="system-ui, sans-serif" font-size="11"><text x="48" y="204">Less</text>`);
  COLORS.forEach((c, i) => parts.push(`<rect x="${82 + i * 22}" y="194" width="14" height="14" rx="3" fill="${c}"/>`));
  parts.push(`<text x="195" y="204">More</text></g></svg>`);
  return parts.join('');
}

function renderReceipts(receipts) {
  return receipts.slice(0, RECEIPTS_SHOWN).map((r) => {
    for (const k of ['title', 'summary', 'linkHref', 'linkLabel']) if (!r[k]) throw new Error(`receipt missing "${k}": ${JSON.stringify(r)}`);
    const date = r.date ? `<time class="career-delivery-date" datetime="${esc(r.date)}">${esc(r.date)}</time>` : '';
    return `        <article class="career-delivery">
          ${date}<h3>${esc(r.title)}</h3>
          <p>${esc(r.summary)}</p>
          <a class="career-text-link" href="${esc(r.linkHref)}">${esc(r.linkLabel)} &rarr;</a>
        </article>`;
  }).join('\n');
}

function replaceRegion(html, name, content) {
  const re = new RegExp(`(<!-- activity:${name}:start -->)[\\s\\S]*?(<!-- activity:${name}:end -->)`);
  if (!re.test(html)) throw new Error(`marker activity:${name} not found in experience/index.html`);
  return html.replace(re, `$1${content}$2`);
}

async function main() {
  const fixtureIdx = process.argv.indexOf('--fixture');
  let raw, retrievedAt;
  let end = todayIn(TZ);
  if (fixtureIdx > -1) {
    const snap = JSON.parse(readFileSync(process.argv[fixtureIdx + 1], 'utf8'));
    raw = snap.days.map(({ date, contributionCount }) => ({ date, contributionCount }));
    end = snap.windowEnd;
    retrievedAt = snap.retrievedAt;
  } else {
    raw = await fetchDays(addDays(end, -(WINDOW_DAYS - 1)), end);
    retrievedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
  const start = addDays(end, -(WINDOW_DAYS - 1));
  const byDate = new Map(raw.map((d) => [d.date, d.contributionCount]));
  const window = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const date = addDays(start, i);
    return { date, contributionCount: byDate.get(date) ?? 0 };
  });
  const days = assignLevels(window);
  const total = days.reduce((s, d) => s + d.contributionCount, 0);

  const receipts = JSON.parse(readFileSync(RECEIPTS, 'utf8')).receipts;

  let html = readFileSync(PAGE, 'utf8');
  html = replaceRegion(html, 'window', fmtRange(start, end));
  html = replaceRegion(html, 'heatmap', renderSvg(days, start, end));
  html = replaceRegion(html, 'receipts', `\n${renderReceipts(receipts)}\n        `);
  writeFileSync(PAGE, html);

  writeFileSync(SNAPSHOT, JSON.stringify({
    source: 'Authenticated GitHub GraphQL API: user.contributionsCollection.contributionCalendar',
    account: ACCOUNT,
    retrievedAt,
    windowStart: start,
    windowEnd: end,
    windowDays: WINDOW_DAYS,
    levelBasis: 'Quartiles of non-zero days within this window',
    totalContributions: total,
    days: days.map(({ date, contributionCount, level, weekday: wd }) => ({ date, contributionCount, level, weekday: wd })),
  }, null, 2) + '\n');

  console.log(`Activity ${start} → ${end}: ${total} contributions; ${Math.min(receipts.length, RECEIPTS_SHOWN)} receipts rendered.`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
