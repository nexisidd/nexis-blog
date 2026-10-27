import { revalidatePath } from 'next/cache'
import type { PayloadRequest } from 'payload'

export const revalidateSecret = () => process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET || ''

// Revalida as páginas públicas afetadas por uma mudança, sem rebuild.
// Dentro de uma requisição (painel, API) chama o Next direto. Fora dela (publicação agendada,
// que roda na fila de jobs) o revalidatePath não tem efeito, então chama a rota interna /next/revalidate.
export const revalidatePaths = (paths: string[], req?: PayloadRequest) => {
  if (req?.context?.disableRevalidate) return
  const unique = [...new Set(paths)]
  const inRequest = Boolean(req?.headers?.get('host'))

  if (!inRequest) {
    const port = process.env.PORT || '3000'
    void fetch(`http://127.0.0.1:${port}/next/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${revalidateSecret()}` },
      body: JSON.stringify({ paths: unique }),
    })
      .then((res) => req?.payload.logger.info(`Revalidado (job, ${res.status}): ${unique.join(', ')}`))
      .catch((err) => req?.payload.logger.warn(`Revalidação via rota interna falhou: ${(err as Error).message}`))
    return
  }

  try {
    for (const path of unique) revalidatePath(path)
    req?.payload.logger.info(`Revalidado: ${unique.join(', ')}`)
  } catch (err) {
    req?.payload.logger.warn(`Não foi possível revalidar: ${(err as Error).message}`)
  }
}

export const GLOBAL_PATHS = ['/', '/sitemap.xml', '/rss.xml', '/llms.txt']
