import type { CollectionConfig } from 'payload'

import { editorsAndAdmins, loggedIn } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídia' },
  admin: { group: 'Conteúdo' },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: editorsAndAdmins,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: { description: 'Descreva o que a imagem mostra (para leitores de tela e buscadores).' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'card', width: 640, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1280, formatOptions: { format: 'webp', options: { quality: 82 } } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
    adminThumbnail: 'card',
  },
}
