import Link from 'next/link'
import type { Where } from 'payload'

import { Breadcrumb, PostGrid } from '@/components/PostCard'
import { breadcrumbLd, datasetsGraph, JsonLd } from '@/lib/jsonld'
import { getDatasets, getPosts } from '@/lib/queries'
import { ORGANIZATION_LD } from '@/lib/site'
import { type Category, type Subcategory } from '@/lib/taxonomy'
import { formatDate } from '@/lib/text'

export const CategoryPage = async ({ category, sub }: { category: Category; sub?: Subcategory }) => {
  const where: Where = sub
    ? { subcategory: { equals: `${category.slug}/${sub.slug}` } }
    : { category: { equals: category.slug } }
  const posts = await getPosts({ where, limit: 48 })
  const crumbs = [
    { name: 'Blog', path: '/' },
    { name: category.label, path: `/${category.slug}` },
    ...(sub ? [{ name: sub.label, path: `/${category.slug}/${sub.slug}` }] : []),
  ]
  const datasets = category.slug === 'dados' && !sub ? await getDatasets() : []

  return (
    <div className="container section">
      <JsonLd
        data={
          datasets.length
            ? datasetsGraph(datasets)
            : { '@context': 'https://schema.org', '@graph': [ORGANIZATION_LD, breadcrumbLd(crumbs)] }
        }
      />
      <Breadcrumb items={crumbs} />
      <header className="page-header">
        <h1>{sub ? `${sub.label}` : category.label}</h1>
        <p className="lead">{sub ? `Artigos de ${category.label} sobre ${sub.label}.` : category.description}</p>
        {!sub ? (
          <ul className="chips">
            {category.subcategories.map((s) => (
              <li key={s.slug}>
                <Link href={`/${category.slug}/${s.slug}`}>{s.label}</Link>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {category.slug === 'dados' && !sub ? (
        <section className="datasets" aria-labelledby="pesquisas">
          <h2 id="pesquisas">Pesquisas e números da Nexis</h2>
          <p className="muted">
            Dados agregados e anonimizados da operação da Nexis. Nenhum número identifica um lojista. Pode citar à vontade,
            com link para esta página.
          </p>
          {datasets.length ? (
            datasets.map((d) => (
              <article key={d.id} id={d.slug || undefined} className="dataset">
                <h3>{d.title}</h3>
                <p className="small muted">
                  Período: {d.period}
                  {d.publishedAt ? ` · Publicado em ${formatDate(d.publishedAt)}` : ''}
                </p>
                <p>{d.summary}</p>
                {d.figures?.length ? (
                  <dl className="figures">
                    {d.figures.map((f) => (
                      <div key={f.id || f.label}>
                        <dt>{f.label}</dt>
                        <dd>
                          {f.value}
                          {f.unit ? ` ${f.unit}` : ''}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <details>
                  <summary>Metodologia</summary>
                  <p>{d.methodology}</p>
                </details>
              </article>
            ))
          ) : (
            <p className="muted">A primeira pesquisa está sendo preparada.</p>
          )}
        </section>
      ) : null}

      <section aria-label="Artigos" className="section">
        <PostGrid posts={posts.docs} />
      </section>
    </div>
  )
}
