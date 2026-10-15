import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Stock, StockTime } from './components/Stock'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components) {
  // Stock / StockTime: the live stock badges on the plan pages (scripts/stock.mjs writes them).
  return { ...docsComponents, Stock, StockTime, ...components }
}
