import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'

import { Cta } from '@/components/Cta'
import { Breadcrumb, PostGrid } from '@/components/PostCard'
import { RichText } from '@/components/RichText'
import { JsonLd, postBreadcrumbItems, postGraph } from '@/lib/jsonld'
import { asMedia, mediaSize } from '@/lib/media'
import { getPosts, type PostCard } from '@/lib/queries'
import { MAIN_SITE_URL, MISSION_SIGNATURE } from '@/lib/site'
import { getCategory } from '@/lib/taxonomy'
import { extractH2, formatDate } from '@/lib/text'
import type { Author, Post } from '@/payload-types'

// Divide o corpo em duas partes para colocar o CTA no meio, antes do H2 mais próximo da metade.
const splitForMidCta = (content: SerializedEditorState) => {
  const children = content.root.children
  const h2 = children
    .map((n, i) => ((n as { tag?: string }).tag === 'h2' ? i : -1))
    .filter((i) => i > 0)
  if (h2.length < 2) return [content, null] as const
  const at = h2.reduce((best, i) => (Math.abs(i - children.length / 2) < Math.abs(best - children.length / 2) ? i : best))
  const part = (nodes: typeof children) => ({ ...content, root: { ...content.root, children: nodes } })
  return [part(children.slice(0, at)), part(children.slice(at))] as const
}

export const Article = async ({ post }: { post: Post }) => {
  const author = typeof post.author === 'object' ? (post.author as Author) : null
  const authorPhoto = author ? asMedia(author.photo) : null
  const hero = asMedia(post.heroImage)
  const heroImg = hero ? mediaSize(hero, 'hero') : null
  const category = getCategory(post.category)
  const toc = extractH2(post.content as never)
  const [firstPart, secondPart] = splitForMidCta(post.content as SerializedEditorState)

  const readAlso = (post.related || []).filter((p): p is Post => typeof p === 'object' && p !== null)
  const readAlsoIds = new Set([post.id, ...readAlso.map((p) => p.id)])
  const relatedPosts = post.subcategory
    ? (await getPosts({ where: { subcategory: { equals: post.subcategory } }, limit: 6 })).docs
        .filter((p) => !readAlsoIds.has(p.id))
        .slice(0, 3)
    : []

  return (
    <article className="container article">
      <JsonLd data={postGraph(post)} />
      <Breadcrumb items={postBreadcrumbItems(post)} />

      <header className="article-header">
        {category ? (
          <p className="eyebrow">
            <Link href={`/${category.slug}`}>{category.label}</Link>
          </p>
        ) : null}
        <h1>{post.title}</h1>
        {post.subtitle ? <p className="lead">{post.subtitle}</p> : null}
        <div className="byline">
          {authorPhoto?.url ? (
            <img src={mediaSize(authorPhoto, 'card').url} alt={authorPhoto.alt} width={48} height={48} className="avatar" />
          ) : null}
          <div>
            {author ? (
              <p>
                Por{' '}
                <Link href={`/autores/${author.slug}`} rel="author">
                  {author.name}
                </Link>
                {author.jobTitle ? <span className="muted">, {author.jobTitle}</span> : null}
              </p>
            ) : null}
            <p className="small muted">
              {post.readingTime ? `${post.readingTime} min de leitura · ` : ''}
              {post.publishedAt ? (
                <>
                  Publicado em <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </>
              ) : (
                'Rascunho'
              )}
              {post.dateUpdated ? (
                <>
                  {' · '}Atualizado em <time dateTime={post.dateUpdated}>{formatDate(post.dateUpdated)}</time>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </header>

      {heroImg?.url ? (
        <img
          className="hero-image"
          src={heroImg.url}
          alt={hero!.alt}
          width={heroImg.width}
          height={heroImg.height}
          fetchPriority="high"
        />
      ) : null}

      <section className="tldr" aria-labelledby="resposta-rapida">
        <h2 id="resposta-rapida" className="tldr-title">
          Resposta rápida
        </h2>
        <p>{post.tldr}</p>
      </section>

      {toc.length > 1 ? (
        <nav className="toc" aria-labelledby="sumario">
          <h2 id="sumario" className="toc-title">
            Neste artigo
          </h2>
          <ol>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
            {post.faq?.length ? (
              <li>
                <a href="#perguntas-frequentes">Perguntas frequentes</a>
              </li>
            ) : null}
          </ol>
        </nav>
      ) : null}

      <div className="prose">
        <RichText data={firstPart} />
        <Cta kind={post.cta === 'contato' ? 'contato' : post.cta === 'calculadora' ? 'calculadora' : 'modo-sombra'} />
        {secondPart ? <RichText data={secondPart} /> : null}
      </div>

      {post.faq?.length ? (
        <section className="faq" aria-labelledby="perguntas-frequentes">
          <h2 id="perguntas-frequentes">Perguntas frequentes</h2>
          {post.faq.map((f) => (
            <div key={f.id || f.question} className="faq-item">
              <h3>{f.question}</h3>
              <p>{f.answer}</p>
            </div>
          ))}
        </section>
      ) : null}

      {post.sources?.length ? (
        <section className="sources" aria-labelledby="fontes">
          <h2 id="fontes">Fontes</h2>
          <ol>
            {post.sources.map((s) => (
              <li key={s.id || s.url}>
                <a href={s.url} rel="noopener" target="_blank">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <Cta kind={post.cta === 'contato' ? 'contato' : 'modo-sombra'} variant="final" />

      {readAlso.length ? (
        <section className="read-also" aria-labelledby="leia-tambem">
          <h2 id="leia-tambem">Leia também</h2>
          <ul>
            {readAlso.map((p) => (
              <li key={p.id}>
                <Link href={`/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mission">
        {MISSION_SIGNATURE} <a href={MAIN_SITE_URL}>Conheça a Nexis</a>
      </p>

      {relatedPosts.length ? (
        <section className="related" aria-labelledby="relacionados">
          <h2 id="relacionados">Relacionados</h2>
          <PostGrid posts={relatedPosts as PostCard[]} />
        </section>
      ) : null}
    </article>
  )
}
