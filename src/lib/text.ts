export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export const countWords = (value?: string | null) =>
  (value || '').trim().split(/\s+/).filter(Boolean).length

type LexicalNode = { type?: string; text?: string; tag?: string; children?: LexicalNode[] }

export const lexicalToPlainText = (node?: LexicalNode | null): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  const sep = ['paragraph', 'heading', 'listitem', 'tablecell', 'quote'].includes(node.type || '') ? '\n' : ''
  return (node.children || []).map(lexicalToPlainText).join('') + sep
}

export const readingTimeFromLexical = (root?: { root?: LexicalNode } | null) =>
  Math.max(1, Math.round(countWords(lexicalToPlainText(root?.root)) / 200))

export type TocItem = { id: string; text: string }

// Lista os H2 do corpo, na ordem, com o id usado como âncora no sumário.
export const extractH2 = (root?: { root?: LexicalNode } | null): TocItem[] =>
  (root?.root?.children || [])
    .filter((n) => n.type === 'heading' && n.tag === 'h2')
    .map((n) => {
      const text = lexicalToPlainText(n).trim()
      return { id: slugify(text), text }
    })

export const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(
        new Date(value),
      )
    : ''
