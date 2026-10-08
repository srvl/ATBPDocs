import fs from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-static'

const BASE = 'https://docs.atbphosting.com'

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

export default function sitemap() {
  const root = path.join(process.cwd(), 'content')
  return walk(root)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const rel = path.relative(root, f).replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')
      return {
        url: `${BASE}/${rel}${rel ? '/' : ''}`,
        lastModified: fs.statSync(f).mtime
      }
    })
    .sort((a, b) => a.url.localeCompare(b.url))
}
