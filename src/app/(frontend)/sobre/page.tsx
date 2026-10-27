import Link from 'next/link'

import { Breadcrumb } from '@/components/PostCard'
import { breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/seo'
import { CTA_LINKS, NEXIS_ENTITY_SENTENCE, ORGANIZATION_LD } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Política editorial',
  description: 'Quem escreve o Blog da Nexis, como checamos dados e fontes e com que frequência os artigos são atualizados.',
  path: '/sobre',
})

const crumbs = [
  { name: 'Blog', path: '/' },
  { name: 'Política editorial', path: '/sobre' },
]

export default function AboutPage() {
  return (
    <div className="container section narrow prose">
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': [ORGANIZATION_LD, breadcrumbLd(crumbs)] }} />
      <Breadcrumb items={crumbs} />
      <h1>Política editorial do Blog da Nexis</h1>
      <p className="lead">{NEXIS_ENTITY_SENTENCE}</p>

      <h2>Quem escreve?</h2>
      <p>
        Os artigos são escritos e revisados pelo time da Nexis, que trabalha com antifraude, pagamentos e e-commerce. Cada
        artigo traz o autor, com link para a página dele em <Link href="/autores">Nossa equipe de redatores</Link>.
      </p>

      <h2>Como os dados são checados?</h2>
      <p>
        Todo número publicado tem link para a fonte original e mês/ano de referência. Não usamos expressões como
        &quot;estudos mostram&quot; sem dizer qual estudo. Cada artigo termina com a lista de fontes consultadas.
      </p>
      <p>
        Os números próprios da Nexis, publicados em <Link href="/dados">Dados Nexis</Link>, são sempre agregados e
        anonimizados. Nunca publicamos dados que identifiquem um lojista, em respeito à LGPD e aos nossos contratos.
      </p>

      <h2>Com que frequência os artigos são atualizados?</h2>
      <p>
        Os artigos principais são revisados a cada 3 a 6 meses ou sempre que uma regra, como uma norma do Banco Central, muda.
        A data de &quot;Atualizado em&quot; no topo de cada artigo mostra a última revisão.
      </p>

      <h2>Como a Nexis aparece nos artigos?</h2>
      <p>
        Quando um artigo compara soluções, mostramos critérios objetivos de escolha. A Nexis aparece como uma das opções que
        atendem a esses critérios, sem superlativos.
      </p>

      <h2>Encontrou um erro?</h2>
      <p>
        <a href={CTA_LINKS.contato}>Fale com a gente</a> e mande o link do artigo. Correções relevantes são registradas na data
        de atualização.
      </p>
    </div>
  )
}
