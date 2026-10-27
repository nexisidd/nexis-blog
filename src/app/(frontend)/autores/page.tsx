import Link from 'next/link'

import { Breadcrumb } from '@/components/PostCard'
import { breadcrumbLd, JsonLd, personLd } from '@/lib/jsonld'
import { asMedia, mediaSize } from '@/lib/media'
import { getAuthors } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { ORGANIZATION_LD } from '@/lib/site'

export const revalidate = 3600

export const metadata = pageMetadata({
  title: 'Nossa equipe de redatores',
  description: 'Quem escreve o Blog da Nexis: experiência, cargo e artigos de cada autor.',
  path: '/autores',
})

const crumbs = [
  { name: 'Blog', path: '/' },
  { name: 'Autores', path: '/autores' },
]

export default async function AuthorsPage() {
  const authors = await getAuthors()
  return (
    <div className="container section narrow">
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': [...authors.map(personLd), ORGANIZATION_LD, breadcrumbLd(crumbs)] }} />
      <Breadcrumb items={crumbs} />
      <header className="page-header">
        <h1>Nossa equipe de redatores</h1>
        <p className="lead">
          Os artigos do blog são escritos por quem trabalha com antifraude e pagamentos todos os dias. Veja também a nossa{' '}
          <Link href="/sobre">política editorial</Link>.
        </p>
      </header>
      <ul className="author-list">
        {authors.map((a) => {
          const photo = asMedia(a.photo)
          return (
            <li key={a.id} className="author-card">
              {photo?.url ? (
                <img src={mediaSize(photo, 'card').url} alt={photo.alt} width={80} height={80} className="avatar" loading="lazy" />
              ) : null}
              <div>
                <h2>
                  <Link href={`/autores/${a.slug}`}>{a.name}</Link>
                </h2>
                <p className="muted">{a.jobTitle}</p>
                <p>{a.bio}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
