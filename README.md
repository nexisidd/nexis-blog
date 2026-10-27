# Blog da Nexis

Blog em `https://blog.iddnexis.com.br`, feito para ser lido por pessoas e citado por assistentes de IA. Stack: Next.js 16 (App Router) + Payload CMS 3, Postgres no Neon, site público no Cloudflare Pages, painel no Render e imagens no Cloudflare R2.

- **Quem escreve:** veja [COMO-PUBLICAR.md](COMO-PUBLICAR.md) e as regras editoriais em [CONTRIBUTING.md](CONTRIBUTING.md).
- **Painel:** `/admin` (e-mail e senha; perfis Admin, Editor e Redator).

## Rotas

| Rota | Conteúdo |
|---|---|
| `/` | Home: destaque, últimos artigos, artigos por editoria, calculadora, CTA do Modo Sombra |
| `/<slug>` | Artigo (ou página da editoria, quando o slug é uma editoria) |
| `/<editoria>` e `/<editoria>/<subcategoria>` | Listagens. `/dados` também mostra as pesquisas (schema `Dataset`) |
| `/glossario` | Glossário com âncora por termo (schema `DefinedTermSet`) |
| `/calculadoras` | Calculadora de venda boa bloqueada |
| `/autores` e `/autores/<slug>` | Equipe de redatores e página de cada autor |
| `/sobre` | Política editorial |
| `/robots.txt`, `/sitemap.xml`, `/rss.xml`, `/llms.txt` | Arquivos para buscadores e IAs |
| `/admin`, `/api` | Painel e API do Payload (só no painel, `noindex`) |
| `/next/preview` | Ativa a prévia de rascunhos (só no painel, para quem está logado) |

As páginas públicas saem como HTML completo, sem depender de JavaScript: no site estático (Cloudflare Pages) e também no painel, onde servem para a prévia.

## Desenvolvimento

Requer Node 24.22.1 ou mais novo (ver `.nvmrc`) e um Postgres. Use uma **branch de desenvolvimento do Neon**, nunca o banco de produção.

```bash
cp .env.example .env   # preencha DATABASE_URI e PAYLOAD_SECRET
npm install
npm run migrate        # cria as tabelas
SEED_ADMIN_EMAIL=voce@iddnexis.com.br SEED_ADMIN_PASSWORD='SuaSenha123' npm run seed
npm run dev            # http://localhost:3000 e http://localhost:3000/admin
```

O seed cria, **como rascunho**, os 12 artigos-pilar com títulos, descrições, H2, tabelas e FAQ, os 15 termos do glossário, o modelo de pesquisa de Dados Nexis e o autor `caique-borges`. Ele é idempotente: o que já existe não é alterado.

### Mudou o schema (campos, coleções)?

```bash
npm run migrate:create -- nome-da-mudanca   # gera o arquivo em src/migrations
npm run generate:types                      # atualiza src/payload-types.ts
```

Faça commit da migração. No deploy, o Render roda `npm run migrate` antes do build, e o servidor também aplica as migrações pendentes ao subir (`prodMigrations`).

## Deploy

O site público é HTML estático no **Cloudflare Pages** (nunca desliga). O painel roda no **Render** (plano grátis, pode hibernar). Passo a passo completo em [DEPLOY.md](DEPLOY.md).

- `npm run build`: painel (Payload + páginas para a prévia). Com `NEXT_PUBLIC_SITE_URL` diferente de `NEXT_PUBLIC_SERVER_URL`, o painel inteiro fica com `noindex` e o `robots.txt` dele bloqueia tudo.
- `npm run build:static`: site público em `out/`, só com páginas publicadas (lê o banco no build).
- Ao publicar, despublicar ou apagar conteúdo, o painel agenda a tarefa `deploySite`. Ela espera 1 minuto, junta as mudanças e chama o Deploy Hook do Pages (`PAGES_DEPLOY_HOOK_URL`).
- Publicação agendada e convites rodam na fila de jobs do painel. Como o painel grátis dorme, a ação `.github/workflows/processar-agendamentos.yml` o acorda de hora em hora e chama `/api/payload-jobs/run` com `CRON_SECRET`.

### E-mail

Convites e "esqueci minha senha" usam SMTP (`SMTP_HOST` etc.). Funciona com Resend, Amazon SES, Google Workspace ou outro provedor. Sem SMTP, os e-mails só aparecem no log do servidor.

### Backup e restauração (Neon)

O Neon guarda o histórico do banco e permite restaurar para qualquer momento dentro da janela de retenção, que depende do plano. Confira e ajuste a janela nas configurações do projeto no Neon (restore window / history retention).

Para restaurar:

1. Teste primeiro: no console do Neon, abra **Branches › Create branch**, escolha **Past data** e o horário desejado. Aponte uma cópia do blog para essa branch e confira o conteúdo.
2. Para valer: na branch `main`, use **Restore** com o mesmo horário. O Neon guarda o estado anterior em uma branch de backup.

Para ter um backup fora do Neon, rode periodicamente: `pg_dump "$DATABASE_URI" > backup.sql`. As imagens ficam no R2, separadas do banco.

## Depois do deploy (manual)

- Enviar `https://blog.iddnexis.com.br/sitemap.xml` no Google Search Console e no Bing Webmaster Tools.
- Testar artigos no [Teste de pesquisa aprimorada do Google](https://search.google.com/test/rich-results).
- Se o DNS passa pela Cloudflare: em Security › Bots, deixar **desligado** o "Block AI bots" (ou "AI Scrapers and Crawlers"), que anula o `robots.txt`.
- Uma vez por mês, perguntar a ChatGPT, Perplexity, Claude e Gemini "qual o melhor antifraude para e-commerce no Brasil?" e "o que é falso positivo no antifraude?", e registrar se a Nexis aparece e com qual link.
