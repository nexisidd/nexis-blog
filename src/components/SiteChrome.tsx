import Link from 'next/link'

import { CATEGORIES } from '@/lib/taxonomy'
import { MAIN_SITE_URL, MISSION_SIGNATURE } from '@/lib/site'

export const Header = () => (
  <header className="site-header">
    <div className="container header-inner">
      <Link href="/" className="brand" aria-label="Blog da Nexis, página inicial">
        <span className="brand-mark">Nexis</span>
        <span className="brand-sub">Blog</span>
      </Link>
      <nav aria-label="Editorias" className="main-nav">
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="nav-item">
              <Link href={`/${c.slug}`}>{c.label}</Link>
              <ul className="nav-sub">
                {c.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/${c.slug}/${s.slug}`}>{s.label}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="nav-item">
            <Link href="/glossario">Glossário</Link>
          </li>
          <li className="nav-item">
            <Link href="/calculadoras">Calculadoras</Link>
          </li>
        </ul>
      </nav>
      <a className="btn btn-small" href={MAIN_SITE_URL}>
        Conheça a Nexis
      </a>
    </div>
  </header>
)

export const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div>
        <p className="brand-mark">Nexis</p>
        <p className="muted">{MISSION_SIGNATURE}</p>
      </div>
      <nav aria-label="Editorias no rodapé">
        <p className="footer-title">Editorias</p>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/${c.slug}`}>{c.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="Institucional">
        <p className="footer-title">Blog</p>
        <ul>
          <li>
            <Link href="/glossario">Glossário</Link>
          </li>
          <li>
            <Link href="/calculadoras">Calculadoras</Link>
          </li>
          <li>
            <Link href="/autores">Nossa equipe de redatores</Link>
          </li>
          <li>
            <Link href="/sobre">Política editorial</Link>
          </li>
          <li>
            <a href="/rss.xml">RSS</a>
          </li>
          <li>
            <a href={MAIN_SITE_URL}>iddnexis.com.br</a>
          </li>
        </ul>
      </nav>
    </div>
    <div className="container muted small">© {new Date().getFullYear()} Nexis</div>
  </footer>
)
