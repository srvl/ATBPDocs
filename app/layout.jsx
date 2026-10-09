import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: { default: 'ATBP Hosting Docs', template: '%s – ATBP Docs' },
  description: 'Guides, tips and policies for ATBP Hosting game servers.'
}

const navbar = (
  <Navbar
    logo={
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <img src="/logo.png" alt="ATBP Hosting logo" width={45} height={32} />
        <b>ATBP Hosting Docs</b>
      </span>
    }
  />
)
// Mojang's usage guidelines ask non-official services to say so.
const footer = (
  <Footer>
    <div>
      <div>© {new Date().getFullYear()} ATBP Hosting Ltd.</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.4rem' }}>
        NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
      </div>
    </div>
  </Footer>
)

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/srvl/ATBPDocs/tree/master"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
