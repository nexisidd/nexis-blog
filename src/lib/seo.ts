import type { Metadata } from 'next'

import { absoluteUrl, SITE_NAME } from './site'

type PageMeta = {
  title: string
  description: string
  path: string
  image?: string
  article?: { publishedTime?: string | null; modifiedTime?: string | null; author?: string; section?: string }
}

export const pageMetadata = ({ title, description, path, image, article }: PageMeta): Metadata => ({
  title,
  description,
  alternates: { canonical: absoluteUrl(path), types: { 'application/rss+xml': absoluteUrl('/rss.xml') } },
  robots: { index: true, follow: true, 'max-image-preview': 'large' as const, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const } },
  openGraph: {
    type: article ? 'article' : 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    title,
    description,
    url: absoluteUrl(path),
    images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    ...(article
      ? {
          publishedTime: article.publishedTime || undefined,
          modifiedTime: article.modifiedTime || undefined,
          authors: article.author ? [article.author] : undefined,
          section: article.section,
        }
      : {}),
  },
  twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
})
