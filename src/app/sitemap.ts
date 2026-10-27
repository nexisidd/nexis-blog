import type { MetadataRoute } from 'next'

import { getAllPublishedSlugs, getAuthors, getDatasets, getGlossary } from '@/lib/queries'
import { absoluteUrl } from '@/lib/site'
import { CATEGORIES, splitSubcategory } from '@/lib/taxonomy'

export const revalidate = 3600

const latest = (dates: (string | null | undefined)[]) =>
  dates.filter(Boolean).sort().at(-1) || undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, authors, glossary, datasets] = await Promise.all([
    getAllPublishedSlugs(),
    getAuthors(),
    getGlossary(),
    getDatasets(),
  ])
  const modified = (p: (typeof posts)[number]) => p.dateUpdated || p.publishedAt || p.updatedAt

  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: latest(posts.map(modified)) },
    ...posts.map((p) => ({ url: absoluteUrl(`/${p.slug}`), lastModified: modified(p) })),
    ...CATEGORIES.flatMap((c) => {
      const inCat = posts.filter((p) => p.category === c.slug)
      const catLastMod = c.slug === 'dados' ? latest([...inCat.map(modified), ...datasets.map((d) => d.updatedAt)]) : latest(inCat.map(modified))
      return [
        { url: absoluteUrl(`/${c.slug}`), lastModified: catLastMod },
        // Subcategorias sem artigo publicado ficam fora até terem conteúdo.
        ...c.subcategories.flatMap((s) => {
          const inSub = inCat.filter((p) => splitSubcategory(p.subcategory).sub === s.slug)
          return inSub.length ? [{ url: absoluteUrl(`/${c.slug}/${s.slug}`), lastModified: latest(inSub.map(modified)) }] : []
        }),
      ]
    }),
    { url: absoluteUrl('/glossario'), lastModified: latest(glossary.map((g) => g.updatedAt)) },
    { url: absoluteUrl('/calculadoras') },
    { url: absoluteUrl('/autores'), lastModified: latest(authors.map((a) => a.updatedAt)) },
    ...authors.map((a) => ({ url: absoluteUrl(`/autores/${a.slug}`), lastModified: a.updatedAt })),
    { url: absoluteUrl('/sobre') },
  ]
  return entries
}
