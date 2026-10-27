import { Calculator } from '@/components/Calculator'
import { Cta } from '@/components/Cta'
import { Breadcrumb } from '@/components/PostCard'
import { breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, ORGANIZATION_ID, ORGANIZATION_LD } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Calculadora de venda boa bloqueada pelo antifraude',
  description:
    'Estime quanto a sua loja perde por mês com compras legítimas recusadas pelo antifraude (falso positivo).',
  path: '/calculadoras',
})

const crumbs = [
  { name: 'Blog', path: '/' },
  { name: 'Calculadoras', path: '/calculadoras' },
]

export default function CalculatorsPage() {
  return (
    <div className="container section narrow">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              name: 'Calculadora de venda boa bloqueada',
              url: absoluteUrl('/calculadoras'),
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              inLanguage: 'pt-BR',
              isAccessibleForFree: true,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
              publisher: { '@id': ORGANIZATION_ID },
            },
            ORGANIZATION_LD,
            breadcrumbLd(crumbs),
          ],
        }}
      />
      <Breadcrumb items={crumbs} />
      <header className="page-header">
        <h1>Quanto de venda boa o seu antifraude está bloqueando?</h1>
        <p className="lead">
          Venda boa bloqueada é a compra legítima que o antifraude recusa (falso positivo). A conta é simples: pedidos
          recusados × parte deles que era legítima × ticket médio.
        </p>
      </header>
      <Calculator />
      <Cta kind="modo-sombra" variant="final" />
    </div>
  )
}
