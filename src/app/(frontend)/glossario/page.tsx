import Link from 'next/link'

import { Breadcrumb } from '@/components/PostCard'
import { glossaryGraph, JsonLd } from '@/lib/jsonld'
import { getGlossary } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import type { Post } from '@/payload-types'

export const revalidate = 3600

export const metadata = pageMetadata({
  title: 'Glossário de antifraude e pagamentos no e-commerce',
  description:
    'Definições curtas de chargeback, falso positivo, 3DS, MED, autofraude, taxa de aprovação e outros termos de antifraude e pagamentos.',
  path: '/glossario',
})

export default async function GlossaryPage() {
  const terms = await getGlossary()
  return (
    <div className="container section narrow">
      <JsonLd data={glossaryGraph(terms)} />
      <Breadcrumb
        items={[
          { name: 'Blog', path: '/' },
          { name: 'Glossário', path: '/glossario' },
        ]}
      />
      <header className="page-header">
        <h1>Glossário de antifraude e pagamentos</h1>
        <p className="lead">Os termos que aparecem no dia a dia de quem vende online, em uma ou duas frases.</p>
      </header>
      {terms.length ? (
        <>
          <nav aria-label="Termos" className="chips">
            <ul>
              {terms.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.slug}`}>{t.term}</a>
                </li>
              ))}
            </ul>
          </nav>
          <dl className="glossary">
            {terms.map((t) => {
              const post = typeof t.relatedPost === 'object' ? (t.relatedPost as Post | null) : null
              return (
                <div key={t.id} id={t.slug || undefined} className="glossary-item">
                  <dt>
                    <h2>{t.term}</h2>
                  </dt>
                  <dd>
                    <p>{t.definition}</p>
                    {post?._status === 'published' ? (
                      <p className="small">
                        Leia mais: <Link href={`/${post.slug}`}>{post.title}</Link>
                      </p>
                    ) : null}
                  </dd>
                </div>
              )
            })}
          </dl>
        </>
      ) : (
        <p className="muted">Os primeiros termos estão sendo revisados.</p>
      )}
    </div>
  )
}
