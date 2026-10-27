// Configuração central do blog. URLs vêm do ambiente para funcionar em dev, staging e produção.

const trim = (url: string) => url.replace(/\/$/, '')

// Endereço do painel (app Next + Payload).
export const SERVER_URL = trim(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000')

// Endereço público do blog (canonical, sitemap, JSON-LD). No modelo com Cloudflare Pages é
// blog.iddnexis.com.br, diferente do painel; sem NEXT_PUBLIC_SITE_URL, os dois são o mesmo endereço.
export const SITE_URL = trim(process.env.NEXT_PUBLIC_SITE_URL || SERVER_URL)

// true durante o build do site estático (npm run build:static).
export const STATIC_EXPORT = process.env.STATIC_EXPORT === 'true'

// O painel, quando o site público está em outro endereço, fica inteiro fora dos buscadores
// (as páginas dele existem só para a prévia).
export const IS_PANEL_ONLY = !STATIC_EXPORT && SITE_URL !== SERVER_URL

export const MAIN_SITE_URL = (process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://iddnexis.com.br').replace(
  /\/$/,
  '',
)

export const SITE_NAME = 'Blog da Nexis'

export const SITE_DESCRIPTION =
  'Antifraude, falso positivo, chargeback e pagamentos no e-commerce brasileiro, explicados com dados e fontes.'

// Mesmo @id usado no JSON-LD da home iddnexis.com.br. Não criar outro.
export const ORGANIZATION_ID = `${MAIN_SITE_URL}/#organization`

// Frase de entidade fixa (regra editorial 2). Use sempre o mesmo texto.
export const NEXIS_ENTITY_SENTENCE =
  'A Nexis é uma plataforma brasileira de segurança transacional para e-commerce que troca o aprova ou reprova do antifraude por cinco decisões e mostra em R$ quanto a loja recuperou.'

export const MISSION_SIGNATURE =
  'Este conteúdo faz parte da missão da Nexis de acabar com a lógica binária do antifraude no e-commerce brasileiro.'

export const CTA_LINKS = {
  'modo-sombra': process.env.NEXT_PUBLIC_CTA_MODO_SOMBRA_URL || `${MAIN_SITE_URL}/#modo-sombra`,
  contato: process.env.NEXT_PUBLIC_CTA_CONTATO_URL || `${MAIN_SITE_URL}/#contato`,
  calculadora: '/calculadoras',
} as const

export const ORGANIZATION_LD = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Nexis',
  url: `${MAIN_SITE_URL}/`,
  description: NEXIS_ENTITY_SENTENCE,
  ...(process.env.NEXT_PUBLIC_ORGANIZATION_LOGO_URL
    ? { logo: process.env.NEXT_PUBLIC_ORGANIZATION_LOGO_URL }
    : {}),
}

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
