import { getPosts } from '@/lib/queries'
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import { getCategory } from '@/lib/taxonomy'
import type { Author } from '@/payload-types'

export const revalidate = 3600

const esc = (s?: string | null) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const { docs } = await getPosts({ limit: 50 })
  const items = docs
    .map((p) => {
      const url = absoluteUrl(`/${p.slug}`)
      const author = typeof p.author === 'object' ? (p.author as Author)?.name : undefined
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.description)}</description>
      ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
      ${author ? `<dc:creator>${esc(author)}</dc:creator>` : ''}
      ${getCategory(p.category) ? `<category>${esc(getCategory(p.category)!.label)}</category>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${absoluteUrl('/')}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>pt-BR</language>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
