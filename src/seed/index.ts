// Seed do conteúdo inicial. Rode com: npm run seed
// É idempotente: o que já existe (mesmo slug ou e-mail) é mantido como está.
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import config from '@payload-config'
import { getPayload } from 'payload'

import { dataset, glossary, posts, sectionBody, type SeedPost } from './content'

const payload = await getPayload({ config })
const ctx = { disableRevalidate: true, skipInvite: true }
const editorConfig = await editorConfigFactory.default({ config: payload.config })

const md = (markdown: string) =>
  (convertMarkdownToLexical({ editorConfig, markdown }) as { root: { children: unknown[] } }).root.children

const text = (value: string) => ({ type: 'text', text: value, format: 0, mode: 'normal', style: '', detail: 0, version: 1 })
const paragraph = (value: string) => ({
  type: 'paragraph',
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

// Tabela no formato do editor (a conversão de markdown não monta tabelas).
const table = (header: string[], rows: string[][]) => ({
  type: 'table',
  version: 1,
  format: '',
  indent: 0,
  direction: null,
  children: [header, ...rows].map((cells, rowIndex) => ({
    type: 'tablerow',
    version: 1,
    format: '',
    indent: 0,
    direction: null,
    children: cells.map((cell) => ({
      type: 'tablecell',
      version: 1,
      format: '',
      indent: 0,
      direction: null,
      colSpan: 1,
      rowSpan: 1,
      backgroundColor: null,
      headerState: rowIndex === 0 ? 1 : 0,
      children: [paragraph(cell)],
    })),
  })),
})

const buildContent = (post: SeedPost) => {
  const children: unknown[] = [
    ...md('RASCUNHO: introdução com um dado e a fonte que mostrem por que o tema importa. [DADO + FONTE]'),
  ]
  post.h2.forEach((h2, i) => {
    children.push(...md(`## ${h2}\n\n${sectionBody}`))
    if (post.table && post.table.afterH2 === i) children.push(table(post.table.header, post.table.rows))
  })
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
}

const findBySlug = async (collection: 'posts' | 'glossary' | 'datasets' | 'authors', slug: string) =>
  (await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, draft: true, depth: 0 })).docs[0]

// Usuário admin (opcional; sem as variáveis, crie o primeiro usuário pela tela /admin)
const adminEmail = process.env.SEED_ADMIN_EMAIL
const adminPassword = process.env.SEED_ADMIN_PASSWORD
if (adminEmail && adminPassword) {
  const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: adminEmail } } })
  if (!totalDocs) {
    await payload.create({
      collection: 'users',
      data: { email: adminEmail, password: adminPassword, name: 'Admin', role: 'admin' },
      context: ctx,
    })
    payload.logger.info(`Admin criado: ${adminEmail}`)
  }
}

// Autor
let author = await findBySlug('authors', 'caique-borges')
if (!author) {
  author = await payload.create({
    collection: 'authors',
    data: {
      name: 'Caique Borges',
      slug: 'caique-borges',
      jobTitle: '[CARGO]',
      bio: 'RASCUNHO: bio curta com experiência em antifraude, pagamentos e e-commerce, e por que essa pessoa entende do assunto.',
      linkedin: '',
    },
    context: ctx,
  })
  payload.logger.info('Autor criado: caique-borges')
}

// Artigos (rascunho)
const ids: Record<string, number | string> = {}
for (const post of posts) {
  const existing = await findBySlug('posts', post.slug)
  if (existing) {
    ids[post.slug] = existing.id
    continue
  }
  const doc = await payload.create({
    collection: 'posts',
    draft: true,
    data: {
      _status: 'draft',
      title: post.title,
      subtitle: post.subtitle,
      slug: post.slug,
      description: post.description,
      tldr: post.tldr,
      category: post.category as never,
      subcategory: post.subcategory as never,
      author: author.id,
      cta: post.cta,
      content: buildContent(post) as never,
      faq: post.faq.map((question) => ({ question, answer: 'RASCUNHO: responder em até 3 frases.' })),
      sources: [{ title: '[FONTE: título]', url: 'https://[preencher-url-da-fonte]' }],
    },
    context: ctx,
  })
  ids[post.slug] = doc.id
  payload.logger.info(`Rascunho criado: ${post.slug}`)
}

// "Leia também" depois que todos existem
for (const post of posts) {
  await payload.update({
    collection: 'posts',
    id: ids[post.slug],
    draft: true,
    data: { related: post.related.map((s) => ids[s]).filter(Boolean) as number[] },
    context: ctx,
  })
}

// Glossário (rascunho)
for (const term of glossary) {
  if (await findBySlug('glossary', term.slug)) continue
  await payload.create({
    collection: 'glossary',
    draft: true,
    data: {
      _status: 'draft',
      term: term.term,
      slug: term.slug,
      definition: term.definition,
      relatedPost: term.post ? (ids[term.post] as number) : undefined,
    },
    context: ctx,
  })
}
payload.logger.info(`Glossário: ${glossary.length} termos conferidos`)

// Modelo de pesquisa (rascunho)
if (!(await findBySlug('datasets', dataset.slug))) {
  await payload.create({ collection: 'datasets', draft: true, data: { _status: 'draft', ...dataset }, context: ctx })
  payload.logger.info('Modelo de pesquisa criado em Dados Nexis')
}

payload.logger.info('Seed concluído. Tudo foi criado como rascunho.')
process.exit(0)
