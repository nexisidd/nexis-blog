import { IS_PANEL_ONLY, SITE_URL } from '@/lib/site'

// Busca e robôs de IA liberados de propósito: a Nexis quer ser lida, citada e conhecida pelos modelos.
// Só o painel e a API ficam de fora.
const AGENTS = [
  '*',
  // Busca e citação em assistentes
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  // Treinamento de modelos (liberado de propósito)
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
]

export const dynamic = 'force-static'

export function GET() {
  // O painel (quando o site público está no Cloudflare Pages) não deve ser indexado.
  if (IS_PANEL_ONLY)
    return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  const groups = AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /next/`)
  const body = `${groups.join('\n\n')}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
