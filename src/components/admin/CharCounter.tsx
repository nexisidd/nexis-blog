'use client'

import { useFormFields } from '@payloadcms/ui'

type Props = { path: string; field?: { maxLength?: number } }

const style = (bad: boolean): React.CSSProperties => ({
  fontSize: 12,
  marginTop: 4,
  color: bad ? 'var(--theme-error-500)' : 'var(--theme-elevation-500)',
})

export const CharCounter = ({ path, field }: Props) => {
  const value = useFormFields(([fields]) => fields[path]?.value) as string | undefined
  const length = (value || '').length
  const max = field?.maxLength
  return <div style={style(Boolean(max && length > max))}>{max ? `${length}/${max} caracteres` : `${length} caracteres`}</div>
}

export const WordCounter = ({ path }: Props) => {
  const value = useFormFields(([fields]) => fields[path]?.value) as string | undefined
  const words = (value || '').trim().split(/\s+/).filter(Boolean).length
  return <div style={style(words > 0 && (words < 40 || words > 60))}>{words} palavras (meta: 40 a 60)</div>
}
