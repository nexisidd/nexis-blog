import Link from 'next/link'

import { Cta } from '@/components/Cta'
import { PostCard, PostGrid } from '@/components/PostCard'
import { breadcrumbLd, JsonLd, websiteLd } from '@/lib/jsonld'
import { getPosts } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { NEXIS_ENTITY_SENTENCE, ORGANIZATION_LD, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import { CATEGORIES } from '@/lib/taxonomy'

export const revalidate = 3600

export const metadata = pageMetadata({
  title: `${SITE_NAME}: antifraude, chargeback e pagamentos no e-commerce`,
  description: SITE_DESCRIPTION,
  path: '/',
})

export default async function Home() {
  const latest = await getPosts({ limit: 7 })
  const byCategory = await Promise.all(
    CATEGORIES.map(async (c) => ({ category: c, posts: (await getPosts({ where: { category: { equals: c.slug } }, limit: 3 })).docs })),
  )
  const [featured, ...rest] = latest.docs

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [websiteLd(), ORGANIZATION_LD, breadcrumbLd([{ name: 'Blog', path: '/' }])],
        }}
      />
      <section className="hero container">
        <h1>Antifraude, chargeback e pagamentos no e-commerce, explicados com dados</h1>
        <p className="lead">{NEXIS_ENTITY_SENTENCE}</p>
      </section>

      <section className="container section">
        {featured ? <PostCard post={featured} featured /> : <p className="muted">Os primeiros artigos estão a caminho.</p>}
        {rest.length ? <PostGrid posts={rest} /> : null}
      </section>

      <section className="container section calc-teaser">
        <div>
          <h2>Quanto de venda boa a sua loja está bloqueando?</h2>
          <p>Use a calculadora para estimar a receita recusada por falso positivo no antifraude.</p>
        </div>
        <Link className="btn" href="/calculadoras">
          Abrir a calculadora
        </Link>
      </section>

      {byCategory
        .filter((g) => g.posts.length)
        .map(({ category, posts }) => (
          <section key={category.slug} className="container section">
            <div className="section-head">
              <h2>{category.label}</h2>
              <Link href={`/${category.slug}`}>Ver tudo em {category.label}</Link>
            </div>
            <PostGrid posts={posts} />
          </section>
        ))}

      <section className="container section">
        <Cta kind="modo-sombra" variant="final" />
      </section>
    </>
  )
}
