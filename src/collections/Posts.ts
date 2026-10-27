import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, Field } from 'payload'
import { APIError } from 'payload'

import { canPublish, loggedIn, ownOrEditor, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { GLOBAL_PATHS, revalidatePaths } from '@/hooks/revalidate'
import { categoryOptions, splitSubcategory, subcategoryOptions } from '@/lib/taxonomy'
import { countWords, readingTimeFromLexical } from '@/lib/text'

const pathsFor = (doc: { slug?: string | null; category?: string | null; subcategory?: string | null; author?: unknown }) => {
  const { category, sub } = splitSubcategory(doc.subcategory)
  return [
    ...GLOBAL_PATHS,
    doc.slug ? `/${doc.slug}` : '',
    doc.category ? `/${doc.category}` : '',
    category && sub ? `/${category}/${sub}` : '',
    '/autores',
  ].filter(Boolean)
}

const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  // Só mexe no site quando a versão publicada muda (publicar, atualizar publicado ou despublicar).
  if (doc._status === 'published' || previousDoc?._status === 'published') {
    revalidatePaths([...pathsFor(doc), ...(previousDoc?.slug !== doc.slug ? pathsFor(previousDoc || {}) : [])], req)
  }
  return doc
}

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidatePaths(pathsFor(doc), req)
  return doc
}

const editorialHelp = (text: string) => ({ description: text })

export const postFields: Field[] = [
  {
    name: 'title',
    label: 'Título',
    type: 'text',
    required: true,
    maxLength: 70,
    admin: {
      ...editorialHelp('Até 70 caracteres. De preferência uma pergunta (ex.: "O que é falso positivo no e-commerce?").'),
      components: { afterInput: ['@/components/admin/CharCounter#CharCounter'] },
    },
  },
  {
    name: 'subtitle',
    label: 'Linha fina',
    type: 'text',
    maxLength: 160,
    admin: editorialHelp('Frase curta abaixo do título que complementa a promessa do artigo.'),
  },
  {
    name: 'description',
    label: 'Descrição (SEO)',
    type: 'textarea',
    required: true,
    maxLength: 155,
    admin: {
      ...editorialHelp('Até 155 caracteres, com a palavra-chave e a resposta. Aparece no Google e nas prévias de link.'),
      components: { afterInput: ['@/components/admin/CharCounter#CharCounter'] },
    },
  },
  {
    name: 'tldr',
    label: 'Resposta rápida',
    type: 'textarea',
    required: true,
    admin: {
      ...editorialHelp(
        'De 40 a 60 palavras. A frase que uma IA pode copiar sozinha e continuar correta. Responda a pergunta do título logo na primeira frase.',
      ),
      components: { afterInput: ['@/components/admin/CharCounter#WordCounter'] },
    },
    validate: (value: string | null | undefined) => {
      const words = countWords(value)
      if (!value) return 'A resposta rápida é obrigatória.'
      if (words < 40 || words > 60) return `A resposta rápida deve ter de 40 a 60 palavras (agora: ${words}).`
      return true
    },
  },
  {
    name: 'content',
    label: 'Corpo',
    type: 'richText',
    required: true,
    admin: editorialHelp(
      'Use H2 em forma de pergunta e responda na primeira frase depois de cada H2. Comparações sempre em tabela. Todo número com link para a fonte e mês/ano.',
    ),
  },
  {
    name: 'faq',
    label: 'Perguntas frequentes',
    type: 'array',
    labels: { singular: 'Pergunta', plural: 'Perguntas' },
    admin: editorialHelp('Alimenta o FAQ visível no fim do artigo e o schema FAQPage. Respostas de até 3 frases.'),
    fields: [
      { name: 'question', label: 'Pergunta', type: 'text', required: true },
      { name: 'answer', label: 'Resposta', type: 'textarea', required: true },
    ],
  },
  {
    name: 'sources',
    label: 'Fontes',
    type: 'array',
    labels: { singular: 'Fonte', plural: 'Fontes' },
    admin: editorialHelp('Toda fonte citada no texto. Aparece na seção "Fontes" e no campo citation do schema.'),
    fields: [
      { name: 'title', label: 'Título da fonte', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'text', required: true },
    ],
  },
  // Barra lateral
  slugField('title', { checkReserved: true }),
  {
    name: 'category',
    label: 'Editoria',
    type: 'select',
    required: true,
    options: categoryOptions,
    admin: { position: 'sidebar' },
  },
  {
    name: 'subcategory',
    label: 'Subcategoria',
    type: 'select',
    required: true,
    options: subcategoryOptions,
    admin: { position: 'sidebar', description: 'Precisa pertencer à editoria escolhida.' },
    validate: (value: string | null | undefined, { siblingData }: { siblingData: { category?: string } }) => {
      if (!value) return 'Escolha a subcategoria.'
      if (splitSubcategory(value).category !== siblingData?.category)
        return 'A subcategoria não pertence à editoria escolhida.'
      return true
    },
  },
  {
    name: 'author',
    label: 'Autor',
    type: 'relationship',
    relationTo: 'authors',
    required: true,
    admin: { position: 'sidebar' },
  },
  {
    name: 'heroImage',
    label: 'Imagem de capa',
    type: 'upload',
    relationTo: 'media',
    admin: { position: 'sidebar', description: 'O texto alternativo é obrigatório no upload.' },
  },
  {
    name: 'publishedAt',
    label: 'Data de publicação',
    type: 'date',
    admin: {
      position: 'sidebar',
      date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
      description: 'Preenchida automaticamente ao publicar. Para agendar, use "Agendar publicação" no botão Publicar.',
    },
  },
  {
    name: 'dateUpdated',
    label: 'Data de atualização',
    type: 'date',
    admin: {
      position: 'sidebar',
      date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
      description: 'Atualize sempre que revisar o conteúdo. Vai para o "Atualizado em", o sitemap e o schema.',
    },
  },
  {
    name: 'readingTime',
    label: 'Tempo de leitura (min)',
    type: 'number',
    admin: { position: 'sidebar', readOnly: true, description: 'Calculado do corpo ao salvar.' },
  },
  {
    name: 'cta',
    label: 'CTA',
    type: 'select',
    defaultValue: 'modo-sombra',
    options: [
      { label: 'Modo Sombra', value: 'modo-sombra' },
      { label: 'Calculadora', value: 'calculadora' },
      { label: 'Contato', value: 'contato' },
    ],
    admin: { position: 'sidebar' },
  },
  {
    name: 'related',
    label: 'Leia também',
    type: 'relationship',
    relationTo: 'posts',
    hasMany: true,
    maxRows: 3,
    filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    admin: { position: 'sidebar', description: 'Escolha 3 artigos para o bloco "Leia também".' },
  },
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    access: { update: () => false },
    admin: { position: 'sidebar', readOnly: true, condition: (data) => Boolean(data?.createdBy) },
    label: 'Criado por',
  },
]

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Artigo', plural: 'Artigos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', '_status', 'publishedAt', 'updatedAt'],
    group: 'Conteúdo',
    description:
      'Regras: resposta primeiro · números com fonte e data · tabelas em comparações · links internos para o glossário · frase de entidade fixa da Nexis. Detalhes em CONTRIBUTING.md.',
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/next/preview?collection=posts&slug=${data?.slug || ''}`,
    },
    preview: (data) =>
      `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/next/preview?collection=posts&slug=${data?.slug || ''}`,
    components: {
      edit: { PublishButton: '@/components/admin/RolePublishButton#RolePublishButton' },
    },
  },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: ownOrEditor,
    delete: ownOrEditor,
    readVersions: loggedIn,
  },
  versions: {
    drafts: { autosave: { interval: 2000 }, schedulePublish: true },
    maxPerDoc: 50,
  },
  fields: postFields,
  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        const publishing = data._status === 'published'
        // Redator nunca publica (nem por agendamento, que roda com o usuário que agendou).
        if (publishing && req.user && !canPublish(req.user))
          throw new APIError('Redatores não podem publicar. Salve o rascunho e peça a um editor.', 403, undefined, true)
        if (operation === 'create' && req.user && !data.createdBy) data.createdBy = req.user.id
        if (data.content) data.readingTime = readingTimeFromLexical(data.content)
        if (publishing) {
          const now = new Date().toISOString()
          if (!data.publishedAt && !originalDoc?.publishedAt) data.publishedAt = now
          if (!data.dateUpdated) data.dateUpdated = data.publishedAt || originalDoc?.publishedAt || now
        }
        return data
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
