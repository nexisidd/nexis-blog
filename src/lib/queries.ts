import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayload, type Where } from 'payload'

import { STATIC_EXPORT } from '@/lib/site'
import type { Author, Dataset, Glossary, Post } from '@/payload-types'

export const payloadClient = () => getPayload({ config: configPromise })

const published: Where = { _status: { equals: 'published' } }

const cardSelect = {
  title: true,
  slug: true,
  description: true,
  category: true,
  subcategory: true,
  heroImage: true,
  publishedAt: true,
  dateUpdated: true,
  readingTime: true,
  author: true,
} as const

export type PostCard = Pick<Post, keyof typeof cardSelect | 'id'>

export const getPosts = async (opts: { where?: Where; limit?: number; page?: number } = {}) => {
  const payload = await payloadClient()
  return payload.find({
    collection: 'posts',
    where: opts.where ? { and: [published, opts.where] } : published,
    sort: '-publishedAt',
    limit: opts.limit ?? 12,
    page: opts.page ?? 1,
    depth: 1,
    select: cardSelect,
    overrideAccess: false,
  })
}

// Modo prévia só existe no painel; no site estático não há rascunhos.
export const isDraftMode = async () => (STATIC_EXPORT ? false : (await draftMode()).isEnabled)

export const getPostBySlug = cache(async (slug: string) => {
  const draft = await isDraftMode()
  const payload = await payloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: draft ? { slug: { equals: slug } } : { and: [published, { slug: { equals: slug } }] },
    draft,
    limit: 1,
    depth: 2,
    // Em modo prévia o leitor é um usuário logado; acesso já foi checado na rota /next/preview.
    overrideAccess: draft,
  })
  return result.docs[0] as Post | undefined
})

export const getAllPublishedSlugs = async () => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: published,
    limit: 1000,
    depth: 0,
    select: { slug: true, dateUpdated: true, updatedAt: true, publishedAt: true, category: true, subcategory: true },
    overrideAccess: false,
    pagination: false,
  })
  return docs
}

export const getAuthors = cache(async () => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'authors', limit: 100, depth: 1, sort: 'name', pagination: false })
  return docs as Author[]
})

export const getAuthorBySlug = cache(async (slug: string) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'authors', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return docs[0] as Author | undefined
})

export const getGlossary = cache(async () => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'glossary',
    where: published,
    sort: 'term',
    limit: 500,
    depth: 1,
    overrideAccess: false,
    pagination: false,
  })
  return docs as Glossary[]
})

export const getDatasets = cache(async () => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'datasets',
    where: published,
    sort: '-publishedAt',
    limit: 100,
    depth: 1,
    overrideAccess: false,
    pagination: false,
  })
  return docs as Dataset[]
})
