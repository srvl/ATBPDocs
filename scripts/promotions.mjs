// Writes content/billing/current-promotions.mdx from billing's public list of announced coupons
// (ATBP Billing, "Announce publicly"). Run by .github/workflows/promotions.yml; the page only changes when a
// promotion starts, changes or ends, so the docs site and the support bot's knowledge base follow on their own.
// If billing cannot be reached the page is left as it is.
import { writeFileSync, readFileSync } from 'node:fs';

const FEED = process.env.PROMOS_FEED || 'https://billing.atbphosting.com/atbp/promos.json';
const OUT = new URL('../content/billing/current-promotions.mdx', import.meta.url);

const res = await fetch(FEED, { headers: { 'User-Agent': 'atbp-docs-promotions' } });
if (!res.ok) {
  // 404: billing does not publish the list (yet); not a failure worth an alert.
  console.error(`feed answered ${res.status}, page left as it is`);
  process.exit(res.status === 404 ? 0 : 1);
}
const { promos } = await res.json();
if (!Array.isArray(promos)) {
  console.error('feed has no promos list, page left as it is');
  process.exit(1);
}

const date = (iso) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    .format(new Date(iso)) + ' (Philippine time)';
const esc = (s) => String(s).replace(/[<>{}*_`[\]|\\]/g, (c) => '\\' + c);
const where = (w) =>
  w.includes('new') && w.includes('renewals') ? 'new orders and renewals' : w.includes('new') ? 'new orders' : 'renewals (Renew now and prepaying)';

let body;
if (!promos.length) {
  body = 'There is no public promotion right now. The discounts for longer billing terms always apply; see [Discounts, coupons and promo codes](/billing/discounts-and-coupons).\n';
} else {
  body = promos
    .map((p) => {
      const lines = [`## ${esc(p.code)}`, '', esc(p.text), '', `- **Code:** \`${p.code.replace(/`/g, '')}\``];
      if (p.discount) lines.push(`- **Discount:** ${esc(p.discount)}`);
      lines.push(`- **Works on:** ${where(p.where || [])}`);
      if (p.new_customers_only) lines.push('- **Who:** new customers only (accounts without a paid invoice)');
      if (p.starts_at) lines.push(`- **Starts:** ${date(p.starts_at)}`);
      lines.push(`- **Ends:** ${p.expires_at ? date(p.expires_at) : 'no end date set; this page changes when it ends'}`);
      return lines.join('\n');
    })
    .join('\n\n') + '\n';
}

const page = `---
title: "Current promotions"
description: "Promo codes that work right now at ATBP Hosting, updated automatically from billing."
---

This page is updated automatically from billing. The same codes show in the banner at the top of atbphosting.com and billing.atbphosting.com. Enter a code at checkout or on the Renew page; it comes off the price after any longer-term discount. Codes given to you privately, for example one made for your account, are not listed here.

${body}
<details>
<summary>Questions this page answers</summary>

- Is there a promo right now?
- May promo ba ngayon?
- May discount ba?
- What coupon code can I use?
- Ano yung code?
- When does the promo end?
- Hanggang kailan yung promo?
- Does the code work on renewals?
- Is the promo for new customers only?

</details>
`;

let old = '';
try { old = readFileSync(OUT, 'utf8'); } catch {}
if (old !== page) {
  writeFileSync(OUT, page);
  console.log(`page updated: ${promos.length} promotion(s)`);
} else {
  console.log('no change');
}
