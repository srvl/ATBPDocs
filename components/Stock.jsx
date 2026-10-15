'use client'
// Live stock on the plan pages. The page is built with the stock scripts/stock.mjs read from billing; in the
// browser these ask billing again (/atbp/stock.json) and update the badge and the "checked" time. If billing
// cannot be reached, the built text stays, so the page never shows less than it was built with.
import { useEffect, useState } from 'react'

const FEED = 'https://billing.atbphosting.com/atbp/stock.json'
let pending = null

function feed() {
  if (!pending) {
    pending = fetch(FEED, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((f) => {
        if (!f || !Array.isArray(f.groups)) return null
        const plans = {}
        for (const g of f.groups) for (const p of g.plans || []) plans[p.slug] = p.stock
        return { plans, checked: f.stock_checked_at || f.generated_at }
      })
      .catch(() => null)
  }
  return pending
}

function useFeed() {
  const [data, setData] = useState(null)
  useEffect(() => {
    let live = true
    feed().then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [])
  return data
}

export function Stock({ plan, children }) {
  const data = useFeed()
  const built = String(children ?? '').trim()
  const now = data && data.plans[plan]
  const text = now ? (now === 'in_stock' ? 'In stock' : 'Sold out') : built
  const open = text === 'In stock'
  return (
    <span className={'atbp-stock ' + (open ? 'atbp-stock-in' : 'atbp-stock-out')} title={now ? 'Live from billing' : undefined}>
      {text}
    </span>
  )
}

const fmt = (iso) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(
    new Date(iso)
  ) + ' (Philippine time)'

export function StockTime({ children }) {
  const data = useFeed()
  return <span>{data && data.checked ? fmt(data.checked) : children}</span>
}
