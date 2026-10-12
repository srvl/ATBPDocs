import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { Search } from '../components/Search'
import './atbp.css'

export const metadata = {
  title: { default: 'ATBP Hosting Docs', template: '%s – ATBP Docs' },
  description: 'Guides, tips and policies for ATBP Hosting game servers.',
  // Not open source: search engines may index, AI crawlers and scrapers may not (robots.js, /llms.txt, /general/using-these-docs).
  robots: 'index, follow, noai, noimageai',
  other: { 'tdm-reservation': '1', 'tdm-policy': 'https://docs.atbphosting.com/general/using-these-docs' }
}

const navbar = (
  <Navbar
    logo={
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <img src="/logo.png" alt="ATBP Hosting logo" width={40} height={28} />
        <b>ATBP Hosting</b>
      </span>
    }
  >
    <a className="atbp-nav-link" href="https://discord.atbphosting.com" target="_blank" rel="noreferrer">Discord</a>
    <a className="atbp-nav-link" href="https://panel.atbphosting.com" target="_blank" rel="noreferrer">Panel</a>
    <a className="atbp-nav-store" href="https://billing.atbphosting.com" target="_blank" rel="noreferrer">Store</a>
  </Navbar>
)
// Mojang's usage guidelines ask non-official services to say so.
const footer = (
  <Footer>
    <div className="atbp-footer">
      <div>
        <div>© {new Date().getFullYear()} ATBP Hosting Ltd. All rights reserved. Not open source: no scraping, copying or AI training. <a href="/general/using-these-docs">Using these docs</a></div>
        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.4rem' }}>
          NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
        </div>
      </div>
      <div className="atbp-footer-links">
        <a href="https://atbphosting.com" target="_blank" rel="noreferrer">Website</a>
        <a href="https://discord.atbphosting.com" target="_blank" rel="noreferrer">Discord</a>
        <a href="https://panel.atbphosting.com" target="_blank" rel="noreferrer">Panel</a>
        <a href="https://billing.atbphosting.com" target="_blank" rel="noreferrer">Billing</a>
      </div>
    </div>
  </Footer>
)

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head color={{ hue: 30, saturation: 95 }} />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          editLink={null}
          feedback={{ content: null }}
          footer={footer}
          search={<Search />}
          nextThemes={{ defaultTheme: 'dark' }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
