# ATBP Hosting Docs

Single docs site for ATBP Hosting, built with [Nextra 4](https://nextra.site) (Next.js).
Content started as a fork of Bloom's BloomDocs (used with Bloom's permission) and was rewritten for how ATBP works.

- `content/` : all pages (`.mdx`), navigation order in each folder's `_meta.js`
- `content/plans`, `content/billing`, `content/general` : the SmartResponse knowledge base pages (prices, policies, support). The AI bot's knowledge base can point at this site.
- `public/` : images and static assets

## Develop

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # also builds the Pagefind search index
```

Deploying is not set up yet.
