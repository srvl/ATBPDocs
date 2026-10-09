# ATBPDocs: rules for Claude and OpenClaw

Customer-facing docs for ATBP Hosting, live at https://docs.atbphosting.com. Nextra 4, static export. The SmartResponse bot's knowledge base points at this site, so a wrong page is a wrong answer to a customer.

## The rule

**When work anywhere in ATBP changes a fact these docs state, the matching pages are rewritten in the same piece of work, then a PR is opened here.** Edit the page so it reads as if it always said the new thing; remove old wording everywhere it repeats (grep for the old numbers and names). Full procedure: the `atbp-docs-maintenance` skill in `srvl/claude`.

## Layout

- `content/**/*.mdx`: pages. Front matter needs `title` and `description`. Navigation order and labels are each folder's `_meta.js`; a new page or folder must be added there.
- `app/`: Nextra shell, `sitemap.js`, `robots.js`. `next.config.mjs` exports a static site to `out/`; `npm run build` also builds the Pagefind search index.
- Screenshots: only ATBP's own, taken from the docs-demo account (kit `docs-accounts-20261009` in the owner's Beelink Ser8 folder), saved as `.webp` in `public/screenshots/` and used as `![alt](/screenshots/name.webp)` with a descriptive alt text. Never third-party screenshots, videos or embeds. Retake a screenshot when the screen it shows changes.

## Source of truth to page map

| Fact | Source of truth | Pages |
|---|---|---|
| Plans, specs, prices, splits, backups, bot hosting | Paymenter products, project notes | `content/plans/*` |
| Invoice, suspension and deletion timing | Paymenter cron settings | `content/billing/renewals-suspension-and-deletion`, `billing/suspensions_and_terminations` |
| Refunds | Live refund policy on atbphosting.com | `content/billing/refund-policy`, `billing/refunds`, `billing/cancellations` |
| Payment methods, credit, GCash/bank steps | Paymenter gateways | `content/billing/payment-methods`, `gcash`, `bank` |
| Coupons, upgrades | Paymenter | `content/billing/discounts-and-coupons`, `upgrades-and-downgrades` |
| Support channels, region, hardware, ToS summary, domains, optimization | Owner decisions, live ToS | `content/general/*` |
| Panel features and addons | Pterodactyl panel + installed addons | `content/using_the_panel/*` |
| Supported games, versions, Java, plugins | Eggs and panel | `content/games/*`, `content/running_a_server/*`, `content/plugins_and_modifications/*` |

## Style

- No em-dashes. Plain, friendly English; Filipino terms only in "Questions this page answers" blocks.
- Region: Singapore only.
- Keep panel wording generic where a feature is not confirmed on ATBP's panel.
- Do not name competitor hosts. Original wording only when learning from other docs.
- Pages under `plans/`, `billing/` and `general/` end with a collapsed "Questions this page answers" block that the bot uses; keep it in step with the page.

## Shipping

1. `npm install && npm run build` must pass.
2. Branch, push, open a PR to `master`. Never push to `master` directly. State Before/After in the body.
3. After merge, a timer on the SRVL Bridge VPS republishes the site; to publish immediately run `/usr/local/bin/atbp-docs-deploy.sh` as root there.
