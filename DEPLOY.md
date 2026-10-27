# Como colocar o Blog da Nexis no ar (grátis)

## Como funciona

| Parte | Onde fica | Desliga? |
|---|---|---|
| **Site público** `blog.iddnexis.com.br` | Cloudflare Pages (HTML estático) | **Nunca.** Leitores e robôs de IA sempre encontram o site |
| **Painel** `/admin` | Render, plano grátis | Hiberna após 15 min sem uso e leva ~1 min para abrir. Não afeta o site |
| **Banco** | Neon, plano grátis | Não importa: o site não depende dele para responder |
| **Imagens** | Cloudflare R2, plano grátis | Nunca |

Ao clicar em **Publicar**, o painel espera 1 minuto (para juntar várias publicações seguidas) e avisa o Cloudflare, que reconstrói o site em 2 a 4 minutos. Ninguém mexe em HTML.

Ordem: Neon → R2 → Render (painel) → Cloudflare Pages (site) → ligar os dois → domínio → agendamentos.

---

## 1. Neon (banco)

1. Entre em console.neon.tech e crie um projeto (`nexis-blog`). Região: **AWS US East 2 (Ohio)**, a mesma do painel no Render (`region: ohio` no `render.yaml`).
2. Clique em **Connect** (Conectar), ative **Connection pooling** e copie a connection string. O endereço tem `-pooler` e termina com `?sslmode=require`.
3. Guarde: é o `DATABASE_URI`.

## 2. Cloudflare R2 (imagens)

1. No painel da Cloudflare: **R2 Object Storage** › **Create bucket** › nome `nexis-blog`.
2. No bucket: **Settings** › **Public access**:
   - **Custom Domains** › conecte, por exemplo, `img.iddnexis.com.br` (recomendado; exige o DNS do domínio na Cloudflare), **ou**
   - **R2.dev subdomain** › **Allow Access** (mais rápido de configurar).
   - Copie a URL pública. Ela é o `S3_PUBLIC_URL`.
3. Na página do R2: **Manage API tokens** › **Create API token** › permissão **Object Read & Write**, só no bucket `nexis-blog`. Copie:
   - **Access Key ID** › `S3_ACCESS_KEY_ID`
   - **Secret Access Key** › `S3_SECRET_ACCESS_KEY`
   - o endpoint `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` › `S3_ENDPOINT`
4. `S3_BUCKET` = `nexis-blog`.

## 3. Render (painel)

1. Libere o repositório: em render.com › **New** › **Blueprint** › **Configure account** (GitHub) › **Repository access** › adicione `nexisidd/nexis-blog` › **Save**.
2. Volte ao Render, recarregue, escolha `nexis-blog` e confirme o Blueprint. Ele cria o serviço **nexis-blog-painel** no plano **Free**.
3. Preencha as variáveis pedidas:
   - `DATABASE_URI` (passo 1)
   - `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` e `S3_PUBLIC_URL` (passo 2)
   - `PAGES_DEPLOY_HOOK_URL`: deixe em branco por enquanto (passo 5)
   - `SMTP_*`: opcional (convites por e-mail)
4. Clique em **Apply** e espere o primeiro deploy (5 a 10 min). Esse deploy já cria as tabelas e cadastra os rascunhos iniciais (`SEED_ON_BUILD=true`).
5. Copie o endereço do serviço, algo como `https://nexis-blog-painel.onrender.com`. Se for diferente, ajuste a variável `NEXT_PUBLIC_SERVER_URL` no Render (Environment) para esse endereço.
6. **Importante:** em **Environment**, apague a variável `SEED_ON_BUILD`. Sem isso, um rascunho inicial apagado volta a cada deploy.
7. Abra `https://<painel>/admin` e crie o primeiro usuário. Ele vira Admin automaticamente.

## 4. Cloudflare Pages (site público)

1. Na Cloudflare: **Workers & Pages** › **Create** › aba **Pages** › **Connect to Git** › autorize o GitHub e escolha `nexisidd/nexis-blog`.
2. Configuração do build:
   - **Production branch:** `main`
   - **Framework preset:** None
   - **Build command:** `npm run build:static`
   - **Build output directory:** `out`
3. Em **Environment variables** (Production), adicione:

   | Variável | Valor |
   |---|---|
   | `NODE_VERSION` | `24.22.1` |
   | `DATABASE_URI` | o mesmo do Render |
   | `PAYLOAD_SECRET` | o mesmo do Render (copie em Render › Environment) |
   | `NEXT_PUBLIC_SITE_URL` | `https://blog.iddnexis.com.br` |
   | `NEXT_PUBLIC_SERVER_URL` | o endereço do painel (passo 3.5) |
   | `NEXT_PUBLIC_MAIN_SITE_URL` | `https://iddnexis.com.br` |
   | `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION` (`auto`), `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL` | os mesmos do Render |

4. **Save and Deploy.** O primeiro build leva de 3 a 5 minutos. No fim, aparece um endereço `https://nexis-blog.pages.dev` (ou parecido): abra e confira.

## 5. Ligar o painel ao site

1. No projeto do Pages: **Settings** › **Builds** › **Deploy hooks** › **Add deploy hook** › nome `painel`, branch `main` › copie a URL.
2. No Render › `nexis-blog-painel` › **Environment** › `PAGES_DEPLOY_HOOK_URL` = essa URL › **Save** (o Render reinicia o painel).

A partir daqui, publicar no painel atualiza o site sozinho.

## 6. Domínio `blog.iddnexis.com.br`

1. No projeto do Pages: **Custom domains** › **Set up a custom domain** › `blog.iddnexis.com.br`.
2. Se o DNS de `iddnexis.com.br` está na Cloudflare, ela cria o registro sozinha. Se está em outro provedor, crie lá um **CNAME** `blog` › `nexis-blog.pages.dev` (o endereço do passo 4.4).
3. O HTTPS é emitido automaticamente em alguns minutos.
4. Se o DNS passa pela Cloudflare, confira em **Security** › **Bots** que o bloqueio de robôs de IA ("Block AI bots") está **desligado**. Ele anula o `robots.txt`.

## 7. Publicação agendada

O painel grátis dorme, então uma ação do GitHub o acorda de hora em hora para processar os agendamentos. Um artigo agendado entra no ar em até ~1 hora depois do horário escolhido.

1. No GitHub: `nexisidd/nexis-blog` › **Settings** › **Secrets and variables** › **Actions** › **New repository secret**:
   - `PAINEL_URL` = endereço do painel (passo 3.5), sem barra no fim
   - `CRON_SECRET` = o valor de `CRON_SECRET` em Render › Environment
2. Em **Actions** › **Processar agendamentos** › **Run workflow**, para testar. Deve terminar verde.

## 8. Conferir

- `https://blog.iddnexis.com.br/robots.txt`: lista os robôs de IA com `Allow: /`.
- `https://blog.iddnexis.com.br/sitemap.xml`, `/rss.xml` e `/llms.txt` abrem.
- No painel, publique um artigo. Em 3 a 5 minutos ele aparece no site.
- O painel não aparece no Google: o `robots.txt` dele bloqueia tudo e as páginas têm `noindex`.

## Limites dos planos grátis

Os limites mudam; confira nas páginas de preço de cada serviço.

- **Cloudflare Pages:** há um limite mensal de builds no plano grátis, folgado para um blog com publicações semanais (várias publicações seguidas viram um build só).
- **Render Free:** as horas grátis são por conta e somadas entre os serviços grátis. O CRM também consome essas horas quando está ligado. Se elas acabarem, o painel fica fora até o mês virar, **mas o site continua no ar**. Nesse caso, o painel pode ir para outro serviço grátis sem mudar o código.
- **Neon:** o banco grátis dorme sem uso e acorda sozinho. Isso não afeta o site, só deixa o primeiro acesso ao painel um pouco mais lento.
