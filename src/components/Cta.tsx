import Link from 'next/link'

import { CTA_LINKS } from '@/lib/site'

type CtaKind = 'modo-sombra' | 'calculadora' | 'contato'

const COPY: Record<CtaKind, { title: string; text: string; button: string }> = {
  'modo-sombra': {
    title: 'Quanto o seu antifraude está recusando de venda boa?',
    text: 'No Modo Sombra, a Nexis analisa as mesmas transações que o seu antifraude atual, sem interferir no checkout, e mostra em R$ o que poderia ter sido aprovado.',
    button: 'Testar o Modo Sombra',
  },
  calculadora: {
    title: 'Calcule quanto a sua loja perde com venda boa bloqueada',
    text: 'Coloque seus números e veja uma estimativa da receita recusada por falso positivo.',
    button: 'Abrir a calculadora',
  },
  contato: {
    title: 'Quer entender como isso se aplica à sua loja?',
    text: 'Fale com o time da Nexis e veja os números do seu e-commerce.',
    button: 'Falar com a Nexis',
  },
}

export const Cta = ({ kind = 'modo-sombra', variant = 'inline' }: { kind?: CtaKind | null; variant?: 'inline' | 'final' }) => {
  const k = (kind || 'modo-sombra') as CtaKind
  const copy = COPY[k]
  const href = CTA_LINKS[k]
  return (
    <aside className={`cta cta-${variant}`} aria-label="Chamada da Nexis">
      <p className="cta-title">{copy.title}</p>
      <p>{copy.text}</p>
      {href.startsWith('/') ? (
        <Link className="btn" href={href}>
          {copy.button}
        </Link>
      ) : (
        <a className="btn" href={href}>
          {copy.button}
        </a>
      )}
    </aside>
  )
}

export const CtaModoSombra = () => <Cta kind="modo-sombra" />
