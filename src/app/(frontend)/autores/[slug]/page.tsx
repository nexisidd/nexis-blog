import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumb, PostGrid } from '@/components/PostCard'
import { breadcrumbLd, JsonLd, personLd } from '@/lib/jsonld'
import { asMedia, mediaSize } from '@/lib/media'
import { getAuthorBySlug, getAuthors, getPosts } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, ORGANIZATION_LD } from '@/lib/site'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const authors = await getAuthors().catch(() => [])
  return authors.map((a) => ({ slug: a.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorBySlug((await params).slug)
  if (!author) return {}
  return pageMetadata({
    title: `${author.name}, ${author.jobTitle}`,
    description: author.bio.slice(0, 155),
    path: `/autores/${author.slug}`,
  })
}

export default async function AuthorPage({ params }: Props) {
  const author = await getAuthorBySlug((await params).slug)
  if (!author) notFound()
  const posts = await getPosts({ where: { author: { equals: author.id } }, limit: 50 })
  const photo = asMedia(author.photo)
  const crumbs = [
    { name: 'Blog', path: '/' },
    { name: 'Autores', path: '/autores' },
    { name: author.name, path: `/autores/${author.slug}` },
  ]
  return (
    <div className="container section">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'ProfilePage', url: absoluteUrl(`/autores/${author.slug}`), mainEntity: { '@id': personLd(author)['@id'] } },
            personLd(author),
            ORGANIZATION_LD,
            breadcrumbLd(crumbs),
          ],
        }}
      />
      <Breadcrumb items={crumbs} />
      <header className="page-header author-header">
        {photo?.url ? (
          <img src={mediaSize(photo, 'card').url} alt={photo.alt} width={120} height={120} className="avatar avatar-lg" />
        ) : null}
        <div>
          <h1>{author.name}</h1>
          <p className="lead">{author.jobTitle}</p>
          <p>{author.bio}</p>
          {author.linkedin ? (
            <p>
              <a href={author.linkedin} rel="me noopener" target="_blank">
                LinkedIn
              </a>
            </p>
          ) : null}
        </div>
      </header>
      <h2>Artigos de {author.name.split(' ')[0]}</h2>
      <PostGrid posts={posts.docs} />
    </div>
  )
}
