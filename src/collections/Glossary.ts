import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { canPublish, editorsAndAdmins, loggedIn, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { onSiteChange } from '@/hooks/revalidate'

export const Glossary: CollectionConfig = {
  slug: 'glossary',
  labels: { singular: 'Termo', plural: 'Glossário' },
  admin: { useAsTitle: 'term', defaultColumns: ['term', 'slug', '_status'], group: 'Conteúdo' },
  defaultSort: 'term',
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: editorsAndAdmins,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'term', label: 'Termo', type: 'text', required: true },
    slugField('term'),
    {
      name: 'definition',
      label: 'Definição curta',
      type: 'textarea',
      required: true,
      admin: { description: '1 a 2 frases. A primeira frase precisa definir o termo sozinha.' },
    },
    {
      name: 'relatedPost',
      label: 'Artigo relacionado',
      type: 'relationship',
      relationTo: 'posts',
      admin: { description: 'Artigo-pilar que aprofunda o termo.' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (data._status === 'published' && req.user && !canPublish(req.user))
          throw new APIError('Redatores não podem publicar. Peça a um editor.', 403, undefined, true)
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Rascunhos (inclusive o autosave) não mexem no site.
        if (doc._status === 'published' || previousDoc?._status === 'published')
          await onSiteChange(['/glossario', '/sitemap.xml', '/llms.txt'], req, `termo ${doc.slug}`)
        return doc
      },
    ],
  },
}
