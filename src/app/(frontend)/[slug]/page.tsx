import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Article } from '@/components/Article'
import { CategoryPage } from '@/components/CategoryPage'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { absoluteMediaUrl, asMedia, mediaSize } from '@/lib/media'
import { getAllPublishedSlugs, getPostBySlug, isDraftMode } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { CATEGORIES, getCategory } from '@/lib/taxonomy'
import type { Author } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPublishedSlugs().catch(() => [])
  return [...CATEGORIES.map((c) => ({ slug: c.slug })), ...posts.map((p) => ({ slug: p.slug! }))]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (category)
    return pageMetadata({
      title: `${category.label}: artigos e guias`,
      description: category.description,
      path: `/${category.slug}`,
    })
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const hero = asMedia(post.heroImage)
  const author = typeof post.author === 'object' ? (post.author as Author) : null
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/${post.slug}`,
    image: hero ? absoluteMediaUrl(mediaSize(hero, 'og').url) : undefined,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.dateUpdated || post.publishedAt,
      author: author?.name,
      section: getCategory(post.category)?.label,
    },
  })
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const category = getCategory(slug)
  if (category) return <CategoryPage category={category} />

  const post = await getPostBySlug(slug)
  if (!post) notFound()
  const draft = await isDraftMode()
  return (
    <>
      {draft ? <RefreshRouteOnSave /> : null}
      {draft ? <p className="preview-banner">Pré-visualização. Este conteúdo pode ainda não estar publicado.</p> : null}
      <Article post={post} />
    </>
  )
}
