import type { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'

import { lexicalToPlainText, slugify } from '@/lib/text'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc
  if (!doc || typeof doc.value !== 'object') return '#'
  const slug = (doc.value as { slug?: string }).slug
  if (doc.relationTo === 'glossary') return `/glossario#${slug}`
  return `/${slug}`
}

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag as 'h2' | 'h3' | 'h4'
    const children = nodesToJSX({ nodes: node.children })
    // H2 recebem id para o sumário com âncoras.
    if (Tag === 'h2') return <h2 id={slugify(lexicalToPlainText(node as never).trim())}>{children}</h2>
    return <Tag>{children}</Tag>
  },
  table: (args) => {
    const Table = defaultConverters.table as (a: typeof args) => React.ReactNode
    return <div className="table-wrap">{Table(args)}</div>
  },
})

export const RichText = ({ data, className }: { data: SerializedEditorState; className?: string }) => (
  <LexicalRichText data={data} converters={converters} className={className} />
)
