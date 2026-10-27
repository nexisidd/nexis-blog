import type { Author, Dataset, Glossary, Post } from '@/payload-types'

import { absoluteMediaUrl, asMedia, mediaSize } from './media'
import { getCategory, splitSubcategory, getSubcategory } from './taxonomy'
import { absoluteUrl, ORGANIZATION_ID, ORGANIZATION_LD, SITE_NAME, SITE_URL } from './site'

// Remove chaves vazias (undefined, null, "", []) para o JSON-LD nunca sair com campos vazios.
export const clean = <T,>(value: T): T => {
  if (Array.isArray(value)) return value.map(clean).filter((v) => !isEmpty(v)) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, clean(v)])
        .filter(([, v]) => !isEmpty(v)),
    ) as T
  }
  return value
}
const isEmpty = (v: unknown) =>
  v === undefined ||
  v === null ||
  v === '' ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length === 0)

export const authorUrl = (author: Pick<Author, 'slug'>) => absoluteUrl(`/autores/${author.slug}`)

export const personLd = (author: Author) => ({
  '@type': 'Person',
  '@id': `${authorUrl(author)}#person`,
  name: author.name,
  jobTitle: author.jobTitle,
  url: authorUrl(author),
  description: author.bio,
  image: absoluteMediaUrl(asMedia(author.photo)?.url),
  sameAs: author.linkedin ? [author.linkedin] : undefined,
  worksFor: { '@id': ORGANIZATION_ID },
})

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

export const websiteLd = () => ({
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'pt-BR',
  publisher: { '@id': ORGANIZATION_ID },
})

export const postBreadcrumbItems = (post: Pick<Post, 'title' | 'slug' | 'category' | 'subcategory'>) => {
  const category = getCategory(post.category)
  const { sub } = splitSubcategory(post.subcategory)
  const subcategory = getSubcategory(post.category, sub)
  return [
    { name: 'Blog', path: '/' },
    ...(category ? [{ name: category.label, path: `/${category.slug}` }] : []),
    ...(category && subcategory ? [{ name: subcategory.label, path: `/${category.slug}/${subcategory.slug}` }] : []),
    { name: post.title, path: `/${post.slug}` },
  ]
}

export const postGraph = (post: Post) => {
  const url = absoluteUrl(`/${post.slug}`)
  const author = typeof post.author === 'object' ? (post.author as Author) : null
  const hero = asMedia(post.heroImage)
  const category = getCategory(post.category)
  const { sub } = splitSubcategory(post.subcategory)
  const subcategory = getSubcategory(post.category, sub)
  const graph: object[] = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.description,
      abstract: post.tldr,
      datePublished: post.publishedAt,
      dateModified: post.dateUpdated || post.publishedAt,
      image: hero ? absoluteMediaUrl(mediaSize(hero, 'og').url) : undefined,
      inLanguage: 'pt-BR',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      author: author ? { '@id': `${authorUrl(author)}#person` } : undefined,
      publisher: { '@id': ORGANIZATION_ID },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      articleSection: category?.label,
      about: [category?.label, subcategory?.label].filter(Boolean).map((name) => ({ '@type': 'Thing', name })),
      timeRequired: post.readingTime ? `PT${post.readingTime}M` : undefined,
      citation: (post.sources || []).map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })),
    },
    ...(author ? [personLd(author)] : []),
    ORGANIZATION_LD,
    websiteLd(),
    breadcrumbLd(postBreadcrumbItems(post)),
  ]
  if (post.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  return clean({ '@context': 'https://schema.org', '@graph': graph })
}

export const glossaryGraph = (terms: Glossary[]) => {
  const url = absoluteUrl('/glossario')
  return clean({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': `${url}#glossario`,
        name: 'Glossário de antifraude e pagamentos no e-commerce',
        url,
        inLanguage: 'pt-BR',
        publisher: { '@id': ORGANIZATION_ID },
        hasDefinedTerm: terms.map((t) => ({
          '@type': 'DefinedTerm',
          '@id': `${url}#${t.slug}`,
          name: t.term,
          description: t.definition,
          url: `${url}#${t.slug}`,
          inDefinedTermSet: { '@id': `${url}#glossario` },
        })),
      },
      ORGANIZATION_LD,
      breadcrumbLd([
        { name: 'Blog', path: '/' },
        { name: 'Glossário', path: '/glossario' },
      ]),
    ],
  })
}

export const datasetsGraph = (datasets: Dataset[]) => {
  const url = absoluteUrl('/dados')
  return clean({
    '@context': 'https://schema.org',
    '@graph': [
      ...datasets.map((d) => ({
        '@type': 'Dataset',
        '@id': `${url}#${d.slug}`,
        name: d.title,
        description: `${d.summary} Metodologia: ${d.methodology}`,
        url: `${url}#${d.slug}`,
        temporalCoverage: d.period,
        measurementTechnique: d.methodology,
        datePublished: d.publishedAt,
        dateModified: d.updatedAt,
        inLanguage: 'pt-BR',
        isAccessibleForFree: true,
        creator: { '@id': ORGANIZATION_ID },
        publisher: { '@id': ORGANIZATION_ID },
        variableMeasured: (d.figures || []).map((f) => ({
          '@type': 'PropertyValue',
          name: f.label,
          value: f.value,
          unitText: f.unit,
        })),
      })),
      ORGANIZATION_LD,
      breadcrumbLd([
        { name: 'Blog', path: '/' },
        { name: 'Dados Nexis', path: '/dados' },
      ]),
    ],
  })
}

export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    // JSON.stringify não escapa "<"; escapamos para impedir fechar a tag script.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
)
