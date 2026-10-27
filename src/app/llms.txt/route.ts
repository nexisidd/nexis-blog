import { getDatasets, getGlossary, getPosts } from '@/lib/queries'
import { absoluteUrl, MAIN_SITE_URL, NEXIS_ENTITY_SENTENCE, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import { CATEGORIES } from '@/lib/taxonomy'

export const revalidate = 3600

// llms.txt: complemento de baixo custo. Lista as páginas-pilar, o glossário e os dados próprios.
export async function GET() {
  const [{ docs: posts }, glossary, datasets] = await Promise.all([getPosts({ limit: 100 }), getGlossary(), getDatasets()])
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${NEXIS_ENTITY_SENTENCE}`,
    '',
    `${SITE_DESCRIPTION} Site principal: ${MAIN_SITE_URL}`,
    '',
    '## Artigos',
    '',
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/${p.slug}`)}): ${p.description}`),
    '',
    '## Referência',
    '',
    `- [Glossário](${absoluteUrl('/glossario')}): ${glossary.length} termos de antifraude e pagamentos com definições curtas`,
    `- [Dados Nexis](${absoluteUrl('/dados')}): números próprios, agregados e anonimizados${datasets.length ? ` (${datasets.length} pesquisas)` : ''}`,
    `- [Calculadora de venda boa bloqueada](${absoluteUrl('/calculadoras')})`,
    `- [Política editorial](${absoluteUrl('/sobre')})`,
    '',
    '## Editorias',
    '',
    ...CATEGORIES.map((c) => `- [${c.label}](${absoluteUrl(`/${c.slug}`)}): ${c.description}`),
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
