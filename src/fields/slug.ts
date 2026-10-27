import type { TextField } from 'payload'

import { RESERVED_SLUGS } from '@/lib/taxonomy'
import { slugify } from '@/lib/text'

// Slug gerado do campo de origem (normalmente o título) quando vazio; continua editável e único.
export const slugField = (source = 'title', opts: { checkReserved?: boolean } = {}): TextField => ({
  name: 'slug',
  label: 'Slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Endereço da página. Gerado do título; sem acento, sem data. Evite mudar depois de publicado.',
  },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const from = siblingData?.[source]
        return typeof from === 'string' && from ? slugify(from) : value
      },
    ],
  },
  validate: (value: string | null | undefined) => {
    if (!value) return 'Informe o slug (ou preencha o título).'
    if (opts.checkReserved && RESERVED_SLUGS.includes(value))
      return `"${value}" é um endereço reservado do blog. Escolha outro slug.`
    return true
  },
})
