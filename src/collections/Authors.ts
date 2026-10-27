import type { CollectionConfig } from 'payload'

import { editorsAndAdmins } from '@/access'
import { slugField } from '@/fields/slug'
import { onSiteChange } from '@/hooks/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Autor', plural: 'Autores' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'jobTitle', 'slug'], group: 'Conteúdo' },
  access: {
    read: () => true,
    create: editorsAndAdmins,
    update: editorsAndAdmins,
    delete: editorsAndAdmins,
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    slugField('name'),
    { name: 'jobTitle', label: 'Cargo', type: 'text', required: true },
    { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
    {
      name: 'bio',
      label: 'Bio curta',
      type: 'textarea',
      required: true,
      admin: { description: 'Experiência e por que essa pessoa entende do assunto. Aparece na página do autor.' },
    },
    { name: 'linkedin', label: 'LinkedIn (URL)', type: 'text' },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        await onSiteChange(['/autores', `/autores/${doc.slug}`, '/sitemap.xml'], req, `autor ${doc.slug}`)
        return doc
      },
    ],
  },
}
