import Link from 'next/link'

import type { PostCard as PostCardData } from '@/lib/queries'
import { asMedia, mediaSize } from '@/lib/media'
import { getCategory } from '@/lib/taxonomy'
import { formatDate } from '@/lib/text'

export const PostCard = ({ post, featured = false }: { post: PostCardData; featured?: boolean }) => {
  const hero = asMedia(post.heroImage)
  const img = hero ? mediaSize(hero, featured ? 'hero' : 'card') : null
  const category = getCategory(post.category)
  return (
    <article className={featured ? 'card card-featured' : 'card'}>
      {img?.url ? (
        <img src={img.url} alt={hero!.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
      ) : null}
      <div className="card-body">
        {category ? <p className="eyebrow">{category.label}</p> : null}
        <h3 className="card-title">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="muted">{post.description}</p>
        <p className="meta small">
          {formatDate(post.publishedAt)}
          {post.readingTime ? ` · ${post.readingTime} min de leitura` : ''}
        </p>
      </div>
    </article>
  )
}

export const PostGrid = ({ posts }: { posts: PostCardData[] }) =>
  posts.length ? (
    <div className="grid">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  ) : (
    <p className="muted">Ainda não há artigos publicados aqui.</p>
  )

export const Breadcrumb = ({ items }: { items: { name: string; path: string }[] }) => (
  <nav aria-label="Trilha de navegação" className="breadcrumb">
    <ol>
      {items.map((item, i) => (
        <li key={item.path}>
          {i < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
        </li>
      ))}
    </ol>
  </nav>
)
