import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: { default: 'ATBP Hosting Docs', template: '%s – ATBP Docs' },
  description: 'Guides, tips and policies for ATBP Hosting game servers.'
}

const navbar = (
  <Navbar
    logo={<b>ATBP Hosting Docs</b>}
  />
)
const footer = <Footer>© {new Date().getFullYear()} ATBP Hosting Ltd.</Footer>

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/srvl/ATBPDocs/tree/main"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
