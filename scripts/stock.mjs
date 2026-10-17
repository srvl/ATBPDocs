// Writes the stock, specs and price blocks on the plan pages from billing's public list of plans on sale
// (ATBP Billing, /atbp/stock.json). Same idea as scripts/promotions.mjs: run by .github/workflows/promotions.yml,
// by the docs server before each build and by the support bot's knowledge-base sync, so the site and the bot
// say what billing sells right now.
//
// Only the text between these markers is rewritten; everything else on the page stays hand-written:
//   {/* atbp-stock:start <kind> <billing category slug> */}
//   ...generated...
//   {/* atbp-stock:end */}
// Kinds: plans-table (game plan table with stock), bots-table, stock-table (size, stock, monthly),
//        status (one line, for a line that is not on sale yet), all (every line on sale, for plans/stock).
//
// If billing cannot be reached, or the feed is missing something a block needs, that block (or every page) is
// left as it is: the last good numbers stay, with the time they were read.
//   STOCK_FEED=<url or file>   another feed (tests)
//   STOCK_KEEP_TIME=1          do not rewrite a page when only the "checked" time moved (the GitHub Action,
//                              so stock that did not change does not make a commit every run)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FEED = process.env.STOCK_FEED || 'https://billing.atbphosting.com/atbp/stock.json';
const CONTENT = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
const KEEP_TIME = process.env.STOCK_KEEP_TIME === '1';
// Lines billing still shows but the docs do not describe (the retired Budget Micro).
const SKIP = new Set(['mc-sgp-budget']);
// Order on the Stock right now page; lines not listed follow in billing's order.
const ORDER = ['mc-sgp-premium+', 'hytale-sgp-premium+', 'palworld-sgp-premium+', 'fivem-sgp-premium+', 'terraria-sgp-premium+', 'discord-bots'];

async function load() {
  if (!/^https?:/.test(FEED)) return JSON.parse(readFileSync(FEED, 'utf8'));
  const res = await fetch(FEED, { headers: { 'User-Agent': 'atbp-docs-stock' } });
  if (!res.ok) {
    console.error(`feed answered ${res.status}, pages left as they are`);
    // 404: billing does not publish the list (yet); not a failure worth an alert.
    process.exit(res.status === 404 ? 0 : 1);
  }
  return res.json();
}

const feed = await load();
if (!feed || !Array.isArray(feed.groups)) {
  console.error('feed has no groups list, pages left as they are');
  process.exit(1);
}
const groups = new Map(feed.groups.map((g) => [g.slug, g]));

const peso = (n) => '₱' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
const num = (n) => String(Math.round(n * 100) / 100);
const gb = (mb) => (mb < 1024 ? `${mb} MB` : `${num(mb / 1024)} GB`);
const disk = (mb) => `${num(mb / 1000)} GB`;
const esc = (s) => String(s).replace(/[<>{}*_`[\]|\\]/g, (c) => '\\' + c);
const when = (iso) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    .format(new Date(iso)) + ' (Philippine time)';
const checked = feed.stock_checked_at || feed.generated_at;
// A longer term that costs less than the monthly price times its months shows that regular price struck through
// next to it (display only, from the same feed): "~~₱2,700~~ ₱2,565".
const term = (p, months) => {
  const price = p.prices[String(months)];
  const regular = Math.round(p.prices['1'] * months * 100) / 100;
  return regular - price >= 0.005 ? `~~${peso(regular)}~~ ${peso(price)}` : peso(price);
};
const stock = (p) => `<Stock plan="${p.slug}">${p.stock === 'in_stock' ? 'In stock' : 'Sold out'}</Stock>`;
const time = () => (checked ? `<StockTime>${when(checked)}</StockTime>` : 'just now');
const footer = () =>
  `Stock checked ${time()}, straight from billing. Sold-out sizes open again by themselves when there is room; the store at billing.atbphosting.com always has the final word.`;

// A plan has what a table needs, or the block is left alone.
const complete = (p, terms) => p && p.slug && p.ram_mb > 0 && p.vcpu > 0 && p.disk_mb > 0 && p.prices && terms.every((t) => p.prices[t] > 0);

function plansFor(slug, terms = ['1']) {
  const g = groups.get(slug);
  if (!g || !g.plans?.length) return null;
  return g.plans.every((p) => complete(p, terms)) ? g : null;
}

const render = {
  'plans-table'(slug) {
    const g = plansFor(slug, ['1', '3', '6', '12']);
    if (!g) return null;
    const rows = g.plans.map((p) => {
      const ram = p.ram_mb / 1024;
      return `| ${gb(p.ram_mb)} | ${num(p.vcpu)} | ${disk(p.disk_mb)} | ${p.backups ?? '–'} | ${p.included_splits > 0 ? p.included_splits : '–'} | ${peso(Math.round((p.prices['1'] / ram) * 100) / 100)} | ${peso(p.prices['1'])} | ${term(p, 3)} | ${term(p, 6)} | ${term(p, 12)} | ${stock(p)} |`;
    });
    return [
      '| RAM | vCPU | Storage | Backups | Free splits | ₱/GB | Monthly | 3 months | 6 months | 12 months | Stock |',
      '|---|---|---|---|---|---|---|---|---|---|---|',
      ...rows,
      '',
      footer(),
    ].join('\n');
  },
  'bots-table'(slug) {
    const g = plansFor(slug, ['1', '3', '6', '12']);
    if (!g || g.plans.some((p) => p.databases == null || p.extra_ports == null)) return null;
    const rows = g.plans.map(
      (p) =>
        `| ${esc(p.name)} | ${num(p.vcpu)} vCPU | ${gb(p.ram_mb)} | ${disk(p.disk_mb)} | ${p.backups ?? '–'} | ${p.databases} | ${p.extra_ports} | ${peso(p.prices['1'])} | ${term(p, 3)} | ${term(p, 6)} | ${term(p, 12)} | ${stock(p)} |`
    );
    return [
      '| Plan | CPU | RAM | Storage | Backups | Databases | Extra ports | Monthly | 3 months | 6 months | 12 months | Stock |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|',
      ...rows,
      '',
      footer(),
    ].join('\n');
  },
  'stock-table'(slug) {
    const g = plansFor(slug);
    if (!g) return null;
    return table(g) + '\n\n' + footer();
  },
  status(slug) {
    const g = groups.get(slug);
    // On sale but a plan is not fully set up yet: leave the block as it is rather than say "not on sale".
    if (g && g.plans?.length) return plansFor(slug) ? table(g) + '\n\n' + footer() : null;
    // The line is not in the store: say so, without a date nobody promised.
    return `**Right now:** the plans on this page cannot be ordered yet. This note changes by itself when they go on sale (checked ${time()}).`;
  },
  all() {
    const list = [...ORDER.map((s) => groups.get(s)).filter(Boolean), ...feed.groups.filter((g) => !ORDER.includes(g.slug))]
      .filter((g) => !SKIP.has(g.slug) && plansFor(g.slug));
    if (!list.length) return null;
    return (
      list
        .map((g) => {
          const open = g.plans.filter((p) => p.stock === 'in_stock').length;
          const sum = open === g.plans.length ? 'Every size is in stock' : open === 0 ? 'Every size is sold out right now' : `${open} of ${g.plans.length} sizes in stock`;
          return `## ${esc(g.name)}\n\n${sum}. [Order in the store](${g.url})\n\n${table(g)}`;
        })
        .join('\n\n') +
      '\n\n' +
      footer()
    );
  },
};

function table(g) {
  return [
    '| Plan | RAM | vCPU | Storage | Monthly | Stock |',
    '|---|---|---|---|---|---|',
    ...g.plans.map((p) => `| ${esc(p.name)} | ${gb(p.ram_mb)} | ${num(p.vcpu)} | ${disk(p.disk_mb)} | ${peso(p.prices['1'])} | ${stock(p)} |`),
  ].join('\n');
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const BLOCK = /(\{\/\* atbp-stock:start ([a-z-]+)(?: ([^ *]+))? \*\/\}\n)([\s\S]*?\n)?(\{\/\* atbp-stock:end \*\/\})/g;
const timeless = (s) => s.replace(/<StockTime>[^<]*<\/StockTime>/g, '');
let pages = 0, blocks = 0, skipped = 0;
for (const file of walk(CONTENT)) {
  const old = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (!old.includes('atbp-stock:start')) continue;
  const page = old.replace(BLOCK, (all, start, kind, slug, body, end) => {
    const fn = render[kind];
    const out = fn ? fn(slug) : null;
    if (out == null) {
      console.error(`${file.slice(CONTENT.length + 1)}: ${kind} ${slug ?? ''} not in the feed or incomplete, block left as it is`);
      skipped++;
      return all;
    }
    blocks++;
    return start + out + '\n' + end;
  });
  if (page === old || (KEEP_TIME && timeless(page) === timeless(old))) continue;
  writeFileSync(file, page);
  pages++;
}
console.log(`stock: ${blocks} block(s) written, ${skipped} left as they were, ${pages} page(s) changed`);
