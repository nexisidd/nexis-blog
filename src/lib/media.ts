import type { Media } from '@/payload-types'

import { absoluteUrl } from './site'

export const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value ? (value as Media) : null

type Size = 'card' | 'hero' | 'og'

export const mediaSize = (media: Media, size?: Size) => {
  const s = size ? media.sizes?.[size] : undefined
  if (s?.url) return { url: s.url, width: s.width || undefined, height: s.height || undefined }
  return { url: media.url || '', width: media.width || undefined, height: media.height || undefined }
}

export const absoluteMediaUrl = (url?: string | null) =>
  !url ? undefined : url.startsWith('http') ? url : absoluteUrl(url)
