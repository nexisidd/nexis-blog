import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container section narrow">
      <h1>Página não encontrada</h1>
      <p>
        O endereço pode ter mudado. Volte para a <Link href="/">página inicial do blog</Link> ou consulte o{' '}
        <Link href="/glossario">glossário</Link>.
      </p>
    </div>
  )
}
