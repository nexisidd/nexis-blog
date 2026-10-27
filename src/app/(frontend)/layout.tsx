import type { Metadata, Viewport } from 'next'
import React from 'react'

import { Footer, Header } from '@/components/SiteChrome'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: antifraude, chargeback e pagamentos no e-commerce`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
}

export const viewport: Viewport = { themeColor: '#0b1b33', width: 'device-width', initialScale: 1 }

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
