// Editorias e subcategorias fixas (seção 2 do briefing). Mudar aqui muda o menu, os selects do painel e as rotas.

export type Subcategory = { slug: string; label: string }
export type Category = { slug: string; label: string; description: string; subcategories: Subcategory[] }

export const CATEGORIES: Category[] = [
  {
    slug: 'antifraude',
    label: 'Antifraude',
    description: 'Falso positivo, chargeback, fraude em cartão e como decidir melhor cada transação.',
    subcategories: [
      { slug: 'falso-positivo', label: 'Falso positivo' },
      { slug: 'chargeback', label: 'Chargeback' },
      { slug: 'fraude-em-cartao', label: 'Fraude em cartão' },
      { slug: 'autofraude', label: 'Autofraude' },
      { slug: 'analise-manual', label: 'Análise manual' },
    ],
  },
  {
    slug: 'pagamentos',
    label: 'Pagamentos',
    description: 'Cartão, Pix, 3DS, adquirência e orquestração de pagamentos no e-commerce.',
    subcategories: [
      { slug: 'cartao-de-credito', label: 'Cartão de crédito' },
      { slug: 'pix', label: 'Pix' },
      { slug: '3ds', label: '3DS' },
      { slug: 'gateways-e-adquirencia', label: 'Gateways e adquirência' },
      { slug: 'orquestracao', label: 'Orquestração' },
    ],
  },
  {
    slug: 'regulacao',
    label: 'Regulação',
    description: 'Regras do Banco Central para o Pix, LGPD e PCI DSS aplicadas ao e-commerce.',
    subcategories: [
      { slug: 'pix-e-banco-central', label: 'Pix e Banco Central (MED, Res. 587)' },
      { slug: 'lgpd', label: 'LGPD' },
      { slug: 'pci-dss', label: 'PCI DSS' },
    ],
  },
  {
    slug: 'e-commerce',
    label: 'E-commerce',
    description: 'Conversão, plataformas e datas sazonais do varejo online.',
    subcategories: [
      { slug: 'conversao', label: 'Conversão' },
      { slug: 'shopify', label: 'Shopify' },
      { slug: 'vtex', label: 'VTEX' },
      { slug: 'nuvemshop', label: 'Nuvemshop' },
      { slug: 'black-friday', label: 'Black Friday' },
    ],
  },
  {
    slug: 'dados',
    label: 'Dados Nexis',
    description: 'Pesquisas e números próprios da Nexis sobre o mercado, sempre agregados e anonimizados.',
    subcategories: [{ slug: 'pesquisas', label: 'Pesquisas e números' }],
  },
  {
    slug: 'nexis',
    label: 'Nexis',
    description: 'Produto, Modo Sombra, cases e novidades da Nexis.',
    subcategories: [
      { slug: 'produto', label: 'Produto' },
      { slug: 'modo-sombra', label: 'Modo Sombra' },
      { slug: 'cases', label: 'Cases' },
      { slug: 'novidades', label: 'Novidades' },
    ],
  },
]

export const getCategory = (slug?: string | null) => CATEGORIES.find((c) => c.slug === slug)

export const getSubcategory = (categorySlug?: string | null, subSlug?: string | null) =>
  getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug)

// Caminhos de primeiro nível que não podem virar slug de artigo.
export const RESERVED_SLUGS = [
  ...CATEGORIES.map((c) => c.slug),
  'admin',
  'api',
  'next',
  'glossario',
  'calculadoras',
  'autores',
  'sobre',
  'busca',
  'rss.xml',
  'sitemap.xml',
  'robots.txt',
  'llms.txt',
]

export const categoryOptions = CATEGORIES.map((c) => ({ label: c.label, value: c.slug }))

// O select de subcategoria guarda "editoria/subcategoria" para não haver ambiguidade entre editorias.
export const subcategoryOptions = CATEGORIES.flatMap((c) =>
  c.subcategories.map((s) => ({ label: `${c.label} › ${s.label}`, value: `${c.slug}/${s.slug}` })),
)

export const splitSubcategory = (value?: string | null) => {
  const [category, sub] = (value || '').split('/')
  return { category, sub }
}
