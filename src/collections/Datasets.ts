import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { canPublish, editorsAndAdmins, loggedIn, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { onSiteChange } from '@/hooks/revalidate'

export const Datasets: CollectionConfig = {
  slug: 'datasets',
  labels: { singular: 'Pesquisa', plural: 'Dados Nexis' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'period', '_status'],
    group: 'Conteúdo',
    description:
      'Números próprios da Nexis, sempre agregados e anonimizados. Nunca publique dado que identifique um lojista (LGPD e contrato).',
  },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: editorsAndAdmins,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    slugField('title'),
    {
      name: 'summary',
      label: 'Resumo',
      type: 'textarea',
      required: true,
      admin: { description: 'O principal achado em 1 a 2 frases, com o número.' },
    },
    { name: 'period', label: 'Período', type: 'text', required: true, admin: { description: 'Ex.: jan–set/2026' } },
    {
      name: 'methodology',
      label: 'Metodologia',
      type: 'textarea',
      required: true,
      admin: { description: 'Amostra, critérios, como os dados foram agregados e anonimizados.' },
    },
    {
      name: 'figures',
      label: 'Números',
      type: 'array',
      labels: { singular: 'Número', plural: 'Números' },
      fields: [
        { name: 'label', label: 'Rótulo', type: 'text', required: true },
        { name: 'value', label: 'Valor', type: 'text', required: true },
        { name: 'unit', label: 'Unidade', type: 'text', admin: { description: 'Ex.: %, R$, pedidos' } },
      ],
    },
    { name: 'body', label: 'Texto', type: 'richText' },
    {
      name: 'publishedAt',
      label: 'Data de publicação',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (data._status === 'published' && req.user && !canPublish(req.user))
          throw new APIError('Redatores não podem publicar. Peça a um editor.', 403, undefined, true)
        if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Rascunhos (inclusive o autosave) não mexem no site.
        if (doc._status === 'published' || previousDoc?._status === 'published')
          await onSiteChange(['/dados', '/sitemap.xml', '/llms.txt'], req, `pesquisa ${doc.slug}`)
        return doc
      },
    ],
  },
}
